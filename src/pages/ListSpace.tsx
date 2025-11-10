import { ImageUpload } from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { amenitiesConfig } from '@/config/amenitiesConfig';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';
import { useCreateSpace } from '@/hooks/useSpaces';
import { useTranslation } from '@/hooks/useTranslation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm, type FieldPath } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import logoImage from '../assets/logo.png';
import { GoogleMapProvider, isGoogleMapsConfigured } from '../components/map/GoogleMapView';
import { LocationPicker } from '../components/map/LocationPicker';

const createListSpaceSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
  z.object({
    title: z
      .string({
        required_error: t('listSpaceOnboarding.errors.titleRequired'),
      })
      .min(1, t('listSpaceOnboarding.errors.titleRequired'))
      .max(100, t('listSpaceOnboarding.errors.titleMax')),
    description: z
      .string({
        required_error: t('listSpaceOnboarding.errors.descriptionRequired'),
      })
      .min(1, t('listSpaceOnboarding.errors.descriptionRequired'))
      .max(1000, t('listSpaceOnboarding.errors.descriptionMax')),
    category_id: z
      .string({
        required_error: t('listSpaceOnboarding.errors.categoryRequired'),
      })
      .min(1, t('listSpaceOnboarding.errors.categoryRequired')),
    capacity: z
      .number({
        invalid_type_error: t('listSpaceOnboarding.errors.capacityInvalid'),
      })
      .min(1, t('listSpaceOnboarding.errors.capacityMinimum')),
    area_sqm: z.number().optional(),
    address: z
      .string({
        required_error: t('listSpaceOnboarding.errors.addressRequired'),
      })
      .min(1, t('listSpaceOnboarding.errors.addressRequired')),
    city: z
      .string({
        required_error: t('listSpaceOnboarding.errors.cityRequired'),
      })
      .min(1, t('listSpaceOnboarding.errors.cityRequired')),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    rental_period: z.enum(['hourly', 'daily', 'weekly', 'monthly']).default('hourly'),
    price_per_hour: z
      .number({
        invalid_type_error: t('listSpaceOnboarding.errors.priceInvalid'),
      })
      .min(1, t('listSpaceOnboarding.errors.priceRequired')),
    currency: z.string().min(1).default('MXN'),
    amenities: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    availability_hours: z.record(z.boolean()).default({}),
    available_times: z
      .object({
        start_time: z.string().default('09:00'),
        end_time: z.string().default('18:00'),
      })
      .default({ start_time: '09:00', end_time: '18:00' }),
    images: z.array(z.string()).min(1, t('listSpaceOnboarding.errors.imagesRequired')),
  });

type ListSpaceSchema = ReturnType<typeof createListSpaceSchema>;
type ListSpaceForm = z.infer<ListSpaceSchema>;
type StepField = FieldPath<ListSpaceForm>;

type StepMeta = {
  key: string;
  title: string;
  subtitle: string;
  helper: string;
  fields: StepField[];
};

