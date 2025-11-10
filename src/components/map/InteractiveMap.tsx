import type { MapBounds } from '@/components/features/spaces/SearchFilters/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import type { Space } from '@/hooks/useSpaces';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils/formatCurrency';
import { MAPBOX_FIT_PADDING, MAPBOX_STYLE } from '@/utils/mapboxConfig';
import { MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, {
  MapRef,
  Marker,
  Popup,
  type ViewState,
  type ViewStateChangeEvent,
} from 'react-map-gl';

interface InteractiveMapProps {
  spaces: Space[];
  onBoundsChange?: (bounds: MapBounds) => void;
  selectedSpaceId?: string | null;
  onSpaceSelect?: (spaceId: string | null) => void;
  showSearchButton?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const createBoundsFromSpaces = (spaces: Space[]) => {
  const bounds = new mapboxgl.LngLatBounds();

  spaces.forEach((space) => {
    if (space.latitude && space.longitude) {
      bounds.extend([space.longitude, space.latitude]);
    }
  });

  return bounds;
};

const areViewStatesEqual = (a: ViewState, b: ViewState) => {
  return (
    a.latitude === b.latitude &&
    a.longitude === b.longitude &&
    a.zoom === b.zoom &&
    (a.pitch ?? 0) === (b.pitch ?? 0) &&
    (a.bearing ?? 0) === (b.bearing ?? 0)
  );
};

const defaultCenter = {
  latitude: 19.4326,
  longitude: -99.1332,
  zoom: 12,
};

export const InteractiveMap = ({
  spaces,
  onBoundsChange,
  selectedSpaceId,
  onSpaceSelect,
  showSearchButton = true,
}: InteractiveMapProps) => {
  const { navigateWithLang } = useLanguageRouting();
  const { t } = useTranslation();
  const mapRef = useRef<MapRef | null>(null);
  const boundsChangedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialBoundsSet = useRef(false);
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const [viewState, setViewState] = useState<ViewState>(defaultCenter);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [showSearchThisArea, setShowSearchThisArea] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        globalThis.alert(`[Mapbox] Geolocation error: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  const disableMapRotation = useCallback(() => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;

    mapInstance.dragRotate?.disable();
    mapInstance.touchZoomRotate?.disableRotation();
  }, []);

  const activeSpaces = useMemo(
    () => spaces.filter((space) => space.latitude && space.longitude),
    [spaces]
  );

  useEffect(() => {
    if (!selectedSpaceId) {
      setSelectedSpace(null);
      return;
    }

    const match = spaces.find((space) => space.id === selectedSpaceId);
    if (match) {
      setSelectedSpace(match);
    }
  }, [selectedSpaceId, spaces]);

  // Fit bounds to show all spaces on initial load
  useEffect(() => {
    if (!mapRef.current || initialBoundsSet.current) return;
    if (activeSpaces.length === 0) return;

    const bounds = createBoundsFromSpaces(activeSpaces);
    if (!bounds.isEmpty()) {
      const mapInstance = mapRef.current.getMap();
      mapInstance.fitBounds(bounds, { padding: MAPBOX_FIT_PADDING, duration: 0 });
      initialBoundsSet.current = true;
    }
  }, [activeSpaces]);

  useEffect(() => {
    if (!location) return;

    setViewState((prev) => {
      const next = {
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      if (areViewStatesEqual(prev, next)) {
        return prev;
      }

      return next;
    });

    initialBoundsSet.current = true;
  }, [location]);

  useEffect(() => {
    return () => {
      if (boundsChangedTimeoutRef.current) {
        clearTimeout(boundsChangedTimeoutRef.current);
      }
    };
  }, []);

  const emitBounds = useCallback(() => {
    if (!mapRef.current || !onBoundsChange) return;

    const map = mapRef.current.getMap();
    const bounds = map.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    onBoundsChange({
      ne: { lat: ne.lat, lng: ne.lng },
      sw: { lat: sw.lat, lng: sw.lng },
    });
    setShowSearchThisArea(false);
  }, [onBoundsChange]);

  const handleMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      const nextViewState = evt.viewState;

      setViewState((prev) => {
        if (areViewStatesEqual(prev, nextViewState)) {
          return prev;
        }

        return nextViewState;
      });

      if (!onBoundsChange) return;

      setShowSearchThisArea(true);

      if (boundsChangedTimeoutRef.current) {
        clearTimeout(boundsChangedTimeoutRef.current);
      }

      boundsChangedTimeoutRef.current = setTimeout(() => {
        emitBounds();
      }, 500);
    },
    [emitBounds, onBoundsChange]
  );

  const handleSearchThisArea = useCallback(() => {
    emitBounds();
  }, [emitBounds]);

  const handleMarkerClick = useCallback(
    (space: Space) => {
      setSelectedSpace(space);
      onSpaceSelect?.(space.id);
    },
    [onSpaceSelect]
  );

  const handlePopupClose = useCallback(() => {
    setSelectedSpace(null);
    onSpaceSelect?.(null);
  }, [onSpaceSelect]);

  const handleViewDetails = useCallback(
    (spaceId: string) => {
      navigateWithLang(`/space/${spaceId}`);
    },
    [navigateWithLang]
  );

  useEffect(() => {
    disableMapRotation();
  }, [disableMapRotation]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        mapboxAccessToken={accessToken}
        mapLib={mapboxgl as unknown as typeof import('mapbox-gl')}
        mapStyle={MAPBOX_STYLE}
        style={mapContainerStyle}
        initialViewState={defaultCenter}
        viewState={viewState}
        onMove={handleMove}
        onError={(event) => {
          const message = event?.error?.message ?? 'Mapbox failed to load.';
          console.error('[Mapbox] error:', message, event?.error);
          setMapError(message);
        }}
        onClick={() => {
          if (selectedSpace) {
            handlePopupClose();
          }
        }}
        onLoad={() => {
          if (!initialBoundsSet.current && activeSpaces.length === 0) {
            setViewState(defaultCenter);
          }
          disableMapRotation();
        }}
      >
        {activeSpaces.map((space) => {
          if (!space.latitude || !space.longitude) return null;

          const isSelected = selectedSpace?.id === space.id;

          return (
            <Marker
              key={space.id}
              latitude={space.latitude}
              longitude={space.longitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(space);
              }}
            >
              <button
                type="button"
                className="group relative focus:outline-none"
                aria-label={t('map.viewDetails')}
                onClick={(event) => {
                  event.stopPropagation();
                  handleMarkerClick(space);
                }}
              >
                <span
                  className={`bg-primary text-primary-foreground font-semibold text-sm px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap transition-transform ${
                    isSelected ? 'scale-105 ring-2 ring-primary/60' : ''
                  }`}
                >
                  {formatCurrency(space.price_per_hour, space.currency)}
                </span>
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-[-2px] h-0 w-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-primary"></span>
              </button>
            </Marker>
          );
        })}

        {selectedSpace && selectedSpace.latitude && selectedSpace.longitude && (
          <Popup
            latitude={selectedSpace.latitude}
            longitude={selectedSpace.longitude}
            anchor="bottom"
            onClose={handlePopupClose}
            closeButton
            closeOnClick={false}
            offset={30}
          >
            <div className="p-2 max-w-xs">
              {selectedSpace.images && selectedSpace.images.length > 0 && (
                <div className="w-full h-32 overflow-hidden rounded-lg mb-2">
                  <img
                    src={selectedSpace.images[0]}
                    alt={selectedSpace.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
              <h3 className="font-semibold text-base mb-1 text-foreground">
                {selectedSpace.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {selectedSpace.city}
              </p>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-sm bg-primary text-primary-foreground">
                  {formatCurrency(selectedSpace.price_per_hour, selectedSpace.currency)}{' '}
                  {t('common.perHourShort')}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ★ {selectedSpace.rating.toFixed(1)}
                </span>
              </div>
              <Button
                size="sm"
                className="w-full bg-primary hover:bg-primary-light"
                onClick={() => handleViewDetails(selectedSpace.id)}
              >
                {t('map.viewDetails')}
              </Button>
            </div>
          </Popup>
        )}
      </Map>

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-20 px-6 text-center">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('map.notAvailable')}</h3>
            <p className="text-sm text-muted-foreground">
              {mapError} · {t('map.notConfigured')}
            </p>
          </div>
        </div>
      )}

      {showSearchButton && showSearchThisArea && !mapError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            onClick={handleSearchThisArea}
            className="bg-primary hover:bg-primary-light text-primary-foreground shadow-lg"
          >
            <MapPin className="w-4 h-4 mr-2" />
            {t('map.searchThisArea')}
          </Button>
        </div>
      )}
    </div>
  );
};
