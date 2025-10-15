import { useTranslation } from '../../../../hooks/useTranslation';
import { Badge } from '../../../ui/badge';

interface SpaceFeaturesProps {
  features: string[];
}

export const SpaceFeatures = ({ features }: SpaceFeaturesProps) => {
  const { t } = useTranslation();

  if (!features || features.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-4">
      {features.slice(0, 3).map((feature, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {feature}
        </Badge>
      ))}
      {features.length > 3 && (
        <Badge variant="secondary" className="text-xs">
          +{features.length - 3} {t('common.more')}
        </Badge>
      )}
    </div>
  );
};
