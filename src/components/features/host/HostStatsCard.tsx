import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface HostStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
}

export const HostStatsCard = ({ icon: Icon, label, value, description }: HostStatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
            <div className="text-sm font-medium text-foreground mb-1">{label}</div>
            {description && <div className="text-xs text-muted-foreground">{description}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
