import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Edit, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { Review } from '@/hooks/useReviews';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReviewCardProps {
  review: Review;
  showSpaceName?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

const ReviewCard = ({ review, showSpaceName = false, onEdit, onDelete }: ReviewCardProps) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isOwner = user?.id === review.user_id;
  const maxCommentLength = 150;
  const shouldTruncate = review.comment && review.comment.length > maxCommentLength;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800 border-green-200';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const displayComment = shouldTruncate && !isExpanded 
    ? `${review.comment?.substring(0, maxCommentLength)}...`
    : review.comment;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={review.profiles?.avatar_url} 
                alt={review.profiles?.full_name || 'Usuario'} 
              />
              <AvatarFallback>
                {(review.profiles?.full_name || 'U')[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-sm">
                  {review.profiles?.full_name || 'Usuario Anónimo'}
                </p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getRatingColor(review.rating)}`}
                >
                  {review.rating}.0
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex space-x-0.5">
                  {renderStars(review.rating)}
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(review.created_at), 'dd MMM yyyy', { locale: es })}
                </span>
              </div>
            </div>
          </div>

          {isOwner && (onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(review)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(review.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {review.comment && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {displayComment}
            </p>
            
            {shouldTruncate && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-xs mt-1"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Ver menos' : 'Ver más'}
              </Button>
            )}
          </div>
        )}

        {showSpaceName && review.spaces && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Reseña para: <span className="font-medium">{review.spaces.title}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;