declare module 'mapbox-gl' {
  interface DragRotateHandler {
    disable: () => void;
  }

  interface TouchZoomRotateHandler {
    disableRotation: () => void;
  }

  interface MapBounds {
    getNorthEast: () => { lat: number; lng: number };
    getSouthWest: () => { lat: number; lng: number };
  }

  interface MapInstance {
    dragRotate: DragRotateHandler;
    touchZoomRotate: TouchZoomRotateHandler;
    getBounds: () => MapBounds;
    fitBounds: (bounds: LngLatBoundsLike, options?: FitBoundsOptions) => MapInstance;
  }

  interface LngLatBounds {
    extend: (coordinates: [number, number]) => void;
    isEmpty: () => boolean;
  }

  interface MapboxGL {
    Map: new (...args: unknown[]) => MapInstance;
    LngLatBounds: new () => LngLatBounds;
    accessToken: string;
    [key: string]: unknown;
  }

  type LngLatBoundsLike =
    | LngLatBounds
    | [number, number, number, number]
    | [[number, number], [number, number]];

  interface PaddingOptions {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }

  interface FitBoundsOptions {
    padding?: number | PaddingOptions;
    duration?: number;
    offset?: [number, number];
    maxZoom?: number;
  }

  type Map = MapInstance;

  const mapboxgl: MapboxGL;
  export default mapboxgl;
  export { Map, MapBounds, MapInstance };
}
