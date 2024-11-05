'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2Icon, TwitterIcon, FacebookIcon, LinkedinIcon, CopyIcon } from 'lucide-react';
import { useSharePrompt } from '@/hooks/useSharePrompt';
import { useToast } from '@/hooks/use-toast';

interface ShareProps {
  title: string;
  text: string;
}

const Share: React.FC<ShareProps> = ({ title, text }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const { shouldPromptShare, setShouldPromptShare } = useSharePrompt();

  useEffect(() => {
    if (shouldPromptShare) {
      setIsOpen(true);
      setShouldPromptShare(false);
    }
  }, [shouldPromptShare, setShouldPromptShare]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "The link has been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error",
        description: "Failed to copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        toast({
          title: "Shared Successfully",
          description: "Thanks for sharing!",
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      setIsOpen(true);
    }
  };

  const shareOnSocialMedia = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`;
        break;
    }
    window.open(url, '_blank');
  };

  return (
    <>
      <Button onClick={handleShare} variant="outline" className='text-pink-500'>
        <Share2Icon className="mr-2 h-4 w-4" /> Share
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>Share this tool</DialogTitle>
          <DialogDescription>Help spread the word about this amazing tool!</DialogDescription>

          <div className="flex items-center space-x-2 mt-4">
            <Input
              value={shareUrl}
              readOnly
              className="flex-grow"
            />
            <Button onClick={handleCopy}>
              <CopyIcon className="mr-2 h-4 w-4" /> Copy
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Share on social media</h3>
            <div className="flex justify-center space-x-4 text-blue-500">
              <Button onClick={() => shareOnSocialMedia('twitter')} variant="outline">
                <TwitterIcon className="mr-2 h-4 w-4" /> Twitter
              </Button>
              <Button onClick={() => shareOnSocialMedia('facebook')} variant="outline">
                <FacebookIcon className="mr-2 h-4 w-4" /> Facebook
              </Button>
              <Button onClick={() => shareOnSocialMedia('linkedin')} variant="outline">
                <LinkedinIcon className="mr-2 h-4 w-4" /> LinkedIn
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Thank you for sharing! Your support helps us grow.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Share;