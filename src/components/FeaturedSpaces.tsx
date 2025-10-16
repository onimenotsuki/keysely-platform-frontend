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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A2B42] mb-4">
            {t('featured.title')}
          </h2>
          <p className="text-xl text-gray-600">{t('featured.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSpaces.map((space) => (
            <Link key={space.id} to={`/${language}/space/${space.id}`} className="group block">
              <div className="overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={space.images?.[0] || '/placeholder-office.jpg'}
                    alt={space.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg">
                    <span className="text-[#1A2B42] font-bold text-lg">
                      {getCurrencySymbol()}
                      {space.price_per_hour}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">/hr</span>
                  </div>
                </div>

                <div className="p-5 bg-white">
                  <h3 className="text-xl font-bold text-[#1A2B42] mb-2 group-hover:text-[#3B82F6] transition-colors">
                    {space.title}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-3">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm">{space.city}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-4">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-sm">
                      {t('featured.upTo')} {space.capacity} {t('featured.people')}
                    </span>
                  </div>

                  {space.features && space.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {space.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {featuredSpaces.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-6">{t('featured.noSpaces')}</p>
            <Link
              to={`/${language}/list-space`}
              className="inline-block bg-[#1A2B42] hover:bg-[#3B82F6] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('featured.addFirstSpace')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSpaces;
