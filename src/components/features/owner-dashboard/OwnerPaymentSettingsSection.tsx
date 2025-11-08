import StripeConnectOnboarding from '@/components/StripeConnectOnboarding';
import { useTranslation } from '@/hooks/useTranslation';

export const OwnerPaymentSettingsSection = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          {t('ownerDashboard.paymentSetup')}
        </h2>
        <p className="text-muted-foreground">{t('ownerDashboard.paymentSetupPageDescription')}</p>
      </div>

      <StripeConnectOnboarding />
    </div>
  );
};

export default OwnerPaymentSettingsSection;
