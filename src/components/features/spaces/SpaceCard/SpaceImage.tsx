import { Heart } from 'lucide-react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';

interface SpaceImageProps {
  imageUrl: string;
  title: string;
  pricePerHour: number;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const SpaceImage = ({
  imageUrl,
  title,
  pricePerHour,
  isFavorite,
  onToggleFavorite,
}: SpaceImageProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <img
        src={imageUrl || '/placeholder-office.jpg'}
        alt={title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
        onClick={onToggleFavorite}
      >
        <Heart
          className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
        />
      </Button>
      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
        {t('common.currency')}
        {pricePerHour}
        {t('common.perHour')}
      </Badge>
    </div>
  );
};
