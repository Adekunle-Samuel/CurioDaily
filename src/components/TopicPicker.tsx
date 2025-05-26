
import { useState } from 'react';
import { X, Sparkles, Atom, Clock, Palette, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TopicPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
}

const topics = [
  { id: 'science', label: 'Science', icon: Atom, color: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'history', label: 'History', icon: Clock, color: 'bg-amber-500 hover:bg-amber-600' },
  { id: 'arts', label: 'Arts', icon: Palette, color: 'bg-purple-500 hover:bg-purple-600' },
  { id: 'space', label: 'Space', icon: Rocket, color: 'bg-indigo-500 hover:bg-indigo-600' },
  { id: 'random', label: 'Random', icon: Sparkles, color: 'bg-pink-500 hover:bg-pink-600' },
];

export const TopicPicker = ({ isOpen, onClose, selectedTopics, onTopicsChange }: TopicPickerProps) => {
  const [localSelected, setLocalSelected] = useState(selectedTopics);

  const toggleTopic = (topicId: string) => {
    const newSelected = localSelected.includes(topicId)
      ? localSelected.filter(id => id !== topicId)
      : [...localSelected, topicId];
    setLocalSelected(newSelected);
  };

  const handleSave = () => {
    onTopicsChange(localSelected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl shadow-glass backdrop-blur-sm overflow-hidden">
        <div className="relative bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold mb-2">Choose Your Topics</h2>
          <p className="text-white/90 text-sm">
            Select the topics you'd like to explore
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {topics.map(topic => {
              const isSelected = localSelected.includes(topic.id);
              const Icon = topic.icon;
              
              return (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
                    "border-2 border-transparent",
                    isSelected 
                      ? `${topic.color} text-white shadow-lg scale-105` 
                      : "bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300"
                  )}
                >
                  <Icon className={cn(
                    "w-6 h-6",
                    isSelected ? "text-white" : "text-neutral-600 dark:text-neutral-400"
                  )} />
                  <span className="text-sm font-medium">{topic.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-none"
              disabled={localSelected.length === 0}
            >
              Save ({localSelected.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
