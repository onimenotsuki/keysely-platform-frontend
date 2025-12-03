import { usePagination } from '@/hooks/usePagination';
import type { Space } from '@/hooks/useSpaces';
import { useTranslation } from '@/hooks/useTranslation';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import type { MapBounds } from './features/spaces/SearchFilters/types';
import { SpaceCard } from './features/spaces/SpaceCard';
import { InteractiveMap } from './map/InteractiveMap';
import { MapboxProvider, isMapboxConfigured } from './map/MapboxProvider';
import { PaginationControls } from './ui/pagination-controls';

interface MapViewProps {
  spaces: Space[];
  isLoading: boolean;
  onMapBoundsChange?: (bounds: MapBounds) => void;
}

export const MapView = ({ spaces, isLoading, onMapBoundsChange }: MapViewProps) => {
  const { t } = useTranslation();
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const mapsConfigured = isMapboxConfigured();

  // Pagination for results
  const { currentPage, totalPages, paginatedItems, goToPage, startIndex, endIndex, totalItems } =
    usePagination({
      items: spaces,
      itemsPerPage: 12, // 12 items to show 4 rows of 3 columns
    });

  return (
    <div className="flex h-[calc(100vh-150px)] w-full">
      {/* Map Section - Fixed 40vw */}
      <div className="w-[40vw] h-full sticky top-0 shrink-0">
        {mapsConfigured ? (
          <MapboxProvider>
            <InteractiveMap
              spaces={spaces || []}
              onBoundsChange={onMapBoundsChange}
              selectedSpaceId={selectedSpaceId}
              onSpaceSelect={setSelectedSpaceId}
              isLoading={isLoading}
            />
          </MapboxProvider>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('map.notAvailable')}</h3>
              <p className="text-muted-foreground">{t('map.notConfigured')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Results Section - Fixed 60vw with 3 columns */}
      <div className="w-[60vw] h-full overflow-y-auto bg-background shrink-0">
        {isLoading ? (
          <div className="p-6">
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6"></div>
            <div className="columns-3 gap-4 space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-muted animate-pulse rounded-lg break-inside-avoid mb-4"
                ></div>
              ))}
            </div>
          </div>
        ) : spaces.length > 0 ? (
          <div className="p-6">
            {/* Results Counter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                {spaces.length}{' '}
                {spaces.length === 1 ? 'espacio encontrado' : 'espacios encontrados'}
              </h3>
            </div>

            {/* Results Grid - Masonry Layout with 3 Columns */}
            <div className="columns-3 gap-4 mb-6 space-y-4">
              {paginatedItems.map((space) => (
                <div
                  key={space.id}
                  className={`break-inside-avoid mb-4 transition-all ${
                    selectedSpaceId === space.id ? 'ring-2 ring-primary rounded-lg' : ''
                  }`}
                >
                  <SpaceCard
                    space={space}
                    variant="compact"
                    onMouseEnter={() => setSelectedSpaceId(space.id)}
                    onMouseLeave={() => setSelectedSpaceId(null)}
                  />
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
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('noSpacesFound')}</h3>
            <p className="text-muted-foreground max-w-md">
              Intenta ajustar los filtros o buscar en una zona diferente del mapa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
