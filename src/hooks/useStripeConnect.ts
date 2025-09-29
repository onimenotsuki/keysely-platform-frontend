import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ConnectAccountStatus {
  has_account: boolean;
  account_id?: string;
  account_enabled: boolean;
  details_submitted?: boolean;
  charges_enabled?: boolean;
  payouts_enabled?: boolean;
  needs_onboarding: boolean;
  onboarding_url?: string;
}

export const useStripeConnect = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query to check Connect account status
  const {
    data: connectStatus,
    isLoading: isLoadingStatus,
    error: statusError,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ['stripe-connect-status', user?.id],
    queryFn: async (): Promise<ConnectAccountStatus> => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.functions.invoke('check-connect-status');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 30000, // 30 seconds
  });

  // Mutation to create Connect account
  const createConnectAccount = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.functions.invoke('create-connect-account');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stripe-connect-status'] });
      toast.success('Cuenta de Stripe creada exitosamente');
      
      // Open onboarding in new tab
      if (data.onboarding_url) {
        window.open(data.onboarding_url, '_blank');
      }
    },
    onError: (error: Error) => {
      console.error('Error creating Connect account:', error);
      toast.error(`Error al crear cuenta de Stripe: ${error.message}`);
    },
  });

  // Function to start onboarding
  const startOnboarding = () => {
    if (connectStatus?.onboarding_url) {
      window.open(connectStatus.onboarding_url, '_blank');
    } else if (!connectStatus?.has_account) {
      createConnectAccount.mutate();
    }
  };

  // Check if user can receive payments
  const canReceivePayments = connectStatus?.account_enabled || false;

  return {
    connectStatus,
    isLoadingStatus,
    statusError,
    refetchStatus,
    createConnectAccount: createConnectAccount.mutate,
    isCreatingAccount: createConnectAccount.isPending,
    startOnboarding,
    canReceivePayments,
  };
};