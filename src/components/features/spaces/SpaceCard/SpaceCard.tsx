import { useAuth } from '../../../../contexts/AuthContext';
import { useToast } from '../../../../hooks/use-toast';
import { useIsFavorite, useToggleFavorite } from '../../../../hooks/useFavorites';
import { Space } from '../../../../hooks/useSpaces';
import { useTranslation } from '../../../../hooks/useTranslation';
import { Card, CardContent } from '../../../ui/card';
import { SpaceActions } from './SpaceActions';
import { SpaceDetails } from './SpaceDetails';
import { SpaceFeatures } from './SpaceFeatures';
import { SpaceImage } from './SpaceImage';
import { SpaceTitle } from './SpaceTitle';

interface SpaceCardProps {
  space: Space;
}

export const SpaceCard = ({ space }: SpaceCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { data: isFavorite } = useIsFavorite(space.id);
  const toggleFavorite = useToggleFavorite();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: t('common.signInRequired'),
        description: t('common.signInToSaveFavorites'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await toggleFavorite.mutateAsync(space.id);
      toast({
        title:
          result.action === 'added'
            ? t('common.addedToFavorites')
            : t('common.removedFromFavorites'),
        description:
          result.action === 'added'
            ? t('common.spaceAddedToFavorites')
            : t('common.spaceRemovedFromFavorites'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.couldNotUpdateFavorites'),
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <SpaceImage
        imageUrl={space.images?.[0] || ''}
        title={space.title}
        pricePerHour={space.price_per_hour}
        isFavorite={!!isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />

      <CardContent className="p-4">
        <SpaceTitle title={space.title} rating={space.rating} totalReviews={space.total_reviews} />

        <SpaceDetails city={space.city} capacity={space.capacity} />

        <SpaceFeatures features={space.features || []} />

        <SpaceActions spaceId={space.id} />
      </CardContent>
    </Card>
  );
};
