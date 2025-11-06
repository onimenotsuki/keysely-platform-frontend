import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getAmenityByKey, getAmenityByValue } from '@/config/amenitiesConfig';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface AmenityBadgeProps {
  amenity: string;
  variant?: 'icon-only' | 'with-text' | 'icon-text';
  className?: string;
  iconSize?: number;
}

/**
 * AmenityBadge - Displays an amenity with icon and optional text
 * Features:
 * - icon-only: Shows only the icon with a tooltip on hover
 * - with-text: Shows icon and text side by side
 * - icon-text: Shows icon with text below (for grid layouts)
 */
export const AmenityBadge = ({
  amenity,
  variant = 'icon-only',
  className,
  iconSize = 20,
}: AmenityBadgeProps) => {
  const { t } = useTranslation();

  // Try to find amenity by value first (e.g., "High-speed WiFi")
  let amenityConfig = getAmenityByValue(amenity);

  // If not found, try by key (e.g., "highSpeedWifi")
  if (!amenityConfig) {
    amenityConfig = getAmenityByKey(amenity);
  }

  // If still not found, return text only (minimal style)
  if (!amenityConfig) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground',
          className
        )}
      >
        <span>{amenity}</span>
      </div>
    );
  }

  const Icon = amenityConfig.icon;
  const translatedName = t(`listSpace.amenitiesList.${amenityConfig.key}`);

  // Icon-only variant with tooltip
  if (variant === 'icon-only') {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'inline-flex items-center justify-center transition-all hover:scale-110 cursor-pointer',
                className
              )}
              role="button"
              tabIndex={0}
              aria-label={translatedName}
            >
              <Icon size={iconSize} className="text-primary stroke-[1.5]" strokeWidth={1.5} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{translatedName}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // With-text variant (horizontal layout)
  if (variant === 'with-text') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 text-sm transition-all',
          className
        )}
      >
        <Icon size={16} className="text-primary stroke-[1.5]" strokeWidth={1.5} />
        <span className="text-foreground font-medium">{translatedName}</span>
      </div>
    );
  }

  // Icon-text variant (vertical layout for grids)
  return (
    <div
      className={cn('flex flex-col items-center gap-2 p-3 text-center transition-all', className)}
    >
      <Icon size={iconSize} className="text-primary stroke-[1.5]" strokeWidth={1.5} />
      <span className="text-xs text-foreground font-medium">{translatedName}</span>
    </div>
  );
};
