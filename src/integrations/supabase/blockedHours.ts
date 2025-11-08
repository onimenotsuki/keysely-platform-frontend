import { supabase } from './client';
import type { Database } from './types';

export type BlockedHour = Database['public']['Tables']['blocked_hours']['Row'];
export type CreateBlockedHourPayload = Database['public']['Tables']['blocked_hours']['Insert'];

export async function fetchBlockedHoursByRange(
  spaceId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from('blocked_hours')
    .select('*')
    .eq('space_id', spaceId)
    .gte('blocked_date', startDate)
    .lte('blocked_date', endDate)
    .order('blocked_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    throw error;
  }

  return data as BlockedHour[];
}

export async function createBlockedHour(payload: CreateBlockedHourPayload) {
  const { data, error } = await supabase.from('blocked_hours').insert(payload).select().single();

  if (error) {
    throw error;
  }

  return data as BlockedHour;
}

export async function deleteBlockedHour(id: string) {
  const { error } = await supabase.from('blocked_hours').delete().eq('id', id);

  if (error) {
    throw error;
  }
}
