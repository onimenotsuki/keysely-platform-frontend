import { useTranslation } from '@/hooks/useTranslation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../../ui/sheet';
import { ActiveFilters } from './ActiveFilters';
import { AmenitiesFilter } from './AmenitiesFilter';
import { CapacityFilter } from './CapacityFilter';
import { CategoryFilter } from './CategoryFilter';
import { DatePicker } from './DatePicker';
import { EnhancedAvailabilityCalendar } from './EnhancedAvailabilityCalendar';
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
  const { t } = useTranslation();

  const hasActiveFilters = () => {
    return (
      filters.categoryId !== '' ||
      filters.city !== '' ||
      filters.minPrice > 0 ||
      filters.maxPrice < 1000 ||
      filters.minCapacity > 1 ||
      filters.checkInDate ||
      filters.checkOutDate ||
      (filters.amenities && filters.amenities.length > 0) ||
      filters.availableFrom ||
      filters.availableTo
    );
  };

  const clearAllFilters = () => {
    onReset();
    setIsOpen(false);
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

            {/* Check-in Date Section */}
            <DatePicker
              date={filters.checkInDate}
              label={t('explore.searchBar.checkIn')}
              onFiltersChange={onFiltersChange}
              filters={filters}
              type="checkInDate"
            />

            {/* Check-out Date Section */}
            <DatePicker
              date={filters.checkOutDate}
              label={t('explore.searchBar.checkOut')}
              minDate={filters.checkInDate}
              onFiltersChange={onFiltersChange}
              filters={filters}
              type="checkOutDate"
            />

            {/* Search Button & Filters */}
            <div className="flex items-center gap-3 px-4 py-4 lg:pl-4">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg relative hover:bg-gray-100 transition-colors"
                  >
                    <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                    {hasActiveFilters() && (
                      <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        !
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[350px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                      {t('explore.searchBar.advancedFilters')}
                      {hasActiveFilters() && (
                        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                          <X className="w-4 h-4 mr-1" />
                          {t('explore.searchBar.clear')}
                        </Button>
                      )}
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
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

                    <div className="pt-4 sticky bottom-0 bg-background">
                      <Button className="w-full" onClick={() => setIsOpen(false)}>
                        {t('explore.searchBar.applyFilters')}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Primary Search Button */}
              <Button
                size="icon"
                className="rounded-lg bg-accent hover:bg-accent/90 w-12 h-12 shadow-sm hover:shadow-md transition-all duration-200"
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
