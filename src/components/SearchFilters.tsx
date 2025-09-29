import { useState } from 'react';
import { Search, MapPin, Users, DollarSign, Calendar, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useCategories } from '@/hooks/useCategories';

export interface SearchFilters {
  searchTerm: string;
  categoryId: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  minCapacity: number;
  checkInDate?: Date;
  checkOutDate?: Date;
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

export const SearchFilters = ({ filters, onFiltersChange, onReset }: SearchFiltersProps) => {
  const { data: categories } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

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
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar espacios, ubicaciones..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div className="lg:w-48">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Ciudad"
              value={filters.city}
              onChange={(e) => updateFilter('city', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Check-in Date */}
        <div className="lg:w-40">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.checkInDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filters.checkInDate ? format(filters.checkInDate, "PPP") : "Check-in"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.checkInDate}
                onSelect={(date) => updateFilter('checkInDate', date)}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out Date */}
        <div className="lg:w-40">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.checkOutDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filters.checkOutDate ? format(filters.checkOutDate, "PPP") : "Check-out"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.checkOutDate}
                onSelect={(date) => updateFilter('checkOutDate', date)}
                disabled={(date) => date < (filters.checkInDate || new Date())}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

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
              {/* Category Filter */}
              <div>
                <Label className="text-base font-medium">Categoría</Label>
                <Select
                  value={filters.categoryId}
                  onValueChange={(value) => updateFilter('categoryId', value)}
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

              {/* Price Range */}
              <div>
                <Label className="text-base font-medium">
                  Precio por hora: ${filters.minPrice} - ${filters.maxPrice}
                </Label>
                <div className="mt-4 px-2">
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    onValueChange={([min, max]) => {
                      updateFilter('minPrice', min);
                      updateFilter('maxPrice', max);
                    }}
                    max={1000}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <Label className="text-base font-medium">
                  Capacidad mínima: {filters.minCapacity} personas
                </Label>
                <div className="mt-4 px-2">
                  <Slider
                    value={[filters.minCapacity]}
                    onValueChange={([value]) => updateFilter('minCapacity', value)}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="pt-4">
                <Button 
                  className="w-full" 
                  onClick={() => setIsOpen(false)}
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.categoryId && (
            <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              {categories?.find(c => c.id === filters.categoryId)?.name}
              <button
                onClick={() => updateFilter('categoryId', '')}
                className="ml-2 hover:text-primary/80"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {filters.city && (
            <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <MapPin className="w-3 h-3 mr-1" />
              {filters.city}
              <button
                onClick={() => updateFilter('city', '')}
                className="ml-2 hover:text-primary/80"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {filters.checkInDate && (
            <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <Calendar className="w-3 h-3 mr-1" />
              {format(filters.checkInDate, "dd/MM")}
              <button
                onClick={() => updateFilter('checkInDate', undefined)}
                className="ml-2 hover:text-primary/80"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};