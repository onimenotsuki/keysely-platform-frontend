import { useCategories } from '@/hooks/useCategories';
import { format } from 'date-fns';
import { Calendar, MapPin, X } from 'lucide-react';
import { SearchFilters } from './types';

interface ActiveFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  hasActiveFilters: boolean;
}

export const ActiveFilters = ({
  filters,
  onFiltersChange,
  hasActiveFilters,
}: ActiveFiltersProps) => {
  const { data: categories } = useCategories();

  if (!hasActiveFilters) return null;

  const updateFilter = (key: keyof SearchFilters, value: string | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {filters.categoryId && (
        <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
          {categories?.find((c) => c.id === filters.categoryId)?.name}
          <button
            onClick={() => updateFilter('categoryId', '')}
            className="ml-2 hover:text-primary/80"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {filters.city && (
        <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
          <MapPin className="w-3 h-3 mr-1" />
          {filters.city}
          <button onClick={() => updateFilter('city', '')} className="ml-2 hover:text-primary/80">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {filters.checkInDate && (
        <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
          <Calendar className="w-3 h-3 mr-1" />
          {format(filters.checkInDate, 'dd/MM')}
          <button
            onClick={() => updateFilter('checkInDate', undefined)}
            className="ml-2 hover:text-primary/80"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
