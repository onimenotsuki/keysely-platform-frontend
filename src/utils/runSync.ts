/**
 * Simple script to run Algolia sync from browser console
 *
 * To use:
 * 1. Open your app in the browser
 * 2. Open browser console (F12)
 * 3. Import and run: window.syncToAlgolia()
 */

import { clearAlgoliaIndex, reindexAllSpaces, syncExistingSpacesToAlgolia } from './syncToAlgolia';

// Expose functions to window object for console access
declare global {
  interface Window {
    syncToAlgolia: () => Promise<void>;
    clearAlgoliaIndex: () => Promise<void>;
    reindexAllSpaces: () => Promise<void>;
  }
}

window.syncToAlgolia = async () => {
  console.log('🚀 Starting Algolia sync...');
  try {
    const result = await syncExistingSpacesToAlgolia();
    console.log('✅ Sync completed successfully!', result);
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
};

window.clearAlgoliaIndex = async () => {
  const confirmed = confirm(
    '⚠️ Are you sure you want to clear the entire Algolia index? This cannot be undone.'
  );
  if (!confirmed) {
    console.log('Cancelled');
    return;
  }

  try {
    await clearAlgoliaIndex();
    console.log('✅ Index cleared successfully!');
  } catch (error) {
    console.error('❌ Clear failed:', error);
  }
};

window.reindexAllSpaces = async () => {
  const confirmed = confirm('⚠️ This will clear the index and re-sync all spaces. Continue?');
  if (!confirmed) {
    console.log('Cancelled');
    return;
  }

  try {
    await reindexAllSpaces();
    console.log('✅ Re-index completed successfully!');
  } catch (error) {
    console.error('❌ Re-index failed:', error);
  }
};

console.log(`
🔧 Algolia Sync Tools Available:
- window.syncToAlgolia() - Sync all spaces to Algolia
- window.clearAlgoliaIndex() - Clear the Algolia index
- window.reindexAllSpaces() - Clear and re-sync all spaces
`);
