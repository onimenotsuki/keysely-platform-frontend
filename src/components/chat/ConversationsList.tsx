import React from 'react';
import { useConversations } from '@/hooks/useConversations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';

interface ConversationsListProps {
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  selectedConversationId,
  onConversationSelect
}) => {
  const { user } = useAuth();
  const { data: conversations, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!conversations?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No tienes conversaciones aún</p>
        <p className="text-sm mt-2">Contacta a propietarios desde los espacios que te interesen</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isOwner = user?.id === conversation.owner_id;
        const otherProfile = isOwner ? conversation.user_profile : conversation.owner_profile;
        const otherName = otherProfile?.full_name || 'Usuario';
        const avatarUrl = otherProfile?.avatar_url;
        
        const isSelected = selectedConversationId === conversation.id;
        const hasUnread = conversation.unread_count && conversation.unread_count > 0;

        return (
          <Card
            key={conversation.id}
            className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
              isSelected ? 'bg-muted border-primary' : ''
            }`}
            onClick={() => onConversationSelect(conversation.id)}
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatarUrl || ''} />
                <AvatarFallback>
                  {otherName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium truncate ${hasUnread ? 'font-semibold' : ''}`}>
                    {otherName}
                  </h3>
                  {conversation.last_message && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conversation.last_message.created_at), {
                        addSuffix: true,
                        locale: es
                      })}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.space?.title}
                </p>
                
                {conversation.last_message && (
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-sm truncate ${hasUnread ? 'font-medium' : 'text-muted-foreground'}`}>
                      {conversation.last_message.sender_id === user?.id ? 'Tú: ' : ''}
                      {conversation.last_message.content}
                    </p>
                    {hasUnread && (
                      <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ConversationsList;