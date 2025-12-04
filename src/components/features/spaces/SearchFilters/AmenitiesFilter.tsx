import { amenitiesConfig } from '@/config/amenitiesConfig';
import { useTranslation } from '@/hooks/useTranslation';
import { Checkbox } from '../../../ui/checkbox';
import { Label } from '../../../ui/label';
import { SearchFilters } from './types';
import { FacetCounts } from '@/integrations/typesense/types';

interface AmenitiesFilterProps {
  selectedAmenities: string[];
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
  facets?: FacetCounts;
}

export const AmenitiesFilter = ({
  selectedAmenities,
  onFiltersChange,
  filters,
  facets,
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

  const getCount = (amenityValue: string) => {
    if (!facets || !facets['amenities']) return null;
    return facets['amenities'][amenityValue];
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Amenidades</Label>
      <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto pr-2 sm:grid-cols-2 lg:grid-cols-4">
        {amenitiesConfig.map((amenity) => {
          const Icon = amenity.icon;
          const count = getCount(amenity.value);
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
                {t(`listSpace.amenitiesList.${amenity.key}`)}{' '}
                {count !== null && count !== undefined ? `(${count})` : ''}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
