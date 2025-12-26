import { OwnerBookingsSection } from '@/components/features/owner-dashboard/OwnerBookingsSection';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const OwnerBookingsPage = () => {
  const { t } = useTranslation();
  const { createLocalizedPath } = useLanguageRouting();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t('ownerDashboard.bookingsTitle')}
              </h1>
              <p className="text-muted-foreground">{t('ownerDashboard.bookingsSubtitle')}</p>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link to={createLocalizedPath('/owner-dashboard')}>
                <ArrowLeft className="h-4 w-4" />
                {t('ownerDashboard.backToDashboard')}
              </Link>
            </Button>
          </div>

          <OwnerBookingsSection />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OwnerBookingsPage;
