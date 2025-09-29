import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateConversation } from '@/hooks/useConversations';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ContactOwnerButtonProps {
  spaceId: string;
  ownerId: string;
  className?: string;
}

const ContactOwnerButton: React.FC<ContactOwnerButtonProps> = ({
  spaceId,
  ownerId,
  className
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createConversation = useCreateConversation();

  const handleContact = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (user.id === ownerId) {
      toast({
        title: 'No puedes contactarte a ti mismo',
        description: 'Este es tu propio espacio',
        variant: 'destructive'
      });
      return;
    }

    try {
      const conversation = await createConversation.mutateAsync({
        space_id: spaceId,
        owner_id: ownerId
      });

      navigate('/messages');
      
      toast({
        title: 'Conversación iniciada',
        description: 'Ahora puedes enviar mensajes al propietario'
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'No se pudo iniciar la conversación. Inténtalo de nuevo.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Button
      onClick={handleContact}
      className={className}
      disabled={createConversation.isPending}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      {createConversation.isPending ? 'Iniciando...' : 'Contactar Propietario'}
    </Button>
  );
};

export default ContactOwnerButton;