const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface MapboxFeature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: Record<string, unknown>;
  text: string;
  place_name: string;
  center: [number, number];
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  context?: {
    id: string;
    text: string;
    wikidata?: string;
    short_code?: string;
  }[];
}

interface MapboxGeocodingResponse {
  type: string;
  query: number[];
  features: MapboxFeature[];
  attribution: string;
}

/**
 * Performs reverse geocoding to get the place name from coordinates.
 * Prioritizes 'place' (city), then 'locality', then 'neighborhood'.
 * @param lat Latitude
 * @param lng Longitude
 * @returns The name of the place (e.g., "Mexico City", "Roma Norte") or null if not found.
 */
export const getReverseGeocoding = async (lat: number, lng: number): Promise<string | null> => {
  if (!MAPBOX_ACCESS_TOKEN) {
    console.error('Mapbox access token is missing.');
    return null;
  }

  try {
    const types = 'place,locality,neighborhood';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=${types}&access_token=${MAPBOX_ACCESS_TOKEN}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }

    const data: MapboxGeocodingResponse = await response.json();

    if (data.features && data.features.length > 0) {
      // Return the text of the most relevant feature
      // The API usually returns features in order of relevance/granularity requested
      // We requested place, locality, neighborhood.
      // Let's prefer 'place' (city) if available, or just take the first one.

      // Find a feature that is a 'place' (city)
      const cityFeature = data.features.find((f) => f.place_type.includes('place'));
      if (cityFeature) return cityFeature.text;

      // Fallback to the first feature (could be neighborhood or locality)
      return data.features[0].text;
    }

    return null;
  } catch (error) {
    console.error('Error fetching reverse geocoding data:', error);
    return null;
  }
};
