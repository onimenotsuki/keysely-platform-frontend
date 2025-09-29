import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'review' | 'message' | 'system';
  is_read: boolean;
  created_at: string;
  related_id?: string; // Could be booking_id, message_id, etc.
}

export interface CreateNotificationData {
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'review' | 'message' | 'system';
  related_id?: string;
}

// Hook para obtener notificaciones del usuario
export const useNotifications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async (): Promise<Notification[]> => {
      if (!user) throw new Error('User not authenticated');
      
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        return (data || []) as Notification[];
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

// Hook para obtener notificaciones no leídas
export const useUnreadNotifications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['unread-notifications', user?.id],
    queryFn: async (): Promise<number> => {
      if (!user) throw new Error('User not authenticated');
      
      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
        return 0;
      }
    },
    enabled: !!user,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
};

// Hook para marcar notificación como leída
export const useMarkNotificationAsRead = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
    },
    onError: (error: Error) => {
      console.error('Error marking notification as read:', error);
      toast.error('Error al marcar notificación como leída');
    },
  });
};

// Hook para marcar todas las notificaciones como leídas
export const useMarkAllNotificationsAsRead = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
      toast.success('Todas las notificaciones marcadas como leídas');
    },
    onError: (error: Error) => {
      console.error('Error marking all notifications as read:', error);
      toast.error('Error al marcar notificaciones como leídas');
    },
  });
};

// Hook para crear una notificación (principalmente para uso administrativo)
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationData: CreateNotificationData) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select()
        .single();
      
      if (error) throw error;
      return data as Notification;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications', data.user_id] });
    },
    onError: (error: Error) => {
      console.error('Error creating notification:', error);
      toast.error('Error al crear notificación');
    },
  });
};

// Hook para escuchar notificaciones en tiempo real
export const useNotificationSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!user) return;
    
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Invalidate queries to refetch notifications
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
          
          // Show toast notification
          const newNotification = payload.new as Notification;
          toast.info(newNotification.title, {
            description: newNotification.message,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch when notifications are updated (marked as read, etc.)
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, queryClient]);
};