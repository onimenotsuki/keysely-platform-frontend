import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const mapStyles: google.maps.MapTypeStyle[] = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#EEF2FF' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#C7D7FE' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#E0E7FF' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#94A3B8' }, { weight: 0.3 }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry.fill',
    stylers: [{ color: '#DBEAFE' }],
  },
  {
    featureType: 'poi.business',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1A2B42' }],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [{ color: '#E2E8F0' }],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1A2B42' }],
  },
];

const defaultCenter = {
  lat: 19.4326,
  lng: -99.1332,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  backgroundColor: '#EEF2FF',
  styles: mapStyles,
  // mapId: 'keysely-map', // Commented out - causes issues with @react-google-maps/api v2.20.7
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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.LatLng | null>(
    latitude && longitude ? new google.maps.LatLng(latitude, longitude) : null
  );
  const [geocoding, setGeocoding] = useState(false);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Geocode address when it changes
  useEffect(() => {
    if (!map || !address || geocoding) return;

    const geocoder = new google.maps.Geocoder();
    setGeocoding(true);

    geocoder.geocode({ address }, (results, status) => {
      setGeocoding(false);

      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const newMarker = new google.maps.LatLng(location.lat(), location.lng());

        setMarker(newMarker);
        map.panTo(location);
        map.setZoom(15);

        onLocationChange(location.lat(), location.lng());
      }
    });
  }, [address, map, geocoding, onLocationChange]);

  // Handle marker drag
  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarker(new google.maps.LatLng(lat, lng));
        onLocationChange(lat, lng);
      }
    },
    [onLocationChange]
  );

  // Handle map click to place marker
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarker(new google.maps.LatLng(lat, lng));
        onLocationChange(lat, lng);
      }
    },
    [onLocationChange]
  );

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {marker
          ? 'Arrastra el marcador para ajustar la ubicación exacta de tu espacio'
          : 'Haz clic en el mapa para establecer la ubicación de tu espacio'}
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={marker ? { lat: marker.lat(), lng: marker.lng() } : defaultCenter}
        zoom={marker ? 15 : 12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={mapOptions}
      >
        {marker && (
          <MarkerF
            position={{ lat: marker.lat(), lng: marker.lng() }}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: '#1A2B42',
              fillOpacity: 1,
              strokeColor: '#60A5FA',
              strokeWeight: 2,
            }}
          />
        )}
      </GoogleMap>

      {marker && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-muted-foreground">Latitud</Label>
            <Input value={marker.lat().toFixed(6)} readOnly className="bg-muted" />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Longitud</Label>
            <Input value={marker.lng().toFixed(6)} readOnly className="bg-muted" />
          </div>
        </div>
      )}
    </div>
  );
};
