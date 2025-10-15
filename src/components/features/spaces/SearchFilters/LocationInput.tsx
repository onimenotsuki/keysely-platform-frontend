import { MapPin } from 'lucide-react';
import { Input } from '../../../ui/input';
import { SearchFilters } from './types';

interface LocationInputProps {
  value: string;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const LocationInput = ({ value, onFiltersChange, filters }: LocationInputProps) => {
  return (
    <div className="lg:w-48">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Ciudad"
          value={value}
          onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
          className="pl-10"
        />
      </div>
    </div>
  );
};
