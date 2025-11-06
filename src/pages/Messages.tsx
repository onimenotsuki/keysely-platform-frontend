import ChatWindow from '@/components/chat/ChatWindow';
import ConversationsList from '@/components/chat/ConversationsList';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { MessageCircle } from 'lucide-react';
import React, { useState } from 'react';

const Messages = () => {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const { data: conversations } = useConversations();

  const selectedConversation = conversations?.find((c) => c.id === selectedConversationId);

  interface ConversationType {
    owner_id: string;
    user_profile?: { full_name?: string };
    owner_profile?: { full_name?: string };
    space?: { title?: string };
  }

  const getRecipientInfo = (conversation: ConversationType) => {
    const isOwner = user?.id === conversation.owner_id;
    const otherProfile = isOwner ? conversation.user_profile : conversation.owner_profile;
    return {
      name: otherProfile?.full_name || 'Usuario',
      spaceName: conversation.space?.title || 'Espacio',
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mensajes</h1>
          <p className="text-muted-foreground">Conversa con propietarios y usuarios</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 p-4">
            <div className="mb-4">
              <h2 className="font-semibold flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Conversaciones
              </h2>
            </div>
            <ConversationsList
              selectedConversationId={selectedConversationId}
              onConversationSelect={setSelectedConversationId}
            />
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <ChatWindow
                conversationId={selectedConversation.id}
                recipientName={getRecipientInfo(selectedConversation).name}
                spaceName={getRecipientInfo(selectedConversation).spaceName}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecciona una conversación para comenzar</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
