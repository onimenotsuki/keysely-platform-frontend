import { AmenityBadge } from '@/components/features/spaces/AmenityBadge';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '../../../../hooks/useTranslation';

interface SpaceAmenitiesProps {
  amenities: string[];
  maxDisplay?: number;
  variant?: 'icon-only' | 'with-text';
}

/**
 * SpaceAmenities - Displays amenities with icons in SpaceCard
 * Shows first N amenities with icons and a count badge for remaining
 */
export const SpaceAmenities = ({
  amenities,
  maxDisplay = 4,
  variant = 'icon-only',
}: SpaceAmenitiesProps) => {
  const { t } = useTranslation();

  if (!amenities || amenities.length === 0) return null;

  const displayedAmenities = amenities.slice(0, maxDisplay);
  const remainingCount = amenities.length - maxDisplay;

  return (
    <div className="flex items-center gap-3 mb-3">
      {displayedAmenities.map((amenity, index) => (
        <AmenityBadge
          key={`${amenity}-${index}`}
          amenity={amenity}
          variant={variant}
          iconSize={18}
        />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-muted-foreground font-medium">+{remainingCount}</span>
      )}
    </div>
  );
};
