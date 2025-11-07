import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface StepOccupationProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const StepOccupation = ({ value, onChange, error }: StepOccupationProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t('onboarding.occupation.title')}
        </h2>
        <p className="text-gray-600">{t('onboarding.subtitle')}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="occupation" className="text-sm font-medium text-gray-700">
          {t('onboarding.occupation.label')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="occupation"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('onboarding.occupation.placeholder')}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
          autoFocus
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
};
