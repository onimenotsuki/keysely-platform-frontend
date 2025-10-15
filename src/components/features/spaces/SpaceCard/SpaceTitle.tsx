import { Star } from 'lucide-react';

interface SpaceTitleProps {
  title: string;
  rating: number;
  totalReviews: number;
}

export const SpaceTitle = ({ title, rating, totalReviews }: SpaceTitleProps) => {
  return (
    <div className="flex items-start justify-between mb-2">
      <h3 className="font-semibold text-lg truncate flex-1 mr-2">{title}</h3>
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating}</span>
        <span className="text-xs text-muted-foreground">({totalReviews})</span>
      </div>
    </div>
  );
};
