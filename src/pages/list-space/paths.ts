import { getStepPathSegment } from './ListSpaceWizardContext';

export const LIST_SPACE_ROUTE_BASE = '/:lang/list-space/:userId';

export const createListSpaceStepPath = (lang: string, userId: string, stepIndex = 0) => {
  const stepSegment = getStepPathSegment(stepIndex);
  return `/${lang}/list-space/${userId}/${stepSegment}`;
};

export const parseStepIndexFromPathname = (pathname: string, totalSteps: number): number | null => {
  const match = pathname.match(/step-(\d+)/);
  if (!match) {
    return null;
  }

  const stepNumber = Number.parseInt(match[1], 10);
  if (Number.isNaN(stepNumber)) {
    return null;
  }

  const index = stepNumber - 1;
  if (index < 0 || index >= totalSteps) {
    return null;
  }

  return index;
};
