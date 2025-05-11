
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TopicImage {
  id: string;
  name: string;
  color: string;
  image: string;
}

const availableTopics: TopicImage[] = [
  { 
    id: "science", 
    name: "Science", 
    color: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "history", 
    name: "History", 
    color: "bg-amber-500",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "geography", 
    name: "Geography", 
    color: "bg-emerald-500",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "art", 
    name: "Art & Culture", 
    color: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "technology", 
    name: "Technology", 
    color: "bg-rose-500",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "space", 
    name: "Space", 
    color: "bg-indigo-500",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "nature", 
    name: "Nature", 
    color: "bg-green-500",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "food", 
    name: "Food", 
    color: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "sports", 
    name: "Sports", 
    color: "bg-red-500",
    image: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?auto=format&fit=crop&w=300&q=80"
  },
  { 
    id: "music", 
    name: "Music", 
    color: "bg-pink-500",
    image: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=300&q=80"
  }
];

interface TopicSelectorProps {
  onSelectTopics: (topics: string[]) => void;
}

const TopicSelector = ({ onSelectTopics }: TopicSelectorProps) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const { toast } = useToast();
  const MAX_TOPICS = 5;
  
  // Using a consistent color for both checkmarks and CTA
  const accentColor = "bg-purple-500"; // Primary accent color
  const accentHoverColor = "hover:bg-purple-600"; // Slightly darker for hover state

  const handleTopicToggle = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else {
      if (selectedTopics.length >= MAX_TOPICS) {
        toast({
          title: "Maximum topics reached",
          description: `You can only select up to ${MAX_TOPICS} topics.`,
          variant: "destructive"
        });
        return;
      }
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSubmit = () => {
    if (selectedTopics.length === 0) {
      toast({
        title: "No topics selected",
        description: "Please select at least one topic to continue.",
        variant: "destructive"
      });
      return;
    }
    onSelectTopics(selectedTopics);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Discover Fascinating Facts</h1>
        <p className="text-xl text-gray-600 mb-8">
          Select up to 5 topics you're interested in to get started
        </p>
        <div className="bg-white p-3 rounded-lg inline-block mb-6 shadow-sm">
          <p className="text-sm font-medium">
            {selectedTopics.length} of {MAX_TOPICS} topics selected
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {availableTopics.map((topic) => (
          <Card 
            key={topic.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md relative overflow-hidden group h-48",
              selectedTopics.includes(topic.id) 
                ? "border-2 border-purple-600 shadow-md" 
                : "border border-gray-200"
            )}
            onClick={() => handleTopicToggle(topic.id)}
          >
            <div className="absolute inset-0 w-full h-full">
              <img 
                src={topic.image} 
                alt={topic.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent`}></div>
            </div>
            
            {selectedTopics.includes(topic.id) && (
              <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-purple-500 text-white rounded-full z-10">
                <Check size={14} />
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <span className="font-medium text-lg">{topic.name}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button 
          className={`px-8 py-6 text-lg ${accentColor} ${accentHoverColor} border-none`}
          onClick={handleSubmit}
          disabled={selectedTopics.length === 0}
        >
          Start Discovering
        </Button>
      </div>
    </div>
  );
};

export default TopicSelector;
