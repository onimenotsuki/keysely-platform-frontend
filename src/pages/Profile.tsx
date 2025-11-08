import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useBookings } from '@/hooks/useBookings';
import { useFavorites } from '@/hooks/useFavorites';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import { useProfile, useUpdateProfile, type AddressData } from '@/hooks/useProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { ExternalLink, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { createLocalizedPath } = useLanguageRouting();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const favoritesQuery = useFavorites();
  const favorites = favoritesQuery.data || [];
  const updateProfile = useUpdateProfile();

  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    bio: '',
    company: '',
    work_description: '',
    languages: [] as string[],
    address: {
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    } as AddressData,
  });

  const [newLanguage, setNewLanguage] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';

  const enterEditMode = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('edit', 'true');
      return params;
    });
  };

  const exitEditMode = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete('edit');
      return params;
    });
  };

  React.useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        company: profile.company || '',
        work_description: profile.work_description || '',
        languages: profile.languages || [],
        address: profile.address || {
          streetAddress: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync(profileData);
      exitEditMode();
      toast({ title: t('profile.profileUpdated') || 'Profile updated successfully!' });
    } catch (error: unknown) {
      console.error('Profile update error:', error);
      toast({
        title: t('profile.updateFailed') || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const yearsOnPlatform = () => {
    if (!profile?.created_at) return '< 1';
    const years = new Date().getFullYear() - new Date(profile.created_at).getFullYear();
    return years > 0 ? years : '< 1';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header forceScrolled={true} />
        <div className="container mx-auto px-4 py-16 text-center mt-12">
          <h1 className="text-2xl font-bold mb-4">{t('profile.pleaseSignIn')}</h1>
          <Link to="/auth">
            <Button className="bg-primary hover:bg-[#3B82F6]">{t('auth.signIn')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header forceScrolled={true} />
        <div className="container mx-auto px-4 py-16 mt-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                  <Skeleton className="w-32 h-6 mx-auto mb-2" />
                  <Skeleton className="w-24 h-4 mx-auto" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header forceScrolled={true} />

      <div className="container mx-auto px-4 py-12 mt-16">
        {!isEditing ? (
          // Vista principal del perfil (estilo Airbnb)
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Columna izquierda - Información del perfil */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-sm sticky top-24">
                  <CardContent className="p-8 text-center">
                    {/* Avatar y nombre */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                          <AvatarImage
                            src={profile?.avatar_url}
                            alt={profile?.full_name || user.email}
                          />
                          <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                            {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 bg-success rounded-full p-2 shadow-md">
                          <i className="fas fa-check text-white text-sm"></i>
                        </div>
                      </div>

                      <h1 className="text-3xl font-bold text-foreground mb-1">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {profile?.company || t('profile.member')}
                      </p>
                    </div>

                    <div className="border-t border-border border-b py-6 space-y-4 mb-6">
                      <div className="flex items-center space-x-3 text-left">
                        <i className="fas fa-calendar-check text-xl"></i>
                        <div className="flex-1">
                          <p className="text-2xl font-bold text-foreground">
                            {bookings?.length || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {bookings?.length === 1 ? t('profile.booking') : t('profile.bookings')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-left">
                        <i className="fas fa-star text-xl"></i>
                        <div className="flex-1">
                          <p className="text-2xl font-bold text-foreground">
                            {bookings?.filter((b) => b.status === 'completed').length || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {bookings?.filter((b) => b.status === 'completed').length === 1
                              ? t('profile.review')
                              : t('profile.reviews')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-left">
                        <i className="fas fa-clock text-xl"></i>
                        <div className="flex-1">
                          <p className="text-2xl font-bold text-foreground">{yearsOnPlatform()}</p>
                          <p className="text-sm text-muted-foreground">
                            {t('profile.yearsOnPlatform')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botón editar */}
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
                      onClick={enterEditMode}
                    >
                      <i className="fas fa-edit mr-2"></i>
                      {t('profile.editProfile')}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Columna derecha - Contenido principal */}
              <div className="lg:col-span-2 space-y-8">
                {/* Identidad verificada */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary rounded-full p-3">
                        <i className="fas fa-shield-alt text-white text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          {t('profile.verifiedIdentity')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t('profile.verifiedIdentityDesc')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Acerca de */}
                {profile?.bio && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      {t('profile.aboutMe')}
                    </h2>
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <p className="text-foreground leading-relaxed">{profile.bio}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Información adicional */}
                {(profile?.work_description ||
                  (profile?.languages && profile.languages.length > 0)) && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      {t('profile.additionalInfo')}
                    </h2>
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6 space-y-4">
                        {profile?.work_description && (
                          <div>
                            <p className="font-semibold text-sm text-muted-foreground mb-2">
                              {t('hostProfile.workDescription')}
                            </p>
                            <p className="text-foreground">{profile.work_description}</p>
                          </div>
                        )}

                        {profile?.languages && profile.languages.length > 0 && (
                          <div>
                            <p className="font-semibold text-sm text-muted-foreground mb-2">
                              {t('hostProfile.languages')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {profile.languages.map((lang, index) => (
                                <Badge
                                  key={`lang-${lang}-${index}`}
                                  variant="secondary"
                                  className="px-3 py-1"
                                >
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Mis Reservas */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-foreground">
                      {t('profile.myBookings')}
                    </h2>
                    {bookings && bookings.length > 3 && (
                      <Button variant="link" className="text-primary">
                        {t('common.seeAll')}
                      </Button>
                    )}
                  </div>

                  {bookingsLoading ? (
                    <div className="space-y-4">
                      {new Array(2).fill(0).map((_, i) => (
                        <Skeleton key={`booking-skeleton-${i}`} className="w-full h-32" />
                      ))}
                    </div>
                  ) : bookings && bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.slice(0, 3).map((booking) => (
                        <Card
                          key={booking.id}
                          className="border-0 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-semibold text-lg text-foreground">
                                    {booking.spaces?.title || 'Space'}
                                  </h3>
                                  <Badge
                                    className={
                                      booking.status === 'confirmed'
                                        ? 'bg-primary text-primary-foreground'
                                        : booking.status === 'completed'
                                          ? 'bg-success text-success-foreground'
                                          : 'bg-warning text-warning-foreground'
                                    }
                                  >
                                    {booking.status}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm mb-3">
                                  <i className="fas fa-map-marker-alt mr-2"></i>
                                  {booking.spaces?.address}, {booking.spaces?.city}
                                </p>
                                <div className="flex items-center flex-wrap gap-4 text-sm">
                                  <span className="text-muted-foreground">
                                    <i className="fas fa-calendar mr-2"></i>
                                    {booking.start_date}
                                  </span>
                                  <span className="text-muted-foreground">
                                    <i className="fas fa-clock mr-2"></i>
                                    {booking.start_time} - {booking.end_time}
                                  </span>
                                  <span className="font-semibold text-foreground ml-auto">
                                    €{booking.total_amount}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-12 text-center">
                        <i className="fas fa-calendar-alt text-4xl text-muted-foreground mb-4"></i>
                        <p className="text-muted-foreground mb-4">{t('profile.noBookings')}</p>
                        <Button asChild className="bg-primary hover:bg-[#3B82F6]">
                          <Link to="/explore">{t('common.exploreSpaces')}</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Espacios Favoritos */}
                {favorites && favorites.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-foreground">
                        {t('profile.favorites')}
                      </h2>
                      {favorites.length > 2 && (
                        <Button variant="link" className="text-primary">
                          {t('common.seeAll')}
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.slice(0, 2).map((favorite) => (
                        <Card
                          key={favorite.id}
                          className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <Link to={`/space/${favorite.spaces?.id}`}>
                            <div className="w-full h-48 overflow-hidden">
                              <img
                                src={favorite.spaces?.images?.[0] || '/placeholder.svg'}
                                alt={favorite.spaces?.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                            </div>
                          </Link>
                          <CardContent className="p-4">
                            <Link to={`/space/${favorite.spaces?.id}`}>
                              <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                                {favorite.spaces?.title}
                              </h3>
                            </Link>
                            <p className="text-muted-foreground text-sm mb-2">
                              <i className="fas fa-map-marker-alt mr-1"></i>
                              {favorite.spaces?.city}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-foreground">
                                €{favorite.spaces?.price_per_hour}/hr
                              </span>
                              <div className="flex items-center space-x-1 text-yellow-500 text-sm">
                                <i className="fas fa-star"></i>
                                <span>{favorite.spaces?.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Vista de edición de perfil renovada
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-6 mb-10">
              <Button variant="ghost" onClick={exitEditMode} className="w-fit gap-2 px-0">
                <i className="fas fa-arrow-left text-sm" />
                {t('common.back')}
              </Button>
              <h1 className="text-3xl font-bold text-foreground">{t('profile.editProfile')}</h1>
            </div>

            <div className="grid gap-10 lg:grid-cols-[340px_1fr]">
              <Card className="border-0 shadow-lg ring-1 ring-border/50">
                <CardContent className="p-8 space-y-8 text-center">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                      <Avatar className="w-40 h-40 border-4 border-background shadow-lg">
                        <AvatarImage
                          src={profile?.avatar_url}
                          alt={profile?.full_name || user.email || 'Avatar'}
                        />
                        <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                          {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-2 right-2 shadow-md"
                        type="button"
                      >
                        <i className="fas fa-camera mr-2" />
                        {t('common.edit') || 'Editar'}
                      </Button>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">
                        {profileData.full_name || user.email?.split('@')[0]}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {profileData.company || t('profile.member')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between rounded-lg bg-muted/60 p-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {t('profile.bookings')}
                        </p>
                        <p className="text-xl font-semibold text-foreground">
                          {bookings?.length || 0}
                        </p>
                      </div>
                      <i className="fas fa-calendar-check text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted/60 p-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {t('profile.yearsOnPlatform')}
                        </p>
                        <p className="text-xl font-semibold text-foreground">{yearsOnPlatform()}</p>
                      </div>
                      <i className="fas fa-clock text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className="border-0 shadow-md ring-1 ring-border/40">
                  <CardHeader>
                    <CardTitle>{t('profile.personalInfo')}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="fullName">{t('profile.fullName')}</Label>
                      <Input
                        id="fullName"
                        value={profileData.full_name}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, full_name: e.target.value }))
                        }
                        className="h-12 px-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('profile.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="h-12 px-4 bg-muted text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('profile.phone')}</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="h-12 px-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">{t('profile.company')}</Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, company: e.target.value }))
                        }
                        className="h-12 px-4"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="bio">{t('profile.bio')}</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                        }
                        className="min-h-32 px-4"
                        placeholder={t('profile.bioPlaceholder')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md ring-1 ring-border/40">
                  <CardHeader>
                    <CardTitle>{t('profile.addressInformation')}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="streetAddress">{t('profile.streetAddress')}</Label>
                      <Input
                        id="streetAddress"
                        value={profileData.address.streetAddress}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address, streetAddress: e.target.value },
                          }))
                        }
                        placeholder={t('profile.streetAddressPlaceholder')}
                        className="h-12 px-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">{t('profile.city')}</Label>
                      <Input
                        id="city"
                        value={profileData.address.city}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address, city: e.target.value },
                          }))
                        }
                        placeholder={t('profile.cityPlaceholder')}
                        className="h-12 px-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">{t('profile.state')}</Label>
                      <Input
                        id="state"
                        value={profileData.address.state}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address, state: e.target.value },
                          }))
                        }
                        placeholder={t('profile.statePlaceholder')}
                        className="h-12 px-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">{t('profile.postalCode')}</Label>
                      <Input
                        id="postalCode"
                        value={profileData.address.postalCode}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address, postalCode: e.target.value },
                          }))
                        }
                        placeholder="12345"
                        className="h-12 px-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">{t('profile.country')}</Label>
                      <Input
                        id="country"
                        value={profileData.address.country}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address, country: e.target.value },
                          }))
                        }
                        placeholder="México"
                        className="h-12 px-4"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md ring-1 ring-border/40">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('hostProfile.hostInformation')}</CardTitle>
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <Link to={createLocalizedPath(`/host/${user.id}`)}>
                        <ExternalLink className="h-4 w-4" />
                        {t('hostProfile.viewPublicProfile')}
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="workDescription">{t('hostProfile.workDescription')}</Label>
                      <Textarea
                        id="workDescription"
                        value={profileData.work_description}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, work_description: e.target.value }))
                        }
                        placeholder={t('hostProfile.workDescription')}
                        className="min-h-32 px-4"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>{t('hostProfile.languages')}</Label>
                      <div className="flex flex-wrap gap-2">
                        {profileData.languages.map((lang, index) => (
                          <Badge
                            key={`edit-lang-${lang}-${index}`}
                            variant="secondary"
                            className="px-3 py-1 flex items-center"
                          >
                            {lang}
                            <button
                              onClick={() =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  languages: prev.languages.filter((_, i) => i !== index),
                                }))
                              }
                              className="ml-2 text-muted-foreground hover:text-destructive"
                              aria-label={`Remove ${lang}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {profileData.languages.length === 0 && (
                          <span className="text-sm text-muted-foreground">
                            {t('hostProfile.addLanguage')}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          placeholder={t('hostProfile.addLanguage')}
                          className="h-12 px-4"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newLanguage.trim()) {
                              e.preventDefault();
                              setProfileData((prev) => ({
                                ...prev,
                                languages: [...prev.languages, newLanguage.trim()],
                              }));
                              setNewLanguage('');
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-12"
                          onClick={() => {
                            if (newLanguage.trim()) {
                              setProfileData((prev) => ({
                                ...prev,
                                languages: [...prev.languages, newLanguage.trim()],
                              }));
                              setNewLanguage('');
                            }
                          }}
                        >
                          {t('common.add')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border/60 pt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                      variant="outline"
                      className="h-12 sm:w-auto"
                      onClick={exitEditMode}
                      disabled={updateProfile.isPending}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      className="h-12 bg-primary hover:bg-[#3B82F6] shadow-md hover:shadow-lg transition-all sm:w-auto"
                      onClick={handleSaveProfile}
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending ? t('common.saving') : t('common.saveChanges')}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
