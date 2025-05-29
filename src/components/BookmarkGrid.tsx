
import { Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fact } from '@/data/facts';
import { cn } from '@/lib/utils';

interface BookmarkGridProps {
  bookmarks: Fact[];
  onRemoveBookmark: (factId: number) => void;
  onShare: (fact: Fact) => void;
}

export const BookmarkGrid = ({ bookmarks, onRemoveBookmark, onShare }: BookmarkGridProps) => {
  const topicColors = {
    science: 'bg-blue-500',
    history: 'bg-amber-500',
    arts: 'bg-purple-500',
    space: 'bg-indigo-500',
    random: 'bg-pink-500'
  };

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
          No bookmarks yet
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Start exploring facts and bookmark your favorites!
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {bookmarks.map(fact => (
        <div 
          key={fact.id}
          className="break-inside-avoid bg-white dark:bg-neutral-800 rounded-xl shadow-card overflow-hidden"
        >
          <div className="relative">
            <img 
              src={fact.image} 
              alt={fact.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            <div className="absolute top-3 left-3">
              <Badge className={cn("text-white text-xs", topicColors[fact.topic as keyof typeof topicColors])}>
                {fact.topic}
              </Badge>
            </div>

            <div className="absolute top-3 right-3 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                onClick={() => onShare(fact)}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-red-500/20 h-8 w-8 p-0"
                onClick={() => onRemoveBookmark(fact.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-bold text-lg mb-2 text-neutral-900 dark:text-white leading-tight">
              {fact.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              {fact.blurb}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
