import { Link } from 'react-router-dom';
import { useLanguageContext } from '../../../../contexts/LanguageContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import { Button } from '../../../ui/button';

interface SpaceActionsProps {
  spaceId: string;
}

export const SpaceActions = ({ spaceId }: SpaceActionsProps) => {
  const { t } = useTranslation();
  const { language } = useLanguageContext();

  return (
    <Link to={`/${language}/space/${spaceId}`}>
      <Button className="w-full">{t('common.viewDetails')}</Button>
    </Link>
  );
};
