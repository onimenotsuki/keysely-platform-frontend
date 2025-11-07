import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking onboarding status:', error);
          // If there's an error, allow access (fail-open for better UX)
          setOnboardingCompleted(true);
        } else {
          setOnboardingCompleted(data?.onboarding_completed || false);
        }
      } catch (error) {
        console.error('Error in onboarding check:', error);
        // If there's an error, allow access
        setOnboardingCompleted(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      checkOnboardingStatus();
    }
  }, [user, authLoading]);

  // Show loading spinner while checking auth or onboarding status
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1A2B42]" />
      </div>
    );
  }

  // If user is authenticated but hasn't completed onboarding, redirect to onboarding
  if (user && onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />;
  }

  // Otherwise, render the protected content
  return <>{children}</>;
};
