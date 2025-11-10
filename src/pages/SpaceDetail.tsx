import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';
import ContactOwnerButton from '@/components/ContactOwnerButton';
import ReviewsSection from '@/components/ReviewsSection';
import { AmenityBadge } from '@/components/features/spaces/AmenityBadge';
import { MapboxProvider, isMapboxConfigured } from '@/components/map/MapboxProvider';
import { SpaceLocationMap } from '@/components/map/SpaceLocationMap';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ShareDialog } from '@/components/ui/share-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useBlockedHours } from '@/hooks/useBlockedHours';
import { useCreateBooking } from '@/hooks/useBookings';
import { useBookingsBySpace } from '@/hooks/useBookingsBySpace';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import { useMarketplacePayment } from '@/hooks/useMarketplacePayment';
import { useSpace } from '@/hooks/useSpaces';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils/formatCurrency';
import { addHours, differenceInMinutes, format, isBefore, isSameDay, parse } from 'date-fns';
import { Clock, Heart, MapPin, Maximize2, Share2, Star, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState(1);

  const { data: space, isLoading } = useSpace(id || '');
  const { data: spaceBookings } = useBookingsBySpace(id || '');
  const {
    data: blockedHours = [],
    isLoading: isBlockedHoursLoading,
    isFetching: isBlockedHoursFetching,
  } = useBlockedHours(space?.id ?? null, selectedDate ?? new Date());
  const toggleFavorite = useToggleFavorite();
  const { data: isFavorite } = useIsFavorite(id || '');
  const createBooking = useCreateBooking();
  const { createPayment, isCreatingPayment } = useMarketplacePayment();

  const currency = space?.currency ?? 'MXN';

  const selectedDateKey = useMemo(
    () => (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null),
    [selectedDate]
  );

  const availability = useMemo(
    () => (space?.availability_hours ?? {}) as AvailabilitySchedule,
    [space]
  );

  const dayAvailability = useMemo(() => {
    if (!selectedDate) {
      return { start: DEFAULT_START_TIME, end: DEFAULT_END_TIME };
    }

    const dayKey = getDayKeyFromDate(selectedDate);
    const day = availability?.[dayKey];
    const start =
      (typeof day?.start === 'string' && day.start.trim()) ||
      resolveAvailabilityTime(availability, 'start');
    const end =
      (typeof day?.end === 'string' && day.end.trim()) ||
      resolveAvailabilityTime(availability, 'end');

    return { start, end };
  }, [availability, selectedDate]);

  const bookingsForDay = useMemo(() => {
    if (!selectedDateKey) return [];

    return (
      spaceBookings?.filter(
        (booking) =>
          booking.start_date === selectedDateKey &&
          (booking.status === 'confirmed' || booking.status === 'pending')
      ) ?? []
    );
  }, [spaceBookings, selectedDateKey]);

  const blockedHoursForDay = useMemo(
    () => blockedHours.filter((blockedHour) => blockedHour.blocked_date === selectedDateKey) ?? [],
    [blockedHours, selectedDateKey]
  );

  const unavailableSlots = useMemo(() => {
    if (!selectedDate) return new Set<string>();

    const unavailable = new Set<string>();

    for (const blockedHour of blockedHoursForDay) {
      unavailable.add(blockedHour.start_time);
    }

    for (const booking of bookingsForDay) {
      const slotStart = parse(booking.start_time, 'HH:mm', selectedDate);
      const slotEnd = parse(booking.end_time, 'HH:mm', selectedDate);
      let cursor = slotStart;

      while (cursor < slotEnd) {
        unavailable.add(format(cursor, 'HH:mm'));
        cursor = addHours(cursor, 1);
      }
    }

    return unavailable;
  }, [blockedHoursForDay, bookingsForDay, selectedDate]);

  const availableStartSlots = useMemo(() => {
    if (!selectedDate) return [];

    const dayStart = parse(dayAvailability.start, 'HH:mm', selectedDate);
    const dayEnd = parse(dayAvailability.end, 'HH:mm', selectedDate);
    const slots: string[] = [];
    const isTodaySelected = isSameDay(selectedDate, new Date());

    let cursor = dayStart;

    while (addHours(cursor, 1) <= dayEnd) {
      const slotKey = format(cursor, 'HH:mm');
      const slotDateTime = cursor;
      const isPastSlot = isTodaySelected && isBefore(slotDateTime, new Date());

      if (!unavailableSlots.has(slotKey) && !isPastSlot) {
        slots.push(slotKey);
      }

      cursor = addHours(cursor, 1);
    }

    return slots;
  }, [dayAvailability.end, dayAvailability.start, selectedDate, unavailableSlots]);

  useEffect(() => {
    if (!selectedDate) return;

    if (availableStartSlots.length === 0) {
      setSelectedSlot('');
      if (startTime) setStartTime('');
      if (endTime) setEndTime('');
      return;
    }

    if (!startTime || !availableStartSlots.includes(startTime)) {
      const nextSlot = availableStartSlots[0];
      setSelectedSlot(nextSlot);
      setStartTime(nextSlot);
      const startDateTime = parse(nextSlot, 'HH:mm', selectedDate);
      setEndTime(format(addHours(startDateTime, 1), 'HH:mm'));
    }
  }, [availableStartSlots, endTime, selectedDate, startTime]);

  const handleTimeSlotChange = (slot: string) => {
    if (!selectedDate) return;
    setSelectedSlot(slot);
    setStartTime(slot);
    const startDateTime = parse(slot, 'HH:mm', selectedDate);
    const endDateTime = addHours(startDateTime, 1);
    setEndTime(format(endDateTime, 'HH:mm'));
  };

  const computedTotalHours = useMemo(() => {
    if (!selectedDate || !startTime || !endTime) return 0;

    const startDateTime = parse(startTime, 'HH:mm', selectedDate);
    const endDateTime = parse(endTime, 'HH:mm', selectedDate);
    const minutes = differenceInMinutes(endDateTime, startDateTime);

    return minutes > 0 ? minutes / 60 : 0;
  }, [endTime, selectedDate, startTime]);

  const rawSubtotal = computedTotalHours * (space?.price_per_hour ?? 0);
  const subtotal = Math.round(rawSubtotal * 100) / 100;
  const serviceFee = Math.round(subtotal * 0.15);
  const totalDue = Math.round((subtotal + serviceFee) * 100) / 100;

  const availabilityLoading = isBlockedHoursLoading || isBlockedHoursFetching;

  const handleBooking = async () => {
    if (!user) {
      toast({ title: t('spaceDetail.pleaseSignIn'), variant: 'destructive' });
      return;
    }

    if (!selectedDate || !space || !id) return;
    if (!startTime || !endTime) {
      toast({ title: t('spaceDetail.noTimeSelected'), variant: 'destructive' });
      return;
    }

    if (!availableStartSlots.includes(startTime)) {
      toast({ title: t('spaceDetail.unavailableSelectedTime'), variant: 'destructive' });
      return;
    }

    const startDateTime = parse(startTime, 'HH:mm', selectedDate);
    const endDateTime = parse(endTime, 'HH:mm', selectedDate);
    const expectedEnd = addHours(startDateTime, 1);
    if (endDateTime.getTime() !== expectedEnd.getTime()) {
      toast({ title: t('spaceDetail.unavailableSelectedTime'), variant: 'destructive' });
      return;
    }
    const totalMinutes = differenceInMinutes(endDateTime, startDateTime);

    if (totalMinutes <= 0 || totalMinutes % 60 !== 0) {
      toast({ title: t('spaceDetail.unavailableSelectedTime'), variant: 'destructive' });
      return;
    }

    const now = new Date();
    const isTodaySelected = isSameDay(selectedDate, now);
    let cursor = startDateTime;

    while (cursor < endDateTime) {
      const slotKey = format(cursor, 'HH:mm');
      const isPastSlot = isTodaySelected && isBefore(cursor, now);

      if (unavailableSlots.has(slotKey) || isPastSlot) {
        toast({ title: t('spaceDetail.unavailableSelectedTime'), variant: 'destructive' });
        return;
      }

      cursor = addHours(cursor, 1);
    }

    const totalHoursSelected = totalMinutes / 60;
    const totalAmount = totalHoursSelected * space.price_per_hour;

    try {
      // First create the booking
      const booking = await createBooking.mutateAsync({
        space_id: id,
        start_date: selectedDate.toISOString().split('T')[0],
        end_date: selectedDate.toISOString().split('T')[0],
        start_time: startTime,
        end_time: endTime,
        total_hours: Math.round(totalHoursSelected),
        total_amount: totalAmount,
        currency,
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
                        {formatCurrency(space.price_per_hour, currency)}
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

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          {t('spaceDetail.selectTimeSlot')}
                        </Label>
                        {availabilityLoading && (
                          <p className="mb-2 text-xs text-muted-foreground">
                            {t('spaceDetail.loadingAvailability')}
                          </p>
                        )}
                        {availableStartSlots.length === 0 ? (
                          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                            {t('spaceDetail.noAvailabilityForDay')}
                          </div>
                        ) : (
                          <Select
                            value={selectedSlot || undefined}
                            onValueChange={(value) => {
                              handleTimeSlotChange(value);
                            }}
                          >
                            <SelectTrigger className="h-12 px-4 text-left">
                              <SelectValue placeholder={t('spaceDetail.selectTimePlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {availableStartSlots.map((slot) => {
                                const slotDateTime = selectedDate
                                  ? parse(slot, 'HH:mm', selectedDate)
                                  : parse(slot, 'HH:mm', new Date());
                                const label = `${format(slotDateTime, 'h:mm a')} - ${format(
                                  addHours(slotDateTime, 1),
                                  'h:mm a'
                                )}`;
                                return (
                                  <SelectItem key={slot} value={slot}>
                                    {label}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        )}
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
                  {selectedDate && computedTotalHours > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground underline">
                            {formatCurrency(space.price_per_hour, currency)} x {computedTotalHours}{' '}
                            {t('common.hours')}
                          </span>
                          <span className="font-medium">{formatCurrency(subtotal, currency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground underline">
                            {t('spaceDetail.serviceFee')}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(serviceFee, currency)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-base pt-2">
                          <span>{t('spaceDetail.total')}</span>
                          <span>{formatCurrency(totalDue, currency)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Booking Button */}
                  <Button
                    className="w-full h-12 bg-primary hover:bg-[#3B82F6] text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    onClick={handleBooking}
                    disabled={
                      !selectedDate ||
                      !startTime ||
                      !endTime ||
                      computedTotalHours <= 0 ||
                      createBooking.isPending ||
                      isCreatingPayment
                    }
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
            {isMapboxConfigured() ? (
              <div className="h-[480px] w-full rounded-xl overflow-hidden border">
                <MapboxProvider>
                  <SpaceLocationMap
                    latitude={space.latitude}
                    longitude={space.longitude}
                    zoom={15}
                  />
                </MapboxProvider>
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
