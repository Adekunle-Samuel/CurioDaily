
import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fact } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

interface FactCardProps {
  fact: Fact;
  isBookmarked?: boolean;
  onBookmarkToggle?: (fact: Fact) => void;
  onShare?: (fact: Fact) => void;
  className?: string;
}

export const FactCard = ({ 
  fact, 
  isBookmarked = false, 
  onBookmarkToggle, 
  onShare,
  className 
}: FactCardProps) => {
  const [flipped, setFlipped] = useState(false);
  
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bind = useGesture({
    onClick: () => {
      if (!prefersReducedMotion) {
        setFlipped(!flipped);
      }
    }
  });

  const topicColors = {
    science: 'bg-blue-500',
    history: 'bg-amber-500',
    arts: 'bg-purple-500',
    space: 'bg-indigo-500',
    random: 'bg-pink-500'
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(fact);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkToggle?.(fact);
  };

  if (prefersReducedMotion) {
    return (
      <div className={cn(
        "relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden",
        "bg-white dark:bg-neutral-800 shadow-glass backdrop-blur-sm",
        "transition-opacity duration-300",
        className
      )}>
        <div className="relative h-full">
          {!flipped ? (
            // Front side
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={() => setFlipped(true)}
            >
              <div className="relative h-full">
                <img 
                  src={fact.image} 
                  alt={fact.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <Badge className={cn("text-white", topicColors[fact.topic as keyof typeof topicColors])}>
                    {fact.topic}
                  </Badge>
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={handleBookmark}
                  >
                    {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-bold text-xl mb-2 leading-tight">
                    {fact.title}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {fact.blurb}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Back side
            <div 
              className="absolute inset-0 p-6 cursor-pointer bg-white dark:bg-neutral-800"
              onClick={() => setFlipped(false)}
            >
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <Badge className={cn("text-white", topicColors[fact.topic as keyof typeof topicColors])}>
                    {fact.topic}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleBookmark}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-bold text-xl mb-4 text-neutral-900 dark:text-white">
                  {fact.title}
                </h3>
                
                <div className="flex-1 overflow-y-auto">
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
                    {fact.body}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      Sources:
                    </h4>
                    <ul className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                      {fact.sources.map((source, index) => (
                        <li key={index}>• {source}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      {...bind()} 
      className={cn(
        "relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer",
        className
      )}
      style={{ perspective: '600px' }}
    >
      {/* Front Side */}
      <animated.div
        className="absolute inset-0 bg-white dark:bg-neutral-800 shadow-glass backdrop-blur-sm"
        style={{
          opacity: opacity.to(o => 1 - o),
          transform,
          rotateY: '0deg'
        }}
      >
        <div className="relative h-full">
          <img 
            src={fact.image} 
            alt={fact.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4">
            <Badge className={cn("text-white", topicColors[fact.topic as keyof typeof topicColors])}>
              {fact.topic}
            </Badge>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={handleBookmark}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-white font-bold text-xl mb-2 leading-tight">
              {fact.title}
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {fact.blurb}
            </p>
          </div>
        </div>
      </animated.div>

      {/* Back Side */}
      <animated.div
        className="absolute inset-0 p-6 bg-white dark:bg-neutral-800 shadow-glass backdrop-blur-sm"
        style={{
          opacity,
          transform,
          rotateY: '180deg'
        }}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <Badge className={cn("text-white", topicColors[fact.topic as keyof typeof topicColors])}>
              {fact.topic}
            </Badge>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleBookmark}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <h3 className="font-bold text-xl mb-4 text-neutral-900 dark:text-white">
            {fact.title}
          </h3>
          
          <div className="flex-1 overflow-y-auto">
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              {fact.body}
            </p>
            
            <div>
              <h4 className="font-semibold text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Sources:
              </h4>
              <ul className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                {fact.sources.map((source, index) => (
                  <li key={index}>• {source}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};
