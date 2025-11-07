import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface StepBioProps {
  value: string;
  onChange: (value: string) => void;
}

export const StepBio = ({ value, onChange }: StepBioProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('onboarding.bio.title')}</h2>
        <p className="text-gray-600">{t('onboarding.subtitle')}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
          {t('onboarding.bio.label')} <span className="text-gray-500">(opcional)</span>
        </Label>
        <Textarea
          id="bio"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('onboarding.bio.placeholder')}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent min-h-[120px]"
          autoFocus
        />
        <p className="text-xs text-gray-500 mt-1">
          Comparte un poco sobre ti, tus intereses o qué tipo de espacios buscas
        </p>
      </div>
    </div>
  );
};
