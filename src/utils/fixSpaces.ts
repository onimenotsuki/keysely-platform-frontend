/**
 * Fix spaces: activate them and add random coordinates from Mexican cities
 * Run from browser console: window.fixSpaces()
 */

import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    fixSpaces: () => Promise<void>;
  }
}

// Random coordinates from major Mexican cities
const mexicanCitiesCoordinates = [
  // Ciudad de México
  { city: 'Ciudad de México', lat: 19.4326, lng: -99.1332 },
  { city: 'Ciudad de México', lat: 19.4284, lng: -99.1276 },
  { city: 'Ciudad de México', lat: 19.4363, lng: -99.1414 },
  { city: 'Ciudad de México', lat: 19.4205, lng: -99.139 },

  // Guadalajara
  { city: 'Guadalajara', lat: 20.6597, lng: -103.3496 },
  { city: 'Guadalajara', lat: 20.6736, lng: -103.3444 },
  { city: 'Guadalajara', lat: 20.658, lng: -103.3259 },

  // Monterrey
  { city: 'Monterrey', lat: 25.6866, lng: -100.3161 },
  { city: 'Monterrey', lat: 25.6714, lng: -100.3089 },
  { city: 'Monterrey', lat: 25.6488, lng: -100.2894 },

  // Puebla
  { city: 'Puebla', lat: 19.0414, lng: -98.2063 },
  { city: 'Puebla', lat: 19.0376, lng: -98.1983 },

  // Querétaro
  { city: 'Querétaro', lat: 20.5888, lng: -100.3899 },
  { city: 'Querétaro', lat: 20.5931, lng: -100.3925 },

  // Mérida
  { city: 'Mérida', lat: 20.9674, lng: -89.6244 },
  { city: 'Mérida', lat: 20.9719, lng: -89.6147 },

  // Cancún
  { city: 'Cancún', lat: 21.1619, lng: -86.8515 },
  { city: 'Cancún', lat: 21.1743, lng: -86.8466 },

  // Tijuana
  { city: 'Tijuana', lat: 32.5149, lng: -117.0382 },

  // León
  { city: 'León', lat: 21.1236, lng: -101.6827 },

  // Toluca
  { city: 'Toluca', lat: 19.2926, lng: -99.6568 },
];

// Helper function to get random coordinates
const getRandomCoordinates = () => {
  const coords =
    mexicanCitiesCoordinates[Math.floor(Math.random() * mexicanCitiesCoordinates.length)];
  // Add small random variation (about 0.01 degrees = ~1km)
  return {
    city: coords.city,
    latitude: coords.lat + (Math.random() - 0.5) * 0.02,
    longitude: coords.lng + (Math.random() - 0.5) * 0.02,
  };
};

window.fixSpaces = async () => {
  console.log('🔧 Starting to fix spaces...');

  try {
    // 1. Fetch all spaces
    const { data: spaces, error: fetchError } = await supabase
      .from('spaces')
      .select('id, title, is_active, city, latitude, longitude');

    if (fetchError) {
      console.error('❌ Error fetching spaces:', fetchError);
      return;
    }

    if (!spaces || spaces.length === 0) {
      console.log('⚠️ No spaces found in database');
      return;
    }

    console.log(`📊 Found ${spaces.length} spaces to fix`);

    // 2. Update each space
    let updated = 0;
    let errors = 0;

    for (const space of spaces) {
      const coords = getRandomCoordinates();

      const updates: {
        is_active: boolean;
        latitude: number;
        longitude: number;
        city?: string;
      } = {
        is_active: true,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      // Update city if it's empty or doesn't match
      if (!space.city || space.city.trim() === '') {
        updates.city = coords.city;
      }

      const { error: updateError } = await supabase
        .from('spaces')
        .update(updates)
        .eq('id', space.id);

      if (updateError) {
        console.error(`❌ Error updating space ${space.title}:`, updateError);
        errors++;
      } else {
        console.log(
          `✅ Updated: ${space.title} → ${coords.city} (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`
        );
        updated++;
      }
    }

    console.log('\n🎉 Fix completed!');
    console.log(`✅ Successfully updated: ${updated} spaces`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} spaces`);
    }
    console.log('\n🔄 Please refresh the page to see the changes');
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
};

console.log('🔧 Fix tool loaded. Run: window.fixSpaces()');
