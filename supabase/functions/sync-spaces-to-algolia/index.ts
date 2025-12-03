import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALGOLIA_APP_ID = Deno.env.get('ALGOLIA_APP_ID') || '';
const ALGOLIA_ADMIN_API_KEY = Deno.env.get('ALGOLIA_ADMIN_API_KEY') || '';
const ALGOLIA_INDEX_NAME = 'spaces';

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

interface SupabaseSpace {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  address_object?: {
    state?: string;
    [key: string]: unknown;
  } | null;
  price_per_hour: number;
  currency: string;
  capacity: number;
  area_sqm?: number;
  images?: string[];
  features?: string[];
  amenities?: string[];
  is_active: boolean;
  rating?: number;
  total_reviews?: number;
  category_id?: string;
  owner_id: string;
  latitude?: number;
  longitude?: number;
}

// Helper function to add/update a record in Algolia
async function indexSpace(space: SupabaseSpace) {
  // Extract state from address_object if available
  const state = space.address_object?.state || undefined;

  const algoliaSpace: AlgoliaSpace = {
    objectID: space.id,
    title: space.title,
    description: space.description,
    address: space.address,
    city: space.city,
    state: state,
    price_per_hour: space.price_per_hour,
    currency: space.currency || 'MXN',
    capacity: space.capacity,
    area_sqm: space.area_sqm,
    images: space.images || [],
    features: space.features || [],
    amenities: space.amenities || [],
    is_active: space.is_active,
    rating: space.rating || 0,
    total_reviews: space.total_reviews || 0,
    category_id: space.category_id,
    owner_id: space.owner_id,
    latitude: space.latitude,
    longitude: space.longitude,
  };

  // Add _geoloc if coordinates are available
  if (space.latitude && space.longitude) {
    algoliaSpace._geoloc = {
      lat: space.latitude,
      lng: space.longitude,
    };
  }

  const url = `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${ALGOLIA_INDEX_NAME}/${space.id}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'X-Algolia-API-Key': ALGOLIA_ADMIN_API_KEY,
      'X-Algolia-Application-Id': ALGOLIA_APP_ID,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(algoliaSpace),
  });

  if (!response.ok) {
    throw new Error(`Failed to index space: ${response.statusText}`);
  }

  return await response.json();
}

// Helper function to delete a record from Algolia
async function deleteSpace(spaceId: string) {
  const url = `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${ALGOLIA_INDEX_NAME}/${spaceId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'X-Algolia-API-Key': ALGOLIA_ADMIN_API_KEY,
      'X-Algolia-Application-Id': ALGOLIA_APP_ID,
    },
  });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Failed to delete space: ${response.statusText}`);
  }

  return response.status === 404 ? { deleted: false } : await response.json();
}

serve(async (req) => {
  try {
    // Check if Algolia is configured
    if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY) {
      console.log('Algolia not configured, skipping sync');
      return new Response(JSON.stringify({ message: 'Algolia not configured' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const payload = await req.json();
    const { type, table, record, old_record } = payload;

    // Only process spaces table
    if (table !== 'spaces') {
      return new Response(JSON.stringify({ message: 'Not a spaces record' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log(`Processing ${type} event for space ${record?.id || old_record?.id}`);

    // Handle different event types
    if (type === 'INSERT' || type === 'UPDATE') {
      await indexSpace(record);
      console.log(`Successfully indexed space ${record.id}`);
    } else if (type === 'DELETE') {
      await deleteSpace(old_record.id);
      console.log(`Successfully deleted space ${old_record.id} from Algolia`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error syncing to Algolia:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
