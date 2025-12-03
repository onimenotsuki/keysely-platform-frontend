import { Heart } from 'lucide-react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { formatCurrency } from '../../../../utils/formatCurrency';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';

interface SpaceImageProps {
  imageUrl: string;
  title: string;
  pricePerHour: number;
  currency: string;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const SpaceImage = ({
  imageUrl,
  title,
  pricePerHour,
  currency,
  isFavorite,
  onToggleFavorite,
}: SpaceImageProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-48 overflow-hidden">
      <img
        src={imageUrl || '/placeholder.svg'}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder.svg';
        }}
      />
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 z-10"
        onClick={onToggleFavorite}
      >
        <Heart
          className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
        />
      </Button>
      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground z-10">
        {formatCurrency(pricePerHour, currency)} {t('common.perHour')}
      </Badge>
    </div>
  );
};
