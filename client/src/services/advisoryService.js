import { apiRequest } from './api';
import { supabase, isLiveSupabase } from '../lib/supabase';

// UUID validation regex (RFC4122)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DEFAULT_DEMO_UUID = 'a0000000-0000-0000-0000-000000000001';

function sanitizeUUID(id) {
  if (id && UUID_REGEX.test(id)) return id;
  return DEFAULT_DEMO_UUID;
}

export const advisoryService = {
  /**
   * Submit farm details, generate AI advisory, and persist into Supabase & backend
   */
  async createAdvisory(advisoryData, token) {
    // 1. Call Backend API to get validated Gemini AI structured output
    const apiResult = await apiRequest('/advisories', {
      method: 'POST',
      body: JSON.stringify(advisoryData)
    }, token);

    // 2. Direct browser-to-Supabase synchronization
    if (isLiveSupabase && supabase && apiResult.data) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const rawUserId = user?.id || apiResult.data.user_id;
        const validUserId = sanitizeUUID(rawUserId);
        const recordId = sanitizeUUID(apiResult.data.id);

        const recordToStore = {
          id: recordId,
          user_id: validUserId,
          crop_name: advisoryData.cropName,
          category: advisoryData.category,
          farm_area: advisoryData.farmArea ?? null,
          area_unit: advisoryData.areaUnit || 'acres',
          soil_type: advisoryData.soilType || '',
          soil_ph: advisoryData.soilPh ?? null,
          irrigation_available: advisoryData.irrigationAvailable ?? false,
          water_source: advisoryData.waterSource || '',
          location: advisoryData.location || '',
          season: advisoryData.season || '',
          previous_crop: advisoryData.previousCrop || '',
          farming_method: advisoryData.farmingMethod || '',
          growth_stage: advisoryData.growthStage || '',
          pest_symptoms: advisoryData.pestSymptoms || '',
          disease_symptoms: advisoryData.diseaseSymptoms || '',
          fertilizer_information: advisoryData.fertilizerInformation || '',
          additional_information: advisoryData.additionalInformation || '',
          request_payload: advisoryData,
          advisory_result: apiResult.data.advisory_result,
          created_at: apiResult.data.created_at || new Date().toISOString(),
          updated_at: apiResult.data.updated_at || new Date().toISOString()
        };

        const { error } = await supabase
          .from('advisories')
          .upsert([recordToStore]);

        if (error) {
          console.warn('Direct Supabase browser insert note:', error.message);
        } else {
          console.log('✅ Successfully persisted advisory into Supabase PostgreSQL table!');
        }
      } catch (err) {
        console.warn('Browser Supabase direct insert warning:', err.message);
      }
    }

    return apiResult;
  },

  /**
   * Fetch user's advisory history with search, filtering & pagination
   */
  async getAdvisories({ search = '', crop = '', page = 1, limit = 20, sort = 'desc' } = {}, token) {
    // Check browser Supabase first
    if (isLiveSupabase && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const validUserId = sanitizeUUID(user?.id);

        let query = supabase
          .from('advisories')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: sort === 'asc' });

        if (user?.id) {
          query = query.eq('user_id', validUserId);
        }

        if (crop) {
          query = query.ilike('crop_name', `%${crop}%`);
        }
        if (search) {
          query = query.or(`crop_name.ilike.%${search}%,location.ilike.%${search}%,category.ilike.%${search}%`);
        }

        const { data, count, error } = await query;
        if (!error && data && data.length > 0) {
          return {
            data,
            pagination: {
              total: count || data.length,
              page: 1,
              limit: data.length,
              totalPages: 1
            }
          };
        }
      } catch (e) {
        // fallback to api
      }
    }

    // Fallback to Express backend API
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (crop) params.append('crop', crop);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (sort) params.append('sort', sort);

    const queryString = params.toString();
    return apiRequest(`/advisories${queryString ? `?${queryString}` : ''}`, {
      method: 'GET'
    }, token);
  },

  /**
   * Fetch single advisory by ID
   */
  async getAdvisoryById(id, token) {
    if (isLiveSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('advisories')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      } catch (e) {
        // fallback to api
      }
    }

    return apiRequest(`/advisories/${id}`, {
      method: 'GET'
    }, token);
  },

  /**
   * Delete single advisory by ID
   */
  async deleteAdvisory(id, token) {
    if (isLiveSupabase && supabase) {
      try {
        await supabase.from('advisories').delete().eq('id', id);
      } catch (e) {
        // ignore
      }
    }

    return apiRequest(`/advisories/${id}`, {
      method: 'DELETE'
    }, token);
  },

  /**
   * Check API health
   */
  async checkHealth() {
    return apiRequest('/health', {
      method: 'GET'
    });
  }
};
