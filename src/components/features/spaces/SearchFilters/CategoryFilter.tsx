import { useCategories } from '@/hooks/useCategories';
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

  return (
    <div>
      <Label className="text-base font-medium">Categoría</Label>
      <Select
        value={value}
        onValueChange={(selectedValue) =>
          onFiltersChange({ ...filters, categoryId: selectedValue })
        }
      >
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas las categorías</SelectItem>
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
