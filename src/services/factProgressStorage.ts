
import { UserFactProgress } from '@/types/factProgress';

const STORAGE_KEY = 'curio-fact-progress';

export const factProgressStorage = {
  load: (): UserFactProgress[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((progress: any) => ({
          ...progress,
          lastViewed: new Date(progress.lastViewed),
          firstViewed: new Date(progress.firstViewed)
        }));
      } catch (error) {
        console.error('Error parsing fact progress:', error);
        return [];
      }
    }
    return [];
  },

  save: (progress: UserFactProgress[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    console.log('Saved fact progress:', progress);
  }
};
