import { MAPBOX_STYLE } from '@/utils/mapboxConfig';
import { useEffect, useMemo, useState } from 'react';
import Map, { Marker, type ViewState } from 'react-map-gl';

interface SpaceLocationMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

/**
 * SpaceLocationMap - A simplified map component for displaying a single location
 * Used in space detail pages to show the exact location of a space
 * Follows the same styling as InteractiveMap for consistency
 */
export const SpaceLocationMap = ({ latitude, longitude, zoom = 14 }: SpaceLocationMapProps) => {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const [viewState, setViewState] = useState<ViewState>({
    latitude,
    longitude,
    zoom,
  });

  const center = useMemo(() => ({ latitude, longitude }), [latitude, longitude]);

  useEffect(() => {
    setViewState((prev) => ({
      ...prev,
      latitude,
      longitude,
      zoom,
    }));
  }, [latitude, longitude, zoom]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <Map
        mapboxAccessToken={accessToken}
        mapStyle={MAPBOX_STYLE}
        style={{ width: '100%', height: '100%' }}
        viewState={viewState}
        onMove={(event) => setViewState(event.viewState)}
      >
        <Marker latitude={center.latitude} longitude={center.longitude} anchor="bottom">
          <span className="relative flex h-10 w-10 items-center justify-center">
            <span className="absolute h-10 w-10 rounded-full bg-primary opacity-20"></span>
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground border-2 border-white shadow-lg">
              <span className="h-2 w-2 rounded-full bg-white"></span>
            </span>
            <span className="absolute bottom-[-6px] h-3 w-3 rotate-45 bg-primary"></span>
          </span>
        </Marker>
      </Map>
    </div>
  );
};
