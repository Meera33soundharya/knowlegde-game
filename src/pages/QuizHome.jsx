import React, { useState, useEffect } from 'react';
import LoadingReady from '../components/LoadingReady'
import Background from '../components/Background'
import Dashboard from '../components/Dashboard'
import DashboardPage from './DashboardPage'
import BrainQuest from '../components/BrainQuest'
import InteractiveDashboard from '../components/InteractiveDashboard'
import ModernDashboard from '../components/ModernDashboard'
import { Brain, Code, BookOpen, Trophy, ArrowRight, RotateCcw, Check, X, Star, Loader2, Sparkles, Search, GraduationCap, FileText, Zap, Moon, Sun, History, Download, Clock, Dna, BarChart3 } from 'lucide-react';
import confetti from 'canvas-confetti';

// Helper to call the local server proxy for generative tasks.
async function callGenerate({ prompt = '', type = 'text' } = {}) {
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, type }),
    })
    return await res.json()
  } catch (err) {
    console.error('callGenerate error', err)
    return { error: 'Network error' }
  }
}

// Question Bank
const questionBank = {
  technical: {
    easy: [
      {
        question: "What is a variable in programming?",
        answer: "A variable is a container that stores data values in a program.",
        explanation: "Think of a variable like a labeled box where you can store information. For example, if you write `age = 15`, you're creating a box called 'age' and putting the number 15 inside it.",
        options: ["A container that stores data values", "A type of loop", "A computer processor", "An error message"]
      },
      {
        question: "What does RAM stand for?",
        answer: "Random Access Memory",
        explanation: "RAM is your computer's short-term memory. It temporarily stores the programs and files you're currently using. When you turn off your computer, everything in RAM is cleared.",
        options: ["Random Access Memory", "Read And Modify", "Rapid Application Memory", "Remote Access Module"]
      },
      {
        question: "What is the purpose of a loop in programming?",
        answer: "To repeat a block of code multiple times",
        explanation: "Instead of writing the same code over and over, a loop lets you run it many times automatically. For example, if you want to print 'Hello' 10 times, you can use a loop.",
        options: ["To repeat a block of code multiple times", "To delete variables", "To connect to the internet", "To create graphics"]
      },
      {
        question: "What does HTTP stand for?",
        answer: "HyperText Transfer Protocol",
        explanation: "HTTP is the set of rules that allows your web browser to communicate with websites. When you type a web address, your browser uses HTTP to request the webpage.",
        options: ["HyperText Transfer Protocol", "High Tech Programming Protocol", "Home Transfer Text Protocol", "Hyper Terminal Transport Process"]
      },
      {
        question: "What is the main function of a CPU?",
        answer: "Process instructions and perform calculations",
        explanation: "The CPU is like the brain of the computer. It takes instructions from programs, performs calculations, and tells other parts of the computer what to do.",
        options: ["Process instructions and perform calculations", "Store long-term data", "Display graphics", "Connect to Wi-Fi"]
      }
    ],
    medium: [
      {
        question: "What is the difference between a compiler and an interpreter?",
        answer: "A compiler translates the entire program before execution, an interpreter translates line by line",
        explanation: "A compiler translates an entire book before reading it, while an interpreter translates each sentence as you read. Compiled programs run faster but take time to compile.",
        options: ["A compiler translates the entire program before execution, an interpreter translates line by line", "They are the same thing", "A compiler is faster to start", "An interpreter creates .exe files"]
      },
      {
        question: "In an array with zero-based indexing, what index is the 5th element?",
        answer: "4",
        explanation: "Most programming languages use zero-based indexing, meaning counting starts at 0. So: 1st=0, 2nd=1, 3rd=2, 4th=3, 5th=4.",
        options: ["4", "5", "3", "6"]
      },
      {
        question: "What is the purpose of DNS?",
        answer: "Translate domain names into IP addresses",
        explanation: "DNS works like a phonebook for the internet. When you type 'google.com,' DNS finds the corresponding IP address so your browser knows where to go.",
        options: ["Translate domain names into IP addresses", "Encrypt internet traffic", "Store website files", "Speed up your computer"]
      },
      {
        question: "How many bits are in a byte?",
        answer: "8",
        explanation: "A bit is like a single light switch (0 or 1). A byte is 8 switches together. One byte can represent 256 different values (2⁸).",
        options: ["8", "16", "4", "32"]
      },
      {
        question: "What does an if-else statement do?",
        answer: "Makes decisions by executing different code based on conditions",
        explanation: "An if-else statement is like a fork in the road. If a condition is true, the program takes one path; if false, it takes another.",
        options: ["Makes decisions by executing different code based on conditions", "Loops through data", "Stores variables", "Connects to databases"]
      }
    ],
    hard: [
      {
        question: "What is the time complexity of binary search?",
        answer: "O(log n)",
        explanation: "Binary search eliminates half the search space in each step. For 1000 items, you need at most 10 comparisons (2¹⁰ = 1024), making it much faster than linear search.",
        options: ["O(log n)", "O(n)", "O(n²)", "O(1)"]
      },
      {
        question: "What typically causes a stack overflow error?",
        answer: "Infinite recursion or excessive function calls",
        explanation: "Each function call adds a frame to the stack. If a recursive function never reaches its base case, it keeps calling itself infinitely until the stack runs out of memory.",
        options: ["Infinite recursion or excessive function calls", "Too many variables", "Slow internet", "Large file downloads"]
      },
      {
        question: "What is the first step in TCP three-way handshake?",
        answer: "Client sends SYN",
        explanation: "TCP handshake: Client sends SYN ('Can we talk?'), Server responds SYN-ACK ('Yes, I heard you'), Client sends ACK ('I hear you too'). This ensures reliable connection.",
        options: ["Client sends SYN", "Server sends ACK", "Client sends data", "Server sends SYN"]
      },
      {
        question: "What is the main difference between a process and a thread?",
        answer: "A process has its own memory space, threads share memory",
        explanation: "A process is like a complete application. Threads are multiple workers within that application doing different tasks simultaneously while sharing resources.",
        options: ["A process has its own memory space, threads share memory", "Threads are slower than processes", "Processes can't run simultaneously", "They are the same thing"]
      },
      {
        question: "How can hash collisions be resolved?",
        answer: "Using chaining or open addressing",
        explanation: "In chaining, each hash table slot contains a linked list of colliding values. In open addressing, the algorithm finds another empty slot using a specific pattern.",
        options: ["Using chaining or open addressing", "Deleting one value", "Restarting the program", "Ignoring the collision"]
      }
    ]
  },
  gk: {
    easy: [
      {
        question: "What is the largest planet in our solar system?",
        answer: "Jupiter",
        explanation: "Jupiter is a gas giant and is more than twice as massive as all other planets combined. Over 1,300 Earths could fit inside it!",
        options: ["Jupiter", "Saturn", "Earth", "Neptune"]
      },
      {
        question: "Who invented the telephone?",
        answer: "Alexander Graham Bell",
        explanation: "Alexander Graham Bell patented the telephone in 1876, allowing people to talk over long distances for the first time using electrical signals.",
        options: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Benjamin Franklin"]
      },
      {
        question: "What is the capital of France?",
        answer: "Paris",
        explanation: "Paris is the capital and largest city in France, famous for the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral.",
        options: ["Paris", "London", "Berlin", "Rome"]
      },
      {
        question: "How many continents are there?",
        answer: "Seven",
        explanation: "The seven continents are: Africa, Antarctica, Asia, Europe, North America, Oceania/Australia, and South America.",
        options: ["Seven", "Five", "Six", "Eight"]
      },
      {
        question: "What gas do plants absorb during photosynthesis?",
        answer: "Carbon dioxide",
        explanation: "Plants take in CO₂ from the air and use sunlight to convert it into food (glucose) and release oxygen, which we breathe.",
        options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"]
      }
    ],
    medium: [
      {
        question: "What is the main product of photosynthesis?",
        answer: "Glucose and oxygen",
        explanation: "Photosynthesis converts sunlight, water, and CO₂ into glucose (food for the plant) and oxygen (which we breathe). It's the base of most food chains.",
        options: ["Glucose and oxygen", "Water and nitrogen", "Carbon dioxide and sugar", "Protein and minerals"]
      },
      {
        question: "Which empire built Machu Picchu?",
        answer: "Inca Empire",
        explanation: "The Incas built Machu Picchu in the 15th century in the Peruvian mountains. It was abandoned during Spanish conquest and rediscovered in 1911.",
        options: ["Inca Empire", "Aztec Empire", "Maya Empire", "Roman Empire"]
      },
      {
        question: "What causes the seasons on Earth?",
        answer: "The tilt of Earth's axis",
        explanation: "Earth's axis is tilted at 23.5°. As Earth orbits the Sun, different parts receive more direct sunlight at different times, creating seasons.",
        options: ["The tilt of Earth's axis", "Distance from the Sun", "The Moon's gravity", "Earth's rotation speed"]
      },
      {
        question: "What is the difference between weather and climate?",
        answer: "Weather is short-term, climate is long-term average",
        explanation: "Weather is daily conditions (sunny today, rainy tomorrow). Climate is the average pattern over 30+ years (tropical, polar, etc.).",
        options: ["Weather is short-term, climate is long-term average", "They are the same", "Climate is always hot", "Weather never changes"]
      },
      {
        question: "Why does a compass needle point north?",
        answer: "Earth's magnetic field",
        explanation: "Earth acts like a giant magnet due to molten iron in its core. A compass needle aligns with Earth's magnetic field, pointing toward the magnetic North Pole.",
        options: ["Earth's magnetic field", "Gravity", "The Sun's pull", "Wind direction"]
      }
    ],
    hard: [
      {
        question: "How does natural selection lead to evolution?",
        answer: "Advantageous traits increase in frequency over generations",
        explanation: "Organisms with better-suited traits survive and reproduce more. Over many generations, these traits become more common in the population, changing it over time.",
        options: ["Advantageous traits increase in frequency over generations", "Animals choose to evolve", "It happens instantly", "Only humans evolve"]
      },
      {
        question: "What triggered World War I?",
        answer: "Assassination of Archduke Franz Ferdinand",
        explanation: "The assassination activated alliance systems (MAIN: Militarism, Alliances, Imperialism, Nationalism), pulling multiple nations into what became a world war.",
        options: ["Assassination of Archduke Franz Ferdinand", "Pearl Harbor attack", "Fall of Berlin Wall", "Stock market crash"]
      },
      {
        question: "How do greenhouse gases cause warming?",
        answer: "They trap heat radiating from Earth's surface",
        explanation: "Sunlight warms Earth, which radiates heat back. Greenhouse gases absorb and re-emit this heat in all directions, including back to Earth, warming the planet.",
        options: ["They trap heat radiating from Earth's surface", "They block sunlight", "They create clouds", "They absorb oxygen"]
      },
      {
        question: "What creates mountains at convergent plate boundaries?",
        answer: "Plates colliding and crust crumpling upward",
        explanation: "When tectonic plates collide, the crust crumples and pushes upward, forming mountains like the Himalayas where the Indian and Eurasian plates meet.",
        options: ["Plates colliding and crust crumpling upward", "Volcanic eruptions only", "Wind erosion", "Meteor impacts"]
      },
      {
        question: "What is deductive reasoning?",
        answer: "Using general principles to reach specific conclusions",
        explanation: "Deductive reasoning: 'All mammals have hair. Whales are mammals. Therefore, whales have hair.' If premises are true, conclusion must be true.",
        options: ["Using general principles to reach specific conclusions", "Guessing randomly", "Using emotions to decide", "Observing patterns only"]
      }
    ]
  },
  "human brain": {
    medium: [
      {
        question: "Which part of the brain controls balance and coordination?",
        answer: "Cerebellum",
        explanation: "The Cerebellum (Latin for 'little brain') is located at the back of the brain and is responsible for fine motor skills, balance, and coordination.",
        options: ["Cerebellum", "Cerebrum", "Brainstem", "Thalamus"]
      },
      {
        question: "What is the largest part of the human brain?",
        answer: "Cerebrum",
        explanation: "The Cerebrum makes up about 85% of the brain's weight and is responsible for higher functions like thinking, speech, and emotion.",
        options: ["Cerebrum", "Cerebellum", "Medulla", "Pons"]
      },
      {
        question: "Which lobe is primarily responsible for vision?",
        answer: "Occipital lobe",
        explanation: "The Occipital lobe is located at the back of the brain and is the visual processing center.",
        options: ["Occipital lobe", "Frontal lobe", "Temporal lobe", "Parietal lobe"]
      },
      {
        question: "What is the name of the cell that transmits information in the brain?",
        answer: "Neuron",
        explanation: "Neurons are the fundamental units of the brain and nervous system, generating electrical signals to transmit information.",
        options: ["Neuron", "Proton", "Electron", "Neutron"]
      },
      {
        question: "Which side of the brain typically controls language?",
        answer: "Left hemisphere",
        explanation: "For most people (especially right-handed individuals), the left hemisphere is dominant for language and speech.",
        options: ["Left hemisphere", "Right hemisphere", "Cerebellum", "Brainstem"]
      }
    ]
  },
  "black holes": {
    medium: [
      { question: "What is the boundary around a black hole called?", answer: "Event Horizon", explanation: "The Event Horizon is the point of no return.", options: ["Event Horizon", "Singularity", "Photon Sphere", "Accretion Disk"] },
      { question: "What lies at the center of a black hole?", answer: "Singularity", explanation: "A point of infinite density where laws of physics break down.", options: ["Singularity", "Core", "Neutron Star", "Void"] }
    ]
  },
  "photosynthesis": {
    medium: [
      { question: "What pigment gives plants their green color?", answer: "Chlorophyll", explanation: "Chlorophyll absorbs light energy for photosynthesis.", options: ["Chlorophyll", "Carotenoid", "Anthocyanin", "Melanin"] },
      { question: "Where does photosynthesis occur in a plant cell?", answer: "Chloroplasts", explanation: "Chloroplasts are the organelles where photosynthesis takes place.", options: ["Chloroplasts", "Mitochondria", "Nucleus", "Ribosomes"] }
    ]
  },
  "ancient egypt": {
    medium: [
      { question: "What structure was built as a tomb for pharaohs?", answer: "Pyramid", explanation: "Pyramids were monumental tombs for Ancient Egyptian rulers.", options: ["Pyramid", "Temple", "Obelisk", "Sphinx"] },
      { question: "Which river was vital to Ancient Egyptian civilization?", answer: "Nile River", explanation: "The Nile provided fertile land for agriculture.", options: ["Nile River", "Amazon River", "Tigris River", "Euphrates River"] }
    ]
  },
  "history": {
    medium: [
      { question: "When did World War II end?", answer: "1945", explanation: "WWII ended in 1945 with the surrender of Germany and Japan.", options: ["1945", "1939", "1918", "1950"] },
      { question: "Who was the first President of the United States?", answer: "George Washington", explanation: "George Washington served from 1789 to 1797.", options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"] }
    ]
  },
  "science": {
    medium: [
      { question: "What is the chemical symbol for Gold?", answer: "Au", explanation: "Au comes from the Latin word 'Aurum'.", options: ["Au", "Ag", "Fe", "Cu"] },
      { question: "What is the hardest natural substance?", answer: "Diamond", explanation: "Diamond is a form of carbon with an extremely rigid structure.", options: ["Diamond", "Gold", "Iron", "Quartz"] }
    ]
  },
  "artificial intelligence": {
    medium: [
      { question: "What does AI stand for?", answer: "Artificial Intelligence", explanation: "Simulating human intelligence in machines.", options: ["Artificial Intelligence", "Automated Interface", "Advanced Input", "Analog Intelligence"] },
      { question: "Which test is used to determine if a machine is intelligent?", answer: "Turing Test", explanation: "Proposed by Alan Turing to test machine's ability to exhibit intelligent behavior.", options: ["Turing Test", "IQ Test", "Voight-Kampff Test", "Rorschach Test"] }
    ]
  }
};

const QuizApp = () => {
  const [mode, setMode] = useState('home'); // home, quiz, results, learn
  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(() => {
    try {
      const saved = localStorage.getItem('studyHubCoins')
      return saved ? parseInt(saved, 10) : 0
    } catch (e) {
      return 0
    }
  });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customTopic, setCustomTopic] = useState("");
  const [studyNotes, setStudyNotes] = useState("");
  const [studyMode, setStudyMode] = useState("quiz"); // 'quiz', 'flashcards', 'notes', 'sprint'
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(20);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('studyHubDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('studyHistory');
      const parsed = saved ? JSON.parse(saved) : [];
      // Sanitize: Ensure array and remove entries with missing topics
      return Array.isArray(parsed) ? parsed.filter(h => h && h.topic) : [];
    } catch (e) {
      console.error("Failed to parse history:", e);
      return [];
    }
  });
  const [historySearch, setHistorySearch] = useState('');
  const [matchPairs, setMatchPairs] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [wrongMatch, setWrongMatch] = useState(null); // New state for mismatch feedback
  const [usedQuestions, setUsedQuestions] = useState(new Set()); // Track used questions
  const [showReady, setShowReady] = useState(true)
  // Show dashboard on open by default for improved UX
  const [showDashboardPage, setShowDashboardPage] = useState(true)
  const [showBrainQuest, setShowBrainQuest] = useState(false)
  const [showInteractiveDashboard, setShowInteractiveDashboard] = useState(false)

  // Mock Generators for Offline Mode
  const generateMockQuestions = (topic) => {
    return Array(5).fill(null).map((_, i) => ({
      question: `(Offline Mode) What involves ${topic} and is related to concept #${i + 1}?`,
      options: shuffleArray([`Concept ${i + 1}`, `Wrong Answer A`, `Wrong Answer B`, `Wrong Answer C`]),
      answer: `Concept ${i + 1}`,
      explanation: `This is a generated placeholder question for "${topic}" because the AI service is currently unavailable. Check your connection to get real questions!`
    }));
  };

  const generateMockNotes = (topic) => {
    return `
# Study Notes: ${topic} (Offline Mode)

**Note:** *These notes are generated in offline mode because the AI service is unavailable.*

## Key Concepts
- **Concept 1:** Fundamental aspect of ${topic}.
- **Concept 2:** Important secondary element.
- **Concept 3:** Advanced application.

## Common Pitfalls
- Misunderstanding the core principle of ${topic}.
- Confusing related terms.

## Summary
${topic} is a broad subject with many interesting applications. To get detailed, specific notes, please ensure your internet connection and API key are working correctly.
    `;
  };

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('studyHubDarkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist history
  useEffect(() => {
    localStorage.setItem('studyHistory', JSON.stringify(history));
  }, [history]);

  const generateQuizOrNotes = (topic) => {
    if (!topic) return;
    if (questionBank[topic.toLowerCase()]) {
      startQuiz(topic.toLowerCase(), 'medium');
    } else {
      generateNotes(topic);
    }
  };

  const saveToHistory = (res) => {
    const newEntry = {
      ...res,
      id: Date.now(),
      timestamp: new Date().toLocaleDateString()
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 10)); // Keep last 10
  };

  // Speed Sprint Timer
  useEffect(() => {
    let timer;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isGameActive) {
      setIsGameActive(false);
      saveToHistory({ topic: category, score, total: quizQuestions.length, mode: 'Sprint' });
      setMode('results');
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft, category, score, quizQuestions.length]);

  // Fisher-Yates Shuffle
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startMatch = async (topic) => {
    setIsLoading(true);
    setError(null);
    setCategory(topic); // Fix: Ensure category is set for history
    setStudyMode('match');
    setMatchPairs([]);
    setMatchedIds([]);
    setSelectedMatch(null);

    // Helper to create pairs from questions
    const createPairsFromQuestions = (questions) => {
      return questions.slice(0, 5).map((q, i) => {
        // Use answer as term, part of explanation as def
        const term = q.answer;
        const def = q.explanation.split('.')[0] + '.'; // First sentence
        return [
          { id: i + 1, text: term, type: 'term' },
          { id: i + 1, text: def, type: 'def' }
        ];
      }).flat();
    };

    try {
      const prompt = `Generate 5 key terms and their concise definitions for the topic: ${topic}. Return as JSON array with id, term, def.`
      const data = await callGenerate({ prompt, type: 'match' })

      if (data && data.pairs) {
        const terms = data.pairs.map(item => ({ id: item.id, text: item.term, type: 'term' }))
        const defs = data.pairs.map(item => ({ id: item.id, text: item.def, type: 'def' }))
        setMatchPairs(shuffleArray([...terms, ...defs]))
        setMode('match')
        return
      }

      const lowerTopic = (topic || '').toLowerCase()
      if (lowerTopic && questionBank[lowerTopic] && questionBank[lowerTopic].medium) {
        const offlinePairs = createPairsFromQuestions(questionBank[lowerTopic].medium)
        setMatchPairs(shuffleArray(offlinePairs))
        setMode('match')
        return
      }

      const mockPairs = [
        { id: 1, text: `${topic} (Basic)`, type: 'term' }, { id: 1, text: 'The fundamental concept.', type: 'def' },
        { id: 2, text: `${topic} (Advanced)`, type: 'term' }, { id: 2, text: 'Complex application.', type: 'def' },
        { id: 3, text: 'Key Theory', type: 'term' }, { id: 3, text: 'Central idea.', type: 'def' },
        { id: 4, text: 'Practice', type: 'term' }, { id: 4, text: 'Application of theory.', type: 'def' },
        { id: 5, text: 'Goal', type: 'term' }, { id: 5, text: 'Desired outcome.', type: 'def' }
      ]
      setMatchPairs(shuffleArray(mockPairs))
      setMode('match')

    } finally {
      setIsLoading(false)
    }
  };

  const handleMatchClick = (item) => {
    // Block clicks if item is matched or if a wrong match is currently showing
    if (matchedIds.includes(item.id) || wrongMatch) return;

    if (!selectedMatch) {
      setSelectedMatch(item);
      return;
    }

    // Deselect if clicking the same card
    if (selectedMatch.id === item.id && selectedMatch.type === item.type) {
      setSelectedMatch(null);
      return;
    }

    if (selectedMatch.type !== item.type && selectedMatch.id === item.id) {
      // Success Match
      const newMatched = [...matchedIds, item.id];
      setMatchedIds(newMatched);
      setSelectedMatch(null);

      if (newMatched.length === matchPairs.length / 2) {
        // Game Won
        setScore(prev => prev + 10);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        saveToHistory({ topic: category, score: 5, total: 5, mode: 'match' });
        setTimeout(() => setMode('results'), 1500);
      }
    } else {
      // Fail - Show mismatch feedback
      setWrongMatch(item);
      setTimeout(() => {
        setSelectedMatch(null);
        setWrongMatch(null);
      }, 1000);
    }
  };

  const generateNotes = async (topic) => {
    setIsLoading(true);
    setError(null);
    try {
      const prompt = `Generate a concise study summary for the topic: "${topic}". Include: Key Definitions, Important Concepts, Common Pitfalls.`
      const data = await callGenerate({ prompt, type: 'notes' })
      if (data && data.text) {
        setStudyNotes(data.text)
      } else {
        setStudyNotes(generateMockNotes(topic))
      }
      setMode('notes')
      setCategory(topic)
    } catch (err) {
      console.error('Generate Notes Error:', err)
      setStudyNotes(generateMockNotes(topic))
      setMode('notes')
      setCategory(topic)
    } finally {
      setIsLoading(false)
    }
  };

  const generateQuestions = async (cat, diff, used = new Set()) => {
    setIsLoading(true);
    setError(null);
    try {
      const timestamp = new Date().getTime();
      const excludedQuestions = Array.from(used).slice(-30).join('; ');
      const prompt = `Generate 10 unique quiz questions. Category: ${cat}. Difficulty: ${diff}. Avoid previous: [${excludedQuestions}]`;

      const data = await callGenerate({ prompt, type: 'questions' })

      let questions = []
      if (data && data.questions) {
        questions = data.questions
      } else if (data && data.text) {
        // try to parse text as JSON
        try { questions = JSON.parse(data.text) } catch (e) { questions = null }
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        // fallback to offline
        const lowerCat = (cat || '').toLowerCase()
        if (lowerCat && questionBank[lowerCat] && questionBank[lowerCat][diff]) {
          const offlineQuestions = questionBank[lowerCat][diff]
          const validOffline = offlineQuestions.filter(q => !used.has(q.question)).map(q => ({ ...q, options: shuffleArray(q.options) }))
          if (validOffline.length > 0) return validOffline
        }

        return generateMockQuestions(cat)
      }

      const newQuestions = questions.filter(q => !used.has(q.question))
      return newQuestions.map(q => ({ ...q, options: shuffleArray(q.options || q.options || []) }))
    } catch (err) {
      console.error("Gemini API Error:", err);
      console.log("Falling back to offline questions");

      const lowerCat = (cat || "").toLowerCase();

      // Fallback to offline questions if they exist, otherwise throw
      if (lowerCat && questionBank[lowerCat] && questionBank[lowerCat][diff]) {
        const offlineQuestions = questionBank[lowerCat][diff];
        const validOffline = offlineQuestions.filter(q => !used.has(q.question)).map(q => ({
          ...q,
          options: shuffleArray(q.options)
        }));

        if (validOffline.length > 0) {
          return validOffline;
        }
        // If all offline questions used, fall through to mock generator
      }

      // If NO offline backup exists (custom topic), use Mock Generator
      console.log("Generating mock questions for:", cat);
      return generateMockQuestions(cat);

    } finally {
      setIsLoading(false);
    }
  };


  const startQuiz = async (cat, diff) => {
    setCategory(cat);
    setDifficulty(diff);
    setMode('loading'); // New mode

    try {
      const questions = await generateQuestions(cat, diff, usedQuestions);

      if (!questions || questions.length === 0) {
        throw new Error("No questions generated. Please try again.");
      }

      setQuizQuestions(questions);

      // Update used questions
      const newUsed = new Set(usedQuestions);
      questions.forEach(q => newUsed.add(q.question));
      setUsedQuestions(newUsed);

      setCurrentQuestion(0);
      setScore(0);
      setUserAnswers([]);
      setMode('quiz');
    } catch (err) {
      console.error("Quiz Start Error:", err);
      // With the new mock generator, we shouldn't really hit this unless something else breaks
      console.error("Quiz Start Error:", err);
      setError(err.message || "Something unexpected went wrong. Starting offline mode.");
      setMode('home');
    }
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === quizQuestions[currentQuestion].answer;
    if (correct) {
      setScore(score + 1);
      setCoins(prev => prev + 1);
    }
    setUserAnswers([...userAnswers, { question: quizQuestions[currentQuestion], selected: answer, correct }]);
    setShowExplanation(true);
  };

  // Persist coins
  useEffect(() => {
    try { localStorage.setItem('studyHubCoins', String(coins)) } catch (e) { }
  }, [coins]);

  // Per-question 20s timer (only for normal quiz mode, not sprint)
  useEffect(() => {
    if (mode !== 'quiz' || studyMode === 'sprint') return;

    setQuestionTimeLeft(20);
    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up: show explanation and record as incorrect
          setShowExplanation(true);
          const q = quizQuestions[currentQuestion]
          if (q) {
            setUserAnswers(prevA => [...prevA, { question: q, selected: null, correct: false }]);
          }
          // schedule auto next question after short delay
          setTimeout(() => {
            try { nextQuestion() } catch (e) { }
          }, 1200);
          return 0;
        }
        return prev - 1;
      })
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, studyMode, currentQuestion, quizQuestions]);

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      if (score === quizQuestions.length && score > 0) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });
      }
      saveToHistory({ topic: category, score, total: quizQuestions.length, mode: studyMode });
      setMode('results');
    }
  };

  const startSprint = async (cat) => {
    setStudyMode('sprint');
    setCategory(cat);
    setDifficulty('medium');
    setMode('loading');
    setTimeLeft(60);
    try {
      const questions = await generateQuestions(cat, 'medium');
      setQuizQuestions(questions);
      setCurrentQuestion(0);
      setScore(0);
      setUserAnswers([]);
      setMode('quiz');
      setIsGameActive(true);
    } catch (err) {
      setError("Sprint failed to start.");
      setMode('home');
    }
  };

  const handleContinue = async () => {
    setMode('loading');
    try {
      const newQuestions = await generateQuestions(category, difficulty, usedQuestions);

      // Update used questions
      const newUsed = new Set(usedQuestions);
      newQuestions.forEach(q => newUsed.add(q.question));
      setUsedQuestions(newUsed);

      setQuizQuestions([...quizQuestions, ...newQuestions]);
      setCurrentQuestion(quizQuestions.length); // Start at the first new question
      setMode('quiz');
    } catch (err) {
      setError("Failed to load more questions.");
      setMode('results'); // Go back to results on error
    }
  };

  const resetQuiz = () => {
    setMode('home');
    setCategory(null);
    setDifficulty(null);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizQuestions([]);
    setUserAnswers([]);
    setError(null);
  };

  if (showReady) {
    return <LoadingReady onFinish={() => setShowReady(false)} />
  }

  if (mode === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Quiz...</h2>
          <p className="text-gray-600 mb-6">
            Asking AI to create unique {difficulty} {category} questions just for you!
            <Sparkles className="inline-block w-4 h-4 ml-1 text-yellow-500" />
          </p>
          <button
            onClick={resetQuiz}
            className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition"
          >
            Cancel and Go Back
          </button>
        </div>
      </div>
    );
  }

  if (showDashboardPage) {
    return (
        <DashboardPage onClose={() => setShowDashboardPage(false)} score={score} total={quizQuestions.length} userAnswers={userAnswers} timeLeft={studyMode === 'sprint' ? timeLeft : questionTimeLeft} history={history} />
      )
  }

  if (showBrainQuest) {
    return <BrainQuest onExit={() => setShowBrainQuest(false)} />
  }

  if (showInteractiveDashboard) {
    return (
      <ModernDashboard
        onClose={() => setShowInteractiveDashboard(false)}
        history={history}
        coins={coins}
      />
    )
  }

  // Home Screen
  if (mode === 'home') {
    return (
      <div className={`min-h-screen transition-colors duration-300 p-6 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500'}`}>
        <Background />
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="relative pt-8 mb-12">
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/20">
                  <div className="bg-yellow-400 p-2 rounded-xl">
                    <Trophy className="w-6 h-6 text-yellow-900" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Total Coins</p>
                    <p className="text-2xl font-black text-white">{coins}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowDashboardPage(true)}
                  className={`p-3 rounded-xl backdrop-blur-md transition-all ${isDarkMode ? 'bg-white/10 text-indigo-300 hover:bg-white/20' : 'bg-black/10 text-white hover:bg-black/20'}`}
                  title={"Open Dashboard"}
                >
                  📊
                </button>

                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-3 rounded-xl backdrop-blur-md transition-all ${isDarkMode ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-black/10 text-white hover:bg-black/20'}`}
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`${isDarkMode ? 'bg-indigo-500/20' : 'bg-white/20'} p-4 rounded-2xl backdrop-blur-sm border ${isDarkMode ? 'border-indigo-500/30' : 'border-white/30'}`}>
                  <GraduationCap className={`w-16 h-16 ${isDarkMode ? 'text-indigo-400' : 'text-white'}`} />
                </div>
              </div>
              <h1 className={`text-5xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-white'}`}>Student Study Hub</h1>
              <p className={`text-xl ${isDarkMode ? 'text-slate-400' : 'text-white/90'}`}>Ace your exams with AI-powered personalized study tools.</p>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 mx-auto max-w-md">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Study Input */}
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} border rounded-3xl shadow-2xl p-8 mb-12 transform hover:scale-[1.01] transition-all duration-300`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              <Search className="w-6 h-6 mr-2 text-indigo-500" />
              What do you want to study today?
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g., Photosynthesis, Calculus, The Civil War..."
                className={`flex-1 text-lg p-4 border-2 rounded-xl outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500' : 'bg-white border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'}`}
                onKeyDown={(e) => e.key === 'Enter' && customTopic && generateQuizOrNotes(customTopic)}
              />
              {/* Unified Search Suggestions */}
              {customTopic && (
                <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                  {(() => {
                    const historyTopics = Array.from(new Set(history.map(h => h.topic).filter(t => t))); // Filter nulls
                    const offlineTopics = Object.keys(questionBank);
                    const allTopics = Array.from(new Set([...historyTopics, ...offlineTopics]));
                    const safeCustomTopic = (customTopic || "").toLowerCase();
                    const filtered = allTopics.filter(t => t && t.toLowerCase().includes(safeCustomTopic) && t.toLowerCase() !== safeCustomTopic);

                    if (filtered.length === 0) return null;

                    return (
                      <div className="py-2">
                        <div className="px-4 py-1 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Previous & Suggested Topics</div>
                        {filtered.map((topic, i) => (
                          <button
                            key={i}
                            onClick={() => setCustomTopic(topic)}
                            className="w-full text-left px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center transition-colors group"
                          >
                            <Search className="w-4 h-4 mr-3 text-gray-400 group-hover:text-indigo-500" />
                            <span className="dark:text-white">{topic}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  if (!customTopic) {
                    setError("Please enter a topic first!");
                    return;
                  }
                  startQuiz(customTopic, 'medium');
                }}
                className={`group p-4 rounded-xl border-2 transition-all text-left ${isDarkMode ? 'border-slate-700 hover:border-indigo-500 hover:bg-slate-700/50' : 'border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                  <Brain className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                </div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Take a Quiz</h3>
                <p className="text-sm text-gray-500">Test your knowledge with dynamic questions.</p>
              </button>

              <button
                onClick={() => {
                  if (!customTopic) {
                    setError("Please enter a topic first!");
                    return;
                  }
                  setStudyMode('flashcards');
                  startQuiz(customTopic, 'medium');
                }}
                className={`group p-4 rounded-xl border-2 transition-all text-left ${isDarkMode ? 'border-slate-700 hover:border-purple-500 hover:bg-slate-700/50' : 'border-purple-100 hover:border-purple-500 hover:bg-purple-50'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                  <Zap className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Flashcards</h3>
                <p className="text-sm text-gray-500">Memorize key terms and definitions.</p>
              </button>

              <button
                onClick={() => {
                  if (!customTopic) {
                    setError("Please enter a topic first!");
                    return;
                  }
                  generateNotes(customTopic);
                }}
                className={`group p-4 rounded-xl border-2 transition-all text-left ${isDarkMode ? 'border-slate-700 hover:border-pink-500 hover:bg-slate-700/50' : 'border-pink-100 hover:border-pink-500 hover:bg-pink-50'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-pink-900/50' : 'bg-pink-100'}`}>
                  <FileText className={`w-6 h-6 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                </div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Study Notes</h3>
                <p className="text-sm text-gray-500">Get an instant AI summary of the topic.</p>
              </button>

              <button
                onClick={() => {
                  if (!customTopic) {
                    setError("Please enter a topic first!");
                    return;
                  }
                  startSprint(customTopic);
                }}
                className={`group p-4 rounded-xl border-2 transition-all text-left ${isDarkMode ? 'border-amber-700 hover:border-amber-500 hover:bg-slate-700/50' : 'border-amber-100 hover:border-amber-500 hover:bg-amber-50'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-amber-900/50' : 'bg-amber-100'}`}>
                  <Trophy className={`w-6 h-6 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                </div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Speed Sprint</h3>
                <p className="text-sm text-gray-500">60 seconds on the clock. Go fast!</p>
              </button>

              <button
                onClick={() => {
                  if (!customTopic) {
                    setError("Please enter a topic first!");
                    return;
                  }
                  setStudyMode('match');
                  startMatch(customTopic);
                }}
                className={`group p-4 rounded-xl border-2 transition-all text-left ${isDarkMode ? 'border-green-700 hover:border-green-500 hover:bg-slate-700/50' : 'border-green-100 hover:border-green-500 hover:bg-green-50'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                  <BookOpen className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Match Game</h3>
                <p className="text-sm text-gray-500">Match terms with their definitions.</p>
              </button>

              <button
                onClick={() => setShowBrainQuest(true)}
                className={`group p-4 rounded-xl border-2 transition-all text-left ${isDarkMode ? 'border-cyan-700 hover:border-cyan-500 hover:bg-slate-700/50' : 'border-cyan-100 hover:border-cyan-500 hover:bg-cyan-50'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-cyan-900/50' : 'bg-cyan-100'}`}>
                  <Dna className={`w-6 h-6 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                </div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Brain Quest</h3>
                <p className="text-sm text-gray-500">Challenge your general knowledge!</p>
              </button>

              <button
                onClick={() => setShowInteractiveDashboard(true)}
                className={`group p-4 rounded-xl border-2 transition-all text-left ${isDarkMode ? 'border-teal-700 hover:border-teal-500 hover:bg-slate-700/50' : 'border-teal-100 hover:border-teal-500 hover:bg-teal-50'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-teal-900/50' : 'bg-teal-100'}`}>
                  <BarChart3 className={`w-6 h-6 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                </div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Analytics Dashboard</h3>
                <p className="text-sm text-gray-500">Track your progress & stats!</p>
              </button>
            </div>
          </div>

          <Dashboard score={score} total={quizQuestions.length} userAnswers={userAnswers} timeLeft={studyMode === 'sprint' ? timeLeft : questionTimeLeft} />

          {/* Recent Activity (History) with Search */}
          {history.length > 0 && (
            <div className={`mb-12 p-8 rounded-3xl ${isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white/10 backdrop-blur-md border border-white/20'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold flex items-center text-white">
                  <History className="w-5 h-5 mr-2" />
                  Recent Activity
                </h2>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search past topics..."
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {history
                  .filter(entry => entry.topic.toLowerCase().includes(historySearch.toLowerCase()))
                  .slice(0, 5)
                  .map((entry) => (
                    <div key={entry.id} className={`flex items-center justify-between p-4 rounded-xl ${isDarkMode ? 'bg-slate-900/50 hover:bg-slate-900' : 'bg-white/20 hover:bg-white/30'} transition-colors group`}>
                      <div className="flex-1">
                        <p className="font-bold text-white mb-0.5">{entry.topic}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/60">{entry.timestamp}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${isDarkMode ? 'bg-indigo-900/80 text-indigo-300' : 'bg-white/20 text-white'}`}>
                            {entry.mode || 'quiz'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                          <p className="font-bold text-white leading-none">{entry.score} / {entry.total}</p>
                          <div className="w-16 bg-black/20 rounded-full h-1 mt-1.5 overflow-hidden">
                            <div
                              className="bg-green-400 h-full rounded-full transition-all duration-1000"
                              style={{ width: `${(entry.score / entry.total) * 100}%` }}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setCustomTopic(entry.topic);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-slate-700 bg-slate-800' : 'hover:bg-white/40 bg-white/20'} text-white`}
                          title="Reuse Topic"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}


          {/* Quick Practice Divider */}
          <div className="relative flex py-5 items-center mb-8">
            <div className={`flex-grow border-t ${isDarkMode ? 'border-slate-700' : 'border-white/30'}`}></div>
            <span className={`flex-shrink-0 mx-4 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-white'}`}>Or try Quick Practice</span>
            <div className={`flex-grow border-t ${isDarkMode ? 'border-slate-700' : 'border-white/30'}`}></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pb-12">
            {/* Technical Category */}
            <div className={`${isDarkMode ? 'bg-slate-800/95 border border-slate-700' : 'bg-white/95'} rounded-2xl p-6`}>
              <div className="flex items-center mb-4">
                <Code className={`w-8 h-8 mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Technical Skills</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startQuiz('technical', 'easy')} className={`flex-1 py-2 rounded-lg font-medium transition ${isDarkMode ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>Easy</button>
                <button onClick={() => startQuiz('technical', 'medium')} className={`flex-1 py-2 rounded-lg font-medium transition ${isDarkMode ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>Medium</button>
                <button onClick={() => startQuiz('technical', 'hard')} className={`flex-1 py-2 rounded-lg font-medium transition ${isDarkMode ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>Hard</button>
              </div>
            </div>

            {/* GK Category */}
            <div className={`${isDarkMode ? 'bg-slate-800/95 border border-slate-700' : 'bg-white/95'} rounded-2xl p-6`}>
              <div className="flex items-center mb-4">
                <BookOpen className={`w-8 h-8 mr-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>General Knowledge</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startQuiz('gk', 'easy')} className={`flex-1 py-2 rounded-lg font-medium transition ${isDarkMode ? 'bg-purple-900/40 text-purple-300 hover:bg-purple-900/60' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>Easy</button>
                <button onClick={() => startQuiz('gk', 'medium')} className={`flex-1 py-2 rounded-lg font-medium transition ${isDarkMode ? 'bg-purple-900/40 text-purple-300 hover:bg-purple-900/60' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>Medium</button>
                <button onClick={() => startQuiz('gk', 'hard')} className={`flex-1 py-2 rounded-lg font-medium transition ${isDarkMode ? 'bg-purple-900/40 text-purple-300 hover:bg-purple-900/60' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>Hard</button>
              </div>
            </div>
          </div>
        </div >
      </div >
    );
  }

  // Study Notes Screen
  if (mode === 'notes') {
    return (
      <div className={`min-h-screen transition-colors duration-300 p-6 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500'}`}>
        <div className="max-w-3xl mx-auto">
          <div className={`bg-white rounded-2xl shadow-2xl p-8 mt-8 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : ''}`}>
            <div className="flex items-center justify-between mb-6 no-print">
              <h2 className={`text-3xl font-bold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                <FileText className="w-8 h-8 text-pink-600 mr-3" />
                Study Notes: {category}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className={`p-2 rounded-lg transition ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="Export as PDF"
                >
                  <Download className="w-6 h-6" />
                </button>
                <button onClick={resetQuiz} className="text-gray-500 hover:text-gray-700">
                  <X className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Visible during print */}
            <div className="hidden print-block mb-6">
              <h1 className="text-4xl font-bold text-black border-b-2 border-gray-300 pb-2 mb-4">Study Notes: {category}</h1>
              <p className="text-sm text-gray-500 italic">Generated by Student Study Hub AI on {new Date().toLocaleDateString()}</p>
            </div>

            <div className={`prose prose-indigo max-w-none p-6 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-gray-50 border-gray-100 text-gray-700'} leading-relaxed`}>
              <div className="whitespace-pre-wrap">
                {studyNotes}
              </div>
            </div>

            <div className="flex gap-4 mt-8 no-print">
              <button
                onClick={() => startQuiz(category, 'medium')}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center"
              >
                <Brain className="mr-2 w-5 h-5" />
                Test Me Now
              </button>
              <button
                onClick={resetQuiz}
                className={`font-bold py-3 px-6 rounded-lg transition ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                Back to Hub
              </button>
            </div>
          </div>
        </div>
        {/* Print Styles */}
        <style>{`
            @media print {
              .no-print { display: none !important; }
              .print-block { display: block !important; }
              body { background: white !important; color: black !important; }
              .min-h-screen { min-height: auto !important; padding: 0 !important; }
              .max-w-3xl { max-width: 100% !important; margin: 0 !important; }
              .shadow-2xl { shadow: none !important; }
              .rounded-2xl { border-radius: 0 !important; }
              .p-8 { padding: 0 !important; }
              .bg-slate-900, .bg-slate-800, .prose { background: transparent !important; color: black !important; }
            }
          `}</style>
      </div>
    );
  }

  // Quiz, Flashcards, or Speed Sprint View
  if (mode === 'quiz' || mode === 'flashcards' || studyMode === 'sprint') {
    const question = quizQuestions[currentQuestion];

    // FLASHCARD VIEW
    if (studyMode === 'flashcards' && mode !== 'results') {
      return (
        <div className={`min-h-screen transition-colors duration-300 p-6 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500'}`}>
          {/* Fixed indicators */}
          <div className="fixed top-4 left-4 z-50">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 text-yellow-300' : 'bg-white/30 text-black'} font-bold`}>🪙 {coins}</div>
          </div>
          <div className="fixed top-4 right-4 z-50">
            <div className={`p-2 rounded-lg ${(studyMode === 'sprint' ? timeLeft : questionTimeLeft) < 6 ? 'bg-red-500 text-white' : (isDarkMode ? 'bg-indigo-900/60 text-indigo-200' : 'bg-white/30 text-black')} font-bold`}>{studyMode === 'sprint' ? timeLeft : questionTimeLeft}s</div>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-transparent mt-8 text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Flashcard {currentQuestion + 1} / {quizQuestions.length}</h2>
            </div>

            <div
              className="relative h-96 w-full cursor-pointer perspective-1000 group"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : '' }}>
                {/* Front */}
                <div className={`absolute w-full h-full backface-hidden rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                  <span className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-4">Question</span>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{question?.question}</h3>
                  <p className="mt-8 text-gray-400 text-sm flex items-center animate-pulse">
                    <RotateCcw className="w-4 h-4 mr-1" /> Tap to flip
                  </p>
                </div>

                {/* Back */}
                <div className={`absolute w-full h-full backface-hidden rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center rotate-y-180 ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-600'}`} style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                  <span className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">Answer</span>
                  <h3 className="text-3xl font-bold text-white mb-6">{question?.answer}</h3>
                  <p className="text-white/90">{question?.explanation}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 justify-center">
              <button
                onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className={`font-bold py-3 px-6 rounded-lg transition flex items-center disabled:opacity-50 ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white/20 hover:bg-white/30 text-white'}`}
              >
                <ArrowRight className="mr-2 w-5 h-5 rotate-180" /> Prev
              </button>
              <button
                onClick={nextQuestion}
                className={`font-bold py-3 px-8 rounded-lg transition flex items-center ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
              >
                {currentQuestion < quizQuestions.length - 1 ? 'Next Card' : 'Finish'} <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 text-center">
              <button onClick={resetQuiz} className={`${isDarkMode ? 'text-slate-400' : 'text-white/70'} hover:text-white underline`}>Exit Flashcards</button>
            </div>
          </div>
        </div>
      );
    }

    // MATCH GAME VIEW
    if (mode === 'match') {
      return (
        <div className={`min-h-screen transition-colors duration-300 p-6 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-teal-500 to-emerald-500'}`}>
          <div className="fixed top-4 left-4 z-50">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 text-yellow-300' : 'bg-white/30 text-black'} font-bold`}>🪙 {coins}</div>
          </div>
          <div className="fixed top-4 right-4 z-50">
            <div className={`p-2 rounded-lg ${(studyMode === 'sprint' ? timeLeft : questionTimeLeft) < 6 ? 'bg-red-500 text-white' : (isDarkMode ? 'bg-indigo-900/60 text-indigo-200' : 'bg-white/30 text-black')} font-bold`}>{studyMode === 'sprint' ? timeLeft : questionTimeLeft}s</div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className={`rounded-2xl shadow-2xl p-8 mt-8 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
              <div className="text-center mb-10">
                <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Vocabulary Match</h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Connect each term with its correct definition</p>
                <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-full font-bold ${isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                  Matched: {matchedIds.length} / {matchPairs.length / 2}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {matchPairs.map((item, idx) => {
                  const isMatched = matchedIds.includes(item.id);
                  const isSelected = (selectedMatch?.text === item.text && selectedMatch?.type === item.type);
                  const isWrong = (wrongMatch?.text === item.text && wrongMatch?.type === item.type) ||
                    (wrongMatch && selectedMatch?.text === item.text && selectedMatch?.type === item.type);

                  let cardStyle = isDarkMode ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200';

                  if (isMatched) {
                    cardStyle = isDarkMode ? 'bg-green-900/40 border-green-500/50 text-green-400 opacity-50 grayscale cursor-default' : 'bg-green-100 border-green-300 text-green-700 opacity-50 grayscale cursor-default';
                  } else if (isWrong) {
                    cardStyle = isDarkMode ? 'bg-red-900/50 border-red-500 text-red-400 shake-animation' : 'bg-red-100 border-red-400 text-red-700 shake-animation';
                  } else if (isSelected) {
                    cardStyle = isDarkMode ? 'bg-indigo-600 border-indigo-400 text-white scale-105 ring-4 ring-indigo-500/30' : 'bg-indigo-500 border-indigo-300 text-white scale-105 ring-4 ring-indigo-500/20';
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleMatchClick(item)}
                      className={`p-6 border-2 rounded-xl transition-all duration-300 flex items-center justify-center text-center font-medium shadow-sm min-h-[120px] cursor-pointer transform ${cardStyle}`}
                    >
                      <span className="text-sm md:text-base leading-tight">{item.text}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-center">
                <button
                  onClick={resetQuiz}
                  className={`px-8 py-3 rounded-xl font-bold transition flex items-center ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <ArrowRight className="w-5 h-5 mr-2 rotate-180" /> Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // NORMAL QUIZ & SPEED SPRINT VIEW
    if (mode !== 'results') {
      return (
        <div className={`min-h-screen transition-colors duration-300 p-6 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'}`}>
          {/* Fixed indicators */}
          <div className="fixed top-4 left-4 z-50">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 text-yellow-300' : 'bg-white/30 text-black'} font-bold`}>🪙 {coins}</div>
          </div>
          <div className="fixed top-4 right-4 z-50">
            <div className={`p-2 rounded-lg ${(studyMode === 'sprint' ? timeLeft : questionTimeLeft) < 6 ? 'bg-red-500 text-white' : (isDarkMode ? 'bg-indigo-900/60 text-indigo-200' : 'bg-white/30 text-black')} font-bold`}>{studyMode === 'sprint' ? timeLeft : questionTimeLeft}s</div>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className={`rounded-2xl shadow-2xl p-8 mt-8 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>

              {/* Header logic for Quiz or Sprint */}
              {studyMode === 'sprint' ? (
                <div className="flex justify-between items-center mb-6">
                  <div className={`px-4 py-2 rounded-full font-bold ${timeLeft < 10 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'} text-white flex items-center`}>
                    <Clock className="w-5 h-5 mr-2" /> {studyMode === 'sprint' ? timeLeft : questionTimeLeft}s
                  </div>
                  <div className={`px-4 py-2 rounded-full font-bold ${isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                    Score: {score}
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className={`flex justify-between text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span>Score: {score}/{quizQuestions.length}</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-200'}`}>
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Question */}
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{question?.question}</h2>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {question?.options.map((option, idx) => {
                  let bgColor = isDarkMode ? 'bg-slate-900 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200';
                  if (showExplanation) {
                    if (option === question.answer) {
                      bgColor = isDarkMode ? 'bg-green-900/50 border-2 border-green-500/50' : 'bg-green-200 border-2 border-green-500';
                    } else if (option === selectedAnswer && option !== question.answer) {
                      bgColor = isDarkMode ? 'bg-red-900/50 border-2 border-red-500/50' : 'bg-red-200 border-2 border-red-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !showExplanation && handleAnswer(option)}
                      disabled={showExplanation}
                      className={`w-full ${bgColor} h-full min-h-[60px] text-left p-4 rounded-xl transition-all transform hover:scale-102 font-medium flex items-center justify-between shadow-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      <span className="mr-2">{option}</span>
                      {showExplanation && option === question.answer && <Check className="w-5 h-5 text-green-500 flex-shrink-0" />}
                      {showExplanation && option === selectedAnswer && option !== question.answer && <X className="w-5 h-5 text-red-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className={`border-l-4 p-4 mb-6 ${isDarkMode ? 'bg-indigo-950 border-indigo-500 text-indigo-200' : 'bg-blue-50 border-blue-500 text-blue-800'}`}>
                  <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-indigo-300' : 'text-blue-900'}`}>Explanation:</h3>
                  <p>{question?.explanation}</p>
                </div>
              )}

              {/* Next Button */}
              {showExplanation && (
                <button
                  onClick={nextQuestion}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center shadow-lg"
                >
                  {currentQuestion < quizQuestions.length - 1 ? (
                    <>Next Question <ArrowRight className="ml-2 w-5 h-5" /></>
                  ) : (
                    <>View Results <Trophy className="ml-2 w-5 h-5" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  // RESULTS SCREEN
  if (mode === 'results') {
    const percentage = Math.round((score / (quizQuestions.length || 1)) * 100);

    return (
      <div className={`min-h-screen transition-colors duration-300 p-6 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'}`}>
        <div className="max-w-3xl mx-auto">
          <div className={`rounded-2xl shadow-2xl p-8 mt-8 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
            {/* Trophy and Score */}
            <div className="text-center mb-8">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {studyMode === 'sprint' ? 'Sprint Complete!' : 'Quiz Complete!'}
              </h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-2">
                {score}{studyMode === 'sprint' ? '' : `/${quizQuestions.length}`}
              </div>
              <p className={`text-2xl ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {studyMode === 'sprint' ? `${score} correct answers` : `${percentage}% Correct`}
              </p>
            </div>

            {/* Performance Message */}
            <div className={`rounded-lg p-6 mb-6 text-center ${isDarkMode ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30' : 'bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-800'}`}>
              <p className="text-xl font-semibold">
                {percentage >= 80 ? "🎉 Excellent work! You're a master!" :
                  percentage >= 60 ? "👍 Good job! Keep practicing!" :
                    "💪 Keep learning! You'll get better!"}
              </p>
            </div>

            {/* Review Answers */}
            {userAnswers.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Review Your Answers:</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {userAnswers.map((answer, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border-2 ${answer.correct
                      ? (isDarkMode ? 'bg-green-900/20 border-green-900/50' : 'bg-green-50 border-green-300')
                      : (isDarkMode ? 'bg-red-900/20 border-red-900/50' : 'bg-red-50 border-red-300')}`}>
                      <div className="flex items-start justify-between mb-2">
                        <p className={`font-semibold flex-1 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Q{idx + 1}: {answer.question.question}</p>
                        {answer.correct ? <Check className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" /> : <X className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />}
                      </div>
                      {!answer.correct && (
                        <div className="text-sm">
                          <p className={isDarkMode ? 'text-red-400' : 'text-red-700'}>Your answer: {answer.selected}</p>
                          <p className={isDarkMode ? 'text-green-400' : 'text-green-700'}>Correct answer: {answer.question.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleContinue}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center text-lg shadow-lg hover:translate-y-[-2px]"
              >
                <Zap className="mr-2 w-6 h-6 text-yellow-300" />
                Continue Practice
              </button>

              <div className="flex gap-4">
                <button
                  onClick={resetQuiz}
                  className={`flex-1 border-2 font-bold py-3 px-6 rounded-xl transition ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : 'bg-white border-indigo-100 text-indigo-700 hover:border-indigo-500'}`}
                >
                  <RotateCcw className="inline mr-2 w-5 h-5" />
                  New Topic
                </button>
                <button
                  onClick={() => {
                    if (studyMode === 'match') {
                      startMatch(category);
                    } else {
                      startQuiz(category, difficulty);
                    }
                  }}
                  className={`flex-1 font-bold py-3 px-6 rounded-xl transition ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default QuizApp;
