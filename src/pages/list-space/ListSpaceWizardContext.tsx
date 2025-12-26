/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type ListSpaceStepId = 'step-1' | 'step-2' | 'step-3' | 'step-4' | 'step-5';

export type WeekdayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface AddressObject {
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ServiceHourBlock {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export type ServiceHours = Record<WeekdayKey, ServiceHourBlock>;

export type DiscountKey = 'newListing' | 'lastMinute' | 'weekly' | 'monthly';

export type DiscountSelection = Record<DiscountKey, boolean>;

export interface CustomAmenity {
  slug: string;
  name: string;
  description?: string;
  iconKey?: string | null;
}

export interface Characteristic {
  id: string;
  title: string;
  description: string;
  iconKey: string | null;
}

export interface ListSpaceDraft {
  spaceId?: string;
  basicInfo: {
    title: string;
    description: string;
    categoryId: string;
    capacity: number | null;
    areaSqm: number | null;
  };
  address: {
    text: string;
    addressObject: AddressObject;
  };
  amenities: {
    selectedSlugs: string[];
    customAmenities: CustomAmenity[];
    characteristics: Characteristic[];
  };
  serviceHours: ServiceHours;
  media: {
    images: string[];
  };
  pricing: {
    pricePerHour: number | null;
    discounts: DiscountSelection;
    currency: string;
  };
}

export interface ListSpaceStep {
  id: ListSpaceStepId;
  order: number;
  pathSegment: ListSpaceStepId;
  titleKey: string;
  subtitleKey: string;
  helperKey: string;
}

const WEEK_DAYS: WeekdayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const createDefaultServiceHours = (): ServiceHours =>
  WEEK_DAYS.reduce<ServiceHours>((acc, day) => {
    acc[day] = {
      enabled: day !== 'saturday' && day !== 'sunday',
      startTime: '09:00',
      endTime: '18:00',
    };
    return acc;
  }, {} as ServiceHours);

export const LIST_SPACE_STEPS: ListSpaceStep[] = [
  {
    id: 'step-1',
    order: 0,
    pathSegment: 'step-1',
    titleKey: 'listSpaceWizard.steps.basicInfo.title',
    subtitleKey: 'listSpaceWizard.steps.basicInfo.subtitle',
    helperKey: 'listSpaceWizard.steps.basicInfo.helper',
  },
  {
    id: 'step-2',
    order: 1,
    pathSegment: 'step-2',
    titleKey: 'listSpaceWizard.steps.address.title',
    subtitleKey: 'listSpaceWizard.steps.address.subtitle',
    helperKey: 'listSpaceWizard.steps.address.helper',
  },
  {
    id: 'step-3',
    order: 2,
    pathSegment: 'step-3',
    titleKey: 'listSpaceWizard.steps.amenities.title',
    subtitleKey: 'listSpaceWizard.steps.amenities.subtitle',
    helperKey: 'listSpaceWizard.steps.amenities.helper',
  },
  {
    id: 'step-4',
    order: 3,
    pathSegment: 'step-4',
    titleKey: 'listSpaceWizard.steps.media.title',
    subtitleKey: 'listSpaceWizard.steps.media.subtitle',
    helperKey: 'listSpaceWizard.steps.media.helper',
  },
  {
    id: 'step-5',
    order: 4,
    pathSegment: 'step-5',
    titleKey: 'listSpaceWizard.steps.pricing.title',
    subtitleKey: 'listSpaceWizard.steps.pricing.subtitle',
    helperKey: 'listSpaceWizard.steps.pricing.helper',
  },
];

const defaultDraft: ListSpaceDraft = {
  basicInfo: {
    title: '',
    description: '',
    categoryId: '',
    capacity: null,
    areaSqm: null,
  },
  address: {
    text: '',
    addressObject: {
      streetAddress: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      latitude: null,
      longitude: null,
    },
  },
  amenities: {
    selectedSlugs: [],
    customAmenities: [],
    characteristics: [],
  },
  serviceHours: createDefaultServiceHours(),
  media: {
    images: [],
  },
  pricing: {
    pricePerHour: null,
    discounts: {
      newListing: false,
      lastMinute: false,
      weekly: false,
      monthly: false,
    },
    currency: 'MXN',
  },
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const mergeDeep = <T extends object>(target: T, source?: DeepPartial<T>): T => {
  if (!source) {
    return target;
  }

  const output = Array.isArray(target) ? [...target] : { ...target };

  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceValue = source[key];
    if (sourceValue === undefined) {
      continue;
    }

    const targetValue = (target as Record<keyof T, unknown>)[key];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      (output as Record<keyof T, unknown>)[key] = mergeDeep(
        targetValue as object,
        sourceValue as DeepPartial<object>
      );
      continue;
    }

    (output as Record<keyof T, unknown>)[key] = sourceValue as T[keyof T];
  }

  return output as T;
};

type StepHandler = () => Promise<boolean>;

interface ListSpaceWizardContextValue {
  lang: string;
  userId: string;
  steps: ListSpaceStep[];
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  furthestStepIndex: number;
  markStepCompleted: (index: number) => void;
  draft: ListSpaceDraft;
  updateDraft: (input: DeepPartial<ListSpaceDraft>) => void;
  resetDraft: () => void;
  registerStepHandler: (stepId: ListSpaceStepId, handler: StepHandler) => () => void;
  getStepHandler: (stepId: ListSpaceStepId) => StepHandler | undefined;
}

const ListSpaceWizardContext = createContext<ListSpaceWizardContextValue | undefined>(undefined);

export interface ListSpaceWizardProviderProps {
  children: ReactNode;
  lang: string;
  userId: string;
}

export const ListSpaceWizardProvider = ({
  children,
  lang,
  userId,
}: ListSpaceWizardProviderProps) => {
  const [draft, setDraft] = useState<ListSpaceDraft>(defaultDraft);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [furthestStepIndex, setFurthestStepIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const stepHandlersRef = useRef(new Map<ListSpaceStepId, StepHandler>());

  const storageKey = useMemo(() => `list-space-wizard-${userId}`, [userId]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          draft?: ListSpaceDraft;
          currentStepIndex?: number;
          furthestStepIndex?: number;
        };

        if (parsed.draft) {
          setDraft(mergeDeep(defaultDraft, parsed.draft));
        }
        if (typeof parsed.currentStepIndex === 'number') {
          setCurrentStepIndex(parsed.currentStepIndex);
        }
        if (typeof parsed.furthestStepIndex === 'number') {
          setFurthestStepIndex(parsed.furthestStepIndex);
        }
      }
    } catch (error) {
      console.error('Failed to restore wizard draft from sessionStorage:', error);
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') {
      return;
    }

    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ draft, currentStepIndex, furthestStepIndex })
      );
    } catch (error) {
      console.error('Failed to persist wizard draft to sessionStorage:', error);
    }
  }, [draft, currentStepIndex, furthestStepIndex, isHydrated, storageKey]);

  const markStepCompleted = (index: number) => {
    setFurthestStepIndex((prev) => {
      const nextAccessible = Math.min(LIST_SPACE_STEPS.length - 1, index + 1);
      return nextAccessible > prev ? nextAccessible : prev;
    });
  };

  const updateDraft = (input: DeepPartial<ListSpaceDraft>) => {
    setDraft((prev) => mergeDeep(prev, input));
  };

  const resetDraft = useCallback(() => {
    setDraft(defaultDraft);
    setCurrentStepIndex(0);
    setFurthestStepIndex(0);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const registerStepHandler = useCallback((stepId: ListSpaceStepId, handler: StepHandler) => {
    stepHandlersRef.current.set(stepId, handler);
    return () => {
      stepHandlersRef.current.delete(stepId);
    };
  }, []);

  const getStepHandler = useCallback(
    (stepId: ListSpaceStepId) => stepHandlersRef.current.get(stepId),
    []
  );

  const value = useMemo(
    () => ({
      lang,
      userId,
      steps: LIST_SPACE_STEPS,
      currentStepIndex,
      setCurrentStepIndex,
      furthestStepIndex,
      markStepCompleted,
      draft,
      updateDraft,
      resetDraft,
      registerStepHandler,
      getStepHandler,
    }),
    [
      lang,
      userId,
      currentStepIndex,
      furthestStepIndex,
      draft,
      resetDraft,
      registerStepHandler,
      getStepHandler,
    ]
  );

  return (
    <ListSpaceWizardContext.Provider value={value}>{children}</ListSpaceWizardContext.Provider>
  );
};

export const useListSpaceWizard = () => {
  const context = useContext(ListSpaceWizardContext);

  if (!context) {
    throw new Error('useListSpaceWizard must be used within a ListSpaceWizardProvider');
  }

  return context;
};

export const getStepPathSegment = (stepIndex: number): ListSpaceStepId =>
  LIST_SPACE_STEPS[Math.max(0, Math.min(stepIndex, LIST_SPACE_STEPS.length - 1))].pathSegment;
