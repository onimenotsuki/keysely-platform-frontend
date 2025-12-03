import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Facebook,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Star,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface ShareDialogProps {
  children?: React.ReactNode;
  title: string;
  description?: string;
  image?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  spaceType?: string;
  url?: string;
}

export function ShareDialog({
  children,
  title,
  description,
  image,
  location,
  rating,
  reviewCount,
  spaceType,
  url,
}: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const shareUrl = url || window.location.href;
  const shareText = `${title} - ${location || ''} | Keysely`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: t('spaceDetail.shareDialog.linkCopied'),
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(shareText);
    const body = encodeURIComponent(`${t('spaceDetail.shareDialog.title')}: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleFacebook = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, '_blank');
  };

  const handleMoreOptions = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: description || shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      toast({
        title: 'Share',
        description: 'Sharing is not supported on this browser',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>{t('spaceDetail.share')}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-semibold">
            {t('spaceDetail.shareDialog.title')}
          </DialogTitle>
        </DialogHeader>

        {/* Space Info Card */}
        <div className="px-6 pb-6">
          <div className="flex gap-4 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            {image && (
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">
                {spaceType || t('spaceDetail.shareDialog.rentalUnit')}
                {location && (
                  <>
                    {' · '}
                    {location}
                  </>
                )}
              </div>
              <h4 className="font-semibold text-sm mb-2 line-clamp-2">{title}</h4>
              <div className="flex items-center gap-3 text-xs">
                {rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span className="font-semibold">{rating}</span>
                    {reviewCount && <span className="text-muted-foreground">({reviewCount})</span>}
                  </div>
                )}
                {location && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{location}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Share Options Grid */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {/* Copy Link */}
            <Button
              variant="outline"
              className="justify-start h-auto py-4 px-4 hover:bg-accent"
              onClick={handleCopyLink}
            >
              <LinkIcon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{t('spaceDetail.shareDialog.copyLink')}</span>
            </Button>

            {/* Email */}
            <Button
              variant="outline"
              className="justify-start h-auto py-4 px-4 hover:bg-accent"
              onClick={handleEmail}
            >
              <Mail className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{t('spaceDetail.shareDialog.email')}</span>
            </Button>

            {/* WhatsApp */}
            <Button
              variant="outline"
              className="justify-start h-auto py-4 px-4 hover:bg-accent"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{t('spaceDetail.shareDialog.whatsapp')}</span>
            </Button>

            {/* Facebook */}
            <Button
              variant="outline"
              className="justify-start h-auto py-4 px-4 hover:bg-accent"
              onClick={handleFacebook}
            >
              <Facebook className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{t('spaceDetail.shareDialog.facebook')}</span>
            </Button>

            {/* X (Twitter) */}
            <Button
              variant="outline"
              className="justify-start h-auto py-4 px-4 hover:bg-accent"
              onClick={handleTwitter}
            >
              <X className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{t('spaceDetail.shareDialog.twitter')}</span>
            </Button>

            {/* More Options (Native Share API) */}
            {navigator.share && (
              <Button
                variant="outline"
                className="justify-start h-auto py-4 px-4 hover:bg-accent"
                onClick={handleMoreOptions}
              >
                <MoreHorizontal className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="font-medium">{t('spaceDetail.shareDialog.moreOptions')}</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
