import { MAPBOX_STYLE } from '@/utils/mapboxConfig';
import { geocodeAddress } from '@/utils/mapboxGeocoding';
import { useCallback, useEffect, useRef, useState } from 'react';
import Map, {
  Marker,
  type MapLayerMouseEvent,
  type MarkerDragEvent,
  type ViewState,
  type ViewStateChangeEvent,
} from 'react-map-gl';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ControlledViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
  padding: ViewState['padding'];
  width: number;
  height: number;
}

const fallbackViewState: ControlledViewState = {
  latitude: 19.4326,
  longitude: -99.1332,
  zoom: 12,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
  width: 0,
  height: 0,
};

interface LocationPickerProps {
  address: string;
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export const LocationPicker = ({
  address,
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) => {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const [viewState, setViewState] = useState<ControlledViewState>(fallbackViewState);
  useEffect(() => {
    if (latitude || longitude) return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setViewState((prev) => ({
          ...prev,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }));
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [latitude, longitude]);

  const [markerPosition, setMarkerPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(
    latitude && longitude
      ? {
          latitude,
          longitude,
        }
      : null
  );
  const [geocoding, setGeocoding] = useState(false);
  const lastGeocodedAddressRef = useRef<string | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setMarkerPosition({ latitude, longitude });
      setViewState((prev) => ({
        ...prev,
        latitude,
        longitude,
        zoom: Math.max(prev.zoom, 15),
      }));
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (!address || address.trim().length === 0) return;
    if (lastGeocodedAddressRef.current === address.trim()) return;

    let cancelled = false;
    setGeocoding(true);

    geocodeAddress(address)
      .then((result) => {
        if (!result || cancelled) return;

        lastGeocodedAddressRef.current = address.trim();
        setMarkerPosition({ latitude: result.lat, longitude: result.lng });
        setViewState((prev) => ({
          ...prev,
          latitude: result.lat,
          longitude: result.lng,
          zoom: 15,
        }));
        onLocationChange(result.lat, result.lng);
      })
      .finally(() => {
        if (!cancelled) {
          setGeocoding(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [address, onLocationChange]);

  const updateLocation = useCallback(
    (lat: number, lng: number) => {
      setMarkerPosition({ latitude: lat, longitude: lng });
      setViewState((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
      onLocationChange(lat, lng);
    },
    [onLocationChange]
  );

  const handleMarkerDragEnd = useCallback(
    (event: MarkerDragEvent) => {
      const { lat, lng } = event.lngLat;
      updateLocation(lat, lng);
    },
    [updateLocation]
  );

  const handleMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const { lat, lng } = event.lngLat;
      updateLocation(lat, lng);
    },
    [updateLocation]
  );

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {markerPosition
          ? 'Arrastra el marcador para ajustar la ubicación exacta de tu espacio'
          : 'Haz clic en el mapa para establecer la ubicación de tu espacio'}
      </div>

      <Map
        mapboxAccessToken={accessToken}
        mapStyle={MAPBOX_STYLE}
        style={{ width: '100%', height: '400px' }}
        viewState={viewState as unknown as ViewState & { width: number; height: number }}
        onMove={(event: ViewStateChangeEvent) =>
          setViewState((prev) => ({
            ...prev,
            latitude: event.viewState.latitude,
            longitude: event.viewState.longitude,
            zoom: event.viewState.zoom,
            bearing: event.viewState.bearing ?? prev.bearing,
            pitch: event.viewState.pitch ?? prev.pitch,
            padding: event.viewState.padding ?? prev.padding,
            width: (event.viewState as ControlledViewState).width ?? prev.width,
            height: (event.viewState as ControlledViewState).height ?? prev.height,
          }))
        }
        onClick={handleMapClick}
      >
        {markerPosition && (
          <Marker
            latitude={markerPosition.latitude}
            longitude={markerPosition.longitude}
            draggable
            onDragEnd={handleMarkerDragEnd}
            anchor="bottom"
          >
            <span className="block h-4 w-4 rounded-full bg-primary border-2 border-white shadow-lg"></span>
          </Marker>
        )}
      </Map>

      {markerPosition && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-muted-foreground">Latitud</Label>
            <Input value={markerPosition.latitude.toFixed(6)} readOnly className="bg-muted" />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Longitud</Label>
            <Input value={markerPosition.longitude.toFixed(6)} readOnly className="bg-muted" />
          </div>
        </div>
      )}

      {geocoding && (
        <div className="text-xs text-muted-foreground">Buscando dirección en Mapbox…</div>
      )}
    </div>
  );
};
