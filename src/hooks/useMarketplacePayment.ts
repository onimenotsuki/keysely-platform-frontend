import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CreatePaymentRequest {
  booking_id: string;
  space_id: string;
}

interface PaymentResponse {
  session_id: string;
  checkout_url: string;
  total_amount: number;
  platform_fee: number;
  owner_amount: number;
}

export const useMarketplacePayment = () => {
  const { user } = useAuth();

  const createPayment = useMutation({
    mutationFn: async ({ booking_id, space_id }: CreatePaymentRequest): Promise<PaymentResponse> => {
      if (!user) throw new Error('Usuario no autenticado');
      
      const { data, error } = await supabase.functions.invoke('create-marketplace-payment', {
        body: { booking_id, space_id },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success('Sesión de pago creada exitosamente');
      
      // Redirect to Stripe Checkout in new tab
      if (data.checkout_url) {
        window.open(data.checkout_url, '_blank');
      }
    },
    onError: (error: Error) => {
      console.error('Error creating payment:', error);
      toast.error(`Error al crear el pago: ${error.message}`);
    },
  });

  return {
    createPayment: createPayment.mutate,
    isCreatingPayment: createPayment.isPending,
    paymentError: createPayment.error,
  };
};