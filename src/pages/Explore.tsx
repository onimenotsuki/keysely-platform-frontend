import { MapView } from '@/components/MapView';

import { SearchFilters, SearchFiltersType } from '@/components/features/spaces/SearchFilters';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SpaceCard } from '../components/features/spaces/SpaceCard';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { useSpaces } from '../hooks/useSpaces';

const Explore = () => {
  const [urlSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFiltersType>({
    searchTerm: '',
    categoryId: '',
    city: '',
    minPrice: 0,
    maxPrice: 1000,
    minCapacity: 1,
  });

  // Handle URL search parameters
  useEffect(() => {
    const searchFromUrl = urlSearchParams.get('search');
    if (searchFromUrl) {
      setFilters((prev) => ({
        ...prev,
        searchTerm: searchFromUrl,
      }));
    }
  }, [urlSearchParams]);

  const searchParams = useMemo(() => {
    const params: Record<string, string | number> = {};

    if (filters.searchTerm) params.searchTerm = filters.searchTerm;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.city) params.city = filters.city;
    if (filters.minPrice > 0) params.minPrice = filters.minPrice;
    if (filters.maxPrice < 1000) params.maxPrice = filters.maxPrice;
    if (filters.minCapacity > 1) params.minCapacity = filters.minCapacity;

    return params;
  }, [filters]);

  const { data: spaces, isLoading } = useSpaces(searchParams);

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      categoryId: '',
      city: '',
      minPrice: 0,
      maxPrice: 1000,
      minCapacity: 1,
    });
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
          {isLoading ? (
            <MapView spaces={[]} isLoading={true} />
          ) : spaces && spaces.length > 0 ? (
            <MapView spaces={spaces} isLoading={false} />
          ) : (
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
