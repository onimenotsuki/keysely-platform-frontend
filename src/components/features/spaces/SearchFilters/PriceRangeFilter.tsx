import { useTranslation } from '@/hooks/useTranslation';
import { Label } from '../../../ui/label';
import { Slider } from '../../../ui/slider';
import { SearchFilters } from './types';

const DEFAULT_MAX_PRICE = 1000;

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onFiltersChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export const PriceRangeFilter = ({
  minPrice,
  maxPrice,
  onFiltersChange,
  filters,
}: PriceRangeFilterProps) => {
  const { t } = useTranslation();

  const normalizedMinPrice = Number.isFinite(minPrice) ? minPrice : 0;
  const normalizedMaxPrice = Number.isFinite(maxPrice) ? maxPrice : DEFAULT_MAX_PRICE;

  // Calculate percentage positions for badges
  const minPercentage = (normalizedMinPrice / DEFAULT_MAX_PRICE) * 100;
  const maxPercentage = (normalizedMaxPrice / DEFAULT_MAX_PRICE) * 100;

  const handleSliderChange = (values: number[]) => {
    const [newMin, newMax] = values;
    onFiltersChange({
      ...filters,
      minPrice: newMin,
      maxPrice: newMax,
    });
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">{t('explore.searchBar.priceLabel')}</Label>

      {/* Dual-handle slider with badges */}
      <div className="relative px-2 pb-8">
        <Slider
          value={[normalizedMinPrice, normalizedMaxPrice]}
          onValueChange={handleSliderChange}
          min={0}
          max={DEFAULT_MAX_PRICE}
          step={10}
          className="w-full"
        />
        {/* Min price badge */}
        <div
          className="absolute top-7 pointer-events-none z-10"
          style={{
            left: `${minPercentage}%`,
            transform: `translateX(-50%) ${maxPercentage - minPercentage < 8 ? 'translateY(-100%)' : ''}`,
          }}
        >
          <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-md shadow-md whitespace-nowrap">
            ${normalizedMinPrice}
          </div>
        </div>
        {/* Max price badge */}
        <div
          className="absolute top-7 pointer-events-none z-10"
          style={{
            left: `${maxPercentage}%`,
            transform: `translateX(-50%) ${maxPercentage - minPercentage < 8 ? 'translateY(-100%)' : ''}`,
          }}
        >
          <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-md shadow-md whitespace-nowrap">
            ${normalizedMaxPrice}
          </div>
        </div>
      </div>
    </div>
  );
};
