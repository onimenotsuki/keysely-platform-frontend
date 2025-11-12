import type { Space } from '@/hooks/useSpaces';

// Algolia-specific space type with geolocation
export interface AlgoliaSpace extends Omit<Space, 'id'> {
  objectID: string;
  state?: string;
  _geoloc?: {
    lat: number;
    lng: number;
  };
}

// Search parameters for Algolia
export interface AlgoliaSearchParams {
  query?: string;
  filters?: string;
  aroundLatLng?: string;
  aroundRadius?: number;
  insideBoundingBox?: number[][];
  hitsPerPage?: number;
  page?: number;
}

// Map bounds for geo search
export interface MapBounds {
  ne: {
    lat: number;
    lng: number;
  };
  sw: {
    lat: number;
    lng: number;
  };
  insideBoundingBox: [number, number, number, number];
}

// Search filters compatible with both Algolia and Supabase
export interface SearchFilters {
  searchTerm?: string;
  categoryId?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  amenities?: string[];
  availableFrom?: Date;
  availableTo?: Date;
  mapBounds?: MapBounds | null;
}
