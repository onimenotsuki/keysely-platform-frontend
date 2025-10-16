import { useFeaturedSpaceHighlights } from '../hooks/useContentful';
import { useTranslation } from '../hooks/useTranslation';

/**
 * Example Component: Contentful Space Highlights
 *
 * This component demonstrates how to fetch and display content from Contentful CMS.
 * It shows featured space highlights managed through Contentful.
 */

const ContentfulExample = () => {
  const { t, language } = useTranslation();
  const { data, isLoading, error } = useFeaturedSpaceHighlights();

  if (isLoading) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold">
              {t('errors.contentLoadError') || 'Error loading content from Contentful'}
            </p>
            <p className="text-sm mt-2">Please check your Contentful configuration and API keys.</p>
          </div>
        </div>
      </section>
    );
  }

  const highlights = data?.items || [];

  if (highlights.length === 0) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p className="text-lg">No featured content available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A2B42] mb-4">
            {language === 'es' ? 'Espacios Destacados' : 'Featured Spaces'}
          </h2>
          <p className="text-xl text-gray-600">
            {language === 'es'
              ? 'Contenido destacado desde Contentful CMS'
              : 'Featured content from Contentful CMS'}
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((highlight) => {
            const { title, description, images, space } = highlight.fields;
            const imageUrl = images?.[0]?.fields?.file?.url;

            return (
              <div
                key={highlight.sys.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                {imageUrl && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={`https:${imageUrl}`}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1A2B42] mb-2 group-hover:text-[#3B82F6] transition-colors">
                    {title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>

                  {/* Space Info (if available) */}
                  {space && (
                    <div className="flex items-center text-sm text-gray-500">
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
                      <span>{space.spaceName}</span>
                    </div>
                  )}

                  {/* CTA */}
                  <button className="mt-4 w-full bg-[#1A2B42] hover:bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                    {language === 'es' ? 'Ver Detalles' : 'View Details'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Metadata (for debugging - remove in production) */}
        <div className="mt-12 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Contentful Integration Active:</strong> Displaying {highlights.length} featured
            items from Contentful CMS
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContentfulExample;
