import { createClient } from 'contentful';

/**
 * Contentful CMS Client Configuration
 *
 * This client connects to Contentful's Content Delivery API (CDA)
 * for fetching published content.
 *
 * @see https://www.contentful.com/developers/docs/references/content-delivery-api/
 */

// Validate required environment variables
const CONTENTFUL_SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_ENVIRONMENT = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  console.warn(
    '⚠️ Contentful credentials are missing. Please add VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN to your .env file.'
  );
}

/**
 * Contentful Content Delivery API Client
 *
 * This client is used to fetch published content from Contentful.
 * For preview/draft content, use the Preview API client instead.
 */
export const contentfulClient = createClient({
  space: CONTENTFUL_SPACE_ID || '',
  accessToken: CONTENTFUL_ACCESS_TOKEN || '',
  environment: CONTENTFUL_ENVIRONMENT,
  host: 'cdn.contentful.com', // Content Delivery API (CDA)
});

/**
 * Contentful Preview API Client (Optional)
 *
 * Use this client to fetch draft/unpublished content for preview purposes.
 * Requires a different access token (Preview API Token).
 */
export const contentfulPreviewClient = createClient({
  space: CONTENTFUL_SPACE_ID || '',
  accessToken: import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN || '',
  environment: CONTENTFUL_ENVIRONMENT,
  host: 'preview.contentful.com', // Preview API
});

/**
 * Helper function to determine which client to use
 */
export const getContentfulClient = (preview = false) => {
  return preview ? contentfulPreviewClient : contentfulClient;
};

export default contentfulClient;
