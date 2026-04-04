import React, { useState, useEffect } from 'react';
import {
    Brain, Code, BookOpen, Trophy, ArrowRight, RotateCcw, Check, X,
    Loader2, Sparkles, Search, GraduationCap, FileText, Zap,
    Moon, Sun, History, Download, Clock, Terminal, Activity, Target
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import confetti from 'canvas-confetti';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const QuizApp = () => {
    const [mode, setMode] = useState('home');
    const [category, setCategory] = useState(null);
    const [difficulty, setDifficulty] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [customTopic, setCustomTopic] = useState("");
    const [timeLeft, setTimeLeft] = useState(20);
    const [countdown, setCountdown] = useState(3);
    const [coins, setCoins] = useState(10);

    const generateMockQuestions = (topic) => Array(5).fill(null).map((_, i) => ({
        question: `[QUERY_${i + 1}]: Analyze the core impact of ${topic} on system stability?`,
        options: [`SUCCESS_PARAM`, `LOGIC_ERR_01`, `ASYNC_MISMATCH`, `MEM_LEAK_DET`],
        answer: `SUCCESS_PARAM`,
        explanation: `System parameters indicate ${topic} is critical for cross-node communication.`
    }));

    useEffect(() => {
        let timer;
        if (mode === 'quiz' && timeLeft > 0 && !showExplanation) {
            timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
        } else if (timeLeft === 0 && mode === 'quiz' && !showExplanation) {
            handleAnswer(null);
        }
        return () => clearInterval(timer);
    }, [mode, timeLeft, showExplanation]);

    useEffect(() => {
        if (mode === 'countdown' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (mode === 'countdown' && countdown === 0) {
            setMode('quiz');
            setTimeLeft(20);
        }
    }, [mode, countdown]);

    const startQuiz = async (topic) => {
        setCategory(topic);
        setMode('loading');
        await new Promise(r => setTimeout(r, 1000));
        setQuizQuestions(generateMockQuestions(topic));
        setMode('countdown');
        setCountdown(3);
        setScore(0);
        setCurrentQuestion(0);
    };

    const handleAnswer = (ans) => {
        setSelectedAnswer(ans);
        setShowExplanation(true);
        if (ans === quizQuestions[currentQuestion].answer) {
            setScore(s => s + 10);
            setCoins(c => c + 5);
            confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(c => c + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setTimeLeft(20);
        } else {
            setMode('results');
        }
    };

    if (mode === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Activity className="w-16 h-16 text-[#39ff14] animate-pulse mb-4" />
                <p className="font-mono text-xs tracking-[5px] text-[#39ff14]/60 uppercase">CALIBRATING_SIMULATION...</p>
            </div>
        );
    }

    if (mode === 'countdown') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <motion.div key={countdown} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.5, opacity: 1 }} className="text-9xl font-retro text-[#39ff14] mb-4">
                    {countdown}
                </motion.div>
                <p className="font-mono text-xs tracking-widest text-[#39ff14]">INIT_SEQUENCE_START</p>
            </div>
        );
    }

    if (mode === 'home') {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="glass-panel p-10 border-t-2 border-[#39ff14]">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="font-retro text-4xl text-white flex items-center tracking-[6px] italic">
                            PROVING_GROUNDS
                        </h2>
                        <div className="bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 px-4 py-2 rounded font-mono text-xs flex items-center gap-2">
                            CREDITS: {coins}
                        </div>
                    </div>

                    <div className="relative mb-12">
                        <input
                            type="text"
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            placeholder="INPUT_TOPIC_VECTOR (e.g. QUANTUM_PHYSICS)"
                            className="w-full p-6 bg-black/60 border border-white/10 outline-none focus:border-[#39ff14] font-mono text-lg text-[#39ff14] tracking-widest placeholder:text-white/10"
                            onKeyDown={(e) => e.key === 'Enter' && customTopic && startQuiz(customTopic)}
                        />
                        <Terminal className="absolute right-6 top-1/2 -translate-y-1/2 text-[#39ff14]/20 w-6 h-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: "INIT_QUIZ", icon: Brain, color: "#39ff14", func: () => startQuiz(customTopic) },
                            { title: "EXTRACT_NOTES", icon: FileText, color: "#00f3ff", func: () => { } },
                            { title: "SPRINT_MODE", icon: Zap, color: "#ff10f0", func: () => { } },
                            { title: "SYNC_MATCH", icon: BookOpen, color: "#ffff00", func: () => { } }
                        ].map((item, i) => (
                            <button
                                key={i}
                                onClick={() => customTopic ? item.func() : null}
                                className="glass-panel p-6 text-left border-white/5 hover:border-[#39ff14] group transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 border border-white/10 group-hover:border-[#39ff14] transition-colors">
                                        <item.icon size={20} style={{ color: item.color }} />
                                    </div>
                                    <span className="font-retro text-xl text-white tracking-widest opacity-60 group-hover:opacity-100 uppercase italic">{item.title}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'quiz') {
        const question = quizQuestions[currentQuestion];
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="bg-black/40 border border-white/10 px-4 py-2 font-mono text-[10px] text-white/40">
                        SEQ_{currentQuestion + 1}_OF_{quizQuestions.length}
                    </div>
                    <div className={`font-retro text-2xl ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-[#39ff14]'}`}>
                        {timeLeft}s
                    </div>
                </div>

                <div className="glass-panel p-12 mb-8 border-l-4 border-[#39ff14] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 font-mono text-[8px] text-white/10">ENCRYPTED_QUERY</div>
                    <h2 className="font-mono text-2xl text-white leading-relaxed">{question?.question}</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {question?.options.map((opt, i) => {
                        const isSelected = opt === selectedAnswer;
                        const isCorrect = opt === question.answer;
                        return (
                            <button
                                key={i}
                                onClick={() => !showExplanation && handleAnswer(opt)}
                                disabled={showExplanation}
                                className={`w-full p-6 text-left font-mono text-sm tracking-wider border transition-all ${showExplanation
                                        ? (isCorrect ? 'border-[#39ff14] bg-[#39ff14]/10 text-[#39ff14]' : (isSelected ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-white/5 opacity-30'))
                                        : 'border-white/5 bg-white/5 hover:border-[#39ff14]/50'
                                    }`}
                            >
                                <span className="mr-4 opacity-20">[{String.fromCharCode(65 + i)}]</span> {opt}
                            </button>
                        );
                    })}
                </div>

                {showExplanation && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                        <div className="glass-panel p-8 border-t-2 border-electric-blue">
                            <h4 className="font-mono text-[10px] text-electric-blue mb-4 tracking-widest">LOGIC_EXP_NODE</h4>
                            <p className="font-mono text-xs text-white/60 mb-8">{question.explanation}</p>
                            <button className="cyber-btn cyber-btn-primary w-full py-4 font-retro" onClick={nextQuestion}>
                                {currentQuestion < quizQuestions.length - 1 ? "NEXT_VECTOR" : "FINALIZE_RESULT"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        );
    }

    if (mode === 'results') {
        return (
            <div className="max-w-md mx-auto text-center">
                <div className="glass-panel p-12 border-t-4 border-[#39ff14]">
                    <Trophy className="w-16 h-16 text-[#39ff14] mx-auto mb-6" />
                    <h2 className="font-retro text-4xl text-white tracking-widest mb-2 uppercase italic">GRID_CLEARED</h2>
                    <p className="font-mono text-xs text-white/40 mb-10 tracking-widest uppercase">NODE: {category}</p>

                    <div className="bg-white/5 border border-white/5 p-8 mb-10">
                        <span className="font-mono text-[10px] text-white/20 block mb-2">YIELD_SCORE</span>
                        <span className="font-retro text-6xl text-[#39ff14]">{score}</span>
                    </div>

                    <button onClick={() => setMode('home')} className="cyber-btn cyber-btn-primary w-full py-4 text-xl font-retro italic">
                        RESTART_SEQUENCE
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default QuizApp;
