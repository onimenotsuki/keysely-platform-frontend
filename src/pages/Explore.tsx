import { MapView } from '@/components/MapView';
import { SearchFilters } from '@/components/features/spaces/SearchFilters';
import type {
  MapBounds,
  SearchFilters as SearchFiltersType,
} from '@/components/features/spaces/SearchFilters/types';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { shouldUseAlgolia, useAlgoliaSearch } from '../hooks/useAlgoliaSearch';
import { useSpaces } from '../hooks/useSpaces';

const Explore = () => {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFiltersType>({
    searchTerm: '',
    categoryId: '',
    city: '',
    minPrice: 0,
    maxPrice: 1000,
    minCapacity: 1,
    amenities: [],
    mapBounds: null,
  });

  // Handle URL search parameters
  useEffect(() => {
    const newFilters: Partial<SearchFiltersType> = {};

    const search = urlSearchParams.get('search');
    if (search) newFilters.searchTerm = search;

    const category = urlSearchParams.get('category');
    if (category) newFilters.categoryId = category;

    const city = urlSearchParams.get('city');
    if (city) newFilters.city = city;

    const minPrice = urlSearchParams.get('minPrice');
    if (minPrice) newFilters.minPrice = Number(minPrice);

    const maxPrice = urlSearchParams.get('maxPrice');
    if (maxPrice) newFilters.maxPrice = Number(maxPrice);

    const capacity = urlSearchParams.get('capacity');
    if (capacity) newFilters.minCapacity = Number(capacity);

    const amenities = urlSearchParams.get('amenities');
    if (amenities) newFilters.amenities = amenities.split(',');

    if (Object.keys(newFilters).length > 0) {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    }
  }, [urlSearchParams]);

  // Decide whether to use Algolia or Supabase
  const useAlgolia = shouldUseAlgolia(filters);

  // Supabase search params
  const supabaseParams = useMemo(() => {
    const params: Record<string, string | number> = {};

    if (filters.searchTerm) params.searchTerm = filters.searchTerm;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.city) params.city = filters.city;
    if (filters.minPrice > 0) params.minPrice = filters.minPrice;
    if (filters.maxPrice < 1000) params.maxPrice = filters.maxPrice;
    if (filters.minCapacity > 1) params.minCapacity = filters.minCapacity;

    return params;
  }, [filters]);

  // Algolia search
  const { data: algoliaData, isLoading: algoliaLoading } = useAlgoliaSearch({
    ...filters,
    enabled: useAlgolia,
  });

  // Supabase search
  const { data: supabaseSpaces, isLoading: supabaseLoading } = useSpaces(supabaseParams);

  // Use the appropriate data source
  const spaces = useAlgolia ? algoliaData?.spaces || [] : supabaseSpaces || [];
  const isLoading = useAlgolia ? algoliaLoading : supabaseLoading;

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);

    // Update URL params for shareable searches
    const params = new URLSearchParams();
    if (newFilters.searchTerm) params.set('search', newFilters.searchTerm);
    if (newFilters.categoryId) params.set('category', newFilters.categoryId);
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice < 1000) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.minCapacity > 1) params.set('capacity', newFilters.minCapacity.toString());
    if (newFilters.amenities && newFilters.amenities.length > 0) {
      params.set('amenities', newFilters.amenities.join(','));
    }

    setUrlSearchParams(params);
  };

  const handleReset = () => {
    const resetFilters: SearchFiltersType = {
      searchTerm: '',
      categoryId: '',
      city: '',
      minPrice: 0,
      maxPrice: 1000,
      minCapacity: 1,
      amenities: [],
      mapBounds: null,
    };
    setFilters(resetFilters);
    setUrlSearchParams(new URLSearchParams());
  };

  const handleMapBoundsChange = (bounds: MapBounds) => {
    setFilters((prev) => ({
      ...prev,
      mapBounds: bounds,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Descubre Espacios Increíbles</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Encuentra el espacio de trabajo perfecto para tu equipo. Oficinas, salas de reuniones
              y más.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Search and Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleReset}
          />
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading && (
            <MapView spaces={[]} isLoading={true} onMapBoundsChange={handleMapBoundsChange} />
          )}

          {!isLoading && spaces && spaces.length > 0 && (
            <MapView spaces={spaces} isLoading={false} onMapBoundsChange={handleMapBoundsChange} />
          )}

          {!isLoading && (!spaces || spaces.length === 0) && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron espacios</h3>
                <p className="text-muted-foreground mb-6">
                  Intenta ajustar tus filtros de búsqueda o explora diferentes criterios.
                </p>
                <Button onClick={handleReset} variant="outline">
                  Limpiar filtros
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Explore;
