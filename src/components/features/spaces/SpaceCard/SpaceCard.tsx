import { useNavigate } from 'react-router-dom';
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
  variant?: 'default' | 'compact';
}

export const SpaceCard = ({ space, variant = 'default' }: SpaceCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { data: isFavorite } = useIsFavorite(space.id);
  const toggleFavorite = useToggleFavorite();

  const handleCardClick = () => {
    if (variant === 'compact') {
      navigate(`/space/${space.id}`);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
    <Card
      className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
        variant === 'compact' ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      <SpaceImage
        imageUrl={space.images?.[0] || ''}
        title={space.title}
        pricePerHour={space.price_per_hour}
        isFavorite={!!isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />

      <CardContent className="p-4">
        <SpaceTitle title={space.title} rating={space.rating} totalReviews={space.total_reviews} />

        <SpaceDetails
          city={space.city}
          capacity={space.capacity}
          showCapacity={variant === 'default'}
        />

        <SpaceFeatures features={space.features || []} />

        {variant === 'default' && <SpaceActions spaceId={space.id} />}
      </CardContent>
    </Card>
  );
};
