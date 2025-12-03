import { useTranslation } from '@/hooks/useTranslation';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  const { t } = useTranslation();

  const steps = [
    { number: 1, label: t('onboarding.occupation.label') },
    { number: 2, label: t('onboarding.birthday.label') },
    { number: 3, label: t('onboarding.address.label') },
    { number: 4, label: t('onboarding.bio.label') },
  ];

  const getStepCircleClasses = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      return 'border-[#3B82F6] bg-[#3B82F6] text-white';
    }
    if (stepNumber === currentStep) {
      return 'border-[#3B82F6] bg-white text-[#3B82F6] ring-4 ring-[#3B82F6]/20';
    }
    return 'border-gray-300 bg-white text-gray-400';
  };

  const getStepLabelClasses = (stepNumber: number) => {
    if (stepNumber === currentStep) {
      return 'font-semibold text-[#1A2B42]';
    }
    if (stepNumber < currentStep) {
      return 'text-gray-600';
    }
    return 'text-gray-400';
  };

  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="relative px-4">
        {/* Background line - full width */}
        <div
          className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300"
          style={{ marginLeft: '8.33%', marginRight: '8.33%' }}
        />

        {/* Progress line - grows with completion */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-[#3B82F6] transition-all duration-500"
          style={{
            marginLeft: '8.33%',
            width: `${((currentStep - 1) / (totalSteps - 1)) * 83.34}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex items-center justify-between mb-2">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              {/* Step circle */}
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-all duration-300 ${getStepCircleClasses(step.number)}`}
              >
                {step.number < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.number}</span>
                )}
              </div>

              {/* Step label - hidden on mobile, shown on larger screens */}
              <div className="mt-2 hidden md:block">
                <p
                  className={`text-xs text-center whitespace-nowrap ${getStepLabelClasses(step.number)}`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step counter */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          {t('onboarding.step', { current: currentStep, total: totalSteps })}
        </p>
      </div>
    </div>
  );
};
