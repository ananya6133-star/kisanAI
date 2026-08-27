import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Calendar, LogOut, Sprout } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          User Account & Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your farmer account credentials and agricultural preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-2xl shadow-sm">
            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'F'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              {user?.user_metadata?.full_name || 'Agricultural Producer'}
            </h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </CardHeader>

        <CardBody className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Account ID (UUID)</span>
              <p className="text-xs font-mono font-semibold text-slate-800 truncate">{user?.id}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Authentication Type</span>
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Supabase Secure Auth Session</span>
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 font-medium">End current session</p>
              <p className="text-[11px] text-slate-400">You will need to sign in again to access advisories.</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              icon={LogOut}
              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
