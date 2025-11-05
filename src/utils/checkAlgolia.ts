/**
 * Check if Algolia has indexed data
 * Run from browser console: window.checkAlgolia()
 */

import {
  SPACES_INDEX_NAME,
  algoliaClient,
  isAlgoliaConfigured,
} from '@/integrations/algolia/client';

declare global {
  interface Window {
    checkAlgolia: () => Promise<void>;
  }
}

window.checkAlgolia = async () => {
  console.log('🔍 Checking Algolia...\n');

  if (!isAlgoliaConfigured()) {
    console.log('ℹ️  Algolia is NOT configured');
    console.log('   → This is OK. App will use Supabase for search.');
    return;
  }

  console.log('✅ Algolia is configured');

  try {
    const result = await algoliaClient.searchSingleIndex({
      indexName: SPACES_INDEX_NAME,
      searchParams: {
        query: '',
        filters: 'is_active:true',
        hitsPerPage: 0, // Just get the count
      },
    });

    console.log(`📊 Algolia has ${result.nbHits} indexed spaces\n`);

    if (result.nbHits === 0) {
      console.error('❌ PROBLEM FOUND: Algolia has 0 spaces indexed!');
      console.log('\n🔧 To fix this issue, you have 2 options:\n');

      console.log('Option 1: Sync data to Algolia (Recommended)');
      console.log('   1. Add VITE_ALGOLIA_ADMIN_API_KEY to your .env file');
      console.log('   2. Restart your dev server');
      console.log('   3. Run: await window.syncToAlgolia()');

      console.log('\nOption 2: Disable Algolia temporarily');
      console.log('   → Remove VITE_ALGOLIA_APP_ID from your .env file');
      console.log('   → Restart your dev server');
      console.log('   → App will use Supabase for all searches');

      console.log("\n💡 Quick test: Try going to /explore and DON'T use the map view");
      console.log('   The list view should work because it uses Supabase');
    } else {
      console.log('✅ Algolia is working correctly!');
      console.log(`   ${result.nbHits} spaces are indexed and searchable`);
    }
  } catch (error: unknown) {
    console.error('❌ Error checking Algolia:', error);

    if (error instanceof Error && error.message?.includes('Index')) {
      console.log('\n⚠️  The index might not exist yet');
      console.log('   → Run: await window.syncToAlgolia()');
    }
  }
};

console.log('🔧 Algolia check tool loaded. Run: window.checkAlgolia()');
