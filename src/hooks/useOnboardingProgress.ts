import { useState, useEffect, useCallback } from 'react';

export interface AddressData {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OnboardingData {
  occupation: string;
  dateOfBirth: string;
  address: AddressData;
  bio: string;
}

interface OnboardingProgress {
  currentStep: number;
  data: OnboardingData;
  isCompleted: boolean;
}

const STORAGE_KEY = 'keysely_onboarding_progress';
const TOTAL_STEPS = 4;

const initialData: OnboardingData = {
  occupation: '',
  dateOfBirth: '',
  address: {
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  },
  bio: '',
};

export const useOnboardingProgress = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const progress: OnboardingProgress = JSON.parse(saved);
        setCurrentStep(progress.currentStep);
        setFormData(progress.data);
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  const saveProgress = useCallback((step: number, data: OnboardingData) => {
    try {
      const progress: OnboardingProgress = {
        currentStep: step,
        data,
        isCompleted: false,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }
  }, []);

  // Update form data and save progress
  const updateFormData = useCallback(
    (updates: Partial<OnboardingData>) => {
      setFormData((prev) => {
        const newData = { ...prev, ...updates };
        saveProgress(currentStep, newData);
        return newData;
      });
    },
    [currentStep, saveProgress]
  );

  // Navigate to next step
  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      saveProgress(newStep, formData);
    }
  }, [currentStep, formData, saveProgress]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      saveProgress(newStep, formData);
    }
  }, [currentStep, formData, saveProgress]);

  // Go to specific step
  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= TOTAL_STEPS) {
        setCurrentStep(step);
        saveProgress(step, formData);
      }
    },
    [formData, saveProgress]
  );

  // Clear all saved progress
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStep(1);
      setFormData(initialData);
    } catch (error) {
      console.error('Error clearing onboarding progress:', error);
    }
  }, []);

  // Mark onboarding as started
  const markStarted = useCallback(() => {
    try {
      localStorage.setItem('onboarding_started', 'true');
    } catch (error) {
      console.error('Error marking onboarding as started:', error);
    }
  }, []);

  // Check if onboarding was started
  const isStarted = useCallback(() => {
    try {
      return localStorage.getItem('onboarding_started') === 'true';
    } catch (error) {
      console.error('Error checking onboarding started:', error);
      return false;
    }
  }, []);

  // Validate current step data
  const validateStep = useCallback(
    (step: number): { isValid: boolean; error?: string } => {
      switch (step) {
        case 1: // Occupation
          if (!formData.occupation.trim()) {
            return { isValid: false, error: 'La ocupación es requerida' };
          }
          if (formData.occupation.trim().length < 2) {
            return { isValid: false, error: 'La ocupación debe tener al menos 2 caracteres' };
          }
          return { isValid: true };

        case 2: {
          // Date of Birth
          if (!formData.dateOfBirth) {
            return { isValid: false, error: 'La fecha de nacimiento es requerida' };
          }
          // Validate date format and age (must be at least 18 years old)
          const birthDate = new Date(formData.dateOfBirth);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            // Age calculation adjustment
          }
          if (age < 18) {
            return { isValid: false, error: 'Debes tener al menos 18 años' };
          }
          if (birthDate > today) {
            return { isValid: false, error: 'La fecha de nacimiento no puede ser en el futuro' };
          }
          return { isValid: true };
        }

        case 3: // Address (optional)
          return { isValid: true };

        case 4: // Bio (optional)
          return { isValid: true };

        default:
          return { isValid: true };
      }
    },
    [formData]
  );

  // Check if can proceed to next step
  const canProceed = useCallback(() => {
    return validateStep(currentStep).isValid;
  }, [currentStep, validateStep]);

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    formData,
    isLoading,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    clearProgress,
    validateStep,
    canProceed,
    markStarted,
    isStarted,
  };
};
