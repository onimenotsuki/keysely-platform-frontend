import { useLoadScript } from '@react-google-maps/api';
import { ReactNode } from 'react';

// Note: 'marker' library is loaded automatically with Maps JavaScript API v3.56+
const libraries: ('places' | 'geometry')[] = ['places', 'geometry'];

interface GoogleMapProviderProps {
  children: ReactNode;
}

export const GoogleMapProvider = ({ children }: GoogleMapProviderProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
    // Note: version and mapIds are optional - removing them for compatibility
  });

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Error al cargar Google Maps</p>
          <p className="text-sm text-muted-foreground">
            Por favor verifica tu conexión e intenta de nuevo
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Check if Google Maps is configured
// eslint-disable-next-line react-refresh/only-export-components
export const isGoogleMapsConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return !!apiKey && apiKey !== '';
};
