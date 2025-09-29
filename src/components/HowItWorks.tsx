import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/explore');
    } else {
      navigate('/auth');
    }
  };
  
  const steps = [
    {
      id: 1,
      icon: 'fas fa-search',
      titleKey: 'howItWorks.step1.title',
      descriptionKey: 'howItWorks.step1.description'
    },
    {
      id: 2,
      icon: 'fas fa-calendar-check',
      titleKey: 'howItWorks.step2.title',
      descriptionKey: 'howItWorks.step2.description'
    },
    {
      id: 3,
      icon: 'fas fa-briefcase',
      titleKey: 'howItWorks.step3.title',
      descriptionKey: 'howItWorks.step3.description'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 fade-in-up animate">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-muted-foreground fade-in-up animate" style={{ animationDelay: '0.2s' }}>
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="step-card fade-in-up animate"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="step-icon">
                <i className={step.icon}></i>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {step.id}. {t(step.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(step.descriptionKey)}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 fade-in-up animate" style={{ animationDelay: '0.4s' }}>
          <button onClick={handleGetStarted} className="btn-primary text-lg px-8 py-4">
            <i className="fas fa-rocket mr-2"></i>
            {t('howItWorks.getStarted')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;