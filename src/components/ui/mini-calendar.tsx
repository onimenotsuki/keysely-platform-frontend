import { Slot } from '@radix-ui/react-slot';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { addDays, format, isSameDay, isToday } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MiniCalendarContextType = {
  selectedDate: Date | null | undefined;
  onDateSelect: (date: Date) => void;
  startDate: Date;
  onNavigate: (direction: 'prev' | 'next') => void;
  days: number;
};

const MiniCalendarContext = createContext<MiniCalendarContextType | null>(null);

const useMiniCalendar = () => {
  const context = useContext(MiniCalendarContext);
  if (!context) {
    throw new Error('MiniCalendar components must be used within MiniCalendar');
  }
  return context;
};

const getDays = (startDate: Date, count: number): Date[] => {
  const days: Date[] = [];
  for (let index = 0; index < count; index += 1) {
    days.push(addDays(startDate, index));
  }
  return days;
};

const formatDate = (date: Date) => {
  const monthLabel = format(date, 'MMM');
  const dayLabel = format(date, 'd');
  return { monthLabel, dayLabel };
};

export type MiniCalendarProps = HTMLAttributes<HTMLDivElement> & {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  startDate?: Date;
  defaultStartDate?: Date;
  onStartDateChange?: (date: Date | undefined) => void;
  days?: number;
};

export const MiniCalendar = ({
  value,
  defaultValue,
  onValueChange,
  startDate,
  defaultStartDate = new Date(),
  onStartDateChange,
  days = 5,
  className,
  children,
  ...props
}: MiniCalendarProps) => {
  const [selectedDate, setSelectedDate] = useControllableState<Date | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const [currentStartDate, setCurrentStartDate] = useControllableState<Date | undefined>({
    prop: startDate,
    defaultProp: defaultStartDate,
    onChange: onStartDateChange,
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newStartDate = addDays(
      currentStartDate ?? new Date(),
      direction === 'next' ? days : -days
    );
    setCurrentStartDate(newStartDate);
  };

  const contextValue: MiniCalendarContextType = {
    selectedDate: selectedDate ?? null,
    onDateSelect: handleDateSelect,
    startDate: currentStartDate ?? new Date(),
    onNavigate: handleNavigate,
    days,
  };

  return (
    <MiniCalendarContext.Provider value={contextValue}>
      <div
        className={cn('flex flex-col gap-3 rounded-lg border bg-background p-4', className)}
        {...props}
      >
        {children}
      </div>
    </MiniCalendarContext.Provider>
  );
};

export type MiniCalendarNavigationProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  direction: 'prev' | 'next';
  asChild?: boolean;
};

export const MiniCalendarNavigation = ({
  direction,
  asChild = false,
  children,
  onClick,
  ...props
}: MiniCalendarNavigationProps) => {
  const { onNavigate } = useMiniCalendar();
  const Icon = direction === 'prev' ? ChevronLeftIcon : ChevronRightIcon;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onNavigate(direction);
    onClick?.(event);
  };

  if (asChild) {
    return (
      <Slot onClick={handleClick} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <Button onClick={handleClick} size="icon" type="button" variant="ghost" {...props}>
      {children ?? <Icon className="h-4 w-4" />}
    </Button>
  );
};

export type MiniCalendarDaysProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: (date: Date) => ReactNode;
};

export const MiniCalendarDays = ({ className, children, ...props }: MiniCalendarDaysProps) => {
  const { startDate, days: dayCount } = useMiniCalendar();
  const days = getDays(startDate, dayCount);
  return (
    <div className={cn(className)} {...props}>
      {days.map((date) => children(date))}
    </div>
  );
};

export type MiniCalendarDayRenderProps = {
  monthLabel: string;
  dayLabel: string;
  isSelected: boolean;
  isToday: boolean;
};

export type MiniCalendarDayProps = ComponentProps<typeof Button> & {
  date: Date;
  indicator?: ReactNode;
  renderContent?: (props: MiniCalendarDayRenderProps) => ReactNode;
};

export const MiniCalendarDay = ({
  date,
  className,
  indicator,
  renderContent,
  ...props
}: MiniCalendarDayProps) => {
  const { selectedDate, onDateSelect } = useMiniCalendar();
  const { monthLabel, dayLabel } = formatDate(date);
  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
  const isTodayDate = isToday(date);

  return (
    <Button
      className={cn(
        'flex h-auto min-w-[3rem] flex-col items-center justify-center gap-1 rounded-md p-2 text-xs',
        isTodayDate && !isSelected && 'bg-accent text-accent-foreground',
        className
      )}
      onClick={() => onDateSelect(date)}
      size="sm"
      type="button"
      variant={isSelected ? 'default' : 'ghost'}
      {...props}
    >
      {renderContent ? (
        renderContent({ monthLabel, dayLabel, isSelected, isToday: isTodayDate })
      ) : (
        <>
          <span
            className={cn(
              'font-medium text-[10px] text-muted-foreground',
              isSelected && 'text-primary-foreground/70'
            )}
          >
            {monthLabel}
          </span>
          <span className="text-sm font-semibold">{dayLabel}</span>
        </>
      )}
      {indicator}
    </Button>
  );
};
