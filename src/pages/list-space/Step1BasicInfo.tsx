import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import { useCategories } from '@/hooks/useCategories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useListSpaceWizard } from './ListSpaceWizardContext';

const buildSchema = (t: (key: string) => string) =>
  z.object({
    title: z
      .string({
        required_error: t('listSpaceOnboarding.errors.titleRequired'),
      })
      .min(3, t('listSpaceOnboarding.errors.titleRequired'))
      .max(100, t('listSpaceOnboarding.errors.titleMax')),
    description: z
      .string({
        required_error: t('listSpaceOnboarding.errors.descriptionRequired'),
      })
      .min(10, t('listSpaceOnboarding.errors.descriptionRequired'))
      .max(1000, t('listSpaceOnboarding.errors.descriptionMax')),
    categoryId: z
      .string({
        required_error: t('listSpaceOnboarding.errors.categoryRequired'),
      })
      .min(1, t('listSpaceOnboarding.errors.categoryRequired')),
    capacity: z
      .number({
        invalid_type_error: t('listSpaceOnboarding.errors.capacityInvalid'),
      })
      .int()
      .min(1, t('listSpaceOnboarding.errors.capacityMinimum')),
    areaSqm: z
      .number({
        invalid_type_error: t('listSpaceOnboarding.errors.areaInvalid'),
      })
      .positive(t('listSpaceOnboarding.errors.areaMinimum'))
      .optional(),
  });

type BasicInfoSchema = ReturnType<typeof buildSchema>;
type BasicInfoFormValues = z.infer<BasicInfoSchema>;

const Step1BasicInfo = () => {
  const { t } = useTranslation();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { setCurrentStepIndex, updateDraft, markStepCompleted, draft, registerStepHandler } =
    useListSpaceWizard();

  const schema = buildSchema(t);

  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: draft.basicInfo.title,
      description: draft.basicInfo.description,
      categoryId: draft.basicInfo.categoryId,
      capacity: draft.basicInfo.capacity ?? 1,
      areaSqm: draft.basicInfo.areaSqm ?? undefined,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    setCurrentStepIndex(0);
  }, [setCurrentStepIndex]);

  useEffect(() => {
    const unregister = registerStepHandler('step-1', async () => {
      const isValid = await form.trigger(undefined, { shouldFocus: true });
      if (!isValid) {
        return false;
      }

      const values = form.getValues();

      updateDraft({
        basicInfo: {
          title: values.title,
          description: values.description,
          categoryId: values.categoryId,
          capacity: values.capacity,
          areaSqm: values.areaSqm ?? null,
        },
      });

      markStepCompleted(0);
      return true;
    });

    return unregister;
  }, [form, registerStepHandler, updateDraft, markStepCompleted, t]);

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
            1
          </span>
          {t('listSpaceWizard.step1.sectionTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('listSpace.category')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={categoriesLoading}
                    >
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
                        min={1}
                        className="h-12"
                        value={field.value ?? ''}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value ? Number.parseInt(value, 10) : undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="areaSqm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('listSpace.area')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      className="h-12"
                      value={field.value ?? ''}
                      onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(value ? Number.parseFloat(value) : undefined);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Step1BasicInfo;
