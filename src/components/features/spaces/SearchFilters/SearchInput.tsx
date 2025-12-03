import { useTranslation } from '@/hooks/useTranslation';
import { SearchFilters } from './types';

interface SearchInputProps {
  value: string;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const SearchInput = ({ value, onFiltersChange, filters }: SearchInputProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 group">
      <div className="px-8 py-5 cursor-pointer hover:bg-gray-50 transition-colors">
        <label htmlFor="search-input" className="block text-xs font-semibold text-gray-900 mb-1.5">
          {t('explore.searchBar.whatLookingFor')}
        </label>
        <input
          id="search-input"
          type="text"
          placeholder={t('explore.searchBar.searchSpaces')}
          value={value}
          onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
          className="w-full bg-transparent border-0 outline-none text-sm text-gray-700 placeholder:text-gray-400 focus:text-gray-900"
        />
      </div>
    </div>
  );
};
