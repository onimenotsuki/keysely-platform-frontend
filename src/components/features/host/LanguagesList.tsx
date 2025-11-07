import { Badge } from '@/components/ui/badge';
import { Languages } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface LanguagesListProps {
  languages?: string[];
  showIcon?: boolean;
}

export const LanguagesList = ({ languages = [], showIcon = true }: LanguagesListProps) => {
  const { t } = useTranslation();

  if (!languages || languages.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        {showIcon && <Languages className="h-5 w-5" />}
        <span className="text-sm">{t('hostProfile.noLanguages')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-foreground">
        {showIcon && <Languages className="h-5 w-5" />}
        <h4 className="font-semibold">{t('hostProfile.languages')}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {languages.map((language) => (
          <Badge key={language} variant="secondary" className="px-3 py-1">
            {language}
          </Badge>
        ))}
      </div>
    </div>
  );
};
