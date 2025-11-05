import { MapPin, Users } from 'lucide-react';
import { useTranslation } from '../../../../hooks/useTranslation';

interface SpaceDetailsProps {
  city: string;
  capacity: number;
  showCapacity?: boolean;
}

export const SpaceDetails = ({ city, capacity, showCapacity = true }: SpaceDetailsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={`flex items-center text-muted-foreground ${showCapacity ? 'mb-2' : 'mb-3'}`}>
        <MapPin className="h-4 w-4 mr-1" />
        <span className="text-sm truncate">{city}</span>
      </div>

      {showCapacity && (
        <div className="flex items-center text-muted-foreground mb-3">
          <Users className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {t('common.upTo')} {capacity} {t('common.people')}
          </span>
        </div>
      )}
    </>
  );
};
