
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const availableTopics = [
  { id: "science", name: "Science", color: "bg-blue-500" },
  { id: "history", name: "History", color: "bg-amber-500" },
  { id: "geography", name: "Geography", color: "bg-emerald-500" },
  { id: "art", name: "Art & Culture", color: "bg-purple-500" },
  { id: "technology", name: "Technology", color: "bg-rose-500" },
  { id: "space", name: "Space", color: "bg-indigo-500" },
  { id: "nature", name: "Nature", color: "bg-green-500" },
  { id: "food", name: "Food", color: "bg-orange-500" },
  { id: "sports", name: "Sports", color: "bg-red-500" },
  { id: "music", name: "Music", color: "bg-pink-500" }
];

interface TopicSelectorProps {
  onSelectTopics: (topics: string[]) => void;
}

const TopicSelector = ({ onSelectTopics }: TopicSelectorProps) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const { toast } = useToast();
  const MAX_TOPICS = 5;

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
        <div className="bg-white p-3 rounded-lg inline-block mb-6">
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
              "p-4 cursor-pointer transition-all duration-200 hover:shadow-md relative overflow-hidden flex flex-col items-center justify-center h-32",
              selectedTopics.includes(topic.id) 
                ? `border-2 border-${topic.color.split("-")[1]}-600 shadow-md` 
                : "border border-gray-200"
            )}
            onClick={() => handleTopicToggle(topic.id)}
          >
            {selectedTopics.includes(topic.id) && (
              <div className={`absolute top-0 right-0 w-6 h-6 flex items-center justify-center ${topic.color} text-white`}>
                <Check size={14} />
              </div>
            )}
            <div 
              className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center ${topic.color} bg-opacity-20`}
            >
              <div className={`w-8 h-8 rounded-full ${topic.color}`}></div>
            </div>
            <span className="font-medium text-center">{topic.name}</span>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button 
          className="px-8 py-6 text-lg"
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
