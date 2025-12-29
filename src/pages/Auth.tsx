import { Logo } from '@/components/layout/Header/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type AuthStep = 'email' | 'otp';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const { signInWithOtp, verifyOtp, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const from = location.state?.from?.pathname || '/';

  // Handle automatic redirect if session exists (e.g. Magic Link)
  useEffect(() => {
    if (session) {
      navigate(from, { replace: true });
    }
  }, [session, navigate, from]);

  // Helper to handle successful login redirection
  const handleLoginSuccess = async (userId?: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking onboarding status:', profileError);
        navigate(from, { replace: true });
      } else if (profile?.onboarding_completed) {
        navigate(from, { replace: true });
      } else {
        localStorage.setItem('onboarding_started', 'true');
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error in onboarding check:', error);
      navigate(from, { replace: true });
    }
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Existence check limitation:
    // We proceed with signInWithOtp directly as we cannot securely check existence from frontend
    // without leaking email information. Supabase will handle user creation/login.

    const { error } = await signInWithOtp(email);

    if (error) {
      toast({
        title: t('auth.signInError'),
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    } else {
      toast({
        title: t('auth.checkEmail'),
        description: t('auth.emailSentDescription'),
      });
      setStep('otp');
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (code.length !== 6) return;

    setIsLoading(true);
    const { error, data } = await verifyOtp(email, code);

    if (error) {
      toast({
        title: t('auth.signInError'),
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
      setOtpCode('');
    } else {
      toast({
        title: t('auth.welcome'),
        description: t('auth.signInSuccess'),
      });

      if (data?.user?.id) {
        await handleLoginSuccess(data.user.id);
      } else {
        navigate(from, { replace: true });
      }
      setIsLoading(false);
    }
  };

  // Auto-submit OTP when 6 digits are filled
  useEffect(() => {
    if (otpCode.length === 6) {
      handleVerifyOtp(otpCode);
    }
  }, [otpCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      {/* Close/Back button */}
      <button
        onClick={() => {
          if (step === 'otp') {
            setStep('email');
            setOtpCode('');
          } else {
            navigate('/');
          }
        }}
        className="fixed top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        disabled={isLoading}
      >
        <ArrowLeft className="h-6 w-6 text-gray-700" />
      </button>

      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex justify-center">
            <Logo isScrolled={true} size="sm" />
          </div>
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            {step === 'email' ? t('auth.title') : t('auth.enterCode')}
          </h1>
          {step === 'otp' && (
            <p className="text-center text-sm text-gray-500">
              {t('auth.sentCodeTo')} <span className="font-medium text-gray-900">{email}</span>
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'email' ? (
            <form onSubmit={handleSendLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {t('auth.email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 pl-10 border-gray-300 rounded-lg focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-[#3B82F6] text-white font-semibold rounded-lg text-base shadow-md hover:shadow-lg transition-all duration-300"
                disabled={isLoading || !email}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {t('auth.continue')}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 flex flex-col items-center">
              <div className="flex justify-center w-full">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={(value) => setOtpCode(value)}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <p className="text-xs text-center text-gray-500">{t('auth.checkSpamFolder')}</p>

              <Button
                variant="ghost"
                className="text-sm text-primary hover:text-primary/90"
                onClick={() => setStep('email')}
                disabled={isLoading}
              >
                {t('auth.tryDifferentEmail')}
              </Button>
            </div>
          )}

          {step === 'email' && (
            <>
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">{t('auth.or')}</span>
                </div>
              </div>

              {/* Social Login Buttons - Keeping these enabled/disabled same as before */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled
                  className="w-full h-12 flex items-center justify-center gap-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t('auth.continueWithGoogle')}
                </button>

                <button
                  type="button"
                  disabled
                  className="w-full h-12 flex items-center justify-center gap-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  {t('auth.continueWithApple')}
                </button>

                <button
                  type="button"
                  disabled
                  className="w-full h-12 flex items-center justify-center gap-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  {t('auth.continueWithFacebook')}
                </button>
              </div>
            </>
          )}

          <p className="text-xs text-gray-600 leading-relaxed text-center mt-6">
            {t('auth.termsText')}{' '}
            <button type="button" className="font-semibold underline hover:text-[#1A2B42]">
              {t('auth.termsLink')}
            </button>{' '}
            {t('auth.and')}{' '}
            <button type="button" className="font-semibold underline hover:text-[#1A2B42]">
              {t('auth.privacyLink')}
            </button>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
