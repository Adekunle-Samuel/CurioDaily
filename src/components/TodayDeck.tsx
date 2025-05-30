import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { FactCard } from './FactCard';
import { QuizModal } from './QuizModal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Fact } from '@/data/facts';
import { useToast } from '@/hooks/use-toast';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useGameification } from '@/hooks/useGameification';
import { useFactProgress } from '@/hooks/useFactProgress';
import { generateContextualImage } from '@/services/runware';
import { ShareModal } from './ShareModal';
import { factProvider } from '@/services/factProvider';

// Hardcoded API Key for automatic functionality
const RUNWARE_API_KEY = 'MH9tvl5oBifxOJ2GwK0HRTCGkNydwWNK';

export const TodayDeck = () => {
  const [todaysFacts, setTodaysFacts] = useState<Fact[]>([]);
  const [selectedQuizFact, setSelectedQuizFact] = useState<Fact | null>(null);
  const [shareModalFact, setShareModalFact] = useState<Fact | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [initializationStatus, setInitializationStatus] = useState('');
  
  const { toast } = useToast();
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { userProfile, completeQuiz, isFactCompleted, viewFact } = useGameification();
  const { getFactsToShow, factProgress } = useFactProgress();

  useEffect(() => {
    initializeAndLoadFacts();
  }, []);

  const initializeAndLoadFacts = async () => {
    setIsRefreshing(true);
    setIsGenerating(true);
    setInitializationStatus('Initializing fact database...');
    
    try {
      // Get all facts to trigger initialization
      setInitializationStatus('Generating diverse facts across all topics...');
      const allFacts = await factProvider.getAllFacts();
      
      setInitializationStatus('Selecting personalized facts...');
      // Get facts using smart selection with dynamic generation
      const selectedFacts = await getFactsToShow(allFacts, factProgress, userProfile.preferredTopics);
      
      if (selectedFacts.length === 0) {
        toast({
          title: "Generating new facts",
          description: "Creating fresh content for you...",
        });
        setIsRefreshing(false);
        setIsGenerating(false);
        setInitializationStatus('');
        return;
      }
      
      setInitializationStatus('Generating contextual images...');
      // Generate contextual images with better error handling
      const factsWithGeneratedImages = await Promise.all(selectedFacts.map(async (fact) => {
        try {
          const imageUrl = await generateContextualImage(fact.title, fact.topic, RUNWARE_API_KEY);
          return imageUrl ? { ...fact, image: imageUrl } : fact;
        } catch (error) {
          console.error('Error generating image for fact:', fact.id, error);
          return fact;
        }
      }));
      
      setTodaysFacts(factsWithGeneratedImages);
      
      // Mark facts as viewed
      selectedFacts.forEach(fact => viewFact(fact.id));
      
      const generatedCount = selectedFacts.filter(f => f.isGenerated).length;
      const topicDistribution = selectedFacts.reduce((acc, fact) => {
        acc[fact.topic] = (acc[fact.topic] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const message = generatedCount > 0 
        ? `Fresh facts loaded! ${generatedCount} newly generated facts across topics: ${Object.keys(topicDistribution).join(', ')}`
        : `Facts loaded across topics: ${Object.keys(topicDistribution).join(', ')}`;
      
      toast({
        title: "Facts ready!",
        description: message,
      });

      // Log fact counts for debugging
      const factCounts = factProvider.getFactCountByTopic();
      console.log('Fact counts by topic:', factCounts);
      
    } catch (error) {
      console.error('Error generating today\'s facts:', error);
      toast({
        title: "Error loading facts",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
      setIsGenerating(false);
      setInitializationStatus('');
    }
  };

  const generateTodaysFacts = async () => {
    setIsRefreshing(true);
    setIsGenerating(true);
    
    try {
      // Get fresh facts
      const allFacts = await factProvider.getAllFacts();
      const selectedFacts = await getFactsToShow(allFacts, factProgress, userProfile.preferredTopics);
      
      if (selectedFacts.length === 0) {
        toast({
          title: "Generating new facts",
          description: "Creating fresh content for you...",
        });
        return;
      }
      
      // Generate contextual images
      const factsWithGeneratedImages = await Promise.all(selectedFacts.map(async (fact) => {
        try {
          const imageUrl = await generateContextualImage(fact.title, fact.topic, RUNWARE_API_KEY);
          return imageUrl ? { ...fact, image: imageUrl } : fact;
        } catch (error) {
          console.error('Error generating image for fact:', fact.id, error);
          return fact;
        }
      }));
      
      setTodaysFacts(factsWithGeneratedImages);
      
      // Mark facts as viewed
      selectedFacts.forEach(fact => viewFact(fact.id));
      
      const generatedCount = selectedFacts.filter(f => f.isGenerated).length;
      const topicDistribution = selectedFacts.reduce((acc, fact) => {
        acc[fact.topic] = (acc[fact.topic] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const message = generatedCount > 0 
        ? `Fresh facts loaded! ${generatedCount} newly generated facts across topics: ${Object.keys(topicDistribution).join(', ')}`
        : `Facts loaded across topics: ${Object.keys(topicDistribution).join(', ')}`;
      
      toast({
        title: "Facts ready!",
        description: message,
      });
    } catch (error) {
      console.error('Error generating today\'s facts:', error);
      toast({
        title: "Error loading facts",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
      setIsGenerating(false);
    }
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
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
          {isGenerating ? (
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          ) : (
            <span className="text-2xl">🤔</span>
          )}
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 mb-2">
          {isGenerating ? initializationStatus || "Generating fresh facts for you..." : "Loading today's facts..."}
        </p>
        {isGenerating && (
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            This may take a moment as we create diverse content across all topics...
          </p>
        )}
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
          {isRefreshing ? 'Generating...' : 'New Facts'}
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
