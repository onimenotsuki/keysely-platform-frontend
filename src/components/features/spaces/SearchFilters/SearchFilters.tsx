import { useTranslation } from '@/hooks/useTranslation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog';
import { ActiveFilters } from './ActiveFilters';
import { AmenitiesFilter } from './AmenitiesFilter';
import { CapacityFilter } from './CapacityFilter';
import { CategoryFilter } from './CategoryFilter';
import { DateInput } from './DateInput';
import { EnhancedAvailabilityCalendar } from './EnhancedAvailabilityCalendar';
import { LocationInput } from './LocationInput';
import { PriceRangeFilter } from './PriceRangeFilter';
import { SearchInput } from './SearchInput';
import { SearchFilters as SearchFiltersType } from './types';
import { FacetCounts } from '@/integrations/typesense/types';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onReset: () => void;
  resultsCount?: number;
  facets?: FacetCounts;
}

export const SearchFilters = ({
  filters,
  onFiltersChange,
  onReset,
  resultsCount = 0,
  facets,
}: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const hasActiveFilters = () => {
    return (
      filters.categoryId !== '' ||
      filters.city !== '' ||
      filters.minPrice > 0 ||
      filters.maxPrice < 1000 ||
      filters.minCapacity > 1 ||
      !!filters.checkInDate ||
      !!filters.checkOutDate ||
      (filters.amenities && filters.amenities.length > 0) ||
      !!filters.availableFrom ||
      !!filters.availableTo
    );
  };

  const clearAllFilters = () => {
    onReset();
  };

  return (
    <div className="w-full">
      {/* Modern Airbnb-style Search Bar */}
      <div className="bg-white shadow-md border-b border-gray-200 px-0">
        <div className="container mx-auto px-0">
          <div className="flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* Search Input Section */}
            <SearchInput
              value={filters.searchTerm}
              onFiltersChange={onFiltersChange}
              filters={filters}
            />

            {/* Location Section */}
            <LocationInput
              value={filters.city}
              onFiltersChange={onFiltersChange}
              filters={filters}
            />

            {/* Date Range Section */}
            {/* Date Range Section */}
            <DateInput filters={filters} onFiltersChange={onFiltersChange} />

            {/* Search Button & Filters */}
            <div className="flex items-center gap-3 px-4 py-4 lg:pl-4 h-[86px]">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 px-6 gap-2 rounded-lg border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300 relative"
                  >
                    <span className="font-semibold">{t('explore.searchBar.filters')}</span>
                    <SlidersHorizontal className="w-4 h-4" />
                    {hasActiveFilters() && (
                      <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                        !
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0 gap-0">
                  <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
                    <DialogTitle className="flex items-center justify-between text-lg">
                      {t('explore.searchBar.advancedFilters')}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="-mr-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col">
                    {hasActiveFilters() && (
                      <div className="border-b px-6 py-4">
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('explore.searchBar.selectedFilters')}
                        </p>
                        <div className="mt-3">
                          <ActiveFilters
                            filters={filters}
                            onFiltersChange={onFiltersChange}
                            hasActiveFilters={true}
                          />
                        </div>
                      </div>
                    )}

                    <div className="px-6 py-6 space-y-8">
                      <CategoryFilter
                        value={filters.categoryId}
                        onFiltersChange={onFiltersChange}
                        filters={filters}
                        facets={facets}
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

                      <AmenitiesFilter
                        selectedAmenities={filters.amenities || []}
                        onFiltersChange={onFiltersChange}
                        filters={filters}
                      />

                      <EnhancedAvailabilityCalendar
                        availableFrom={filters.availableFrom}
                        availableTo={filters.availableTo}
                        onFiltersChange={onFiltersChange}
                        filters={filters}
                      />
                    </div>
                  </div>

                  <div className="border-t px-6 py-4 sticky bottom-0 bg-white z-10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Button
                        variant="ghost"
                        onClick={clearAllFilters}
                        className="text-gray-500 hover:text-gray-900 font-semibold underline"
                      >
                        {t('explore.searchBar.clearFiltersButton')}
                      </Button>
                      <Button
                        className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white px-8 py-2.5 h-auto text-base font-semibold rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        {t('explore.searchBar.showResults', { count: resultsCount })}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Primary Search Button */}
              <Button
                size="icon"
                className="rounded-lg bg-accent hover:bg-accent/80 w-12 h-12 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Below */}
      {hasActiveFilters() && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <ActiveFilters
              filters={filters}
              onFiltersChange={onFiltersChange}
              hasActiveFilters={hasActiveFilters()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
