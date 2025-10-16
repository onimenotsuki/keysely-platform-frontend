import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero-office.jpg';
import { useTranslation } from '../hooks/useTranslation';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/${language}/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/${language}/explore`);
    }
  };

  return (
    <section
      id="home"
      className="hero-section"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="hero-overlay"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 fade-in-up animate">
            {t('hero.title')}
          </h1>
          <p
            className="text-xl md:text-2xl mb-12 text-gray-200 fade-in-up animate"
            style={{ animationDelay: '0.2s' }}
          >
            {t('hero.subtitle')}
          </p>

          <form
            onSubmit={handleSearch}
            className="search-container mx-auto fade-in-up animate"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex-1 flex items-center">
              <i className="fas fa-search text-muted-foreground text-xl ml-4"></i>
              <input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn-search">
              <i className="fas fa-search mr-2"></i>
              {t('hero.searchButton')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
