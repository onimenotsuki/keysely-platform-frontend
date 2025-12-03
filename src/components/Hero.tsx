import { useHeroBanner } from '@/hooks/useContentful';
import { cn } from '@/lib/utils';
import { autocompletePlaces, GeocodeResult } from '@/utils/mapboxGeocoding';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { Calendar, Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero-office.jpg';
import { useTranslation } from '../hooks/useTranslation';
import { Calendar as CalendarComponent } from './ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date>();
  const [openCombobox, setOpenCombobox] = useState(false);
  const [places, setPlaces] = useState<GeocodeResult[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { data: heroBannerData, isLoading: isLoadingHeroData } = useHeroBanner();

  // Slider state for Contentful images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Extract Contentful images
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields = heroBannerData?.fields as any;
  const contentfulImages = fields?.images || [];

  // Auto-advance slider effect for Contentful images with smooth crossfade
  useEffect(() => {
    if (contentfulImages.length <= 1) return; // No slider needed for single image

    const interval = setInterval(() => {
      setIsTransitioning(true);
      // Start fading to next image
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % contentfulImages.length);
      }, 100);
      // End transition state after fade completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1600);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, [contentfulImages.length]);

  // Popular cities in Mexico
  const popularCities = useMemo(
    () => [
      { placeName: 'Ciudad de México, México', lat: 19.4326, lng: -99.1332 },
      { placeName: 'Guadalajara, Jalisco, México', lat: 20.6597, lng: -103.3496 },
      { placeName: 'Monterrey, Nuevo León, México', lat: 25.6866, lng: -100.3161 },
      { placeName: 'Querétaro, Querétaro, México', lat: 20.5888, lng: -100.3899 },
      { placeName: 'Puebla, Puebla, México', lat: 19.0414, lng: -98.2063 },
      { placeName: 'Cancún, Quintana Roo, México', lat: 21.1619, lng: -86.8515 },
      { placeName: 'Mérida, Yucatán, México', lat: 20.9674, lng: -89.5926 },
      { placeName: 'Tijuana, Baja California, México', lat: 32.5149, lng: -117.0382 },
      { placeName: 'León, Guanajuato, México', lat: 21.1221, lng: -101.668 },
      { placeName: 'Toluca, Estado de México, México', lat: 19.2826, lng: -99.6557 },
    ],
    []
  );

  // Handle autocomplete search
  useEffect(() => {
    if (!inputValue || inputValue.length < 3) {
      setPlaces([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await autocompletePlaces(inputValue);
      setPlaces(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

    // Extract city name from location (e.g. "Guadalajara, Jalisco, México" -> "Guadalajara")
    if (location.trim()) {
      const cityName = location.split(',')[0].trim();
      params.append('city', cityName);
    }

    if (date) params.append('checkIn', date.toISOString());

    const queryString = params.toString();
    navigate(`/${language}/explore${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <section
      id="home"
      className="relative min-h-[85vh] full-width-breakout flex items-center justify-center overflow-hidden"
    >
      {/* Background Image Slider - Contentful images with smooth crossfade */}
      {contentfulImages.length > 0 ? (
        <>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {contentfulImages.map((image: any, index: number) => {
            const imageUrl = image?.fields?.file?.url ? `https:${image.fields.file.url}` : '';
            const isActive = index === currentImageIndex;
            const isPrevious =
              index === (currentImageIndex - 1 + contentfulImages.length) % contentfulImages.length;

            // Calculate opacity for smooth crossfade
            let opacity = 0;
            if (isActive) {
              opacity = 1;
            } else if (isPrevious && isTransitioning) {
              opacity = 1;
            }

            // Calculate z-index for proper layering
            let zIndex = 0;
            if (isActive) {
              zIndex = 2;
            } else if (isPrevious && isTransitioning) {
              zIndex = 1;
            }

            return (
              <div
                key={image?.sys?.id || `bg-image-${index}`}
                className="absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out"
                style={{
                  backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: '#000000',
                  opacity,
                  zIndex,
                }}
              />
            );
          })}
        </>
      ) : (
        // Fallback to static hero image if no Contentful images
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 w-full h-full bg-black/60 z-10"></div>

      {/* Content wrapper */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto w-full">
          {/* Hero Title - Peerspace style */}
          <h1 className="text-white text-4xl md:text-6xl lg:text-6xl font-bold mb-8 leading-tight">
            {t('hero.title')}
          </h1>

          {/* Subtitle - Hidden on mobile */}
          <p className="hidden sm:block text-white/90 text-xl md:text-2xl mb-12 max-w-3xl font-light">
            {t('hero.subtitle')}
          </p>

          {/* Search Card - Peerspace style with 3 inputs */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl"
          >
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
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className={cn(
                          'w-full text-left text-base border-none outline-none focus:ring-0 bg-transparent p-0 truncate',
                          location ? 'text-gray-900' : 'text-gray-400'
                        )}
                      >
                        {location || t('hero.locationPlaceholder')}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder={t('hero.locationPlaceholder')}
                          value={inputValue}
                          onValueChange={setInputValue}
                        />
                        <CommandList>
                          <CommandEmpty>No se encontraron lugares.</CommandEmpty>
                          {!inputValue && (
                            <CommandGroup heading="Ciudades Populares">
                              {popularCities.map((city) => (
                                <CommandItem
                                  key={city.placeName}
                                  value={city.placeName}
                                  onSelect={(currentValue) => {
                                    setLocation(currentValue);
                                    setOpenCombobox(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      location === city.placeName ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  {city.placeName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                          {inputValue && places.length > 0 && (
                            <CommandGroup heading="Resultados">
                              {places.map((place) => (
                                <CommandItem
                                  key={place.placeName}
                                  value={place.placeName}
                                  onSelect={(currentValue) => {
                                    setLocation(currentValue);
                                    setOpenCombobox(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      location === place.placeName ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  {place.placeName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            'w-full text-left text-base border-none outline-none focus:ring-0 bg-transparent p-0',
                            date ? 'text-gray-900' : 'text-gray-400'
                          )}
                        >
                          {date
                            ? format(date, 'd MMM yyyy', {
                                locale: language === 'es' ? es : enUS,
                              })
                            : t('hero.datePlaceholder')}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <button
                  type="submit"
                  className="h-12 bg-primary hover:bg-[#3B82F6] text-white px-8 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                >
                  {t('hero.search')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
