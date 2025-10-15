import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useBookings } from '@/hooks/useBookings';
import { useFavorites } from '@/hooks/useFavorites';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { Star } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const favoritesQuery = useFavorites();
  const favorites = favoritesQuery.data || [];
  const favoritesLoading = favoritesQuery.isLoading;
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    bio: '',
    company: '',
  });

  React.useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        company: profile.company || '',
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync(profileData);
      setIsEditing(false);
      toast({ title: 'Profile updated successfully!' });
    } catch (error) {
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex items-center space-x-6">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-64 h-8 mb-2" />
                    <Skeleton className="w-32 h-4 mb-2" />
                    <Skeleton className="w-96 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
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
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user.email} />
                  <AvatarFallback>
                    {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">
                      {profile?.full_name || user.email}
                    </h1>
                    <Badge className="bg-success text-success-foreground">
                      <i className="fas fa-check-circle mr-1"></i>
                      Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    Member since{' '}
                    {new Date(profile?.created_at || '').toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-foreground">{profile?.bio || 'No bio available'}</p>
                </div>

                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  <i className="fas fa-edit mr-2"></i>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="spaces">My Spaces</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="space-y-4">
                      {Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="w-full h-24" />
                        ))}
                    </div>
                  ) : bookings && bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.slice(0, 3).map((booking) => (
                        <div
                          key={booking.id}
                          className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">
                                {booking.spaces?.title || 'Space'}
                              </h3>
                              <p className="text-muted-foreground text-sm mb-2">
                                <i className="fas fa-map-marker-alt mr-1"></i>
                                {booking.spaces?.address}, {booking.spaces?.city}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>
                                  <i className="fas fa-calendar mr-1"></i>
                                  {booking.start_date}
                                </span>
                                <span>
                                  <i className="fas fa-clock mr-1"></i>
                                  {booking.start_time} - {booking.end_time}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={
                                  booking.status === 'confirmed'
                                    ? 'bg-primary text-primary-foreground'
                                    : booking.status === 'completed'
                                      ? 'bg-success text-success-foreground'
                                      : 'bg-yellow-500 text-white'
                                }
                              >
                                {booking.status}
                              </Badge>
                              <p className="font-semibold text-foreground mt-2">
                                €{booking.total_amount}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No bookings yet</p>
                      <Button asChild className="mt-4">
                        <Link to="/explore">Explore Spaces</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Workspaces</CardTitle>
                </CardHeader>
                <CardContent>
                  {favoritesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="w-full h-64" />
                        ))}
                    </div>
                  ) : favorites && favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.map((favorite) => (
                        <div
                          key={favorite.id}
                          className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <Link to={`/space/${favorite.spaces?.id}`}>
                            <img
                              src={favorite.spaces?.images?.[0] || '/src/assets/private-office.jpg'}
                              alt={favorite.spaces?.title}
                              className="w-full h-40 object-cover hover:opacity-90 transition-opacity"
                            />
                          </Link>
                          <div className="p-4">
                            <Link to={`/space/${favorite.spaces?.id}`}>
                              <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                                {favorite.spaces?.title}
                              </h3>
                            </Link>
                            <p className="text-muted-foreground text-sm mb-2">
                              <i className="fas fa-map-marker-alt mr-1"></i>
                              {favorite.spaces?.city}
                            </p>
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-semibold">
                                €{favorite.spaces?.price_per_hour}/hour
                              </span>
                              <div className="flex items-center space-x-1 text-yellow-500 text-sm">
                                <i className="fas fa-star"></i>
                                <span>{favorite.spaces?.rating}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button asChild className="flex-1">
                                <Link to={`/space/${favorite.spaces?.id}`}>Ver Detalles</Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Here we could add remove from favorites functionality
                                }}
                              >
                                <i className="fas fa-heart text-red-500"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No saved workspaces yet</p>
                      <Button asChild className="mt-4">
                        <Link to="/explore">Explore Spaces</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Spaces Tab */}
            <TabsContent value="spaces" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('common.manageSpaces')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <i className="fas fa-building text-4xl text-muted-foreground mb-4"></i>
                    <h3 className="text-lg font-medium mb-2">{t('common.spaceManagement')}</h3>
                    <p className="text-muted-foreground mb-6">{t('common.spaceManagementDesc')}</p>
                    <div className="flex justify-center space-x-4">
                      <Link to="/owner-dashboard">
                        <Button>
                          <i className="fas fa-chart-line mr-2"></i>
                          {t('common.goToDashboard')}
                        </Button>
                      </Link>
                      <Link to="/list-space">
                        <Button variant="outline">
                          <i className="fas fa-plus mr-2"></i>
                          {t('header.listSpace')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Gestiona tus Reviews</h3>
                    <p className="text-muted-foreground mb-2">
                      Ve todas las reviews que has escrito y edita las que necesites.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      ¡Reserva un espacio y deja tu primera review!
                    </p>
                    <Link to="/my-reviews">
                      <Button>
                        <Star className="h-4 w-4 mr-2" />
                        Ver Mis Reviews
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileData.full_name}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, full_name: e.target.value }))
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user.email} disabled />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, company: e.target.value }))
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2">
                      <Button
                        className="btn-primary"
                        onClick={handleSaveProfile}
                        disabled={updateProfile.isPending}
                      >
                        {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
