import type { MapBounds } from '@/components/features/spaces/SearchFilters/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import type { Space } from '@/hooks/useSpaces';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils/formatCurrency';
import mapOptions from '@/utils/mapOptions';
import { GoogleMap, InfoWindow, MarkerF } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Default center (Mexico City)
const defaultCenter = {
  lat: 19.4326,
  lng: -99.1332,
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
  const { navigateWithLang } = useLanguageRouting();
  const { t } = useTranslation();
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
    navigateWithLang(`/space/${spaceId}`);
  };

  // Get marker icon for price display
  const getMarkerIcon = (space: Space): google.maps.Icon | undefined => {
    const priceText = formatCurrency(space.price_per_hour, space.currency);

    // Keysely brand colors from design system
    const primaryColor = '#1A2B42'; // Navy Blue - Primary brand color
    const whiteColor = '#FFFFFF'; // White for text

    const bgColor = primaryColor;
    const textColor = whiteColor;

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

          // Hide marker if this space is selected (InfoWindow will be shown instead)
          const isSelected = selectedSpace?.id === space.id;
          if (isSelected) return null;

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
            {t('map.searchThisArea')}
          </Button>
        </div>
      )}
    </div>
  );
};
