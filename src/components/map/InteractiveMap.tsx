import type { MapBounds } from '@/components/features/spaces/SearchFilters/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Space } from '@/hooks/useSpaces';
import { GoogleMap, InfoWindow, MarkerF } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Default center (Mexico City)
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
  // mapId: 'keysely-map', // Commented out - causes issues with @react-google-maps/api v2.20.7
  styles: [
    {
      elementType: 'geometry',
      stylers: [{ color: '#F8F9FA' }],
    },
    {
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#343A40' }],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#F8F9FA' }],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [{ color: '#6C757D' }],
    },
    {
      featureType: 'administrative.country',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#1A2B42' }],
    },
    {
      featureType: 'administrative.land_parcel',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#1A2B42' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6C757D' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#E8F5E9' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6C757D' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#FFFFFF' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#343A40' }],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#FFFFFF' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#E3F2FD' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#3B82F6' }, { weight: 0.5 }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#1A2B42' }],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6C757D' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#E3F2FD' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#1A2B42' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#BBDEFB' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#3B82F6' }],
    },
  ],
};

interface InteractiveMapProps {
  spaces: Space[];
  onBoundsChange?: (bounds: MapBounds) => void;
  selectedSpaceId?: string | null;
  onSpaceSelect?: (spaceId: string | null) => void;
  showSearchButton?: boolean;
}

export const InteractiveMap = ({
  spaces,
  onBoundsChange,
  selectedSpaceId,
  onSpaceSelect,
  showSearchButton = true,
}: InteractiveMapProps) => {
  const navigate = useNavigate();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [showSearchThisArea, setShowSearchThisArea] = useState(false);
  const boundsChangedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialBoundsSet = useRef(false);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Fit bounds to show all spaces on initial load
  useEffect(() => {
    if (map && spaces.length > 0 && !initialBoundsSet.current) {
      const bounds = new google.maps.LatLngBounds();
      spaces.forEach((space) => {
        if (space.latitude && space.longitude) {
          bounds.extend({ lat: space.latitude, lng: space.longitude });
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
        initialBoundsSet.current = true;
      }
    }
  }, [map, spaces]);

  // Handle map bounds change with debounce
  const handleBoundsChanged = useCallback(() => {
    if (!map || !onBoundsChange) return;

    // Show "Search this area" button when user moves map
    setShowSearchThisArea(true);

    // Clear previous timeout
    if (boundsChangedTimeoutRef.current) {
      clearTimeout(boundsChangedTimeoutRef.current);
    }

    // Debounce the bounds change event
    boundsChangedTimeoutRef.current = setTimeout(() => {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const mapBounds: MapBounds = {
          ne: { lat: ne.lat(), lng: ne.lng() },
          sw: { lat: sw.lat(), lng: sw.lng() },
        };

        onBoundsChange(mapBounds);
        setShowSearchThisArea(false);
      }
    }, 500);
  }, [map, onBoundsChange]);

  const handleSearchThisArea = () => {
    if (!map || !onBoundsChange) return;

    const bounds = map.getBounds();
    if (bounds) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const mapBounds: MapBounds = {
        ne: { lat: ne.lat(), lng: ne.lng() },
        sw: { lat: sw.lat(), lng: sw.lng() },
      };

      onBoundsChange(mapBounds);
      setShowSearchThisArea(false);
    }
  };

  const handleMarkerClick = (space: Space) => {
    setSelectedSpace(space);
    if (onSpaceSelect) {
      onSpaceSelect(space.id);
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedSpace(null);
    if (onSpaceSelect) {
      onSpaceSelect(null);
    }
  };

  const handleViewDetails = (spaceId: string) => {
    navigate(`/space/${spaceId}`);
  };

  // Get marker icon based on whether the space is selected
  const getMarkerIcon = (space: Space): google.maps.Icon | undefined => {
    const isSelected = selectedSpaceId === space.id || selectedSpace?.id === space.id;
    const price = Math.round(space.price_per_hour);
    const priceText = `$${price}`;

    // Keysely brand colors from design system
    const primaryColor = '#1A2B42'; // Navy Blue - Primary brand color
    const accentColor = '#3B82F6'; // Action Blue - Interactive state color
    const whiteColor = '#FFFFFF'; // White for badge background

    const bgColor = whiteColor;
    const textColor = isSelected ? accentColor : primaryColor;

    // Calculate text width based on price length (approximation)
    const textLength = priceText.length;
    const baseWidth = 50;
    const charWidth = 9;
    const badgeWidth = Math.max(baseWidth, textLength * charWidth + 20);
    const badgeHeight = 36;

    return {
      url:
        'data:image/svg+xml;charset=UTF-8,' +
        encodeURIComponent(`
          <svg width="${badgeWidth}" height="${badgeHeight + 8}" xmlns="http://www.w3.org/2000/svg">
            <!-- Badge background with rounded corners -->
            <rect x="0" y="0" width="${badgeWidth}" height="${badgeHeight}" rx="18" ry="18" 
                  fill="${bgColor}"/>
            
            <!-- Price text -->
            <text x="${badgeWidth / 2}" y="${badgeHeight / 2 + 1}" 
                  font-family="Inter, system-ui, -apple-system, sans-serif" 
                  font-size="16" 
                  font-weight="700" 
                  fill="${textColor}" 
                  text-anchor="middle" 
                  dominant-baseline="central">
              ${priceText}
            </text>
            
            <!-- Small triangle pointer at bottom -->
            <polygon points="${badgeWidth / 2 - 6},${badgeHeight} ${badgeWidth / 2},${badgeHeight + 6} ${badgeWidth / 2 + 6},${badgeHeight}" 
                     fill="${bgColor}"/>
          </svg>
        `),
      scaledSize: new google.maps.Size(badgeWidth, badgeHeight + 8),
      anchor: new google.maps.Point(badgeWidth / 2, badgeHeight + 8),
    };
  };

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onBoundsChanged={handleBoundsChanged}
        options={mapOptions}
      >
        {/* Render markers for each space */}
        {spaces.map((space) => {
          if (!space.latitude || !space.longitude) return null;

          return (
            <MarkerF
              key={space.id}
              position={{ lat: space.latitude, lng: space.longitude }}
              onClick={() => handleMarkerClick(space)}
              icon={getMarkerIcon(space)}
            />
          );
        })}

        {/* Info Window for selected space */}
        {selectedSpace && selectedSpace.latitude && selectedSpace.longitude && (
          <InfoWindow
            position={{ lat: selectedSpace.latitude, lng: selectedSpace.longitude }}
            onCloseClick={handleInfoWindowClose}
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
                  ${selectedSpace.price_per_hour}/hr
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
                Ver detalles
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Search this area button */}
      {showSearchButton && showSearchThisArea && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            onClick={handleSearchThisArea}
            className="bg-primary hover:bg-primary-light text-primary-foreground shadow-lg"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Buscar en esta área
          </Button>
        </div>
      )}
    </div>
  );
};
