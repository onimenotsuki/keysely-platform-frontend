import { useEffect, useState } from 'react';
import { useHeroBanner } from '../hooks/useContentful';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Hero Banner Component with Contentful Integration
 *
 * This component fetches and displays the hero banner from Contentful CMS.
 * It shows the CTA text and background images managed through Contentful.
 * Features an automatic image slider with smooth fade transitions.
 */

const HeroBannerContentful = () => {
  const { t } = useTranslation();
  const { data: heroBanner, isLoading, error } = useHeroBanner();

  // Slider state - must be before any conditional returns
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Extract fields safely with type assertions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields = heroBanner?.fields as any;
  const cta: string = fields?.cta || 'Find Your Perfect Workspace';
  const images = fields?.images || [];

  // Auto-advance slider effect
  useEffect(() => {
    if (images.length <= 1) return; // No slider needed for single image

    const advanceSlide = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    };

    const interval = setInterval(advanceSlide, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Loading state
  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gray-200 animate-pulse">
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
      <section className="relative min-h-screen flex items-center justify-center bg-red-50">
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
      <section className="relative min-h-screen flex items-center justify-center bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-lg">No hero banner configured in Contentful.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-screen full-width-breakout flex items-center justify-center overflow-hidden"
    >
      {/* Background Image Slider with Fade Transition */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {images.map((image: any, index: number) => {
        const imageUrl = image?.fields?.file?.url ? `https:${image.fields.file.url}` : '';
        const isActive = index === currentImageIndex;

        return (
          <div
            key={image?.sys?.id || `bg-image-${index}`}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#1A2B42',
              opacity: isActive && !isTransitioning ? 1 : 0,
              zIndex: isActive ? 1 : 0,
            }}
          />
        );
      })}

      {/* Fallback background if no images */}
      {images.length === 0 && (
        <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: '#1A2B42' }} />
      )}

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/70 via-black/60 to-black/70 z-10"></div>

      {/* Content wrapper */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto w-full">
          {/* Hero Title from Contentful CTA */}
          <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            {cta}
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-3xl font-light">
            {t('hero.subtitle')}
          </p>

          {/* Search Card - Keep your existing search functionality */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
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

          {/* Slider Indicators (dots) */}
          {images.length > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {images.map((image: any, index: number) => (
                <button
                  key={image?.sys?.id || `indicator-${image?.fields?.file?.url || index}`}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentImageIndex(index);
                      setIsTransitioning(false);
                    }, 500);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Contentful Debug Info (remove in production) */}
          <div className="mt-8 p-4 bg-blue-900/50 backdrop-blur-sm rounded-lg">
            <p className="text-sm text-white/80">
              <strong>Contentful Hero Banner Active:</strong> &quot;{cta}&quot; |{images.length}{' '}
              image(s) loaded from Contentful CMS | Slide {currentImageIndex + 1}/{images.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBannerContentful;
