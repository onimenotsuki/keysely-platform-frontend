import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { autocompletePlaces, GeocodeResult } from '@/utils/mapboxGeocoding';
import { Check, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover';
import { SearchFilters } from './types';

interface LocationInputProps {
  value: string;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const LocationInput = ({ value, onFiltersChange, filters }: LocationInputProps) => {
  const { t } = useTranslation();
  const [openCombobox, setOpenCombobox] = useState(false);
  const [places, setPlaces] = useState<GeocodeResult[]>([]);
  // We use the value prop directly as the input value since it's controlled by the parent
  // However, value might be empty initially.
  // When typing, we update the parent state.

  // Popular cities in Mexico
  const popularCities = useMemo(
    () =>
      [
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
      ] as GeocodeResult[],
    []
  );

  // Handle autocomplete search
  useEffect(() => {
    if (!value || value.length < 3) {
      setPlaces([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await autocompletePlaces(value);
      setPlaces(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (currentValue: string) => {
    // Find the selected place from 'places' or 'popularCities'
    const selectedPlace =
      places.find((p) => p.placeName === currentValue) ||
      popularCities.find((p) => p.placeName === currentValue);

    if (selectedPlace?.bbox) {
      const [minLng, minLat, maxLng, maxLat] = selectedPlace.bbox;
      onFiltersChange({
        ...filters,
        city: currentValue, // Keep full name for display
        mapBounds: {
          ne: { lat: maxLat, lng: maxLng },
          sw: { lat: minLat, lng: minLng },
          insideBoundingBox: [maxLat, maxLng, minLat, minLng],
        },
      });
    } else {
      // Extract city name from location (e.g. "Guadalajara, Jalisco, México" -> "Guadalajara")
      const cityName = currentValue.split(',')[0].trim();
      onFiltersChange({ ...filters, city: cityName });
    }
    setOpenCombobox(false);
  };

  return (
    <div className="lg:w-56 group">
      <div className="px-8 py-5 cursor-pointer hover:bg-gray-50 transition-colors h-[86px]">
        <label className="block text-xs font-semibold text-gray-900 mb-1.5">
          {t('explore.searchBar.location')}
        </label>
        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
          <PopoverTrigger asChild>
            <input
              type="text"
              role="combobox"
              aria-expanded={openCombobox}
              placeholder={t('explore.searchBar.whereToGo')}
              value={value}
              onChange={(e) => {
                onFiltersChange({ ...filters, city: e.target.value });
                setOpenCombobox(true);
              }}
              className="w-full bg-transparent border-0 outline-none text-sm text-gray-700 placeholder:text-gray-400 focus:text-gray-900 p-0 truncate"
            />
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] p-0"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Command shouldFilter={false}>
              <CommandList>
                <CommandEmpty>No se encontraron lugares.</CommandEmpty>
                {!value && (
                  <CommandGroup heading="Ciudades Populares">
                    {popularCities.map((city) => (
                      <CommandItem
                        key={city.placeName}
                        value={city.placeName}
                        onSelect={handleSelect}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === city.placeName.split(',')[0].trim()
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {city.placeName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {value && places.length > 0 && (
                  <CommandGroup heading="Resultados">
                    {places.map((place) => (
                      <CommandItem
                        key={place.placeName}
                        value={place.placeName}
                        onSelect={handleSelect}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === place.placeName.split(',')[0].trim()
                              ? 'opacity-100'
                              : 'opacity-0'
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
  );
};
