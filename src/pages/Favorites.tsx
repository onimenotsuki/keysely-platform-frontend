import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { Heart, MapPin, Star, Users } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

const Favorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: favorites, isLoading } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  const handleRemoveFavorite = async (spaceId: string, spaceTitle: string) => {
    try {
      await toggleFavorite.mutateAsync(spaceId);
      toast({
        title: 'Eliminado de favoritos',
        description: `${spaceTitle} se eliminó de tus favoritos`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar de favoritos',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Inicia sesión para ver tus favoritos</h1>
          <Link to="/auth">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Mis Favoritos</h1>
            <p className="text-muted-foreground">
              Espacios que has guardado para reservar más tarde
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="w-full h-80" />
                ))}
            </div>
          ) : favorites && favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <Card
                  key={favorite.id}
                  className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    <Link to={`/space/${favorite.spaces?.id}`}>
                      <img
                        src={favorite.spaces?.images?.[0] || '/placeholder.svg'}
                        alt={favorite.spaces?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
                      onClick={() => {
                        if (favorite.spaces?.id && favorite.spaces?.title) {
                          handleRemoveFavorite(favorite.spaces.id, favorite.spaces.title);
                        }
                      }}
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                      €{favorite.spaces?.price_per_hour}/hora
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Link to={`/space/${favorite.spaces?.id}`}>
                        <h3 className="font-semibold text-lg truncate flex-1 mr-2 hover:text-primary transition-colors">
                          {favorite.spaces?.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{favorite.spaces?.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm truncate">{favorite.spaces?.city}</span>
                    </div>

                    <div className="flex items-center text-muted-foreground mb-4">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">Espacio disponible</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button asChild className="flex-1">
                        <Link to={`/space/${favorite.spaces?.id}`}>Ver Detalles</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (favorite.spaces?.id && favorite.spaces?.title) {
                            handleRemoveFavorite(favorite.spaces.id, favorite.spaces.title);
                          }
                        }}
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No tienes favoritos aún</h2>
                <p className="text-muted-foreground mb-6">
                  Explora espacios y guarda los que más te gusten para encontrarlos fácilmente
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

export default Favorites;
