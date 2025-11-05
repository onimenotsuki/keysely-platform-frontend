import {
  AirVent,
  Armchair,
  Bike,
  Bus,
  Car,
  ChefHat,
  Clock,
  Coffee,
  Lock,
  Phone,
  Presentation,
  Printer,
  Projector,
  Shield,
  ShowerHead,
  Sparkles,
  Sun,
  User,
  Video,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

export interface AmenityConfig {
  key: string;
  value: string;
  icon: LucideIcon;
}

export const amenitiesConfig: AmenityConfig[] = [
  {
    key: 'highSpeedWifi',
    value: 'High-speed WiFi',
    icon: Wifi,
  },
  {
    key: 'printerScanner',
    value: 'Printer/Scanner',
    icon: Printer,
  },
  {
    key: 'coffeeAndTea',
    value: 'Coffee & Tea',
    icon: Coffee,
  },
  {
    key: 'kitchenAccess',
    value: 'Kitchen Access',
    icon: ChefHat,
  },
  {
    key: 'airConditioning',
    value: 'Air Conditioning',
    icon: AirVent,
  },
  {
    key: 'naturalLight',
    value: 'Natural Light',
    icon: Sun,
  },
  {
    key: 'ergonomicFurniture',
    value: 'Ergonomic Furniture',
    icon: Armchair,
  },
  {
    key: 'whiteboard',
    value: 'Whiteboard',
    icon: Presentation,
  },
  {
    key: 'projectorScreen',
    value: 'Projector/Screen',
    icon: Projector,
  },
  {
    key: 'videoConferencing',
    value: 'Video Conferencing',
    icon: Video,
  },
  {
    key: 'securitySystem',
    value: 'Security System',
    icon: Shield,
  },
  {
    key: 'access24x7',
    value: '24/7 Access',
    icon: Clock,
  },
  {
    key: 'receptionServices',
    value: 'Reception Services',
    icon: User,
  },
  {
    key: 'cleaningService',
    value: 'Cleaning Service',
    icon: Sparkles,
  },
  {
    key: 'parking',
    value: 'Parking',
    icon: Car,
  },
  {
    key: 'publicTransport',
    value: 'Public Transport',
    icon: Bus,
  },
  {
    key: 'bikeStorage',
    value: 'Bike Storage',
    icon: Bike,
  },
  {
    key: 'showerFacilities',
    value: 'Shower Facilities',
    icon: ShowerHead,
  },
  {
    key: 'phoneBooth',
    value: 'Phone Booth',
    icon: Phone,
  },
  {
    key: 'lockers',
    value: 'Lockers',
    icon: Lock,
  },
];

/**
 * Get amenity configuration by value (e.g., "High-speed WiFi")
 */
export const getAmenityByValue = (value: string): AmenityConfig | undefined => {
  return amenitiesConfig.find((amenity) => amenity.value === value);
};

/**
 * Get amenity configuration by key (e.g., "highSpeedWifi")
 */
export const getAmenityByKey = (key: string): AmenityConfig | undefined => {
  return amenitiesConfig.find((amenity) => amenity.key === key);
};
