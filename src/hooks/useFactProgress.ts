import { useState, useEffect } from 'react';
import { UserFactProgress } from '@/types/factProgress';
import { factProgressStorage } from '@/services/factProgressStorage';
import { factSelectionService } from '@/services/factSelection';
import { factStatisticsService } from '@/services/factStatistics';

export const useFactProgress = () => {
  const [factProgress, setFactProgress] = useState<UserFactProgress[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadedProgress = factProgressStorage.load();
    setFactProgress(loadedProgress);
    setInitialized(true);
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (initialized && factProgress.length > 0) {
      factProgressStorage.save(factProgress);
    }
  }, [factProgress, initialized]);

  const saveProgress = (progress: UserFactProgress[]) => {
    setFactProgress(progress);
    // Explicitly save to localStorage for immediate persistence
    factProgressStorage.save(progress);
    console.log('Explicitly saved fact progress:', progress);
  };

  const markFactAsViewed = (factId: number) => {
    console.log('Marking fact as viewed:', factId);
    const now = new Date();
    const existingProgress = factProgress.find(p => p.factId === factId);
    
    if (existingProgress) {
      const updatedProgress = factProgress.map(p => 
        p.factId === factId 
          ? { ...p, viewCount: p.viewCount + 1, lastViewed: now }
          : p
      );
      saveProgress(updatedProgress);
      console.log('Updated existing fact progress');
    } else {
      const newProgress: UserFactProgress = {
        factId,
        status: 'viewed',
        viewCount: 1,
        quizAttempts: 0,
        correctAnswers: 0,
        lastViewed: now,
        firstViewed: now
      };
      saveProgress([...factProgress, newProgress]);
      console.log('Created new fact progress entry');
    }
  };

  const markQuizAttempt = (factId: number, isCorrect: boolean) => {
    console.log('Marking quiz attempt:', factId, 'correct:', isCorrect);
    const now = new Date();
    const existingProgress = factProgress.find(p => p.factId === factId);
    
    if (existingProgress) {
      const newCorrectAnswers = existingProgress.correctAnswers + (isCorrect ? 1 : 0);
      const newQuizAttempts = existingProgress.quizAttempts + 1;
      let newStatus = existingProgress.status;
      
      // Only mark as mastered if correct on first quiz attempt
      if (existingProgress.quizAttempts === 0 && isCorrect) {
        newStatus = 'mastered';
      } else if (existingProgress.quizAttempts === 0) {
        newStatus = 'quizzed';
      }
      
      const updatedProgress = factProgress.map(p => 
        p.factId === factId 
          ? { 
              ...p, 
              quizAttempts: newQuizAttempts,
              correctAnswers: newCorrectAnswers,
              status: newStatus,
              lastViewed: now 
            }
          : p
      );
      saveProgress(updatedProgress);
      console.log('Updated quiz progress');
    } else {
      const newProgress: UserFactProgress = {
        factId,
        status: isCorrect ? 'mastered' : 'quizzed',
        viewCount: 1,
        quizAttempts: 1,
        correctAnswers: isCorrect ? 1 : 0,
        lastViewed: now,
        firstViewed: now
      };
      saveProgress([...factProgress, newProgress]);
      console.log('Created new progress with quiz attempt');
    }
  };

  const getFactProgress = (factId: number) => {
    return factProgress.find(p => p.factId === factId);
  };

  const getFactsToShow = async (allFacts: any[], currentProgress: UserFactProgress[], preferredTopics: string[] = []) => {
    return factSelectionService.getFactsToShow(allFacts, currentProgress, preferredTopics);
  };

  const getViewedFacts = () => {
    return factStatisticsService.getViewedFacts(factProgress);
  };

  const getStatistics = () => {
    return factStatisticsService.getStatistics(factProgress);
  };

  return {
    factProgress,
    markFactAsViewed,
    markQuizAttempt,
    getFactProgress,
    getFactsToShow,
    getViewedFacts,
    getStatistics
  };
};
