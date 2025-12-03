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
    <section id="explore" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A2B42] mb-4">
            {t('categories.title')}
          </h2>
          <p className="text-xl text-gray-600">{t('categories.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer"
            >
              <img
                src={category.image_url || `/placeholder.svg`}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-brand-navy/90">
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-white/80 text-sm line-clamp-2">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
