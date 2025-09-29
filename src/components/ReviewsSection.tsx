import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MessageSquare, Plus, Filter } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: reviews = [], isLoading } = useSpaceReviews(spaceId);
  const { data: canReviewData } = useCanUserReview(spaceId, bookingId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  const filteredReviews = activeTab === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(activeTab));

  return (
    <div className="space-y-6">
      {/* Reviews Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Reviews y Calificaciones</span>
            </CardTitle>
            
            {user && canReviewData?.canReview && !showReviewForm && (
              <Button onClick={() => setShowReviewForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Escribir Review
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Rating Summary */}
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <span className="text-4xl font-bold">{averageRating}</span>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(parseFloat(averageRating))
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Basado en {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center space-x-3 text-sm">
                    <span className="w-8 text-right">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">Sin reviews aún</h3>
              <p className="text-muted-foreground">
                Sé el primero en compartir tu experiencia con este espacio.
              </p>
            </div>
          )}

          {/* User Review Status */}
          {user && (
            <div className="border-t pt-4">
              {canReviewData?.hasReviewed && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <Star className="h-4 w-4 fill-green-600" />
                  <span>Ya has enviado una review para este espacio</span>
                </div>
              )}
              {!canReviewData?.canReview && !canReviewData?.hasReviewed && (
                <p className="text-sm text-muted-foreground">
                  Completa una reserva para poder escribir una review
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          spaceId={spaceId}
          bookingId={bookingId}
          onSuccess={() => setShowReviewForm(false)}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Todas las Reviews</h3>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all" className="text-xs">
                  Todas
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {reviews.length}
                  </Badge>
                </TabsTrigger>
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = reviews.filter(review => review.rating === rating).length;
                  return (
                    <TabsTrigger key={rating} value={rating.toString()} className="text-xs">
                      {rating}★
                      {count > 0 && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {count}
                        </Badge>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredReviews.length > 0 ? (
                  <div className="space-y-4">
                    {filteredReviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No hay reviews con {activeTab === 'all' ? 'ninguna' : `${activeTab} estrella${activeTab !== '1' ? 's' : ''}`} calificación
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewsSection;