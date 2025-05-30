
import { UserFactProgress } from '@/types/factProgress';
import { factProvider, ExtendedFact } from './factProvider';

export const factSelectionService = {
  getFactsToShow: async (
    allFacts: ExtendedFact[], 
    factProgress: UserFactProgress[], 
    preferredTopics: string[] = []
  ): Promise<ExtendedFact[]> => {
    console.log('Getting facts to show with dynamic generation');
    console.log('Preferred topics:', preferredTopics);
    console.log('Current progress state:', factProgress);
    
    // Get IDs of facts that have been interacted with
    const viewedFactIds = factProgress.map(p => p.factId);
    
    // Filter out facts that have been interacted with
    const availableStaticFacts = allFacts.filter(fact => {
      return !viewedFactIds.includes(fact.id);
    });
    
    console.log('Available static facts after filtering:', availableStaticFacts.length);
    
    // If we have enough facts, use them
    if (availableStaticFacts.length >= 3) {
      return this.selectFactsWithVariety(availableStaticFacts, preferredTopics, 3);
    }
    
    // If we need more facts, get them from the fact provider (which may generate new ones)
    try {
      const facts = await factProvider.getFactsByTopics(preferredTopics, viewedFactIds);
      console.log('Got facts from provider:', facts.length);
      return this.selectFactsWithVariety(facts, preferredTopics, 3);
    } catch (error) {
      console.error('Failed to get facts from provider:', error);
      return [];
    }
  },

  selectFactsWithVariety: (
    availableFacts: ExtendedFact[], 
    preferredTopics: string[], 
    targetCount: number
  ): ExtendedFact[] => {
    if (availableFacts.length === 0) return [];

    // Categorize facts by topic
    const factsByTopic = availableFacts.reduce((acc, fact) => {
      if (!acc[fact.topic]) {
        acc[fact.topic] = [];
      }
      acc[fact.topic].push(fact);
      return acc;
    }, {} as Record<string, ExtendedFact[]>);

    const selectedFacts: ExtendedFact[] = [];

    // Strategy 1: Prioritize preferred topics
    if (preferredTopics.length > 0) {
      const preferredFactsSelected = [];
      for (const topic of preferredTopics) {
        if (factsByTopic[topic] && factsByTopic[topic].length > 0 && preferredFactsSelected.length < 2) {
          const shuffledTopicFacts = [...factsByTopic[topic]].sort(() => 0.5 - Math.random());
          preferredFactsSelected.push(shuffledTopicFacts[0]);
          factsByTopic[topic] = factsByTopic[topic].filter(f => f.id !== shuffledTopicFacts[0].id);
        }
      }
      selectedFacts.push(...preferredFactsSelected);
    }

    // Strategy 2: Fill remaining slots with variety
    const remainingSlots = targetCount - selectedFacts.length;
    if (remainingSlots > 0) {
      const availableTopics = Object.keys(factsByTopic).filter(topic => 
        factsByTopic[topic].length > 0
      );
      
      const shuffledTopics = [...availableTopics].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < remainingSlots && shuffledTopics.length > 0; i++) {
        const topicIndex = i % shuffledTopics.length;
        const topic = shuffledTopics[topicIndex];
        
        if (factsByTopic[topic] && factsByTopic[topic].length > 0) {
          const randomIndex = Math.floor(Math.random() * factsByTopic[topic].length);
          const selectedFact = factsByTopic[topic][randomIndex];
          selectedFacts.push(selectedFact);
          
          factsByTopic[topic].splice(randomIndex, 1);
          
          if (factsByTopic[topic].length === 0) {
            shuffledTopics.splice(topicIndex, 1);
          }
        }
      }
    }

    // Strategy 3: Fill any remaining slots randomly
    if (selectedFacts.length < targetCount) {
      const remainingFacts = Object.values(factsByTopic).flat();
      const shuffledRemaining = [...remainingFacts].sort(() => 0.5 - Math.random());
      const needed = targetCount - selectedFacts.length;
      selectedFacts.push(...shuffledRemaining.slice(0, needed));
    }

    const finalSelection = [...selectedFacts].sort(() => 0.5 - Math.random());
    console.log('Final selection:', finalSelection.map(f => `${f.topic}: ${f.title} ${f.isGenerated ? '(Generated)' : '(Static)'}`));
    
    return finalSelection.slice(0, targetCount);
  }
};
