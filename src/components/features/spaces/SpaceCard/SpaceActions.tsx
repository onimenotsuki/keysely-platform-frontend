import { Link } from 'react-router-dom';
import { useTranslation } from '../../../../hooks/useTranslation';
import { Button } from '../../../ui/button';

interface SpaceActionsProps {
  spaceId: string;
}

export const SpaceActions = ({ spaceId }: SpaceActionsProps) => {
  const { t } = useTranslation();

  return (
    <Link to={`/space/${spaceId}`}>
      <Button className="w-full">{t('common.viewDetails')}</Button>
    </Link>
  );
};
