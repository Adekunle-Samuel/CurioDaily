
export interface UserFactProgress {
  factId: number;
  status: 'viewed' | 'quizzed' | 'mastered';
  viewCount: number;
  quizAttempts: number;
  correctAnswers: number;
  lastViewed: Date;
  firstViewed: Date;
}

export interface FactStatistics {
  totalViewed: number;
  totalQuizzed: number;
  totalMastered: number;
  accuracy: number;
}
