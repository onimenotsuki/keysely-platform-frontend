import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator';
import { StepOccupation } from '@/components/onboarding/StepOccupation';
import { StepBirthday } from '@/components/onboarding/StepBirthday';
import { StepAddress } from '@/components/onboarding/StepAddress';
import { StepBio } from '@/components/onboarding/StepBio';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import logoImage from '../assets/logo.png';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const {
    currentStep,
    totalSteps,
    formData,
    isLoading,
    updateFormData,
    nextStep,
    prevStep,
    clearProgress,
    validateStep,
    canProceed,
    markStarted,
  } = useOnboardingProgress();

  const [validationError, setValidationError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mark onboarding as started when component mounts
  useEffect(() => {
    markStarted();
  }, [markStarted]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleNext = () => {
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }
    setValidationError(undefined);
    nextStep();
  };

  const handleBack = () => {
    setValidationError(undefined);
    prevStep();
  };

  const handleSkip = () => {
    // Only allow skipping on optional steps (3 and 4)
    if (currentStep === 3 || currentStep === 4) {
      setValidationError(undefined);
      nextStep();
    }
  };

  const handleComplete = async () => {
    // Validate all required steps
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    setIsSubmitting(true);
    setValidationError(undefined);

    try {
      if (!user) throw new Error('User not authenticated');

      // Update user profile with onboarding data
      const { error } = await supabase
        .from('profiles')
        .update({
          occupation: formData.occupation,
          date_of_birth: formData.dateOfBirth,
          address: formData.address.streetAddress ? formData.address : null,
          bio: formData.bio || null,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Clear localStorage after successful submission
      clearProgress();
      localStorage.removeItem('onboarding_started');

      toast({
        title: '¡Perfil completado!',
        description: 'Tu perfil ha sido configurado exitosamente',
      });

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error al guardar',
        description: 'Hubo un problema al guardar tu información. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOccupation
            value={formData.occupation}
            onChange={(value) => updateFormData({ occupation: value })}
            error={validationError}
          />
        );
      case 2:
        return (
          <StepBirthday
            value={formData.dateOfBirth}
            onChange={(value) => updateFormData({ dateOfBirth: value })}
            error={validationError}
          />
        );
      case 3:
        return (
          <StepAddress
            value={formData.address}
            onChange={(value) => updateFormData({ address: value })}
          />
        );
      case 4:
        return (
          <StepBio value={formData.bio} onChange={(value) => updateFormData({ bio: value })} />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <Loader2 className="h-8 w-8 animate-spin text-[#1A2B42]" />
      </div>
    );
  }

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;
  const isOptionalStep = currentStep === 3 || currentStep === 4;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with logo and progress */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={logoImage} alt="Keysely Logo" className="h-8 w-auto" />
          <div className="text-sm text-gray-600">
            {t('onboarding.step', { current: currentStep, total: totalSteps })}
          </div>
        </div>
      </div>

      {/* Main Content - Full Screen */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Step Content */}
          <div className="mb-12">{renderStep()}</div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-3">
              {!isFirstStep && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="underline text-gray-700 hover:text-gray-900 font-semibold"
                >
                  {t('onboarding.back')}
                </Button>
              )}
            </div>

            <div className="flex gap-3 ml-auto">
              {isOptionalStep && (
                <Button
                  variant="ghost"
                  onClick={isLastStep ? handleComplete : handleSkip}
                  disabled={isSubmitting}
                  className="underline text-gray-700 hover:text-gray-900 font-semibold"
                >
                  {t('onboarding.skip')}
                </Button>
              )}

              {isLastStep ? (
                <Button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-[#3B82F6] text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('onboarding.complete')}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className="bg-primary hover:bg-[#3B82F6] text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('onboarding.continue')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator at bottom */}
      <div className="border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
