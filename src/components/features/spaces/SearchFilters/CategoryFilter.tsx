import { useCategories } from '@/hooks/useCategories';
import { useTranslation } from '@/hooks/useTranslation';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { SearchFilters } from './types';
import { FacetCounts } from '@/integrations/typesense/types';

interface CategoryFilterProps {
  value: string;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
  facets?: FacetCounts;
}

export const CategoryFilter = ({
  value,
  onFiltersChange,
  filters,
  facets,
}: CategoryFilterProps) => {
  const { data: categories } = useCategories();
  const { t } = useTranslation();

  const normalizedValue = value === '' ? 'all' : value;

  const getCount = (categoryId: string) => {
    if (!facets || !facets['category_id']) return null;
    return facets['category_id'][categoryId];
  };

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
          {categories?.map((category) => {
            const count = getCount(category.id);
            return (
              <SelectItem key={category.id} value={category.id}>
                {category.name} {count !== null && count !== undefined ? `(${count})` : ''}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
