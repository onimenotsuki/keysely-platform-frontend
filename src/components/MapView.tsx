import { usePagination } from '@/hooks/usePagination';
import type { Space } from '@/hooks/useSpaces';
import { MapPin } from 'lucide-react';
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
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const mapsConfigured = isGoogleMapsConfigured();

  // Pagination for results
  const { currentPage, totalPages, paginatedItems, goToPage, startIndex, endIndex, totalItems } =
    usePagination({
      items: spaces,
      itemsPerPage: 12, // 12 items to show 4 rows of 3 columns
    });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-300px)] min-h-[600px]">
        {/* Map Loading Skeleton - 40vw */}
        <div className="w-[40vw] h-full bg-muted animate-pulse"></div>

        {/* Results Loading Skeleton - 60vw */}
        <div className="w-[60vw] h-full overflow-hidden p-6 bg-background">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-300px)] min-h-[600px]">
      {/* Map Section - Fixed 40vw */}
      <div className="w-[40vw] h-full sticky top-0">
        {mapsConfigured ? (
          <GoogleMapProvider>
            <InteractiveMap
              spaces={spaces}
              onBoundsChange={onMapBoundsChange}
              selectedSpaceId={selectedSpaceId}
              onSpaceSelect={setSelectedSpaceId}
            />
          </GoogleMapProvider>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Mapa no disponible</h3>
              <p className="text-muted-foreground">Google Maps no está configurado</p>
            </div>
          </div>
        )}
      </div>

      {/* Results Section - Fixed 60vw with 3 columns */}
      <div className="w-[60vw] h-full overflow-y-auto bg-background">
        <div className="p-6">
          {/* Results Counter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              {spaces.length} {spaces.length === 1 ? 'espacio encontrado' : 'espacios encontrados'}
            </h3>
          </div>

          {/* Results Grid - 3 Columns */}
          <div className="grid grid-cols-3 gap-4 mb-6">
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
                <SpaceCard space={space} variant="compact" />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
            />
          )}
        </div>
      </div>
    </div>
  );
};
