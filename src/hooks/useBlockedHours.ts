import {
  createBlockedHour,
  deleteBlockedHour,
  fetchBlockedHoursByRange,
  type BlockedHour,
  type CreateBlockedHourPayload,
} from '@/integrations/supabase/blockedHours';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addMonths, endOfDay, endOfMonth, format, startOfDay, startOfMonth } from 'date-fns';
import { useMemo } from 'react';

const formatMonthKey = (date: Date) => format(date, 'yyyy-MM');

export const useBlockedHours = (spaceId: string | null, month: Date) => {
  const range = useMemo(() => {
    const rangeStart = startOfMonth(month);
    const rangeEnd = endOfMonth(month);

    return {
      rangeStart,
      rangeEnd,
      startDate: format(rangeStart, 'yyyy-MM-dd'),
      endDate: format(rangeEnd, 'yyyy-MM-dd'),
    };
  }, [month]);

  return useQuery({
    queryKey: ['blocked-hours', spaceId, formatMonthKey(month)],
    queryFn: async () => {
      if (!spaceId) return [] as BlockedHour[];

      return fetchBlockedHoursByRange(spaceId, range.startDate, range.endDate);
    },
    enabled: Boolean(spaceId),
    staleTime: 1000 * 60 * 5,
    meta: {
      rangeStart: range.rangeStart,
      rangeEnd: range.rangeEnd,
    },
  });
};

export const useBlockedHoursRange = (spaceId: string | null, start: Date, end: Date) => {
  const range = useMemo(() => {
    const rangeStart = startOfDay(start);
    const rangeEnd = endOfDay(end);

    return {
      rangeStart,
      rangeEnd,
      startDate: format(rangeStart, 'yyyy-MM-dd'),
      endDate: format(rangeEnd, 'yyyy-MM-dd'),
    };
  }, [start, end]);

  return useQuery({
    queryKey: [
      'blocked-hours-range',
      spaceId,
      format(range.rangeStart, 'yyyy-MM-dd'),
      format(range.rangeEnd, 'yyyy-MM-dd'),
    ],
    queryFn: async () => {
      if (!spaceId) return [] as BlockedHour[];

      return fetchBlockedHoursByRange(spaceId, range.startDate, range.endDate);
    },
    enabled: Boolean(spaceId),
    staleTime: 1000 * 60 * 5,
    meta: {
      rangeStart: range.rangeStart,
      rangeEnd: range.rangeEnd,
    },
  });
};

const invalidateBlockedHours = (
  queryClient: ReturnType<typeof useQueryClient>,
  spaceId: string,
  date: Date
) => {
  const monthKey = formatMonthKey(startOfMonth(date));
  queryClient.invalidateQueries({ queryKey: ['blocked-hours', spaceId, monthKey] });

  // Optimistically invalidate surrounding months to keep adjacent navigation fresh
  const prevMonthKey = formatMonthKey(startOfMonth(addMonths(date, -1)));
  const nextMonthKey = formatMonthKey(startOfMonth(addMonths(date, 1)));

  queryClient.invalidateQueries({
    queryKey: ['blocked-hours', spaceId, prevMonthKey],
    exact: true,
  });
  queryClient.invalidateQueries({
    queryKey: ['blocked-hours', spaceId, nextMonthKey],
    exact: true,
  });
  queryClient.invalidateQueries({
    queryKey: ['blocked-hours-range', spaceId],
    exact: false,
  });
};

export const useCreateBlockedHour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBlockedHourPayload) => {
      const data = await createBlockedHour(payload);
      return data;
    },
    onSuccess: (data) => {
      invalidateBlockedHours(queryClient, data.space_id, new Date(data.blocked_date));
    },
  });
};

export const useDeleteBlockedHour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; spaceId: string; blockedDate: string }) => {
      await deleteBlockedHour(input.id);
      return input;
    },
    onSuccess: ({ spaceId, blockedDate }) => {
      invalidateBlockedHours(queryClient, spaceId, new Date(blockedDate));
    },
  });
};
