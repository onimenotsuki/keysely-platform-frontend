import { useTranslation } from '@/hooks/useTranslation';
import { SearchFilters } from './types';

interface LocationInputProps {
  value: string;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const LocationInput = ({ value, onFiltersChange, filters }: LocationInputProps) => {
  const { t } = useTranslation();

  return (
    <div className="lg:w-56 group">
      <div className="px-8 py-5 cursor-pointer hover:bg-gray-50 transition-colors">
        <label
          htmlFor="location-input"
          className="block text-xs font-semibold text-gray-900 mb-1.5"
        >
          {t('explore.searchBar.location')}
        </label>
        <input
          id="location-input"
          type="text"
          placeholder={t('explore.searchBar.whereToGo')}
          value={value}
          onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
          className="w-full bg-transparent border-0 outline-none text-sm text-gray-700 placeholder:text-gray-400 focus:text-gray-900"
        />
      </div>
    </div>
  );
};
