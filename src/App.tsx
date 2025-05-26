
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from '@/components/Layout';
import { FactCard } from '@/components/FactCard';
import { TopicPicker } from '@/components/TopicPicker';
import { BookmarkGrid } from '@/components/BookmarkGrid';
import { Onboarding } from '@/components/Onboarding';
import { useBookmarks, Fact } from '@/hooks/useBookmarks';
import { useToast } from '@/hooks/use-toast';

const queryClient = new QueryClient();

function AppContent() {
  const [currentView, setCurrentView] = useState<'today' | 'bookmarks' | 'onboarding'>('today');
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [todaysFact, setTodaysFact] = useState<Fact | null>(null);
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { toast } = useToast();

  // Check if onboarding is complete
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('curio-onboarding-complete');
    const storedTopics = localStorage.getItem('curio-selected-topics');
    
    if (!onboardingComplete) {
      setCurrentView('onboarding');
    } else if (storedTopics) {
      setSelectedTopics(JSON.parse(storedTopics));
    }
  }, []);

  // Load facts from JSON
  useEffect(() => {
    fetch('/facts.json')
      .then(res => res.json())
      .then((data: Fact[]) => {
        setFacts(data);
        // Set today's fact (for demo, just pick first one)
        if (data.length > 0) {
          setTodaysFact(data[0]);
        }
      })
      .catch(err => console.error('Failed to load facts:', err));
  }, []);

  const handleBookmarkToggle = (fact: Fact) => {
    if (isBookmarked(fact.id)) {
      removeBookmark(fact.id);
      toast({
        title: "Bookmark removed",
        description: "Fact removed from your collection",
      });
    } else {
      addBookmark(fact);
      toast({
        title: "Fact bookmarked!",
        description: "Added to your collection",
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
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${fact.title}\n\n${fact.blurb}\n\nDiscover more at ${window.location.href}`);
      toast({
        title: "Copied to clipboard!",
        description: "Share this fascinating fact with others",
      });
    }
  };

  const handleCompleteOnboarding = () => {
    setCurrentView('today');
  };

  if (currentView === 'onboarding') {
    return <Onboarding onComplete={handleCompleteOnboarding} />;
  }

  return (
    <Layout
      currentView={currentView}
      onViewChange={setCurrentView}
      onOpenTopicPicker={() => setShowTopicPicker(true)}
    >
      {currentView === 'today' && (
        <div className="flex justify-center py-8">
          {todaysFact ? (
            <FactCard
              fact={todaysFact}
              isBookmarked={isBookmarked(todaysFact.id)}
              onBookmarkToggle={handleBookmarkToggle}
              onShare={handleShare}
            />
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center animate-pulse">
                <span className="text-2xl">🤔</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">Loading today's fact...</p>
            </div>
          )}
        </div>
      )}

      {currentView === 'bookmarks' && (
        <div className="py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Your Collection
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {bookmarks.length} saved facts
            </p>
          </div>
          
          <BookmarkGrid
            bookmarks={bookmarks}
            onRemoveBookmark={removeBookmark}
            onShare={handleShare}
          />
        </div>
      )}

      <TopicPicker
        isOpen={showTopicPicker}
        onClose={() => setShowTopicPicker(false)}
        selectedTopics={selectedTopics}
        onTopicsChange={(topics) => {
          setSelectedTopics(topics);
          localStorage.setItem('curio-selected-topics', JSON.stringify(topics));
        }}
      />
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
