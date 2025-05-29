
import { useState } from 'react';
import { X, Copy, Check, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Fact } from '@/data/facts';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fact: Fact | null;
}

export const ShareModal = ({ isOpen, onClose, fact }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!isOpen || !fact) return null;
  
  const shareText = `${fact.title}\n\n${fact.blurb}\n\nDiscover more facts at CurioDaily!`;
  const encodedText = encodeURIComponent(shareText);
  
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(twitterUrl, '_blank');
    onClose();
  };
  
  const shareToWhatsapp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };
  
  const shareToInstagram = () => {
    // Since Instagram doesn't have a direct sharing API, we'll copy to clipboard
    // and show a message to paste in Instagram
    navigator.clipboard.writeText(shareText);
    toast({
      title: "Ready to share on Instagram",
      description: "Text copied! You can now paste it in your Instagram post/story."
    });
    setTimeout(onClose, 1500);
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Share this fascinating fact with others!"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Could not copy text",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const nativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: fact.title,
          text: fact.blurb,
          url: window.location.href,
        });
        onClose();
      }
    } catch (err) {
      console.log('Share cancelled');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl shadow-glass backdrop-blur-sm overflow-hidden">
        <div className="relative bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold mb-2">Share this fact</h2>
          <p className="text-white/90 text-sm">
            Choose how you want to share "{fact.title}"
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button 
              onClick={shareToWhatsapp}
              className="flex flex-col items-center gap-2 p-4 h-auto rounded-xl"
              variant="outline"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M5.339 16.982L5.6 16.9c1.678-.537 2.72-.853 3.23-1.757.13-.229.13-.428.104-.685-.052-.524-.087-.872.276-1.534.388-.706.667-.83.913-.934.312-.134.544-.35.687-.533.232-.368.253-.682.21-.995a8.643 8.643 0 01-.827-1.564c-.203-.483-.29-.975-.28-1.484.012-.512.127-.966.326-1.35.215-.416.517-.732.86-.94.595-.362 1.228-.491 1.812-.49.606.001 1.135.158 1.558.406.396.232.706.52.957.865.248.345.435.736.56 1.152a4.35 4.35 0 01.155 1.152 3.69 3.69 0 01-.075.76 6.303 6.303 0 01-.12.655c-.092.38-.22.782-.413 1.178-.193.396-.433.78-.733 1.11h.003c-.462.507-1.053.873-1.836 1.237-.41.191-.87.347-1.356.498a20.428 20.428 0 01-1.438.392C9.765 20.566 8.64 21 7.491 21c-.71 0-1.373-.149-1.938-.435a3.847 3.847 0 01-.732-.446L5.339 16.982z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium">WhatsApp</span>
            </Button>
            
            <Button 
              onClick={shareToTwitter}
              className="flex flex-col items-center gap-2 p-4 h-auto rounded-xl"
              variant="outline"
            >
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                <Twitter className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium">Twitter</span>
            </Button>
            
            <Button 
              onClick={shareToInstagram}
              className="flex flex-col items-center gap-2 p-4 h-auto rounded-xl"
              variant="outline"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium">Instagram</span>
            </Button>
            
            <Button 
              onClick={copyToClipboard}
              className="flex flex-col items-center gap-2 p-4 h-auto rounded-xl"
              variant="outline"
            >
              <div className="w-10 h-10 bg-gray-500 dark:bg-gray-600 rounded-full flex items-center justify-center">
                {copied ? <Check className="w-6 h-6 text-white" /> : <Copy className="w-6 h-6 text-white" />}
              </div>
              <span className="text-sm font-medium">Copy Link</span>
            </Button>
          </div>
          
          <Button
            onClick={nativeShare}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
          >
            Use Device Sharing
          </Button>
        </div>
      </div>
    </div>
  );
};
