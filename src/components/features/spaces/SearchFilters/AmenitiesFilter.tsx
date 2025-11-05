import { amenitiesConfig } from '@/config/amenitiesConfig';
import { useTranslation } from '@/hooks/useTranslation';
import { Checkbox } from '../../../ui/checkbox';
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
      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {amenitiesConfig.map((amenity) => {
          const Icon = amenity.icon;
          return (
            <div key={amenity.key} className="flex items-center space-x-3 p-2 transition-colors">
              <Checkbox
                id={`amenity-${amenity.key}`}
                checked={selectedAmenities?.includes(amenity.value) || false}
                onCheckedChange={() => handleAmenityToggle(amenity.value)}
              />
              <Icon className="h-4 w-4 text-primary stroke-[1.5] flex-shrink-0" strokeWidth={1.5} />
              <label
                htmlFor={`amenity-${amenity.key}`}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
              >
                {t(`listSpace.amenitiesList.${amenity.key}`)}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
