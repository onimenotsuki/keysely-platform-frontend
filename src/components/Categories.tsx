import { useCategories } from '../hooks/useCategories';
import { useTranslation } from '../hooks/useTranslation';

const Categories = () => {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section id="explore" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('categories.title')}</h2>
            <p className="text-xl text-muted-foreground">{t('categories.subtitle')}</p>
          </div>
          <div className="category-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="category-card animate-pulse">
                <div className="bg-gray-200 h-full rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="explore" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 fade-in-up animate">
            {t('categories.title')}
          </h2>
          <p className="text-xl text-muted-foreground fade-in-up animate" style={{ animationDelay: '0.2s' }}>
            {t('categories.subtitle')}
          </p>
        </div>

        <div className="category-grid">
          {categories?.map((category, index) => (
            <div
              key={category.id}
              className="category-card fade-in-up animate"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <img
                src={category.image_url || `/placeholder-category-${index + 1}.jpg`}
                alt={category.name}
                className="category-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-200 text-sm">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;