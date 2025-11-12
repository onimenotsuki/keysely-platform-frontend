import { useCategories } from '@/hooks/useCategories';
import { useTranslation } from '@/hooks/useTranslation';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { SearchFilters } from './types';

interface CategoryFilterProps {
  value: string;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const CategoryFilter = ({ value, onFiltersChange, filters }: CategoryFilterProps) => {
  const { data: categories } = useCategories();
  const { t } = useTranslation();

  const normalizedValue = value === '' ? 'all' : value;

  return (
    <div>
      <Label className="text-base font-medium">{t('explore.searchBar.categoryLabel')}</Label>
      <Select
        value={normalizedValue}
        onValueChange={(selectedValue) => {
          const categoryId = selectedValue === 'all' ? '' : selectedValue;
          onFiltersChange({ ...filters, categoryId });
        }}
      >
        <SelectTrigger className="mt-2">
          <SelectValue placeholder={t('explore.searchBar.allCategories')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('explore.searchBar.allCategories')}</SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
