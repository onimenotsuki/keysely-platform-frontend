import contentfulClient from './client';
import type { HeroBanner, HeroBannerSkeleton } from './types';

/**
 * Contentful Services
 *
 * Helper functions to fetch content from Contentful CMS.
 * These functions use the Content Delivery API client.
 */

// ============================================
// Hero Banner
// ============================================

/**
 * Get the Hero Banner content
 * Fetches all entries of type 'heroBanner' and returns the first one
 * (assuming you only have one active hero banner at a time)
 */
export const getHeroBanner = async (): Promise<HeroBanner | null> => {
  try {
    // Use getEntries with content_type filter to fetch hero banner entries
    const response = await contentfulClient.getEntries<HeroBannerSkeleton>({
      content_type: 'heroBanner',
      limit: 1, // We only need one hero banner
      order: ['-sys.createdAt'], // Get the most recent one
    });

    // Return the first entry if it exists
    return response.items[0] || null;
  } catch (error) {
    console.error('Error fetching hero banner:', error);
    return null; // Return null on error instead of throwing
  }
};
