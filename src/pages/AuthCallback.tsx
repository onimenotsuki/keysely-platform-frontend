import { useAuth } from '@/contexts/AuthContext';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const { language } = useLanguageContext();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!loading) {
        if (session?.user?.id) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('onboarding_completed')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (profileError) {
              console.error('Error checking onboarding status:', profileError);
              navigate(`/${language}`);
            } else if (profile?.onboarding_completed) {
              navigate(`/${language}`);
            } else {
              localStorage.setItem('onboarding_started', 'true');
              navigate('/onboarding');
            }
          } catch (error) {
            console.error('Error in onboarding check:', error);
            navigate(`/${language}`);
          }
        } else {
          // If loading finished and no session, wait a bit then redirect to auth
          const timer = setTimeout(() => {
            if (!session) {
              navigate('/auth');
            }
          }, 2000);
          return () => clearTimeout(timer);
        }
      }
    };

    handleRedirect();
  }, [session, loading, navigate, language]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-gray-600 font-medium">Verifying your login...</p>
    </div>
  );
};

export default AuthCallback;
