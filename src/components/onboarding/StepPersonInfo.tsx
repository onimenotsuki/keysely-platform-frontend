import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface StepPersonInfoProps {
  fullName: string;
  occupation: string;
  onFullNameChange: (value: string) => void;
  onOccupationChange: (value: string) => void;
  error?: string;
}

export const StepPersonInfo = ({
  fullName,
  occupation,
  onFullNameChange,
  onOccupationChange,
  error,
}: StepPersonInfoProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t('onboarding.personInfo.title')}
        </h2>
        <p className="text-gray-600">{t('onboarding.subtitle')}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
            {t('onboarding.personInfo.fullName')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder={t('onboarding.personInfo.fullNamePlaceholder')}
            className="h-14 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation" className="text-sm font-medium text-gray-700">
            {t('onboarding.occupation.label')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="occupation"
            type="text"
            value={occupation}
            onChange={(e) => onOccupationChange(e.target.value)}
            placeholder={t('onboarding.occupation.placeholder')}
            className="h-14 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
};
