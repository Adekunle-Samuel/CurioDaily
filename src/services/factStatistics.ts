
import { UserFactProgress, FactStatistics } from '@/types/factProgress';

export const factStatisticsService = {
  getStatistics: (factProgress: UserFactProgress[]): FactStatistics => {
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
  },

  getViewedFacts: (factProgress: UserFactProgress[]): UserFactProgress[] => {
    return factProgress.filter(p => p.status !== 'viewed' || p.viewCount > 0);
  }
};
