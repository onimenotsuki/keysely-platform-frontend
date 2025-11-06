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
    <div className="flex flex-wrap gap-2 items-center">
      {filters.categoryId && (
        <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors">
          <span className="font-medium">
            {categories?.find((c) => c.id === filters.categoryId)?.name}
          </span>
          <button
            onClick={() => updateFilter('categoryId', '')}
            className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
            aria-label="Remover filtro de categoría"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {filters.city && (
        <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors">
          <MapPin className="w-3.5 h-3.5" />
          <span className="font-medium">{filters.city}</span>
          <button
            onClick={() => updateFilter('city', '')}
            className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
            aria-label="Remover filtro de ubicación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {filters.checkInDate && (
        <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-medium">{format(filters.checkInDate, 'dd/MM')}</span>
          <button
            onClick={() => updateFilter('checkInDate', undefined)}
            className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
            aria-label="Remover filtro de fecha"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
