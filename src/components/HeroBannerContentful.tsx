import { useHeroBanner } from '../hooks/useContentful';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Hero Banner Component with Contentful Integration
 *
 * This component fetches and displays the hero banner from Contentful CMS.
 * It shows the CTA text and background images managed through Contentful.
 */

const HeroBannerContentful = () => {
  const { t } = useTranslation();
  const { data: heroBanner, isLoading, error } = useHeroBanner();

  // Loading state
  if (isLoading) {
    return (
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gray-200 animate-pulse">
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="h-16 bg-gray-300 rounded w-3/4 mb-8"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-12"></div>
            <div className="h-64 bg-gray-300 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    console.error('Hero Banner Error:', error);
    return (
      <section className="relative min-h-[85vh] flex items-center justify-center bg-red-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 text-lg font-semibold">
            {t('errors.contentLoadError') || 'Error loading hero banner from Contentful'}
          </p>
          <p className="text-sm text-gray-600 mt-2">Please check your Contentful configuration.</p>
        </div>
      </section>
    );
  }

  // No content state
  if (!heroBanner) {
    return (
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-lg">No hero banner configured in Contentful.</p>
        </div>
      </section>
    );
  }

  // Extract fields safely with type assertions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields = heroBanner.fields as any;
  const cta: string = fields.cta || 'Find Your Perfect Workspace';
  const images = fields.images || [];

  // Get the first image URL if available
  const backgroundImageUrl =
    images.length > 0 && images[0]?.fields?.file?.url ? `https:${images[0].fields.file.url}` : '';

  return (
    <section
      id="home"
      className="relative min-h-[85vh] flex items-center justify-center"
      style={{
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: backgroundImageUrl ? 'transparent' : '#1A2B42',
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero Title from Contentful CTA */}
          <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            {cta}
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-3xl font-light">
            {t('hero.subtitle')}
          </p>

          {/* Search Card - Keep your existing search functionality */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hero.whatLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hero.whereLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('hero.locationPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hero.whenLabel')}
                </label>
                <button className="w-full bg-[#1A2B42] hover:bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                  {t('hero.search')}
                </button>
              </div>
            </div>
          </div>

          {/* Additional images gallery (if multiple images) */}
          {images.length > 1 && (
            <div className="mt-6 flex gap-2 overflow-x-auto">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {images.slice(1).map((image: any, idx: number) => {
                const imageUrl = image?.fields?.file?.url ? `https:${image.fields.file.url}` : '';
                const imageTitle = image?.fields?.title || `Gallery image ${idx + 1}`;
                return (
                  <img
                    // Using sys.id would be better, but using index + timestamp for unique key
                    key={image?.sys?.id || `hero-${Date.now()}-${idx}`}
                    src={imageUrl}
                    alt={imageTitle}
                    className="h-20 w-32 object-cover rounded-lg shadow-lg"
                  />
                );
              })}
            </div>
          )}

          {/* Contentful Debug Info (remove in production) */}
          <div className="mt-8 p-4 bg-blue-900/50 backdrop-blur-sm rounded-lg">
            <p className="text-sm text-white/80">
              <strong>Contentful Hero Banner Active:</strong> &quot;{cta}&quot; |{images.length}{' '}
              image(s) loaded from Contentful CMS
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBannerContentful;
