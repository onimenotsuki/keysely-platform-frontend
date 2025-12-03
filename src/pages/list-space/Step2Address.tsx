import { useCallback, useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapboxProvider, isMapboxConfigured } from '@/components/map/MapboxProvider';
import { LocationPicker } from '@/components/map/LocationPicker';
import { useTranslation } from '@/hooks/useTranslation';

import { useListSpaceWizard } from './ListSpaceWizardContext';

const buildSchema = (t: (key: string) => string) =>
  z
    .object({
      streetAddress: z
        .string({
          required_error: t('listSpaceWizard.step2.errors.streetRequired'),
        })
        .min(3, t('listSpaceWizard.step2.errors.streetRequired')),
      city: z
        .string({
          required_error: t('listSpaceWizard.step2.errors.cityRequired'),
        })
        .min(1, t('listSpaceWizard.step2.errors.cityRequired')),
      state: z
        .string({
          required_error: t('listSpaceWizard.step2.errors.stateRequired'),
        })
        .min(1, t('listSpaceWizard.step2.errors.stateRequired')),
      country: z
        .string({
          required_error: t('listSpaceWizard.step2.errors.countryRequired'),
        })
        .min(1, t('listSpaceWizard.step2.errors.countryRequired')),
      postalCode: z
        .string({
          required_error: t('listSpaceWizard.step2.errors.postalCodeRequired'),
        })
        .min(3, t('listSpaceWizard.step2.errors.postalCodeRequired')),
      latitude: z
        .number({
          invalid_type_error: t('listSpaceWizard.step2.errors.latitudeInvalid'),
        })
        .min(-90)
        .max(90)
        .nullable()
        .optional(),
      longitude: z
        .number({
          invalid_type_error: t('listSpaceWizard.step2.errors.longitudeInvalid'),
        })
        .min(-180)
        .max(180)
        .nullable()
        .optional(),
    })
    .superRefine((values, ctx) => {
      if (values.latitude == null || values.longitude == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('listSpaceWizard.step2.errors.latitudeRequired'),
          path: ['latitude'],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('listSpaceWizard.step2.errors.longitudeRequired'),
          path: ['longitude'],
        });
      }
    });

type AddressSchema = ReturnType<typeof buildSchema>;
type AddressFormValues = z.infer<AddressSchema>;

const sanitizePart = (part?: string | null) => part?.trim() ?? '';

const formatFullAddress = (values: AddressFormValues) =>
  [
    sanitizePart(values.streetAddress),
    sanitizePart(values.city),
    sanitizePart(values.state),
    sanitizePart(values.postalCode),
    sanitizePart(values.country),
  ]
    .filter(Boolean)
    .join(', ');

const formatMapQuery = (values: AddressFormValues) =>
  [
    sanitizePart(values.streetAddress),
    sanitizePart(values.city),
    sanitizePart(values.state),
    sanitizePart(values.country),
  ]
    .filter(Boolean)
    .join(', ');

