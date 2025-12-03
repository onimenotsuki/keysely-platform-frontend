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

interface FetchMapboxOptions {
  signal?: AbortSignal;
}

const fetchFromMapbox = async (
  endpoint: string,
  params: Record<string, string>,
  options?: FetchMapboxOptions
): Promise<MapboxGeocodingResponse | null> => {
  const token = getAccessToken();
  if (!token || token.trim().length === 0) {
    console.warn('Mapbox access token is not configured. Skipping request.');
    return null;
  }

  const url = new URL(`${MAPBOX_GEOCODING_URL}/${endpoint}.json`);
  url.searchParams.set('access_token', token);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  try {
    const response = await fetch(url.toString(), { signal: options?.signal });
    if (!response.ok) {
      console.error('Error fetching Mapbox results', response.statusText);
      return null;
    }

    return (await response.json()) as MapboxGeocodingResponse;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // Ignore abort errors
      return null;
    }
    console.error('Mapbox request failed', error);
    return null;
  }
};

export const geocodeAddress = async (
  query: string,
  options?: FetchMapboxOptions
): Promise<GeocodeResult | null> => {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return null;
  }

  const data = await fetchFromMapbox(
    encodeURIComponent(trimmedQuery),
    {
      limit: '1',
      language: 'es,en',
      proximity: '-99.1332,19.4326', // Bias results toward Mexico City
    },
    options
  );

  if (!data) return null;

  const [feature] = data.features;
  if (!feature) return null;

  const [lng, lat] = feature.center;
  return {
    lat,
    lng,
    placeName: feature.place_name,
  };
};

export const reverseGeocode = async (
  lat: number,
  lng: number,
  options?: FetchMapboxOptions
): Promise<GeocodeResult | null> => {
  const data = await fetchFromMapbox(
    `${lng},${lat}`,
    {
      limit: '1',
      language: 'es,en',
    },
    options
  );

  if (!data) return null;

  const [feature] = data.features;
  if (!feature) return null;

  const [featureLng, featureLat] = feature.center;
  return {
    lat: featureLat,
    lng: featureLng,
    placeName: feature.place_name,
  };
};
