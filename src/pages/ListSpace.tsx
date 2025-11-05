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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';
import { useCreateSpace } from '@/hooks/useSpaces';
import { useTranslation } from '@/hooks/useTranslation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { GoogleMapProvider, isGoogleMapsConfigured } from '../components/map/GoogleMapView';
import { LocationPicker } from '../components/map/LocationPicker';

const listSpaceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  category_id: z.string().min(1, 'Category is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  area_sqm: z.number().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  rental_period: z.enum(['hourly', 'daily', 'weekly', 'monthly']).default('hourly'),
  price_per_hour: z.number().min(1, 'Price per hour is required'),
  amenities: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  availability_hours: z.record(z.boolean()).default({}),
  available_times: z
    .object({
      start_time: z.string().default('09:00'),
      end_time: z.string().default('18:00'),
    })
    .default({ start_time: '09:00', end_time: '18:00' }),
  images: z.array(z.string()).default([]),
});

type ListSpaceForm = z.infer<typeof listSpaceSchema>;

const ListSpace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createSpace = useCreateSpace();
  const { data: categories } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, language } = useTranslation();

  const form = useForm<ListSpaceForm>({
    resolver: zodResolver(listSpaceSchema),
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
    },
  });

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

  const amenitiesList = [
    { key: 'highSpeedWifi', value: 'High-speed WiFi' },
    { key: 'printerScanner', value: 'Printer/Scanner' },
    { key: 'coffeeAndTea', value: 'Coffee & Tea' },
    { key: 'kitchenAccess', value: 'Kitchen Access' },
    { key: 'airConditioning', value: 'Air Conditioning' },
    { key: 'naturalLight', value: 'Natural Light' },
    { key: 'ergonomicFurniture', value: 'Ergonomic Furniture' },
    { key: 'whiteboard', value: 'Whiteboard' },
    { key: 'projectorScreen', value: 'Projector/Screen' },
    { key: 'videoConferencing', value: 'Video Conferencing' },
    { key: 'securitySystem', value: 'Security System' },
    { key: 'access24x7', value: '24/7 Access' },
    { key: 'receptionServices', value: 'Reception Services' },
    { key: 'cleaningService', value: 'Cleaning Service' },
    { key: 'parking', value: 'Parking' },
    { key: 'publicTransport', value: 'Public Transport' },
    { key: 'bikeStorage', value: 'Bike Storage' },
    { key: 'showerFacilities', value: 'Shower Facilities' },
    { key: 'phoneBooth', value: 'Phone Booth' },
    { key: 'lockers', value: 'Lockers' },
  ];

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

  const currencySymbol = language === 'es' ? '$' : '$';
  const currencyLabel = language === 'es' ? 'MXN' : 'USD';

  const handleAmenityChange = (amenityValue: string, checked: boolean) => {
    const currentAmenities = form.getValues('amenities');
    const updatedAmenities = checked
      ? [...currentAmenities, amenityValue]
      : currentAmenities.filter((a) => a !== amenityValue);
    form.setValue('amenities', updatedAmenities);
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">{t('listSpace.title')}</h1>
            <p className="text-xl text-muted-foreground">{t('listSpace.subtitle')}</p>
          </div>

          {/* Benefits Section */}
          <Card className="mb-8 bg-gradient-primary text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">{t('listSpace.whyList')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <i className="fas fa-dollar-sign text-3xl mb-3"></i>
                  <h3 className="font-semibold mb-2">{t('listSpace.earnIncome')}</h3>
                  <p className="text-sm text-white/90">{t('listSpace.earnIncomeDesc')}</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-users text-3xl mb-3"></i>
                  <h3 className="font-semibold mb-2">{t('listSpace.globalReach')}</h3>
                  <p className="text-sm text-white/90">{t('listSpace.globalReachDesc')}</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-shield-alt text-3xl mb-3"></i>
                  <h3 className="font-semibold mb-2">{t('listSpace.securePlatform')}</h3>
                  <p className="text-sm text-white/90">{t('listSpace.securePlatformDesc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Listing Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <i className="fas fa-info-circle mr-2"></i>
                    {t('listSpace.basicInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('listSpace.spaceTitle')} *</FormLabel>
                        <FormControl>
                          <Input placeholder={t('listSpace.spaceTitlePlaceholder')} {...field} />
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
                        <FormLabel>{t('listSpace.description')} *</FormLabel>
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
                          <FormLabel>{t('listSpace.category')} *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
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
                          <FormLabel>{t('listSpace.capacity')} *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={t('listSpace.capacityPlaceholder')}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {t('listSpace.location')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('listSpace.streetAddress')} *</FormLabel>
                        <FormControl>
                          <Input placeholder={t('listSpace.streetAddressPlaceholder')} {...field} />
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
                        <FormLabel>{t('listSpace.city')} *</FormLabel>
                        <FormControl>
                          <Input placeholder={t('listSpace.cityPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location Picker */}
                  {isGoogleMapsConfigured() && (
                    <div className="space-y-2">
                      <Label>Ubicación en el mapa</Label>
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

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <i className="fas fa-dollar-sign mr-2"></i>
                    {t('listSpace.pricing')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="rental_period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('listSpace.rentalPeriod')} *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                        <FormLabel>{getPriceLabel(form.watch('rental_period'))} *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 25"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-sm text-muted-foreground mt-2">{t('listSpace.serviceFee')}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <i className="fas fa-list-check mr-2"></i>
                    {t('listSpace.amenities')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity.key}
                          checked={form.watch('amenities').includes(amenity.value)}
                          onCheckedChange={(checked) =>
                            handleAmenityChange(amenity.value, checked as boolean)
                          }
                        />
                        <Label htmlFor={amenity.key} className="text-sm">
                          {t(`listSpace.amenitiesList.${amenity.key}`)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <i className="fas fa-calendar mr-2"></i>
                    {t('listSpace.availability')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      {t('listSpace.availableDays')}
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {availabilityOptions.map((day) => (
                        <div key={day.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={day.key}
                            checked={form.watch('availability_hours')[day.key] || false}
                            onCheckedChange={(checked) =>
                              handleAvailabilityChange(day.key, checked as boolean)
                            }
                          />
                          <Label htmlFor={day.key}>{day.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      {t('listSpace.availableHours')}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="available_times.start_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('listSpace.startTime')}</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
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
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Photos Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <i className="fas fa-camera mr-2"></i>
                    {t('listSpace.photos')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    images={form.watch('images')}
                    onImagesChange={(images) => form.setValue('images', images)}
                    maxImages={10}
                  />
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-center space-x-4">
                <Button type="submit" className="btn-primary" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      {t('listSpace.creatingListing')}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      {t('listSpace.createListing')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Guidelines */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t('listSpace.guidelines')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>{t('listSpace.guideline1')}</li>
                <li>{t('listSpace.guideline2')}</li>
                <li>{t('listSpace.guideline3')}</li>
                <li>{t('listSpace.guideline4')}</li>
                <li>{t('listSpace.guideline5')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListSpace;
