import { Heart, MapPin, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useIsFavorite, useToggleFavorite } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { useTranslation } from '../hooks/useTranslation';
import { Space } from '../hooks/useSpaces';

interface SpaceCardProps {
  space: Space;
}

const SpaceCard = ({ space }: SpaceCardProps) => {
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
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await toggleFavorite.mutateAsync(space.id);
      toast({
        title: result.action === 'added' ? t('common.addedToFavorites') : t('common.removedFromFavorites'),
        description: result.action === 'added' 
          ? t('common.spaceAddedToFavorites')
          : t('common.spaceRemovedFromFavorites'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.couldNotUpdateFavorites'),
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={space.images?.[0] || '/placeholder-office.jpg'}
          alt={space.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
          onClick={handleToggleFavorite}
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </Button>
        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
          {t('common.currency')}{space.price_per_hour}{t('common.perHour')}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg truncate flex-1 mr-2">{space.title}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{space.rating}</span>
            <span className="text-xs text-muted-foreground">({space.total_reviews})</span>
          </div>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm truncate">{space.city}</span>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-3">
          <Users className="h-4 w-4 mr-1" />
          <span className="text-sm">{t('common.upTo')} {space.capacity} {t('common.people')}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {space.features?.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {space.features && space.features.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{space.features.length - 3} {t('common.more')}
            </Badge>
          )}
        </div>
        
        <Link to={`/space/${space.id}`}>
          <Button className="w-full">
            {t('common.viewDetails')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SpaceCard;