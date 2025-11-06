import { AmenityBadge } from '@/components/features/spaces/AmenityBadge';
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';
import ContactOwnerButton from '@/components/ContactOwnerButton';
import ReviewsSection from '@/components/ReviewsSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCreateBooking } from '@/hooks/useBookings';
import { useBookingsBySpace } from '@/hooks/useBookingsBySpace';
import { useFavorites, useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useMarketplacePayment } from '@/hooks/useMarketplacePayment';
import { useSpace } from '@/hooks/useSpaces';
import { useTranslation } from '@/hooks/useTranslation';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

const SpaceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [guestsCount, setGuestsCount] = useState(1);

  const getCurrencySymbol = () => {
    return t('common.currency');
  };

  const { data: space, isLoading } = useSpace(id!);
  const { data: spaceBookings } = useBookingsBySpace(id!);
  const favoritesQuery = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const { data: isFavorite } = useIsFavorite(id!);
  const createBooking = useCreateBooking();
  const { createPayment, isCreatingPayment } = useMarketplacePayment();

  const handleBooking = async () => {
    if (!user) {
      toast({ title: t('spaceDetail.pleaseSignIn'), variant: 'destructive' });
      return;
    }

    if (!selectedDate || !space) return;

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
        space_id: id!,
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
          space_id: id!,
        });
      }
    } catch (error) {
      toast({ title: t('spaceDetail.failedBooking'), variant: 'destructive' });
    }
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast({ title: t('spaceDetail.signInFavorites'), variant: 'destructive' });
      return;
    }
    toggleFavorite.mutate(id!);
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
        <Header />
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
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            {t('spaceDetail.home')}
          </Link>
          <span className="mx-2">›</span>
          <Link to="/explore" className="hover:text-primary">
            {t('spaceDetail.explore')}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">{space.title}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative mb-4 w-full h-96 overflow-hidden rounded-xl">
                <img
                  src={space.images[selectedImage] || '/placeholder.svg'}
                  alt={space.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium z-10">
                  {getCurrencySymbol()}
                  {space.price_per_hour}
                  {t('common.perHour')}
                </div>
              </div>

              {space.images && space.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {space.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`View ${index + 1}`}
                        className="w-full h-20 object-cover hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Space Info */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{space.title}</h1>
                  <p className="text-muted-foreground text-lg">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {space.address}, {space.city}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <i className="fas fa-star"></i>
                  <span className="font-medium text-foreground">{space.rating}</span>
                  <span className="text-muted-foreground">({space.total_reviews} reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <i className="fas fa-users text-2xl text-primary mb-2"></i>
                  <p className="font-medium">
                    {t('spaceDetail.upToPeople', { count: space.capacity })}
                  </p>
                </div>
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <i className="fas fa-ruler-combined text-2xl text-primary mb-2"></i>
                  <p className="font-medium">{space.area_sqm} m²</p>
                </div>
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <i className="fas fa-clock text-2xl text-primary mb-2"></i>
                  <p className="font-medium">{t('spaceDetail.hourlyBooking')}</p>
                </div>
              </div>

              <p className="text-foreground text-lg leading-relaxed">{space.description}</p>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="amenities" className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="amenities">{t('spaceDetail.amenities')}</TabsTrigger>
                <TabsTrigger value="availability">{t('spaceDetail.availability')}</TabsTrigger>
                <TabsTrigger value="policies">{t('spaceDetail.policies')}</TabsTrigger>
                <TabsTrigger value="reviews">{t('spaceDetail.reviews')}</TabsTrigger>
              </TabsList>

              <TabsContent value="amenities" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('spaceDetail.features')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {space.features.map((feature) => (
                        <Badge key={feature} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('spaceDetail.amenities')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {space.amenities.map((amenity) => (
                        <AmenityBadge key={amenity} amenity={amenity} variant="icon-only" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="availability">
                <AvailabilityCalendar
                  bookings={spaceBookings || []}
                  mode="single"
                  showLegend={true}
                  className="w-full"
                />
              </TabsContent>

              <TabsContent value="policies">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('spaceDetail.bookingPolicies')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {space.policies ? (
                      <div>
                        <h4 className="font-medium mb-2">{t('spaceDetail.policies')}</h4>
                        <p className="text-muted-foreground">{space.policies}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">{t('spaceDetail.noPolicies')}</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <ReviewsSection spaceId={space.id} />
              </TabsContent>
            </Tabs>

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t('spaceDetail.hostedBy', { name: space.profiles?.full_name || 'Host' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-xl">
                    {(space.profiles?.full_name || 'H')[0]}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {space.profiles?.full_name || 'Host'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('spaceDetail.workspaceOwner')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>
                    {getCurrencySymbol()}
                    {space.price_per_hour} {t('common.perHour')}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-500 text-sm">
                    <i className="fas fa-star"></i>
                    <span>{space.rating}</span>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2">{t('spaceDetail.selectDate')}</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('spaceDetail.startTime')}</Label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('spaceDetail.endTime')}</Label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-1">
                    {t('spaceDetail.numberOfGuests')}
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max={space.capacity}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
                  />
                </div>

                {selectedDate && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>
                        {getCurrencySymbol()}
                        {space.price_per_hour} x{' '}
                        {(new Date(`2000-01-01T${endTime}`).getTime() -
                          new Date(`2000-01-01T${startTime}`).getTime()) /
                          (1000 * 60 * 60)}{' '}
                        {t('common.hours')}
                      </span>
                      <span>
                        {getCurrencySymbol()}
                        {((new Date(`2000-01-01T${endTime}`).getTime() -
                          new Date(`2000-01-01T${startTime}`).getTime()) /
                          (1000 * 60 * 60)) *
                          space.price_per_hour}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>{t('spaceDetail.serviceFee')}</span>
                      <span>
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
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
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
                )}

                <Button
                  className="w-full btn-primary"
                  size="lg"
                  onClick={handleBooking}
                  disabled={!selectedDate || createBooking.isPending || isCreatingPayment}
                >
                  {createBooking.isPending
                    ? t('spaceDetail.creatingBooking')
                    : isCreatingPayment
                      ? t('spaceDetail.redirectingPayment')
                      : t('spaceDetail.reservePayNow')}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t('spaceDetail.securePayment')}
                </p>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={handleToggleFavorite}>
                    <Heart
                      className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>

                  <ContactOwnerButton
                    spaceId={space.id}
                    ownerId={space.owner_id}
                    className="w-full"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleToggleFavorite}
                    disabled={toggleFavorite.isPending}
                  >
                    <i className={`fas fa-heart mr-2 ${isFavorite ? 'text-red-500' : ''}`}></i>
                    {isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SpaceDetail;
