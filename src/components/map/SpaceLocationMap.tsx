import mapOptions from '@/utils/mapOptions';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { useCallback, useEffect, useMemo, useState } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Map options matching InteractiveMap for consistency

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
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const center = useMemo(
    () => ({
      lat: latitude,
      lng: longitude,
    }),
    [latitude, longitude]
  );

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Center map on the location when coordinates change
  useEffect(() => {
    if (map) {
      map.panTo(center);
    }
  }, [map, center]);

  // Custom marker icon for the space location
  const markerIcon: google.maps.Icon = {
    url:
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(`
        <svg width="48" height="60" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer circle (shadow) -->
          <circle cx="24" cy="24" r="22" fill="#1A2B42" opacity="0.2"/>
          
          <!-- Main pin circle -->
          <circle cx="24" cy="24" r="18" fill="#1A2B42" stroke="#FFFFFF" stroke-width="3"/>
          
          <!-- Inner white dot -->
          <circle cx="24" cy="24" r="6" fill="#FFFFFF"/>
          
          <!-- Pin pointer -->
          <path d="M 24 42 L 18 54 L 24 50 L 30 54 Z" fill="#1A2B42"/>
        </svg>
      `),
    scaledSize: new google.maps.Size(48, 60),
    anchor: new google.maps.Point(24, 60),
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        <MarkerF position={center} icon={markerIcon} />
      </GoogleMap>
    </div>
  );
};
