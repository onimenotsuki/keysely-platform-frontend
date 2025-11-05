import { AMENITIES_LIST } from '@/utils/seedSpaces';
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
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {AMENITIES_LIST.map((amenity) => (
          <div key={amenity} className="flex items-center space-x-2">
            <Checkbox
              id={`amenity-${amenity}`}
              checked={selectedAmenities?.includes(amenity) || false}
              onCheckedChange={() => handleAmenityToggle(amenity)}
            />
            <label
              htmlFor={`amenity-${amenity}`}
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {amenity}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
