import {
  SPACES_INDEX_NAME,
  algoliaClient,
  isAlgoliaConfigured,
} from '@/integrations/algolia/client';
import type { AlgoliaSpace, SearchFilters } from '@/integrations/algolia/types';
import { useQuery } from '@tanstack/react-query';
import type { Space } from './useSpaces';

const DEFAULT_MAX_PRICE = 1000;
const DEFAULT_HITS_PER_PAGE = 24;

interface AlgoliaSearchParams {
  filters?: string;
  hitsPerPage?: number;
  page?: number;
  insideBoundingBox?: number[][];
}

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

  if (filters.state) {
    filterParts.push(`state:"${filters.state}"`);
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    filterParts.push(`price_per_hour >= ${filters.minPrice}`);
  }

  if (filters.maxPrice !== undefined && filters.maxPrice < DEFAULT_MAX_PRICE) {
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

  return filterParts.join(' AND ');
};

interface UseAlgoliaSearchOptions extends SearchFilters {
  page?: number;
  hitsPerPage?: number;
  enabled?: boolean;
}

export const useAlgoliaSearch = (options: UseAlgoliaSearchOptions = {}) => {
  const {
    searchTerm = '',
    page = 0,
    hitsPerPage = DEFAULT_HITS_PER_PAGE,
    enabled = true,
    ...filters
  } = options;

  // Check if Algolia is configured
  const algoliaEnabled = isAlgoliaConfigured();

  return useQuery({
    queryKey: ['algolia-spaces', searchTerm, filters, page, hitsPerPage],
    queryFn: async () => {
      if (!algoliaEnabled || !algoliaClient) {
        throw new Error('Algolia is not configured');
      }

      const filterString = buildAlgoliaFilters(filters);

      const searchParams: AlgoliaSearchParams = {};

      if (filterString) {
        searchParams.filters = filterString;
      }

      if (filters.mapBounds?.insideBoundingBox) {
        searchParams.insideBoundingBox = [filters.mapBounds.insideBoundingBox];
      }

      if (hitsPerPage !== DEFAULT_HITS_PER_PAGE) {
        searchParams.hitsPerPage = hitsPerPage;
      }

      if (page > 0) {
        searchParams.page = page;
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
    filters.searchTerm ||
    (filters.amenities && filters.amenities.length > 0) ||
    filters.mapBounds
  );
};
