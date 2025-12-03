const DEFAULT_LOCALE = 'es-MX';
const DEFAULT_CURRENCY = 'MXN';

export const formatCurrency = (
  value: number,
  currency: string = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
};
