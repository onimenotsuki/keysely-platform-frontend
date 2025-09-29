import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Conversation {
  id: string;
  space_id: string;
  user_id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  space?: {
    title: string;
    images: string[];
  };
  user_profile?: {
    full_name: string;
    avatar_url: string;
  };
  owner_profile?: {
    full_name: string;
    avatar_url: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count?: number;
}

export const useConversations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`user_id.eq.${user.id},owner_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get additional data for each conversation
      const conversationsWithMessages = await Promise.all(
        data.map(async (conversation) => {
          // Get space info
          const { data: space } = await supabase
            .from('spaces')
            .select('title, images')
            .eq('id', conversation.space_id)
            .single();

          // Get user profile
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', conversation.user_id)
            .single();

          // Get owner profile
          const { data: ownerProfile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', conversation.owner_id)
            .single();

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .eq('is_read', false)
            .neq('sender_id', user.id);

          return {
            ...conversation,
            space: space || undefined,
            user_profile: userProfile || undefined,
            owner_profile: ownerProfile || undefined,
            last_message: lastMessage || undefined,
            unread_count: unreadCount || 0
          };
        })
      );

      return conversationsWithMessages;
    },
    enabled: !!user
  });
};

export interface CreateConversationData {
  space_id: string;
  owner_id: string;
}

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateConversationData) => {
      if (!user) throw new Error('User not authenticated');

      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('*')
        .eq('space_id', data.space_id)
        .eq('user_id', user.id)
        .eq('owner_id', data.owner_id)
        .single();

      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          space_id: data.space_id,
          user_id: user.id,
          owner_id: data.owner_id
        })
        .select()
        .single();

      if (error) throw error;
      return newConversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};