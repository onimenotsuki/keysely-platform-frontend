import DateRangePicker from '@/components/DateRangePicker';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';
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
  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFiltersChange({
      ...filters,
      availableFrom: range?.from,
      availableTo: range?.to,
      checkInDate: range?.from,
      checkOutDate: range?.to,
    });
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-semibold text-gray-900 mb-1.5">Disponibilidad</Label>
      <div className="w-full">
        <DateRangePicker
          date={{
            from: availableFrom,
            to: availableTo,
          }}
          setDate={handleDateRangeChange}
          className="w-full"
          triggerTextClassName="text-sm"
        />
      </div>
    </div>
  );
};
