
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopicPicker } from './TopicPicker';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { mode, setMode, isDark } = useTheme();

  const steps = [
    {
      title: "Welcome to CurioDaily",
      subtitle: "Discover fascinating facts every day",
      content: (
        <div className="text-center py-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Get ready to expand your knowledge with amazing facts from science, history, arts, space, and more!
          </p>
        </div>
      )
    },
    {
      title: "Choose Your Interests",
      subtitle: "Pick topics that fascinate you",
      content: (
        <div className="py-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🎯</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              We'll personalize your daily facts based on your interests.
            </p>
          </div>
          
          <Button
            onClick={() => setShowTopicPicker(true)}
            variant="outline"
            className="w-full py-3 mb-4"
          >
            {selectedTopics.length > 0 
              ? `${selectedTopics.length} topics selected` 
              : "Select Topics"
            }
          </Button>
          
          {selectedTopics.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedTopics.map(topic => (
                <span 
                  key={topic}
                  className="px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-full text-sm capitalize"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      title: "Stay Notified",
      subtitle: "Never miss your daily dose of curiosity",
      content: (
        <div className="py-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">🔔</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Get a gentle reminder when new facts are available.
          </p>
          
          <Button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            variant={notificationsEnabled ? "default" : "outline"}
            className={cn(
              "w-full py-3",
              notificationsEnabled && "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            )}
          >
            {notificationsEnabled ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Notifications Enabled
              </>
            ) : (
              "Enable Notifications"
            )}
          </Button>
        </div>
      )
    },
    {
      title: "Choose Your Theme",
      subtitle: "Make it yours",
      content: (
        <div className="py-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🎨</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              Choose how you want CurioDaily to look.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { mode: 'light' as const, label: 'Light', icon: '☀️' },
              { mode: 'dark' as const, label: 'Dark', icon: '🌙' },
              { mode: 'auto' as const, label: 'Auto', icon: '⚙️' }
            ].map(theme => (
              <button
                key={theme.mode}
                onClick={() => setMode(theme.mode)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  mode === theme.mode
                    ? "border-sky-500 bg-sky-50 dark:bg-sky-950"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                )}
              >
                <span className="text-2xl">{theme.icon}</span>
                <span className="text-sm font-medium">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>
      )
    }
  ];

  const canProceed = () => {
    switch (step) {
      case 1: return selectedTopics.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Save preferences
      localStorage.setItem('curio-onboarding-complete', 'true');
      localStorage.setItem('curio-selected-topics', JSON.stringify(selectedTopics));
      localStorage.setItem('curio-notifications-enabled', JSON.stringify(notificationsEnabled));
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-glass backdrop-blur-sm overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-neutral-200 dark:bg-neutral-700">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  {steps[step].title}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {steps[step].subtitle}
                </p>
              </div>

              {steps[step].content}

              <div className="flex justify-between items-center mt-8">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={step === 0}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>

                <div className="text-sm text-neutral-500">
                  {step + 1} of {steps.length}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-none"
                >
                  {step === steps.length - 1 ? 'Get Started' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TopicPicker
        isOpen={showTopicPicker}
        onClose={() => setShowTopicPicker(false)}
        selectedTopics={selectedTopics}
        onTopicsChange={setSelectedTopics}
      />
    </>
  );
};
