import { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface AvailabilityCalendarProps {
  bookings: Booking[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onDateRangeSelect?: (startDate: Date, endDate: Date) => void;
  mode?: 'single' | 'range';
  className?: string;
  showLegend?: boolean;
}

export const AvailabilityCalendar = ({
  bookings = [],
  selectedDate,
  onDateSelect,
  onDateRangeSelect,
  mode = 'single',
  className,
  showLegend = true
}: AvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Process bookings to determine day status
  const dayStatus = useMemo(() => {
    const statusMap: Record<string, 'available' | 'booked' | 'pending'> = {};
    
    bookings.forEach(booking => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      
      const days = eachDayOfInterval({ start, end });
      days.forEach(day => {
        const dayKey = format(day, 'yyyy-MM-dd');
        if (booking.status === 'confirmed' || booking.status === 'completed') {
          statusMap[dayKey] = 'booked';
        } else if (booking.status === 'pending' && !statusMap[dayKey]) {
          statusMap[dayKey] = 'pending';
        }
      });
    });

    return statusMap;
  }, [bookings]);

  const handleDayClick = (date: Date) => {
    if (isBefore(date, new Date()) && !isSameDay(date, new Date())) {
      return; // Don't allow selection of past dates
    }

    if (mode === 'single') {
      onDateSelect?.(date);
    } else if (mode === 'range') {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        // Start new range
        setRangeStart(date);
        setRangeEnd(null);
      } else if (rangeStart && !rangeEnd) {
        // Complete range
        if (isAfter(date, rangeStart)) {
          setRangeEnd(date);
          onDateRangeSelect?.(rangeStart, date);
        } else {
          setRangeStart(date);
          setRangeEnd(null);
        }
      }
    }
  };

  const getDayClassName = (date: Date) => {
    const dayKey = format(date, 'yyyy-MM-dd');
    const status = dayStatus[dayKey];
    const isToday = isSameDay(date, new Date());
    const isPast = isBefore(date, new Date()) && !isToday;
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isInRange = rangeStart && rangeEnd && 
      (isSameDay(date, rangeStart) || isSameDay(date, rangeEnd) || 
       (isAfter(date, rangeStart) && isBefore(date, rangeEnd)));
    const isRangeStart = rangeStart && isSameDay(date, rangeStart);
    const isRangeEnd = rangeEnd && isSameDay(date, rangeEnd);

    return cn(
      "w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105",
      "flex items-center justify-center cursor-pointer",
      {
        // Base states
        "bg-background text-foreground hover:bg-muted": !status && !isPast && !isSelected && !isInRange,
        "bg-muted/50 text-muted-foreground cursor-not-allowed": isPast,
        "bg-destructive text-destructive-foreground": status === 'booked',
        "bg-warning text-warning-foreground": status === 'pending',
        
        // Selection states
        "bg-primary text-primary-foreground": isSelected || isRangeStart || isRangeEnd,
        "bg-primary/20 text-primary": isInRange && !isRangeStart && !isRangeEnd,
        
        // Today
        "ring-2 ring-primary ring-offset-2": isToday && !isSelected && !isInRange,
        
        // Not in current month
        "opacity-30": !isSameMonth(date, currentMonth)
      }
    );
  };

  const navigationButton = (direction: 'prev' | 'next') => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        setCurrentMonth(prev => 
          direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
        );
      }}
      className="p-2"
    >
      {direction === 'prev' ? (
        <ChevronLeft className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </Button>
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Disponibilidad
          </div>
          <div className="flex items-center gap-1">
            {navigationButton('prev')}
            <span className="text-lg font-medium min-w-[140px] text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </span>
            {navigationButton('next')}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((date) => (
              <div
                key={date.toISOString()}
                className={getDayClassName(date)}
                onClick={() => handleDayClick(date)}
              >
                {format(date, 'd')}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="space-y-2 pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground">Leyenda:</h4>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-background border rounded"></div>
                <span>Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded"></div>
                <span>Ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded"></div>
                <span>Pendiente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Seleccionado</span>
              </div>
            </div>
          </div>
        )}

        {/* Range selection info */}
        {mode === 'range' && rangeStart && rangeEnd && (
          <div className="pt-2">
            <Badge variant="secondary" className="text-xs">
              {format(rangeStart, 'dd MMM', { locale: es })} - {format(rangeEnd, 'dd MMM', { locale: es })}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};