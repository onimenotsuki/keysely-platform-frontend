import type { MapboxOptions } from 'mapbox-gl';
import type { CSSProperties, ReactNode } from 'react';

declare module 'react-map-gl' {
  export interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    bearing?: number;
    pitch?: number;
    padding?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  }

  export interface ViewStateChangeEvent {
    viewState: ViewState;
  }

  export interface MapLayerMouseEvent {
    lngLat: {
      lat: number;
      lng: number;
    };
  }

  export interface MarkerDragEvent {
    lngLat: {
      lat: number;
      lng: number;
    };
  }

  export interface MapProps {
    mapStyle?: string;
    style?: CSSProperties;
    viewState?: ViewState;
    initialViewState?: ViewState;
    mapboxAccessToken?: string;
    reuseMaps?: boolean;
    mapLib?: typeof import('mapbox-gl');
    mapboxOptions?: MapboxOptions;
    onMove?: (event: ViewStateChangeEvent) => void;
    onClick?: (event: MapLayerMouseEvent) => void;
    children?: ReactNode;
  }

  export default function Map(props: MapProps): JSX.Element;

  export interface MarkerProps {
    latitude: number;
    longitude: number;
    draggable?: boolean;
    anchor?:
      | 'center'
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right';
    onDragEnd?: (event: MarkerDragEvent) => void;
    children?: ReactNode;
  }

  export function Marker(props: MarkerProps): JSX.Element;
}