const Step2Address = () => {
  const { t } = useTranslation();
  const { setCurrentStepIndex, updateDraft, markStepCompleted, draft, registerStepHandler } =
    useListSpaceWizard();

  const schema = useMemo(() => buildSchema(t), [t]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      streetAddress: sanitizePart(draft.address.addressObject.streetAddress),
      city: sanitizePart(draft.address.addressObject.city),
      state: sanitizePart(draft.address.addressObject.state),
      country: sanitizePart(draft.address.addressObject.country) || 'México',
      postalCode: sanitizePart(draft.address.addressObject.postalCode),
      latitude:
        draft.address.addressObject.latitude === null ||
        draft.address.addressObject.latitude === undefined
          ? null
          : Number(draft.address.addressObject.latitude),
      longitude:
        draft.address.addressObject.longitude === null ||
        draft.address.addressObject.longitude === undefined
          ? null
          : Number(draft.address.addressObject.longitude),
    },
    mode: 'onChange',
  });

  useEffect(() => {
    setCurrentStepIndex(1);
  }, [setCurrentStepIndex]);

  useEffect(() => {
    const unregister = registerStepHandler('step-2', async () => {
      const isValid = await form.trigger(undefined, { shouldFocus: true });
      if (!isValid) {
        return false;
      }

      const values = form.getValues();
      const addressObject = {
        streetAddress: sanitizePart(values.streetAddress),
        city: sanitizePart(values.city),
        state: sanitizePart(values.state),
        country: sanitizePart(values.country),
        postalCode: sanitizePart(values.postalCode),
        latitude: values.latitude ?? null,
        longitude: values.longitude ?? null,
      };

      updateDraft({
        address: {
          text: formatFullAddress(values),
          addressObject,
        },
      });

      markStepCompleted(1);
      return true;
    });

    return unregister;
  }, [form, registerStepHandler, updateDraft, markStepCompleted]);

  const watchStreet = form.watch('streetAddress');
  const watchCity = form.watch('city');
  const watchState = form.watch('state');
  const watchCountry = form.watch('country');
  const watchPostalCode = form.watch('postalCode');
  const watchLatitude = form.watch('latitude');
  const watchLongitude = form.watch('longitude');

  const watchedValues = useMemo(
    () => ({
      streetAddress: watchStreet,
      city: watchCity,
      state: watchState,
      country: watchCountry,
      postalCode: watchPostalCode,
      latitude: watchLatitude ?? null,
      longitude: watchLongitude ?? null,
    }),
    [
      watchStreet,
      watchCity,
      watchState,
      watchCountry,
      watchPostalCode,
      watchLatitude,
      watchLongitude,
    ]
  );

  const mapAddress = useMemo(() => formatMapQuery(watchedValues), [watchedValues]);

  const handleLocationChange = useCallback(
    (lat: number, lng: number) => {
      form.setValue('latitude', lat, {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue('longitude', lng, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [form]
  );

  return (
    <div className="space-y-6">
      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              2
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {t('listSpaceWizard.step2.sectionTitle')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('listSpaceWizard.step2.streetAddress')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('listSpaceWizard.step2.streetAddressPlaceholder')}
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
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('listSpaceWizard.step2.postalCode')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('listSpaceWizard.step2.postalCodePlaceholder')}
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
                      <FormLabel>{t('listSpaceWizard.step2.city')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('listSpaceWizard.step2.cityPlaceholder')}
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
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('listSpaceWizard.step2.state')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('listSpaceWizard.step2.statePlaceholder')}
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
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('listSpaceWizard.step2.country')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('listSpaceWizard.step2.countryPlaceholder')}
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('listSpaceWizard.step2.latitude')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.000001"
                            className="h-12"
                            value={field.value ?? ''}
                            onChange={(event) => {
                              const value = event.target.value;
                              field.onChange(value ? Number.parseFloat(value) : null);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('listSpaceWizard.step2.longitude')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.000001"
                            className="h-12"
                            value={field.value ?? ''}
                            onChange={(event) => {
                              const value = event.target.value;
                              field.onChange(value ? Number.parseFloat(value) : null);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t('listSpaceWizard.step2.mapTitle')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('listSpaceWizard.step2.mapHelper')}
                  </p>
                </div>

                {isMapboxConfigured() ? (
                  <MapboxProvider>
                    <LocationPicker
                      address={mapAddress}
                      latitude={watchLatitude ?? undefined}
                      longitude={watchLongitude ?? undefined}
                      onLocationChange={handleLocationChange}
                    />
                  </MapboxProvider>
                ) : (
                  <Alert variant="destructive">
                    <AlertTitle>{t('listSpaceWizard.step2.mapsMissingTitle')}</AlertTitle>
                    <AlertDescription>
                      {t('listSpaceWizard.step2.mapsMissingDescription')}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step2Address;
