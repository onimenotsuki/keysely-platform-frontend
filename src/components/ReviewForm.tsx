import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Send } from 'lucide-react';
import { useCreateReview, useUpdateReview, CreateReviewData, Review } from '@/hooks/useReviews';
import { toast } from 'sonner';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Debes seleccionar una calificación').max(5),
  comment: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  spaceId: string;
  bookingId?: string;
  existingReview?: Review;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ReviewForm = ({
  spaceId,
  bookingId,
  existingReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(existingReview?.rating || 0);

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || '',
    },
  });

  const watchedComment = watch('comment');
  const isEditing = !!existingReview;

  useEffect(() => {
    setValue('rating', selectedRating);
  }, [selectedRating, setValue]);

  const onSubmit = async (data: ReviewFormData) => {
    try {
      if (isEditing && existingReview) {
        await updateReview.mutateAsync({
          reviewId: existingReview.id,
          updates: {
            rating: data.rating,
            comment: data.comment,
          },
        });
      } else {
        const reviewData: CreateReviewData = {
          space_id: spaceId,
          rating: data.rating,
          comment: data.comment,
        };

        if (bookingId) {
          reviewData.booking_id = bookingId;
        }

        await createReview.mutateAsync(reviewData);
      }

      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hooks
      console.error('Error submitting review:', error);
    }
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= (hoveredRating || selectedRating);

      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none transition-all duration-150 hover:scale-110"
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => handleStarClick(starValue)}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              isActive ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
          />
        </button>
      );
    });
  };

  const getRatingText = (rating: number) => {
    const ratingTexts = {
      1: 'Muy malo',
      2: 'Malo',
      3: 'Regular',
      4: 'Bueno',
      5: 'Excelente',
    };
    return ratingTexts[rating as keyof typeof ratingTexts] || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-400" />
          <span>{isEditing ? 'Editar Review' : 'Escribir Review'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating Stars */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Calificación *</Label>
            <div className="flex items-center space-x-1">{renderStars()}</div>
            {selectedRating > 0 && (
              <p className="text-sm text-muted-foreground">{getRatingText(selectedRating)}</p>
            )}
            {errors.rating && <p className="text-sm text-red-600">{errors.rating.message}</p>}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium text-gray-700">
              Comentario (opcional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Comparte tu experiencia con este espacio..."
              className="min-h-32 px-4 resize-none"
              maxLength={500}
              {...register('comment')}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Máximo 500 caracteres</p>
              <p className="text-xs text-muted-foreground">{watchedComment?.length || 0}/500</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button
              type="submit"
              disabled={selectedRating === 0 || createReview.isPending || updateReview.isPending}
              className="flex-1 h-12 bg-primary hover:bg-[#3B82F6] text-white shadow-md hover:shadow-lg transition-all"
            >
              {(createReview.isPending || updateReview.isPending) && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              )}
              <Send className="h-4 w-4 mr-2" />
              {isEditing ? 'Actualizar Review' : 'Enviar Review'}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={createReview.isPending || updateReview.isPending}
                className="h-12"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
