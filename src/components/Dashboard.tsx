
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { FactCard } from "./FactCard";
import facts from "@/data/facts";
import { useToast } from "@/hooks/use-toast";
import { useBookmarks } from "@/hooks/useBookmarks";

interface DashboardProps {
  selectedTopics: string[];
  onReset: () => void;
}

const Dashboard = ({ selectedTopics, onReset }: DashboardProps) => {
  const [displayedFacts, setDisplayedFacts] = useState<typeof facts>([]);
  const { toast } = useToast();
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    getNewFacts();
  }, [selectedTopics]);

  const getNewFacts = () => {
    const newFacts = selectedTopics.map(topic => {
      // Filter facts by this topic
      const topicFacts = facts.filter(fact => fact.topic === topic);
      
      // Get a random fact from this topic
      if (topicFacts.length > 0) {
        const randomIndex = Math.floor(Math.random() * topicFacts.length);
        return topicFacts[randomIndex];
      }
      return null;
    }).filter(Boolean);

    setDisplayedFacts(newFacts as typeof facts);
    
    toast({
      title: "Facts refreshed!",
      description: "Discover new fascinating information about your selected topics.",
    });
  };

  const handleBookmarkToggle = (fact: typeof facts[0]) => {
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

  const handleShare = (fact: typeof facts[0]) => {
    if (navigator.share) {
      navigator.share({
        title: fact.title,
        text: fact.blurb,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(`${fact.title}: ${fact.blurb}`);
      toast({
        title: "Copied to clipboard",
        description: "Fact copied to clipboard for sharing.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onReset}
        >
          <ArrowLeft size={16} />
          <span>Change Topics</span>
        </Button>
        
        <h1 className="text-2xl md:text-3xl font-bold text-center">Your Fun Facts</h1>
        
        <Button 
          onClick={getNewFacts}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          <span>New Facts</span>
        </Button>
      </div>

      <div className="space-y-6">
        {displayedFacts.map((fact) => (
          <FactCard 
            key={fact.id} 
            fact={fact} 
            isBookmarked={isBookmarked(fact.id)}
            onBookmarkToggle={handleBookmarkToggle}
            onShare={handleShare}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
