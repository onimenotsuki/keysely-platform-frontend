import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
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
    mutationFn: async ({
      booking_id,
      space_id,
    }: CreatePaymentRequest): Promise<PaymentResponse> => {
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase.functions.invoke('create-marketplace-payment', {
        body: { booking_id, space_id },
      });

      if (error) {
        if (error instanceof FunctionsHttpError) {
          let message = 'Error creating payment session';
          try {
            const details = await error.context.json();
            message = details?.error ?? details?.message ?? message;
          } catch {
            // ignore parsing issues
          }
          throw new Error(message);
        }
        if (error instanceof FunctionsRelayError || error instanceof FunctionsFetchError) {
          throw new Error(error.message);
        }
        throw error;
      }
      return data as PaymentResponse;
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
      toast.error(error.message || 'Error al crear el pago');
    },
  });

  return {
    createPayment: createPayment.mutate,
    isCreatingPayment: createPayment.isPending,
    paymentError: createPayment.error,
  };
};
