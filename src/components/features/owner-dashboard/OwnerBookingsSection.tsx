import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useOwnerBookings } from '@/hooks/useOwnerData';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils/formatCurrency';
import { format } from 'date-fns';

interface OwnerBookingsSectionProps {
  title?: string;
  limit?: number;
}

export const OwnerBookingsSection = ({ title, limit }: OwnerBookingsSectionProps) => {
  const { t } = useTranslation();
  const { data: ownerBookings = [], isLoading } = useOwnerBookings();

  const bookingsToDisplay = limit ? ownerBookings.slice(0, limit) : ownerBookings;

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return t('ownerDashboard.confirmed');
      case 'pending':
        return t('ownerDashboard.pending');
      case 'completed':
        return t('ownerDashboard.completed');
      case 'active':
        return t('ownerDashboard.active');
      case 'inactive':
        return t('ownerDashboard.inactive');
      default:
        return status;
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'active':
        return 'bg-primary text-primary-foreground';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || t('ownerDashboard.recentBookings')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : bookingsToDisplay.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-calendar-times text-4xl text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t('ownerDashboard.noBookings')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookingsToDisplay.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={booking.profiles?.avatar_url}
                      alt={booking.profiles?.full_name}
                    />
                    <AvatarFallback>{booking.profiles?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {booking.profiles?.full_name || t('ownerDashboard.unknownGuest')}
                    </p>
                    <p className="text-sm text-muted-foreground">{booking.spaces?.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.start_date), 'MMM dd, yyyy')} • {booking.start_time}{' '}
                      - {booking.end_time} • {booking.guests_count} {t('ownerDashboard.guests')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {formatCurrency(booking.total_amount, booking.currency)}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`capitalize ${getStatusClasses(booking.status)}`}
                  >
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OwnerBookingsSection;
