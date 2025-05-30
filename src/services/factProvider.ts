
import facts from '@/data/facts';
import { deepseekService, GeneratedFact } from './deepseek';
import { Fact } from '@/data/facts';

export interface ExtendedFact extends Fact {
  isGenerated?: boolean;
}

// Comprehensive topic list for fact generation
const ALL_TOPICS = [
  'science', 'history', 'nature', 'technology', 'space', 'animals', 
  'culture', 'geography', 'psychology', 'health', 'sports', 'art',
  'music', 'literature', 'mathematics', 'physics', 'chemistry', 
  'biology', 'archaeology', 'astronomy', 'philosophy', 'economics',
  'politics', 'sociology', 'anthropology', 'linguistics', 'medicine'
];

class FactProvider {
  private generatedFactsCache: Map<string, ExtendedFact[]> = new Map();
  private lastGenerationTime: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly FACTS_PER_TOPIC = 50; // Generate 50 facts per topic initially
  private isInitializing = false;
  private initialized = false;

  async getAllFacts(): Promise<ExtendedFact[]> {
    // Ensure we have generated facts for all topics
    await this.ensureFactsGenerated();
    
    // Combine static and generated facts
    const allGenerated = Array.from(this.generatedFactsCache.values()).flat();
    return [...facts, ...allGenerated];
  }

  async getFactsByTopics(preferredTopics: string[], excludeIds: (number | string)[] = []): Promise<ExtendedFact[]> {
    // Ensure we have facts generated
    await this.ensureFactsGenerated();
    
    const topicsToSearch = preferredTopics.length > 0 ? preferredTopics : ALL_TOPICS;
    
    // Get static facts
    const availableStaticFacts = facts.filter(fact => 
      !excludeIds.includes(fact.id) && 
      topicsToSearch.includes(fact.topic)
    );

    // Get generated facts for these topics
    const availableGeneratedFacts: ExtendedFact[] = [];
    for (const topic of topicsToSearch) {
      const topicFacts = this.generatedFactsCache.get(topic) || [];
      const filteredTopicFacts = topicFacts.filter(fact => 
        !excludeIds.includes(fact.id)
      );
      availableGeneratedFacts.push(...filteredTopicFacts);
    }

    // Combine and shuffle
    const allAvailableFacts = [...availableStaticFacts, ...availableGeneratedFacts];
    
    // If we don't have enough facts for the requested topics, generate more
    if (allAvailableFacts.length < 10 && preferredTopics.length > 0) {
      const newFacts = await this.generateMoreFactsForTopics(preferredTopics, 20);
      allAvailableFacts.push(...newFacts);
    }

    return allAvailableFacts;
  }

  private async ensureFactsGenerated(): Promise<void> {
    if (this.initialized || this.isInitializing) {
      return;
    }

    this.isInitializing = true;
    console.log('Initializing fact generation for all topics...');

    try {
      // Generate facts for all topics in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < ALL_TOPICS.length; i += batchSize) {
        const topicBatch = ALL_TOPICS.slice(i, i + batchSize);
        
        const promises = topicBatch.map(async (topic) => {
          // Check if we already have enough facts for this topic
          const existingFacts = this.generatedFactsCache.get(topic) || [];
          if (existingFacts.length >= 20) {
            return;
          }

          try {
            console.log(`Generating facts for topic: ${topic}`);
            const factsToGenerate = Math.max(20 - existingFacts.length, 0);
            const newFacts = await this.generateFactsForTopic(topic, factsToGenerate);
            
            // Add to cache
            const updatedFacts = [...existingFacts, ...newFacts];
            this.generatedFactsCache.set(topic, updatedFacts);
            this.lastGenerationTime.set(topic, Date.now());
            
            console.log(`Generated ${newFacts.length} facts for ${topic}, total: ${updatedFacts.length}`);
          } catch (error) {
            console.error(`Failed to generate facts for topic ${topic}:`, error);
          }
        });

        await Promise.all(promises);
        
        // Small delay between batches to be respectful to the API
        if (i + batchSize < ALL_TOPICS.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      this.initialized = true;
      console.log('Fact generation initialization complete');
    } catch (error) {
      console.error('Error during fact generation initialization:', error);
    } finally {
      this.isInitializing = false;
    }
  }

  private async generateFactsForTopic(topic: string, count: number): Promise<ExtendedFact[]> {
    try {
      const generatedFacts = await deepseekService.generateFactsByTopic(topic, count);
      return generatedFacts.map((fact, index) => ({
        id: `${topic}_${Date.now()}_${index}_${Math.random()}`,
        title: fact.title,
        blurb: fact.blurb,
        body: fact.blurb,
        topic: fact.topic,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        sources: [
          {
            title: "AI Generated Fact",
            publication: "Deepseek AI",
            type: "article" as const,
            year: new Date().getFullYear()
          }
        ],
        xpValue: 15,
        difficulty: 'medium' as const,
        tags: [fact.topic],
        dateAdded: new Date().toISOString().split('T')[0],
        verificationLevel: 'verified' as const,
        quiz: fact.quiz,
        isGenerated: true
      }));
    } catch (error) {
      console.error(`Failed to generate facts for topic ${topic}:`, error);
      return [];
    }
  }

  private async generateMoreFactsForTopics(topics: string[], totalCount: number): Promise<ExtendedFact[]> {
    const factsPerTopic = Math.ceil(totalCount / topics.length);
    const allNewFacts: ExtendedFact[] = [];

    for (const topic of topics) {
      try {
        const newFacts = await this.generateFactsForTopic(topic, factsPerTopic);
        
        // Add to cache
        const existingFacts = this.generatedFactsCache.get(topic) || [];
        const updatedFacts = [...existingFacts, ...newFacts];
        this.generatedFactsCache.set(topic, updatedFacts);
        this.lastGenerationTime.set(topic, Date.now());
        
        allNewFacts.push(...newFacts);
      } catch (error) {
        console.error(`Failed to generate additional facts for topic ${topic}:`, error);
      }
    }

    return allNewFacts;
  }

  async generateMoreFactsForTopic(topic: string, count: number = 10): Promise<ExtendedFact[]> {
    const newFacts = await this.generateFactsForTopic(topic, count);
    
    // Add to cache
    const existingFacts = this.generatedFactsCache.get(topic) || [];
    const updatedFacts = [...existingFacts, ...newFacts];
    this.generatedFactsCache.set(topic, updatedFacts);
    this.lastGenerationTime.set(topic, Date.now());
    
    return newFacts;
  }

  getAvailableTopics(): string[] {
    return ALL_TOPICS;
  }

  getFactCountByTopic(): Record<string, number> {
    const counts: Record<string, number> = {};
    
    // Count static facts
    for (const fact of facts) {
      counts[fact.topic] = (counts[fact.topic] || 0) + 1;
    }
    
    // Count generated facts
    for (const [topic, facts] of this.generatedFactsCache.entries()) {
      counts[topic] = (counts[topic] || 0) + facts.length;
    }
    
    return counts;
  }

  clearCache() {
    this.generatedFactsCache.clear();
    this.lastGenerationTime.clear();
    this.initialized = false;
  }
}

export const factProvider = new FactProvider();
