import { OwnerAvailabilityManager } from '@/components/features/owner-dashboard/OwnerAvailabilityManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import { useOwnerSpaces, type OwnerSpace } from '@/hooks/useOwnerData';
import { useTranslation } from '@/hooks/useTranslation';
import { createListSpaceStepPath } from '@/pages/list-space/paths';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const renderSpaceGrid = (
  spacesToRender: OwnerSpace[],
  options: {
    showAddCard?: boolean;
    onAddListing?: () => void;
    onViewSpace?: (spaceId: string) => void;
    onManageAvailability?: (space: OwnerSpace) => void;
    t: ReturnType<typeof useTranslation>['t'];
  }
) => {
  const { showAddCard = false, onAddListing, onViewSpace, onManageAvailability, t } = options;

  if (spacesToRender.length === 0 && !showAddCard) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {spacesToRender.map((space) => (
        <Card key={space.id} className="hover:shadow-md transition-shadow overflow-hidden">
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={space.images[0] || '/placeholder.svg'}
              alt={space.title}
              className="w-full h-full object-cover"
              onError={(event) => {
                const target = event.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <div className="absolute top-3 right-3 z-10">
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      aria-label={
                        space.is_active
                          ? t('ownerDashboard.activeStatus')
                          : t('ownerDashboard.inactiveStatus')
                      }
                    >
                      <CircleIcon
                        className={cn(
                          'h-5 w-5 drop-shadow-sm transition-transform hover:scale-110',
                          space.is_active ? 'text-success' : 'text-destructive'
                        )}
                        aria-hidden="true"
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="text-sm font-medium">
                    {space.is_active
                      ? t('ownerDashboard.activeStatus')
                      : t('ownerDashboard.inactiveStatus')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-2">{space.title}</h3>
            <p className="text-muted-foreground text-sm mb-3">
              <i className="fas fa-map-marker-alt mr-1"></i>
              {space.city}
            </p>

            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-foreground">
                ${space.price_per_hour}/{t('ownerDashboard.hour')}
              </span>
              <div className="flex items-center space-x-1 text-yellow-500 text-sm">
                <i className="fas fa-star"></i>
                <span>{space.rating}</span>
                <span className="text-muted-foreground">({space.total_reviews})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-muted-foreground">{t('ownerDashboard.thisMonth')}</p>
                <p className="font-medium">
                  {space.bookings_this_month} {t('ownerDashboard.bookings')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('ownerDashboard.earnings')}</p>
                <p className="font-medium">${space.earnings_this_month}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <i className="fas fa-edit mr-2"></i>
                  {t('ownerDashboard.edit')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onViewSpace?.(space.id)}
                >
                  <i className="fas fa-eye mr-2"></i>
                  {t('ownerDashboard.view')}
                </Button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center"
                onClick={() => onManageAvailability?.(space)}
              >
                <i className="fas fa-clock mr-2"></i>
                {t('ownerDashboard.manageAvailability')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {showAddCard && (
        <Card
          className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer"
          onClick={onAddListing}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-64">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-plus text-primary text-2xl"></i>
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {t('ownerDashboard.addNewListingCard')}
            </h3>
            <p className="text-muted-foreground text-sm text-center mb-4">
              {t('ownerDashboard.addNewListingDesc')}
            </p>
            <Button className="btn-primary">{t('ownerDashboard.getStarted')}</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface OwnerListingsSectionProps {
  title?: string;
}

export const OwnerListingsSection = ({ title }: OwnerListingsSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { createLocalizedPath, currentLanguage } = useLanguageRouting();
  const { data: ownerSpaces = [], isLoading } = useOwnerSpaces();
  const [isAvailabilityDialogOpen, setAvailabilityDialogOpen] = useState<boolean>(false);
  const [selectedSpace, setSelectedSpace] = useState<OwnerSpace | null>(null);

  const publishedSpaces = ownerSpaces.filter((space) => space.is_active);
  const draftSpaces = ownerSpaces.filter((space) => !space.is_active);

  const handleAddListing = () => {
    if (user) {
      navigate(createListSpaceStepPath(currentLanguage, user.id, 0));
    }
  };

  const handleViewSpace = (spaceId: string) => {
    navigate(createLocalizedPath(`/space/${spaceId}`));
  };

  const handleManageAvailability = (space: OwnerSpace) => {
    setSelectedSpace(space);
    setAvailabilityDialogOpen(true);
  };

  const availabilityManagerSpaces = useMemo(
    () => (selectedSpace ? [selectedSpace] : []),
    [selectedSpace]
  );

  return (
    <div className="space-y-10">
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="animate-pulse">
                <div className="w-full h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t('ownerDashboard.publishedListings')}
              </h3>
              <Badge variant="outline" className="text-xs">
                {publishedSpaces.length}
              </Badge>
            </div>

            {publishedSpaces.length > 0 ? (
              renderSpaceGrid(publishedSpaces, {
                showAddCard: true,
                onAddListing: handleAddListing,
                onViewSpace: handleViewSpace,
                onManageAvailability: handleManageAvailability,
                t,
              })
            ) : (
              <Card className="border-dashed border-border">
                <CardContent className="p-6 text-center text-muted-foreground">
                  {t('ownerDashboard.noPublishedListings')}
                </CardContent>
              </Card>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t('ownerDashboard.unpublishedListings')}
              </h3>
              <Badge variant="outline" className="text-xs">
                {draftSpaces.length}
              </Badge>
            </div>

            {draftSpaces.length > 0 ? (
              renderSpaceGrid(draftSpaces, {
                onAddListing: handleAddListing,
                onViewSpace: handleViewSpace,
                onManageAvailability: handleManageAvailability,
                t,
              })
            ) : (
              <Card className="border-dashed border-border">
                <CardContent className="p-6 text-center text-muted-foreground">
                  {t('ownerDashboard.noUnpublishedListings')}
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      )}
      <Dialog
        open={isAvailabilityDialogOpen}
        onOpenChange={(open) => {
          setAvailabilityDialogOpen(open);
          if (!open) {
            setSelectedSpace(null);
          }
        }}
      >
        <DialogContent className="h-screen w-screen max-w-none overflow-hidden rounded-none border-0 bg-background p-0 sm:h-screen sm:w-screen">
          <div className="flex h-full flex-col">
            <div className="border-b p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {t('ownerDashboard.manageAvailabilityDialogTitle')}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {t('ownerDashboard.manageAvailabilityDialogDescription', {
                    space: selectedSpace?.title ?? '',
                  })}
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {selectedSpace && (
                <OwnerAvailabilityManager
                  key={selectedSpace.id}
                  spaces={availabilityManagerSpaces}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OwnerListingsSection;
