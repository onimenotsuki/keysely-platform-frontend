import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import {
  useOwnerBookings,
  useOwnerSpaces,
  useOwnerStats,
  type OwnerSpace,
} from '@/hooks/useOwnerData';
import { useTranslation } from '@/hooks/useTranslation';
import { createListSpaceStepPath } from '@/pages/list-space/paths';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StripeConnectOnboarding from '../components/StripeConnectOnboarding';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { createLocalizedPath, currentLanguage } = useLanguageRouting();
  const { data: ownerSpaces = [], isLoading: spacesLoading } = useOwnerSpaces();
  const { data: ownerStats, isLoading: statsLoading } = useOwnerStats();
  const { data: ownerBookings = [], isLoading: bookingsLoading } = useOwnerBookings();

  const publishedSpaces = ownerSpaces.filter((space) => space.is_active);
  const draftSpaces = ownerSpaces.filter((space) => !space.is_active);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'confirmed':
        return 'bg-primary text-primary-foreground';
      case 'completed':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('ownerDashboard.active');
      case 'pending':
        return t('ownerDashboard.pending');
      case 'inactive':
        return t('ownerDashboard.inactive');
      case 'confirmed':
        return t('ownerDashboard.confirmed');
      case 'completed':
        return t('ownerDashboard.completed');
      default:
        return status;
    }
  };

  const renderSpaceGrid = (
    spacesToRender: OwnerSpace[],
    options: { showAddCard?: boolean } = {}
  ) => {
    const { showAddCard = false } = options;

    if (spacesToRender.length === 0 && !showAddCard) {
      return null;
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {spacesToRender.map((space) => (
          <Card key={space.id} className="hover:shadow-md transition-shadow overflow-hidden">
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={space.images[0] || '/placeholder.svg'}
                alt={space.title}
                className="w-full h-full object-cover"
                onError={(event) => {
                  const target = event.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <Badge
                className={`absolute top-2 right-2 z-10 ${getStatusColor(space.is_active ? 'active' : 'inactive')}`}
              >
                {getStatusText(space.is_active ? 'active' : 'inactive')}
              </Badge>
            </div>

            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">{space.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">
                <i className="fas fa-map-marker-alt mr-1"></i>
                {space.city}
              </p>

              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-foreground">
                  ${space.price_per_hour}/{t('ownerDashboard.hour')}
                </span>
                <div className="flex items-center space-x-1 text-yellow-500 text-sm">
                  <i className="fas fa-star"></i>
                  <span>{space.rating}</span>
                  <span className="text-muted-foreground">({space.total_reviews})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">{t('ownerDashboard.thisMonth')}</p>
                  <p className="font-medium">
                    {space.bookings_this_month} {t('ownerDashboard.bookings')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('ownerDashboard.earnings')}</p>
                  <p className="font-medium">${space.earnings_this_month}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <i className="fas fa-edit mr-2"></i>
                  {t('ownerDashboard.edit')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/space/${space.id}`)}
                >
                  <i className="fas fa-eye mr-2"></i>
                  {t('ownerDashboard.view')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {showAddCard && (
          <Card
            className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer"
            onClick={() => {
              if (user) {
                navigate(createListSpaceStepPath(currentLanguage, user.id, 0));
              }
            }}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-64">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-plus text-primary text-2xl"></i>
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {t('ownerDashboard.addNewListingCard')}
              </h3>
              <p className="text-muted-foreground text-sm text-center mb-4">
                {t('ownerDashboard.addNewListingDesc')}
              </p>
              <Button className="btn-primary">{t('ownerDashboard.getStarted')}</Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderBookingsContent = () => {
    if (bookingsLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (ownerBookings.length === 0) {
      return (
        <div className="text-center py-12">
          <i className="fas fa-calendar-times text-4xl text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('ownerDashboard.noBookings')}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {ownerBookings.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={booking.profiles?.avatar_url} alt={booking.profiles?.full_name} />
                <AvatarFallback>{booking.profiles?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">
                  {booking.profiles?.full_name || t('ownerDashboard.unknownGuest')}
                </p>
                <p className="text-sm text-muted-foreground">{booking.spaces?.title}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.start_date), 'MMM dd, yyyy')} • {booking.start_time} -{' '}
                  {booking.end_time} • {booking.guests_count} {t('ownerDashboard.guests')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">${booking.total_amount}</p>
              <Badge variant="secondary" className={`capitalize ${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {t('ownerDashboard.title')}
              </h1>
              <p className="text-xl text-muted-foreground">{t('ownerDashboard.subtitle')}</p>
            </div>
            <Button
              className="btn-primary"
              onClick={() => {
                if (user) {
                  navigate(createListSpaceStepPath(currentLanguage, user.id, 0));
                }
              }}
              disabled={!user}
            >
              <i className="fas fa-plus mr-2"></i>
              {t('ownerDashboard.addNewListing')}
            </Button>
          </div>

          {/* Public Profile Card */}
          {user && (
            <Card className="mb-8 bg-accent/5 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-user-circle text-accent text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {t('hostProfile.viewPublicProfile')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t('hostProfile.editHostInfo')}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="gap-2">
                    <Link to={createLocalizedPath(`/host/${user.id}`)}>
                      <ExternalLink className="h-4 w-4" />
                      {t('hostProfile.title')}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                      <div className="h-8 bg-muted rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        {t('ownerDashboard.totalEarnings')}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        ${ownerStats?.total_earnings || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                      <i className="fas fa-dollar-sign text-success text-xl"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        {t('ownerDashboard.thisMonth')}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        ${ownerStats?.this_month_earnings || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <i className="fas fa-calendar text-primary text-xl"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        {t('ownerDashboard.totalBookings')}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {ownerStats?.total_bookings || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <i className="fas fa-bookmark text-blue-500 text-xl"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        {t('ownerDashboard.occupancyRate')}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {ownerStats?.occupancy_rate || 0}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                      <i className="fas fa-chart-line text-purple-500 text-xl"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <Tabs defaultValue="payments" className="space-y-6">
            <TabsList>
              <TabsTrigger value="payments">{t('ownerDashboard.paymentSetup')}</TabsTrigger>
              <TabsTrigger value="listings">{t('ownerDashboard.myListings')}</TabsTrigger>
              <TabsTrigger value="bookings">{t('ownerDashboard.recentBookings')}</TabsTrigger>
              <TabsTrigger value="analytics">{t('ownerDashboard.analytics')}</TabsTrigger>
              <TabsTrigger value="calendar">{t('ownerDashboard.calendar')}</TabsTrigger>
            </TabsList>

            {/* Payment Setup Tab */}
            <TabsContent value="payments" className="space-y-6">
              <StripeConnectOnboarding />
            </TabsContent>

            {/* Listings Tab */}
            <TabsContent value="listings" className="space-y-6">
              {spacesLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <div className="animate-pulse">
                        <div className="w-full h-48 bg-muted rounded-t-lg"></div>
                        <CardContent className="p-6">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                          <div className="h-4 bg-muted rounded w-1/4"></div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-10">
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        {t('ownerDashboard.publishedListings')}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {publishedSpaces.length}
                      </Badge>
                    </div>

                    {publishedSpaces.length > 0 ? (
                      renderSpaceGrid(publishedSpaces, { showAddCard: true })
                    ) : (
                      <Card className="border-dashed border-border">
                        <CardContent className="p-6 text-center text-muted-foreground">
                          {t('ownerDashboard.noPublishedListings')}
                        </CardContent>
                      </Card>
                    )}
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        {t('ownerDashboard.unpublishedListings')}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {draftSpaces.length}
                      </Badge>
                    </div>

                    {draftSpaces.length > 0 ? (
                      renderSpaceGrid(draftSpaces)
                    ) : (
                      <Card className="border-dashed border-border">
                        <CardContent className="p-6 text-center text-muted-foreground">
                          {t('ownerDashboard.noUnpublishedListings')}
                        </CardContent>
                      </Card>
                    )}
                  </section>
                </div>
              )}
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('ownerDashboard.recentBookings')}</CardTitle>
                </CardHeader>
                <CardContent>{renderBookingsContent()}</CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('ownerDashboard.earningsOverview')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <i className="fas fa-chart-bar text-4xl text-muted-foreground mb-4"></i>
                      <p className="text-muted-foreground">
                        {t('ownerDashboard.earningsChartPlaceholder')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('ownerDashboard.bookingTrends')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <i className="fas fa-chart-line text-4xl text-muted-foreground mb-4"></i>
                      <p className="text-muted-foreground">
                        {t('ownerDashboard.bookingTrendsPlaceholder')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('ownerDashboard.availabilityCalendar')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <i className="fas fa-calendar-alt text-4xl text-muted-foreground mb-4"></i>
                    <p className="text-muted-foreground">
                      {t('ownerDashboard.calendarPlaceholder')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OwnerDashboard;
