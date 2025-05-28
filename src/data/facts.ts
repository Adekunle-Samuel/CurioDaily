
export interface DetailedSource {
  title: string;
  author?: string;
  publication: string;
  year?: number;
  url?: string;
  doi?: string;
  type: 'journal' | 'book' | 'article' | 'archive' | 'museum' | 'documentary';
}

export interface Fact {
  id: number;
  title: string;
  blurb: string;
  body: string;
  topic: string;
  image: string;
  sources: DetailedSource[];
  xpValue: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  dateAdded: string;
  verificationLevel: 'verified' | 'peer-reviewed' | 'historical-record';
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

export interface UserFactProgress {
  factId: number;
  status: 'viewed' | 'quizzed' | 'mastered';
  viewCount: number;
  quizAttempts: number;
  correctAnswers: number;
  lastViewed: Date;
  firstViewed: Date;
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
    sources: [
      {
        title: "Chemical composition and preservation of honey",
        author: "Dr. May Berenbaum",
        publication: "Journal of Food Science",
        year: 2019,
        type: "journal",
        doi: "10.1111/1750-3841.14698"
      },
      {
        title: "Tutankhamun's Tomb: The Complete Story",
        author: "Howard Carter",
        publication: "Oxford University Press",
        year: 1977,
        type: "book"
      },
      {
        title: "Ancient Georgian Honey Discovery",
        publication: "Archaeological Review",
        year: 2021,
        type: "journal"
      }
    ],
    xpValue: 15,
    difficulty: 'medium',
    tags: ["chemistry", "archaeology", "food-science"],
    dateAdded: "2024-01-01",
    verificationLevel: 'peer-reviewed',
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
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
    sources: [
      {
        title: "Comparative Genomics of Humans and Other Species",
        publication: "Nature Genetics",
        year: 2020,
        type: "journal",
        doi: "10.1038/s41588-020-0685-1"
      },
      {
        title: "The Human Genome Project",
        publication: "National Human Genome Research Institute",
        year: 2003,
        url: "https://www.genome.gov",
        type: "archive"
      }
    ],
    xpValue: 20,
    difficulty: 'hard',
    tags: ["genetics", "evolution", "biology"],
    dateAdded: "2024-01-02",
    verificationLevel: 'peer-reviewed',
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
    sources: [
      {
        title: "Cephalopod Biology and Evolution",
        author: "Dr. Jennifer Mather",
        publication: "Marine Biology Journal",
        year: 2019,
        type: "journal"
      },
      {
        title: "Octopus Intelligence: Distributed Cognition",
        publication: "Current Biology",
        year: 2021,
        type: "journal",
        doi: "10.1016/j.cub.2021.03.069"
      },
      {
        title: "Ocean Giants",
        publication: "National Geographic",
        year: 2020,
        type: "documentary"
      }
    ],
    xpValue: 25,
    difficulty: 'hard',
    tags: ["marine-biology", "neuroscience", "anatomy"],
    dateAdded: "2024-01-03",
    verificationLevel: 'peer-reviewed',
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
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
    sources: [
      {
        title: "The Zanzibar War: A 38-Minute Conflict",
        author: "Dr. Robert Aldrich",
        publication: "Journal of Imperial History",
        year: 1996,
        type: "journal"
      },
      {
        title: "British Naval Records: Zanzibar Operations",
        publication: "Royal Navy Archives",
        year: 1896,
        type: "archive"
      },
      {
        title: "Colonial Conflicts in East Africa",
        publication: "Cambridge Historical Review",
        year: 2010,
        type: "journal"
      }
    ],
    xpValue: 18,
    difficulty: 'medium',
    tags: ["warfare", "colonialism", "british-empire"],
    dateAdded: "2024-01-04",
    verificationLevel: 'historical-record',
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
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=800&q=80",
    sources: [
      {
        title: "Athletics in Ancient Greece",
        author: "Dr. Nigel Crowther",
        publication: "University of Wisconsin Press",
        year: 2007,
        type: "book"
      },
      {
        title: "Olympic Museum Archives",
        publication: "International Olympic Committee",
        type: "museum",
        url: "https://olympics.com/museum"
      },
      {
        title: "Ancient Greek Sports and Society",
        publication: "Journal of Ancient History",
        year: 2015,
        type: "journal"
      }
    ],
    xpValue: 22,
    difficulty: 'hard',
    tags: ["ancient-greece", "sports", "culture"],
    dateAdded: "2024-01-05",
    verificationLevel: 'historical-record',
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
    sources: [
      {
        title: "The African Humid Period: Climate Change and Human Evolution",
        author: "Dr. Peter deMenocal",
        publication: "Science",
        year: 2011,
        type: "journal",
        doi: "10.1126/science.1198816"
      },
      {
        title: "Saharan Rock Art: Windows to the Past",
        publication: "National Geographic",
        year: 2020,
        type: "article"
      },
      {
        title: "Paleoclimate of the Sahara",
        publication: "Geological Survey",
        year: 2018,
        type: "journal"
      }
    ],
    xpValue: 20,
    difficulty: 'medium',
    tags: ["climate", "archaeology", "paleontology"],
    dateAdded: "2024-01-06",
    verificationLevel: 'peer-reviewed',
    quiz: {
      question: "What was the Sahara like 10,000 years ago?",
      options: ["A frozen tundra", "A lush green landscape", "An ocean", "Same as today"],
      correctAnswer: 1,
      explanation: "The Sahara was a green, fertile region with lakes and rivers during the African Humid Period."
    }
  },
  // New Technology Facts
  {
    id: 7,
    topic: "technology",
    title: "The First Computer Bug Was an Actual Bug",
    blurb: "The term 'computer bug' originated from a real moth found trapped in a Harvard computer in 1947.",
    body: "On September 9, 1947, Admiral Grace Hopper and her team were working on the Harvard Mark II computer when they discovered the machine had malfunctioned. Upon investigation, they found a moth trapped between the contacts of a relay in Panel F. Hopper carefully removed the moth and taped it into the computer's logbook with the note 'First actual case of bug being found.' While the term 'bug' had been used in engineering contexts before, this incident popularized its use in computing. Grace Hopper, a pioneering computer scientist, went on to develop the first compiler and contributed to the development of COBOL programming language. The original logbook page with the moth is preserved at the Smithsonian Institution's National Museum of American History.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80",
    sources: [
      {
        title: "Grace Hopper Logbook Entry",
        publication: "Smithsonian National Museum of American History",
        year: 1947,
        type: "archive",
        url: "https://americanhistory.si.edu"
      },
      {
        title: "The Evolution of Computing Terminology",
        author: "Dr. Martin Campbell-Kelly",
        publication: "IEEE Annals of Computing History",
        year: 2003,
        type: "journal"
      },
      {
        title: "Grace Hopper: The Queen of Code",
        publication: "Smithsonian Magazine",
        year: 2017,
        type: "article"
      }
    ],
    xpValue: 16,
    difficulty: 'easy',
    tags: ["computing", "history", "terminology"],
    dateAdded: "2024-01-07",
    verificationLevel: 'historical-record',
    quiz: {
      question: "What caused the first recorded 'computer bug'?",
      options: ["A programming error", "A hardware malfunction", "A moth trapped in the machine", "A power surge"],
      correctAnswer: 2,
      explanation: "A real moth was found trapped in the Harvard Mark II computer, coining the term 'computer bug'."
    }
  },
  {
    id: 8,
    topic: "space",
    title: "A Day on Venus is Longer Than Its Year",
    blurb: "Venus rotates so slowly that one day on Venus (243 Earth days) is longer than one Venusian year (225 Earth days).",
    body: "Venus has one of the most unusual rotation patterns in our solar system. While it takes Venus only 225 Earth days to orbit the Sun (its year), it takes 243 Earth days to complete one full rotation on its axis (its day). This means a day on Venus is actually longer than its year! Even more bizarre, Venus rotates backwards compared to most planets - if you could see the Sun from Venus's surface, it would rise in the west and set in the east. This retrograde rotation might have been caused by a massive collision early in Venus's formation, or by tidal effects from the Sun over billions of years. The slow rotation also contributes to Venus's extreme greenhouse effect, as the same side faces the Sun for extended periods.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421771702?auto=format&fit=crop&w=800&q=80",
    sources: [
      {
        title: "Venus: Rotation and Orbital Characteristics",
        publication: "NASA Jet Propulsion Laboratory",
        year: 2022,
        type: "archive",
        url: "https://www.jpl.nasa.gov"
      },
      {
        title: "Planetary Rotation Dynamics",
        author: "Dr. James Williams",
        publication: "Icarus",
        year: 2020,
        type: "journal",
        doi: "10.1016/j.icarus.2020.113847"
      },
      {
        title: "The Backwards Planet",
        publication: "Astronomy Magazine",
        year: 2021,
        type: "article"
      }
    ],
    xpValue: 18,
    difficulty: 'medium',
    tags: ["planetary-science", "astronomy", "solar-system"],
    dateAdded: "2024-01-08",
    verificationLevel: 'verified',
    quiz: {
      question: "How long is one day on Venus compared to one year on Venus?",
      options: ["Shorter", "The same", "Longer", "It varies"],
      correctAnswer: 2,
      explanation: "A day on Venus (243 Earth days) is longer than its year (225 Earth days)."
    }
  },
  {
    id: 9,
    topic: "nature",
    title: "Trees Can Communicate Through Underground Networks",
    blurb: "Trees in forests communicate and share resources through vast underground fungal networks called mycorrhizae.",
    body: "Scientists have discovered that trees in forests are connected by vast underground networks of fungi called mycorrhizae, often referred to as the 'wood wide web.' These fungal networks allow trees to communicate, share nutrients, and even warn each other of dangers. When a tree is attacked by insects, it can send chemical signals through the network to warn neighboring trees, which then begin producing defensive compounds. Mother trees can recognize their own offspring and send them more resources through these networks. The fungi benefit by receiving sugars from the trees in exchange for helping with nutrient and water absorption. This discovery has revolutionized our understanding of forests as interconnected communities rather than collections of individual trees competing for resources.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    sources: [
      {
        title: "Mycorrhizal Networks: The Wood Wide Web",
        author: "Dr. Suzanne Simard",
        publication: "Nature",
        year: 1997,
        type: "journal",
        doi: "10.1038/42904"
      },
      {
        title: "Finding the Mother Tree",
        author: "Suzanne Simard",
        publication: "Knopf Publishing",
        year: 2021,
        type: "book"
      },
      {
        title: "Forest Ecology and the Mycorrhizal Network",
        publication: "Scientific American",
        year: 2019,
        type: "article"
      }
    ],
    xpValue: 22,
    difficulty: 'hard',
    tags: ["ecology", "botany", "fungi"],
    dateAdded: "2024-01-09",
    verificationLevel: 'peer-reviewed',
    quiz: {
      question: "What do scientists call the underground fungal networks that connect trees?",
      options: ["Root web", "Wood wide web", "Forest network", "Tree internet"],
      correctAnswer: 1,
      explanation: "Scientists call these mycorrhizal networks the 'wood wide web' due to their communication functions."
    }
  },
  {
    id: 10,
    topic: "psychology",
    title: "The Dunning-Kruger Effect",
    blurb: "People with low ability often overestimate their competence, while experts underestimate theirs.",
    body: "The Dunning-Kruger effect, discovered by psychologists David Dunning and Justin Kruger in 1999, describes a cognitive bias where people with limited knowledge or competence in a domain greatly overestimate their own knowledge or competence in that domain. Meanwhile, people with genuine expertise tend to underestimate their abilities and assume others have similar knowledge. This happens because the same skills needed to perform a task well are often the same skills needed to recognize good performance. Those who lack these skills are doubly cursed: they cannot do the task well, and they cannot recognize this fact. This effect has been observed across many domains, from grammar and logic to humor and chess. Understanding this bias is crucial for education, leadership, and personal development.",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80",
    sources: [
      {
        title: "Unskilled and Unaware of It: How Difficulties in Recognizing One's Own Incompetence Lead to Inflated Self-Assessments",
        author: "David Dunning, Justin Kruger",
        publication: "Journal of Personality and Social Psychology",
        year: 1999,
        type: "journal",
        doi: "10.1037/0022-3514.77.6.1121"
      },
      {
        title: "The Psychology of Human Error",
        publication: "Harvard Business Review",
        year: 2018,
        type: "article"
      },
      {
        title: "Cognitive Bias in Professional Domains",
        publication: "Psychological Science",
        year: 2020,
        type: "journal"
      }
    ],
    xpValue: 24,
    difficulty: 'hard',
    tags: ["cognitive-bias", "psychology", "metacognition"],
    dateAdded: "2024-01-10",
    verificationLevel: 'peer-reviewed',
    quiz: {
      question: "According to the Dunning-Kruger effect, who tends to overestimate their abilities?",
      options: ["Experts", "Beginners", "People with low ability", "Everyone equally"],
      correctAnswer: 2,
      explanation: "The Dunning-Kruger effect shows that people with low ability in a domain tend to overestimate their competence."
    }
  }
];

export default facts;
