import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';
import { amenitiesConfig } from '@/config/amenitiesConfig';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { Clock, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  CustomAmenity,
  ServiceHourBlock,
  ServiceHours,
  WeekdayKey,
  useListSpaceWizard,
} from './ListSpaceWizardContext';

const dayOrder: WeekdayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const iconRegistry = new Map(amenitiesConfig.map(({ key, icon }) => [key, icon]));

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const makeUniqueSlug = (base: string, existing: Set<string>) => {
  let candidate = base || `amenity-${Date.now()}`;
  let counter = 1;
  while (existing.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return candidate;
};

const createDefaultServiceHours = (): ServiceHours =>
  dayOrder.reduce((acc, day) => {
    acc[day] = {
      enabled: day !== 'saturday' && day !== 'sunday',
      startTime: '09:00',
      endTime: '18:00',
    } satisfies ServiceHourBlock;
    return acc;
  }, {} as ServiceHours);

const normalizeServiceHours = (
  input?: Partial<Record<WeekdayKey, Partial<ServiceHourBlock>>> | null
): ServiceHours => {
  const base = createDefaultServiceHours();
  if (!input) {
    return base;
  }

  for (const day of dayOrder) {
    const block = input[day];
    if (block) {
      base[day] = {
        enabled: typeof block.enabled === 'boolean' ? block.enabled : base[day].enabled,
        startTime:
          typeof block.startTime === 'string' && block.startTime !== ''
            ? block.startTime
            : base[day].startTime,
        endTime:
          typeof block.endTime === 'string' && block.endTime !== ''
            ? block.endTime
            : base[day].endTime,
      } satisfies ServiceHourBlock;
    }
  }

  return base;
};

const characteristicSchema = (t: (key: string) => string) =>
  z.object({
    title: z
      .string({
        required_error: t('listSpaceWizard.step3.errors.characteristicTitle'),
      })
      .min(2, t('listSpaceWizard.step3.errors.characteristicTitle')),
    description: z.string().max(280).optional(),
    iconKey: z.string().optional(),
  });

const amenitySchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string({
        required_error: t('listSpaceWizard.step3.errors.amenityNameRequired'),
      })
      .min(3, t('listSpaceWizard.step3.errors.amenityNameRequired')),
    description: z.string().max(200).optional(),
    iconKey: z.string().optional(),
  });

const translateAmenityName = (t: (key: string) => string, slug: string, fallback: string) => {
  const key = `listSpaceWizard.amenityLabels.${slug}`;
  const translated = t(key);
  return translated === key ? fallback : translated;
};

