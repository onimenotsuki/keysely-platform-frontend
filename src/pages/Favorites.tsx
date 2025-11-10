import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils/formatCurrency';
import { Heart, MapPin, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const SKELETON_PLACEHOLDERS = Array.from({ length: 6 }, (_, index) => `favorite-skeleton-${index}`);

const Favorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { createLocalizedPath } = useLanguageRouting();
  const { data: favorites, isLoading } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  const handleRemoveFavorite = async (spaceId: string, spaceTitle: string) => {
    try {
      await toggleFavorite.mutateAsync(spaceId);
      toast({
        title: t('favorites.removed'),
        description: `${spaceTitle} ${t('favorites.removedDescription')}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error'),
        description: t('favorites.couldNotRemove'),
        variant: 'destructive',
      });
    }
  };

  const renderContent = (): JSX.Element => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKELETON_PLACEHOLDERS.map((placeholder) => (
            <Skeleton key={placeholder} className="w-full h-80" />
          ))}
        </div>
      );
    }

    if (favorites && favorites.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <Card
              key={favorite.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Link to={createLocalizedPath(`/space/${favorite.spaces?.id}`)}>
                  <img
                    src={favorite.spaces?.images?.[0] || '/placeholder.svg'}
                    alt={favorite.spaces?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
                  onClick={() => {
                    if (favorite.spaces?.id && favorite.spaces?.title) {
                      handleRemoveFavorite(favorite.spaces.id, favorite.spaces.title);
                    }
                  }}
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                  {favorite.spaces
                    ? `${formatCurrency(
                        favorite.spaces.price_per_hour,
                        favorite.spaces.currency
                      )} ${t('favorites.perHour')}`
                    : null}
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Link to={createLocalizedPath(`/space/${favorite.spaces?.id}`)}>
                    <h3 className="font-semibold text-lg truncate flex-1 mr-2 hover:text-primary transition-colors">
                      {favorite.spaces?.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{favorite.spaces?.rating}</span>
                  </div>
                </div>

                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm truncate">{favorite.spaces?.city}</span>
                </div>

                <div className="flex items-center text-muted-foreground mb-4">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">{t('favorites.spaceAvailable')}</span>
                </div>

                <Button asChild className="w-full">
                  <Link to={createLocalizedPath(`/space/${favorite.spaces?.id}`)}>
                    {t('favorites.viewDetails')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('favorites.noFavoritesYet')}</h2>
          <p className="text-muted-foreground mb-6">{t('favorites.noFavoritesDesc')}</p>
          <Button asChild>
            <Link to={createLocalizedPath('/explore')}>{t('common.exploreSpaces')}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('favorites.loginToView')}</h1>
          <Link to={createLocalizedPath('/auth')}>
            <Button>{t('auth.signIn')}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header forceScrolled />

      <div className="container mx-auto px-4 py-16 mt-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('favorites.title')}</h1>
            <p className="text-muted-foreground">{t('favorites.subtitle')}</p>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;
