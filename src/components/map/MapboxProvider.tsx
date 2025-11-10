import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl';
import { useEffect, type ReactNode } from 'react';

interface MapboxProviderProps {
  children: ReactNode;
}

export const MapboxProvider = ({ children }: MapboxProviderProps) => {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    if (!accessToken) return;

    mapboxgl.accessToken = accessToken;
  }, [accessToken]);

  return <>{children}</>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const isMapboxConfigured = (): boolean => {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  if (typeof token !== 'string') return false;
  const trimmed = token.trim();
  if (trimmed.length === 0) return false;

  const isPlaceholder =
    trimmed === 'your_mapbox_public_token' || trimmed.startsWith('pk.') === false;

  return !isPlaceholder;
};
