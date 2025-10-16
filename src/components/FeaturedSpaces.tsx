import { Link } from 'react-router-dom';
import { useSpaces } from '../hooks/useSpaces';
import { useTranslation } from '../hooks/useTranslation';

const FeaturedSpaces = () => {
  const { t, language } = useTranslation();
  const { data: spaces, isLoading } = useSpaces();

  const getCurrencySymbol = () => {
    return language === 'es' ? '$' : 'USD ';
  };

  // Take first 3 spaces as featured
  const featuredSpaces = spaces?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('featured.title')}</h2>
            <p className="text-xl text-muted-foreground">{t('featured.subtitle')}</p>
          </div>
          <div className="spaces-grid">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="space-card animate-pulse">
                <div className="bg-gray-200 h-64 rounded-t-lg"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 fade-in-up animate">
            {t('featured.title')}
          </h2>
          <p
            className="text-xl text-muted-foreground fade-in-up animate"
            style={{ animationDelay: '0.2s' }}
          >
            {t('featured.subtitle')}
          </p>
        </div>

        <div className="spaces-grid">
          {featuredSpaces.map((space, index) => (
            <div
              key={space.id}
              className="space-card fade-in-up animate hover-scale"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="relative">
                <img
                  src={space.images?.[0] || '/placeholder-office.jpg'}
                  alt={space.title}
                  className="space-image"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-primary font-bold text-lg">
                    {getCurrencySymbol()}
                    {space.price_per_hour}
                  </span>
                  <span className="text-muted-foreground text-sm">{t('common.perHour')}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{space.title}</h3>
                <div className="flex items-center text-muted-foreground mb-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  <span>{space.city}</span>
                </div>
                <div className="flex items-center text-muted-foreground mb-4">
                  <i className="fas fa-users mr-2"></i>
                  <span>
                    {t('featured.upTo')} {space.capacity} {t('featured.people')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {space.features?.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Link to={`/${language}/space/${space.id}`}>
                  <button className="btn-primary w-full">
                    <i className="fas fa-calendar-alt mr-2"></i>
                    {t('featured.bookNow')}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {featuredSpaces.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{t('featured.noSpaces')}</p>
            <Link to={`/${language}/list-space`} className="btn-primary">
              {t('featured.addFirstSpace')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSpaces;
