import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CreditCard, FileText, HelpCircle, Target, Brain, Shuffle,
    Keyboard, Code, Calculator, Timer, Trophy, ArrowLeft, ArrowRight,
    Settings, Zap, CheckCircle, LogOut
} from 'lucide-react';
import './MegaLearnHub.css';

const MegaLearnHub = () => {
    const navigate = useNavigate();
    // Global App State
    const [activeScreen, setActiveScreen] = useState('hub');
    const [globalStats, setGlobalStats] = useState({ totalScore: 1250, streak: 5, gamesPlayed: 42, level: 7 });

    // ---------------------------------------------------------
    // 1. FLASHCARDS
    // ---------------------------------------------------------
    const [flashState, setFlashState] = useState({
        difficulty: 'easy',
        index: 0,
        flipped: false,
        known: 0,
        practice: 0
    });

    const shuffleDeck = (deck) => [...deck].sort(() => Math.random() - 0.5);

    const [flashcardsData, setFlashcardsData] = useState({
        easy: [{ q: "Capital of France?", a: "Paris" }, { q: "2 + 2 = ?", a: "4" }, { q: "Largest planet?", a: "Jupiter" }, { q: "Water formula?", a: "H2O" }],
        medium: [{ q: "Speed of light?", a: "299,792 km/s" }, { q: "Chemical symbol Au?", a: "Gold" }, { q: "Pythagorean theorem?", a: "a² + b² = c²" }],
        hard: [{ q: "Planck constant?", a: "6.626 × 10⁻³⁴ J·s" }, { q: "Avogadro's number?", a: "6.022 × 10²³" }]
    });

    const handleFlashAction = (action) => {
        const currentDeck = flashcardsData[flashState.difficulty];
        if (action === 'shuffle') {
            setFlashcardsData(prev => ({
                ...prev,
                [flashState.difficulty]: shuffleDeck(prev[flashState.difficulty])
            }));
            setFlashState(p => ({ ...p, index: 0, flipped: false }));
            return;
        }
        if (action === 'know') {
            setFlashState(p => ({ ...p, known: p.known + 1, flipped: false, index: (p.index + 1) % currentDeck.length }));
        } else if (action === 'practice') {
            setFlashState(p => ({ ...p, practice: p.practice + 1, flipped: false, index: (p.index + 1) % currentDeck.length }));
        }
    };

    // ---------------------------------------------------------
    // 2. NOTES
    // ---------------------------------------------------------
    const [notes, setNotes] = useState([]);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
    const [noteDraft, setNoteDraft] = useState({ title: '', content: '' });

    // ---------------------------------------------------------
    // 3. QUIZ
    // ---------------------------------------------------------
    const [quizState, setQuizState] = useState({ isActive: false, questions: [], current: 0, score: 0, combo: 0, timeLeft: 30, completed: false });

    const startQuiz = () => {
        const newQuestions = [
            { q: "Capital of Japan?", opts: ["Seoul", "Tokyo", "Beijing", "Bangkok"], correct: 1 },
            { q: "Closest planet to Sun?", opts: ["Venus", "Mercury", "Mars", "Earth"], correct: 1 },
            { q: "15 x 8 = ?", opts: ["110", "120", "130", "140"], correct: 1 },
            { q: "Symbol for Gold?", opts: ["Ag", "Au", "Fe", "Cu"], correct: 1 }
        ];
        setQuizState({ isActive: true, questions: newQuestions, current: 0, score: 0, combo: 0, timeLeft: 30, completed: false });
    };

    const handleQuizAnswer = (idx) => {
        const q = quizState.questions[quizState.current];
        const isCorrect = idx === q.correct;
        setQuizState(prev => {
            const newScore = isCorrect ? prev.score + (10 * (prev.combo + 1)) : prev.score;
            const newCombo = isCorrect ? prev.combo + 1 : 0;
            return { ...prev, score: newScore, combo: newCombo };
        });
        setTimeout(() => {
            setQuizState(prev => {
                if (prev.current >= prev.questions.length - 1) {
                    setGlobalStats(gs => ({ ...gs, totalScore: gs.totalScore + prev.score, gamesPlayed: gs.gamesPlayed + 1 }));
                    return { ...prev, completed: true, isActive: false };
                }
                return { ...prev, current: prev.current + 1, timeLeft: 30 };
            })
        }, 500);
    };

    // ---------------------------------------------------------
    // 4. GAMES logic
    // ---------------------------------------------------------
    const [matchingState, setMatchingState] = useState({ items: [], selected: [], matched: [], attempts: 0 });
    const [memoryState, setMemoryState] = useState({ cards: [], flipped: [], matched: [], moves: 0, time: 0, isPlaying: false });
    const [scrambleState, setScrambleState] = useState({ current: null, score: 0, streak: 0, input: '', message: '' });
    const [typingState, setTypingState] = useState({ text: "", input: "", wpm: 0, accuracy: 100, time: 0, isActive: false, startTime: null });

    const initMatching = () => {
        const pairs = [{ q: "H2O", a: "Water" }, { q: "CO2", a: "Carbon Dioxide" }, { q: "NaCl", a: "Salt" }, { q: "O2", a: "Oxygen" }, { q: "Fe", a: "Iron" }, { q: "Au", a: "Gold" }];
        const items = [];
        pairs.forEach((p, i) => { items.push({ id: `q-${i}`, text: p.q, pairId: i }); items.push({ id: `a-${i}`, text: p.a, pairId: i }); });
        setMatchingState({ items: items.sort(() => Math.random() - 0.5), selected: [], matched: [], attempts: 0 });
    };

    const handleMatchClick = (idx) => {
        if (matchingState.selected.includes(idx) || matchingState.matched.includes(matchingState.items[idx].pairId)) return;
        const newSelected = [...matchingState.selected, idx];
        setMatchingState(prev => ({ ...prev, selected: newSelected }));
        if (newSelected.length === 2) {
            setMatchingState(prev => ({ ...prev, attempts: prev.attempts + 1 }));
            const [first, second] = newSelected;
            if (matchingState.items[first].pairId === matchingState.items[second].pairId) {
                setMatchingState(prev => ({ ...prev, matched: [...prev.matched, prev.items[first].pairId], selected: [] }));
                if (matchingState.matched.length + 1 === matchingState.items.length / 2) {
                    setGlobalStats(gs => ({ ...gs, totalScore: gs.totalScore + 50, gamesPlayed: gs.gamesPlayed + 1 }));
                }
            } else {
                setTimeout(() => setMatchingState(prev => ({ ...prev, selected: [] })), 800);
            }
        }
    };

    const initMemory = () => {
        const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🥝', '🍒'];
        const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
        setMemoryState({ cards, flipped: [], matched: [], moves: 0, time: 0, isPlaying: true });
    };

    const handleMemoryClick = (idx) => {
        if (memoryState.flipped.length >= 2 || memoryState.flipped.includes(idx) || memoryState.matched.includes(idx)) return;
        const newFlipped = [...memoryState.flipped, idx];
        setMemoryState(prev => ({ ...prev, flipped: newFlipped }));
        if (newFlipped.length === 2) {
            setMemoryState(prev => ({ ...prev, moves: prev.moves + 1 }));
            const [first, second] = newFlipped;
            if (memoryState.cards[first] === memoryState.cards[second]) {
                setMemoryState(prev => {
                    const newMatched = [...prev.matched, first, second];
                    if (newMatched.length === prev.cards.length) setGlobalStats(gs => ({ ...gs, totalScore: gs.totalScore + 100, gamesPlayed: gs.gamesPlayed + 1 }));
                    return { ...prev, matched: newMatched, flipped: [] };
                });
            } else {
                setTimeout(() => setMemoryState(prev => ({ ...prev, flipped: [] })), 800);
            }
        }
    };

    const initScramble = () => {
        const words = [{ w: "JAVASCRIPT", h: "Language" }, { w: "REACT", h: "Library" }, { w: "EDUCATION", h: "Learning" }, { w: "SCIENCE", h: "Nature" }];
        const word = words[Math.floor(Math.random() * words.length)];
        setScrambleState({ current: word, input: '', score: 0, streak: 0, message: '' });
    };

    const checkScramble = () => {
        if (scrambleState.input.toUpperCase() === scrambleState.current.w) {
            setGlobalStats(gs => ({ ...gs, totalScore: gs.totalScore + 10 }));
            setScrambleState(prev => ({ ...prev, score: prev.score + 10, streak: prev.streak + 1, message: 'Correct!', input: '' }));
            setTimeout(initScramble, 1000);
        } else {
            setScrambleState(prev => ({ ...prev, streak: 0, message: 'Try Again!' }));
        }
    };

    const startTyping = () => {
        setTypingState({
            text: "The quick brown fox jumps over the lazy dog. Practice makes perfect. Keep typing to improve your speed and accuracy.",
            input: "", wpm: 0, accuracy: 100, time: 0, isActive: true, startTime: Date.now()
        });
    };

    const handleTypingInput = (e) => {
        const val = e.target.value;
        setTypingState(prev => {
            if (val.length === prev.text.length) {
                setGlobalStats(gs => ({ ...gs, totalScore: gs.totalScore + prev.wpm }));
                return { ...prev, input: val, isActive: false };
            }
            let correct = 0;
            for (let i = 0; i < val.length; i++) if (val[i] === prev.text[i]) correct++;
            const accuracy = val.length === 0 ? 100 : Math.round((correct / val.length) * 100);
            return { ...prev, input: val, accuracy };
        });
    };

    // ---------------------------------------------------------
    // 5. TOOLS logic
    // ---------------------------------------------------------
    const [codeState, setCodeState] = useState({ html: '<h1>Hello World</h1>', css: 'body { color: white; }', js: 'console.log("Hi");', activeTab: 'html', output: '' });
    const [calcDisplay, setCalcDisplay] = useState('0');
    const [pomodoroState, setPomodoroState] = useState({ mode: 'work', minutes: 25, seconds: 0, isRunning: false, sessions: 0 });

    // Timers
    useEffect(() => {
        let interval;
        if (quizState.isActive && !quizState.completed && quizState.timeLeft > 0) {
            interval = setInterval(() => setQuizState(prev => {
                if (prev.timeLeft <= 1) return { ...prev, current: prev.current + 1, timeLeft: 30, combo: 0 };
                return { ...prev, timeLeft: prev.timeLeft - 1 };
            }), 1000);
        }
        return () => clearInterval(interval);
    }, [quizState.isActive, quizState.completed]);

    useEffect(() => {
        let interval;
        if (memoryState.isPlaying && memoryState.matched.length < memoryState.cards.length) {
            interval = setInterval(() => setMemoryState(prev => ({ ...prev, time: prev.time + 1 })), 1000);
        }
        return () => clearInterval(interval);
    }, [memoryState.isPlaying, memoryState.matched.length]);

    useEffect(() => {
        let interval;
        if (typingState.isActive) {
            interval = setInterval(() => {
                const timeElapsed = (Date.now() - typingState.startTime) / 1000;
                setTypingState(prev => {
                    const words = prev.input.trim().split(/\s+/).length;
                    const wpm = Math.round((words / timeElapsed) * 60) || 0;
                    return { ...prev, time: Math.floor(timeElapsed), wpm };
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [typingState.isActive]);

    useEffect(() => {
        let interval;
        if (pomodoroState.isRunning) {
            interval = setInterval(() => {
                setPomodoroState(prev => {
                    if (prev.seconds === 0) {
                        if (prev.minutes === 0) {
                            alert("Pomodoro Timer Finished!");
                            return { ...prev, isRunning: false, minutes: prev.mode === 'work' ? 25 : 5, seconds: 0, sessions: prev.sessions + (prev.mode === 'work' ? 1 : 0) };
                        }
                        return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                    }
                    return { ...prev, seconds: prev.seconds - 1 };
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [pomodoroState.isRunning]);

    // Leaderboard Data
    const leaderboardData = [
        { rank: 1, name: "CyberNinja", score: 15420, level: 42 },
        { rank: 2, name: "PixelMaster", score: 14200, level: 38 },
        { rank: 3, name: "CodeWizard", score: 12850, level: 35 },
        { rank: 4, name: "DataQueen", score: 11200, level: 31 },
        { rank: 5, name: "GlitchHunter", score: 10500, level: 29 },
    ];

    // Persistence
    useEffect(() => {
        const saved = localStorage.getItem('megaLearnhubReactData');
        if (saved) {
            const data = JSON.parse(saved);
            setGlobalStats(gs => ({ ...gs, ...data.globalStats }));
            setNotes(data.notes || []);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('megaLearnhubReactData', JSON.stringify({ globalStats, notes }));
    }, [globalStats, notes]);

    // Nav Items
    const navItems = [
        { id: 'flashcards', label: 'FLASHCARDS', icon: CreditCard, color: '#39ff14' },
        { id: 'notes', label: 'NOTES', icon: FileText, color: '#00f3ff' },
        { id: 'quiz', label: 'QUIZ ARENA', icon: HelpCircle, color: '#ff10f0' },
        { id: 'matching', label: 'MATCHING', icon: Target, color: '#fffc00' },
        { id: 'memory', label: 'MEMORY', icon: Brain, color: '#39ff14' },
        { id: 'scramble', label: 'SCRAMBLE', icon: Shuffle, color: '#00f3ff' },
        { id: 'typing', label: 'TYPING', icon: Keyboard, color: '#ff10f0' },
        { id: 'code', label: 'CODE LAB', icon: Code, color: '#fffc00' },
        { id: 'calculator', label: 'CALCULATOR', icon: Calculator, color: '#39ff14' },
        { id: 'pomodoro', label: 'POMODORO', icon: Timer, color: '#00f3ff' },
        { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy, color: '#ff10f0' },
        { id: 'back', label: 'BACK', icon: ArrowLeft, color: '#ffffff' },
    ];

    const quizTopics = [
        { name: 'Science', emoji: '🧪', color: '#00ff00' },
        { name: 'History', emoji: '📜', color: '#ff00ff' },
        { name: 'Math', emoji: '📐', color: '#00ffff' },
        { name: 'Tech', emoji: '💻', color: '#ffff00' },
        { name: 'Art', emoji: '🎨', color: '#ff0000' },
        { name: 'Music', emoji: '🎵', color: '#0000ff' },
        { name: 'Sports', emoji: '🏆', color: '#ffa500' },
        { name: 'Space', emoji: '🚀', color: '#800080' },
        { name: 'Nature', emoji: '🌿', color: '#008000' },
    ];

    const handleNavClick = (id) => {
        if (id === 'back') navigate('/dashboard');
        else setActiveScreen(id);
    };

    return (
        <div className="mega-hub-wrapper">
            {/* Top Gradient Banner */}
            <div className="mega-header-banner">
                <div className="mega-logo" onClick={() => setActiveScreen('hub')} style={{ cursor: 'pointer' }}>MEGA LEARNHUB</div>
                <div className="mega-tagline">LEARN. MANAGE. SECURE.</div>
            </div>

            {/* Stats Dashboard */}
            <div className="mega-stats-bar">
                <div className="mega-stat-card">
                    <div className="mega-stat-value">{globalStats.totalScore}</div>
                    <div className="mega-stat-label">TOTAL SCORE</div>
                </div>
                <div className="mega-stat-card">
                    <div className="mega-stat-value">{globalStats.streak}</div>
                    <div className="mega-stat-label">WIN STREAK</div>
                </div>
                <div className="mega-stat-card">
                    <div className="mega-stat-value">{globalStats.gamesPlayed}</div>
                    <div className="mega-stat-label">GAMES PLAYED</div>
                </div>
                <div className="mega-stat-card">
                    <div className="mega-stat-value">{globalStats.level}</div>
                    <div className="mega-stat-label">CURRENT LEVEL</div>
                </div>
            </div>

            {/* Navigation Hub */}
            <div className="mega-nav-hub">
                {navItems.map(item => (
                    <div
                        key={item.id}
                        className={`mega-nav-item ${activeScreen === item.id ? 'active' : ''}`}
                        onClick={() => handleNavClick(item.id)}
                    >
                        <item.icon className="mega-nav-icon" style={{ color: item.color }} />
                        <span className="mega-nav-label">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="mega-content-area fade-in">
                {activeScreen === 'hub' && (
                    <div className="mega-card">
                        <h2 className="mega-card-header">QUIZ ARENA</h2>
                        <div className="topic-grid">
                            {quizTopics.map((topic, i) => (
                                <div key={i} className="topic-card" onClick={() => setActiveScreen('quiz')}>
                                    <span className="topic-emoji">{topic.emoji}</span>
                                    <span className="topic-name" style={{ color: topic.color }}>{topic.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FLASHCARDS SCREEN */}
                {activeScreen === 'flashcards' && (
                    <div className="mega-card">
                        <h2 className="mega-card-header">FLASHCARDS</h2>
                        <div className="mega-diff-select">
                            {['easy', 'medium', 'hard'].map(d => (
                                <button key={d} className={`mega-diff-btn ${flashState.difficulty === d ? 'selected' : ''}`} onClick={() => setFlashState(p => ({ ...p, difficulty: d, index: 0, flipped: false }))}>{d.toUpperCase()}</button>
                            ))}
                        </div>
                        <div className="mega-flashcard-wrapper">
                            <div className="mega-flashcard-container">
                                <div className={`mega-flashcard ${flashState.flipped ? 'flipped' : ''}`} onClick={() => setFlashState(p => ({ ...p, flipped: !p.flipped }))}>
                                    <div className="mega-flashcard-face mega-flashcard-front">
                                        <div className="mega-flashcard-text">{flashcardsData[flashState.difficulty][flashState.index]?.q}</div>
                                        <div className="mega-flashcard-hint">CLICK TO FLIP</div>
                                    </div>
                                    <div className="mega-flashcard-face mega-flashcard-back">
                                        <div className="mega-flashcard-text">{flashcardsData[flashState.difficulty][flashState.index]?.a}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mega-fc-controls-area">
                            <div className="mega-fc-nav-row">
                                <button className="mega-btn-mini" onClick={() => setFlashState(p => ({ ...p, index: Math.max(0, p.index - 1), flipped: false }))}>&lt; PREV</button>
                                <div className="mega-fc-counter">{flashState.index + 1} / {flashcardsData[flashState.difficulty].length}</div>
                                <button className="mega-btn-mini" onClick={() => setFlashState(p => ({ ...p, index: (p.index + 1) % flashcardsData[flashState.difficulty].length, flipped: false }))}>NEXT &gt;</button>
                            </div>
                            <div className="mega-fc-action-row" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button className="mega-btn" style={{ flex: 1, background: '#00ff88' }} onClick={() => handleFlashAction('know')}>KNOW IT</button>
                                <button className="mega-btn" style={{ flex: 1, background: '#ff3366' }} onClick={() => handleFlashAction('practice')}>PRACTICE</button>
                                <button className="mega-btn" style={{ flex: 1, background: '#00f3ff' }} onClick={() => handleFlashAction('shuffle')}>SHUFFLE</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MATCHING SCREEN */}
                {activeScreen === 'matching' && (
                    <div className="mega-card">
                        <h2 className="mega-card-header">MATCHING GAME</h2>
                        <div className="text-center mb-6"><button className="mega-btn" onClick={initMatching}>NEW GAME</button></div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                            {matchingState.items.map((item, i) => (
                                <div key={item.id}
                                    className={`topic-card ${matchingState.selected.includes(i) ? 'active' : ''}`}
                                    style={{ padding: '15px', borderColor: matchingState.matched.includes(item.pairId) ? '#00ff00' : '' }}
                                    onClick={() => handleMatchClick(i)}>
                                    {matchingState.matched.includes(item.pairId) || matchingState.selected.includes(i) ? item.text : '?'}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* MEMORY SCREEN */}
                {activeScreen === 'memory' && (
                    <div className="mega-card">
                        <h2 className="mega-card-header">MEMORY GAME</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <span>Moves: {memoryState.moves}</span><span>Time: {memoryState.time}s</span>
                        </div>
                        <div className="text-center mb-6"><button className="mega-btn" onClick={initMemory}>NEW GAME</button></div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
                            {memoryState.cards.map((card, i) => (
                                <div key={i} className="topic-card" style={{ padding: '20px', fontSize: '2rem' }} onClick={() => handleMemoryClick(i)}>
                                    {memoryState.flipped.includes(i) || memoryState.matched.includes(i) ? card : '?'}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SCRAMBLE SCREEN */}
                {activeScreen === 'scramble' && (
                    <div className="mega-card text-center">
                        <h2 className="mega-card-header">WORD SCRAMBLE</h2>
                        {!scrambleState.current ? (
                            <button className="mega-btn" onClick={initScramble}>START GAME</button>
                        ) : (
                            <div>
                                <div style={{ fontSize: '4rem', color: '#fffc00', marginBottom: '20px', letterSpacing: '10px' }}>
                                    {scrambleState.current.w.split('').sort(() => Math.random() - 0.5).join('')}
                                </div>
                                <p style={{ marginBottom: '20px' }}>Hint: {scrambleState.current.h}</p>
                                <input className="mega-input" style={{ textAlign: 'center', width: '300px' }} value={scrambleState.input} onChange={e => setScrambleState({ ...scrambleState, input: e.target.value })} />
                                <div style={{ marginTop: '20px' }}><button className="mega-btn" onClick={checkScramble}>CHECK</button></div>
                                <p style={{ marginTop: '20px', fontSize: '1.5rem' }}>{scrambleState.message}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* TYPING SCREEN */}
                {activeScreen === 'typing' && (
                    <div className="mega-card">
                        <h2 className="mega-card-header">TYPING TEST</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
                            <span>WPM: {typingState.wpm}</span><span>Accuracy: {typingState.accuracy}%</span><span>Time: {typingState.time}s</span>
                        </div>
                        {!typingState.isActive && !typingState.input ? (
                            <div className="text-center"><button className="mega-btn" onClick={startTyping}>START TEST</button></div>
                        ) : (
                            <div>
                                <div style={{ padding: '20px', border: '1px solid #333', marginBottom: '20px', fontSize: '1.2rem', lineHeight: '1.6' }}>
                                    {typingState.text.split('').map((char, i) => {
                                        let color = 'white';
                                        if (i < typingState.input.length) color = typingState.input[i] === char ? '#00ff88' : '#ff3366';
                                        return <span key={i} style={{ color }}>{char}</span>
                                    })}
                                </div>
                                <textarea className="mega-input" style={{ height: '100px' }} autoFocus disabled={!typingState.isActive} value={typingState.input} onChange={handleTypingInput} placeholder="Type here..." />
                            </div>
                        )}
                    </div>
                )}

                {/* CODE SCREEN */}
                {activeScreen === 'code' && (
                    <div className="mega-card">
                        <h2 className="mega-card-header">CODE LAB</h2>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            {['html', 'css', 'js'].map(t => (
                                <button key={t} className={`mega-diff-btn ${codeState.activeTab === t ? 'selected' : ''}`} onClick={() => setCodeState({ ...codeState, activeTab: t })}>{t.toUpperCase()}</button>
                            ))}
                            <button className="mega-btn" style={{ marginLeft: 'auto', padding: '5px 15px' }} onClick={() => {
                                const src = `<html><style>${codeState.css}</style><body>${codeState.html}<script>${codeState.js}</script></body></html>`;
                                const iframe = document.getElementById('preview-frame');
                                if (iframe) iframe.srcdoc = src;
                            }}>RUN ▶</button>
                        </div>
                        <textarea className="mega-input" style={{ height: '200px', fontFamily: 'monospace' }} value={codeState[codeState.activeTab]} onChange={e => setCodeState({ ...codeState, [codeState.activeTab]: e.target.value })} spellCheck="false" />
                        <iframe id="preview-frame" style={{ width: '100%', height: '200px', background: 'white', border: 'none', marginTop: '20px', borderRadius: '4px' }} title="preview" />
                    </div>
                )}

                {/* CALCULATOR SCREEN */}
                {activeScreen === 'calculator' && (
                    <div className="mega-card">
                        <h2 className="mega-card-header">CALCULATOR</h2>
                        <div style={{ maxWidth: '300px', margin: '0 auto', background: '#000', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                            <div style={{ background: '#111', padding: '15px', textAlign: 'right', fontSize: '2rem', marginBottom: '15px', color: '#00ff00', fontFamily: 'monospace', borderRadius: '4px' }}>{calcDisplay}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map(b => (
                                    <button key={b} className="mega-btn" style={{ padding: '15px 5px', fontSize: '1rem' }} onClick={() => {
                                        if (b === 'C') setCalcDisplay('0');
                                        else if (b === '=') { try { setCalcDisplay(eval(calcDisplay).toString()) } catch { setCalcDisplay('Error') } }
                                        else setCalcDisplay(p => p === '0' ? b : p + b);
                                    }}>{b}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* LEADERBOARD SCREEN */}
                {activeScreen === 'leaderboard' && (
                    <div className="mega-card text-center">
                        <h2 className="mega-card-header">LEADERBOARD</h2>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #00ff00', color: '#00ff00' }}>
                                    <th style={{ padding: '15px' }}>RANK</th><th style={{ padding: '15px' }}>PLAYER</th><th style={{ padding: '15px', textAlign: 'right' }}>SCORE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.map((p, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                                        <td style={{ padding: '15px' }}>#{p.rank}</td><td style={{ padding: '15px' }}>{p.name}</td><td style={{ padding: '15px', textAlign: 'right', color: '#00f3ff' }}>{p.score.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr style={{ background: 'rgba(0,255,0,0.1)' }}>
                                    <td style={{ padding: '15px' }}>#42</td><td style={{ padding: '15px' }}>YOU</td><td style={{ padding: '15px', textAlign: 'right', color: '#00f3ff' }}>{globalStats.totalScore.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* POMODORO SCREEN */}
                {activeScreen === 'pomodoro' && (
                    <div className="mega-card text-center">
                        <h2 className="mega-card-header">POMODORO</h2>
                        <div style={{ fontSize: '6rem', color: '#fffc00', margin: '40px 0' }}>{String(pomodoroState.minutes).padStart(2, '0')}:{String(pomodoroState.seconds).padStart(2, '0')}</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <button className="mega-btn" onClick={() => setPomodoroState(p => ({ ...p, isRunning: !p.isRunning }))}>{pomodoroState.isRunning ? 'PAUSE' : 'START'}</button>
                            <button className="mega-btn" style={{ background: '#444' }} onClick={() => setPomodoroState(p => ({ ...p, isRunning: false, minutes: 25, seconds: 0 }))}>RESET</button>
                        </div>
                    </div>
                )}

                {/* NOTES SCREEN */}
                {activeScreen === 'notes' && (
                    <div className="mega-card">
                        <h2 className="mega-card-header">MY NOTES</h2>
                        {!isEditingNote ? (
                            <div>
                                <button className="mega-btn mb-8" onClick={() => { setIsEditingNote(true); setNoteDraft({ title: '', content: '' }); setCurrentNoteIndex(null); }}>+ NEW NOTE</button>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                    {notes.length === 0 && <p style={{ gridColumn: 'span 2', textAlign: 'center', opacity: '0.5' }}>No notes yet.</p>}
                                    {notes.map((note, i) => (
                                        <div key={i} className="topic-card" style={{ textAlign: 'left' }} onClick={() => { setNoteDraft(note); setCurrentNoteIndex(i); setIsEditingNote(true); }}>
                                            <h3 style={{ color: '#00ff00', marginBottom: '5px' }}>{note.title}</h3>
                                            <p style={{ opacity: '0.7', fontSize: '0.9rem' }}>{note.content.substring(0, 50)}...</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <input className="mega-input" placeholder="Title" value={noteDraft.title} onChange={e => setNoteDraft({ ...noteDraft, title: e.target.value })} />
                                <textarea className="mega-input" style={{ height: '200px' }} placeholder="Content" value={noteDraft.content} onChange={e => setNoteDraft({ ...noteDraft, content: e.target.value })} />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="mega-btn" style={{ background: '#00ff88' }} onClick={() => {
                                        const updated = currentNoteIndex !== null ? notes.map((n, i) => i === currentNoteIndex ? noteDraft : n) : [noteDraft, ...notes];
                                        setNotes(updated); setIsEditingNote(false);
                                    }}>SAVE</button>
                                    <button className="mega-btn" style={{ background: '#ff3366' }} onClick={() => setIsEditingNote(false)}>CANCEL</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* QUIZ SCREEN */}
                {activeScreen === 'quiz' && (
                    <div className="mega-card">
                        <h2 className="mega-card-header">QUIZ ARENA</h2>
                        {!quizState.isActive && !quizState.completed ? (
                            <div className="text-center p-10"><button className="mega-btn" onClick={startQuiz}>START QUIZ</button></div>
                        ) : quizState.completed ? (
                            <div className="text-center p-10"><h3 style={{ fontSize: '3rem', color: '#00ff00' }}>COMPLETE!</h3><p style={{ fontSize: '1.5rem', margin: '20px 0' }}>Score: {quizState.score}</p><button className="mega-btn" onClick={startQuiz}>PLAY AGAIN</button></div>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                                    <span>Q: {quizState.current + 1}/{quizState.questions.length}</span><span style={{ color: '#fffc00' }}>{quizState.timeLeft}s</span>
                                </div>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>{quizState.questions[quizState.current].q}</h3>
                                <div style={{ display: 'grid', gap: '10px' }}>
                                    {quizState.questions[quizState.current].opts.map((opt, i) => (
                                        <button key={i} className="topic-card" style={{ padding: '15px', textAlign: 'left' }} onClick={() => handleQuizAnswer(i)}>{opt}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MegaLearnHub;
