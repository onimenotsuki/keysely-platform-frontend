import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { formatCurrency } from '@/utils/formatCurrency';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { data: bookings, isLoading } = useBookings();
  const defaultCurrency = bookings?.[0]?.currency ?? 'MXN';
  const totalSpent =
    bookings?.reduce((total, booking) => total + Number(booking.total_amount), 0) ?? 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-primary text-primary-foreground';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredBookings =
    bookings?.filter(
      (booking) =>
        booking.spaces?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.spaces?.city.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const upcomingBookings = filteredBookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  );
  const pastBookings = filteredBookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your bookings</h1>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="w-64 h-8 mb-4 mx-auto" />
            <Skeleton className="w-96 h-4 mb-8 mx-auto" />
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        <Skeleton className="w-48 h-24" />
                        <div className="flex-1">
                          <Skeleton className="w-64 h-6 mb-2" />
                          <Skeleton className="w-32 h-4 mb-4" />
                          <div className="grid grid-cols-4 gap-4">
                            {Array(4)
                              .fill(0)
                              .map((_, j) => (
                                <Skeleton key={j} className="w-20 h-4" />
                              ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">My Bookings</h1>
            <p className="text-xl text-muted-foreground">Manage your workspace reservations</p>
          </div>

          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
                  <Input
                    placeholder="Search bookings by space or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <i className="fas fa-filter mr-2"></i>
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
            </TabsList>

            {/* Upcoming Bookings */}
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <i className="fas fa-calendar-alt text-4xl text-muted-foreground mb-4"></i>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No upcoming bookings
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start exploring workspaces to make your first booking
                    </p>
                    <Button className="btn-primary">Explore Workspaces</Button>
                  </CardContent>
                </Card>
              ) : (
                upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
                        {/* Space Image */}
                        <div className="lg:w-48 flex-shrink-0">
                          <div className="w-full h-32 lg:h-24 overflow-hidden rounded-lg">
                            <img
                              src={booking.spaces?.images?.[0] || '/placeholder.svg'}
                              alt={booking.spaces?.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground mb-1">
                                {booking.spaces?.title}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                <i className="fas fa-map-marker-alt mr-1"></i>
                                {booking.spaces?.address}, {booking.spaces?.city}
                              </p>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-medium text-foreground">{booking.start_date}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Time</p>
                              <p className="font-medium text-foreground">
                                {booking.start_time} - {booking.end_time}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Guests</p>
                              <p className="font-medium text-foreground">
                                {booking.guests_count} people
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total</p>
                              <p className="font-semibold text-foreground">
                                {formatCurrency(booking.total_amount, booking.currency)}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/space/${booking.space_id}`}>
                                <i className="fas fa-eye mr-2"></i>
                                View Space
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm">
                              <i className="fas fa-envelope mr-2"></i>
                              Contact Host
                            </Button>
                            {booking.status === 'confirmed' && (
                              <>
                                <Button variant="outline" size="sm">
                                  <i className="fas fa-edit mr-2"></i>
                                  Modify
                                </Button>
                                <Button variant="destructive" size="sm">
                                  <i className="fas fa-times mr-2"></i>
                                  Cancel
                                </Button>
                              </>
                            )}
                            {booking.status === 'pending' && (
                              <Button variant="destructive" size="sm">
                                <i className="fas fa-times mr-2"></i>
                                Cancel Request
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Past Bookings */}
            <TabsContent value="past" className="space-y-4">
              {pastBookings.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <i className="fas fa-history text-4xl text-muted-foreground mb-4"></i>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No past bookings</h3>
                    <p className="text-muted-foreground">Your booking history will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                pastBookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
                        {/* Space Image */}
                        <div className="lg:w-48 flex-shrink-0">
                          <div className="w-full h-32 lg:h-24 overflow-hidden rounded-lg">
                            <img
                              src={booking.spaces?.images?.[0] || '/placeholder.svg'}
                              alt={booking.spaces?.title}
                              className="w-full h-full object-cover opacity-75"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground mb-1">
                                {booking.spaces?.title}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                <i className="fas fa-map-marker-alt mr-1"></i>
                                {booking.spaces?.address}, {booking.spaces?.city}
                              </p>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-medium text-foreground">{booking.start_date}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Time</p>
                              <p className="font-medium text-foreground">
                                {booking.start_time} - {booking.end_time}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Guests</p>
                              <p className="font-medium text-foreground">
                                {booking.guests_count} people
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total</p>
                              <p className="font-semibold text-foreground">
                                {formatCurrency(booking.total_amount, booking.currency)}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/space/${booking.space_id}`}>
                                <i className="fas fa-eye mr-2"></i>
                                View Space
                              </Link>
                            </Button>
                            {booking.status === 'completed' && (
                              <>
                                <Button variant="outline" size="sm">
                                  <i className="fas fa-star mr-2"></i>
                                  Leave Review
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/space/${booking.space_id}`}>
                                    <i className="fas fa-redo mr-2"></i>
                                    Book Again
                                  </Link>
                                </Button>
                              </>
                            )}
                            <Button variant="outline" size="sm">
                              <i className="fas fa-headset mr-2"></i>
                              Get Help
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <i className="fas fa-calendar-check text-2xl text-primary mb-2"></i>
                  <div>Total Bookings</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-foreground">{bookings?.length || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <i className="fas fa-coins text-2xl text-success mb-2"></i>
                  <div>Total Spent</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-foreground">
                  {formatCurrency(totalSpent, defaultCurrency)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <i className="fas fa-star text-2xl text-yellow-500 mb-2"></i>
                  <div>Average Rating</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-foreground">4.7</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Bookings;
