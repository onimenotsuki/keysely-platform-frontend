import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
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
  const { t, language } = useTranslation();
  const locale = language === 'es' ? es : enUS;

  return (
    <div className="lg:w-48 group">
      <Popover>
        <PopoverTrigger asChild>
          <div className="px-8 py-5 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-xs font-semibold text-gray-900 mb-1.5">{label}</div>
            <div className={cn('text-sm', date ? 'text-gray-700' : 'text-gray-400')}>
              {date ? format(date, 'd MMM', { locale }) : t('explore.searchBar.addDate')}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white shadow-xl border border-gray-200"
          align="start"
        >
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(selectedDate) => onFiltersChange({ ...filters, [type]: selectedDate })}
            disabled={(dateToCheck) => dateToCheck < (minDate || new Date())}
            initialFocus
            className={cn('pointer-events-auto rounded-lg')}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
