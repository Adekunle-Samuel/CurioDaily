
const DEEPSEEK_API_KEY = "sk-565c11442ca640d0bd933c63340b4744";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

export interface GeneratedFact {
  title: string;
  blurb: string;
  topic: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export class DeepseekService {
  private async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a fact generator that creates interesting, educational, and accurate facts with quizzes. Always respond with valid JSON only, no additional text. Focus on lesser-known but verifiable facts that would surprise and educate people.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Deepseek API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Deepseek API request failed:', error);
      throw error;
    }
  }

  async generateFacts(topics: string[], count: number = 3): Promise<GeneratedFact[]> {
    const topicList = topics.length > 0 ? topics.join(', ') : 'science, history, nature, technology, space, animals, culture, geography, psychology, health';
    
    const prompt = `Generate ${count} fascinating and educational facts. Each fact should be unique, surprising, and accurate. Choose diverse topics from: ${topicList}

Requirements:
- Facts should be lesser-known but verifiable
- Each fact should be educational and surprising
- Include diverse topics to ensure variety
- Make facts engaging and memorable
- Include accurate quiz questions

Format as JSON array with this exact structure:
[
  {
    "title": "Engaging fact title (max 80 characters)",
    "blurb": "Detailed explanation of the fact (150-250 words, educational and engaging)",
    "topic": "One of: science, history, nature, technology, space, animals, culture, geography, psychology, health, sports, art, music, literature, mathematics, physics, chemistry, biology, archaeology, astronomy, philosophy, economics, politics, sociology, anthropology, linguistics, medicine",
    "quiz": {
      "question": "Multiple choice question about the fact",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why the answer is correct"
    }
  }
]

Ensure facts are:
- Scientifically accurate and verifiable
- Surprising and lesser-known
- Educational with high learning value
- Diverse across different topics
- Include engaging quizzes that test understanding`;

    try {
      const response = await this.makeRequest(prompt);
      const facts = JSON.parse(response);
      
      // Validate and clean the response
      return facts.map((fact: any, index: number) => ({
        ...fact,
        id: Date.now() + index,
        quiz: fact.quiz || undefined
      }));
    } catch (error) {
      console.error('Failed to generate facts:', error);
      throw new Error('Failed to generate new facts');
    }
  }

  async generateFactsByTopic(topic: string, count: number = 5): Promise<GeneratedFact[]> {
    const prompt = `Generate ${count} fascinating and lesser-known facts specifically about ${topic}.

Requirements for ${topic} facts:
- Focus on surprising, lesser-known aspects of ${topic}
- Ensure facts are verifiable and educational
- Make each fact unique and memorable
- Include accurate and engaging quiz questions
- Vary the difficulty and scope within the topic

Format as JSON array with this exact structure:
[
  {
    "title": "Engaging fact title about ${topic} (max 80 characters)",
    "blurb": "Detailed explanation (150-250 words, educational and engaging)",
    "topic": "${topic}",
    "quiz": {
      "question": "Multiple choice question about the fact",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why the answer is correct"
    }
  }
]

Focus on:
- Lesser-known but verified facts about ${topic}
- Educational and surprising information
- Engaging presentation style
- Accurate quiz questions that test comprehension
- Various aspects and subtopics within ${topic}`;

    try {
      const response = await this.makeRequest(prompt);
      const facts = JSON.parse(response);
      
      return facts.map((fact: any, index: number) => ({
        ...fact,
        id: Date.now() + index,
        quiz: fact.quiz || undefined
      }));
    } catch (error) {
      console.error(`Failed to generate ${topic} facts:`, error);
      throw new Error(`Failed to generate ${topic} facts`);
    }
  }
}

export const deepseekService = new DeepseekService();
