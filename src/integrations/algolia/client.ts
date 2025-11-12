import { algoliasearch, type SearchClient } from 'algoliasearch';

// Initialize Algolia client
// These should be set in your .env file:
// VITE_ALGOLIA_APP_ID
// VITE_ALGOLIA_SEARCH_API_KEY (for search operations)
// VITE_ALGOLIA_ADMIN_API_KEY (for write operations - dev only, use edge functions in production)
const appId = import.meta.env.VITE_ALGOLIA_APP_ID;
const searchApiKey = import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY;
const adminApiKey = import.meta.env.VITE_ALGOLIA_ADMIN_API_KEY;

const hasSearchCredentials =
  typeof appId === 'string' &&
  appId.length > 0 &&
  typeof searchApiKey === 'string' &&
  searchApiKey.length > 0;
const hasAdminCredentials =
  typeof appId === 'string' &&
  appId.length > 0 &&
  typeof adminApiKey === 'string' &&
  adminApiKey.length > 0;

// Use search API key by default for regular searches
export const algoliaClient: SearchClient | null = hasSearchCredentials
  ? algoliasearch(appId, searchApiKey)
  : null;

// Use admin API key for write operations (sync, clear, etc.)
// ⚠️ WARNING: Admin API key should NEVER be used in production frontend code
// This is only for development/testing. Use Supabase Edge Functions for production.
export const algoliaAdminClient: SearchClient | null = hasAdminCredentials
  ? algoliasearch(appId, adminApiKey)
  : null;

// Index name for spaces
export const SPACES_INDEX_NAME = 'spaces';

// Check if Algolia is configured for searches
export const isAlgoliaConfigured = () => {
  return hasSearchCredentials;
};

// Check if Algolia admin is configured for write operations
export const isAlgoliaAdminConfigured = () => {
  return hasAdminCredentials;
};
