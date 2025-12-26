import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/useTranslation';
import generateGoogleMapsLink from '@/utils/generateGoogleMapsLink';
import { MAPBOX_STYLE } from '@/utils/mapboxConfig';
import { MapPinHouse } from 'lucide-react';
import { useMemo } from 'react';
import Map, { Marker } from 'react-map-gl';

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
  const { t } = useTranslation();

  const center = useMemo(() => ({ latitude, longitude }), [latitude, longitude]);
  const googleMapsLink = useMemo(
    () => generateGoogleMapsLink(latitude, longitude),
    [latitude, longitude]
  );

  return (
    <div className="w-full h-full rounded-xl overflow-hidden pointer-events-none">
      <Map
        mapboxAccessToken={accessToken}
        mapStyle={MAPBOX_STYLE}
        style={{ width: '100%', height: '100%' }}
        initialViewState={{
          latitude,
          longitude,
          zoom,
        }}
      >
        <Marker latitude={center.latitude} longitude={center.longitude} anchor="bottom">
          <div className="pointer-events-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
                  >
                    <div className="absolute h-8 w-8 rounded-full bg-primary/20 animate-pulse"></div>
                    <div className="relative z-10 p-2 bg-primary text-primary-foreground rounded-full shadow-lg border-2 border-white">
                      <MapPinHouse className="h-5 w-5" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary"></div>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('map.goToLocation')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Marker>
      </Map>
    </div>
  );
};
