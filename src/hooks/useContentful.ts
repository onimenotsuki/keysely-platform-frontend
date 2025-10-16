import { useQuery } from '@tanstack/react-query';
import { getHeroBanner } from '../integrations/contentful/services';

/**
 * React Query hooks for Contentful CMS
 *
 * These hooks integrate Contentful with TanStack Query for
 * automatic caching, refetching, and state management.
 */

// ============================================
// Hero Banner Hook
// ============================================

/**
 * Hook to fetch the Hero Banner content
 * Returns the active hero banner with CTA and images
 *
 */

export const useHeroBanner = () => {
  return useQuery({
    queryKey: ['contentful', 'heroBanner'],
    queryFn: getHeroBanner,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Retry twice on failure
  });
};
