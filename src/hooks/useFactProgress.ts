
import { useState, useEffect } from 'react';
import { UserFactProgress } from '@/data/facts';

export const useFactProgress = () => {
  const [factProgress, setFactProgress] = useState<UserFactProgress[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('curio-fact-progress');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const progressWithDates = parsed.map((progress: any) => ({
          ...progress,
          lastViewed: new Date(progress.lastViewed),
          firstViewed: new Date(progress.firstViewed)
        }));
        setFactProgress(progressWithDates);
      } catch (error) {
        console.error('Error parsing fact progress:', error);
        // Initialize with empty array if parsing fails
        setFactProgress([]);
      }
    }
    setInitialized(true);
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (initialized && factProgress.length > 0) {
      localStorage.setItem('curio-fact-progress', JSON.stringify(factProgress));
      console.log('Saved fact progress:', factProgress);
    }
  }, [factProgress, initialized]);

  const saveProgress = (progress: UserFactProgress[]) => {
    setFactProgress(progress);
    // Explicitly save to localStorage for immediate persistence
    localStorage.setItem('curio-fact-progress', JSON.stringify(progress));
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
      
      // Mark as quizzed after first attempt, mastered only if answered correctly on first try
      if (newQuizAttempts === 1) {
        newStatus = isCorrect ? 'mastered' : 'quizzed';
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

  const getFactsToShow = (allFacts: any[], preferredTopics: string[] = []) => {
    console.log('Getting facts to show with improved algorithm');
    console.log('Preferred topics:', preferredTopics);
    console.log('Total facts available:', allFacts.length);
    console.log('Current progress state:', factProgress);
    
    // Filter out facts that have been interacted with
    const availableFacts = allFacts.filter(fact => {
      const progress = getFactProgress(fact.id);
      // Never show facts that have been viewed, quizzed, or mastered
      return !progress || progress.status === undefined;
    });
    
    console.log('Available facts after filtering:', availableFacts.length);
    
    if (availableFacts.length === 0) {
      console.log('No more facts available!');
      return [];
    }

    // Categorize facts by topic
    const factsByTopic = availableFacts.reduce((acc, fact) => {
      if (!acc[fact.topic]) {
        acc[fact.topic] = [];
      }
      acc[fact.topic].push(fact);
      return acc;
    }, {} as Record<string, any[]>);

    console.log('Facts by topic:', Object.keys(factsByTopic).map(topic => 
      `${topic}: ${factsByTopic[topic].length}`
    ));

    const selectedFacts: any[] = [];
    const targetCount = 3;

    // Strategy 1: If user has preferred topics, prioritize them
    if (preferredTopics.length > 0) {
      // Try to get 2 facts from preferred topics
      const preferredFactsSelected = [];
      for (const topic of preferredTopics) {
        if (factsByTopic[topic] && factsByTopic[topic].length > 0 && preferredFactsSelected.length < 2) {
          // Shuffle the facts in this topic
          const shuffledTopicFacts = [...factsByTopic[topic]].sort(() => 0.5 - Math.random());
          preferredFactsSelected.push(shuffledTopicFacts[0]);
          // Remove selected fact from available pool
          factsByTopic[topic] = factsByTopic[topic].filter(f => f.id !== shuffledTopicFacts[0].id);
        }
      }
      selectedFacts.push(...preferredFactsSelected);
      console.log(`Selected ${preferredFactsSelected.length} facts from preferred topics`);
    }

    // Strategy 2: Fill remaining slots with variety from different topics
    const remainingSlots = targetCount - selectedFacts.length;
    if (remainingSlots > 0) {
      // Get all available topics (excluding ones we might have depleted)
      const availableTopics = Object.keys(factsByTopic).filter(topic => 
        factsByTopic[topic].length > 0
      );
      
      // Shuffle topics for variety
      const shuffledTopics = [...availableTopics].sort(() => 0.5 - Math.random());
      
      // Try to get one fact from each different topic for variety
      for (let i = 0; i < remainingSlots && shuffledTopics.length > 0; i++) {
        const topicIndex = i % shuffledTopics.length;
        const topic = shuffledTopics[topicIndex];
        
        if (factsByTopic[topic] && factsByTopic[topic].length > 0) {
          // Pick a random fact from this topic
          const randomIndex = Math.floor(Math.random() * factsByTopic[topic].length);
          const selectedFact = factsByTopic[topic][randomIndex];
          selectedFacts.push(selectedFact);
          
          // Remove from available pool
          factsByTopic[topic].splice(randomIndex, 1);
          
          // If this topic is now empty, remove it from shuffled topics
          if (factsByTopic[topic].length === 0) {
            shuffledTopics.splice(topicIndex, 1);
          }
        }
      }
    }

    // Strategy 3: If we still need more facts, pick randomly from what's left
    if (selectedFacts.length < targetCount) {
      const remainingFacts = Object.values(factsByTopic).flat();
      const shuffledRemaining = [...remainingFacts].sort(() => 0.5 - Math.random());
      const needed = targetCount - selectedFacts.length;
      selectedFacts.push(...shuffledRemaining.slice(0, needed));
    }

    // Final shuffle to avoid predictable ordering
    const finalSelection = [...selectedFacts].sort(() => 0.5 - Math.random());
    
    console.log('Final selection:', finalSelection.map(f => `${f.topic}: ${f.title}`));
    return finalSelection.slice(0, targetCount);
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
