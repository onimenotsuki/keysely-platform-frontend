import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Review } from '@/hooks/useReviews';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReviewCardProps {
  review: Review;
  location?: string;
  compact?: boolean;
  showSpaceName?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

const ReviewCard = ({
  review,
  location = 'México',
  compact = false,
  showSpaceName = false,
  onEdit,
  onDelete,
}: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const maxCommentLength = 200;
  const shouldTruncate = review.comment && review.comment.length > maxCommentLength;

  const displayComment =
    shouldTruncate && !isExpanded
      ? `${review.comment?.substring(0, maxCommentLength)}...`
      : review.comment;

  // Get stay duration from booking
  const getStayDuration = () => {
    const booking = review.bookings;
    if (!booking) return null;

    if (booking.start_date && booking.end_date) {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      const days = differenceInDays(endDate, startDate) + 1;

      if (days === 1) {
        return 'Estancia de una noche';
      } else {
        return 'Estancia de varias noches';
      }
    }
    // Fallback: use total_hours to estimate
    if (booking.total_hours) {
      const hours = booking.total_hours;
      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        if (days === 1) {
          return 'Estancia de una noche';
        }
        return 'Estancia de varias noches';
      }
      // For hourly bookings, show as hours
      if (hours === 1) {
        return 'Estancia de 1 hora';
      }
      return `Estancia de ${hours} horas`;
    }
    return null;
  };

  // Get booking date in format "mes de año" (e.g., "agosto de 2025")
  // Use booking start_date if available, otherwise use review created_at
  const getReviewDate = () => {
    const booking = review.bookings;
    if (booking?.start_date) {
      const date = new Date(booking.start_date);
      return format(date, "MMMM 'de' yyyy", { locale: es });
    }
    // Fallback to review created_at
    const date = new Date(review.created_at);
    return format(date, "MMMM 'de' yyyy", { locale: es });
  };

  const stayDuration = getStayDuration();
  const reviewDate = getReviewDate();

  return (
    <div>
      {/* User Info */}
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <Avatar className="h-12 w-12 flex-shrink-0 border border-gray-200">
          <AvatarImage
            src={review.profiles?.avatar_url || undefined}
            alt={review.profiles?.full_name || 'Usuario'}
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-100 text-gray-700 text-base font-medium">
            {(review.profiles?.full_name || 'U')[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* User Details */}
        <div className="flex-1 min-w-0">
          {/* Name and Location - Same line */}
          <div className="mb-2">
            <span className="font-medium text-base text-foreground">
              {review.profiles?.full_name || 'Usuario Anónimo'}
            </span>
            <span className="text-sm text-muted-foreground ml-1">, {location}</span>
          </div>

          {/* Rating Stars - Solid Black */}
          <div className="flex items-center space-x-0.5 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < review.rating ? 'text-black fill-black' : 'text-gray-300 fill-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Stay Details */}
          <div className="text-sm text-muted-foreground mb-3">
            {reviewDate}
            {stayDuration ? ` · ${stayDuration}` : ''}
          </div>

          {/* Comment */}
          {review.comment && (
            <div className="mt-1">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {displayComment}
              </p>
              {shouldTruncate && (
                <button
                  type="button"
                  className="text-sm text-foreground underline mt-1.5 hover:no-underline cursor-pointer font-normal"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Mostrar menos' : 'Mostrar más'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Space Name (if needed) */}
      {showSpaceName && review.spaces && (
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Reseña para: <span className="font-medium">{review.spaces.title}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
