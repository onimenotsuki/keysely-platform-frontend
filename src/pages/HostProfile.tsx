import { HostStatsCard } from '@/components/features/host/HostStatsCard';
import { HostVerificationBadges } from '@/components/features/host/HostVerificationBadges';
import { LanguagesList } from '@/components/features/host/LanguagesList';
import { SpaceCard } from '@/components/features/spaces/SpaceCard';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import {
  useHostProfile,
  useHostReviews,
  useHostSpaces,
  useHostStats,
} from '@/hooks/useHostProfile';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Award,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MessageCircle,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const HostProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { createLocalizedPath } = useLanguageRouting();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentSpacePage, setCurrentSpacePage] = useState(1);
  const SPACES_PER_PAGE = 6;

  // Reset pagination when host ID changes
  useEffect(() => {
    setCurrentSpacePage(1);
    setShowAllReviews(false);
  }, [id]);

  const { data: hostProfile, isLoading: profileLoading } = useHostProfile(id || '');
  const { data: hostSpaces, isLoading: spacesLoading } = useHostSpaces(id || '');
  const { data: hostReviews, isLoading: reviewsLoading } = useHostReviews(id || '');
  const { data: hostStats, isLoading: statsLoading } = useHostStats(id || '');

  const activeSpaces = hostSpaces?.filter((s) => s.is_active) || [];
  const inactiveSpaces = hostSpaces?.filter((s) => !s.is_active) || [];

  // Pagination for spaces
  const totalSpacePages = Math.ceil(activeSpaces.length / SPACES_PER_PAGE);
  const startSpaceIndex = (currentSpacePage - 1) * SPACES_PER_PAGE;
  const endSpaceIndex = startSpaceIndex + SPACES_PER_PAGE;
  const displayedSpaces = activeSpaces.slice(startSpaceIndex, endSpaceIndex);

  const displayedReviews = showAllReviews ? hostReviews : hostReviews?.slice(0, 6);

  // Format response time
  const getResponseTimeText = (hours?: number) => {
    if (!hours) return t('hostProfile.stats.within1Hour');
    if (hours === 1) return t('hostProfile.stats.within1Hour');
    if (hours < 24) return t('hostProfile.stats.withinHours', { hours });
    return t('hostProfile.stats.within1Day');
  };

  if (profileLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header forceScrolled={true} />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="w-full h-64" />
                <Skeleton className="w-full h-96" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="w-full h-96" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hostProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header forceScrolled={true} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('hostProfile.errors.notFound')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('hostProfile.errors.notFoundDescription')}
          </p>
          <Button asChild>
            <Link to="/explore">{t('hostProfile.errors.goBack')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const hostYear = new Date(hostProfile.created_at).getFullYear();
  const isViewingOwnProfile =
    Boolean(user?.id) && user?.id === hostProfile.user_id && Boolean(hostProfile.is_host);

  return (
    <div className="min-h-screen bg-background">
      <Header forceScrolled={true} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mt-16">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar and basic info */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="w-32 h-32 border-4 border-border">
                <AvatarImage src={hostProfile.avatar_url || undefined} />
                <AvatarFallback className="text-3xl">
                  {(hostProfile.full_name || 'H')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info and stats */}
            <div className="flex-1">
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-4xl font-bold text-foreground">
                    {hostProfile.full_name || 'Host'}
                  </h1>
                  {hostProfile.is_superhost && (
                    <Badge className="bg-accent text-accent-foreground px-3 py-1">
                      <Award className="h-4 w-4 mr-1" />
                      {t('hostProfile.superhost')}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {t('hostProfile.hostSince', { year: hostYear })}
                </p>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{hostStats?.totalReviews || 0}</span>
                  <span className="text-muted-foreground">{t('hostProfile.stats.reviews')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{hostStats?.activeSpaces || 0}</span>
                  <span className="text-muted-foreground">{t('hostProfile.stats.spaces')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{hostStats?.yearsHosting || 1}</span>
                  <span className="text-muted-foreground">
                    {t('hostProfile.stats.yearsHosting')}
                  </span>
                </div>
              </div>

              {isViewingOwnProfile && (
                <div className="mt-6">
                  <Button asChild variant="outline" className="gap-2">
                    <Link to={createLocalizedPath('/owner-dashboard')}>
                      <LayoutDashboard className="h-4 w-4" />
                      {t('hostProfile.ownerProfile.goToOwnerDashboard')}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  {t('hostProfile.aboutHost', { name: hostProfile.full_name || 'Host' })}
                </h2>
                <Separator />

                {/* Bio */}
                {hostProfile.bio && (
                  <div>
                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                      {hostProfile.bio}
                    </p>
                  </div>
                )}

                {/* Work Description */}
                {hostProfile.work_description && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t('hostProfile.workDescription')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {hostProfile.work_description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Company */}
                {hostProfile.company && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t('hostProfile.company')}
                      </p>
                      <p className="text-sm text-muted-foreground">{hostProfile.company}</p>
                    </div>
                  </div>
                )}

                {/* Languages */}
                {hostProfile.languages && hostProfile.languages.length > 0 && (
                  <div className="pt-2">
                    <LanguagesList languages={hostProfile.languages} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Host Spaces */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  {t('hostProfile.spaces.title', { name: hostProfile.full_name || 'Host' })}
                </h2>
                {activeSpaces.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {t('hostProfile.spaces.activeSpaces', { count: activeSpaces.length })}
                  </p>
                )}
              </div>
              {spacesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-80" />
                  ))}
                </div>
              ) : activeSpaces.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedSpaces.map((space) => (
                      <SpaceCard key={space.id} space={space} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalSpacePages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentSpacePage((prev) => Math.max(1, prev - 1))}
                        disabled={currentSpacePage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalSpacePages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentSpacePage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentSpacePage(page)}
                            className="min-w-[2.5rem]"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentSpacePage((prev) => Math.min(totalSpacePages, prev + 1))
                        }
                        disabled={currentSpacePage === totalSpacePages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {inactiveSpaces.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      {t('hostProfile.spaces.inactiveSpaces', { count: inactiveSpaces.length })}
                    </p>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('hostProfile.spaces.noSpaces')}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  {t('hostProfile.reviews.title', { name: hostProfile.full_name || 'Host' })}
                </h2>
                {hostStats && hostStats.totalReviews > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{hostStats.averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({hostStats.totalReviews} {t('hostProfile.stats.reviews').toLowerCase()})
                    </span>
                  </div>
                )}
              </div>

              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              ) : hostReviews && hostReviews.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedReviews?.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6 space-y-3">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={review.profiles.avatar_url || undefined} />
                              <AvatarFallback>
                                {(review.profiles.full_name || 'U')[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-foreground">
                                  {review.profiles.full_name}
                                </p>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                  <span className="text-sm font-semibold">{review.rating}</span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {review.comment}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('hostProfile.reviews.reviewFor', { space: review.spaces.title })}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {hostReviews.length > 6 && (
                    <div className="mt-6 text-center">
                      <Button variant="outline" onClick={() => setShowAllReviews(!showAllReviews)}>
                        {showAllReviews
                          ? t('hostProfile.reviews.showLess')
                          : t('hostProfile.reviews.showMore')}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('hostProfile.reviews.noReviews')}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Stats Cards */}
              {hostProfile.response_rate !== null && hostProfile.response_rate !== undefined && (
                <HostStatsCard
                  icon={MessageCircle}
                  label={t('hostProfile.stats.responseRate')}
                  value={`${hostProfile.response_rate}%`}
                  description={
                    t('hostProfile.stats.responseTime') +
                    ': ' +
                    getResponseTimeText(hostProfile.response_time_hours)
                  }
                />
              )}

              {hostStats && (
                <HostStatsCard
                  icon={Star}
                  label={t('hostProfile.stats.rating')}
                  value={hostStats.averageRating.toFixed(1)}
                  description={`${hostStats.totalReviews} ${t('hostProfile.stats.reviews').toLowerCase()}`}
                />
              )}

              {/* Verifications */}
              <Card>
                <CardContent className="p-6">
                  <HostVerificationBadges
                    isEmailVerified={true}
                    isPhoneVerified={!!hostProfile.phone}
                    isIdentityVerified={hostProfile.is_identity_verified || false}
                    isSuperhost={hostProfile.is_superhost || false}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HostProfile;
