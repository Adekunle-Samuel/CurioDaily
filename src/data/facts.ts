
export interface Fact {
  id: number;
  title: string;
  blurb: string;
  body: string;
  topic: string;
  image: string;
  sources: string[];
  xpValue: number;
  difficulty: 'easy' | 'medium' | 'hard';
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export interface UserProfile {
  id: string;
  displayName: string;
  avatar: string;
  totalXP: number;
  rank: number;
  completedFacts: number[];
  preferredTopics: string[];
}

const facts: Fact[] = [
  // Science Facts
  {
    id: 1,
    topic: "science",
    title: "Honey Never Spoils",
    blurb: "Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    body: "Honey's unique chemical composition makes it one of the only foods that never spoils. Its low moisture content, high acidity, and hydrogen peroxide production create an environment where bacteria and microorganisms cannot survive. In 1922, archaeologists found pots of honey in King Tutankhamun's tomb that were over 3,000 years old and still perfectly edible. Honey's preservation properties were well known to ancient Egyptians who used it in their embalming practices and as tribute payments. The oldest known honey ever found was in Georgia (the country), dating back about 5,500 years. Honey's remarkable shelf life is a testament to the impressive chemistry behind this natural substance produced by honeybees.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    sources: ["Food Science Journal", "Archaeological Review"],
    xpValue: 15,
    difficulty: 'medium',
    quiz: {
      question: "How long can honey remain edible without spoiling?",
      options: ["1 year", "10 years", "100 years", "Indefinitely"],
      correctAnswer: 3,
      explanation: "Honey never spoils due to its low moisture content and acidic pH that prevent bacterial growth."
    }
  },
  {
    id: 2,
    topic: "science",
    title: "Human DNA and Banana DNA",
    blurb: "Humans share about 60% of their DNA with bananas.",
    body: "It might sound unbelievable, but humans and bananas share approximately 60% of the same DNA. This remarkable fact highlights how all living organisms on Earth are connected through evolution and share common ancestry. The shared genes primarily relate to basic cellular functions that are necessary for all forms of life, such as breaking down sugars and repairing cellular damage. This genetic similarity extends to many other organisms too - humans share about 98.8% of their DNA with chimpanzees, 90% with cats, 80% with cows, and even 70% with sea sponges. These shared genetic codes are evidence of the fundamental unity of life on our planet, where all organisms utilize the same basic molecular machinery.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
    sources: ["National Human Genome Research Institute", "Nature Genetics"],
    xpValue: 20,
    difficulty: 'hard',
    quiz: {
      question: "What percentage of DNA do humans share with bananas?",
      options: ["30%", "45%", "60%", "75%"],
      correctAnswer: 2,
      explanation: "Humans and bananas share about 60% of their DNA, highlighting our evolutionary connections."
    }
  },
  {
    id: 3,
    topic: "science",
    title: "Octopuses Have Three Hearts",
    blurb: "Octopuses have three hearts, nine brains, and blue blood.",
    body: "The octopus is one of the ocean's most extraordinary creatures with a truly alien biology compared to humans. They have three hearts: two pump blood through each of the two gills, while the third pumps blood through the body. Their blood contains the copper-rich protein hemocyanin, which is more efficient than hemoglobin for oxygen transport in cold, low-oxygen environments - and it makes their blood blue. Additionally, octopuses have a distributed nervous system with nine brains - a central brain and eight additional mini-brains, one in each arm. This allows each arm to act somewhat independently, solving problems and reacting to the environment even when disconnected from the central brain. These remarkable adaptations have helped octopuses become one of the most intelligent invertebrate species on Earth, capable of sophisticated problem-solving, tool use, and even recognizing individual human faces.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    sources: ["National Geographic", "Marine Biology Journal"],
    xpValue: 25,
    difficulty: 'hard',
    quiz: {
      question: "How many hearts does an octopus have?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 2,
      explanation: "Octopuses have three hearts - two pump blood to the gills, and one pumps blood to the rest of the body."
    }
  },
  // History Facts
  {
    id: 4,
    topic: "history",
    title: "The Shortest War in History",
    blurb: "The shortest war in history was between Britain and Zanzibar on August 27, 1896. It lasted only 38 minutes.",
    body: "The Anglo-Zanzibar War holds the record for the shortest war in recorded history, lasting a mere 38 minutes. The conflict began on August 27, 1896, when Sultan Khalid bin Barghash seized power after the death of his predecessor, Sultan Hamad bin Thuwaini. The British authorities preferred a different successor, Hamud bin Muhammed, who was more aligned with British interests. The British delivered an ultimatum to Sultan Khalid, demanding he step down. When he refused, the British Royal Navy began bombarding the palace at 9:02 AM. By 9:40 AM, the palace was in ruins, the sultan had fled, and between 500-600 Zanzibari defenders had been killed or wounded, compared to just one British sailor injured. This brief but decisive conflict solidified British colonial control over Zanzibar, which remained a protectorate until gaining independence in 1963.",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80",
    sources: ["Historical Society", "British Naval Archives"],
    xpValue: 18,
    difficulty: 'medium',
    quiz: {
      question: "How long did the shortest war in history last?",
      options: ["15 minutes", "38 minutes", "1 hour", "2 hours"],
      correctAnswer: 1,
      explanation: "The Anglo-Zanzibar War lasted exactly 38 minutes on August 27, 1896."
    }
  },
  {
    id: 5,
    topic: "history",
    title: "Ancient Olympic Games Participants Competed Naked",
    blurb: "In the ancient Olympic Games, athletes competed completely naked.",
    body: "The ancient Olympic Games, which began in 776 BCE in Greece, featured athletes competing entirely nude. The Greek word for 'gymnasium' actually comes from the Greek term 'gymnos' meaning 'naked'. According to historical accounts, the practice began around 720 BCE when a runner named Orsippus of Megara lost his loincloth during a race yet still won. After this, competing naked became the standard. The nudity was considered a tribute to Zeus and a celebration of the male human body. Women were not allowed to participate in or even watch the games (except for the priestess of Demeter). Any married woman caught sneaking into the games would be thrown off a nearby mountain. The ancient games also significantly differed from modern Olympics in other ways - they included events like chariot racing and pankration, an extremely violent combination of boxing and wrestling with minimal rules.",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    sources: ["Olympic Museum", "Ancient Greek History Institute"],
    xpValue: 22,
    difficulty: 'hard',
    quiz: {
      question: "What does the Greek word 'gymnos' mean?",
      options: ["Strong", "Fast", "Naked", "Winner"],
      correctAnswer: 2,
      explanation: "The word 'gymnasium' comes from 'gymnos' meaning 'naked', as ancient Greek athletes competed nude."
    }
  },
  // Geography Facts
  {
    id: 6,
    topic: "geography",
    title: "Sahara Desert Was Once Green",
    blurb: "Around 6,000-10,000 years ago, the Sahara Desert was a lush, green landscape with rivers, lakes, and abundant wildlife.",
    body: "It's hard to imagine when looking at the vast, dry expanse of the Sahara today, but between roughly 12,000 and 5,000 years ago, much of this region was a verdant landscape with lakes, rivers, and thriving ecosystems. This period, known as the African Humid Period, was caused by changes in Earth's orbit that brought more monsoon rainfall to North Africa. Archaeological evidence includes rock art depicting hippos, crocodiles, elephants, and giraffes in areas that are now completely arid. Ancient lake beds have been discovered beneath the sands, and satellite imagery has revealed the ghosts of ancient river systems that once flowed across the region. Human settlements flourished during this time, with evidence of cattle herding, fishing, and pottery making.",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80",
    sources: ["National Geographic", "Geological Survey"],
    xpValue: 20,
    difficulty: 'medium',
    quiz: {
      question: "What was the Sahara like 10,000 years ago?",
      options: ["A frozen tundra", "A lush green landscape", "An ocean", "Same as today"],
      correctAnswer: 1,
      explanation: "The Sahara was a green, fertile region with lakes and rivers during the African Humid Period."
    }
  }
];

export default facts;
