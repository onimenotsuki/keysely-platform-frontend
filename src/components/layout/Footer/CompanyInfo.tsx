import logoImage from '../../../assets/logo-tr.png';
import { useTranslation } from '../../../hooks/useTranslation';

export const CompanyInfo = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex items-center mb-6">
        <img src={logoImage} alt="Keysely Logo" className="h-8 w-auto brightness-0 invert" />
      </div>
      <p className="text-gray-300 mb-6 leading-relaxed">{t('footer.description')}</p>
    </div>
  );
};
