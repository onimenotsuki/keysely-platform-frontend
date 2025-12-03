import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setIsCheckingOnboarding(false);
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
        setIsCheckingOnboarding(false);
      }
    };

    if (!authLoading) {
      checkOnboardingStatus();
    }
  }, [user, authLoading]);

  // Show loading spinner while checking authentication or onboarding
  if (authLoading || isCheckingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1A2B42]" />
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated but onboarding not completed, redirect to onboarding
  if (user && onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />;
  }

  // User is authenticated and has completed onboarding
  return <>{children}</>;
};

export default ProtectedRoute;
