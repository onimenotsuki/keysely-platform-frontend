import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Plus } from 'lucide-react';
import { useSpaceReviews, useCanUserReview } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

interface ReviewsSectionProps {
  spaceId: string;
  bookingId?: string;
}

const ReviewsSection = ({ spaceId, bookingId }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { data: reviews = [], isLoading } = useSpaceReviews(spaceId);
  const { data: canReviewData } = useCanUserReview(spaceId, bookingId || '');

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-2 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show first 6 reviews by default, or all if showAllReviews is true
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 6);

  // Split reviews into two columns
  const leftColumnReviews = displayedReviews.filter((_, index) => index % 2 === 0);
  const rightColumnReviews = displayedReviews.filter((_, index) => index % 2 === 1);

  const getLocationString = (review: (typeof reviews)[0]) => {
    const address = review.profiles?.address;
    if (address && typeof address === 'object' && !Array.isArray(address) && address !== null) {
      const addr = address as Record<string, unknown>;
      const city = typeof addr.city === 'string' ? addr.city : undefined;
      const country = typeof addr.country === 'string' ? addr.country : 'México';
      if (city) {
        return `${city}, ${country}`;
      }
    }
    return 'México';
  };

  return (
    <div className="space-y-8">
      {/* Review Form */}
      {showReviewForm && bookingId && (
        <ReviewForm
          spaceId={spaceId}
          bookingId={bookingId}
          onSuccess={() => setShowReviewForm(false)}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews Grid - 2 Columns */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-x-16">
          {/* Left Column */}
          <div className="space-y-10">
            {leftColumnReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                location={getLocationString(review)}
                compact={true}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-10">
            {rightColumnReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                location={getLocationString(review)}
                compact={true}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">Sin reviews aún</h3>
          <p className="text-muted-foreground">
            Sé el primero en compartir tu experiencia con este espacio.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {reviews.length > 6 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          {!showAllReviews && (
            <Button
              variant="outline"
              onClick={() => setShowAllReviews(true)}
              className="px-6 py-3 text-base font-normal bg-white border border-gray-300 hover:bg-gray-50 rounded-md shadow-sm"
            >
              Mostrar las {reviews.length} evaluaciones
            </Button>
          )}
          <button
            type="button"
            onClick={() => {
              // TODO: Show modal or navigate to help page about how reviews work
              console.log('Cómo funcionan las evaluaciones');
            }}
            className="text-sm text-foreground underline hover:no-underline cursor-pointer font-normal"
          >
            Cómo funcionan las evaluaciones
          </button>
        </div>
      )}

      {/* User Review Status */}
      {user && bookingId && (
        <div className="pt-6 border-t">
          {canReviewData?.hasReviewed ? (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Star className="h-4 w-4 fill-green-600" />
              <span>Ya has enviado una review para esta reserva</span>
            </div>
          ) : canReviewData?.canReview && !showReviewForm ? (
            <Button onClick={() => setShowReviewForm(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Escribir Review
            </Button>
          ) : canReviewData?.reason ? (
            <p className="text-sm text-orange-600">{canReviewData.reason}</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
