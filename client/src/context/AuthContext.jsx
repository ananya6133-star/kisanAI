import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isLiveSupabase } from '../lib/supabase';

const AuthContext = createContext(null);

const LOCAL_STORAGE_USER_KEY = 'kisan_ai_user_session';
const DEMO_USER_UUID = 'a0000000-0000-0000-0000-000000000001';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        if (isLiveSupabase && supabase) {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession?.user || null);
          } else {
            // Check local fallback
            const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                // Ensure UUID format
                if (parsed.user && !parsed.user.id.includes('-')) {
                  parsed.user.id = DEMO_USER_UUID;
                }
                setUser(parsed.user);
                setSession(parsed.session);
              } catch (e) {
                localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
              }
            }
          }

          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (newSession) {
              setSession(newSession);
              setUser(newSession?.user || null);
            }
            setLoading(false);
          });

          setLoading(false);
          return () => subscription.unsubscribe();
        } else {
          // Dev / Demo Auth from LocalStorage
          const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setUser(parsed.user);
              setSession(parsed.session);
            } catch (e) {
              localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            }
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing authentication:', err);
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email, password) => {
    if (isLiveSupabase && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        setUser(data.user);
        setSession(data.session);
        return data;
      } catch (err) {
        console.warn('Live Supabase sign-in note:', err.message);
      }
    }

    // Demo Mode fallback login with valid RFC4122 UUID
    const demoUser = {
      id: DEMO_USER_UUID,
      email: email || 'farmer@kisan.ai',
      user_metadata: {
        full_name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()) || 'Agricultural Producer'
      }
    };
    const demoSession = {
      access_token: 'demo-token-1234567890',
      user: demoUser
    };

    setUser(demoUser);
    setSession(demoSession);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({ user: demoUser, session: demoSession }));
    return { user: demoUser, session: demoSession };
  };

  const register = async (email, password, fullName) => {
    if (isLiveSupabase && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
        setUser(data.user);
        setSession(data.session);
        return data;
      } catch (err) {
        console.warn('Live Supabase sign up note:', err.message);
      }
    }

    // Demo Mode fallback registration with valid UUID
    const demoUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : DEMO_USER_UUID,
      email,
      user_metadata: {
        full_name: fullName || 'Agricultural Producer'
      }
    };
    const demoSession = {
      access_token: `demo-token-${Date.now()}`,
      user: demoUser
    };

    setUser(demoUser);
    setSession(demoSession);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({ user: demoUser, session: demoSession }));
    return { user: demoUser, session: demoSession };
  };

  const logout = async () => {
    if (isLiveSupabase && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const getAccessToken = async () => {
    if (isLiveSupabase && supabase) {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.access_token) {
          return currentSession.access_token;
        }
      } catch (e) {
        // ignore
      }
    }
    if (session?.access_token) {
      return session.access_token;
    }
    return 'demo-token-1234567890';
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      login,
      register,
      logout,
      getAccessToken,
      isAuthenticated: Boolean(user)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
