import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface StepBirthdayProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const StepBirthday = ({ value, onChange, error }: StepBirthdayProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('onboarding.birthday.title')}</h2>
        <p className="text-gray-600">{t('onboarding.subtitle')}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthday" className="text-sm font-medium text-gray-700">
          {t('onboarding.birthday.label')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="birthday"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('onboarding.birthday.placeholder')}
          className="h-14 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          max={new Date().toISOString().split('T')[0]}
          autoFocus
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        <p className="text-xs text-gray-500 mt-1">Debes tener al menos 18 años</p>
      </div>
    </div>
  );
};
