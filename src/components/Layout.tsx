
import { ReactNode } from 'react';
import { Sun, Moon, Laptop, Settings, Bookmark, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme, ThemeMode } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  currentView: 'today' | 'bookmarks' | 'onboarding';
  onViewChange: (view: 'today' | 'bookmarks' | 'onboarding') => void;
  onOpenTopicPicker: () => void;
}

export const Layout = ({ children, currentView, onViewChange, onOpenTopicPicker }: LayoutProps) => {
  const { mode, setMode, isDark } = useTheme();

  const themeIcons = {
    light: Sun,
    dark: Moon,
    auto: Laptop
  };

  const cycleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'auto'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  const ThemeIcon = themeIcons[mode];

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br transition-colors duration-300",
      isDark 
        ? "from-neutral-900 via-neutral-800 to-neutral-900" 
        : "from-sky-50 via-white to-blue-50"
    )}>
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              CurioDaily
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleTheme}
              className="p-2"
            >
              <ThemeIcon className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenTopicPicker}
              className="p-2"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-700">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex justify-center gap-8">
            <Button
              variant={currentView === 'today' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('today')}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-4",
                currentView === 'today' && "bg-gradient-to-r from-sky-500 to-blue-600 text-white"
              )}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Today</span>
            </Button>
            
            <Button
              variant={currentView === 'bookmarks' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('bookmarks')}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-4",
                currentView === 'bookmarks' && "bg-gradient-to-r from-sky-500 to-blue-600 text-white"
              )}
            >
              <Bookmark className="w-5 h-5" />
              <span className="text-xs">Saved</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};
