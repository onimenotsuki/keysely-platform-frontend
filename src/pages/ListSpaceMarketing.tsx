import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Home,
  Shield,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

const ListSpaceMarketing = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { value: '10,000+', label: t('listSpace.marketing.hostsWorldwide') },
    { value: '$500+', label: t('listSpace.marketing.avgMonthlyIncome') },
    { value: '4.8/5', label: t('listSpace.marketing.avgRating') },
    { value: '95%', label: t('listSpace.marketing.satisfactionRate') },
  ];

  const spaceTypes = [
    {
      icon: Building2,
      title: t('listSpace.marketing.officeSpaces'),
      description: t('listSpace.marketing.officeSpacesDesc'),
    },
    {
      icon: Users,
      title: t('listSpace.marketing.meetingRooms'),
      description: t('listSpace.marketing.meetingRoomsDesc'),
    },
    {
      icon: Home,
      title: t('listSpace.marketing.coworkingSpaces'),
      description: t('listSpace.marketing.coworkingSpacesDesc'),
    },
  ];

  const howItWorks = [
    {
      step: '1',
      icon: Building2,
      title: t('listSpace.marketing.step1Title'),
      description: t('listSpace.marketing.step1Desc'),
    },
    {
      step: '2',
      icon: Calendar,
      title: t('listSpace.marketing.step2Title'),
      description: t('listSpace.marketing.step2Desc'),
    },
    {
      step: '3',
      icon: DollarSign,
      title: t('listSpace.marketing.step3Title'),
      description: t('listSpace.marketing.step3Desc'),
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: t('listSpace.marketing.benefit1Title'),
      description: t('listSpace.marketing.benefit1Desc'),
    },
    {
      icon: Shield,
      title: t('listSpace.marketing.benefit2Title'),
      description: t('listSpace.marketing.benefit2Desc'),
    },
    {
      icon: Star,
      title: t('listSpace.marketing.benefit3Title'),
      description: t('listSpace.marketing.benefit3Desc'),
    },
    {
      icon: Users,
      title: t('listSpace.marketing.benefit4Title'),
      description: t('listSpace.marketing.benefit4Desc'),
    },
  ];

  const faqs = [
    {
      question: t('listSpace.marketing.faq1Question'),
      answer: t('listSpace.marketing.faq1Answer'),
    },
    {
      question: t('listSpace.marketing.faq2Question'),
      answer: t('listSpace.marketing.faq2Answer'),
    },
    {
      question: t('listSpace.marketing.faq3Question'),
      answer: t('listSpace.marketing.faq3Answer'),
    },
    {
      question: t('listSpace.marketing.faq4Question'),
      answer: t('listSpace.marketing.faq4Answer'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-white py-24 full-width-breakout">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t('listSpace.marketing.heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              {t('listSpace.marketing.heroSubtitle')}
            </p>
            <Button
              size="lg"
              onClick={() => navigate(`/${language}/list-space`)}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-xl font-semibold"
            >
              {t('listSpace.marketing.getStarted')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Space Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t('listSpace.marketing.everySpaceBelongs')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('listSpace.marketing.everySpaceBelongsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {spaceTypes.map((type, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <type.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{type.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('listSpace.marketing.howItWorks')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('listSpace.marketing.howItWorksDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-primary/20"></div>
                )}
                <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 mt-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center">{step.title}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate(`/${language}/list-space`)}
              className="bg-primary hover:bg-primary-dark text-white text-lg px-8 py-6 rounded-xl font-semibold"
            >
              {t('listSpace.marketing.startListing')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('listSpace.marketing.whyChooseKeysely')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('listSpace.marketing.whyChooseKeyselyDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-6 bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">{t('listSpace.marketing.trustAndSafety')}</h2>
              <p className="text-xl text-muted-foreground">
                {t('listSpace.marketing.trustAndSafetyDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">
                    {t('listSpace.marketing.verifiedBookings')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('listSpace.marketing.verifiedBookingsDesc')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">{t('listSpace.marketing.securePayments')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('listSpace.marketing.securePaymentsDesc')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">
                    {t('listSpace.marketing.propertyProtection')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('listSpace.marketing.propertyProtectionDesc')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white p-6 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">{t('listSpace.marketing.support247')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('listSpace.marketing.support247Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              {t('listSpace.marketing.frequentlyAsked')}
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-semibold text-lg pr-8">{faq.question}</span>
                    <ArrowRight
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('listSpace.marketing.readyToStart')}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {t('listSpace.marketing.readyToStartDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate(`/${language}/list-space`)}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-xl font-semibold"
              >
                {t('listSpace.marketing.listYourSpace')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link to={`/${language}/explore`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl font-semibold"
                >
                  {t('listSpace.marketing.exploreSpaces')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ListSpaceMarketing;
