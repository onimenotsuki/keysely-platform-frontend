import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useListSpaceWizard } from './ListSpaceWizardContext';

const Step4Media = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { draft, setCurrentStepIndex, updateDraft, markStepCompleted, registerStepHandler } =
    useListSpaceWizard();

  const [images, setImages] = useState<string[]>(draft.media.images);

  useEffect(() => {
    setCurrentStepIndex(3);
  }, [setCurrentStepIndex]);

  useEffect(() => {
    setImages(draft.media.images);
  }, [draft.media.images]);

  useEffect(() => {
    updateDraft({
      media: {
        images,
      },
    });
  }, [images, updateDraft]);

  useEffect(() => {
    const unregister = registerStepHandler('step-4', async () => {
      if (images.length === 0) {
        toast({
          title: t('common.error'),
          description: t('listSpaceOnboarding.errors.imagesRequired'),
          variant: 'destructive',
        });
        return false;
      }

      markStepCompleted(3);
      return true;
    });

    return unregister;
  }, [registerStepHandler, images, markStepCompleted, toast, t]);

  return (
    <div className="space-y-6">
      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              4
            </span>
            {t('listSpaceWizard.step4.mediaSectionTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-6 text-sm text-muted-foreground">
            <ul className="grid gap-2 md:grid-cols-2">
              <li>{t('listSpaceWizard.step4.guidelineResolution')}</li>
              <li>{t('listSpaceWizard.step4.guidelineRatio')}</li>
              <li>{t('listSpaceWizard.step4.guidelineLighting')}</li>
              <li>{t('listSpaceWizard.step4.guidelineOrder')}</li>
            </ul>
          </div>

          <ImageUpload images={images} onImagesChange={setImages} maxImages={10} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Step4Media;
