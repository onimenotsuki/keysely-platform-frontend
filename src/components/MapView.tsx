import { useState } from 'react';
import { MapPin, List, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SpaceCard } from './features/spaces/SpaceCard';
import type { Space } from '@/hooks/useSpaces';

interface MapViewProps {
  spaces: Space[];
  isLoading: boolean;
}

export const MapView = ({ spaces, isLoading }: MapViewProps) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
            <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-between items-center">
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
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
            disabled
          >
            <MapPin className="w-4 h-4 mr-1" />
            Mapa
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* Map Placeholder */}
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Integración de mapa próximamente</p>
              <p className="text-sm text-muted-foreground">
                Función disponible en la siguiente actualización
              </p>
            </div>
          </div>

          {/* Selected Space Card */}
          {selectedSpace && (
            <Card className="absolute bottom-4 left-4 right-4 max-w-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={
                      selectedSpace.images[0] || '/placeholder.svg?height=60&width=80&text=Space'
                    }
                    alt={selectedSpace.title}
                    className="w-20 h-15 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{selectedSpace.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{selectedSpace.city}</p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="secondary" className="text-xs">
                        ${selectedSpace.price_per_hour}/hr
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>★ {selectedSpace.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
