import { getAmenityByValue } from '@/config/amenitiesConfig';
import { useCategories } from '@/hooks/useCategories';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { Calendar, DollarSign, MapPin, Users, X } from 'lucide-react';
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
  const { t } = useTranslation();

  if (!hasActiveFilters) return null;

  const updateFilter = (key: keyof SearchFilters, value: SearchFilters[keyof SearchFilters]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const removeAmenity = (amenityToRemove: string) => {
    const newAmenities = filters.amenities.filter((a) => a !== amenityToRemove);
    updateFilter('amenities', newAmenities);
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
            aria-label={t('explore.activeFilters.removeCategory')}
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
            aria-label={t('explore.activeFilters.removeLocation')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
        <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors">
          <span className="font-medium">
            {t('explore.activeFilters.priceRange')}: ${filters.minPrice} - ${filters.maxPrice}
          </span>
          <button
            onClick={() => {
              onFiltersChange({
                ...filters,
                minPrice: 0,
                maxPrice: 1000,
              });
            }}
            className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
            aria-label={t('explore.activeFilters.removePrice')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {filters.minCapacity > 1 && (
        <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors">
          <Users className="w-3.5 h-3.5" />
          <span className="font-medium">
            {filters.minCapacity}+ {t('explore.activeFilters.people')}
          </span>
          <button
            onClick={() => updateFilter('minCapacity', 1)}
            className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
            aria-label={t('explore.activeFilters.removeCapacity')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {filters.availableFrom && (
        <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-medium">
            {t('explore.activeFilters.from')}: {format(filters.availableFrom, 'dd/MM')}
          </span>
          <button
            onClick={() => updateFilter('availableFrom', undefined)}
            className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
            aria-label={t('explore.activeFilters.removeAvailableFrom')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {filters.availableTo && (
        <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-medium">
            {t('explore.activeFilters.to')}: {format(filters.availableTo, 'dd/MM')}
          </span>
          <button
            onClick={() => updateFilter('availableTo', undefined)}
            className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
            aria-label={t('explore.activeFilters.removeAvailableTo')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {filters.amenities?.map((amenityValue) => {
        const amenityConfig = getAmenityByValue(amenityValue);
        const Icon = amenityConfig?.icon || Calendar; // Fallback icon

        return (
          <div
            key={amenityValue}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors"
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="font-medium">
              {amenityConfig ? t(`listSpace.amenitiesList.${amenityConfig.key}`) : amenityValue}
            </span>
            <button
              onClick={() => removeAmenity(amenityValue)}
              className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
              aria-label={t('explore.activeFilters.removeAmenity', { amenity: amenityValue })}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
