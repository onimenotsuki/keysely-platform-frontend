export interface MapBounds {
  ne: {
    lat: number;
    lng: number;
  };
  sw: {
    lat: number;
    lng: number;
  };
}

export interface SearchFilters {
  searchTerm: string;
  categoryId: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  minCapacity: number;
  checkInDate?: Date;
  checkOutDate?: Date;
  amenities: string[];
  availableFrom?: Date;
  availableTo?: Date;
  mapBounds?: MapBounds | null;
}
