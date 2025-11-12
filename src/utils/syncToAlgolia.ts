import {
  SPACES_INDEX_NAME,
  algoliaAdminClient,
  isAlgoliaAdminConfigured,
} from '@/integrations/algolia/client';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface AlgoliaSpace {
  objectID: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state?: string;
  price_per_hour: number;
  currency: string;
  capacity: number;
  area_sqm?: number;
  images: string[];
  features: string[];
  amenities: string[];
  is_active: boolean;
  rating: number;
  total_reviews: number;
  category_id?: string;
  owner_id: string;
  latitude?: number;
  longitude?: number;
  _geoloc?: {
    lat: number;
    lng: number;
  };
}

/**
 * Syncs all existing spaces from Supabase to Algolia
 * This is useful for initial data migration or re-indexing
 */
export async function syncExistingSpacesToAlgolia() {
  try {
    // Check if Algolia Admin is configured
    if (!isAlgoliaAdminConfigured()) {
      throw new Error(
        'Algolia Admin is not configured. Please set VITE_ALGOLIA_APP_ID and VITE_ALGOLIA_ADMIN_API_KEY in your .env file'
      );
    }

    console.log('🔍 Fetching spaces from Supabase...');

    // Fetch all spaces from Supabase
    const { data: spaces, error } = await supabase.from('spaces').select('*').eq('is_active', true);

    if (error) {
      throw new Error(`Error fetching spaces: ${error.message}`);
    }

    if (!spaces || spaces.length === 0) {
      console.log('ℹ️ No spaces found to sync');
      return { success: true, count: 0 };
    }

    console.log(`📦 Found ${spaces.length} spaces to sync`);

    // Helper function to safely extract state from address_object
    const extractState = (addressObject: Json | null): string | undefined => {
      if (!addressObject || typeof addressObject !== 'object' || Array.isArray(addressObject)) {
        return undefined;
      }
      const state = (addressObject as Record<string, unknown>).state;
      return typeof state === 'string' && state.length > 0 ? state : undefined;
    };

    // Transform spaces to Algolia format
    const algoliaRecords: AlgoliaSpace[] = spaces.map((space) => {
      // Extract state from address_object if available
      const state = extractState(space.address_object);

      // Extract latitude and longitude - they might be in address_object or as direct fields
      const latitude =
        (space as unknown as { latitude?: number | null }).latitude ??
        (typeof space.address_object === 'object' &&
        space.address_object !== null &&
        !Array.isArray(space.address_object)
          ? ((space.address_object as Record<string, unknown>).latitude as number | undefined)
          : undefined);
      const longitude =
        (space as unknown as { longitude?: number | null }).longitude ??
        (typeof space.address_object === 'object' &&
        space.address_object !== null &&
        !Array.isArray(space.address_object)
          ? ((space.address_object as Record<string, unknown>).longitude as number | undefined)
          : undefined);

      const record: AlgoliaSpace = {
        objectID: space.id,
        title: space.title || '',
        description: space.description || '',
        address: space.address || '',
        city: space.city || '',
        state: state,
        price_per_hour: space.price_per_hour || 0,
        currency: space.currency || 'MXN',
        capacity: space.capacity || 1,
        area_sqm: space.area_sqm ?? undefined,
        images: space.images || [],
        features: space.features || [],
        amenities: space.amenities || [],
        is_active: space.is_active ?? true,
        rating: space.rating ?? 0,
        total_reviews: space.total_reviews ?? 0,
        category_id: space.category_id ?? undefined,
        owner_id: space.owner_id,
        latitude: typeof latitude === 'number' ? latitude : undefined,
        longitude: typeof longitude === 'number' ? longitude : undefined,
      };

      // Add geolocation if coordinates are available
      if (typeof latitude === 'number' && typeof longitude === 'number') {
        record._geoloc = {
          lat: latitude,
          lng: longitude,
        };
      }

      return record;
    });

    console.log('⬆️ Uploading to Algolia...');

    // Use Algolia v5 API with Admin API key to save objects
    const response = await algoliaAdminClient.saveObjects({
      indexName: SPACES_INDEX_NAME,
      objects: algoliaRecords as unknown as Record<string, unknown>[],
    });

    console.log('✅ Successfully synced to Algolia!');
    console.log(`📊 Synced ${spaces.length} spaces`);
    console.log('Response:', response);

    return {
      success: true,
      count: spaces.length,
      response,
    };
  } catch (error) {
    console.error('❌ Error syncing to Algolia:', error);
    throw error;
  }
}

/**
 * Clears all records from the Algolia index
 * Use with caution!
 */
export async function clearAlgoliaIndex() {
  try {
    if (!isAlgoliaAdminConfigured()) {
      throw new Error('Algolia Admin is not configured');
    }

    console.log('🗑️ Clearing Algolia index...');

    await algoliaAdminClient.clearObjects({
      indexName: SPACES_INDEX_NAME,
    });

    console.log('✅ Index cleared successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing index:', error);
    throw error;
  }
}

/**
 * Re-indexes all spaces (clears and re-syncs)
 */
export async function reindexAllSpaces() {
  try {
    console.log('🔄 Starting full re-index...');

    // Clear existing index
    await clearAlgoliaIndex();

    // Sync all spaces
    const result = await syncExistingSpacesToAlgolia();

    console.log('✅ Full re-index completed!');
    return result;
  } catch (error) {
    console.error('❌ Error during re-index:', error);
    throw error;
  }
}
