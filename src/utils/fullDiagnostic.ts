/**
 * Complete diagnostic tool to identify why the map is not working
 * Run from browser console: window.fullDiagnostic()
 */

import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    fullDiagnostic: () => Promise<void>;
  }
}

window.fullDiagnostic = async () => {
  console.log('🔍 Starting Full Diagnostic...\n');

  // 1. Check Google Maps API Key
  console.log('1️⃣ Checking Google Maps Configuration:');
  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!googleMapsKey || googleMapsKey === '') {
    console.error('❌ VITE_GOOGLE_MAPS_API_KEY is not set!');
    console.log('   → Add it to your .env file');
  } else {
    console.log('✅ Google Maps API Key is configured');
    console.log(`   Key: ${googleMapsKey.substring(0, 10)}...`);
  }

  // 2. Check if Google Maps loaded
  console.log('\n2️⃣ Checking Google Maps Script:');
  if (typeof window.google !== 'undefined' && window.google.maps) {
    console.log('✅ Google Maps script loaded successfully');
  } else {
    console.error('❌ Google Maps script NOT loaded!');
    console.log('   → Check your API key and network connection');
  }

  // 3. Check Spaces in Database
  console.log('\n3️⃣ Checking Spaces in Database:');
  try {
    const { data: allSpaces, error: allError } = await supabase
      .from('spaces')
      .select('id, title, is_active, city, latitude, longitude, created_at');

    if (allError) {
      console.error('❌ Error fetching spaces:', allError);
      return;
    }

    if (!allSpaces || allSpaces.length === 0) {
      console.error('❌ NO SPACES FOUND in database!');
      console.log('   → Run: await window.seedData()');
      return;
    }

    console.log(`✅ Total spaces in DB: ${allSpaces.length}`);

    const activeSpaces = allSpaces.filter((s) => s.is_active);
    const spacesWithCoords = allSpaces.filter((s) => s.latitude && s.longitude);
    const activeWithCoords = activeSpaces.filter((s) => s.latitude && s.longitude);

    console.log(`   Active: ${activeSpaces.length}`);
    console.log(`   With coordinates: ${spacesWithCoords.length}`);
    console.log(`   Active + Coordinates: ${activeWithCoords.length}`);

    if (activeWithCoords.length === 0) {
      console.error('❌ NO ACTIVE SPACES WITH COORDINATES!');
      console.log('   → Run: await window.fixSpaces()');
      return;
    }

    // Show sample spaces
    console.log('\n📋 Sample of active spaces with coordinates:');
    activeWithCoords.slice(0, 3).forEach((space, idx) => {
      console.log(`   ${idx + 1}. ${space.title}`);
      console.log(`      City: ${space.city || 'N/A'}`);
      console.log(`      Coords: ${space.latitude?.toFixed(4)}, ${space.longitude?.toFixed(4)}`);
      console.log(`      Active: ${space.is_active ? 'Yes' : 'No'}`);
    });
  } catch (error) {
    console.error('❌ Error checking spaces:', error);
  }

  // 4. Check Current Query (what Explore page is fetching)
  console.log('\n4️⃣ Checking Current Query Result:');
  try {
    const { data: queryResult, error: queryError } = await supabase
      .from('spaces')
      .select(
        `
        *,
        categories(name),
        profiles(full_name)
      `
      )
      .eq('is_active', true);

    if (queryError) {
      console.error('❌ Error in current query:', queryError);
      return;
    }

    console.log(`✅ Query returns: ${queryResult?.length || 0} spaces`);

    if (!queryResult || queryResult.length === 0) {
      console.error('❌ Query returns ZERO spaces!');
      console.log('   Possible causes:');
      console.log('   - All spaces are inactive (is_active = false)');
      console.log('   - RLS policies blocking access');
      console.log('   → Try: await window.fixSpaces()');
    }
  } catch (error) {
    console.error('❌ Error in query:', error);
  }

  // 5. Check Authentication
  console.log('\n5️⃣ Checking Authentication:');
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      console.log('✅ User is authenticated');
      console.log(`   User ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
    } else {
      console.log('ℹ️  User is NOT authenticated (this is OK for browsing)');
    }
  } catch (error) {
    console.error('❌ Error checking auth:', error);
  }

  // 6. Check for React Query errors
  console.log('\n6️⃣ Checking React Query State:');
  console.log('   → Open React DevTools and check:');
  console.log('      - Query: ["spaces", {}]');
  console.log('      - Status should be "success"');
  console.log('      - Data should contain spaces array');

  // 7. Check console errors
  console.log('\n7️⃣ Check Browser Console:');
  console.log('   → Look for red errors above');
  console.log('   → Common issues:');
  console.log('      - "RefererNotAllowedMapError" → API key restriction');
  console.log('      - "InvalidKeyMapError" → Wrong API key');
  console.log('      - "Network error" → Check internet connection');

  console.log('\n✅ Diagnostic Complete!');
  console.log('\n📝 Summary of Issues Found:');

  let issuesFound = 0;
  if (!googleMapsKey || googleMapsKey === '') {
    console.log('   ❌ Google Maps API Key not configured');
    issuesFound++;
  }
  if (typeof window.google === 'undefined' || !window.google.maps) {
    console.log('   ❌ Google Maps script not loaded');
    issuesFound++;
  }

  if (issuesFound === 0) {
    console.log('   ✅ No obvious issues detected');
    console.log('   → The problem might be in the React component rendering');
    console.log('   → Check React DevTools for component errors');
  }
};

console.log('🔧 Full diagnostic tool loaded. Run: window.fullDiagnostic()');
