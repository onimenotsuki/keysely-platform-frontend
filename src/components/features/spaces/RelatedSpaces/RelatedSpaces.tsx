import { SpaceCard } from '@/components/features/spaces/SpaceCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import type { Space } from '@/hooks/useSpaces';
import { useTranslation } from '@/hooks/useTranslation';
import { useTypesenseSearch } from '@/hooks/useTypesenseSearch';

interface RelatedSpacesProps {
  currentSpace: Space;
  excludeSpaceId?: string;
}

export const RelatedSpaces = ({ currentSpace, excludeSpaceId }: RelatedSpacesProps) => {
  const { t } = useTranslation();

  // Search for related spaces using Typesense
  const { data, isLoading } = useTypesenseSearch({
    searchTerm: currentSpace?.city,
    hitsPerPage: 10,
  });

  // Filter out the current space and get first 10 results
  const relatedSpaces =
    data?.spaces
      .filter((space) => space.id !== excludeSpaceId && space.id !== currentSpace.id)
      .slice(0, 10) || [];

  // Don't render if no related spaces found
  if (!isLoading && relatedSpaces.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-12 border-t">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-foreground">
          {t('spaceDetail.relatedSpacesTitle', {
            city: currentSpace.city,
          })}
        </h3>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full h-48 rounded-lg" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      ) : relatedSpaces.length > 0 ? (
        <div className="relative">
          <Carousel
            opts={{
              align: 'start',
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {relatedSpaces.map((space) => (
                <CarouselItem
                  key={space.id}
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <SpaceCard space={space} variant="compact" />
                </CarouselItem>
              ))}
            </CarouselContent>
            {relatedSpaces.length > 3 && (
              <>
                <CarouselPrevious className="left-0 md:-left-12" />
                <CarouselNext className="right-0 md:-right-12" />
              </>
            )}
          </Carousel>
        </div>
      ) : null}
    </div>
  );
};
