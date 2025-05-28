
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FactCard } from './FactCard';
import { useFactProgress } from '@/hooks/useFactProgress';
import { useBookmarks } from '@/hooks/useBookmarks';
import facts from '@/data/facts';
import { format } from 'date-fns';

export const FactHistory = () => {
  const [selectedFact, setSelectedFact] = useState<any>(null);
  const { factProgress, getStatistics } = useFactProgress();
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  
  const statistics = getStatistics();
  
  const getFactById = (id: number) => facts.find(f => f.id === id);
  
  const viewedFacts = factProgress
    .map(progress => ({
      ...getFactById(progress.factId),
      progress
    }))
    .filter(item => item.id)
    .sort((a, b) => new Date(b.progress.lastViewed).getTime() - new Date(a.progress.lastViewed).getTime());

  const masteredFacts = viewedFacts.filter(f => f.progress.status === 'mastered');
  const inProgressFacts = viewedFacts.filter(f => f.progress.status !== 'mastered');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'bg-green-500';
      case 'quizzed': return 'bg-blue-500';
      case 'viewed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const handleShare = async (fact: any) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: fact.title,
          text: fact.blurb,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`${fact.title}\n\n${fact.blurb}\n\nDiscover more at ${window.location.href}`);
      }
    } catch (err) {
      console.log('Share operation failed');
    }
  };

  const handleBookmarkToggle = (fact: any) => {
    if (isBookmarked(fact.id)) {
      removeBookmark(fact.id);
    } else {
      addBookmark(fact);
    }
  };

  if (selectedFact) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedFact(null)}>
            ← Back to History
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{selectedFact.title}</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Last viewed: {format(selectedFact.progress.lastViewed, 'PPp')}
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <FactCard
            fact={selectedFact}
            isBookmarked={isBookmarked(selectedFact.id)}
            isCompleted={selectedFact.progress.status !== 'viewed'}
            onBookmarkToggle={handleBookmarkToggle}
            onShare={handleShare}
            onQuiz={() => {}} // Disable quiz in history view
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statistics.totalViewed}</div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Facts Discovered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statistics.totalMastered}</div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Facts Mastered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{statistics.totalQuizzed}</div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Quizzes Taken</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(statistics.accuracy)}%</div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Quiz Accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>Your journey through the world of knowledge</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Facts Mastered</span>
              <span>{statistics.totalMastered} / {statistics.totalViewed}</span>
            </div>
            <Progress 
              value={statistics.totalViewed > 0 ? (statistics.totalMastered / statistics.totalViewed) * 100 : 0} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fact History */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Facts ({viewedFacts.length})</TabsTrigger>
          <TabsTrigger value="mastered">Mastered ({masteredFacts.length})</TabsTrigger>
          <TabsTrigger value="progress">In Progress ({inProgressFacts.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {viewedFacts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-semibold mb-2">No facts discovered yet</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Start exploring facts to build your knowledge collection!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {viewedFacts.map((fact) => (
                <Card key={fact.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1" onClick={() => setSelectedFact(fact)}>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{fact.title}</h3>
                          <Badge className={getStatusColor(fact.progress.status)}>
                            {fact.progress.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          {fact.blurb}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                          <span>Views: {fact.progress.viewCount}</span>
                          <span>Quizzes: {fact.progress.quizAttempts}</span>
                          <span>Correct: {fact.progress.correctAnswers}</span>
                          <span>Last viewed: {format(fact.progress.lastViewed, 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Badge variant="outline">{fact.topic}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="mastered" className="space-y-4">
          {masteredFacts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-lg font-semibold mb-2">No mastered facts yet</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Complete quizzes correctly to master facts!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {masteredFacts.map((fact) => (
                <Card key={fact.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={() => setSelectedFact(fact)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{fact.title}</h3>
                          <Badge className="bg-green-500">Mastered</Badge>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          {fact.blurb}
                        </p>
                        <div className="text-xs text-neutral-500">
                          Mastered on {format(fact.progress.lastViewed, 'MMM d, yyyy')}
                        </div>
                      </div>
                      <Badge variant="outline">{fact.topic}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-4">
          {inProgressFacts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-lg font-semibold mb-2">No facts in progress</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Facts you've viewed but haven't mastered will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {inProgressFacts.map((fact) => (
                <Card key={fact.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={() => setSelectedFact(fact)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{fact.title}</h3>
                          <Badge className={getStatusColor(fact.progress.status)}>
                            {fact.progress.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          {fact.blurb}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                          <span>Quiz attempts: {fact.progress.quizAttempts}</span>
                          <span>Correct: {fact.progress.correctAnswers}</span>
                          {fact.progress.quizAttempts > 0 && (
                            <span>Accuracy: {Math.round((fact.progress.correctAnswers / fact.progress.quizAttempts) * 100)}%</span>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline">{fact.topic}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
