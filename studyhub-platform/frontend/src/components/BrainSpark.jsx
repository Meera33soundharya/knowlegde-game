import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Brain, Calendar, Target, Activity, MessageSquare,
    Send, Sparkles, CheckCircle, ArrowRight, RefreshCw, Terminal,
    Database, Cpu, Clock, Layout, ChevronRight, Award
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const INITIAL_STATE = {
    streak: 0,
    aiSessions: 0,
    totalScore: 0,
    quizHistory: [],
    chatHistory: []
};

const BrainSpark = () => {
    // --- STATE ---
    const [state, setState] = useState(INITIAL_STATE);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);

    // Planner State
    const [planForm, setPlanForm] = useState({ subject: '', date: '', goal: '' });
    const [planResult, setPlanResult] = useState('');

    // Quiz State
    const [quizForm, setQuizForm] = useState({ topic: '', count: 10, difficulty: 'medium' });
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [quizFinished, setQuizFinished] = useState(false);

    // Insights State
    const [insightsResult, setInsightsResult] = useState('');

    // Tutor State
    const [tutorMessages, setTutorMessages] = useState([]);
    const [tutorInput, setTutorInput] = useState('');
    const chatContainerRef = useRef(null);

    // --- EFFECTS ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const [attemptsRes, sessionsRes] = await Promise.all([
                        axios.get(`${API_URL}/quiz/attempts`),
                        axios.get(`${API_URL}/study/sessions`)
                    ]);
                    const attempts = attemptsRes.data || [];
                    const sessions = sessionsRes.data || [];
                    const totalScore = attempts.reduce((acc, curr) => acc + (curr.score || 0), 0);

                    setState(prev => ({
                        ...prev,
                        quizHistory: attempts.map(a => ({
                            topic: a.topic,
                            score: a.score,
                            percentage: a.percentage,
                            date: a.completed_at
                        })),
                        totalScore: totalScore,
                        aiSessions: attempts.length + sessions.length,
                        streak: new Set([...attempts, ...sessions].map(i => i.created_at || i.completed_at).map(d => d && d.split('T')[0])).size
                    }));
                }
            } catch (error) {
                console.error("Backend sync failed", error);
            }
        };
        fetchData();
        const today = new Date();
        today.setDate(today.getDate() + 7);
        setPlanForm(prev => ({ ...prev, date: today.toISOString().split('T')[0] }));
    }, []);

    const callAI = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        return true;
    };

    const generateAIStudyPlan = async () => {
        if (!planForm.subject || !planForm.date || !planForm.goal) return;
        await callAI();
        const planText = `
### 📅 STRATEGIC_PLAN: ${planForm.subject.toUpperCase()}
**OBJ:** ${planForm.goal}

#### PHASE_01: FOUNDATION_SYNC
*   Master core definitions and theoretical frameworks.
*   Review primary source material and baseline documentation.

#### PHASE_02: DEEP_INTEGRATION
*   Execution of complex problem sets and scenario simulations.
*   Active recall sessions focused on cross-modular testing.

#### PHASE_03: FINAL_MASTERY
*   High-fidelity mock exams under standard node constraints.
*   Targeting detected weaknesses with recursive review.
`;
        setPlanResult(planText);
        setState(prev => ({ ...prev, aiSessions: prev.aiSessions + 1 }));
    };

    const startAIQuiz = async () => {
        if (!quizForm.topic) return;
        await callAI();
        const mockQuestions = Array.from({ length: quizForm.count }).map((_, i) => ({
            question: `QUERY_${i + 1}: Analyze the core principle of ${quizForm.topic} in a production environment.`,
            options: [`VALIDATE_TRUE`, `ERR_DIST_A`, `ERR_DIST_B`, `ERR_DIST_C`],
            correct: 0,
            explanation: `The value is validated by cross-referencing node-state with the ${quizForm.topic} primary database.`
        }));
        setCurrentQuiz({ ...quizForm, questions: mockQuestions, currentIndex: 0, score: 0, answers: [] });
    };

    const handleAnswer = (idx) => {
        const q = currentQuiz.questions[currentQuiz.currentIndex];
        const isCorrect = idx === q.correct;
        const newScore = isCorrect ? currentQuiz.score + 10 : currentQuiz.score;
        const newAnswers = [...currentQuiz.answers, { isCorrect, selected: idx }];
        setCurrentQuiz(prev => ({ ...prev, score: newScore, answers: newAnswers }));
        if (currentQuiz.currentIndex + 1 === currentQuiz.questions.length) {
            setQuizFinished(true);
            setState(prev => ({ ...prev, aiSessions: prev.aiSessions + 1, totalScore: prev.totalScore + newScore }));
        }
    };

    const sendTutorMessage = async (msg = tutorInput) => {
        if (!msg.trim()) return;
        const userMsg = { role: 'user', content: msg };
        setTutorMessages(prev => [...prev, userMsg]);
        setTutorInput('');
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false);
        const aiMsg = { role: 'assistant', content: `[DATA_STREAM_PROCESSED]: Request relating to '${msg}' has been analyzed. Logic indicates that implementing active recall will increase retention by 40%.` };
        setTutorMessages(prev => [...prev, aiMsg]);
    };

    const Markdown = ({ content }) => (
        <div className="font-mono text-xs leading-relaxed text-white/70">
            {content.split('\n').map((line, i) => {
                if (line.startsWith('###')) return <h3 key={i} className="font-retro text-2xl text-[#39ff14] mt-6 mb-2 tracking-widest">{line.replace('###', '')}</h3>;
                if (line.startsWith('####')) return <h4 key={i} className="font-retro text-lg text-electric-blue mt-4 mb-1 tracking-wider">{line.replace('####', '')}</h4>;
                if (line.startsWith('*')) return <div key={i} className="flex gap-2 mt-1"><span className="text-[#39ff14]">>></span> {line.replace('*', '')}</div>;
                return <div key={i} className="mt-1">{line}</div>;
            })}
        </div>
    );

    return (
        <div className="p-8 animate-fadeIn">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="font-retro text-6xl text-white tracking-[12px] uppercase italic mb-2">BRAIN_SPARK_X</h1>
                <div className="flex items-center justify-center gap-4 font-mono text-[10px] text-white/40 tracking-[4px]">
                    <span className="flex items-center gap-1 font-bold text-[#39ff14]"><Sparkles size={12} /> AI_ENGINE_ACTIVE</span>
                    <span>•</span>
                    <span>CORE_STABILITY: 99.8%</span>
                </div>
            </div>

            {/* NAV */}
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
                {[
                    { id: 'dashboard', label: 'METRICS', icon: Activity },
                    { id: 'planner', label: 'STRATEGY', icon: Calendar },
                    { id: 'quiz', label: 'PROVING_GRD', icon: Target },
                    { id: 'tutor', label: 'COMMS', icon: MessageSquare }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`cyber-btn text-[10px] flex items-center gap-2 ${activeTab === tab.id ? 'cyber-btn-primary' : ''}`}
                    >
                        <tab.icon size={12} /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="max-w-5xl mx-auto">
                {activeTab === 'dashboard' && (
                    <AnimatePresence mode="wait">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: 'SYNAPSE_STRK', val: `${state.streak}_CYC`, icon: Zap, col: 'neon-text-green' },
                                { label: 'TOTAL_CYCLES', val: state.aiSessions, icon: Cpu, col: 'neon-text-blue' },
                                { label: 'DATA_YIELD', val: state.totalScore, icon: Award, col: 'neon-text-pink' },
                                { label: 'EFFICIENCY', val: '94%', icon: Activity, col: 'text-yellow-400' },
                            ].map((s, i) => (
                                <div key={i} className="glass-panel p-6 border-t-2 border-white/5 group hover:border-[#39ff14]/50 transition-all">
                                    <div className={`flex items-center justify-between mb-4`}>
                                        <span className="font-mono text-[9px] tracking-[2px] text-white/40">{s.label}</span>
                                        <s.icon size={14} className={s.col} />
                                    </div>
                                    <div className="font-retro text-3xl text-white tracking-widest">{s.val}</div>
                                </div>
                            ))}
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass-panel p-8">
                                <h2 className="font-retro text-2xl text-[#39ff14] mb-6 tracking-widest italic">QUICK_ACTIONS</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setActiveTab('quiz')} className="p-6 bg-white/5 border border-white/10 hover:border-[#39ff14] transition-all text-center">
                                        <Target size={24} className="mx-auto mb-2 text-[#39ff14]" />
                                        <span className="font-mono text-[9px] tracking-widest opacity-60">GEN_QUIZ</span>
                                    </button>
                                    <button onClick={() => setActiveTab('tutor')} className="p-6 bg-white/5 border border-white/10 hover:border-electric-blue transition-all text-center">
                                        <MessageSquare size={24} className="mx-auto mb-2 text-electric-blue" />
                                        <span className="font-mono text-[9px] tracking-widest opacity-60">AI_TUTOR</span>
                                    </button>
                                </div>
                            </div>
                            <div className="glass-panel p-8 border-l-4 border-white/5">
                                <h2 className="font-retro text-2xl text-white/40 mb-6 tracking-widest italic uppercase">SYSTEM_STAMP</h2>
                                <div className="space-y-4">
                                    {state.quizHistory.slice(0, 3).map((h, i) => (
                                        <div key={i} className="flex items-center justify-between font-mono text-[10px] pb-2 border-b border-white/5">
                                            <span className="text-white/60">{h.topic.toUpperCase()}</span>
                                            <span className="text-[#39ff14]">{h.score}_PTS</span>
                                        </div>
                                    ))}
                                    {state.quizHistory.length === 0 && <div className="font-mono text-[9px] opacity-20 italic">NO_LOGS_DETECTED...</div>}
                                </div>
                            </div>
                        </div>
                    </AnimatePresence>
                )}

                {activeTab === 'planner' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-10 max-w-3xl mx-auto border-t-2 border-[#39ff14]">
                        <h2 className="font-retro text-4xl text-[#39ff14] mb-10 tracking-[6px] italic uppercase">STRATEGY_GEN</h2>
                        <div className="space-y-6 mb-10">
                            <div>
                                <label className="font-mono text-[10px] text-white/40 block mb-2 tracking-widest">SUBJ_ID</label>
                                <input className="w-full p-4 bg-black/60 border border-white/10 outline-none focus:border-[#39ff14] font-mono text-sm" placeholder="e.g. APPLIED_CALCULUS" value={planForm.subject} onChange={e => setPlanForm({ ...planForm, subject: e.target.value })} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-mono text-[10px] text-white/40 block mb-2 tracking-widest">TGT_DATE</label>
                                    <input className="w-full p-4 bg-black/60 border border-white/10 outline-none focus:border-[#39ff14] font-mono text-sm" type="date" value={planForm.date} onChange={e => setPlanForm({ ...planForm, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="font-mono text-[10px] text-white/40 block mb-2 tracking-widest">OBJ_PARAM</label>
                                    <input className="w-full p-4 bg-black/60 border border-white/10 outline-none focus:border-[#39ff14] font-mono text-sm" placeholder="e.g. CORE_MASTERY" value={planForm.goal} onChange={e => setPlanForm({ ...planForm, goal: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <button className="cyber-btn cyber-btn-primary w-full py-5 text-xl font-retro italic" onClick={generateAIStudyPlan} disabled={loading}>
                            {loading ? 'COMPUTING...' : 'INIT_STRATEGY_GEN'}
                        </button>
                        {planResult && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 p-8 border border-[#39ff14]/20 bg-white/5 rounded">
                                <Markdown content={planResult} />
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'quiz' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-10 max-w-3xl mx-auto border-t-2 border-electric-blue">
                        {!currentQuiz ? (
                            <div className="text-center">
                                <h2 className="font-retro text-4xl text-electric-blue mb-10 tracking-[6px] italic uppercase text-center">PROVING_GRID</h2>
                                <div className="mb-10 text-left">
                                    <label className="font-mono text-[10px] text-white/40 block mb-2 tracking-widest">TOPIC_VEC</label>
                                    <input className="w-full p-4 bg-black/60 border border-white/10 outline-none focus:border-electric-blue font-mono text-sm" placeholder="e.g. QUANTUM_PHYSICS" value={quizForm.topic} onChange={e => setQuizForm({ ...quizForm, topic: e.target.value })} />
                                </div>
                                <button className="cyber-btn cyber-btn-primary w-full py-5 text-xl font-retro italic" onClick={startAIQuiz} disabled={loading}>
                                    {loading ? 'CALIBRATING...' : 'OPEN_SIMULATION'}
                                </button>
                            </div>
                        ) : !quizFinished ? (
                            <>
                                <div className="flex justify-between mb-2 font-mono text-[10px] text-white/40 uppercase">
                                    <span>SEQ_{currentQuiz.currentIndex + 1}_OF_{currentQuiz.questions.length}</span>
                                    <span className="text-[#39ff14]">YIELD: {currentQuiz.score}</span>
                                </div>
                                <div className="h-1 bg-white/5 border border-white/5 mb-10">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQuiz.currentIndex + 1) / currentQuiz.questions.length) * 100}%` }} className="h-full bg-electric-blue shadow-[0_0_10px_#00f3ff]" />
                                </div>
                                <div className="font-mono text-lg text-white mb-10 leading-relaxed border-l-4 border-electric-blue pl-6">{currentQuiz.questions[currentQuiz.currentIndex].question}</div>
                                <div className="space-y-4">
                                    {currentQuiz.questions[currentQuiz.currentIndex].options.map((opt, i) => (
                                        <button
                                            key={i}
                                            className={`w-full p-5 text-left font-mono text-xs tracking-wider transition-all border ${currentQuiz.answers[currentQuiz.currentIndex]?.selected === i
                                                    ? (currentQuiz.questions[currentQuiz.currentIndex].correct === i ? 'border-[#39ff14] bg-[#39ff14]/10 text-[#39ff14]' : 'border-red-500 bg-red-500/10 text-red-500')
                                                    : 'border-white/10 bg-white/5 hover:border-white/30'
                                                }`}
                                            onClick={() => !currentQuiz.answers[currentQuiz.currentIndex] && handleAnswer(i)}
                                            disabled={!!currentQuiz.answers[currentQuiz.currentIndex]}
                                        >
                                            <span className="mr-4 opacity-30">[{String.fromCharCode(65 + i)}]</span> {opt}
                                        </button>
                                    ))}
                                </div>
                                {currentQuiz.answers[currentQuiz.currentIndex] && (
                                    <button
                                        className="cyber-btn cyber-btn-primary w-full mt-10 py-4 font-retro"
                                        onClick={() => setCurrentQuiz(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }))}
                                    > NEXT_LEVEL </button>
                                )}
                            </>
                        ) : (
                            <div className="text-center">
                                <h3 className="font-retro text-6xl text-[#39ff14] mb-4 tracking-[10px]">SUCCESS</h3>
                                <p className="font-mono text-3xl text-white mb-10 tracking-widest">{currentQuiz.score} PTS YIELDED</p>
                                <button className="cyber-btn cyber-btn-primary px-12 py-4" onClick={() => setCurrentQuiz(null)}>RESTART_ENGINE</button>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'tutor' && (
                    <div className="glass-panel h-[700px] flex flex-col border-r-4 border-electric-blue overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="font-retro text-3xl text-white tracking-widest italic uppercase">TUTOR_LINK</h2>
                            <div className="flex gap-1 items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse"></div>
                                <span className="font-mono text-[9px] text-[#39ff14]">SECURE_CHNL</span>
                            </div>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6 bg-black/20" ref={chatContainerRef}>
                            {tutorMessages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-20">
                                    <Terminal size={64} className="mb-4" />
                                    <p className="font-mono text-[10px] tracking-[5px]">WAITING_FOR_SIGNAL...</p>
                                </div>
                            )}
                            {tutorMessages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 font-mono text-[11px] leading-relaxed relative ${msg.role === 'user' ? 'bg-white/5 border-r-4 border-electric-blue' : 'bg-[#39ff14]/5 border-l-4 border-[#39ff14]'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && <div className="font-mono text-[9px] text-[#39ff14] animate-flicker">>> UNDERSTANDNG_CONTEXT...</div>}
                        </div>
                        <div className="p-6 border-t border-white/5 bg-black/40">
                            <div className="flex gap-4">
                                <input className="flex-1 bg-white/5 border border-white/10 p-4 outline-none focus:border-electric-blue font-mono text-sm text-white"
                                    placeholder="INPUT_QUERY..." value={tutorInput} onChange={e => setTutorInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && sendTutorMessage()} />
                                <button className="cyber-btn flex items-center gap-2" onClick={() => sendTutorMessage()}>
                                    <Send size={16} /> SEND
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrainSpark;