const ListSpace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createSpace = useCreateSpace();
  const { data: categories } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const schema = useMemo(() => createListSpaceSchema(t), [t]);

  const form = useForm<ListSpaceForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
      capacity: 1,
      area_sqm: undefined,
      address: '',
      city: '',
      latitude: undefined,
      longitude: undefined,
      rental_period: 'hourly',
      price_per_hour: 0,
      amenities: [],
      features: [],
      availability_hours: {},
      available_times: {
        start_time: '09:00',
        end_time: '18:00',
      },
      images: [],
      currency: 'MXN',
    },
    mode: 'onChange',
  });

  const [currentStep, setCurrentStep] = useState(0);

  const onSubmit = async (data: ListSpaceForm) => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields are present
      const spaceData = {
        title: data.title,
        description: data.description || '',
        address: data.address,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        price_per_hour: data.price_per_hour,
        currency: data.currency,
        capacity: data.capacity,
        area_sqm: data.area_sqm,
        category_id: data.category_id,
        images:
          data.images.length > 0
            ? data.images
            : ['/placeholder.svg?height=400&width=600&text=Espacio+Principal'],
        features: data.amenities,
        amenities: data.amenities,
        availability_hours: data.availability_hours,
        policies: 'Professional use only. Please maintain cleanliness.',
        is_active: true,
      };

      await createSpace.mutateAsync(spaceData);

      toast({
        title: t('common.success'),
        description: t('listSpace.listingCreated'),
      });

      navigate('/owner-dashboard');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create listing. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use amenitiesConfig from central configuration
  const amenitiesList = amenitiesConfig;

  const availabilityOptions = [
    { key: 'monday', label: t('listSpace.monday') },
    { key: 'tuesday', label: t('listSpace.tuesday') },
    { key: 'wednesday', label: t('listSpace.wednesday') },
    { key: 'thursday', label: t('listSpace.thursday') },
    { key: 'friday', label: t('listSpace.friday') },
    { key: 'saturday', label: t('listSpace.saturday') },
    { key: 'sunday', label: t('listSpace.sunday') },
  ];

  const rentalPeriodOptions = [
    { value: 'hourly', label: t('listSpace.hourly') },
    { value: 'daily', label: t('listSpace.daily') },
    { value: 'weekly', label: t('listSpace.weekly') },
    { value: 'monthly', label: t('listSpace.monthly') },
  ];

  const selectedAmenities = form.watch('amenities');

  const toggleAmenity = (amenityValue: string) => {
    const currentAmenities = form.getValues('amenities');
    const isSelected = currentAmenities.includes(amenityValue);
    const updatedAmenities = isSelected
      ? currentAmenities.filter((a) => a !== amenityValue)
      : [...currentAmenities, amenityValue];

    form.setValue('amenities', updatedAmenities, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    const currentAvailability = form.getValues('availability_hours');
    form.setValue('availability_hours', {
      ...currentAvailability,
      [day]: checked,
    });
  };

  const getPriceLabel = (rentalPeriod: string) => {
    switch (rentalPeriod) {
      case 'hourly':
        return t('listSpace.pricePerHour');
      case 'daily':
        return t('listSpace.pricePerDay');
      case 'weekly':
        return t('listSpace.pricePerWeek');
      case 'monthly':
        return t('listSpace.pricePerMonth');
      default:
        return t('listSpace.pricePerHour');
    }
  };

  const stepMeta: StepMeta[] = useMemo(
    () => [
      {
        key: 'describe',
        title: t('listSpaceOnboarding.steps.describe.title'),
        subtitle: t('listSpaceOnboarding.steps.describe.subtitle'),
        helper: t('listSpaceOnboarding.steps.describe.helper'),
        fields: ['title', 'description', 'category_id', 'capacity', 'area_sqm', 'address', 'city'],
      },
      {
        key: 'highlight',
        title: t('listSpaceOnboarding.steps.highlight.title'),
        subtitle: t('listSpaceOnboarding.steps.highlight.subtitle'),
        helper: t('listSpaceOnboarding.steps.highlight.helper'),
        fields: ['description', 'amenities', 'images'],
      },
      {
        key: 'publish',
        title: t('listSpaceOnboarding.steps.publish.title'),
        subtitle: t('listSpaceOnboarding.steps.publish.subtitle'),
        helper: t('listSpaceOnboarding.steps.publish.helper'),
        fields: [
          'rental_period',
          'price_per_hour',
          'availability_hours',
          'available_times.start_time',
          'available_times.end_time',
        ],
      },
    ],
    [t]
  );

  const isLastStep = currentStep === stepMeta.length - 1;
  const progressValue = ((currentStep + 1) / stepMeta.length) * 100;

  const goToNextStep = async () => {
    const stepFields = stepMeta[currentStep]?.fields;
    if (stepFields?.length) {
      const isValid = await form.trigger(stepFields, {
        shouldFocus: true,
      });
      if (!isValid) {
        return;
      }
    }

    if (isLastStep) {
      await form.handleSubmit(onSubmit)();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, stepMeta.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderPrimaryActionContent = () => {
    if (isSubmitting) {
      return (
        <>
          <i className="fas fa-spinner fa-spin mr-2" />
          {t('listSpace.creatingListing')}
        </>
      );
    }

    if (isLastStep) {
      return (
        <>
          <i className="fas fa-check mr-2" />
          {t('listSpaceOnboarding.actions.publish')}
        </>
      );
    }

    return (
      <>
        <span>{t('listSpaceOnboarding.actions.next')}</span>
        <i className="fas fa-arrow-right ml-2" />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={logoImage} alt="Keysely Logo" className="h-8 w-auto" />
          <div className="text-sm text-gray-600">
            {t('listSpaceOnboarding.stepCounter', {
              current: currentStep + 1,
              total: stepMeta.length,
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16">
          <div className="w-full max-w-5xl">
            <div className="text-center space-y-4 mb-10">
              <div className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t('listSpaceOnboarding.badge', {
                  current: currentStep + 1,
                  total: stepMeta.length,
                })}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {stepMeta[currentStep].title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  {stepMeta[currentStep].subtitle}
                </p>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                {stepMeta[currentStep].helper}
              </p>
            </div>

            <Form {...form}>
              <form className="space-y-8">
                {currentStep === 0 && (
                  <div className="grid gap-6 md:gap-8">
                    <Card className="border border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                            1
                          </span>
                          {t('listSpaceOnboarding.sections.basics.title')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('listSpace.spaceTitle')}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('listSpace.spaceTitlePlaceholder')}
                                  className="h-12"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('listSpace.description')}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t('listSpace.descriptionPlaceholder')}
                                  className="min-h-32"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('listSpace.category')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue placeholder={t('listSpace.selectCategory')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categories?.map((category) => (
                                      <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('listSpace.capacity')}</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder={t('listSpace.capacityPlaceholder')}
                                    className="h-12"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number.parseInt(e.target.value, 10) || 0)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="area_sqm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('listSpace.area')}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={t('listSpace.areaPlaceholder')}
                                  className="h-12"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number.parseInt(e.target.value, 10) || undefined)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    <Card className="border border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                            2
                          </span>
                          {t('listSpace.location')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('listSpace.streetAddress')}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('listSpace.streetAddressPlaceholder')}
                                  className="h-12"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('listSpace.city')}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('listSpace.cityPlaceholder')}
                                  className="h-12"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {isGoogleMapsConfigured() && (
                          <div className="space-y-2">
                            <Label>{t('listSpaceOnboarding.sections.basics.mapLabel')}</Label>
                            <GoogleMapProvider>
                              <LocationPicker
                                address={`${form.watch('address')}, ${form.watch('city')}`}
                                latitude={form.watch('latitude')}
                                longitude={form.watch('longitude')}
                                onLocationChange={(lat, lng) => {
                                  form.setValue('latitude', lat);
                                  form.setValue('longitude', lng);
                                }}
                              />
                            </GoogleMapProvider>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="grid gap-6 md:gap-8">
                    <Card className="border border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                            3
                          </span>
                          {t('listSpaceOnboarding.sections.highlight.details')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('listSpace.description')}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t(
                                    'listSpaceOnboarding.sections.highlight.descriptionPlaceholder'
                                  )}
                                  className="min-h-40"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div>
                          <p className="text-sm font-medium mb-4">
                            {t('listSpaceOnboarding.sections.highlight.amenitiesTitle')}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {amenitiesList.map((amenity) => {
                              const Icon = amenity.icon;
                              const isSelected = selectedAmenities.includes(amenity.value);

                              return (
                                <button
                                  type="button"
                                  key={amenity.key}
                                  onClick={() => toggleAmenity(amenity.value)}
                                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                                    isSelected
                                      ? 'border-primary bg-primary/10 text-primary'
                                      : 'border-border hover:border-primary/40'
                                  }`}
                                >
                                  <Checkbox checked={isSelected} className="pointer-events-none" />
                                  <Icon className="h-5 w-5" />
                                  <span className="text-sm font-medium">
                                    {t(`listSpace.amenitiesList.${amenity.key}`)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                            4
                          </span>
                          {t('listSpace.photos')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {t('listSpaceOnboarding.sections.highlight.photosHelper')}
                        </p>
                        <div className="space-y-4">
                          <ImageUpload
                            images={form.watch('images')}
                            onImagesChange={(images) =>
                              form.setValue('images', images, { shouldValidate: true })
                            }
                            maxImages={10}
                          />
                          {form.formState.errors.images && (
                            <p className="text-sm font-medium text-destructive">
                              {form.formState.errors.images.message}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="grid gap-6 md:gap-8">
                    <Card className="border border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                            5
                          </span>
                          {t('listSpace.pricing')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="rental_period"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('listSpace.rentalPeriod')}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12">
                                    <SelectValue placeholder={t('listSpace.selectRentalPeriod')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {rentalPeriodOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="price_per_hour"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{getPriceLabel(form.watch('rental_period'))}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  placeholder={t(
                                    'listSpaceOnboarding.sections.publish.pricePlaceholder'
                                  )}
                                  className="h-12"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number.parseFloat(e.target.value) || 0)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <p className="text-sm text-muted-foreground">{t('listSpace.serviceFee')}</p>
                      </CardContent>
                    </Card>

                    <Card className="border border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                            6
                          </span>
                          {t('listSpace.availability')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <p className="text-sm font-medium mb-4">
                            {t('listSpaceOnboarding.sections.publish.days')}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {availabilityOptions.map((day) => (
                              <label
                                key={day.key}
                                htmlFor={day.key}
                                className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                                  form.watch('availability_hours')[day.key]
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/40'
                                }`}
                              >
                                <Checkbox
                                  id={day.key}
                                  checked={form.watch('availability_hours')[day.key] || false}
                                  onCheckedChange={(checked) =>
                                    handleAvailabilityChange(day.key, checked as boolean)
                                  }
                                />
                                <span className="text-sm font-medium">{day.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="available_times.start_time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('listSpace.startTime')}</FormLabel>
                                <FormControl>
                                  <Input type="time" className="h-12" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="available_times.end_time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('listSpace.endTime')}</FormLabel>
                                <FormControl>
                                  <Input type="time" className="h-12" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-dashed border-primary/40 bg-primary/5">
                      <CardContent className="p-6 md:p-8 text-center space-y-4">
                        <h3 className="text-xl font-semibold text-primary">
                          {t('listSpaceOnboarding.sections.publish.readyTitle')}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                          {t('listSpaceOnboarding.sections.publish.readyDescription')}
                        </p>
                        <ul className="text-left text-sm text-muted-foreground space-y-2 max-w-md mx-auto">
                          <li>• {t('listSpace.guideline1')}</li>
                          <li>• {t('listSpace.guideline2')}</li>
                          <li>• {t('listSpace.guideline3')}</li>
                          <li>• {t('listSpace.guideline4')}</li>
                          <li>• {t('listSpace.guideline5')}</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="md:w-auto"
                    onClick={goToPreviousStep}
                    disabled={currentStep === 0 || isSubmitting}
                  >
                    {t('listSpaceOnboarding.actions.back')}
                  </Button>

                  <Button
                    type="button"
                    className="h-12 px-8 bg-primary hover:bg-[#3B82F6] text-white font-semibold"
                    onClick={goToNextStep}
                    disabled={isSubmitting}
                  >
                    {renderPrimaryActionContent()}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600 text-center">
              {t('listSpaceOnboarding.progressLabel', {
                current: currentStep + 1,
                total: stepMeta.length,
              })}
            </div>
            <Progress value={progressValue} className="h-2 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListSpace;
