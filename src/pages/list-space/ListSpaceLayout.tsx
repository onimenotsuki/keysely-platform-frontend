import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import logoImage from '@/assets/logo.png';

import { ListSpaceWizardProvider, useListSpaceWizard } from './ListSpaceWizardContext';
import { createListSpaceStepPath, parseStepIndexFromPathname } from './paths';

const ListSpaceLayoutShell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { steps, currentStepIndex, setCurrentStepIndex, furthestStepIndex, getStepHandler } =
    useListSpaceWizard();
  const { lang, userId } = useParams<{ lang: string; userId: string }>();

  const totalSteps = steps.length;
  const progressValue = ((currentStepIndex + 1) / totalSteps) * 100;

  const parsedStepIndex = parseStepIndexFromPathname(location.pathname, totalSteps);

  const [isAdvancing, setIsAdvancing] = useState(false);

  const handleNavigate = useCallback(
    (targetStepIndex: number) => {
      if (!lang || !userId) {
        return;
      }
      const path = createListSpaceStepPath(lang, userId, targetStepIndex);
      navigate(path);
    },
    [lang, userId, navigate]
  );

  useEffect(() => {
    if (parsedStepIndex !== null && parsedStepIndex !== currentStepIndex) {
      setCurrentStepIndex(parsedStepIndex);
    }
  }, [parsedStepIndex, currentStepIndex, setCurrentStepIndex]);

  useEffect(() => {
    if (parsedStepIndex === null || !lang || !userId) {
      return;
    }

    if (parsedStepIndex > furthestStepIndex) {
      handleNavigate(furthestStepIndex);
    }
  }, [parsedStepIndex, furthestStepIndex, lang, userId, handleNavigate]);

  if (!lang || !userId) {
    return null;
  }

  const activeStep = steps[currentStepIndex];
  const canGoBack = currentStepIndex > 0;
  const canGoForward = currentStepIndex < totalSteps - 1;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const handleNext = async () => {
    if (isAdvancing) {
      return;
    }

    const handler = getStepHandler(activeStep.id);

    setIsAdvancing(true);
    try {
      const canProceed = handler ? await handler() : true;
      if (!canProceed) {
        return;
      }

      if (!isLastStep) {
        handleNavigate(Math.min(totalSteps - 1, currentStepIndex + 1));
      }
    } finally {
      setIsAdvancing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={logoImage} alt="Keysely Logo" className="h-8 w-auto" />
          <div className="text-sm text-gray-600">
            {t('listSpaceWizard.stepCounter', {
              current: currentStepIndex + 1,
              total: totalSteps,
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-start px-4 py-12 md:py-16">
          <div className="w-full max-w-5xl">
            <div className="text-center space-y-4 mb-10">
              <div className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t('listSpaceWizard.badge', {
                  current: currentStepIndex + 1,
                  total: totalSteps,
                })}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {t(activeStep.titleKey)}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  {t(activeStep.subtitleKey)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                {t(activeStep.helperKey)}
              </p>
            </div>

            <Outlet />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleNavigate(Math.max(0, currentStepIndex - 1))}
                disabled={!canGoBack || isAdvancing}
              >
                {t('listSpaceWizard.actions.back')}
              </Button>
              <div className="text-sm text-gray-600">
                {t('listSpaceWizard.progressLabel', {
                  current: currentStepIndex + 1,
                  total: totalSteps,
                })}
              </div>
            </div>
            <Button
              type="button"
              className="h-12 px-8 bg-primary hover:bg-[#3B82F6] text-white font-semibold"
              onClick={handleNext}
              disabled={(isLastStep ? false : !canGoForward) || isAdvancing}
            >
              {isLastStep ? t('listSpaceWizard.actions.review') : t('listSpaceWizard.actions.next')}
            </Button>
          </div>
          <div className="mt-4">
            <Progress value={progressValue} className="h-2 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ListSpaceLayout = () => {
  const { lang, userId } = useParams<{ lang?: string; userId?: string }>();
  const { user } = useAuth();

  if (!lang || !userId) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <ListSpaceWizardProvider lang={lang} userId={userId}>
      <ListSpaceLayoutShell />
    </ListSpaceWizardProvider>
  );
};

export default ListSpaceLayout;
