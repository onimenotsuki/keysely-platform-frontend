import { MapPin, Users } from 'lucide-react';
import { useTranslation } from '../../../../hooks/useTranslation';

interface SpaceDetailsProps {
  city: string;
  capacity: number;
}

export const SpaceDetails = ({ city, capacity }: SpaceDetailsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center text-muted-foreground mb-2">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="text-sm truncate">{city}</span>
      </div>

      <div className="flex items-center text-muted-foreground mb-3">
        <Users className="h-4 w-4 mr-1" />
        <span className="text-sm">
          {t('common.upTo')} {capacity} {t('common.people')}
        </span>
      </div>
    </>
  );
};
