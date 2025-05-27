
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from '@/components/Layout';
import { TodayDeck } from '@/components/TodayDeck';
import { Leaderboard } from '@/components/Leaderboard';
import { TopicPicker } from '@/components/TopicPicker';
import { BookmarkGrid } from '@/components/BookmarkGrid';
import { Onboarding } from '@/components/Onboarding';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useGameification } from '@/hooks/useGameification';
import { useToast } from '@/hooks/use-toast';

const queryClient = new QueryClient();

function AppContent() {
  const [currentView, setCurrentView] = useState<'today' | 'leaderboard' | 'bookmarks' | 'onboarding'>('today');
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const { bookmarks, removeBookmark } = useBookmarks();
  const { userProfile, leaderboard, getXPProgress } = useGameification();
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

  const handleShare = async (fact: any) => {
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
      userProfile={userProfile}
      getXPProgress={getXPProgress}
    >
      {currentView === 'today' && <TodayDeck />}

      {currentView === 'leaderboard' && (
        <div className="py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Leaderboard
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              See how you rank among fellow knowledge seekers
            </p>
          </div>
          
          <Leaderboard
            userProfile={userProfile}
            leaderboard={leaderboard}
            getXPProgress={getXPProgress}
          />
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
