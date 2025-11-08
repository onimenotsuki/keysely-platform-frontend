import { useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { amenitiesConfig } from '@/config/amenitiesConfig';
import { DiscountKey, DiscountSelection, useListSpaceWizard } from './ListSpaceWizardContext';

type AmenityDefinition = {
  name: string;
  iconKey?: string;
  description?: string;
};

const DISCOUNT_OPTIONS: Array<{
  key: DiscountKey;
  percentage: number;
  titleKey: string;
  descriptionKey: string;
}> = [
  {
    key: 'newListing',
    percentage: 0.2,
    titleKey: 'listSpaceWizard.step5.discounts.newListing.title',
    descriptionKey: 'listSpaceWizard.step5.discounts.newListing.description',
  },
  {
    key: 'lastMinute',
    percentage: 0.12,
    titleKey: 'listSpaceWizard.step5.discounts.lastMinute.title',
    descriptionKey: 'listSpaceWizard.step5.discounts.lastMinute.description',
  },
  {
    key: 'weekly',
    percentage: 0.1,
    titleKey: 'listSpaceWizard.step5.discounts.weekly.title',
    descriptionKey: 'listSpaceWizard.step5.discounts.weekly.description',
  },
  {
    key: 'monthly',
    percentage: 0.2,
    titleKey: 'listSpaceWizard.step5.discounts.monthly.title',
    descriptionKey: 'listSpaceWizard.step5.discounts.monthly.description',
  },
];

const translateAmenityLabel = (t: (key: string) => string, slug: string, fallback: string) => {
  const key = `listSpaceWizard.amenityLabels.${slug}`;
  const translated = t(key);
  return translated === key ? fallback : translated;
};

const Step5Pricing = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { user } = useAuth();
  const {
    draft,
    setCurrentStepIndex,
    updateDraft,
    registerStepHandler,
    markStepCompleted,
    resetDraft,
  } = useListSpaceWizard();

  const { basicInfo, address, media, amenities, serviceHours, spaceId } = draft;
  const mediaImages = media.images;
  const amenitySelectedSlugs = amenities.selectedSlugs;
  const amenityCharacteristics = amenities.characteristics;

  const [pricePerHour, setPricePerHour] = useState<number>(draft.pricing.pricePerHour ?? 0);
  const [discounts, setDiscounts] = useState<DiscountSelection>(draft.pricing.discounts);

  useEffect(() => {
    setCurrentStepIndex(4);
  }, [setCurrentStepIndex]);

  useEffect(() => {
    updateDraft({
      pricing: {
        pricePerHour,
        discounts,
      },
    });
  }, [pricePerHour, discounts, updateDraft]);

  const amenityDefinitions = useMemo(() => {
    const map = new Map<string, AmenityDefinition>(
      amenitiesConfig.map(({ key, value }) => [
        key,
        {
          name: translateAmenityLabel(t, key, value),
          iconKey: key,
        },
      ])
    );

    draft.amenities.customAmenities.forEach((amenity) => {
      map.set(amenity.slug, {
        name: amenity.name,
        iconKey: amenity.iconKey ?? undefined,
        description: amenity.description,
      });
    });

    return map;
  }, [draft.amenities.customAmenities, t]);

  const toggleDiscount = (key: DiscountKey) => {
    setDiscounts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    const unregister = registerStepHandler('step-5', async () => {
      if (!user) {
        toast({
          title: t('common.error'),
          description: t('errors.notAuthenticated'),
          variant: 'destructive',
        });
        return false;
      }

      if (!basicInfo.title || !address.text) {
        toast({
          title: t('common.error'),
          description: t('listSpaceWizard.step4.completePreviousStepsDescription'),
          variant: 'destructive',
        });
        return false;
      }

      if (mediaImages.length === 0) {
        toast({
          title: t('common.error'),
          description: t('listSpaceOnboarding.errors.imagesRequired'),
          variant: 'destructive',
        });
        return false;
      }

      if (!pricePerHour || Number.isNaN(pricePerHour) || pricePerHour <= 0) {
        toast({
          title: t('common.error'),
          description: t('listSpaceWizard.step5.errors.priceRequired'),
          variant: 'destructive',
        });
        return false;
      }

      const appliedDiscounts = Object.entries(discounts).reduce<Record<string, number>>(
        (acc, [key, value]) => {
          if (!value) {
            return acc;
          }
          const option = DISCOUNT_OPTIONS.find((item) => item.key === key);
          if (option) {
            acc[key] = option.percentage;
          }
          return acc;
        },
        {}
      );

      const amenitySlugs = amenitySelectedSlugs;

      try {
        const spacePayload = {
          title: basicInfo.title,
          description: basicInfo.description,
          category_id: basicInfo.categoryId || null,
          capacity: basicInfo.capacity ?? 0,
          area_sqm: basicInfo.areaSqm,
          address: address.text,
          city: address.addressObject.city,
          address_object: address.addressObject,
          latitude: address.addressObject.latitude,
          longitude: address.addressObject.longitude,
          images: mediaImages,
          amenities: amenitySlugs
            .map((slug) => amenityDefinitions.get(slug)?.name ?? slug)
            .filter(Boolean),
          features: amenityCharacteristics.map((item) => item.title),
          service_hours: serviceHours,
          price_per_hour: pricePerHour,
          discounts: appliedDiscounts,
          is_active: false,
        } as const;

        let currentSpaceId = spaceId;

        if (currentSpaceId) {
          const { error } = await supabase
            .from('spaces')
            .update(spacePayload)
            .eq('id', currentSpaceId);

          if (error) {
            throw error;
          }
        } else {
          const { data, error } = await supabase
            .from('spaces')
            .insert({
              ...spacePayload,
              owner_id: user.id,
            })
            .select('id')
            .single();

          if (error) {
            throw error;
          }

          currentSpaceId = data.id;
        }

        if (!currentSpaceId) {
          throw new Error('Failed to resolve space identifier');
        }

        if (amenitySlugs.length > 0) {
          const { data: existingAmenities, error: fetchAmenitiesError } = await supabase
            .from('amenities')
            .select('id, slug')
            .in('slug', amenitySlugs);

          if (fetchAmenitiesError) {
            throw fetchAmenitiesError;
          }

          const existingMap = new Map(existingAmenities?.map((row) => [row.slug, row.id]));
          const missingSlugs = amenitySlugs.filter((slug) => !existingMap.has(slug));

          if (missingSlugs.length > 0) {
            const toInsert = missingSlugs
              .map((slug) => {
                const definition = amenityDefinitions.get(slug);
                if (!definition) {
                  return null;
                }
                return {
                  slug,
                  name: definition.name,
                  description: definition.description ?? null,
                  icon_key: definition.iconKey ?? null,
                };
              })
              .filter(Boolean);

            if (toInsert.length > 0) {
              const { data: inserted, error: insertAmenitiesError } = await supabase
                .from('amenities')
                .insert(toInsert)
                .select('id, slug');

              if (insertAmenitiesError) {
                throw insertAmenitiesError;
              }

              inserted?.forEach((row) => existingMap.set(row.slug, row.id));
            }
          }

          await supabase.from('space_amenities').delete().eq('space_id', currentSpaceId);

          const amenityRows = amenitySlugs
            .map((slug) => existingMap.get(slug))
            .filter(Boolean)
            .map((amenityId) => ({ space_id: currentSpaceId, amenity_id: amenityId }));

          if (amenityRows.length > 0) {
            const { error: linkAmenitiesError } = await supabase
              .from('space_amenities')
              .insert(amenityRows);

            if (linkAmenitiesError) {
              throw linkAmenitiesError;
            }
          }
        } else {
          await supabase.from('space_amenities').delete().eq('space_id', currentSpaceId);
        }

        await supabase.from('space_characteristics').delete().eq('space_id', currentSpaceId);

        if (amenityCharacteristics.length > 0) {
          const { error: insertCharacteristicsError } = await supabase
            .from('space_characteristics')
            .insert(
              amenityCharacteristics.map((item) => ({
                space_id: currentSpaceId,
                title: item.title,
                description: item.description || null,
                icon_key: item.iconKey,
              }))
            );

          if (insertCharacteristicsError) {
            throw insertCharacteristicsError;
          }
        }

        markStepCompleted(4);

        toast({
          title: t('listSpaceWizard.step5.savedTitle'),
          description: t('listSpaceWizard.step5.savedDescription'),
        });

        resetDraft();

        if (lang) {
          navigate(`/${lang}/owner-dashboard`, { replace: true });
        } else {
          navigate('/owner-dashboard', { replace: true });
        }

        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? String((error as { message?: unknown }).message)
              : t('errors.genericError');

        toast({
          title: t('common.error'),
          description: message,
          variant: 'destructive',
        });
        return false;
      }
    });

    return unregister;
  }, [
    registerStepHandler,
    user,
    toast,
    t,
    basicInfo,
    address,
    mediaImages,
    amenitySelectedSlugs,
    amenityCharacteristics,
    serviceHours,
    spaceId,
    amenityDefinitions,
    pricePerHour,
    discounts,
    navigate,
    lang,
    markStepCompleted,
    resetDraft,
  ]);

  return (
    <div className="space-y-6">
      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              5
            </span>
            {t('listSpaceWizard.step5.sectionTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('listSpaceWizard.step5.priceLabel')}
            </label>
            <Input
              type="number"
              min={1}
              step={1}
              value={pricePerHour || ''}
              onChange={(event) => {
                const value = Number(event.target.value);
                setPricePerHour(Number.isNaN(value) ? 0 : value);
              }}
              placeholder={t('listSpaceWizard.step5.pricePlaceholder')}
              className="h-12"
            />
            <p className="text-xs text-muted-foreground">
              {t('listSpaceWizard.step5.priceHelper')}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {t('listSpaceWizard.step5.discounts.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('listSpaceWizard.step5.discounts.helper')}
              </p>
            </div>

            <div className="space-y-3">
              {DISCOUNT_OPTIONS.map(({ key, titleKey, descriptionKey, percentage }) => {
                const isActive = discounts[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleDiscount(key)}
                    className={
                      'flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition-colors ' +
                      (isActive
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/40')
                    }
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {Math.round(percentage * 100)}%
                        </span>
                        <span className="font-medium">{t(titleKey)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{t(descriptionKey)}</p>
                    </div>
                    <span
                      className={
                        'flex h-6 w-6 items-center justify-center rounded-full border ' +
                        (isActive
                          ? 'border-primary bg-primary text-white'
                          : 'border-border text-muted-foreground')
                      }
                    >
                      {isActive && <Check className="h-4 w-4" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step5Pricing;
