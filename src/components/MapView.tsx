import { Button } from '@/components/ui/button';
import { usePagination } from '@/hooks/usePagination';
import type { Space } from '@/hooks/useSpaces';
import { List, MapPin } from 'lucide-react';
import { useState } from 'react';
import type { MapBounds } from './features/spaces/SearchFilters/types';
import { SpaceCard } from './features/spaces/SpaceCard';
import { GoogleMapProvider, isGoogleMapsConfigured } from './map/GoogleMapView';
import { InteractiveMap } from './map/InteractiveMap';
import { PaginationControls } from './ui/pagination-controls';

interface MapViewProps {
  spaces: Space[];
  isLoading: boolean;
  onMapBoundsChange?: (bounds: MapBounds) => void;
}

export const MapView = ({ spaces, isLoading, onMapBoundsChange }: MapViewProps) => {
  const [viewMode, setViewMode] = useState<'split' | 'list'>('split');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const mapsConfigured = isGoogleMapsConfigured();

  // Pagination for list view
  const { currentPage, totalPages, paginatedItems, goToPage, startIndex, endIndex, totalItems } =
    usePagination({
      items: spaces,
      itemsPerPage: 24,
    });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
            <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {spaces.length} {spaces.length === 1 ? 'espacio encontrado' : 'espacios encontrados'}
        </h3>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-1" />
            Lista
          </Button>
          {mapsConfigured && (
            <Button
              variant={viewMode === 'split' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('split')}
            >
              <MapPin className="w-4 h-4 mr-1" />
              Mapa
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
          />
        </>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-300px)] min-h-[600px]">
          {/* Map Section - Left Side */}
          <div className="w-full lg:w-1/2 h-full rounded-lg overflow-hidden border">
            <GoogleMapProvider>
              <InteractiveMap
                spaces={spaces}
                onBoundsChange={onMapBoundsChange}
                selectedSpaceId={selectedSpaceId}
                onSpaceSelect={setSelectedSpaceId}
              />
            </GoogleMapProvider>
          </div>

          {/* Results Section - Right Side */}
          <div className="w-full lg:w-1/2 h-full overflow-y-auto">
            <div className="space-y-4">
              {paginatedItems.map((space) => (
                <div
                  key={space.id}
                  className={`transition-all ${
                    selectedSpaceId === space.id ? 'ring-2 ring-primary rounded-lg' : ''
                  }`}
                  onMouseEnter={() => setSelectedSpaceId(space.id)}
                  onMouseLeave={() => setSelectedSpaceId(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedSpaceId(space.id);
                    }
                  }}
                >
                  <SpaceCard space={space} />
                </div>
              ))}
            </div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
            />
          </div>
        </div>
      )}
    </div>
  );
};
