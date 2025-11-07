import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Mail, Phone, Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface HostVerificationBadgesProps {
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isIdentityVerified?: boolean;
  isSuperhost?: boolean;
}

export const HostVerificationBadges = ({
  isEmailVerified = true, // Email is always verified if user exists
  isPhoneVerified = false,
  isIdentityVerified = false,
  isSuperhost = false,
}: HostVerificationBadgesProps) => {
  const { t } = useTranslation();

  const verifications = [
    {
      icon: Mail,
      label: t('hostProfile.emailVerified'),
      verified: isEmailVerified,
    },
    {
      icon: Phone,
      label: t('hostProfile.phoneVerified'),
      verified: isPhoneVerified,
    },
    {
      icon: Shield,
      label: t('hostProfile.identityVerified'),
      verified: isIdentityVerified,
    },
  ];

  return (
    <div className="space-y-3">
      {isSuperhost && (
        <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-full">
            <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{t('hostProfile.superhost')}</h4>
            <p className="text-sm text-muted-foreground">{t('hostProfile.superhostDescription')}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="font-semibold text-foreground">{t('hostProfile.verifications')}</h4>
        <div className="space-y-2">
          {verifications.map((verification) => {
            const Icon = verification.icon;
            return (
              <div
                key={verification.label}
                className={`flex items-center gap-3 ${
                  verification.verified ? 'text-foreground' : 'text-muted-foreground opacity-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{verification.label}</span>
                {verification.verified && (
                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
