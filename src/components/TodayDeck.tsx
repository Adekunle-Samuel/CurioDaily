
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { FactCard } from './FactCard';
import { QuizModal } from './QuizModal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Fact } from '@/data/facts';
import facts from '@/data/facts';
import { useToast } from '@/hooks/use-toast';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useGameification } from '@/hooks/useGameification';

export const TodayDeck = () => {
  const [todaysFacts, setTodaysFacts] = useState<Fact[]>([]);
  const [selectedQuizFact, setSelectedQuizFact] = useState<Fact | null>(null);
  const { toast } = useToast();
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { userProfile, completeQuiz, isFactCompleted } = useGameification();

  useEffect(() => {
    generateTodaysFacts();
  }, []);

  const generateTodaysFacts = () => {
    // Get 3 random facts from different topics
    const shuffled = [...facts].sort(() => 0.5 - Math.random());
    const selectedFacts = shuffled.slice(0, 3);
    setTodaysFacts(selectedFacts);
    
    toast({
      title: "Fresh facts loaded!",
      description: "Discover 3 fascinating new facts today.",
    });
  };

  const handleBookmarkToggle = (fact: Fact) => {
    if (isBookmarked(fact.id)) {
      removeBookmark(fact.id);
      toast({
        title: "Bookmark removed",
        description: `Removed "${fact.title}" from bookmarks.`,
      });
    } else {
      addBookmark(fact);
      toast({
        title: "Bookmark added",
        description: `Added "${fact.title}" to bookmarks.`,
      });
    }
  };

  const handleShare = async (fact: Fact) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: fact.title,
          text: fact.blurb,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(`${fact.title}\n\n${fact.blurb}\n\nDiscover more at ${window.location.href}`);
      toast({
        title: "Copied to clipboard!",
        description: "Share this fascinating fact with others",
      });
    }
  };

  const handleQuiz = (fact: Fact) => {
    if (fact.quiz) {
      setSelectedQuizFact(fact);
    }
  };

  const handleQuizComplete = (isCorrect: boolean) => {
    if (!selectedQuizFact) return { xpGained: 0, isCorrect: false };
    
    const result = completeQuiz(selectedQuizFact, isCorrect);
    
    toast({
      title: isCorrect ? "Correct! 🎉" : "Good try! 💡",
      description: `You earned ${result.xpGained} XP!`,
    });
    
    return result;
  };

  if (todaysFacts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center animate-pulse">
          <span className="text-2xl">🤔</span>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">Loading today's facts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Today's Discovery Deck
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          3 fascinating facts to expand your knowledge
        </p>
        <Button 
          onClick={generateTodaysFacts}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          New Facts
        </Button>
      </div>

      {/* Facts Carousel */}
      <div className="relative max-w-2xl mx-auto">
        <Carousel className="w-full">
          <CarouselContent>
            {todaysFacts.map((fact, index) => (
              <CarouselItem key={fact.id}>
                <div className="flex justify-center px-4">
                  <FactCard
                    fact={fact}
                    isBookmarked={isBookmarked(fact.id)}
                    isCompleted={isFactCompleted(fact.id)}
                    onBookmarkToggle={handleBookmarkToggle}
                    onShare={handleShare}
                    onQuiz={handleQuiz}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2">
        {todaysFacts.map((fact, index) => (
          <div
            key={fact.id}
            className={`w-2 h-2 rounded-full transition-colors ${
              isFactCompleted(fact.id) 
                ? 'bg-emerald-500' 
                : 'bg-neutral-300 dark:bg-neutral-600'
            }`}
          />
        ))}
      </div>

      {/* Quiz Modal */}
      <QuizModal
        fact={selectedQuizFact!}
        isOpen={!!selectedQuizFact}
        onClose={() => setSelectedQuizFact(null)}
        onComplete={handleQuizComplete}
      />
    </div>
  );
};
