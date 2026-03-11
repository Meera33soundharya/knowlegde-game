import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './BrainSpark.css';

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
    // --- EFFECTS ---
    useEffect(() => {
        // Load data from Backend
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // If logged in, fetch from API
                if (token) {
                    const [attemptsRes, sessionsRes] = await Promise.all([
                        axios.get(`${API_URL}/quiz/attempts`),
                        axios.get(`${API_URL}/study/sessions`)
                    ]);

                    const attempts = attemptsRes.data || [];
                    const sessions = sessionsRes.data || [];

                    // Calculate stats
                    const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);

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
                        // Simple streak calc (unique days)
                        streak: new Set([...attempts, ...sessions].map(i => i.created_at || i.completed_at).map(d => d && d.split('T')[0])).size
                    }));
                } else {
                    // Fallback to local storage
                    const saved = localStorage.getItem('brainSparkAI');
                    if (saved) setState({ ...INITIAL_STATE, ...JSON.parse(saved) });
                }
            } catch (error) {
                console.error("Backend sync failed", error);
                const saved = localStorage.getItem('brainSparkAI');
                if (saved) setState({ ...INITIAL_STATE, ...JSON.parse(saved) });
            }
        };
        fetchData();

        // Date Init
        const today = new Date();
        today.setDate(today.getDate() + 7);
        setPlanForm(prev => ({ ...prev, date: today.toISOString().split('T')[0] }));
    }, []);

    useEffect(() => {
        localStorage.setItem('brainSparkAI', JSON.stringify(state));
    }, [state]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [tutorMessages]);

    // --- AI SIMULATION HELPERS ---
    // In a production app, these would call your backend which would call Anthropic/OpenAI
    const callAI = async (prompt) => {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);

        // This is where you would do: axios.post('/api/ai', { prompt })
        // For now, we return intelligent mock responses based on the prompt content.
        return true;
    };

    // --- PLANNER ---
    const generateAIStudyPlan = async () => {
        if (!planForm.subject || !planForm.date || !planForm.goal) return alert('Please fill in all fields');

        await callAI();
        const days = Math.ceil((new Date(planForm.date) - new Date()) / (1000 * 60 * 60 * 24));

        const planText = `
### 📅 Personalized Study Plan: ${planForm.subject}
**Goal:** ${planForm.goal}
**Timeline:** ${days} days until target

#### Phase 1: Foundation (Days 1-${Math.max(1, Math.floor(days / 3))})
*   **Core Concepts**: Review fundamental definitions and theories.
*   **Reading**: Focused reading on ${planForm.subject} basics.
*   **Daily Goal**: 45 mins active reading + 15 mins summarization.

#### Phase 2: Deep Dive (Days ${Math.floor(days / 3) + 1}-${Math.floor(2 * days / 3)})
*   **Application**: Solve practice problems and case studies.
*   **Active Recall**: Test yourself without looking at notes.
*   **Daily Goal**: 1 hour problem solving.

#### Phase 3: Mastery & Review (Final Days)
*   **Mock Exams**: Simulate exam conditions.
*   **Weakness Targeting**: Focus only on incorrectly answered topics.
*   **Daily Goal**: Full practice tests + review.

#### 💡 Study Tips for You:
*   Use the **Pomodoro Timer** in BrainSpark to stay focused.
*   Explain concepts out loud (Feynman Technique) to verify understanding.
`;
        setPlanResult(planText);
        setState(prev => ({ ...prev, aiSessions: prev.aiSessions + 1 }));
    };

    // --- QUIZ ---
    const startAIQuiz = async () => {
        if (!quizForm.topic) return alert('Please enter a topic');

        await callAI();

        // Mock Quiz Generation
        const mockQuestions = Array.from({ length: quizForm.count }).map((_, i) => ({
            question: `Question ${i + 1} about ${quizForm.topic} generated by AI?`,
            options: [
                `Correct Answer for Q${i + 1}`,
                `Distractor A`,
                `Distractor B`,
                `Distractor C`
            ],
            correct: 0, // In real AI, this would be dynamic
            explanation: `This is the correct answer because it directly addresses the core concept of ${quizForm.topic} in the context of the question.`
        })).map(q => ({ ...q, options: q.options.sort(() => Math.random() - 0.5) }));

        // Fix correct index after shuffle
        mockQuestions.forEach(q => {
            const correctText = `Correct Answer`;
            q.correct = q.options.findIndex(o => o.includes('Correct'));
        });

        setCurrentQuiz({
            ...quizForm,
            questions: mockQuestions,
            currentIndex: 0,
            score: 0,
            answers: []
        });
        setQuizFinished(false);
    };

    const handleAnswer = (idx) => {
        const q = currentQuiz.questions[currentQuiz.currentIndex];
        const isCorrect = idx === q.correct;

        const newScore = isCorrect ? currentQuiz.score + 10 : currentQuiz.score;
        const newAnswers = [...currentQuiz.answers, { isCorrect, selected: idx }];

        setCurrentQuiz(prev => ({
            ...prev,
            score: newScore,
            answers: newAnswers
        }));
    };

    const nextQuestion = () => {
        if (currentQuiz.currentIndex + 1 < currentQuiz.questions.length) {
            setCurrentQuiz(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        setQuizFinished(true);
        const correctCount = currentQuiz.answers.filter(a => a.isCorrect).length;
        const percentage = Math.round((correctCount / currentQuiz.questions.length) * 100);

        const newEntry = {
            topic: currentQuiz.topic,
            score: currentQuiz.score,
            total_questions: currentQuiz.questions.length,
            difficulty: currentQuiz.difficulty
        };

        // Save to Backend if Logged In
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.post(`${API_URL}/quiz/attempts`, newEntry);
            } catch (error) {
                console.error("Failed to save quiz to backend", error);
            }
        }

        setState(prev => ({
            ...prev,
            aiSessions: prev.aiSessions + 1,
            streak: prev.streak + 1,
            totalScore: prev.totalScore + currentQuiz.score,
            quizHistory: [...prev.quizHistory, {
                ...newEntry,
                percentage,
                date: new Date().toISOString()
            }]
        }));
    };

    // --- INSIGHTS ---
    const generateInsights = async () => {
        await callAI();
        const text = `
**📊 Performance Analysis**
You have completed ${state.quizHistory.length} quizzes with an average score of ${state.quizHistory.length > 0 ? Math.round(state.quizHistory.reduce((a, b) => a + b.percentage, 0) / state.quizHistory.length) : 0}%.

**💪 Strengths**
*   Consistency: You've maintained a ${state.streak} day streak!
*   Curiosity: You're exploring diverse topics.

**📉 Areas for Improvement**
*   Review recent mistakes in your last quiz to solidify understanding.
*   Try increasing the difficulty level for your next session.

**🚀 Recommended Next Steps**
1.  Use the **AI Planner** to schedule a deep dive into your weakest subject.
2.  Take a 15-minute mock quiz tomorrow morning.
`;
        setInsightsResult(text);
        setState(prev => ({ ...prev, aiSessions: prev.aiSessions + 1 }));
    };

    // --- TUTOR ---
    const sendTutorMessage = async (msg = tutorInput) => {
        if (!msg.trim()) return;

        const userMsg = { role: 'user', content: msg };
        setTutorMessages(prev => [...prev, userMsg]);
        setTutorInput('');

        setLoading(true);
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);

        // Simple Keyword-based Mock Response
        let replyText = "That's an interesting question! Could you elaborate more?";
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes('plan') || lowerMsg.includes('schedule')) {
            replyText = "I can help you create a study plan! Go to the 'AI Planner' tab and let's structure your learning efficiently.";
        } else if (lowerMsg.includes('quiz') || lowerMsg.includes('test')) {
            replyText = "Testing yourself is great for active recall. I recommend taking a short quiz on the topic you just read about.";
        } else if (lowerMsg.includes('explain') || lowerMsg.includes('what is')) {
            replyText = `Here's a simple explanation: ${msg.replace('explain', '').replace('what is', '')} refers to a core concept in this field. It involves analyzing the components and understanding how they interact. Would you like an example?`;
        } else if (lowerMsg.includes('tips') || lowerMsg.includes('help')) {
            replyText = "Sure! 1. Break down complex topics. 2. Use spaced repetition. 3. Teach what you learn to someone else (or to me!).";
        }

        const aiMsg = { role: 'assistant', content: replyText };
        setTutorMessages(prev => [...prev, aiMsg]);

        setState(prev => ({ ...prev, aiSessions: prev.aiSessions + 1, chatHistory: [...prev.chatHistory, userMsg, aiMsg] }));
    };

    // --- RENDER HELPERS ---
    const Markdown = ({ content }) => (
        <div className="whitespace-pre-line text-gray-200 leading-relaxed font-light">
            {content.split('\n').map((line, i) => {
                if (line.startsWith('###')) return <h3 key={i} className="text-xl font-bold text-yellow-400 mt-4 mb-2">{line.replace('###', '')}</h3>;
                if (line.startsWith('####')) return <h4 key={i} className="text-lg font-bold text-cyan-400 mt-3 mb-1">{line.replace('####', '')}</h4>;
                if (line.startsWith('**')) return <strong key={i} className="text-white block mt-2">{line.replace(/\*\*/g, '')}</strong>;
                if (line.startsWith('*')) return <li key={i} className="ml-4 list-disc text-gray-300">{line.replace('*', '')}</li>;
                return <div key={i}>{line}</div>;
            })}
        </div>
    );

    return (
        <div className="brainspark-container">
            <div className="bs-content">
                <header className="mb-8 text-center">
                    <h1 className="bs-title">BrainSpark Pro AI</h1>
                    <p className="bs-subtitle">AI-Powered Study Intelligence</p>
                    <p className="bs-tagline">Ignite Your Knowledge with AI 🚀</p>
                </header>

                {/* NAV */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {[
                        { id: 'dashboard', label: '📊 Dashboard' },
                        { id: 'planner', label: '📅 AI Planner' },
                        { id: 'quiz', label: '🎯 AI Quiz' },
                        { id: 'insights', label: '🧠 AI Insights' },
                        { id: 'tutor', label: '👨‍🏫 AI Tutor' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`bs-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* DASHBOARD */}
                {activeTab === 'dashboard' && (
                    <div className="animate-slide-in">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Study Streak', val: `${state.streak} 🔥` },
                                { label: 'AI Sessions', val: state.aiSessions },
                                { label: 'Total Score', val: state.totalScore },
                                { label: 'Mastery Level', val: `${state.quizHistory.length > 0 ? Math.round(state.quizHistory.reduce((a, b) => a + b.percentage, 0) / state.quizHistory.length) : 0}%` },
                            ].map((s, i) => (
                                <div key={i} className="bs-card text-center">
                                    <div className="text-cyan-400 text-xs uppercase mb-2">{s.label}</div>
                                    <div className="text-yellow-400 text-3xl font-bold">{s.val}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bs-card mb-6">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-4">🚀 AI Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { icon: '🤖', label: 'AI Quiz', action: () => setActiveTab('quiz') },
                                    { icon: '💡', label: 'Get Tips', action: () => { setActiveTab('insights'); generateInsights(); } },
                                    { icon: '📊', label: 'Analyze', action: () => { setActiveTab('insights'); generateInsights(); } },
                                    { icon: '❓', label: 'Ask AI', action: () => setActiveTab('tutor') },
                                ].map((btn, i) => (
                                    <button key={i} className="bs-btn flex-col p-4" onClick={btn.action}>
                                        <div className="text-2xl mb-1">{btn.icon}</div>
                                        <div className="text-sm">{btn.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* PLANNER */}
                {activeTab === 'planner' && (
                    <div className="animate-slide-in bs-card max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-cyan-400 mb-6">🤖 AI Study Planner <span className="ai-badge">SMART</span></h2>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-cyan-400 mb-2">Subject</label>
                                <input className="bs-input" placeholder="e.g. Calculus" value={planForm.subject} onChange={e => setPlanForm({ ...planForm, subject: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-cyan-400 mb-2">Exam Date</label>
                                <input className="bs-input" type="date" value={planForm.date} onChange={e => setPlanForm({ ...planForm, date: e.target.value })} />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-cyan-400 mb-2">Study Goal</label>
                            <textarea className="bs-input" rows="3" placeholder="I want to master..." value={planForm.goal} onChange={e => setPlanForm({ ...planForm, goal: e.target.value })} />
                        </div>
                        <button className="bs-btn w-full mb-6" onClick={generateAIStudyPlan} disabled={loading}>
                            {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : '🚀 Generate Plan'}
                        </button>
                        {planResult && (
                            <div className="bg-cyan-900/20 p-6 rounded-xl border border-cyan-400/30">
                                <Markdown content={planResult} />
                            </div>
                        )}
                    </div>
                )}

                {/* QUIZ */}
                {activeTab === 'quiz' && (
                    <div className="animate-slide-in bs-card max-w-3xl mx-auto">
                        {!currentQuiz ? (
                            <>
                                <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">🎯 AI Quiz Generator <span className="ai-badge">ADAPTIVE</span></h2>
                                <div className="mb-6">
                                    <label className="block text-cyan-400 mb-2">Topic</label>
                                    <input className="bs-input" placeholder="e.g. History of Rome" value={quizForm.topic} onChange={e => setQuizForm({ ...quizForm, topic: e.target.value })} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-cyan-400 mb-2">Questions</label>
                                        <select className="bs-input" value={quizForm.count} onChange={e => setQuizForm({ ...quizForm, count: parseInt(e.target.value) })}>
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-cyan-400 mb-2">Difficulty</label>
                                        <select className="bs-input" value={quizForm.difficulty} onChange={e => setQuizForm({ ...quizForm, difficulty: e.target.value })}>
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="bs-btn w-full" onClick={startAIQuiz} disabled={loading}>
                                    {loading ? 'Generating...' : '🤖 Generate Quiz'}
                                </button>
                            </>
                        ) : !quizFinished ? (
                            <>
                                <div className="flex justify-between mb-4 text-sm text-cyan-400">
                                    <span>Q{currentQuiz.currentIndex + 1} of {currentQuiz.questions.length}</span>
                                    <span className="text-yellow-400 font-bold">Score: {currentQuiz.score}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2 rounded-full mb-6">
                                    <div className="bg-gradient-to-r from-cyan-400 to-pink-600 h-full transition-all" style={{ width: `${(currentQuiz.currentIndex / currentQuiz.questions.length) * 100}%` }}></div>
                                </div>
                                <div className="text-xl font-bold mb-6">{currentQuiz.questions[currentQuiz.currentIndex].question}</div>
                                <div className="space-y-3 mb-6">
                                    {currentQuiz.questions[currentQuiz.currentIndex].options.map((opt, i) => (
                                        <button
                                            key={i}
                                            className={`quiz-answer-btn ${currentQuiz.answers[currentQuiz.currentIndex] ? (currentQuiz.questions[currentQuiz.currentIndex].correct === i ? 'correct' : currentQuiz.answers[currentQuiz.currentIndex].selected === i ? 'incorrect' : '') : ''}`}
                                            onClick={() => !currentQuiz.answers[currentQuiz.currentIndex] && handleAnswer(i)}
                                            disabled={!!currentQuiz.answers[currentQuiz.currentIndex]}
                                        >
                                            {String.fromCharCode(65 + i)}. {opt}
                                        </button>
                                    ))}
                                </div>
                                {currentQuiz.answers[currentQuiz.currentIndex] && (
                                    <div className="explanation-box mb-6">
                                        <strong className="text-yellow-400 block mb-1">AI Explanation:</strong>
                                        {currentQuiz.questions[currentQuiz.currentIndex].explanation}
                                    </div>
                                )}
                                {currentQuiz.answers[currentQuiz.currentIndex] && (
                                    <button className="bs-btn w-full" onClick={nextQuestion}>
                                        {currentQuiz.currentIndex + 1 === currentQuiz.questions.length ? 'Finish Quiz' : 'Next Question'}
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="text-6xl mb-4">🎉</div>
                                <div className="text-5xl font-['Bebas_Neue'] text-yellow-400 mb-2">{currentQuiz.answers.filter(a => a.isCorrect).length}/{currentQuiz.questions.length}</div>
                                <div className="text-2xl text-cyan-400 mb-6">{Math.round((currentQuiz.answers.filter(a => a.isCorrect).length / currentQuiz.questions.length) * 100)}%</div>
                                <button className="bs-btn w-full mb-3" onClick={() => { setCurrentQuiz(null); setQuizForm({ ...quizForm, topic: '' }); }}>New Quiz</button>
                                <button className="bs-btn w-full bg-transparent border-white" onClick={() => setActiveTab('dashboard')}>Back to Dashboard</button>
                            </div>
                        )}
                    </div>
                )}

                {/* INSIGHTS */}
                {activeTab === 'insights' && (
                    <div className="animate-slide-in bs-card max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-cyan-400 mb-6">🧠 AI Insights</h2>
                        {!insightsResult ? (
                            <div className="text-center py-10">
                                <p className="text-gray-400 mb-6">Let AI analyze your performance and suggest improvements.</p>
                                <button className="bs-btn" onClick={generateInsights} disabled={loading}>
                                    {loading ? 'Analyzing...' : '🔍 Analyze My Progress'}
                                </button>
                            </div>
                        ) : (
                            <div className="insight-card">
                                <Markdown content={insightsResult} />
                                <button className="bs-btn mt-6 w-full" onClick={() => setInsightsResult('')}>Refresh Analysis</button>
                            </div>
                        )}
                    </div>
                )}

                {/* TUTOR */}
                {activeTab === 'tutor' && (
                    <div className="animate-slide-in bs-card max-w-3xl mx-auto h-[600px] flex flex-col">
                        <h2 className="text-3xl font-bold text-cyan-400 mb-4">👨‍🏫 AI Tutor Chat</h2>
                        <div className="flex-1 bg-black/20 rounded-xl p-4 overflow-y-auto mb-4 custom-scrollbar" ref={chatContainerRef}>
                            {tutorMessages.length === 0 && (
                                <div className="text-center text-gray-400 mt-20">
                                    <div className="text-4xl mb-4">👋</div>
                                    <p>I'm your AI Tutor. Ask me anything about learning!</p>
                                </div>
                            )}
                            {tutorMessages.map((msg, i) => (
                                <div key={i} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-xl p-3 ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-[#1e1e2e] border border-cyan-400/30 text-gray-200'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start mb-4">
                                    <div className="bg-[#1e1e2e] rounded-xl p-3 flex gap-1">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="bs-input mb-0 flex-1"
                                placeholder="Ask a question..."
                                value={tutorInput}
                                onChange={e => setTutorInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendTutorMessage()}
                            />
                            <button className="bs-btn mb-0" onClick={() => sendTutorMessage()}>Send</button>
                        </div>
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                            {['Explain this concept', 'Give me a quiz', 'Study tips', 'Summarize'].map(txt => (
                                <button key={txt} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full whitespace-nowrap transition" onClick={() => sendTutorMessage(txt)}>
                                    {txt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrainSpark;
