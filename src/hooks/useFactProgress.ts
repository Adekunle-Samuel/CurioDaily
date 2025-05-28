
import { useState, useEffect } from 'react';
import { UserFactProgress } from '@/data/facts';

export const useFactProgress = () => {
  const [factProgress, setFactProgress] = useState<UserFactProgress[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('curio-fact-progress');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const progressWithDates = parsed.map((progress: any) => ({
        ...progress,
        lastViewed: new Date(progress.lastViewed),
        firstViewed: new Date(progress.firstViewed)
      }));
      setFactProgress(progressWithDates);
    }
  }, []);

  const saveProgress = (progress: UserFactProgress[]) => {
    setFactProgress(progress);
    localStorage.setItem('curio-fact-progress', JSON.stringify(progress));
  };

  const markFactAsViewed = (factId: number) => {
    const now = new Date();
    const existingProgress = factProgress.find(p => p.factId === factId);
    
    if (existingProgress) {
      const updatedProgress = factProgress.map(p => 
        p.factId === factId 
          ? { ...p, viewCount: p.viewCount + 1, lastViewed: now }
          : p
      );
      saveProgress(updatedProgress);
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
    }
  };

  const markQuizAttempt = (factId: number, isCorrect: boolean) => {
    const now = new Date();
    const existingProgress = factProgress.find(p => p.factId === factId);
    
    if (existingProgress) {
      const newCorrectAnswers = existingProgress.correctAnswers + (isCorrect ? 1 : 0);
      const newQuizAttempts = existingProgress.quizAttempts + 1;
      let newStatus = existingProgress.status;
      
      // Mark as quizzed after first attempt, mastered after 2 correct answers
      if (newQuizAttempts === 1) newStatus = 'quizzed';
      if (newCorrectAnswers >= 2) newStatus = 'mastered';
      
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
    } else {
      const newProgress: UserFactProgress = {
        factId,
        status: isCorrect ? 'quizzed' : 'viewed',
        viewCount: 1,
        quizAttempts: 1,
        correctAnswers: isCorrect ? 1 : 0,
        lastViewed: now,
        firstViewed: now
      };
      saveProgress([...factProgress, newProgress]);
    }
  };

  const getFactProgress = (factId: number) => {
    return factProgress.find(p => p.factId === factId);
  };

  const getFactsToShow = (allFacts: any[], preferredTopics: string[] = []) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get facts that haven't been viewed or haven't been shown recently
    const availableFacts = allFacts.filter(fact => {
      const progress = getFactProgress(fact.id);
      
      if (!progress) return true; // Never viewed
      if (progress.status === 'mastered') return false; // Don't show mastered facts
      
      // Don't show recently viewed facts (30-day cooldown for completed facts)
      if (progress.status === 'quizzed' && progress.lastViewed > thirtyDaysAgo) {
        return false;
      }
      
      return true;
    });
    
    // Prioritize facts from preferred topics
    if (preferredTopics.length > 0) {
      const preferredFacts = availableFacts.filter(fact => 
        preferredTopics.includes(fact.topic)
      );
      const otherFacts = availableFacts.filter(fact => 
        !preferredTopics.includes(fact.topic)
      );
      
      // Mix preferred and other facts (70% preferred, 30% other)
      const shuffledPreferred = [...preferredFacts].sort(() => 0.5 - Math.random());
      const shuffledOther = [...otherFacts].sort(() => 0.5 - Math.random());
      
      const result = [];
      for (let i = 0; i < 3; i++) {
        if (i < 2 && shuffledPreferred.length > 0) {
          result.push(shuffledPreferred.pop()!);
        } else if (shuffledOther.length > 0) {
          result.push(shuffledOther.pop()!);
        } else if (shuffledPreferred.length > 0) {
          result.push(shuffledPreferred.pop()!);
        }
      }
      return result;
    }
    
    // If no preferred topics, return random facts
    return [...availableFacts].sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const getViewedFacts = () => {
    return factProgress.filter(p => p.status !== 'viewed' || p.viewCount > 0);
  };

  const getStatistics = () => {
    const totalViewed = factProgress.length;
    const totalQuizzed = factProgress.filter(p => p.quizAttempts > 0).length;
    const totalMastered = factProgress.filter(p => p.status === 'mastered').length;
    const totalCorrectAnswers = factProgress.reduce((sum, p) => sum + p.correctAnswers, 0);
    const totalQuizAttempts = factProgress.reduce((sum, p) => sum + p.quizAttempts, 0);
    
    return {
      totalViewed,
      totalQuizzed,
      totalMastered,
      accuracy: totalQuizAttempts > 0 ? (totalCorrectAnswers / totalQuizAttempts) * 100 : 0
    };
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
