import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { SearchFilters } from './types';

interface EnhancedAvailabilityCalendarProps {
  availableFrom?: Date;
  availableTo?: Date;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const EnhancedAvailabilityCalendar = ({
  availableFrom,
  availableTo,
  onFiltersChange,
  filters,
}: EnhancedAvailabilityCalendarProps) => {
  const handleFromDateChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      availableFrom: date,
      checkInDate: date,
    });
  };

  const handleToDateChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      availableTo: date,
      checkOutDate: date,
    });
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Disponibilidad</Label>
      <div className="grid grid-cols-2 gap-3">
        {/* From Date */}
        <div className="space-y-2">
          <Label className="text-sm">Desde</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !availableFrom && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {availableFrom ? (
                  format(availableFrom, 'PPP', { locale: es })
                ) : (
                  <span>Seleccionar</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={availableFrom}
                onSelect={handleFromDateChange}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */}
        <div className="space-y-2">
          <Label className="text-sm">Hasta</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !availableTo && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {availableTo ? (
                  format(availableTo, 'PPP', { locale: es })
                ) : (
                  <span>Seleccionar</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={availableTo}
                onSelect={handleToDateChange}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (date < today) return true;
                  if (availableFrom && date < availableFrom) return true;
                  return false;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
