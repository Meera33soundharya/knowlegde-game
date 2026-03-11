import React, { useState, useEffect } from 'react';
import {
    Brain, Code, BookOpen, Trophy, ArrowRight, RotateCcw, Check, X,
    Loader2, Sparkles, Search, GraduationCap, FileText, Zap,
    Moon, Sun, History, Download, Clock
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import confetti from 'canvas-confetti';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { questionBank } from '../questionBank';

const API_URL = 'http://localhost:5000/api';
const genAI = new GoogleGenerativeAI("AIzaSyDazBhX4I7lVhDSonuYwLOHNTVWbPIx5Ks");

const QuizApp = () => {
    const [mode, setMode] = useState('home');
    const [category, setCategory] = useState(null);
    const [difficulty, setDifficulty] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [customTopic, setCustomTopic] = useState("");
    const [studyNotes, setStudyNotes] = useState("");
    const [studyMode, setStudyMode] = useState("quiz");
    const [timeLeft, setTimeLeft] = useState(60);
    const [isGameActive, setIsGameActive] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('studyHubDarkMode');
        return saved ? JSON.parse(saved) : false;
    });
    const [countdown, setCountdown] = useState(3);

    const [coins, setCoins] = useState(() => {
        // Load coins from local storage or default to 10
        const saved = localStorage.getItem('studyHubCoins');
        return saved ? parseInt(saved) : 10;
    });

    // Persist coins to storage
    useEffect(() => {
        localStorage.setItem('studyHubCoins', coins.toString());
    }, [coins]);

    // Game state variables
    const [matchPairs, setMatchPairs] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [matchedIds, setMatchedIds] = useState([]);
    const [wrongMatch, setWrongMatch] = useState(null);
    const [usedQuestions, setUsedQuestions] = useState(new Set());

    // ... (Mock Generators kept same as before for brevity) ...
    const generateMockQuestions = (topic) => Array(5).fill(null).map((_, i) => ({
        question: `(Offline) Question about ${topic} #${i + 1}?`,
        options: [`Answer ${i + 1}`, `Wrong A`, `Wrong B`, `Wrong C`].sort(() => Math.random() - 0.5),
        answer: `Answer ${i + 1}`,
        explanation: "Offline mode placeholder."
    }));

    const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

    useEffect(() => {
        localStorage.setItem('studyHubDarkMode', JSON.stringify(isDarkMode));
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const saveToBackend = async (data) => {
        try {
            if (data.mode === 'notes') {
                await axios.post(`${API_URL}/study/sessions`, { topic: data.topic, notes: data.notes });
            } else {
                await axios.post(`${API_URL}/quiz/attempts`, {
                    topic: data.topic, score: data.score, total_questions: data.total, difficulty: 'medium'
                });
            }
        } catch (err) { console.error("Save failed:", err); }
    };

    useEffect(() => {
        let timer;
        if (isGameActive && timeLeft > 0) timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
        else if (timeLeft === 0 && isGameActive) {
            setIsGameActive(false);
            saveToBackend({ topic: category, score, total: quizQuestions.length, mode: 'Sprint' });
            setMode('results');
        }
        return () => clearInterval(timer);
    }, [isGameActive, timeLeft]);

    useEffect(() => {
        if (mode === 'countdown' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (mode === 'countdown' && countdown === 0) {
            setMode('quiz');
            if (studyMode === 'sprint') setIsGameActive(true);
        }
    }, [mode, countdown, studyMode]);

    // Generators (generateQuestions, generateNotes, etc. - using condensed logic)
    const generateQuestions = async (cat, diff, used) => {
        // ... (AI logic same as before)
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Generate 10 UNIQUE quiz questions about "${cat}". Difficulty: ${diff}. Json array output only.`;
            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const questions = JSON.parse(text);
            if (!Array.isArray(questions)) throw new Error("Invalid");
            return questions.map(q => ({ ...q, options: shuffleArray(q.options) }));
        } catch (e) {
            console.error(e);
            return generateMockQuestions(cat);
        }
    };

    // Start Standard Quiz Mode
    // Default timer 20s per question is handled in useEffect or via timeLeft logic
    const startQuiz = async (cat, diff) => {
        setCategory(cat);
        setDifficulty(diff);
        setMode('loading');

        let questions = [];
        // Check for offline/GK request specifically or fallback
        if (cat.toLowerCase().includes('general') || cat.toLowerCase().includes('gk')) {
            // Load from local questionBank
            const bank = questionBank.gk[diff] || questionBank.gk['medium'];
            // Pick 5 random questions
            questions = shuffleArray(bank).slice(0, 5);
        } else {
            // Try AI generation
            questions = await generateQuestions(cat, diff, usedQuestions);
        }

        setQuizQuestions(questions);
        setCurrentQuestion(0);
        setScore(0);
        setUserAnswers([]);

        setStudyMode('quiz');
        setTimeLeft(20); // Set 20s timer for the first question
        setCountdown(3);
        setMode('countdown');
    };

    const startSprint = async (cat) => {
        setStudyMode('sprint'); setCategory(cat); setMode('loading'); setTimeLeft(60);
        const questions = await generateQuestions(cat, 'medium', usedQuestions);
        setQuizQuestions(questions); setCurrentQuestion(0); setScore(0); setUserAnswers([]);
        setCountdown(3);
        setMode('countdown');
        // Note: setIsGameActive(true) is now handled in the useEffect after countdown
    };

    const generateQuizOrNotes = (topic) => {
        if (!topic) return;
        startQuiz(topic, 'medium');
    };

    const generateNotes = async (topic) => {
        setMode('loading');
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(`Study notes for ${topic}. Keep it concise.`);
            const notes = result.response.text();
            setStudyNotes(notes); setCategory(topic); setMode('notes');
            saveToBackend({ topic, notes, mode: 'notes' });
        } catch (e) {
            setStudyNotes(`# ${topic}\nOffline notes...`); setMode('notes');
        }
    };

    const generateMatchPairs = async (topic) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Generate 6 term-definition pairs about "${topic}". Return a JSON array of objects with "term" and "definition" keys. Keep definitions concise (max 5 words).`;
            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const rawPairs = JSON.parse(text);

            const gamePairs = [];
            rawPairs.forEach((pair, index) => {
                gamePairs.push({ id: index, text: pair.term, type: 'term' });
                gamePairs.push({ id: index, text: pair.definition, type: 'def' });
            });
            return shuffleArray(gamePairs);
        } catch (e) {
            console.error("Match generation failed", e);
            const fallbackPairs = [
                { id: 1, text: topic, type: 'term' }, { id: 1, text: "Main Subject", type: 'def' },
                { id: 2, text: "Concept", type: 'term' }, { id: 2, text: "Idea", type: 'def' },
                { id: 3, text: "Theory", type: 'term' }, { id: 3, text: "System", type: 'def' },
                { id: 4, text: "Practice", type: 'term' }, { id: 4, text: "Action", type: 'def' }
            ];
            return shuffleArray(fallbackPairs);
        }
    };

    const startMatch = async (topic) => {
        setCategory(topic); setStudyMode('match'); setMode('loading');
        const pairs = await generateMatchPairs(topic);
        setMatchPairs(pairs);
        setMode('match');
    };

    const handleMatchClick = (item) => {
        if (matchedIds.includes(item.id)) return;
        if (!selectedMatch) { setSelectedMatch(item); return; }
        if (selectedMatch.id === item.id && selectedMatch.type !== item.type) {
            setMatchedIds([...matchedIds, item.id]); setSelectedMatch(null);
            if (matchedIds.length + 1 === matchPairs.length / 2) {
                setScore(score + 10); confetti(); saveToBackend({ topic: category, score: 5, total: 5, mode: 'match' }); setTimeout(() => setMode('results'), 1000);
            }
        } else setSelectedMatch(null);
    };

    // Handle user answering a question
    const handleAnswer = (ans) => {
        setSelectedAnswer(ans);
        setShowExplanation(true);
        // Add coin and score if correct
        if (ans === quizQuestions[currentQuestion].answer) {
            setScore(s => s + 1);
            setCoins(c => c + 1); // +1 Coin for correct answer
            confetti({ particleCount: 50, spread: 30, origin: { y: 0.8 } }); // Mini confetti
        }
    };

    // Move to next question or finish quiz
    const nextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(c => c + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
            if (studyMode === 'quiz') setTimeLeft(20); // Reset timer for next question
        } else {
            if (score > 0) confetti();
            saveToBackend({ topic: category, score, total: quizQuestions.length, mode: studyMode });
            setMode('results');
        }
    };

    const resetQuiz = () => { setMode('home'); setCategory(null); setScore(0); setCurrentQuestion(0); setSelectedAnswer(null); setShowExplanation(false); };

    // --- ANIMATED COMPONENTS ---

    if (mode === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Loader2 className="w-16 h-16 text-indigo-600" />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mt-4 text-gray-600 font-medium"
                >
                    AI is crafting your {category} session...
                </motion.p>
            </div>
        );
    }

    if (mode === 'countdown') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl shadow-xl p-10 border border-indigo-50 max-w-4xl mx-auto">
                <motion.div
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1.5, opacity: 1, rotate: 0 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex flex-col items-center"
                >
                    <div className="text-9xl font-black text-indigo-600 mb-4 drop-shadow-lg">
                        {countdown}
                    </div>
                    <p className="text-2xl text-gray-500 font-bold uppercase tracking-widest">
                        {countdown === 1 ? "Get Ready!" : "Starting in..."}
                    </p>
                </motion.div>
            </div>
        );
    }

    if (mode === 'home') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto p-6"
            >
                <div className="bg-white rounded-3xl shadow-xl p-10 border border-indigo-50">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                            <Sparkles className="w-8 h-8 mr-3 text-indigo-600" />
                            What will you master?
                        </h2>
                        {/* Coin Display */}
                        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm">
                            <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-500 flex items-center justify-center text-xs text-white">$</div>
                            {coins} Coins
                        </div>
                    </div>

                    <div className="relative mb-8 group">
                        <input
                            type="text"
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            placeholder="Type a topic (e.g. specialized cells, calculus...)"
                            className="w-full p-5 pl-12 border-2 rounded-2xl outline-none focus:border-indigo-500 text-lg shadow-sm group-hover:shadow-md transition"
                            onKeyDown={(e) => e.key === 'Enter' && customTopic && generateQuizOrNotes(customTopic)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: "Dynamic Quiz", icon: Brain, color: "indigo", func: () => startQuiz(customTopic, 'medium') },
                            { title: "AI Notes", icon: FileText, color: "pink", func: () => generateNotes(customTopic) },
                            { title: "Speed Sprint", icon: Zap, color: "amber", func: () => startSprint(customTopic) },
                            { title: "Match Game", icon: BookOpen, color: "green", func: () => startMatch(customTopic) }
                        ].map((item, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => customTopic ? item.func() : setError('Please enter a topic!')}
                                className={`p-5 bg-${item.color}-50 rounded-2xl text-left border-2 border-${item.color}-100 hover:border-${item.color}-500 transition flex items-center gap-4`}
                            >
                                <div className={`p-3 bg-${item.color}-100 rounded-xl text-${item.color}-600`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-lg text-${item.color}-900`}>{item.title}</h3>
                                    <p className={`text-sm text-${item.color}-700 opacity-80`}>Click to start</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 mt-4 font-bold text-center bg-red-50 p-2 rounded-lg">{error}</motion.p>}
                </div>
            </motion.div>
        );
    }

    if (mode === 'quiz' || studyMode === 'sprint') {
        const question = quizQuestions[currentQuestion];
        const colors = ['from-blue-400 to-blue-600', 'from-purple-400 to-purple-600', 'from-pink-400 to-pink-600', 'from-orange-400 to-orange-600'];

        return (
            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                className="min-h-[600px] flex items-center justify-center p-4 bg-gray-900 rounded-[40px] overflow-hidden relative shadow-2xl border-4 border-indigo-500/30"
            >
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-blue-900/90 z-0"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
                    {/* Header: Timer & Coins */}
                    <div className="w-full flex justify-between items-center mb-8 px-4">
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full flex items-center gap-3 text-white shadow-lg">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-white/20 shadow-inner">
                                <span className="font-black text-yellow-900 text-sm">$</span>
                            </div>
                            <span className="font-bold text-xl tracking-wide">{coins}</span>
                        </div>

                        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full flex items-center gap-3 text-white shadow-lg">
                            <Clock className={`w-6 h-6 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
                            <span className={`font-bold text-2xl ${timeLeft <= 5 ? 'text-red-500' : 'text-blue-200'}`}>{timeLeft}s</span>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="w-full relative mb-10 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-[30px] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-gray-900 ring-1 ring-gray-900/5 rounded-[30px] p-10 text-center min-h-[200px] flex items-center justify-center border border-white/10 shadow-2xl">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-purple-500/50 px-6 py-1 rounded-full text-purple-300 text-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                Question {currentQuestion + 1}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 leading-tight">
                                {question?.question}
                            </h2>
                        </div>
                    </div>

                    {/* Options Grid */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                        <AnimatePresence mode='wait'>
                            {question?.options.map((opt, i) => {
                                const isSelected = opt === selectedAnswer;
                                const isCorrect = opt === question.answer;
                                const showResult = showExplanation;

                                let buttonStyle = "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"; // Default
                                if (showResult) {
                                    if (isCorrect) buttonStyle = "border-green-500 bg-green-500/20 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.4)]";
                                    else if (isSelected) buttonStyle = "border-red-500 bg-red-500/20 text-red-300";
                                    else buttonStyle = "opacity-50 border-transparent bg-black/20 text-gray-500";
                                }

                                return (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={!showResult ? { scale: 1.02, translateY: -2 } : {}}
                                        whileTap={!showResult ? { scale: 0.98 } : {}}
                                        onClick={() => !showExplanation && handleAnswer(opt)}
                                        disabled={showExplanation}
                                        className={`relative group p-6 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-4 overflow-hidden ${buttonStyle}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xl shadow-lg
                                            ${showResult && isCorrect ? 'bg-green-500 text-black' :
                                                showResult && isSelected ? 'bg-red-500 text-white' :
                                                    `bg-gradient-to-br ${colors[i % 4]} text-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]`}
                                        `}>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        <span className="font-bold text-lg leading-snug">{opt}</span>

                                        {/* Result Icons */}
                                        {showResult && isCorrect && <Check className="absolute right-4 w-6 h-6 text-green-400" />}
                                        {showResult && isSelected && !isCorrect && <X className="absolute right-4 w-6 h-6 text-red-400" />}
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Explanation / Next Button Area */}
                    <AnimatePresence>
                        {showExplanation && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="mt-8 w-full max-w-2xl"
                            >
                                <div className="bg-gray-800/80 backdrop-blur border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute left-0 top-0 h-full w-1 bg-purple-500"></div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-purple-400 font-bold uppercase tracking-wider text-xs">Explanation</span>
                                    </div>
                                    <p className="text-gray-300 mb-6 leading-relaxed">{question.explanation}</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={nextQuestion}
                                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white shadow-lg hover:shadow-purple-500/50 hover:from-purple-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
                                    >
                                        {currentQuestion < quizQuestions.length - 1 ? "Next Level" : "Finish Game"} <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        );
    }

    if (mode === 'results') {
        return (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="max-w-md mx-auto p-6 text-center"
            >
                <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
                    <motion.div
                        initial={{ y: -20 }} animate={{ y: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <Trophy className="w-12 h-12 text-yellow-500" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {studyMode === 'match' ? "Match Game Complete!" : studyMode === 'sprint' ? "Sprint Finished!" : "Quiz Complete!"}
                    </h2>
                    <p className="text-gray-500 mb-6">You masterfully conquered {category}</p>

                    <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
                        <p className="text-sm text-indigo-600 uppercase font-bold tracking-wider mb-1">Your Score</p>
                        <p className="text-6xl font-black text-indigo-600">{score} <span className="text-2xl text-indigo-400 font-medium">/ {quizQuestions.length}</span></p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={resetQuiz}
                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-5 h-5" /> Start New Quiz
                    </motion.button>
                </div>
            </motion.div>
        )
    }

    // Simplified match/notes for brevity, but they would also be animated
    if (mode === 'notes') {
        return <div className="p-8 bg-white rounded-3xl shadow-xl max-w-3xl mx-auto"><h2 className="text-3xl font-bold mb-4">{category} Notes</h2><pre className="whitespace-pre-wrap font-sans text-gray-700">{studyNotes}</pre><button onClick={resetQuiz} className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Done</button></div>;
    }

    if (mode === 'match') {
        return <div className="p-8 bg-white rounded-3xl shadow-xl max-w-4xl mx-auto text-center"><h2 className="text-2xl font-bold mb-6">Match Game</h2><div className="grid grid-cols-2 gap-4">{matchPairs.map((p, i) => <button key={i} onClick={() => handleMatchClick(p)} className={`p-4 border-2 rounded-xl transition ${matchedIds.includes(p.id) ? 'opacity-50 bg-green-50' : selectedMatch === p ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}>{p.text}</button>)}</div><button onClick={resetQuiz} className="mt-8 text-gray-500 underline">Exit</button></div>;
    }

    return <div></div>;
};

export default QuizApp;
