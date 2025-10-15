import { Label } from '../../../ui/label';
import { Slider } from '../../../ui/slider';
import { SearchFilters } from './types';

interface CapacityFilterProps {
  minCapacity: number;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const CapacityFilter = ({ minCapacity, onFiltersChange, filters }: CapacityFilterProps) => {
  return (
    <div>
      <Label className="text-base font-medium">Capacidad mínima: {minCapacity} personas</Label>
      <div className="mt-4 px-2">
        <Slider
          value={[minCapacity]}
          onValueChange={([value]) => onFiltersChange({ ...filters, minCapacity: value })}
          max={50}
          min={1}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};
