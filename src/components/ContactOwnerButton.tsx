import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useCreateConversation } from '@/hooks/useConversations';
import { MessageCircle } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ContactOwnerButtonProps {
  spaceId: string;
  ownerId: string;
  className?: string;
}

const ContactOwnerButton: React.FC<ContactOwnerButtonProps> = ({ spaceId, ownerId, className }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createConversation = useCreateConversation();
  const { language } = useLanguageContext();

  const handleContact = async () => {
    if (!user) {
      navigate(`/${language}/auth`);
      return;
    }

    if (user.id === ownerId) {
      toast({
        title: 'No puedes contactarte a ti mismo',
        description: 'Este es tu propio espacio',
        variant: 'destructive',
      });
      return;
    }

    try {
      const conversation = await createConversation.mutateAsync({
        space_id: spaceId,
        owner_id: ownerId,
      });

      navigate(`/${language}/messages`);

      toast({
        title: 'Conversación iniciada',
        description: 'Ahora puedes enviar mensajes al propietario',
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'No se pudo iniciar la conversación. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleContact} className={className} disabled={createConversation.isPending}>
      <MessageCircle className="mr-2 h-4 w-4" />
      {createConversation.isPending ? 'Iniciando...' : 'Contactar Propietario'}
    </Button>
  );
};

export default ContactOwnerButton;
