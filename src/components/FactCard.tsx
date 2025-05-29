import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fact } from '@/data/facts';
import { cn } from '@/lib/utils';

interface FactCardProps {
  fact: Fact;
  isBookmarked?: boolean;
  isCompleted?: boolean;
  onBookmarkToggle?: (fact: Fact) => void;
  onShare?: (fact: Fact) => void;
  onQuiz?: (fact: Fact) => void;
  className?: string;
}

export const FactCard = ({ 
  fact, 
  isBookmarked = false,
  isCompleted = false,
  onBookmarkToggle, 
  onShare,
  onQuiz,
  className 
}: FactCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const topicColors = {
    science: 'bg-blue-500',
    history: 'bg-amber-500',
    arts: 'bg-purple-500',
    space: 'bg-indigo-500',
    geography: 'bg-emerald-500',
    technology: 'bg-cyan-500',
    nature: 'bg-green-500',
    psychology: 'bg-violet-500',
    random: 'bg-pink-500'
  };

  const topicEmojis = {
    science: '🔬',
    history: '📜',
    arts: '🎨',
    space: '🚀',
    geography: '🌍',
    technology: '💻',
    nature: '🌿',
    psychology: '🧠',
    random: '🎲'
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatSource = (source: any) => {
    if (typeof source === 'string') return source;
    
    let formatted = source.title;
    if (source.author) formatted += ` by ${source.author}`;
    if (source.publication) formatted += ` - ${source.publication}`;
    if (source.year) formatted += ` (${source.year})`;
    return formatted;
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: fact.title,
          text: fact.blurb,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`${fact.title}\n\n${fact.blurb}\n\nDiscover more at ${window.location.href}`);
        onShare?.(fact);
      }
    } catch (err) {
      console.log('Share operation failed or was cancelled');
      try {
        await navigator.clipboard.writeText(`${fact.title}\n\n${fact.blurb}\n\nDiscover more at ${window.location.href}`);
        onShare?.(fact);
      } catch (clipboardErr) {
        console.error('Failed to copy to clipboard');
      }
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(fact);
  };

  const handleQuiz = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuiz?.(fact);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as Element;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return;
    }
    
    if (!prefersReducedMotion) {
      setFlipped(!flipped);
    }
  };

  const fallbackImage = `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80`;

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
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={() => setFlipped(true)}
            >
              <div className="relative h-full">
                <img 
                  src={imageError ? fallbackImage : fact.image}
                  alt={`${fact.topic} illustration`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <div className="flex gap-2">
                    <Badge className={cn("text-white", getDifficultyColor(fact.difficulty))}>
                      +{fact.xpValue} XP
                    </Badge>
                    {isCompleted && (
                      <Badge className="bg-green-500 text-white">✓ Completed</Badge>
                    )}
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 pointer-events-auto"
                    onClick={handleBookmark}
                  >
                    {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 pointer-events-auto"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="absolute bottom-16 left-6 right-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{topicEmojis[fact.topic as keyof typeof topicEmojis] || '🎲'}</span>
                    <Badge className={cn("text-white", topicColors[fact.topic as keyof typeof topicColors] || 'bg-gray-500')}>
                      {fact.topic}
                    </Badge>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2 leading-tight">
                    {fact.title}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed mb-4">
                    {fact.blurb}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-white text-white hover:bg-white hover:text-black"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(true);
                      }}
                    >
                      Read More
                    </Button>
                    {fact.quiz && (
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        onClick={handleQuiz}
                      >
                        Quiz ❓
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="absolute inset-0 p-6 cursor-pointer bg-white dark:bg-neutral-800"
              onClick={() => setFlipped(false)}
            >
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <Badge className={cn("text-white", topicColors[fact.topic as keyof typeof topicColors] || 'bg-gray-500')}>
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
                        <li key={index}>• {formatSource(source)}</li>
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
      className={cn(
        "relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer",
        className
      )}
      style={{ perspective: '600px' }}
      onClick={handleCardClick}
    >
      {/* Front Side */}
      <animated.div
        className="absolute inset-0 bg-white dark:bg-neutral-800 shadow-glass backdrop-blur-sm"
        style={{
          opacity: opacity.to(o => 1 - o),
          transform,
          rotateY: '0deg',
          pointerEvents: flipped ? 'none' : 'auto'
        }}
      >
        <div className="relative h-full">
          <img 
            src={imageError ? fallbackImage : fact.image}
            alt={`${fact.topic} illustration`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4">
            <div className="flex gap-2">
              <Badge className={cn("text-white", getDifficultyColor(fact.difficulty))}>
                +{fact.xpValue} XP
              </Badge>
              {isCompleted && (
                <Badge className="bg-green-500 text-white">✓ Completed</Badge>
              )}
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-2" style={{ pointerEvents: 'auto' }}>
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

          <div className="absolute bottom-16 left-6 right-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{topicEmojis[fact.topic as keyof typeof topicEmojis] || '🎲'}</span>
              <Badge className={cn("text-white", topicColors[fact.topic as keyof typeof topicColors] || 'bg-gray-500')}>
                {fact.topic}
              </Badge>
            </div>
            <h3 className="text-white font-bold text-xl mb-2 leading-tight">
              {fact.title}
            </h3>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              {fact.blurb}
            </p>
            <div className="flex gap-2" style={{ pointerEvents: 'auto' }}>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white text-white hover:bg-white hover:text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(true);
                }}
              >
                Read More
              </Button>
              {fact.quiz && (
                <Button
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={handleQuiz}
                >
                  Quiz ❓
                </Button>
              )}
            </div>
          </div>
        </div>
      </animated.div>

      {/* Back Side */}
      <animated.div
        className="absolute inset-0 p-6 bg-white dark:bg-neutral-800 shadow-glass backdrop-blur-sm"
        style={{
          opacity,
          transform,
          rotateY: '180deg',
          pointerEvents: flipped ? 'auto' : 'none'
        }}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <Badge className={cn("text-white", topicColors[fact.topic as keyof typeof topicColors] || 'bg-gray-500')}>
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
                  <li key={index}>• {formatSource(source)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};
