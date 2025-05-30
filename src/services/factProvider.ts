
import facts from '@/data/facts';
import { deepseekService, GeneratedFact } from './deepseek';
import { Fact } from '@/data/facts';

export interface ExtendedFact extends Fact {
  isGenerated?: boolean;
}

class FactProvider {
  private generatedFactsCache: Map<string, ExtendedFact[]> = new Map();
  private lastGenerationTime: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  async getAllFacts(): Promise<ExtendedFact[]> {
    return [...facts];
  }

  async getFactsByTopics(preferredTopics: string[], excludeIds: number[] = []): Promise<ExtendedFact[]> {
    // Get static facts first
    const availableStaticFacts = facts.filter(fact => 
      !excludeIds.includes(fact.id) && 
      (preferredTopics.length === 0 || preferredTopics.includes(fact.topic))
    );

    // If we have enough static facts, return them
    if (availableStaticFacts.length >= 3) {
      return availableStaticFacts;
    }

    // Generate additional facts if needed
    const neededCount = 3 - availableStaticFacts.length;
    const generatedFacts = await this.generateFactsForTopics(preferredTopics, neededCount);
    
    return [...availableStaticFacts, ...generatedFacts];
  }

  private async generateFactsForTopics(topics: string[], count: number): Promise<ExtendedFact[]> {
    const cacheKey = topics.join(',') || 'general';
    const now = Date.now();
    const lastGeneration = this.lastGenerationTime.get(cacheKey) || 0;

    // Check if we have cached facts that are still fresh
    if (now - lastGeneration < this.CACHE_DURATION && this.generatedFactsCache.has(cacheKey)) {
      const cached = this.generatedFactsCache.get(cacheKey)!;
      if (cached.length >= count) {
        return cached.slice(0, count);
      }
    }

    try {
      console.log(`Generating ${count} new facts for topics:`, topics);
      const generatedFacts = await deepseekService.generateFacts(topics, count);
      
      // Convert to ExtendedFact format
      const extendedFacts: ExtendedFact[] = generatedFacts.map(fact => ({
        ...fact,
        isGenerated: true
      }));

      // Cache the results
      this.generatedFactsCache.set(cacheKey, extendedFacts);
      this.lastGenerationTime.set(cacheKey, now);

      return extendedFacts;
    } catch (error) {
      console.error('Failed to generate facts, falling back to static facts:', error);
      // Fallback to any available static facts
      return facts.slice(0, count).map(fact => ({ ...fact, isGenerated: false }));
    }
  }

  async generateMoreFactsForTopic(topic: string, count: number = 5): Promise<ExtendedFact[]> {
    try {
      const generatedFacts = await deepseekService.generateFactsByTopic(topic, count);
      return generatedFacts.map(fact => ({
        ...fact,
        isGenerated: true
      }));
    } catch (error) {
      console.error(`Failed to generate facts for topic ${topic}:`, error);
      return [];
    }
  }

  clearCache() {
    this.generatedFactsCache.clear();
    this.lastGenerationTime.clear();
  }
}

export const factProvider = new FactProvider();
