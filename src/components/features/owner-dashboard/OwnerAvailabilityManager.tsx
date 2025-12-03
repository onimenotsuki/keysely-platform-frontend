import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from '@/components/ui/mini-calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  useBlockedHoursRange,
  useCreateBlockedHour,
  useDeleteBlockedHour,
} from '@/hooks/useBlockedHours';
import type { OwnerSpace } from '@/hooks/useOwnerData';
import { useTranslation } from '@/hooks/useTranslation';
import type { BlockedHour } from '@/integrations/supabase/blockedHours';
import { cn } from '@/lib/utils';
import {
  addDays,
  addHours,
  format,
  isBefore,
  isSameDay,
  parse,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { enUS, es as esLocale } from 'date-fns/locale';
import { CalendarDays, Clock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const DAYS_IN_VIEW = 7;

const createTimeSlots = () => {
  const base = startOfDay(new Date());
  return Array.from({ length: 24 }, (_, index) => {
    const slotStart = addHours(base, index);
    return {
      value: format(slotStart, 'HH:mm'),
      label: format(slotStart, 'h:mm a'),
    };
  });
};

const normalizeTimeKey = (time: string) => (time ? time.slice(0, 5) : time);

interface OwnerAvailabilityManagerProps {
  spaces: OwnerSpace[];
}

export const OwnerAvailabilityManager = ({ spaces }: OwnerAvailabilityManagerProps) => {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(spaces[0]?.id ?? null);
  const [calendarStart, setCalendarStart] = useState<Date>(() =>
    startOfWeek(startOfDay(new Date()), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [pendingSlot, setPendingSlot] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSpaceId && spaces.length > 0) {
      setSelectedSpaceId(spaces[0].id);
    }
  }, [selectedSpaceId, spaces]);

  useEffect(() => {
    if (selectedDate && selectedSpaceId === null && spaces.length > 0) {
      setSelectedSpaceId(spaces[0].id);
    }
  }, [selectedDate, selectedSpaceId, spaces]);

  useEffect(() => {
    setSelectedSlot('');
  }, [selectedDate]);

  const dateLocale = language === 'es' ? esLocale : enUS;
  const calendarRangeEnd = useMemo(() => addDays(calendarStart, DAYS_IN_VIEW - 1), [calendarStart]);
  const rangeLabel = useMemo(() => {
    const startLabel = format(calendarStart, 'MMM d', { locale: dateLocale });
    const endLabel = format(calendarRangeEnd, 'MMM d', { locale: dateLocale });
    const startYear = format(calendarStart, 'yyyy', { locale: dateLocale });
    const endYear = format(calendarRangeEnd, 'yyyy', { locale: dateLocale });
    if (isSameDay(calendarStart, calendarRangeEnd)) {
      return `${startLabel} · ${startYear}`;
    }
    if (startYear === endYear) {
      return `${startLabel} - ${endLabel} · ${startYear}`;
    }
    return `${startLabel} · ${startYear} — ${endLabel} · ${endYear}`;
  }, [calendarRangeEnd, calendarStart, dateLocale]);

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return null;
    return format(selectedDate, 'PPPP', { locale: dateLocale });
  }, [selectedDate, dateLocale]);

  const {
    data: blockedHours = [],
    isLoading: isBlockedLoading,
    isFetching: isBlockedFetching,
  } = useBlockedHoursRange(selectedSpaceId, calendarStart, calendarRangeEnd);
  const createMutation = useCreateBlockedHour();
  const deleteMutation = useDeleteBlockedHour();

  const blockedHoursByDate = useMemo(() => {
    return blockedHours.reduce<Record<string, Record<string, BlockedHour>>>((acc, hour) => {
      const timeKey = normalizeTimeKey(hour.start_time);
      if (!acc[hour.blocked_date]) {
        acc[hour.blocked_date] = {};
      }
      acc[hour.blocked_date][timeKey] = hour;
      return acc;
    }, {});
  }, [blockedHours]);

  const blockedCountByDate = useMemo(() => {
    return blockedHours.reduce<Record<string, number>>((acc, hour) => {
      acc[hour.blocked_date] = (acc[hour.blocked_date] || 0) + 1;
      return acc;
    }, {});
  }, [blockedHours]);

  const timeSlots = useMemo(() => createTimeSlots(), []);

  const today = startOfDay(new Date());
  const selectedSpace = spaces.find((space) => space.id === selectedSpaceId) ?? null;
  const selectedDateKey = useMemo(
    () => (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null),
    [selectedDate]
  );
  const blockedHoursForDay = useMemo(() => {
    if (!selectedDateKey) return [];
    return Object.values(blockedHoursByDate[selectedDateKey] ?? {});
  }, [blockedHoursByDate, selectedDateKey]);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleCalendarValueChange = (date?: Date) => {
    if (!date) {
      return;
    }
    if (isBefore(date, today)) return;
    setSelectedDate(startOfDay(date));
  };

  const handleToggleSlot = async (slot: string) => {
    if (!selectedSpaceId || !selectedDateKey) return;
    const existingBlocked = blockedHoursByDate[selectedDateKey]?.[slot] ?? null;
    const slotDate = parse(slot, 'HH:mm', selectedDate ?? new Date());

    setPendingSlot(slot);
    try {
      if (existingBlocked) {
        await deleteMutation.mutateAsync({
          id: existingBlocked.id,
          spaceId: selectedSpaceId,
          blockedDate: selectedDateKey,
        });
        toast({
          title: t('ownerDashboard.availabilityManager.toastUnblockedTitle'),
          description: t('ownerDashboard.availabilityManager.toastUnblockedDescription', {
            hour: format(slotDate, 'h:mm a'),
          }),
        });
      } else {
        const end = addHours(slotDate, 1);
        await createMutation.mutateAsync({
          space_id: selectedSpaceId,
          blocked_date: selectedDateKey,
          start_time: format(slotDate, 'HH:mm'),
          end_time: format(end, 'HH:mm'),
        });
        toast({
          title: t('ownerDashboard.availabilityManager.toastBlockedTitle'),
          description: t('ownerDashboard.availabilityManager.toastBlockedDescription', {
            hour: format(slotDate, 'h:mm a'),
          }),
        });
      }
    } catch (error) {
      console.error('[OwnerAvailabilityManager] handleToggleSlot failed', error);
      toast({
        title: t('common.error'),
        description: t('ownerDashboard.availabilityManager.toastError'),
        variant: 'destructive',
      });
    } finally {
      setPendingSlot(null);
    }
  };

  const handleRangeSelect = async (slot: string) => {
    if (!slot) return;
    setSelectedSlot(slot);
    try {
      await handleToggleSlot(slot);
    } finally {
      setSelectedSlot('');
    }
  };

  const isSlotBlocked = (slot: string) =>
    Boolean(selectedDateKey && blockedHoursByDate[selectedDateKey]?.[slot]);

  const weekdayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

  const renderCalendarDay = (day: Date) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    const isPast = isBefore(day, today);
    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
    const hasBlocked = (blockedCountByDate[dayKey] || 0) > 0;
    const weekdayLabel = t(
      `ownerDashboard.availabilityManager.weekdayLabels.${weekdayKeys[day.getDay()]}`
    );

    return (
      <MiniCalendarDay
        key={day.toISOString()}
        date={day}
        disabled={isPast}
        className={cn(
          'flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-full text-sm font-semibold transition-all',
          isPast && 'cursor-not-allowed opacity-40',
          !isPast && !isSelected && 'hover:bg-muted',
          isSelected && 'bg-primary text-primary-foreground shadow',
          hasBlocked && !isSelected && 'ring-1 ring-destructive/50'
        )}
        renderContent={() => (
          <>
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {weekdayLabel}
            </span>
            <span className="text-lg font-semibold leading-none">
              {format(day, 'd', { locale: dateLocale })}
            </span>
          </>
        )}
        indicator={
          hasBlocked ? (
            <span
              className={cn(
                'mt-1 h-1.5 w-1.5 rounded-full bg-destructive',
                isSelected && 'bg-white'
              )}
            />
          ) : undefined
        }
      />
    );
  };

  const blockedRanges = useMemo(() => {
    if (!selectedDateKey || !selectedDate) return [];

    return blockedHoursForDay
      .slice()
      .sort((a, b) => normalizeTimeKey(a.start_time).localeCompare(normalizeTimeKey(b.start_time)))
      .map((hour) => {
        const start = parse(normalizeTimeKey(hour.start_time), 'HH:mm', selectedDate);
        const end =
          hour.end_time != null && hour.end_time !== ''
            ? parse(normalizeTimeKey(hour.end_time), 'HH:mm', selectedDate)
            : addHours(start, 1);
        return {
          id: hour.id,
          slot: normalizeTimeKey(hour.start_time),
          label: `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`,
        };
      });
  }, [blockedHoursForDay, selectedDate, selectedDateKey]);

  const renderSlots = () => {
    if (!selectedDate) {
      return (
        <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          <Clock className="mb-2 h-5 w-5" />
          {t('ownerDashboard.availabilityManager.selectDatePrompt')}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {t('ownerDashboard.availabilityManager.rangeSelectLabel')}
          </Label>
          <Select
            value={selectedSlot || undefined}
            onValueChange={(value) => {
              void handleRangeSelect(value);
            }}
          >
            <SelectTrigger className="h-12 text-left">
              <SelectValue
                placeholder={t('ownerDashboard.availabilityManager.rangeSelectPlaceholder')}
              />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => {
                const startDateTime = parse(slot.value, 'HH:mm', selectedDate);
                const endDateTime = addHours(startDateTime, 1);
                const blocked = isSlotBlocked(slot.value);
                const isTodaySelected = isSameDay(selectedDate, today);
                const isPastSlot = isTodaySelected && isBefore(startDateTime, new Date());
                const disabled =
                  blocked ||
                  isPastSlot ||
                  (pendingSlot === slot.value &&
                    (createMutation.isPending || deleteMutation.isPending));
                return (
                  <SelectItem key={slot.value} value={slot.value} disabled={disabled}>
                    <span
                      className={cn(
                        'flex items-center justify-between',
                        blocked ? 'text-destructive' : undefined
                      )}
                    >
                      <span>
                        {format(startDateTime, 'h:mm a')} - {format(endDateTime, 'h:mm a')}
                      </span>
                      {blocked && (
                        <span className="ml-3 text-xs uppercase tracking-wide">
                          {t('ownerDashboard.availabilityManager.blockedTag')}
                        </span>
                      )}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('ownerDashboard.availabilityManager.unavailableListTitle')}
          </h5>
          {blockedRanges.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {t('ownerDashboard.availabilityManager.unavailableListEmpty')}
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {blockedRanges.map((range) => {
                const isProcessing =
                  pendingSlot === range.slot &&
                  (createMutation.isPending || deleteMutation.isPending);
                return (
                  <li
                    key={range.id}
                    className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    <span>{range.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs font-semibold uppercase tracking-wide text-destructive hover:text-destructive"
                      onClick={() => handleToggleSlot(range.slot)}
                      disabled={isProcessing}
                    >
                      {t('ownerDashboard.availabilityManager.unblockAction')}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="gap-4 sm:gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl sm:text-2xl">
              {t('ownerDashboard.availabilityManager.title')}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('ownerDashboard.availabilityManager.subtitle')}
            </p>
          </div>
          {spaces.length > 0 && (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Label htmlFor="space-selector" className="text-sm text-muted-foreground">
                {t('ownerDashboard.availabilityManager.spaceLabel')}
              </Label>
              <Select value={selectedSpaceId ?? undefined} onValueChange={setSelectedSpaceId}>
                <SelectTrigger id="space-selector" className="min-w-[220px]">
                  <SelectValue
                    placeholder={t('ownerDashboard.availabilityManager.spacePlaceholder')}
                  />
                </SelectTrigger>
                <SelectContent>
                  {spaces.map((space) => (
                    <SelectItem key={space.id} value={space.id}>
                      {space.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        {selectedSpace && (
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>{t('ownerDashboard.availabilityManager.timezoneLabel', { timezone })}</span>
            </div>
            <div>
              <span className="font-medium text-foreground">{selectedSpace.title}</span>
              {selectedSpace.city ? (
                <span className="ml-2 text-muted-foreground">· {selectedSpace.city}</span>
              ) : null}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {spaces.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t('ownerDashboard.availabilityManager.noSpaces')}
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="space-y-4 rounded-xl border bg-muted/20 p-6 lg:w-80">
              <h3 className="text-lg font-semibold text-foreground">
                {t('ownerDashboard.availabilityManager.instructionsTitle')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('ownerDashboard.availabilityManager.instructionsSubtitle')}
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>{t('ownerDashboard.availabilityManager.instructions.select')}</li>
                <li>{t('ownerDashboard.availabilityManager.instructions.toggle')}</li>
                <li>{t('ownerDashboard.availabilityManager.instructions.instant')}</li>
              </ul>
            </div>

            <div className="flex flex-1 flex-col gap-6">
              <div className="rounded-xl border p-5">
                <MiniCalendar
                  className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border bg-card px-6 py-4 shadow-sm"
                  value={selectedDate ?? undefined}
                  onValueChange={handleCalendarValueChange}
                  startDate={calendarStart}
                  onStartDateChange={(date) => {
                    if (date) {
                      setCalendarStart(startOfWeek(date, { weekStartsOn: 1 }));
                    }
                  }}
                  days={DAYS_IN_VIEW}
                >
                  <div className="flex w-full items-center justify-between gap-6">
                    <MiniCalendarNavigation
                      direction="prev"
                      aria-label={t('ownerDashboard.availabilityManager.prevMonth')}
                      className="h-9 w-9 rounded-full border bg-background"
                    />
                    <div className="flex-1 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {rangeLabel}
                    </div>
                    <MiniCalendarNavigation
                      direction="next"
                      aria-label={t('ownerDashboard.availabilityManager.nextMonth')}
                      className="h-9 w-9 rounded-full border bg-background"
                    />
                  </div>
                  <MiniCalendarDays className="flex items-center justify-center gap-4">
                    {(day) => renderCalendarDay(day)}
                  </MiniCalendarDays>
                </MiniCalendar>

                {(isBlockedLoading || isBlockedFetching) && (
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    {t('ownerDashboard.availabilityManager.loading')}
                  </p>
                )}
              </div>

              <div className="rounded-xl border p-5">
                <div className="mb-4">
                  <h4 className="text-base font-semibold uppercase tracking-wide text-primary">
                    {selectedDateLabel ?? t('ownerDashboard.availabilityManager.slotsTitle')}
                  </h4>
                </div>
                {renderSlots()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
