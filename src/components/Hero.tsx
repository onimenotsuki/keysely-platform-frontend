import { Calendar, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero-office.jpg';
import { useTranslation } from '../hooks/useTranslation';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (location.trim()) params.append('location', location.trim());
    if (date) params.append('date', date);

    const queryString = params.toString();
    navigate(`/${language}/explore${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <section
      id="home"
      className="relative min-h-[85vh] flex items-center justify-center"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero Title - Peerspace style */}
          <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-3xl font-light">
            {t('hero.subtitle')}
          </p>

          {/* Search Card - Peerspace style with 3 inputs */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {/* Activity/What field */}
              <div className="md:col-span-4 p-4 md:p-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hero.whatLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-base text-gray-900 placeholder:text-gray-400 border-none outline-none focus:ring-0"
                />
              </div>

              {/* Where field */}
              <div className="md:col-span-4 p-4 md:p-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hero.whereLabel')}
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={t('hero.locationPlaceholder')}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-base text-gray-900 placeholder:text-gray-400 border-none outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* When field + Search button */}
              <div className="md:col-span-4 p-4 md:p-5 flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('hero.whenLabel')}
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder={t('hero.datePlaceholder')}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-base text-gray-900 placeholder:text-gray-400 border-none outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#1A2B42] hover:bg-[#3B82F6] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg whitespace-nowrap"
                >
                  {t('hero.search')}
                </button>
              </div>
            </div>
          </form>

          {/* Small text below search - optional */}
          <p className="text-white/60 text-sm mt-6 text-center">{t('hero.helpText')}</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
