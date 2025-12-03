import type { Space } from '@/hooks/useSpaces';

// Typesense-specific space type
export interface TypesenseSpace extends Omit<Space, 'id'> {
  id: string;
  state?: string;
  location?: [number, number]; // [lat, lng]
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

// Search filters compatible with Typesense
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
