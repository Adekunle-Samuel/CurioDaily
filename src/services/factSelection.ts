
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
    console.log('Current progress state:', factProgress.length, 'facts viewed');
    
    // Get IDs of facts that have been interacted with
    const viewedFactIds = factProgress.map(p => p.factId);
    
    // Get fresh facts from the provider (which includes both static and generated)
    const availableFacts = await factProvider.getFactsByTopics(preferredTopics, viewedFactIds);
    
    console.log('Available facts after filtering:', availableFacts.length);
    console.log('Topic distribution:', factSelectionService.getTopicDistribution(availableFacts));
    
    // If we don't have enough facts, generate more
    if (availableFacts.length < 10) {
      console.log('Generating more facts due to low availability');
      const topicsToGenerate = preferredTopics.length > 0 ? preferredTopics : factProvider.getAvailableTopics().slice(0, 5);
      
      try {
        await Promise.all(topicsToGenerate.map(topic => 
          factProvider.generateMoreFactsForTopic(topic, 10)
        ));
        
        // Get updated facts
        const updatedFacts = await factProvider.getFactsByTopics(preferredTopics, viewedFactIds);
        return factSelectionService.selectFactsWithVariety(updatedFacts, preferredTopics, 3);
      } catch (error) {
        console.error('Failed to generate additional facts:', error);
      }
    }
    
    return factSelectionService.selectFactsWithVariety(availableFacts, preferredTopics, 3);
  },

  selectFactsWithVariety: (
    availableFacts: ExtendedFact[], 
    preferredTopics: string[], 
    targetCount: number
  ): ExtendedFact[] => {
    if (availableFacts.length === 0) return [];

    console.log(`Selecting ${targetCount} facts from ${availableFacts.length} available facts`);

    // Categorize facts by topic
    const factsByTopic = availableFacts.reduce((acc, fact) => {
      if (!acc[fact.topic]) {
        acc[fact.topic] = [];
      }
      acc[fact.topic].push(fact);
      return acc;
    }, {} as Record<string, ExtendedFact[]>);

    const selectedFacts: ExtendedFact[] = [];

    // Strategy 1: Prioritize preferred topics (if any)
    if (preferredTopics.length > 0) {
      console.log('Prioritizing preferred topics:', preferredTopics);
      const preferredFactsSelected = [];
      
      for (const topic of preferredTopics) {
        const topicFacts = factsByTopic[topic];
        if (topicFacts && topicFacts.length > 0 && preferredFactsSelected.length < Math.min(2, targetCount)) {
          const shuffledTopicFacts = [...topicFacts].sort(() => 0.5 - Math.random());
          preferredFactsSelected.push(shuffledTopicFacts[0]);
          factsByTopic[topic] = topicFacts.filter(f => f.id !== shuffledTopicFacts[0].id);
        }
      }
      selectedFacts.push(...preferredFactsSelected);
      console.log(`Selected ${preferredFactsSelected.length} facts from preferred topics`);
    }

    // Strategy 2: Fill remaining slots with topic variety
    const remainingSlots = targetCount - selectedFacts.length;
    if (remainingSlots > 0) {
      const availableTopics = Object.keys(factsByTopic).filter(topic => {
        const topicFacts = factsByTopic[topic];
        return topicFacts && topicFacts.length > 0;
      });
      
      console.log('Available topics for variety selection:', availableTopics);
      const shuffledTopics = [...availableTopics].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < remainingSlots && shuffledTopics.length > 0; i++) {
        const topicIndex = i % shuffledTopics.length;
        const topic = shuffledTopics[topicIndex];
        const topicFacts = factsByTopic[topic];
        
        if (topicFacts && topicFacts.length > 0) {
          const randomIndex = Math.floor(Math.random() * topicFacts.length);
          const selectedFact = topicFacts[randomIndex];
          selectedFacts.push(selectedFact);
          
          topicFacts.splice(randomIndex, 1);
          
          if (topicFacts.length === 0) {
            shuffledTopics.splice(topicIndex, 1);
          }
        }
      }
    }

    // Strategy 3: Fill any remaining slots randomly if still needed
    if (selectedFacts.length < targetCount) {
      const remainingFacts = Object.values(factsByTopic).flat();
      const shuffledRemaining = [...remainingFacts].sort(() => 0.5 - Math.random());
      const needed = targetCount - selectedFacts.length;
      selectedFacts.push(...shuffledRemaining.slice(0, needed));
    }

    const finalSelection = [...selectedFacts].sort(() => 0.5 - Math.random());
    console.log('Final selection topics:', finalSelection.map(f => f.topic));
    console.log('Final selection details:', finalSelection.map(f => `${f.topic}: ${f.title} ${f.isGenerated ? '(Generated)' : '(Static)'}`));
    
    return finalSelection.slice(0, targetCount);
  },

  getTopicDistribution: (facts: ExtendedFact[]): Record<string, number> => {
    return facts.reduce((acc, fact) => {
      acc[fact.topic] = (acc[fact.topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
};
