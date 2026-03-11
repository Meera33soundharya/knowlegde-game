import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, Filler, Tooltip, Legend } from 'chart.js';
import { Line, Radar } from 'react-chartjs-2';
import confetti from 'canvas-confetti';
import './BrainQuest.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, Filler, Tooltip, Legend);

// Questions Data
const questionsData = {
    science: [
        { q: "What is the chemical symbol for gold?", a: ["Au", "Ag", "Fe", "Cu"], correct: 0, explain: "Au comes from the Latin word 'aurum' meaning gold." },
        { q: "What planet is known as the Red Planet?", a: ["Mars", "Venus", "Jupiter", "Saturn"], correct: 0, explain: "Mars appears red due to iron oxide on its surface." },
        { q: "What is the speed of light?", a: ["299,792 km/s", "150,000 km/s", "400,000 km/s", "200,000 km/s"], correct: 0, explain: "Light travels at approximately 299,792 kilometers per second." },
        { q: "What is the powerhouse of the cell?", a: ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"], correct: 0, explain: "Mitochondria generate most of the cell's ATP energy." },
        { q: "What is H2O?", a: ["Water", "Oxygen", "Hydrogen", "Helium"], correct: 0, explain: "H2O is the chemical formula for water." },
        { q: "How many bones are in the human body?", a: ["206", "205", "210", "198"], correct: 0, explain: "Adult humans have 206 bones in their skeleton." },
        { q: "What gas do plants absorb from the atmosphere?", a: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Helium"], correct: 0, explain: "Plants absorb CO2 during photosynthesis." },
        { q: "What is the largest organ in the human body?", a: ["Skin", "Liver", "Brain", "Heart"], correct: 0, explain: "The skin is the largest organ, covering the entire body." },
        { q: "What is the center of an atom called?", a: ["Nucleus", "Proton", "Electron", "Neutron"], correct: 0, explain: "The nucleus contains protons and neutrons at the atom's center." },
        { q: "At what temperature does water boil?", a: ["100°C", "90°C", "110°C", "120°C"], correct: 0, explain: "Water boils at 100 degrees Celsius at sea level." }
    ],
    history: [
        { q: "In which year did World War II end?", a: ["1945", "1944", "1946", "1943"], correct: 0, explain: "WWII ended in 1945 with Germany's surrender in May and Japan's in September." },
        { q: "Who was the first President of the United States?", a: ["George Washington", "Thomas Jefferson", "John Adams", "Benjamin Franklin"], correct: 0, explain: "George Washington served as the first U.S. President from 1789-1797." },
        { q: "What year did the Titanic sink?", a: ["1912", "1911", "1913", "1910"], correct: 0, explain: "The Titanic sank on April 15, 1912, on its maiden voyage." },
        { q: "Who painted the Mona Lisa?", a: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"], correct: 0, explain: "Leonardo da Vinci painted the Mona Lisa in the early 16th century." },
        { q: "What ancient wonder was located in Alexandria?", a: ["Lighthouse", "Pyramid", "Gardens", "Statue"], correct: 0, explain: "The Lighthouse of Alexandria was one of the Seven Wonders." },
        { q: "Who discovered America in 1492?", a: ["Christopher Columbus", "Amerigo Vespucci", "Ferdinand Magellan", "Vasco da Gama"], correct: 0, explain: "Columbus reached the Americas in 1492, though Vikings arrived earlier." },
        { q: "What wall fell in 1989?", a: ["Berlin Wall", "Great Wall", "Hadrian's Wall", "Western Wall"], correct: 0, explain: "The Berlin Wall fell on November 9, 1989, reuniting Germany." },
        { q: "Who was the first man on the moon?", a: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "John Glenn"], correct: 0, explain: "Neil Armstrong walked on the moon on July 20, 1969." },
        { q: "In which city was Julius Caesar assassinated?", a: ["Rome", "Athens", "Alexandria", "Carthage"], correct: 0, explain: "Caesar was assassinated in Rome on the Ides of March, 44 BC." },
        { q: "What year did the French Revolution begin?", a: ["1789", "1790", "1788", "1791"], correct: 0, explain: "The French Revolution began in 1789 with the storming of the Bastille." }
    ],
    geography: [
        { q: "What is the capital of France?", a: ["Paris", "London", "Berlin", "Madrid"], correct: 0, explain: "Paris has been the capital of France for over 1,000 years." },
        { q: "What is the largest ocean on Earth?", a: ["Pacific", "Atlantic", "Indian", "Arctic"], correct: 0, explain: "The Pacific Ocean covers about 46% of Earth's water surface." },
        { q: "Which country has the most population?", a: ["India", "China", "USA", "Indonesia"], correct: 0, explain: "India became the most populous country in 2023." },
        { q: "What is the longest river in the world?", a: ["Nile", "Amazon", "Yangtze", "Mississippi"], correct: 0, explain: "The Nile River is approximately 6,650 km long." },
        { q: "On which continent is the Sahara Desert?", a: ["Africa", "Asia", "Australia", "South America"], correct: 0, explain: "The Sahara is the largest hot desert, covering much of North Africa." },
        { q: "What is the smallest country in the world?", a: ["Vatican City", "Monaco", "San Marino", "Liechtenstein"], correct: 0, explain: "Vatican City is only 0.44 square kilometers." },
        { q: "Which mountain is the tallest in the world?", a: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"], correct: 0, explain: "Mount Everest stands at 8,848.86 meters above sea level." },
        { q: "What is the capital of Australia?", a: ["Canberra", "Sydney", "Melbourne", "Brisbane"], correct: 0, explain: "Canberra became the capital in 1908, between Sydney and Melbourne." },
        { q: "How many continents are there?", a: ["7", "6", "5", "8"], correct: 0, explain: "The seven continents are Africa, Antarctica, Asia, Europe, North America, Oceania, and South America." },
        { q: "Which country is home to the Great Barrier Reef?", a: ["Australia", "Indonesia", "Philippines", "Thailand"], correct: 0, explain: "The Great Barrier Reef is off the coast of Queensland, Australia." }
    ],
    sports: [
        { q: "How many players are on a soccer team?", a: ["11", "10", "12", "9"], correct: 0, explain: "Each soccer team has 11 players on the field at a time." },
        { q: "What sport is known as 'the beautiful game'?", a: ["Soccer", "Basketball", "Tennis", "Cricket"], correct: 0, explain: "Soccer is often called 'the beautiful game' due to its elegance." },
        { q: "How many rings are in the Olympic logo?", a: ["5", "4", "6", "3"], correct: 0, explain: "The five rings represent the five inhabited continents." },
        { q: "What country won the first FIFA World Cup?", a: ["Uruguay", "Brazil", "Argentina", "Italy"], correct: 0, explain: "Uruguay won the inaugural World Cup in 1930." },
        { q: "In which sport would you perform a slam dunk?", a: ["Basketball", "Volleyball", "Tennis", "Baseball"], correct: 0, explain: "A slam dunk is a basketball shot where the player jumps and scores." },
        { q: "How many Grand Slam tournaments are in tennis?", a: ["4", "3", "5", "6"], correct: 0, explain: "The four Grand Slams are Australian Open, French Open, Wimbledon, and US Open." },
        { q: "What is the maximum score in a game of ten-pin bowling?", a: ["300", "250", "350", "200"], correct: 0, explain: "A perfect game is 12 strikes in a row, scoring 300 points." },
        { q: "Which country has won the most FIFA World Cups?", a: ["Brazil", "Germany", "Italy", "Argentina"], correct: 0, explain: "Brazil has won the World Cup 5 times." },
        { q: "How long is a marathon?", a: ["42.195 km", "40 km", "45 km", "50 km"], correct: 0, explain: "A marathon is exactly 42.195 kilometers or 26.2 miles." },
        { q: "In which sport is 'love' a score?", a: ["Tennis", "Golf", "Cricket", "Badminton"], correct: 0, explain: "In tennis, 'love' means a score of zero." }
    ],
    entertainment: [
        { q: "Who played Iron Man in the Marvel movies?", a: ["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"], correct: 0, explain: "Robert Downey Jr. portrayed Tony Stark/Iron Man from 2008-2019." },
        { q: "What is the highest-grossing film of all time?", a: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars"], correct: 0, explain: "Avatar holds the record with over $2.9 billion worldwide." },
        { q: "Who sang 'Thriller'?", a: ["Michael Jackson", "Prince", "Madonna", "Whitney Houston"], correct: 0, explain: "Michael Jackson's 'Thriller' was released in 1982." },
        { q: "What is the longest-running TV show?", a: ["The Simpsons", "Friends", "Seinfeld", "Breaking Bad"], correct: 0, explain: "The Simpsons has been on air since 1989." },
        { q: "Who directed 'Jurassic Park'?", a: ["Steven Spielberg", "James Cameron", "George Lucas", "Peter Jackson"], correct: 0, explain: "Steven Spielberg directed Jurassic Park in 1993." },
        { q: "What year was the first iPhone released?", a: ["2007", "2006", "2008", "2005"], correct: 0, explain: "Apple released the first iPhone on June 29, 2007." },
        { q: "Who wrote the Harry Potter series?", a: ["J.K. Rowling", "J.R.R. Tolkien", "C.S. Lewis", "Roald Dahl"], correct: 0, explain: "J.K. Rowling created the Harry Potter universe." },
        { q: "What streaming service created 'Stranger Things'?", a: ["Netflix", "Disney+", "HBO Max", "Amazon Prime"], correct: 0, explain: "Stranger Things premiered on Netflix in 2016." },
        { q: "Who played Jack in the movie 'Titanic'?", a: ["Leonardo DiCaprio", "Brad Pitt", "Tom Cruise", "Johnny Depp"], correct: 0, explain: "Leonardo DiCaprio starred as Jack Dawson in Titanic (1997)." },
        { q: "What band is known for the song 'Bohemian Rhapsody'?", a: ["Queen", "The Beatles", "Led Zeppelin", "Pink Floyd"], correct: 0, explain: "Queen released Bohemian Rhapsody in 1975." }
    ]
};

questionsData.mixed = [
    ...questionsData.science.slice(0, 2),
    ...questionsData.history.slice(0, 2),
    ...questionsData.geography.slice(0, 2),
    ...questionsData.sports.slice(0, 2),
    ...questionsData.entertainment.slice(0, 2)
];

const BrainQuest = ({ onExit }) => {
    const [screen, setScreen] = useState('dashboard'); // dashboard, game, leaderboard
    const [gamePhase, setGamePhase] = useState('category'); // category, quiz, results
    const [playerStats, setPlayerStats] = useState({
        totalScore: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        streak: 0,
        lastPlayed: null,
        categoryStats: {},
        recentGames: [],
        achievements: []
    });

    const [gameState, setGameState] = useState({
        currentCategory: '',
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: 10,
        timer: 15,
        answers: [],
        questionStartTime: null,
        shuffledAnswers: []
    });

    const [feedback, setFeedback] = useState(null);
    const timerRef = useRef(null);

    // Load stats
    useEffect(() => {
        const saved = localStorage.getItem('brainQuestStats');
        if (saved) {
            setPlayerStats(JSON.parse(saved));
        }
    }, []);

    // Save stats
    useEffect(() => {
        if (playerStats.gamesPlayed > 0) {
            localStorage.setItem('brainQuestStats', JSON.stringify(playerStats));
        }
    }, [playerStats]);

    const startGame = (category) => {
        setGameState({
            currentCategory: category,
            currentQuestionIndex: 0,
            score: 0,
            totalQuestions: 10,
            timer: 15,
            answers: [],
            questionStartTime: Date.now(),
            shuffledAnswers: []
        });
        setGamePhase('quiz');
        setFeedback(null);
        loadQuestion(category, 0);
    };

    const loadQuestion = (category, index) => {
        const questionData = questionsData[category][index];
        const shuffled = [...questionData.a].map((answer, i) => ({ answer, originalIndex: i }));
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        setGameState(prev => ({
            ...prev,
            currentCategory: category,
            currentQuestionIndex: index,
            shuffledAnswers: shuffled,
            timer: 15,
            questionStartTime: Date.now()
        }));

        // Start Timer
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setGameState(prev => {
                if (prev.timer <= 1) {
                    clearInterval(timerRef.current);
                    handleAnswer(-1, true); // Time's up
                    return { ...prev, timer: 0 };
                }
                return { ...prev, timer: prev.timer - 1 };
            });
        }, 1000);
    };

    const handleAnswer = (selectedIndex, isTimeUp = false) => {
        clearInterval(timerRef.current);

        const currentQ = questionsData[gameState.currentCategory][gameState.currentQuestionIndex];
        const isCorrect = !isTimeUp && selectedIndex === currentQ.correct;
        const timeTaken = Math.floor((Date.now() - gameState.questionStartTime) / 1000);

        setGameState(prev => {
            const points = isCorrect ? 100 + Math.max(0, 15 - timeTaken) * 5 : 0;
            return {
                ...prev,
                score: prev.score + points,
                answers: [...prev.answers, { correct: isCorrect, time: timeTaken }]
            };
        });

        // Set Feedback
        setFeedback({
            type: isCorrect ? 'correct' : isTimeUp ? 'timeup' : 'wrong',
            correctIndex: currentQ.correct,
            selectedIndex: selectedIndex,
            explanation: currentQ.explain
        });

        // Next Question Delay
        setTimeout(() => {
            setFeedback(null);
            setGameState(prev => {
                const nextIndex = prev.currentQuestionIndex + 1;
                if (nextIndex >= prev.totalQuestions) {
                    endGame(prev);
                    return prev;
                } else {
                    loadQuestion(prev.currentCategory, nextIndex);
                    return prev;
                }
            });
        }, 3000);
    };

    const endGame = (finalState) => {
        setGamePhase('results');
        const correct = finalState.answers.filter(a => a.correct).length;
        const percentage = (correct / finalState.totalQuestions) * 100;

        // Update Stats
        setPlayerStats(prev => {
            const newStats = { ...prev };
            newStats.totalScore += finalState.score;
            newStats.gamesPlayed++;
            if (percentage >= 70) newStats.gamesWon++;

            // Streak logic
            const today = new Date().toDateString();
            if (newStats.lastPlayed !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (newStats.lastPlayed === yesterday.toDateString()) {
                    newStats.streak++;
                } else {
                    newStats.streak = 1;
                }
            }
            newStats.lastPlayed = today;

            // Category Stats
            if (!newStats.categoryStats[finalState.currentCategory]) {
                newStats.categoryStats[finalState.currentCategory] = { played: 0, score: 0 };
            }
            newStats.categoryStats[finalState.currentCategory].played++;
            newStats.categoryStats[finalState.currentCategory].score += finalState.score;

            // Recent Games
            newStats.recentGames.unshift({
                category: finalState.currentCategory,
                score: finalState.score,
                correct: correct,
                total: finalState.totalQuestions,
                date: new Date().toISOString()
            });
            newStats.recentGames = newStats.recentGames.slice(0, 10);

            // Achievements checking omitted for brevity but can be added here

            return newStats;
        });

        if (percentage >= 70) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    // Components for render

    // Performance Chart Data
    const perfChartData = {
        labels: playerStats.recentGames.slice(0, 7).reverse().map((g, i) => `Game ${i + 1}`),
        datasets: [{
            label: 'Score',
            data: playerStats.recentGames.slice(0, 7).reverse().map(g => g.score),
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    // Category Chart Data
    const categories = Object.keys(playerStats.categoryStats);
    const catChartData = {
        labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
        datasets: [{
            label: 'Score',
            data: categories.map(cat => playerStats.categoryStats[cat].score),
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            borderColor: 'rgb(168, 85, 247)',
        }]
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen font-['Poppins'] p-4 text-white">
            <header className="text-center mb-8 animate-slideInDown relative">
                <button onClick={onExit} className="absolute left-0 top-0 text-white/60 hover:text-white transition">
                    ← Back to App
                </button>
                <h1 className="text-6xl font-bold mb-3">🧠 BrainQuest</h1>
                <p className="text-2xl text-purple-200 font-light">Challenge Your Knowledge!</p>
                <div className="mt-4 flex justify-center gap-4 flex-wrap">
                    <button onClick={() => { setScreen('dashboard'); setGamePhase('category'); }} className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full transition">📊 Dashboard</button>
                    <button onClick={() => { setScreen('game'); setGamePhase('category'); }} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-2 rounded-full transition shadow-lg">🎮 Play Game</button>
                    <button onClick={() => { setScreen('leaderboard'); }} className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full transition">🏆 Leaderboard</button>
                </div>
            </header>

            {/* Dashboard Screen */}
            {screen === 'dashboard' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="stat-card rounded-2xl p-6 text-center hover:scale-105 transition cursor-pointer">
                            <div className="text-5xl mb-3">⭐</div>
                            <div className="text-4xl font-bold text-yellow-400">{playerStats.totalScore.toLocaleString()}</div>
                            <div className="text-white/80 text-sm mt-2">Total Score</div>
                        </div>
                        <div className="stat-card rounded-2xl p-6 text-center hover:scale-105 transition cursor-pointer">
                            <div className="text-5xl mb-3">🎮</div>
                            <div className="text-4xl font-bold text-blue-400">{playerStats.gamesPlayed}</div>
                            <div className="text-white/80 text-sm mt-2">Games Played</div>
                        </div>
                        <div className="stat-card rounded-2xl p-6 text-center hover:scale-105 transition cursor-pointer">
                            <div className="text-5xl mb-3">📈</div>
                            <div className="text-4xl font-bold text-green-400">
                                {playerStats.gamesPlayed > 0 ? Math.floor((playerStats.gamesWon / playerStats.gamesPlayed) * 100) : 0}%
                            </div>
                            <div className="text-white/80 text-sm mt-2">Win Rate</div>
                        </div>
                        <div className="stat-card rounded-2xl p-6 text-center hover:scale-105 transition cursor-pointer">
                            <div className="text-5xl mb-3">🔥</div>
                            <div className="text-4xl font-bold text-orange-400">{playerStats.streak}</div>
                            <div className="text-white/80 text-sm mt-2">Day Streak</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="stat-card rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">📊 Performance Over Time</h3>
                            <div className="h-64">
                                <Line data={perfChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'rgba(255,255,255,0.7)' } }, x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'rgba(255,255,255,0.7)' } } }, plugins: { legend: { display: false } } }} />
                            </div>
                        </div>
                        <div className="stat-card rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">🎯 Category Mastery</h3>
                            <div className="h-64">
                                <Radar data={catChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { r: { grid: { color: 'rgba(255,255,255,0.2)' }, pointLabels: { color: 'rgba(255,255,255,0.9)' }, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4">📜 Recent Games</h3>
                        <div className="space-y-3">
                            {playerStats.recentGames.length === 0 ? <p className="text-white/60 text-center">No games played yet.</p> : playerStats.recentGames.map((game, i) => (
                                <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="text-xl font-bold capitalize">{game.category}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-yellow-400 font-bold">{game.score}</div>
                                        <div className="text-xs text-white/60">{game.correct}/{game.total}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Leaderboard Screen */}
            {screen === 'leaderboard' && (
                <div className="max-w-4xl mx-auto stat-card rounded-2xl p-8">
                    <h2 className="text-4xl font-bold text-center mb-8">🏆 Top Players</h2>
                    <div className="space-y-4">
                        {[
                            { rank: 1, name: 'BrainMaster', score: 15420, games: 35 },
                            { rank: 2, name: 'QuizWhiz', score: 13890, games: 32 },
                            { rank: 3, name: 'KnowItAll', score: 12560, games: 28 },
                            { rank: 4, name: 'SmartCookie', score: 11230, games: 25 },
                            { rank: 5, name: 'You', score: playerStats.totalScore, games: playerStats.gamesPlayed },
                            { rank: 6, name: 'TriviaBuff', score: 9870, games: 22 },
                        ].sort((a, b) => b.score - a.score).map((p, idx) => (
                            <div key={idx} className={`flex justify-between items-center p-6 rounded-xl ${p.name === 'You' ? 'bg-purple-500/30 border-2 border-purple-400' : 'bg-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl font-bold">{idx + 1 === 1 ? '🥇' : idx + 1 === 2 ? '🥈' : idx + 1 === 3 ? '🥉' : `#${idx + 1}`}</div>
                                    <div>
                                        <div className="text-lg font-bold">{p.name}</div>
                                        <div className="text-sm text-white/60">{p.games} games</div>
                                    </div>
                                </div>
                                <div className="text-yellow-400 font-bold text-2xl">{p.score.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Game Screen */}
            {screen === 'game' && gamePhase === 'category' && (
                <div className="max-w-7xl mx-auto animate-bounceIn">
                    <h2 className="text-4xl font-bold text-center mb-8">Choose Your Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.keys(questionsData).map(cat => (
                            <div key={cat} onClick={() => startGame(cat)} className="category-card bg-white/10 p-8 rounded-2xl text-center hover:bg-white/20">
                                <h3 className="text-2xl font-bold capitalize mb-2">{cat}</h3>
                                <p className="text-white/60 text-sm">Test your {cat} skills</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {screen === 'game' && gamePhase === 'quiz' && (
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur-lg rounded-2xl p-4">
                        <div className="text-white"><span className="opacity-80">Category:</span> <span className="font-bold capitalize">{gameState.currentCategory}</span></div>
                        <div className="text-2xl font-bold">{gameState.currentQuestionIndex + 1}/{gameState.totalQuestions}</div>
                        <div className="text-3xl font-bold text-yellow-400">{gameState.score}</div>
                    </div>

                    <div className="mb-6 h-3 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500" style={{ width: `${((gameState.currentQuestionIndex) / gameState.totalQuestions) * 100}%` }}></div>
                    </div>

                    <div className="text-center mb-6">
                        <div className="inline-block bg-white/20 rounded-2xl px-8 py-4">
                            <div className="text-sm opacity-80 mb-1">Time Remaining</div>
                            <div className="text-5xl font-bold">{gameState.timer}</div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6">
                        <h3 className="text-2xl font-bold text-center mb-8">{questionsData[gameState.currentCategory][gameState.currentQuestionIndex].q}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {gameState.shuffledAnswers.map((item, idx) => (
                                <button
                                    key={idx}
                                    disabled={feedback !== null}
                                    onClick={() => handleAnswer(item.originalIndex)}
                                    className={`p-6 rounded-xl text-lg font-semibold transition transform border-2 
                                        ${feedback
                                            ? item.originalIndex === questionsData[gameState.currentCategory][gameState.currentQuestionIndex].correct
                                                ? 'correct-answer border-green-500'
                                                : feedback.selectedIndex === item.originalIndex
                                                    ? 'wrong-answer border-red-500'
                                                    : 'bg-white/10 border-white/20 opacity-50'
                                            : 'bg-white/10 hover:scale-105 hover:bg-white/20 border-white/20'
                                        }
                                    `}
                                >
                                    {item.answer}
                                </button>
                            ))}
                        </div>
                    </div>

                    {feedback && (
                        <div className={`text-center p-6 rounded-2xl mb-4 ${feedback.type === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            <div className="text-6xl mb-4">{feedback.type === 'correct' ? '✅' : feedback.type === 'timeup' ? '⏰' : '❌'}</div>
                            <div className="text-2xl font-bold mb-2">{feedback.type === 'correct' ? 'Correct!' : feedback.type === 'timeup' ? "Time's Up!" : 'Wrong!'}</div>
                            <div className="text-white/80">{feedback.explanation}</div>
                        </div>
                    )}
                </div>
            )}

            {screen === 'game' && gamePhase === 'results' && (
                <div className="max-w-4xl mx-auto text-center animate-bounceIn bg-white/10 backdrop-blur-lg rounded-2xl p-12">
                    <div className="text-8xl mb-6 trophy-animation">
                        {(playerStats.recentGames[0]?.correct / playerStats.recentGames[0]?.total * 100) >= 90 ? '🏆' : '🌟'}
                    </div>
                    <h2 className="text-5xl font-bold mb-4">Game Over!</h2>
                    <div className="text-6xl font-bold text-yellow-400 mb-8">{gameState.score} Points</div>

                    <div className="flex gap-4 justify-center">
                        <button onClick={() => { setScreen('game'); setGamePhase('category'); }} className="bg-gradient-to-r from-green-500 to-green-700 px-8 py-4 rounded-xl text-xl font-bold shadow-lg hover:scale-105 transition">🔄 Play Again</button>
                        <button onClick={() => { setScreen('dashboard'); setGamePhase('category'); }} className="bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-4 rounded-xl text-xl font-bold shadow-lg hover:scale-105 transition">📊 View Stats</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrainQuest;
