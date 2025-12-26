import DateRangePicker from '@/components/DateRangePicker';
import { useTranslation } from '@/hooks/useTranslation';
import { DateRange } from 'react-day-picker';
import { SearchFilters } from './types';

interface DateInputProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export const DateInput = ({ filters, onFiltersChange }: DateInputProps) => {
  const { t } = useTranslation();

  return (
    <div className="px-8 py-5 flex-1 cursor-pointer hover:bg-gray-50 transition-colors h-[86px]">
      <label className="block text-xs font-semibold text-gray-900 mb-1.5">
        {t('hero.whenLabel')}
      </label>
      <DateRangePicker
        triggerTextClassName="text-gray-400 text-md"
        date={{
          from: filters.checkInDate,
          to: filters.checkOutDate,
        }}
        setDate={(range: DateRange | undefined) => {
          onFiltersChange({
            ...filters,
            checkInDate: range?.from,
            checkOutDate: range?.to,
          });
        }}
        className="w-full"
      />
    </div>
  );
};
