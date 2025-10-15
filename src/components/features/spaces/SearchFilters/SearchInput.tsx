import { Search } from 'lucide-react';
import { Input } from '../../../ui/input';
import { SearchFilters } from './types';

interface SearchInputProps {
  value: string;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const SearchInput = ({ value, onFiltersChange, filters }: SearchInputProps) => {
  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar espacios, ubicaciones..."
          value={value}
          onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
          className="pl-10"
        />
      </div>
    </div>
  );
};
