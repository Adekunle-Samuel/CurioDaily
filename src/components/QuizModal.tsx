
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fact } from '@/data/facts';
import { cn } from '@/lib/utils';

interface QuizModalProps {
  fact: Fact;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (isCorrect: boolean) => { xpGained: number; isCorrect: boolean };
}

export const QuizModal = ({ fact, isOpen, onClose, onComplete }: QuizModalProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ xpGained: number; isCorrect: boolean } | null>(null);

  if (!isOpen || !fact.quiz) return null;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === fact.quiz!.correctAnswer;
    const gameResult = onComplete(isCorrect);
    setResult(gameResult);
    setShowResult(true);
  };

  const handleClose = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setResult(null);
    onClose();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Quick Quiz</CardTitle>
            <div className="flex gap-2">
              <Badge className={cn("text-white", getDifficultyColor(fact.difficulty))}>
                {fact.difficulty}
              </Badge>
              <Badge variant="outline">
                +{fact.xpValue} XP
              </Badge>
            </div>
          </div>
          <CardDescription>{fact.title}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!showResult ? (
            <>
              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <p className="font-medium text-lg mb-4">{fact.quiz.question}</p>
                
                <div className="space-y-2">
                  {fact.quiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(index)}
                      className={cn(
                        "w-full p-3 text-left rounded-lg border transition-colors",
                        selectedAnswer === index
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      )}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="flex-1"
                >
                  Submit Answer
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className={cn(
                "p-4 rounded-lg text-center",
                result?.isCorrect 
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
              )}>
                <div className="text-4xl mb-2">
                  {result?.isCorrect ? '🎉' : '💡'}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {result?.isCorrect ? 'Correct!' : 'Not quite right!'}
                </h3>
                <p className="text-lg font-medium text-green-600 dark:text-green-400 mb-3">
                  +{result?.xpGained} XP earned
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {fact.quiz.explanation}
                </p>
              </div>
              
              <Button onClick={handleClose} className="w-full">
                Continue Learning
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
