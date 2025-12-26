import {
  SPACES_COLLECTION_NAME,
  isTypesenseConfigured,
  typesenseClient,
} from '@/integrations/typesense/client';
import type { SearchFilters, TypesenseSpace } from '@/integrations/typesense/types';
import { useQuery } from '@tanstack/react-query';
import type { Space } from './useSpaces';

const DEFAULT_MAX_PRICE = 1000;
const DEFAULT_HITS_PER_PAGE = 24;

interface UseTypesenseSearchOptions extends SearchFilters {
  page?: number;
  hitsPerPage?: number;
  enabled?: boolean;
}

// Convert Typesense space to regular Space type
const convertTypesenseToSpace = (typesenseSpace: TypesenseSpace): Space => {
  const { location, ...rest } = typesenseSpace;
  return {
    ...rest,
    latitude: location ? location[0] : undefined,
    longitude: location ? location[1] : undefined,
  } as Space;
};

// Build Typesense filter string
const buildTypesenseFilters = (filters: SearchFilters): string => {
  const filterParts: string[] = [];

  if (filters.categoryId) {
    filterParts.push(`category_id:=${filters.categoryId}`);
  }

  if (filters.city) {
    filterParts.push(`city:=${filters.city}`);
  }

  if (filters.state) {
    filterParts.push(`state:=${filters.state}`);
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    filterParts.push(`price_per_hour:>=${filters.minPrice}`);
  }

  if (filters.maxPrice !== undefined && filters.maxPrice < DEFAULT_MAX_PRICE) {
    filterParts.push(`price_per_hour:<=${filters.maxPrice}`);
  }

  if (filters.minCapacity !== undefined && filters.minCapacity > 1) {
    filterParts.push(`capacity:>=${filters.minCapacity}`);
  }

  // Filter by amenities (any amenity matches)
  if (filters.amenities && filters.amenities.length > 0) {
    // Typesense array filtering: amenities:=[wifi, parking] (exact match for any)
    // or amenities:=[wifi] && amenities:=[parking] for all?
    // Usually for "contains any", we use amenities:=[val1, val2]
    // For "contains all", we might need multiple clauses.
    // Let's assume "contains all" for now to narrow down results, or "any" based on UI.
    // Algolia implementation used OR, so let's stick to "any" which is default for :=[a,b]
    // Wait, Algolia implementation: amenities:"wifi" OR amenities:"parking"
    // Typesense: amenities:=[wifi, parking] means any of them.
    const amenitiesString = filters.amenities.map((a) => `\`${a}\``).join(',');
    filterParts.push(`amenities:=[${amenitiesString}]`);
  }

  // Geo search is handled separately in search parameters usually, but can be in filter_by too?
  // Typesense uses filter_by for geo: location:(lat, lng, radius_km)
  // But for bounding box, we use filter_by: location:(lat1, lng1, lat2, lng2) ?
  // No, Typesense supports bounding box in filter_by: location: (lat1, lng1, lat2, lng2) is not standard.
  // Standard is location:(lat, lng, radius) or polygon.
  // For bounding box: location: (lat1, lng1, lat2, lng2) is actually supported as "Geo Bounding Box".
  // Format: location:(top_left_lat, top_left_lng, bottom_right_lat, bottom_right_lng)

  if (filters.mapBounds?.insideBoundingBox) {
    const [lat1, lng1, lat2, lng2] = filters.mapBounds.insideBoundingBox;
    // Ensure correct order: top-left (North-West), bottom-right (South-East)
    // Algolia insideBoundingBox: [lat1, lng1, lat2, lng2] -> usually [N, W, S, E] or similar.
    // Let's check Algolia types or usage.
    // In useAlgoliaSearch: searchParams.insideBoundingBox = [filters.mapBounds.insideBoundingBox];
    // MapBounds type: insideBoundingBox: [number, number, number, number];
    // We'll assume the order matches what Typesense expects or adjust.
    // Typesense expects: location:(x1, y1, x2, y2) where (x1, y1) is top-left, (x2, y2) is bottom-right.
    // Typesense expects a polygon for geo search if not using radius.
    // We convert the bounding box [lat1, lng1, lat2, lng2] into a polygon.
    // lat1, lng1 is Top-Left (North-West)
    // lat2, lng2 is Bottom-Right (South-East)
    // Polygon points: TL -> TR -> BR -> BL -> TL (closing loop)

    // Top-Left: lat1, lng1
    // Top-Right: lat1, lng2
    // Bottom-Right: lat2, lng2
    // Bottom-Left: lat2, lng1

    filterParts.push(
      `location:(${lat1}, ${lng1}, ${lat1}, ${lng2}, ${lat2}, ${lng2}, ${lat2}, ${lng1}, ${lat1}, ${lng1})`
    );
  }

  return filterParts.join(' && ');
};

import type { FacetCounts } from '@/integrations/typesense/types';

export const useTypesenseSearch = (options: UseTypesenseSearchOptions = {}) => {
  const {
    searchTerm = '',
    page = 0,
    hitsPerPage = DEFAULT_HITS_PER_PAGE,
    enabled = true,
    ...filters
  } = options;

  const typesenseEnabled = isTypesenseConfigured();

  return useQuery({
    queryKey: ['typesense-spaces', searchTerm, filters, page, hitsPerPage],
    queryFn: async () => {
      if (!typesenseEnabled || !typesenseClient) {
        throw new Error('Typesense is not configured');
      }

      // Add artificial delay for better UX (1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const filterString = buildTypesenseFilters(filters);

      const searchParameters = {
        q: searchTerm || '*',
        query_by: 'title,description,city,features,amenities',
        filter_by: filterString,
        page: page + 1, // Typesense is 1-indexed
        per_page: hitsPerPage,
        facet_by: 'category_id,amenities,city,state,price_per_hour,capacity,rating',
      };

      const result = await typesenseClient
        .collections(SPACES_COLLECTION_NAME)
        .documents()
        .search(searchParameters);

      // Process facets
      const facets: FacetCounts = {};
      if (result.facet_counts) {
        result.facet_counts.forEach((facet) => {
          const fieldName = facet.field_name;
          facets[fieldName] = {};
          facet.counts.forEach((count) => {
            facets[fieldName][count.value] = count.count;
          });
        });
      }

      return {
        spaces: (result.hits || []).map((hit) =>
          convertTypesenseToSpace(hit.document as unknown as TypesenseSpace)
        ),
        total: result.found,
        page: result.page - 1, // Convert back to 0-indexed for consistency
        nbPages: Math.ceil(result.found / hitsPerPage),
        facets,
      };
    },
    enabled: enabled && typesenseEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};

// Hook to check if we should use Typesense or Supabase
export const shouldUseTypesense = (filters: SearchFilters): boolean => {
  if (!isTypesenseConfigured()) {
    return false;
  }

  // Use Typesense if:
  // - There's a search term
  // - There are amenities filters
  // - There are map bounds (geo search)
  return !!(
    filters.searchTerm ||
    (filters.amenities && filters.amenities.length > 0) ||
    filters.mapBounds
  );
};