const IconSelector = ({
  value,
  onChange,
}: {
  value?: string | null;
  onChange: (iconKey: string | null) => void;
}) => (
  <ScrollArea className="max-h-48 rounded-md border border-dashed border-border/60 p-3">
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {amenitiesConfig.map(({ key, value: label, icon: Icon }) => {
        const isSelected = value === key;
        return (
          <Toggle
            key={key}
            pressed={isSelected}
            onPressedChange={() => onChange(isSelected ? null : key)}
            className={cn(
              'flex h-auto flex-col items-center gap-2 rounded-xl border px-3 py-3 text-center transition-colors',
              isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border'
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium leading-tight">{label}</span>
          </Toggle>
        );
      })}
    </div>
  </ScrollArea>
);

const createCharacteristicId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `characteristic-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const Step3Amenities = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { draft, updateDraft, markStepCompleted, registerStepHandler, setCurrentStepIndex } =
    useListSpaceWizard();

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(draft.amenities.selectedSlugs);
  const [customAmenities, setCustomAmenities] = useState<CustomAmenity[]>(
    draft.amenities.customAmenities
  );
  const [serviceHoursState, setServiceHoursState] = useState<ServiceHours>(
    normalizeServiceHours(draft.serviceHours)
  );
  const [characteristics, setCharacteristics] = useState(draft.amenities.characteristics);
  const [isAmenityDialogOpen, setIsAmenityDialogOpen] = useState(false);
  const [characteristicDialog, setCharacteristicDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    characteristicId?: string;
  }>({ open: false, mode: 'create' });

  useEffect(() => {
    setCurrentStepIndex(2);
  }, [setCurrentStepIndex]);

  useEffect(() => {
    setSelectedSlugs(draft.amenities.selectedSlugs);
  }, [draft.amenities.selectedSlugs]);

  useEffect(() => {
    setCustomAmenities(draft.amenities.customAmenities);
  }, [draft.amenities.customAmenities]);

  useEffect(() => {
    setCharacteristics(draft.amenities.characteristics);
  }, [draft.amenities.characteristics]);

  useEffect(() => {
    setServiceHoursState(normalizeServiceHours(draft.serviceHours));
  }, [draft.serviceHours]);

  const amenityForm = useForm<z.infer<ReturnType<typeof amenitySchema>>>({
    resolver: zodResolver(amenitySchema(t)),
    defaultValues: {
      name: '',
      description: '',
      iconKey: undefined,
    },
  });

  const characteristicForm = useForm<z.infer<ReturnType<typeof characteristicSchema>>>({
    resolver: zodResolver(characteristicSchema(t)),
    defaultValues: {
      title: '',
      description: '',
      iconKey: undefined,
    },
  });

  const allAmenitySlugs = useMemo(() => {
    const baseSlugs = amenitiesConfig.map((amenity) => amenity.key);
    return new Set([...baseSlugs, ...customAmenities.map((amenity) => amenity.slug)]);
  }, [customAmenities]);

  const combinedAmenities = useMemo(() => {
    const base = amenitiesConfig.map(({ key, value, icon }) => ({
      slug: key,
      name: translateAmenityName(t, key, value),
      description: undefined,
      iconKey: key,
      Icon: icon,
    }));

    const custom = customAmenities.map((amenity) => {
      const Icon = amenity.iconKey ? (iconRegistry.get(amenity.iconKey) ?? Sparkles) : Sparkles;
      return {
        slug: amenity.slug,
        name: amenity.name,
        description: amenity.description,
        iconKey: amenity.iconKey ?? null,
        Icon,
      };
    });

    return [...base, ...custom];
  }, [customAmenities, t]);

  const toggleAmenity = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  };

  const handleDayToggle = (day: WeekdayKey, enabled: boolean) => {
    setServiceHoursState((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled,
      },
    }));
  };

  const handleTimeChange = (day: WeekdayKey, field: 'startTime' | 'endTime', value: string) => {
    setServiceHoursState((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const openCreateAmenityDialog = () => {
    amenityForm.reset({ name: '', description: '', iconKey: undefined });
    setIsAmenityDialogOpen(true);
  };

  const onCreateAmenity = amenityForm.handleSubmit((values) => {
    const baseSlug = slugify(values.name.trim());
    const slug = makeUniqueSlug(baseSlug, allAmenitySlugs);
    const newAmenity: CustomAmenity = {
      slug,
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      iconKey: values.iconKey || undefined,
    };

    setCustomAmenities((prev) => [...prev, newAmenity]);
    setSelectedSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
    toast({
      title: t('listSpaceWizard.step3.amenityCreatedTitle'),
      description: t('listSpaceWizard.step3.amenityCreatedDescription'),
    });
    setIsAmenityDialogOpen(false);
  });

  const openCreateCharacteristic = () => {
    characteristicForm.reset({ title: '', description: '', iconKey: undefined });
    setCharacteristicDialog({ open: true, mode: 'create' });
  };

  const openEditCharacteristic = (characteristicId: string) => {
    const characteristic = characteristics.find((item) => item.id === characteristicId);
    if (!characteristic) {
      return;
    }

    characteristicForm.reset({
      title: characteristic.title,
      description: characteristic.description,
      iconKey: characteristic.iconKey ?? undefined,
    });
    setCharacteristicDialog({ open: true, mode: 'edit', characteristicId });
  };

  const handleCharacteristicSubmit = characteristicForm.handleSubmit((values) => {
    if (characteristicDialog.mode === 'edit' && characteristicDialog.characteristicId) {
      setCharacteristics((prev) =>
        prev.map((item) =>
          item.id === characteristicDialog.characteristicId
            ? {
                ...item,
                title: values.title.trim(),
                description: values.description?.trim() ?? '',
                iconKey: values.iconKey ?? null,
              }
            : item
        )
      );

      toast({
        title: t('listSpaceWizard.step3.characteristicUpdatedTitle'),
        description: t('listSpaceWizard.step3.characteristicUpdatedDescription'),
      });
    } else {
      setCharacteristics((prev) => [
        ...prev,
        {
          id: createCharacteristicId(),
          title: values.title.trim(),
          description: values.description?.trim() ?? '',
          iconKey: values.iconKey ?? null,
        },
      ]);

      toast({
        title: t('listSpaceWizard.step3.characteristicCreatedTitle'),
        description: t('listSpaceWizard.step3.characteristicCreatedDescription'),
      });
    }

    setCharacteristicDialog({ open: false, mode: 'create' });
    characteristicForm.reset({ title: '', description: '', iconKey: undefined });
  });

  const deleteCharacteristic = (id: string) => {
    setCharacteristics((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: t('listSpaceWizard.step3.characteristicDeletedTitle'),
      description: t('listSpaceWizard.step3.characteristicDeletedDescription'),
    });
  };

  useEffect(() => {
    const unregister = registerStepHandler('step-3', async () => {
      const invalidDay = dayOrder.find((day) => {
        const block = serviceHoursState[day];
        return block.enabled && block.startTime >= block.endTime;
      });

      if (invalidDay) {
        toast({
          title: t('common.error'),
          description: t('listSpaceWizard.step3.errors.invalidServiceHoursRange'),
          variant: 'destructive',
        });
        return false;
      }

      updateDraft({
        amenities: {
          selectedSlugs,
          customAmenities,
          characteristics,
        },
        serviceHours: serviceHoursState,
      });

      markStepCompleted(2);
      return true;
    });

    return unregister;
  }, [
    registerStepHandler,
    serviceHoursState,
    selectedSlugs,
    customAmenities,
    characteristics,
    updateDraft,
    markStepCompleted,
    toast,
    t,
  ]);

  return (
    <div className="space-y-6">
      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              3
            </span>
            {t('listSpaceWizard.step3.amenitiesSectionTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-2xl text-sm text-muted-foreground">
              {t('listSpaceWizard.step3.amenitiesHelper')}
            </p>
            <Dialog open={isAmenityDialogOpen} onOpenChange={setIsAmenityDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={openCreateAmenityDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('listSpaceWizard.step3.addAmenity')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <Form {...amenityForm}>
                  <form onSubmit={onCreateAmenity} className="space-y-4">
                    <DialogHeader>
                      <DialogTitle>{t('listSpaceWizard.step3.createAmenityTitle')}</DialogTitle>
                      <DialogDescription>
                        {t('listSpaceWizard.step3.createAmenityDescription')}
                      </DialogDescription>
                    </DialogHeader>

                    <FormField
                      control={amenityForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('listSpaceWizard.step3.amenityNameLabel')}</FormLabel>
                          <FormControl>
                            <Input
                              autoFocus
                              placeholder={t('listSpaceWizard.step3.amenityNamePlaceholder')}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={amenityForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('listSpaceWizard.step3.amenityDescriptionLabel')}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t('listSpaceWizard.step3.amenityDescriptionPlaceholder')}
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={amenityForm.control}
                      name="iconKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('listSpaceWizard.step3.iconSelectorLabel')}</FormLabel>
                          <IconSelector value={field.value} onChange={field.onChange} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" className="bg-primary hover:bg-[#3B82F6]">
                        {t('common.add')}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {combinedAmenities.length === 0 && (
              <div className="col-span-full">
                <Alert>
                  <AlertTitle>{t('listSpaceWizard.step3.noAmenitiesTitle')}</AlertTitle>
                  <AlertDescription>
                    {t('listSpaceWizard.step3.noAmenitiesDescription')}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {combinedAmenities.map(({ slug, name, description, Icon }) => {
              const isSelected = selectedSlugs.includes(slug);
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => toggleAmenity(slug)}
                  className={cn(
                    'flex items-start gap-4 rounded-xl border bg-card p-4 text-left transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/40'
                  )}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{name}</p>
                      {isSelected && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/90 text-primary-foreground"
                        >
                          {t('listSpaceWizard.step3.selected')}
                        </Badge>
                      )}
                    </div>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              <Clock className="h-5 w-5" />
            </span>
            {t('listSpaceWizard.step3.serviceHoursTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('listSpaceWizard.step3.serviceHoursHelper')}
          </p>

          <div className="hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-4">
            <span>{t('listSpaceWizard.step3.dayColumn')}</span>
            <span>{t('listSpaceWizard.step3.opensAt')}</span>
            <span>{t('listSpaceWizard.step3.closesAt')}</span>
          </div>

          <div className="space-y-3">
            {dayOrder.map((day) => {
              const block = serviceHoursState[day];
              const dayLabel = t(`listSpace.${day}`);

              return (
                <div key={day} className="rounded-xl border border-border/60 bg-card/80 p-4">
                  <div className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={block.enabled}
                        onCheckedChange={(checked) => handleDayToggle(day, Boolean(checked))}
                      />
                      <div>
                        <p className="font-semibold text-foreground">{dayLabel}</p>
                        <p className="text-xs text-muted-foreground">
                          {block.enabled
                            ? t('listSpaceWizard.step3.dayEnabledHint')
                            : t('listSpaceWizard.step3.dayDisabledHint')}
                        </p>
                      </div>
                    </div>
                    <Input
                      type="time"
                      value={block.startTime}
                      disabled={!block.enabled}
                      onChange={(event) => handleTimeChange(day, 'startTime', event.target.value)}
                    />
                    <Input
                      type="time"
                      value={block.endTime}
                      disabled={!block.enabled}
                      onChange={(event) => handleTimeChange(day, 'endTime', event.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl font-semibold">
            <span>{t('listSpaceWizard.step3.characteristicsSectionTitle')}</span>
            <Button variant="outline" size="sm" onClick={openCreateCharacteristic}>
              <Plus className="mr-2 h-4 w-4" />
              {t('listSpaceWizard.step3.addCharacteristic')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {characteristics.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {t('listSpaceWizard.step3.noCharacteristicsPlaceholder')}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {characteristics.map((characteristic) => {
                const Icon = characteristic.iconKey
                  ? (iconRegistry.get(characteristic.iconKey) ?? Sparkles)
                  : Sparkles;
                return (
                  <div
                    key={characteristic.id}
                    className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{characteristic.title}</p>
                        {characteristic.description && (
                          <p className="text-sm text-muted-foreground">
                            {characteristic.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditCharacteristic(characteristic.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t('listSpaceWizard.step3.deleteCharacteristicTitle')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('listSpaceWizard.step3.deleteCharacteristicDescription', {
                                name: characteristic.title,
                              })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteCharacteristic(characteristic.id)}
                            >
                              {t('common.delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={characteristicDialog.open}
        onOpenChange={(open) => {
          setCharacteristicDialog((prev) => ({ ...prev, open }));
          if (!open) {
            characteristicForm.reset({ title: '', description: '', iconKey: undefined });
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <Form {...characteristicForm}>
            <form onSubmit={handleCharacteristicSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>
                  {characteristicDialog.mode === 'create'
                    ? t('listSpaceWizard.step3.createCharacteristicTitle')
                    : t('listSpaceWizard.step3.editCharacteristicTitle')}
                </DialogTitle>
                <DialogDescription>
                  {t('listSpaceWizard.step3.characteristicDialogDescription')}
                </DialogDescription>
              </DialogHeader>

              <FormField
                control={characteristicForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('listSpaceWizard.step3.characteristicTitleLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('listSpaceWizard.step3.characteristicTitlePlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={characteristicForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('listSpaceWizard.step3.characteristicDescriptionLabel')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          'listSpaceWizard.step3.characteristicDescriptionPlaceholder'
                        )}
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={characteristicForm.control}
                name="iconKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('listSpaceWizard.step3.iconSelectorLabel')}</FormLabel>
                    <IconSelector value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" className="bg-primary hover:bg-[#3B82F6]">
                  {t('common.save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Step3Amenities;
