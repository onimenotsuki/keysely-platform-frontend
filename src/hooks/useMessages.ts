import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_profile?: {
    full_name: string;
    avatar_url: string;
  };
}

export const useMessages = (conversationId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get sender profiles for each message
      const messagesWithProfiles = await Promise.all(
        data.map(async (message) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', message.sender_id)
            .single();

          return {
            ...message,
            sender_profile: senderProfile || undefined
          };
        })
      );

      return messagesWithProfiles as Message[];
    },
    enabled: !!conversationId
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          // Get sender profile for the new message
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', payload.new.sender_id)
            .single();

          const newMessage: Message = {
            ...payload.new,
            sender_profile: senderProfile || undefined
          } as Message;

          // Update the query cache
          queryClient.setQueryData(['messages', conversationId], (oldMessages: Message[] | undefined) => {
            if (!oldMessages) return [newMessage];
            return [...oldMessages, newMessage];
          });

          // Update conversations cache to reflect new message
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user, queryClient]);

  return query;
};

export interface SendMessageData {
  conversation_id: string;
  content: string;
}

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: SendMessageData) => {
      if (!user) throw new Error('User not authenticated');

      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: data.conversation_id,
          sender_id: user.id,
          content: data.content
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', data.conversation_id);

      return message;
    },
    onSuccess: (_, variables) => {
      // The real-time subscription will handle updating the messages
      // But we'll also invalidate conversations to update the timestamp
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};