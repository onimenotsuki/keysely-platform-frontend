/**
 * Debug utility to check spaces in the database
 * Run from browser console: window.debugSpaces()
 */

import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    debugSpaces: () => Promise<void>;
  }
}

window.debugSpaces = async () => {
  console.log('🔍 Debugging spaces...');

  try {
    // Check total spaces
    const { data: allSpaces, error: allError } = await supabase
      .from('spaces')
      .select('id, title, is_active, city, latitude, longitude');

    if (allError) {
      console.error('❌ Error fetching all spaces:', allError);
      return;
    }

    console.log(`📊 Total spaces in DB: ${allSpaces?.length || 0}`);

    if (allSpaces && allSpaces.length > 0) {
      const activeSpaces = allSpaces.filter((s) => s.is_active);
      const inactiveSpaces = allSpaces.filter((s) => !s.is_active);
      const withCoords = allSpaces.filter((s) => s.latitude && s.longitude);

      console.log(`✅ Active spaces: ${activeSpaces.length}`);
      console.log(`❌ Inactive spaces: ${inactiveSpaces.length}`);
      console.log(`📍 Spaces with coordinates: ${withCoords.length}`);

      console.log('\n📋 First 3 spaces:');
      allSpaces.slice(0, 3).forEach((space) => {
        console.log({
          id: space.id,
          title: space.title,
          is_active: space.is_active,
          city: space.city,
          has_coords: !!(space.latitude && space.longitude),
          coords:
            space.latitude && space.longitude
              ? `${space.latitude}, ${space.longitude}`
              : 'No coordinates',
        });
      });
    }

    // Check what the query in useSpaces returns
    const { data: activeSpaces, error: activeError } = await supabase
      .from('spaces')
      .select('*')
      .eq('is_active', true);

    if (activeError) {
      console.error('❌ Error fetching active spaces:', activeError);
      return;
    }

    console.log(`\n🔎 Query result (active spaces only): ${activeSpaces?.length || 0}`);
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
};

console.log('🔧 Debug tool loaded. Run: window.debugSpaces()');
