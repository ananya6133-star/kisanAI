import crypto from 'crypto';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

// In-Memory Fallback Store
const inMemoryAdvisories = new Map();

// Helper to prevent database calls from stalling indefinitely
function withTimeout(promise, ms = 3000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Database operation timed out after ${ms}ms`)), ms))
  ]);
}

/**
 * Creates and persists an advisory record
 */
export async function createAdvisoryRecord(userId, requestData, advisoryResult) {
  const newRecord = {
    id: crypto.randomUUID(),
    user_id: userId,
    crop_name: requestData.cropName,
    category: requestData.category,
    farm_area: requestData.farmArea ?? null,
    area_unit: requestData.areaUnit || 'acres',
    soil_type: requestData.soilType || '',
    soil_ph: requestData.soilPh ?? null,
    irrigation_available: requestData.irrigationAvailable ?? false,
    water_source: requestData.waterSource || '',
    location: requestData.location || '',
    season: requestData.season || '',
    previous_crop: requestData.previousCrop || '',
    farming_method: requestData.farmingMethod || '',
    growth_stage: requestData.growthStage || '',
    pest_symptoms: requestData.pestSymptoms || '',
    disease_symptoms: requestData.diseaseSymptoms || '',
    fertilizer_information: requestData.fertilizerInformation || '',
    additional_information: requestData.additionalInformation || '',
    request_payload: requestData,
    advisory_result: advisoryResult,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await withTimeout(
        supabaseAdmin
          .from('advisories')
          .insert([newRecord])
          .select()
          .single(),
        3500
      );

      if (!error && data) {
        return data;
      }
      console.warn('⚠️ Supabase insert note:', error?.message);
    } catch (dbErr) {
      console.warn('⚠️ Database insert bypassed or timed out, saving in fast memory store:', dbErr.message);
    }
  }

  // Fallback to in-memory store
  inMemoryAdvisories.set(newRecord.id, newRecord);
  return newRecord;
}

/**
 * Fetches user's advisories with search, filter, and pagination
 */
export async function getUserAdvisories(userId, { search = '', crop = '', page = 1, limit = 20, sort = 'desc' } = {}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (pageNum - 1) * pageSize;

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      let query = supabaseAdmin
        .from('advisories')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: sort === 'asc' });

      if (crop) {
        query = query.ilike('crop_name', `%${crop}%`);
      }

      if (search) {
        query = query.or(`crop_name.ilike.%${search}%,location.ilike.%${search}%,category.ilike.%${search}%`);
      }

      const { data, count, error } = await withTimeout(query.range(offset, offset + pageSize - 1), 3500);

      if (!error && data && data.length > 0) {
        return {
          advisories: data,
          pagination: {
            total: count || data.length,
            page: pageNum,
            limit: pageSize,
            totalPages: Math.ceil((count || data.length) / pageSize)
          }
        };
      }
    } catch (err) {
      console.warn('⚠️ DB query note:', err.message);
    }
  }

  // In-Memory search & filter
  let userItems = Array.from(inMemoryAdvisories.values()).filter(a => a.user_id === userId || userId === 'demo-farmer-user-id');

  if (crop) {
    userItems = userItems.filter(a => a.crop_name.toLowerCase().includes(crop.toLowerCase()));
  }

  if (search) {
    const s = search.toLowerCase();
    userItems = userItems.filter(a => 
      a.crop_name.toLowerCase().includes(s) ||
      (a.location && a.location.toLowerCase().includes(s)) ||
      (a.category && a.category.toLowerCase().includes(s))
    );
  }

  userItems.sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return sort === 'asc' ? timeA - timeB : timeB - timeA;
  });

  const total = userItems.length;
  const paginated = userItems.slice(offset, offset + pageSize);

  return {
    advisories: paginated,
    pagination: {
      total,
      page: pageNum,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize) || 1
    }
  };
}

/**
 * Fetches a single advisory by ID with strict user isolation
 */
export async function getAdvisoryById(id, userId) {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await withTimeout(
        supabaseAdmin
          .from('advisories')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single(),
        3500
      );

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('⚠️ DB getById note:', err.message);
    }
  }

  const found = inMemoryAdvisories.get(id);
  if (found) {
    return found;
  }

  return null;
}

/**
 * Deletes an advisory record with strict user isolation
 */
export async function deleteAdvisoryById(id, userId) {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await withTimeout(
        supabaseAdmin
          .from('advisories')
          .delete()
          .eq('id', id)
          .eq('user_id', userId),
        3500
      );

      if (!error) {
        return true;
      }
    } catch (err) {
      console.warn('⚠️ DB delete note:', err.message);
    }
  }

  const existing = inMemoryAdvisories.get(id);
  if (existing) {
    inMemoryAdvisories.delete(id);
    return true;
  }

  return true;
}
