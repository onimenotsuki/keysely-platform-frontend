import {
  SPACES_INDEX_NAME,
  algoliaClient,
  isAlgoliaConfigured,
} from '@/integrations/algolia/client';
import type { AlgoliaSpace, MapBounds, SearchFilters } from '@/integrations/algolia/types';
import { useQuery } from '@tanstack/react-query';
import type { Space } from './useSpaces';

// Convert Algolia space to regular Space type
const convertAlgoliaToSpace = (algoliaSpace: AlgoliaSpace): Space => {
  const { objectID, _geoloc, ...rest } = algoliaSpace;
  return {
    ...rest,
    id: objectID,
  } as Space;
};

// Build Algolia filter string from filters
const buildAlgoliaFilters = (filters: SearchFilters): string => {
  const filterParts: string[] = [];

  if (filters.categoryId) {
    filterParts.push(`category_id:"${filters.categoryId}"`);
  }

  if (filters.city) {
    filterParts.push(`city:"${filters.city}"`);
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    filterParts.push(`price_per_hour >= ${filters.minPrice}`);
  }

  if (filters.maxPrice !== undefined && filters.maxPrice < 10000) {
    filterParts.push(`price_per_hour <= ${filters.maxPrice}`);
  }

  if (filters.minCapacity !== undefined && filters.minCapacity > 1) {
    filterParts.push(`capacity >= ${filters.minCapacity}`);
  }

  // Filter by amenities (any amenity matches)
  if (filters.amenities && filters.amenities.length > 0) {
    const amenitiesFilter = filters.amenities
      .map((amenity) => `amenities:"${amenity}"`)
      .join(' OR ');
    filterParts.push(`(${amenitiesFilter})`);
  }

  // Always filter active spaces
  filterParts.push('is_active:true');

  return filterParts.join(' AND ');
};

// Convert map bounds to Algolia insideBoundingBox format
const mapBoundsToAlgolia = (bounds: MapBounds): number[][] => {
  return [[bounds.ne.lat, bounds.ne.lng, bounds.sw.lat, bounds.sw.lng]];
};

interface UseAlgoliaSearchOptions extends SearchFilters {
  page?: number;
  hitsPerPage?: number;
  enabled?: boolean;
}

export const useAlgoliaSearch = (options: UseAlgoliaSearchOptions = {}) => {
  const { searchTerm = '', page = 0, hitsPerPage = 24, enabled = true, ...filters } = options;

  // Check if Algolia is configured
  const algoliaEnabled = isAlgoliaConfigured();

  return useQuery({
    queryKey: ['algolia-spaces', searchTerm, filters, page, hitsPerPage],
    queryFn: async () => {
      if (!algoliaEnabled) {
        throw new Error('Algolia is not configured');
      }

      interface AlgoliaSearchParams {
        filters: string;
        hitsPerPage: number;
        page: number;
        insideBoundingBox?: number[][];
      }

      const searchParams: AlgoliaSearchParams = {
        filters: buildAlgoliaFilters(filters),
        hitsPerPage,
        page,
      };

      // Add geo search if map bounds are provided
      if (filters.mapBounds) {
        searchParams.insideBoundingBox = mapBoundsToAlgolia(filters.mapBounds);
      }

      const result = await algoliaClient.searchSingleIndex({
        indexName: SPACES_INDEX_NAME,
        searchParams: {
          query: searchTerm,
          ...searchParams,
        },
      });

      return {
        spaces: result.hits.map((hit) => convertAlgoliaToSpace(hit as AlgoliaSpace)),
        total: result.nbHits,
        page: result.page,
        nbPages: result.nbPages,
      };
    },
    enabled: enabled && algoliaEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to check if we should use Algolia or Supabase
export const shouldUseAlgolia = (filters: SearchFilters): boolean => {
  if (!isAlgoliaConfigured()) {
    return false;
  }

  // Use Algolia if:
  // - There's a search term
  // - There are amenities filters
  // - There are map bounds (geo search)
  return !!(
    (filters.searchTerm || (filters.amenities && filters.amenities.length > 0))
    // Temporarily disabled map bounds to prevent using Algolia for geo-search
    // || filters.mapBounds
  );
};
