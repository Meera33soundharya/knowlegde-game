import React, { useState, useEffect } from 'react';
import { Brain, Code, BookOpen, Trophy, ArrowRight, RotateCcw, Check, X, Star } from 'lucide-react';

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
  }
};

const QuizApp = () => {
  const [mode, setMode] = useState('home'); // home, quiz, results, learn
  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  const startQuiz = (cat, diff) => {
    setCategory(cat);
    setDifficulty(diff);
    const questions = questionBank[cat][diff];
    setQuizQuestions(questions);
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers([]);
    setMode('quiz');
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === quizQuestions[currentQuestion].answer;
    if (correct) setScore(score + 1);
    setUserAnswers([...userAnswers, { question: quizQuestions[currentQuestion], selected: answer, correct }]);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setMode('results');
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
  };

  // Home Screen
  if (mode === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 mt-8">
            <div className="flex justify-center mb-4">
              <Brain className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-3">QuizMaster</h1>
            <p className="text-xl text-white/90">Test Your Knowledge & Learn Something New!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Technical Category */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex items-center mb-4">
                <Code className="w-10 h-10 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-800">Technical</h2>
              </div>
              <p className="text-gray-600 mb-6">Programming, computers, networking, and more!</p>

              <div className="space-y-3">
                <button
                  onClick={() => startQuiz('technical', 'easy')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-between"
                >
                  <span>Easy</span>
                  <Star className="w-5 h-5" />
                </button>
                <button
                  onClick={() => startQuiz('technical', 'medium')}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-between"
                >
                  <span>Medium</span>
                  <div className="flex">
                    <Star className="w-5 h-5" />
                    <Star className="w-5 h-5" />
                  </div>
                </button>
                <button
                  onClick={() => startQuiz('technical', 'hard')}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-between"
                >
                  <span>Hard</span>
                  <div className="flex">
                    <Star className="w-5 h-5" />
                    <Star className="w-5 h-5" />
                    <Star className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>

            {/* GK Category */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex items-center mb-4">
                <BookOpen className="w-10 h-10 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-800">General Knowledge</h2>
              </div>
              <p className="text-gray-600 mb-6">Science, history, geography, and reasoning!</p>

              <div className="space-y-3">
                <button
                  onClick={() => startQuiz('gk', 'easy')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-between"
                >
                  <span>Easy</span>
                  <Star className="w-5 h-5" />
                </button>
                <button
                  onClick={() => startQuiz('gk', 'medium')}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-between"
                >
                  <span>Medium</span>
                  <div className="flex">
                    <Star className="w-5 h-5" />
                    <Star className="w-5 h-5" />
                  </div>
                </button>
                <button
                  onClick={() => startQuiz('gk', 'hard')}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-between"
                >
                  <span>Hard</span>
                  <div className="flex">
                    <Star className="w-5 h-5" />
                    <Star className="w-5 h-5" />
                    <Star className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (mode === 'quiz') {
    const question = quizQuestions[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mt-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>Score: {score}/{quizQuestions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {question.options.map((option, idx) => {
                let bgColor = 'bg-gray-100 hover:bg-gray-200';
                if (showExplanation) {
                  if (option === question.answer) {
                    bgColor = 'bg-green-200 border-2 border-green-500';
                  } else if (option === selectedAnswer && option !== question.answer) {
                    bgColor = 'bg-red-200 border-2 border-red-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !showExplanation && handleAnswer(option)}
                    disabled={showExplanation}
                    className={`w-full ${bgColor} text-left p-4 rounded-lg transition font-medium text-gray-800 flex items-center justify-between`}
                  >
                    <span>{option}</span>
                    {showExplanation && option === question.answer && <Check className="w-5 h-5 text-green-600" />}
                    {showExplanation && option === selectedAnswer && option !== question.answer && <X className="w-5 h-5 text-red-600" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-2">Explanation:</h3>
                <p className="text-blue-800">{question.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {showExplanation && (
              <button
                onClick={nextQuestion}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center"
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

  // Results Screen
  if (mode === 'results') {
    const percentage = Math.round((score / quizQuestions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mt-8">
            {/* Trophy and Score */}
            <div className="text-center mb-8">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-2">
                {score}/{quizQuestions.length}
              </div>
              <p className="text-2xl text-gray-600">{percentage}% Correct</p>
            </div>

            {/* Performance Message */}
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6 mb-6 text-center">
              <p className="text-xl font-semibold text-gray-800">
                {percentage >= 80 ? "🎉 Excellent work! You're a master!" :
                  percentage >= 60 ? "👍 Good job! Keep practicing!" :
                    "💪 Keep learning! You'll get better!"}
              </p>
            </div>

            {/* Review Answers */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Review Your Answers:</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {userAnswers.map((answer, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-2 ${answer.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-gray-800 flex-1">Q{idx + 1}: {answer.question.question}</p>
                      {answer.correct ? <Check className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" /> : <X className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />}
                    </div>
                    {!answer.correct && (
                      <div className="text-sm">
                        <p className="text-red-700">Your answer: {answer.selected}</p>
                        <p className="text-green-700">Correct answer: {answer.question.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={resetQuiz}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                <RotateCcw className="inline mr-2 w-5 h-5" />
                New Quiz
              </button>
              <button
                onClick={() => startQuiz(category, difficulty)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Retry Same Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default QuizApp;
