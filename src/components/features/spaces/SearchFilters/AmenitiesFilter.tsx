import { amenitiesConfig } from '@/config/amenitiesConfig';
import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Label } from '../../../ui/label';
import { SearchFilters } from './types';

interface AmenitiesFilterProps {
  selectedAmenities: string[];
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const AmenitiesFilter = ({
  selectedAmenities,
  onFiltersChange,
  filters,
}: AmenitiesFilterProps) => {
  const { t } = useTranslation();

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = selectedAmenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity];

    onFiltersChange({
      ...filters,
      amenities: newAmenities,
    });
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Amenidades</Label>
      <div className="flex flex-wrap gap-2">
        {amenitiesConfig.map((amenity) => {
          const Icon = amenity.icon;
          const isSelected = selectedAmenities?.includes(amenity.value);

          return (
            <Badge
              key={amenity.key}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer px-3 py-1.5 text-sm font-normal transition-all hover:bg-primary/90 hover:text-primary-foreground',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white hover:bg-gray-100 hover:text-foreground'
              )}
              onClick={() => handleAmenityToggle(amenity.value)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {t(`listSpace.amenitiesList.${amenity.key}`)}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
