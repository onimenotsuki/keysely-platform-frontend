import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  className?: string;
  triggerTextClassName?: string;
}

function DateRangePicker({ date, setDate, className, triggerTextClassName }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to set exact dates relative to today
  const setRelativeDate = (days: number) => {
    const today = new Date();
    setDate({
      from: today,
      to: addDays(today, days),
    });
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'ghost'}
            className={cn(
              'w-full justify-start text-left font-normal hover:bg-transparent p-0 h-auto',
              !date && 'text-muted-foreground'
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span
                className={cn(
                  'text-base',
                  date ? 'text-gray-900' : 'text-gray-400',
                  triggerTextClassName
                )}
              >
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'd MMM', { locale: es })} -{' '}
                      {format(date.to, 'd MMM', { locale: es })}
                    </>
                  ) : (
                    format(date.from, 'd MMM', { locale: es })
                  )
                ) : (
                  'Seleccione fechas'
                )}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-[350px] sm:w-[660px]">
            {/* Header Tabs */}
            <div className="flex justify-center border-b p-2 bg-gray-50/50">
              <div className="flex p-1 bg-gray-100 rounded-full">
                <button
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all bg-white shadow-sm text-gray-900 cursor-default'
                  )}
                >
                  Fechas
                </button>
              </div>
            </div>

            {/* Calendar Content */}
            <div className="p-4">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={es}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="w-full flex justify-center"
                classNames={{
                  months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                  month: 'space-y-4 w-full',
                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex w-full justify-between',
                  row: 'flex w-full mt-2 justify-between',
                  cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-full [&:has([aria-selected].day-range-start)]:rounded-l-full [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20',
                  day: cn(
                    'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 hover:rounded-full transition-colors'
                  ),
                  day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                  day_today: 'bg-gray-100 text-gray-900 font-semibold rounded-full',
                  day_disabled: 'text-gray-300 opacity-50',
                  day_outside: 'text-gray-300 opacity-50',
                  day_range_middle:
                    'aria-selected:bg-primary aria-selected:text-primary-foreground !rounded-none bg-primary text-primary-foreground',
                  day_hidden: 'invisible',
                  day_range_start: 'rounded-l-full bg-primary text-primary-foreground',
                  day_range_end: 'rounded-r-full bg-primary text-primary-foreground',
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateRangePicker;
