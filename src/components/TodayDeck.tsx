
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
import { useFactProgress } from '@/hooks/useFactProgress';
import { generateContextualImage } from '@/services/runware';
import { ShareModal } from './ShareModal';

// Hardcoded API Key for automatic functionality
const RUNWARE_API_KEY = 'MH9tvl5oBifxOJ2GwK0HRTCGkNydwWNK';

export const TodayDeck = () => {
  const [todaysFacts, setTodaysFacts] = useState<Fact[]>([]);
  const [selectedQuizFact, setSelectedQuizFact] = useState<Fact | null>(null);
  const [shareModalFact, setShareModalFact] = useState<Fact | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { toast } = useToast();
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { userProfile, completeQuiz, isFactCompleted, viewFact } = useGameification();
  const { getFactsToShow } = useFactProgress();

  useEffect(() => {
    generateTodaysFacts();
  }, []);

  const generateTodaysFacts = async () => {
    setIsRefreshing(true);
    
    // Get facts using smart selection based on user progress and preferences
    const selectedFacts = getFactsToShow(facts, userProfile.preferredTopics);
    
    // Generate contextual images automatically with API key
    const factsWithGeneratedImages = await Promise.all(selectedFacts.map(async (fact) => {
      try {
        const imageUrl = await generateContextualImage(fact.title, fact.topic, RUNWARE_API_KEY);
        return imageUrl ? { ...fact, image: imageUrl } : fact;
      } catch (error) {
        console.error('Error generating image:', error);
        return fact;
      }
    }));
    
    setTodaysFacts(factsWithGeneratedImages);
    
    // Mark facts as viewed
    selectedFacts.forEach(fact => viewFact(fact.id));
    
    toast({
      title: "Fresh facts loaded!",
      description: "Discover fascinating new facts today.",
    });
    
    setIsRefreshing(false);
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
    setShareModalFact(fact);
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
          Curated facts based on your learning journey
        </p>
        <Button 
          onClick={generateTodaysFacts}
          variant="outline"
          className="gap-2 rounded-xl"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'New Facts'}
        </Button>
      </div>

      {/* Facts Carousel */}
      <div className="relative max-w-2xl mx-auto">
        <Carousel className="w-full">
          <CarouselContent>
            {todaysFacts.map((fact) => (
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
          <CarouselPrevious className="rounded-full" />
          <CarouselNext className="rounded-full" />
        </Carousel>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2">
        {todaysFacts.map((fact) => (
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

      {/* Share Modal */}
      <ShareModal 
        isOpen={!!shareModalFact} 
        onClose={() => setShareModalFact(null)}
        fact={shareModalFact}
      />

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
