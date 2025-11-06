/**
 * Temporary test component to verify all Lucide icons work correctly
 * This can be deleted after verification
 */
import { amenitiesConfig } from '@/config/amenitiesConfig';

export const IconsTest = () => {
  return (
    <div className="p-8 grid grid-cols-5 gap-4">
      {amenitiesConfig.map((amenity) => {
        const Icon = amenity.icon;
        return (
          <div key={amenity.key} className="flex flex-col items-center gap-2 p-4 border rounded">
            <Icon size={32} className="text-primary stroke-[1.5]" strokeWidth={1.5} />
            <span className="text-xs text-center">{amenity.key}</span>
          </div>
        );
      })}
    </div>
  );
};
