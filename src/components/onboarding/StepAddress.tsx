import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddressData } from '@/hooks/useOnboardingProgress';
import { useTranslation } from '@/hooks/useTranslation';

interface StepAddressProps {
  value: AddressData;
  onChange: (value: AddressData) => void;
}

export const StepAddress = ({ value, onChange }: StepAddressProps) => {
  const { t } = useTranslation();

  const handleFieldChange = (field: keyof AddressData, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('onboarding.address.title')}</h2>
        <p className="text-gray-600">{t('onboarding.subtitle')}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="streetAddress" className="text-sm font-medium text-gray-700">
            {t('onboarding.address.streetAddress')}
          </Label>
          <Input
            id="streetAddress"
            type="text"
            value={value.streetAddress}
            onChange={(e) => handleFieldChange('streetAddress', e.target.value)}
            placeholder={t('onboarding.address.streetPlaceholder')}
            className="h-14 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              {t('onboarding.address.city')}
            </Label>
            <Input
              id="city"
              type="text"
              value={value.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              placeholder={t('onboarding.address.cityPlaceholder')}
              className="h-14 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
              {t('onboarding.address.state')}
            </Label>
            <Input
              id="state"
              type="text"
              value={value.state}
              onChange={(e) => handleFieldChange('state', e.target.value)}
              placeholder={t('onboarding.address.statePlaceholder')}
              className="h-14 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
              {t('onboarding.address.postalCode')}
            </Label>
            <Input
              id="postalCode"
              type="text"
              value={value.postalCode}
              onChange={(e) => handleFieldChange('postalCode', e.target.value)}
              placeholder={t('onboarding.address.postalPlaceholder')}
              className="h-14 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
              {t('onboarding.address.country')}
            </Label>
            <Input
              id="country"
              type="text"
              value={value.country}
              onChange={(e) => handleFieldChange('country', e.target.value)}
              placeholder={t('onboarding.address.countryPlaceholder')}
              className="h-14 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">{t('onboarding.address.optional')}</p>
      </div>
    </div>
  );
};
