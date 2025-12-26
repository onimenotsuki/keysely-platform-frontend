import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
  Shield,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { createListSpaceStepPath } from '@/pages/list-space/paths';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { useTranslation } from '../hooks/useTranslation';

const ListSpaceNew = () => {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  const stats = [
    { value: '10,000+', label: t('listSpace.marketing.stats.spaces') },
    { value: '$50M+', label: t('listSpace.marketing.stats.earned') },
    { value: '500+', label: t('listSpace.marketing.stats.cities') },
  ];

  const howItWorks = [
    {
      icon: Building2,
      title: t('listSpace.marketing.howItWorks.step1.title'),
      description: t('listSpace.marketing.howItWorks.step1.description'),
    },
    {
      icon: Calendar,
      title: t('listSpace.marketing.howItWorks.step2.title'),
      description: t('listSpace.marketing.howItWorks.step2.description'),
    },
    {
      icon: DollarSign,
      title: t('listSpace.marketing.howItWorks.step3.title'),
      description: t('listSpace.marketing.howItWorks.step3.description'),
    },
  ];

  const spaceTypes = [
    {
      title: t('listSpace.marketing.spaceTypes.office.title'),
      description: t('listSpace.marketing.spaceTypes.office.description'),
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    },
    {
      title: t('listSpace.marketing.spaceTypes.meeting.title'),
      description: t('listSpace.marketing.spaceTypes.meeting.description'),
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&h=600&fit=crop',
    },
    {
      title: t('listSpace.marketing.spaceTypes.coworking.title'),
      description: t('listSpace.marketing.spaceTypes.coworking.description'),
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
    },
    {
      title: t('listSpace.marketing.spaceTypes.event.title'),
      description: t('listSpace.marketing.spaceTypes.event.description'),
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    },
  ];

  const trustFeatures = [
    {
      icon: Shield,
      title: t('listSpace.marketing.trust.insurance.title'),
      description: t('listSpace.marketing.trust.insurance.description'),
    },
    {
      icon: Users,
      title: t('listSpace.marketing.trust.support.title'),
      description: t('listSpace.marketing.trust.support.description'),
    },
    {
      icon: CheckCircle,
      title: t('listSpace.marketing.trust.verification.title'),
      description: t('listSpace.marketing.trust.verification.description'),
    },
  ];

  const faqs = [
    {
      question: t('listSpace.marketing.faq.q1.question'),
      answer: t('listSpace.marketing.faq.q1.answer'),
    },
    {
      question: t('listSpace.marketing.faq.q2.question'),
      answer: t('listSpace.marketing.faq.q2.answer'),
    },
    {
      question: t('listSpace.marketing.faq.q3.question'),
      answer: t('listSpace.marketing.faq.q3.answer'),
    },
    {
      question: t('listSpace.marketing.faq.q4.question'),
      answer: t('listSpace.marketing.faq.q4.answer'),
    },
  ];

  // Add scroll listener to change header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.7);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  return (
    <div className="min-h-screen bg-background">
      <Header forceScrolled={isScrolled} />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-brand-navy/70"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {t('listSpace.marketing.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            {t('listSpace.marketing.hero.subtitle')}
          </p>
          <Link
            to={user ? createListSpaceStepPath(language, user.id, 0) : `/${language}/auth`}
            className="inline-flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            {t('listSpace.marketing.hero.cta')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</div>
                <div className="text-lg text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('listSpace.marketing.howItWorks.title')}
            </h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              {t('listSpace.marketing.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-4">
                  <step.icon className="w-10 h-10" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">{index + 1}</div>
                <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                <p className="text-muted leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Space Types Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('listSpace.marketing.spaceTypes.title')}
            </h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              {t('listSpace.marketing.spaceTypes.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {spaceTypes.map((space, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-80"
              >
                <img
                  src={space.image}
                  alt={space.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-brand-navy/90">
                  <h3 className="text-2xl font-bold mb-2">{space.title}</h3>
                  <p className="text-white/90">{space.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('listSpace.marketing.trust.title')}
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {t('listSpace.marketing.trust.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-white/90 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('listSpace.marketing.faq.title')}
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-foreground mb-3">{faq.question}</h3>
                <p className="text-muted leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-accent/30 text-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('listSpace.marketing.finalCta.title')}
          </h2>
          <p className="text-xl text-primary/80 mb-8 max-w-2xl mx-auto">
            {t('listSpace.marketing.finalCta.subtitle')}
          </p>
          <Link
            to={user ? createListSpaceStepPath(language, user.id, 0) : `/${language}/auth`}
            className="inline-flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            {t('listSpace.marketing.finalCta.cta')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ListSpaceNew;
