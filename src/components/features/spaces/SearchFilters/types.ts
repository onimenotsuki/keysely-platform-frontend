export interface SearchFilters {
  searchTerm: string;
  categoryId: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  minCapacity: number;
  checkInDate?: Date;
  checkOutDate?: Date;
}
