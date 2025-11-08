import { OwnerListingsSection } from '@/components/features/owner-dashboard/OwnerListingsSection';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MySpaces = () => {
  const { t } = useTranslation();
  const { createLocalizedPath } = useLanguageRouting();

  return (
    <div className="min-h-screen bg-background">
      <Header forceScrolled />

      <div className="container mx-auto px-4 py-16 mt-12">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t('ownerDashboard.mySpacesTitle')}
              </h1>
              <p className="text-muted-foreground">{t('ownerDashboard.mySpacesSubtitle')}</p>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link to={createLocalizedPath('/owner-dashboard')}>
                <ArrowLeft className="h-4 w-4" />
                {t('ownerDashboard.backToDashboard')}
              </Link>
            </Button>
          </div>

          <OwnerListingsSection />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MySpaces;
