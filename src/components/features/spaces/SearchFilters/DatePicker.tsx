import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Calendar as CalendarComponent } from '../../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover';
import { SearchFilters } from './types';

interface DatePickerProps {
  date?: Date;
  label: string;
  minDate?: Date;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
  type: 'checkInDate' | 'checkOutDate';
}

export const DatePicker = ({
  date,
  label,
  minDate,
  onFiltersChange,
  filters,
  type,
}: DatePickerProps) => {
  return (
    <div className="lg:w-40">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(selectedDate) => onFiltersChange({ ...filters, [type]: selectedDate })}
            disabled={(dateToCheck) => dateToCheck < (minDate || new Date())}
            initialFocus
            className={cn('p-3 pointer-events-auto')}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
