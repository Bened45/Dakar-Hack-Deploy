import { useState } from "react";
import { Share2, Copy, Check, Facebook, Twitter, Linkedin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; // depuis react-icons

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  className?: string;
}

const ShareButton = ({ 
  url = window.location.href, 
  title = "Découvrez ce trajet sur bitTravel", 
  text = "Je vous recommande ce trajet", 
  className 
}: ShareButtonProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
      },
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        );
      },
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
          "_blank"
        );
      },
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans votre presse-papiers",
      });
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    });
  };

  const handleWebShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url,
      }).catch((error) => {
        console.log('Erreur lors du partage', error);
        // Fallback to popover if web share fails
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={className}
        >
          <Share2 className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Partager</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="p-3">
          <h4 className="font-medium mb-2">Partager sur</h4>
          <div className="grid grid-cols-2 gap-2">
            {shareOptions.map((option) => (
              <Button
                key={option.name}
                variant="outline"
                size="sm"
                className="h-12 flex flex-col gap-1"
                onClick={option.action}
              >
                <option.icon className="h-4 w-4" />
                <span className="text-xs">{option.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copier le lien
                </>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;