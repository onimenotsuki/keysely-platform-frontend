import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../../ui/sheet';
import { ActiveFilters } from './ActiveFilters';
import { CapacityFilter } from './CapacityFilter';
import { CategoryFilter } from './CategoryFilter';
import { DatePicker } from './DatePicker';
import { LocationInput } from './LocationInput';
import { PriceRangeFilter } from './PriceRangeFilter';
import { SearchInput } from './SearchInput';
import { SearchFilters as SearchFiltersType } from './types';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onReset: () => void;
}

export const SearchFilters = ({ filters, onFiltersChange, onReset }: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = () => {
    return (
      filters.categoryId !== '' ||
      filters.city !== '' ||
      filters.minPrice > 0 ||
      filters.maxPrice < 1000 ||
      filters.minCapacity > 1 ||
      filters.checkInDate ||
      filters.checkOutDate
    );
  };

  const clearAllFilters = () => {
    onReset();
    setIsOpen(false);
  };

  return (
    <div className="bg-background border rounded-lg p-4 shadow-sm">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchInput
          value={filters.searchTerm}
          onFiltersChange={onFiltersChange}
          filters={filters}
        />

        <LocationInput value={filters.city} onFiltersChange={onFiltersChange} filters={filters} />

        <DatePicker
          date={filters.checkInDate}
          label="Check-in"
          onFiltersChange={onFiltersChange}
          filters={filters}
          type="checkInDate"
        />

        <DatePicker
          date={filters.checkOutDate}
          label="Check-out"
          minDate={filters.checkInDate}
          onFiltersChange={onFiltersChange}
          filters={filters}
          type="checkOutDate"
        />

        {/* Advanced Filters Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:w-auto">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtros
              {hasActiveFilters() && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[350px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                Filtros Avanzados
                {hasActiveFilters() && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <CategoryFilter
                value={filters.categoryId}
                onFiltersChange={onFiltersChange}
                filters={filters}
              />

              <PriceRangeFilter
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                onFiltersChange={onFiltersChange}
                filters={filters}
              />

              <CapacityFilter
                minCapacity={filters.minCapacity}
                onFiltersChange={onFiltersChange}
                filters={filters}
              />

              <div className="pt-4">
                <Button className="w-full" onClick={() => setIsOpen(false)}>
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <ActiveFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        hasActiveFilters={hasActiveFilters()}
      />
    </div>
  );
};
