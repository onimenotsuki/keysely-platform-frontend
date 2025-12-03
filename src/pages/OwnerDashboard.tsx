import { OwnerAvailabilityManager } from '@/components/features/owner-dashboard/OwnerAvailabilityManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import { useOwnerBookings, useOwnerSpaces, useOwnerStats } from '@/hooks/useOwnerData';
import { useTranslation } from '@/hooks/useTranslation';
import { createListSpaceStepPath } from '@/pages/list-space/paths';
import { formatCurrency } from '@/utils/formatCurrency';
import { Calendar, CreditCard, ExternalLink, ListChecks } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { createLocalizedPath, currentLanguage } = useLanguageRouting();
  const { data: ownerSpaces = [] } = useOwnerSpaces();
  const { data: ownerStats, isLoading: statsLoading } = useOwnerStats();
  const { data: ownerBookings = [] } = useOwnerBookings();
  const primaryCurrency = ownerSpaces[0]?.currency ?? ownerBookings[0]?.currency ?? 'MXN';

  return (
    <div className="min-h-screen bg-background">
      <Header forceScrolled />

      <div className="container mx-auto px-4 py-16 mt-12">
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
                        {formatCurrency(ownerStats?.total_earnings ?? 0, primaryCurrency)}
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
                        {formatCurrency(ownerStats?.this_month_earnings ?? 0, primaryCurrency)}
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg">{t('ownerDashboard.paymentSetup')}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t('ownerDashboard.paymentSetupDescription')}
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('ownerDashboard.paymentSetupCta')}
                </p>
                <Button asChild>
                  <Link to={createLocalizedPath('/owner-dashboard/payment-settings')}>
                    {t('ownerDashboard.manage')}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg">{t('ownerDashboard.myListings')}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t('ownerDashboard.myListingsDescription')}
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ListChecks className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('ownerDashboard.listingsCount', { count: ownerSpaces.length })}
                </p>
                <Button asChild>
                  <Link to={createLocalizedPath('/owner-dashboard/my-spaces')}>
                    {t('ownerDashboard.manage')}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg">{t('ownerDashboard.recentBookings')}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t('ownerDashboard.recentBookingsDescription')}
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('ownerDashboard.bookingsCount', { count: ownerBookings.length })}
                </p>
                <Button asChild>
                  <Link to={createLocalizedPath('/owner-dashboard/bookings')}>
                    {t('ownerDashboard.viewAll')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
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

          {/* Availability Manager */}
          <OwnerAvailabilityManager spaces={ownerSpaces} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OwnerDashboard;
