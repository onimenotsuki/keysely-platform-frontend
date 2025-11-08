import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';
import ContactOwnerButton from '@/components/ContactOwnerButton';
import ReviewsSection from '@/components/ReviewsSection';
import { AmenityBadge } from '@/components/features/spaces/AmenityBadge';
import { GoogleMapProvider, isGoogleMapsConfigured } from '@/components/map/GoogleMapView';
import { SpaceLocationMap } from '@/components/map/SpaceLocationMap';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShareDialog } from '@/components/ui/share-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCreateBooking } from '@/hooks/useBookings';
import { useBookingsBySpace } from '@/hooks/useBookingsBySpace';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import { useMarketplacePayment } from '@/hooks/useMarketplacePayment';
import { useSpace } from '@/hooks/useSpaces';
import { useTranslation } from '@/hooks/useTranslation';
import { Clock, Heart, MapPin, Maximize2, Share2, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

const DEFAULT_START_TIME = '09:00';
const DEFAULT_END_TIME = '17:00';
const DAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const satisfies readonly string[];

type AvailabilitySchedule = Record<
  string,
  {
    start?: string | null;
    end?: string | null;
  } | null
>;

const getDayKeyFromDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date).toLowerCase();

const resolveAvailabilityTime = (availability: AvailabilitySchedule, type: 'start' | 'end') => {
  for (const key of DAY_KEYS) {
    const value = availability?.[key]?.[type];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return type === 'start' ? DEFAULT_START_TIME : DEFAULT_END_TIME;
};

const SpaceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { createLocalizedPath } = useLanguageRouting();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState(DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState(DEFAULT_END_TIME);
  const [guestsCount, setGuestsCount] = useState(1);

  const getCurrencySymbol = () => {
    return t('common.currency');
  };

  const { data: space, isLoading } = useSpace(id || '');
  const { data: spaceBookings } = useBookingsBySpace(id || '');
  const toggleFavorite = useToggleFavorite();
  const { data: isFavorite } = useIsFavorite(id || '');
  const createBooking = useCreateBooking();
  const { createPayment, isCreatingPayment } = useMarketplacePayment();

  useEffect(() => {
    if (!space || !selectedDate) return;

    const availability = (space.availability_hours ?? {}) as AvailabilitySchedule;
    const dayKey = getDayKeyFromDate(selectedDate);
    const dayAvailability = availability?.[dayKey];

    const nextStartTime =
      (typeof dayAvailability?.start === 'string' && dayAvailability.start.trim()) ||
      resolveAvailabilityTime(availability, 'start');
    const nextEndTime =
      (typeof dayAvailability?.end === 'string' && dayAvailability.end.trim()) ||
      resolveAvailabilityTime(availability, 'end');

    setStartTime(nextStartTime);
    setEndTime(nextEndTime);
  }, [space, selectedDate]);

  const handleBooking = async () => {
    if (!user) {
      toast({ title: t('spaceDetail.pleaseSignIn'), variant: 'destructive' });
      return;
    }

    if (!selectedDate || !space || !id) return;

    const startDateTime = new Date(selectedDate);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    startDateTime.setHours(startHour, startMinute);

    const endDateTime = new Date(selectedDate);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    endDateTime.setHours(endHour, endMinute);

    const totalHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    const totalAmount = totalHours * space.price_per_hour;

    try {
      // First create the booking
      const booking = await createBooking.mutateAsync({
        space_id: id,
        start_date: selectedDate.toISOString().split('T')[0],
        end_date: selectedDate.toISOString().split('T')[0],
        start_time: startTime,
        end_time: endTime,
        total_hours: Math.round(totalHours),
        total_amount: totalAmount,
        guests_count: guestsCount,
      });

      // Then create the marketplace payment session
      if (booking) {
        createPayment({
          booking_id: booking.id,
          space_id: id,
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({ title: t('spaceDetail.failedBooking'), variant: 'destructive' });
    }
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast({ title: t('spaceDetail.signInFavorites'), variant: 'destructive' });
      return;
    }
    if (id) {
      toggleFavorite.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="w-full h-96 rounded-xl mb-8" />
              <Skeleton className="w-3/4 h-8 mb-4" />
              <Skeleton className="w-full h-32" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="w-full h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-background">
        <Header forceScrolled={true} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('spaceDetail.spaceNotFound')}</h1>
          <Link to="/explore">
            <Button>{t('spaceDetail.backToExplore')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header forceScrolled={true} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mt-16">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">{space.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-yellow-500" />
              <span className="font-semibold">{space.rating}</span>
              <span className="text-muted-foreground">({space.total_reviews} reviews)</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <MapPin className="h-4 w-4" />
              <span className="underline">
                {space.address}, {space.city}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ShareDialog
                title={space.title}
                description={space.description}
                image={space.images[0]}
                location={`${space.city}, ${space.address}`}
                rating={space.rating}
                reviewCount={space.total_reviews}
                spaceType={space.categories?.name}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-foreground hover:bg-secondary"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('spaceDetail.share')}</span>
                </Button>
              </ShareDialog>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className="flex items-center gap-2 text-foreground hover:bg-secondary"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="hidden sm:inline">
                  {isFavorite ? t('spaceDetail.saved') : t('spaceDetail.save')}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery - Airbnb Style */}
        <div className="mb-12">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[60vh] max-h-[600px] rounded-xl overflow-hidden">
            {/* Main Image */}
            <button
              type="button"
              className="col-span-4 md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <img
                src={space.images[0] || '/placeholder.svg'}
                alt={space.title}
                className="w-full h-full object-cover hover:brightness-95 transition-all"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </button>
            {/* Secondary Images */}
            {space.images.slice(1, 5).map((image, index) => (
              <button
                key={index + 1}
                type="button"
                className="col-span-2 md:col-span-1 relative group cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={image}
                  alt={`View ${index + 2}`}
                  className="w-full h-full object-cover hover:brightness-95 transition-all"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </button>
            ))}
          </div>
          {space.images.length > 5 && (
            <Button variant="outline" size="sm" className="mt-4">
              {t('spaceDetail.showAllPhotos', { count: space.images.length })}
            </Button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info Header */}
            <div className="flex items-center justify-between pb-6 border-b">
              <div className="flex-1">
                <Link
                  to={createLocalizedPath(`/host/${space.owner_id}`)}
                  className="group inline-block"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg group-hover:bg-primary/90 transition-colors">
                      {(space.profiles?.full_name || 'H')[0]}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {t('spaceDetail.hostedBy', { name: space.profiles?.full_name || 'Host' })}
                      </h2>
                      <span className="text-sm text-muted-foreground group-hover:underline">
                        {t('hostProfile.title')}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {t('spaceDetail.upToPeople', { count: space.capacity })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Maximize2 className="h-4 w-4" />
                    {space.area_sqm} m²
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {t('spaceDetail.hourlyBooking')}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-8 border-b">
              <p className="text-foreground text-base leading-relaxed whitespace-pre-line">
                {space.description}
              </p>
            </div>

            {/* Features & Amenities */}
            <div className="pb-8 border-b space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {t('spaceDetail.features')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {space.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm font-normal"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {t('spaceDetail.amenities')}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {space.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      <AmenityBadge amenity={amenity} variant="icon-only" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability Calendar */}
            <div className="pb-8 border-b">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {t('spaceDetail.availability')}
              </h3>
              <AvailabilityCalendar
                bookings={spaceBookings || []}
                mode="single"
                showLegend={true}
                className="w-full"
              />
            </div>

            {/* Policies */}
            {space.policies && (
              <div className="pb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {t('spaceDetail.bookingPolicies')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{space.policies}</p>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-2 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  {/* Price Header */}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-semibold text-foreground">
                        {getCurrencySymbol()}
                        {space.price_per_hour}
                      </span>
                      <span className="text-base text-muted-foreground ml-1">
                        {t('common.perHour')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      <span className="font-semibold">{space.rating}</span>
                      <span className="text-muted-foreground">({space.total_reviews})</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Date & Time Selection */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        {t('spaceDetail.selectDate')}
                      </Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          {t('spaceDetail.startTime')}
                        </Label>
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="h-12 px-4"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          {t('spaceDetail.endTime')}
                        </Label>
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="h-12 px-4"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        {t('spaceDetail.numberOfGuests')}
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        max={space.capacity}
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(Number.parseInt(e.target.value, 10) || 1)}
                        className="h-12 px-4"
                      />
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  {selectedDate && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground underline">
                            {getCurrencySymbol()}
                            {space.price_per_hour} x{' '}
                            {(new Date(`2000-01-01T${endTime}`).getTime() -
                              new Date(`2000-01-01T${startTime}`).getTime()) /
                              (1000 * 60 * 60)}{' '}
                            {t('common.hours')}
                          </span>
                          <span className="font-medium">
                            {getCurrencySymbol()}
                            {((new Date(`2000-01-01T${endTime}`).getTime() -
                              new Date(`2000-01-01T${startTime}`).getTime()) /
                              (1000 * 60 * 60)) *
                              space.price_per_hour}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground underline">
                            {t('spaceDetail.serviceFee')}
                          </span>
                          <span className="font-medium">
                            {getCurrencySymbol()}
                            {Math.round(
                              ((new Date(`2000-01-01T${endTime}`).getTime() -
                                new Date(`2000-01-01T${startTime}`).getTime()) /
                                (1000 * 60 * 60)) *
                                space.price_per_hour *
                                0.15
                            )}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-base pt-2">
                          <span>{t('spaceDetail.total')}</span>
                          <span>
                            {getCurrencySymbol()}
                            {((new Date(`2000-01-01T${endTime}`).getTime() -
                              new Date(`2000-01-01T${startTime}`).getTime()) /
                              (1000 * 60 * 60)) *
                              space.price_per_hour +
                              Math.round(
                                ((new Date(`2000-01-01T${endTime}`).getTime() -
                                  new Date(`2000-01-01T${startTime}`).getTime()) /
                                  (1000 * 60 * 60)) *
                                  space.price_per_hour *
                                  0.15
                              )}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Booking Button */}
                  <Button
                    className="w-full h-12 bg-primary hover:bg-[#3B82F6] text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    onClick={handleBooking}
                    disabled={!selectedDate || createBooking.isPending || isCreatingPayment}
                  >
                    {(() => {
                      if (createBooking.isPending) return t('spaceDetail.creatingBooking');
                      if (isCreatingPayment) return t('spaceDetail.redirectingPayment');
                      return t('spaceDetail.reservePayNow');
                    })()}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    {t('spaceDetail.securePayment')}
                  </p>

                  <Separator />

                  {/* Contact Owner */}
                  <ContactOwnerButton
                    spaceId={space.id}
                    ownerId={space.owner_id}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Full Width Sections */}
        {/* Reviews Section - Full Width */}
        <div className="mt-12 pt-12 border-t">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 fill-current text-yellow-500" />
            <h3 className="text-2xl font-semibold text-foreground">
              {space.rating} · {space.total_reviews} reviews
            </h3>
          </div>
          <ReviewsSection spaceId={space.id} />
        </div>

        {/* Location Map Section - Full Width */}
        {!!(space.latitude && space.longitude) && (
          <div className="mt-12 pt-12 border-t">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              {t('spaceDetail.whereYoullBe')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {space.address}, {space.city}
            </p>
            {isGoogleMapsConfigured() ? (
              <div className="h-[480px] w-full rounded-xl overflow-hidden border">
                <GoogleMapProvider>
                  <SpaceLocationMap
                    latitude={space.latitude}
                    longitude={space.longitude}
                    zoom={15}
                  />
                </GoogleMapProvider>
              </div>
            ) : (
              <div className="h-[480px] w-full rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('spaceDetail.mapNotAvailable')}</h3>
                  <p className="text-muted-foreground">{t('spaceDetail.mapNotConfigured')}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SpaceDetail;
