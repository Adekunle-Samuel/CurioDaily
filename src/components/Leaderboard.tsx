
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/data/facts';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  userProfile: UserProfile;
  leaderboard: UserProfile[];
  getXPProgress: () => {
    currentLevel: number;
    xpInCurrentLevel: number;
    xpForNextLevel: number;
    progressPercentage: number;
  };
}

export const Leaderboard = ({ userProfile, leaderboard, getXPProgress }: LeaderboardProps) => {
  const xpProgress = getXPProgress();

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-neutral-600';
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* User Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{userProfile.avatar}</span>
              <div>
                <h3 className="text-xl font-bold">{userProfile.displayName}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Level {xpProgress.currentLevel}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-emerald-500 text-white text-lg px-3 py-1">
                {userProfile.totalXP} XP
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {xpProgress.currentLevel + 1}</span>
              <span>{xpProgress.xpInCurrentLevel}/{xpProgress.xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress.progressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="topics">My Topics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="global" className="space-y-2 mt-4">
          {leaderboard.map((user, index) => (
            <Card key={user.id} className={cn(
              "transition-colors",
              user.id === userProfile.id && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
            )}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className={cn("text-2xl font-bold", getRankColor(user.rank))}>
                    {getRankEmoji(user.rank)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{user.avatar}</span>
                    <div>
                      <h4 className="font-semibold">{user.displayName}</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Level {Math.floor(user.totalXP / 100) + 1}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-lg font-bold">
                  {user.totalXP} XP
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="topics" className="mt-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg font-semibold mb-2">Coming Soon!</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Topic-specific leaderboards will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
