
import { useState, useEffect } from 'react';
import { Fact, UserProfile } from '@/data/facts';

export const useGameification = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-1',
    displayName: 'CurioExplorer',
    avatar: '🧠',
    totalXP: 0,
    rank: 1,
    completedFacts: [],
    preferredTopics: []
  });
  
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('curio-user-profile');
    if (stored) {
      setUserProfile(JSON.parse(stored));
    }
    
    // Mock leaderboard data
    setLeaderboard([
      { id: 'user-1', displayName: 'CurioExplorer', avatar: '🧠', totalXP: userProfile.totalXP, rank: 1, completedFacts: [], preferredTopics: [] },
      { id: 'user-2', displayName: 'FactHunter', avatar: '🔍', totalXP: 285, rank: 2, completedFacts: [], preferredTopics: [] },
      { id: 'user-3', displayName: 'KnowledgeSeeker', avatar: '📚', totalXP: 240, rank: 3, completedFacts: [], preferredTopics: [] },
      { id: 'user-4', displayName: 'WisdomWanderer', avatar: '🌟', totalXP: 195, rank: 4, completedFacts: [], preferredTopics: [] },
      { id: 'user-5', displayName: 'LearningLegend', avatar: '🏆', totalXP: 150, rank: 5, completedFacts: [], preferredTopics: [] }
    ]);
  }, [userProfile.totalXP]);

  const completeQuiz = (fact: Fact, isCorrect: boolean) => {
    if (userProfile.completedFacts.includes(fact.id)) return;
    
    const xpGained = isCorrect ? fact.xpValue : Math.floor(fact.xpValue * 0.5);
    const updatedProfile = {
      ...userProfile,
      totalXP: userProfile.totalXP + xpGained,
      completedFacts: [...userProfile.completedFacts, fact.id]
    };
    
    setUserProfile(updatedProfile);
    localStorage.setItem('curio-user-profile', JSON.stringify(updatedProfile));
    
    return { xpGained, isCorrect };
  };

  const getXPProgress = () => {
    const currentLevel = Math.floor(userProfile.totalXP / 100) + 1;
    const xpInCurrentLevel = userProfile.totalXP % 100;
    const xpForNextLevel = 100;
    
    return {
      currentLevel,
      xpInCurrentLevel,
      xpForNextLevel,
      progressPercentage: (xpInCurrentLevel / xpForNextLevel) * 100
    };
  };

  const isFactCompleted = (factId: number) => {
    return userProfile.completedFacts.includes(factId);
  };

  return {
    userProfile,
    leaderboard,
    completeQuiz,
    getXPProgress,
    isFactCompleted
  };
};
