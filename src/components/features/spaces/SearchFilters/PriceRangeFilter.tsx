import { Label } from '../../../ui/label';
import { Slider } from '../../../ui/slider';
import { SearchFilters } from './types';

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const PriceRangeFilter = ({
  minPrice,
  maxPrice,
  onFiltersChange,
  filters,
}: PriceRangeFilterProps) => {
  return (
    <div>
      <Label className="text-base font-medium">
        Precio por hora: ${minPrice} - ${maxPrice}
      </Label>
      <div className="mt-4 px-2">
        <Slider
          value={[minPrice, maxPrice]}
          onValueChange={([min, max]) => {
            onFiltersChange({
              ...filters,
              minPrice: min,
              maxPrice: max,
            });
          }}
          max={1000}
          min={0}
          step={10}
          className="w-full"
        />
      </div>
    </div>
  );
};
