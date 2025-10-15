import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Review, useUpdateReview, useUserReviews } from '@/hooks/useReviews';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit, Eye, MessageSquare, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

const MyReviews = () => {
  const { user } = useAuth();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const { data: reviews = [], isLoading } = useUserReviews();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso denegado</h1>
          <p className="text-muted-foreground mb-4">Debes iniciar sesión para ver tus reviews.</p>
          <Link to="/auth">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleUpdateSuccess = () => {
    setEditingReview(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mis Reviews</h1>
            <p className="text-muted-foreground">
              Gestiona y visualiza todas las reviews que has escrito.
            </p>
          </div>

          {/* Stats Overview */}
          {reviews.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Resumen de tus Reviews</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Reviews */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{reviews.length}</div>
                    <p className="text-sm text-muted-foreground">Total de Reviews</p>
                  </div>

                  {/* Average Rating */}
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-3xl font-bold">{averageRating}</span>
                      <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">Calificación Promedio</p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-1">
                    {ratingCounts.map(({ rating, count }) => (
                      <div key={rating} className="flex items-center space-x-2 text-sm">
                        <span className="w-3">{rating}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 transition-all duration-300"
                            style={{
                              width:
                                reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%',
                            }}
                          />
                        </div>
                        <span className="w-6 text-muted-foreground">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Review Form */}
          {editingReview && (
            <div className="mb-8">
              <ReviewForm
                spaceId={editingReview.space_id}
                existingReview={editingReview}
                onSuccess={handleUpdateSuccess}
                onCancel={handleCancelEdit}
              />
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Tus Reviews ({reviews.length})</h2>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="relative">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          {/* Space Info */}
                          {review.spaces && (
                            <div className="mb-3">
                              <Link
                                to={`/space/${review.space_id}`}
                                className="text-lg font-medium hover:text-primary transition-colors"
                              >
                                {review.spaces.title}
                              </Link>
                            </div>
                          )}

                          {/* Rating and Date */}
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge variant="outline">{review.rating}.0</Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(review.created_at), 'dd MMM yyyy', { locale: es })}
                            </span>
                          </div>

                          {/* Comment */}
                          {review.comment && (
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              {review.comment}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditReview(review)}
                            disabled={!!editingReview}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/space/${review.space_id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aún no has escrito ninguna review</h3>
                <p className="text-muted-foreground mb-6">
                  Después de completar una reserva, podrás escribir una review sobre tu experiencia.
                </p>
                <Button asChild>
                  <Link to="/explore">Explorar Espacios</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyReviews;
