interface MapboxFeature {
  center: [number, number];
  place_name: string;
}

interface MapboxGeocodingResponse {
  features: MapboxFeature[];
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  placeName: string;
}

const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

const getAccessToken = () => import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export const geocodeAddress = async (query: string): Promise<GeocodeResult | null> => {
  const token = getAccessToken();
  if (!token || token.trim().length === 0) {
    console.warn('Mapbox access token is not configured. Skipping geocoding request.');
    return null;
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return null;
  }

  const url = new URL(`${MAPBOX_GEOCODING_URL}/${encodeURIComponent(trimmedQuery)}.json`);
  url.searchParams.set('access_token', token);
  url.searchParams.set('limit', '1');
  url.searchParams.set('language', 'es,en');
  url.searchParams.set('proximity', '-99.1332,19.4326'); // Bias results toward Mexico City

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error('Error fetching Mapbox geocoding results', response.statusText);
      return null;
    }

    const data = (await response.json()) as MapboxGeocodingResponse;
    const [feature] = data.features;
    if (!feature) return null;

    const [lng, lat] = feature.center;
    return {
      lat,
      lng,
      placeName: feature.place_name,
    };
  } catch (error) {
    console.error('Mapbox geocoding request failed', error);
    return null;
  }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<GeocodeResult | null> => {
  const token = getAccessToken();
  if (!token || token.trim().length === 0) {
    console.warn('Mapbox access token is not configured. Skipping reverse geocoding request.');
    return null;
  }

  const url = new URL(`${MAPBOX_GEOCODING_URL}/${lng},${lat}.json`);
  url.searchParams.set('access_token', token);
  url.searchParams.set('limit', '1');
  url.searchParams.set('language', 'es,en');

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error('Error fetching Mapbox reverse geocoding results', response.statusText);
      return null;
    }

    const data = (await response.json()) as MapboxGeocodingResponse;
    const [feature] = data.features;
    if (!feature) return null;

    const [featureLng, featureLat] = feature.center;
    return {
      lat: featureLat,
      lng: featureLng,
      placeName: feature.place_name,
    };
  } catch (error) {
    console.error('Mapbox reverse geocoding request failed', error);
    return null;
  }
};
