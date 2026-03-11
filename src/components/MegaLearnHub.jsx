import React, { useState, useEffect, useRef } from 'react';
import {
    CreditCard, FileText, HelpCircle, Target, Brain, Shuffle,
    Keyboard, Code, Calculator, Timer, Trophy, ArrowLeft, ArrowRight
} from 'lucide-react';
import './MegaLearnHub.css';

const MegaLearnHub = ({ onBack, initialScreen = 'flashcards' }) => {
    // Global App State
    const [activeScreen, setActiveScreen] = useState(initialScreen);
    const [globalStats, setGlobalStats] = useState({ totalScore: 1250, streak: 5, gamesPlayed: 42, level: 7 });

    // ---------------------------------------------------------
    // 1. FLASHCARDS
    // ---------------------------------------------------------
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

    // Shuffle helper
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

        // Auto move next logic is handled by setting index above, but if we want to just track stats:
        // current implementation moves to next card.
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

    // ---------------------------------------------------------
    // 4. GAMES
    // ---------------------------------------------------------
    // Matching
    const [matchingState, setMatchingState] = useState({ items: [], selected: [], matched: [], attempts: 0 });
    // Memory
    const [memoryState, setMemoryState] = useState({ cards: [], flipped: [], matched: [], moves: 0, time: 0, isPlaying: false });
    // Scramble
    const [scrambleState, setScrambleState] = useState({ current: null, score: 0, streak: 0, input: '', message: '' });
    // Typing
    const [typingState, setTypingState] = useState({ text: "", input: "", wpm: 0, accuracy: 100, time: 0, isActive: false, startTime: null });

    // ---------------------------------------------------------
    // 5. TOOLS
    // ---------------------------------------------------------
    const [codeState, setCodeState] = useState({ html: '<h1>Hello World</h1>', css: 'body { color: white; }', js: 'console.log("Hi");', activeTab: 'html', output: '' });
    const [calcDisplay, setCalcDisplay] = useState('0');
    const [pomodoroState, setPomodoroState] = useState({ mode: 'work', minutes: 25, seconds: 0, isRunning: false, sessions: 0 });

    // ---------------------------------------------------------
    // 6. LEADERBOARD
    // ---------------------------------------------------------
    const leaderboardData = [
        { rank: 1, name: "CyberNinja", score: 15420, level: 42 },
        { rank: 2, name: "PixelMaster", score: 14200, level: 38 },
        { rank: 3, name: "CodeWizard", score: 12850, level: 35 },
        { rank: 4, name: "DataQueen", score: 11200, level: 31 },
        { rank: 5, name: "GlitchHunter", score: 10500, level: 29 },
    ];

    // ---------------------------------------------------------
    // EFFECTS & PERSISTENCE
    // ---------------------------------------------------------
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

    // Timers
    useEffect(() => { /* Quiz Timer */
        let interval;
        if (quizState.isActive && !quizState.completed && quizState.timeLeft > 0) {
            interval = setInterval(() => setQuizState(prev => {
                if (prev.timeLeft <= 1) return { ...prev, current: prev.current + 1, timeLeft: 30, combo: 0 };
                return { ...prev, timeLeft: prev.timeLeft - 1 };
            }), 1000);
        }
        return () => clearInterval(interval);
    }, [quizState.isActive, quizState.completed]);

    useEffect(() => { /* Memory Timer */
        let interval;
        if (memoryState.isPlaying && memoryState.matched.length < memoryState.cards.length) {
            interval = setInterval(() => setMemoryState(prev => ({ ...prev, time: prev.time + 1 })), 1000);
        }
        return () => clearInterval(interval);
    }, [memoryState.isPlaying, memoryState.matched.length]);

    useEffect(() => { /* Typing Timer */
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

    useEffect(() => { /* Pomodoro Timer */
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

    // ---------------------------------------------------------
    // GAME LOGIC
    // ---------------------------------------------------------

    // MATCHING
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

    // MEMORY
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

    // SCRAMBLE
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

    // TYPING
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
            // Accuracy calc
            let correct = 0;
            for (let i = 0; i < val.length; i++) if (val[i] === prev.text[i]) correct++;
            const accuracy = val.length === 0 ? 100 : Math.round((correct / val.length) * 100);
            return { ...prev, input: val, accuracy };
        });
    };

    // ---------------------------------------------------------
    // RENDER HELPERS
    // ---------------------------------------------------------

    // QUIZ HANDLERS
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
    const renderNav = () => (
        <div className="mega-nav-container">
            <div className="mega-nav-tabs">
                {[
                    { id: 'flashcards', label: 'FLASHCARDS', icon: CreditCard },
                    { id: 'notes', label: 'NOTES', icon: FileText },
                    { id: 'quiz', label: 'QUIZ ARENA', icon: HelpCircle },
                    { id: 'matching', label: 'MATCHING', icon: Target },
                    { id: 'memory', label: 'MEMORY', icon: Brain },
                    { id: 'scramble', label: 'SCRAMBLE', icon: Shuffle },
                    { id: 'typing', label: 'TYPING', icon: Keyboard },
                    { id: 'code', label: 'CODE LAB', icon: Code },
                    { id: 'calculator', label: 'CALCULATOR', icon: Calculator },
                    { id: 'pomodoro', label: 'POMODORO', icon: Timer },
                    { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy },
                ].map(tab => (
                    <button key={tab.id} className={`mega-nav-tab ${activeScreen === tab.id ? 'active' : ''}`} onClick={() => setActiveScreen(tab.id)}>
                        <tab.icon className="w-5 h-5 mb-1" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="mega-hub-wrapper">
            <button style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100 }}
                className="mega-btn mega-btn-primary" onClick={onBack}>
                <ArrowLeft size={16} style={{ marginRight: '8px', display: 'inline' }} /> Back
            </button>
            <div className="mega-orb orb-1"></div><div className="mega-orb orb-2"></div><div className="mega-orb orb-3"></div>
            <div className="mega-container text-white">
                <header className="mega-header">
                    <h1 className="mega-logo">MEGA LEARNHUB</h1>
                    <p className="mega-tagline">Ultimate Learning Platform</p>
                </header>

                <div className="mega-stats-bar">
                    {Object.entries(globalStats).map(([k, v]) => (
                        <div key={k} className="mega-stat-card">
                            <div className="mega-stat-value">{v}</div>
                            <div className="mega-stat-label">{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                        </div>
                    ))}
                </div>

                {renderNav()}

                <main className="fade-in">
                    {/* FLASHCARDS SCREEN */}
                    {activeScreen === 'flashcards' && (
                        <div className="mega-card" style={{ borderColor: '#39ff14' }}>
                            <h2 className="mega-card-header" style={{ marginBottom: '20px' }}>FLASHCARDS</h2>

                            {/* Difficulty Tabs */}
                            <div className="mega-diff-select">
                                {['easy', 'medium', 'hard'].map(d => (
                                    <button
                                        key={d}
                                        className={`mega-diff-btn ${flashState.difficulty === d ? 'selected' : ''}`}
                                        onClick={() => setFlashState(p => ({ ...p, difficulty: d, index: 0, flipped: false }))}
                                    >
                                        {d.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            {/* Main Flashcard */}
                            <div className="mega-flashcard-wrapper">
                                <div className="mega-flashcard-container">
                                    <div
                                        className={`mega-flashcard ${flashState.flipped ? 'flipped' : ''}`}
                                        onClick={() => setFlashState(p => ({ ...p, flipped: !p.flipped }))}
                                    >
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

                            {/* Navigation & Controls */}
                            <div className="mega-fc-controls-area">
                                <div className="mega-fc-nav-row">
                                    <button className="mega-btn-mini" onClick={() => setFlashState(p => ({ ...p, index: Math.max(0, p.index - 1), flipped: false }))}>&lt; PREV</button>
                                    <div className="mega-fc-counter">
                                        {flashState.index + 1} / {flashcardsData[flashState.difficulty].length}
                                    </div>
                                    <button className="mega-btn-mini" onClick={() => setFlashState(p => ({ ...p, index: (p.index + 1) % flashcardsData[flashState.difficulty].length, flipped: false }))}>NEXT &gt;</button>
                                </div>

                                <div className="mega-fc-action-row">
                                    <button className="mega-btn-action success" onClick={() => handleFlashAction('know')}>
                                        <span className="mr-2">✓</span> KNOW IT
                                    </button>
                                    <button className="mega-btn-action danger" onClick={() => handleFlashAction('practice')}>
                                        <span className="mr-2">✗</span> PRACTICE
                                    </button>
                                    <button className="mega-btn-action info" onClick={() => handleFlashAction('shuffle')}>
                                        <span className="mr-2">⟳</span> SHUFFLE
                                    </button>
                                </div>
                            </div>

                            {/* Progress Footer */}
                            <div className="mega-fc-footer">
                                <div className="mega-fc-stat-box">
                                    <div className="value success-text">{flashState.known}</div>
                                    <div className="label">KNOWN</div>
                                </div>
                                <div className="mega-fc-stat-box">
                                    <div className="value danger-text">{flashState.practice}</div>
                                    <div className="label">PRACTICE</div>
                                </div>
                                <div className="mega-fc-stat-box">
                                    <div className="value">{Math.round(((flashState.index + 1) / flashcardsData[flashState.difficulty].length) * 100)}%</div>
                                    <div className="label">PROGRESS</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MATCHING SCREEN */}
                    {activeScreen === 'matching' && (
                        <div className="mega-card">
                            <h2 className="mega-card-header">MATCHING GAME</h2>
                            <div className="text-center mb-6"><button className="mega-btn mega-btn-primary" onClick={initMatching}>NEW GAME</button></div>
                            <div className="mega-game-grid">
                                {matchingState.items.map((item, i) => (
                                    <div key={item.id}
                                        className={`mega-game-item ${matchingState.selected.includes(i) ? 'selected' : ''} ${matchingState.matched.includes(item.pairId) ? 'matched' : ''}`}
                                        onClick={() => handleMatchClick(i)}
                                    >
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
                            <div className="flex justify-between mb-4 px-10">
                                <div>Moves: {memoryState.moves}</div><div>Time: {memoryState.time}s</div>
                            </div>
                            <div className="text-center mb-6"><button className="mega-btn mega-btn-primary" onClick={initMemory}>NEW GAME</button></div>
                            <div className="mega-game-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '600px', margin: '0 auto' }}>
                                {memoryState.cards.map((card, i) => (
                                    <div key={i}
                                        className={`mega-game-item ${memoryState.flipped.includes(i) || memoryState.matched.includes(i) ? 'selected' : ''}`}
                                        onClick={() => handleMemoryClick(i)}
                                    >
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
                                <button className="mega-btn mega-btn-primary" onClick={initScramble}>START GAME</button>
                            ) : (
                                <div>
                                    <div className="text-6xl font-bold text-yellow-400 mb-8 tracking-widest">
                                        {scrambleState.current.w.split('').sort(() => Math.random() - 0.5).join('')}
                                    </div>
                                    <p className="mb-4 text-xl">Hint: {scrambleState.current.h}</p>
                                    <input className="mega-input text-center text-2xl w-1/2 mx-auto" value={scrambleState.input} onChange={e => setScrambleState({ ...scrambleState, input: e.target.value })} />
                                    <div className="mt-4"><button className="mega-btn mega-btn-primary" onClick={checkScramble}>CHECK</button></div>
                                    <p className="mt-4 text-xl font-bold">{scrambleState.message}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TYPING SCREEN */}
                    {activeScreen === 'typing' && (
                        <div className="mega-card">
                            <h2 className="mega-card-header">TYPING TEST</h2>
                            <div className="flex justify-around mb-8 text-xl font-bold">
                                <div>WPM: {typingState.wpm}</div><div>Accuracy: {typingState.accuracy}%</div><div>Time: {typingState.time}s</div>
                            </div>
                            {!typingState.isActive && !typingState.input ? (
                                <div className="text-center"><button className="mega-btn mega-btn-primary" onClick={startTyping}>START TEST</button></div>
                            ) : (
                                <div>
                                    <div className="p-6 border border-gray-600 mb-6 text-lg leading-relaxed font-mono">
                                        {typingState.text.split('').map((char, i) => {
                                            let color = 'white';
                                            if (i < typingState.input.length) color = typingState.input[i] === char ? '#00ff88' : '#ff3366';
                                            return <span key={i} style={{ color }}>{char}</span>
                                        })}
                                    </div>
                                    <textarea className="mega-input font-mono" autoFocus disabled={!typingState.isActive} value={typingState.input} onChange={handleTypingInput} placeholder="Type here..." />
                                </div>
                            )}
                        </div>
                    )}

                    {/* CODE SCREEN */}
                    {activeScreen === 'code' && (
                        <div className="mega-card">
                            <h2 className="mega-card-header">CODE LAB</h2>
                            <div className="mega-code-editor">
                                <div className="mega-code-header">
                                    {['html', 'css', 'js'].map(t => (
                                        <button key={t} className={`mega-diff-btn ${codeState.activeTab === t ? 'selected' : ''}`} onClick={() => setCodeState({ ...codeState, activeTab: t })}>{t.toUpperCase()}</button>
                                    ))}
                                    <button className="mega-btn mega-btn-primary ml-auto py-1 px-4 text-sm" onClick={() => {
                                        const src = `<html><style>${codeState.css}</style><body>${codeState.html}<script>${codeState.js}</script></body></html>`;
                                        const iframe = document.getElementById('preview-frame');
                                        if (iframe) iframe.srcdoc = src;
                                    }}>RUN ▶</button>
                                </div>
                                <textarea className="mega-code-area" value={codeState[codeState.activeTab]} onChange={e => setCodeState({ ...codeState, [codeState.activeTab]: e.target.value })} spellCheck="false" />
                            </div>
                            <iframe id="preview-frame" className="mega-preview-frame" title="preview" />
                        </div>
                    )}

                    {/* CALCULATOR SCREEN */}
                    {activeScreen === 'calculator' && (
                        <div className="mega-card">
                            <h2 className="mega-card-header">CALCULATOR</h2>
                            <div className="mega-calc-grid">
                                <div className="mega-calc-display">{calcDisplay}</div>
                                {['C', '(', ')', '/'].map(b => <button key={b} className={`mega-calc-btn ${b === 'C' ? 'clear' : 'operator'}`} onClick={() => { if (b === 'C') setCalcDisplay('0'); else setCalcDisplay(p => p === '0' ? b : p + b); }}>{b}</button>)}
                                {['7', '8', '9', '*'].map(b => <button key={b} className="mega-calc-btn" onClick={() => setCalcDisplay(p => p === '0' ? '7' : p + '7')}>{b}</button>)}
                                {['4', '5', '6', '-'].map(b => <button key={b} className="mega-calc-btn" onClick={() => setCalcDisplay(p => p === '0' ? '4' : p + '4')}>{b}</button>)}
                                {['1', '2', '3', '+'].map(b => <button key={b} className="mega-calc-btn" onClick={() => setCalcDisplay(p => p === '0' ? '1' : p + '1')}>{b}</button>)}
                                {['0', '.', '='].map(b => <button key={b} className={`mega-calc-btn ${b === '=' ? 'equals' : ''}`} onClick={() => { if (b === '=') { try { setCalcDisplay(eval(calcDisplay).toString()) } catch { setCalcDisplay('Error') } } else setCalcDisplay(p => p === '0' ? b : p + b) }}>{b}</button>)}
                            </div>
                        </div>
                    )}

                    {/* LEADERBOARD SCREEN */}
                    {activeScreen === 'leaderboard' && (
                        <div className="mega-card text-center">
                            <h2 className="mega-card-header">LEADERBOARD</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-[#39ff14] text-[#39ff14]">
                                            <th className="p-4 text-xl">RANK</th>
                                            <th className="p-4 text-xl">PLAYER</th>
                                            <th className="p-4 text-xl text-right">SCORE</th>
                                            <th className="p-4 text-xl text-right">LEVEL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboardData.map((player, index) => (
                                            <tr key={index} className="border-b border-gray-800 hover:bg-white/5 transition">
                                                <td className="p-4 text-2xl font-bold">#{player.rank}</td>
                                                <td className="p-4 text-xl">{player.name}</td>
                                                <td className="p-4 text-xl text-right font-mono text-[#00f3ff]">{player.score.toLocaleString()}</td>
                                                <td className="p-4 text-xl text-right">{player.level}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-[#39ff14]/10 border-t-2 border-[#39ff14]">
                                            <td className="p-4 text-2xl font-bold">#42</td>
                                            <td className="p-4 text-xl">YOU</td>
                                            <td className="p-4 text-xl text-right font-mono text-[#00f3ff]">{globalStats.totalScore.toLocaleString()}</td>
                                            <td className="p-4 text-xl text-right">{globalStats.level}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* POMODORO SCREEN */}
                    {activeScreen === 'pomodoro' && (
                        <div className="mega-card text-center">
                            <h2 className="mega-card-header">POMODORO TIMER</h2>
                            <div className="text-[6rem] font-mono text-yellow-400 my-8">{String(pomodoroState.minutes).padStart(2, '0')}:{String(pomodoroState.seconds).padStart(2, '0')}</div>
                            <div className="flex justify-center gap-4">
                                <button className="mega-btn mega-btn-primary" onClick={() => setPomodoroState(p => ({ ...p, isRunning: !p.isRunning }))}>{pomodoroState.isRunning ? 'PAUSE' : 'START'}</button>
                                <button className="mega-btn mega-btn-secondary" onClick={() => setPomodoroState(p => ({ ...p, isRunning: false, minutes: 25, seconds: 0 }))}>RESET</button>
                            </div>
                        </div>
                    )}

                    {/* NOTES SCREEN */}
                    {activeScreen === 'notes' && (
                        <div className="mega-card">
                            <h2 className="mega-card-header">MY NOTES</h2>
                            {!isEditingNote ? (
                                <div>
                                    <button className="mega-btn mega-btn-primary mb-8" onClick={() => { setIsEditingNote(true); setNoteDraft({ title: '', content: '' }); setCurrentNoteIndex(null); }}>+ NEW NOTE</button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {notes.length === 0 && <p className="col-span-2 text-center opacity-50">No notes yet.</p>}
                                        {notes.map((note, i) => (
                                            <div key={i} className="bg-black/20 border border-gray-700 p-4 hover:border-pink-500 cursor-pointer" onClick={() => { setNoteDraft(note); setCurrentNoteIndex(i); setIsEditingNote(true); }}>
                                                <h3 className="font-bold text-green-400 mb-1">{note.title}</h3>
                                                <p className="text-sm opacity-70 line-clamp-2">{note.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <input className="mega-input mb-4" placeholder="Title" value={noteDraft.title} onChange={e => setNoteDraft({ ...noteDraft, title: e.target.value })} />
                                    <textarea className="mega-input h-48 font-mono mb-4" placeholder="Content" value={noteDraft.content} onChange={e => setNoteDraft({ ...noteDraft, content: e.target.value })} />
                                    <div className="flex gap-4">
                                        <button className="mega-btn mega-btn-success" onClick={() => {
                                            const updated = currentNoteIndex !== null ? notes.map((n, i) => i === currentNoteIndex ? noteDraft : n) : [noteDraft, ...notes];
                                            setNotes(updated); setIsEditingNote(false);
                                        }}>SAVE</button>
                                        <button className="mega-btn mega-btn-danger" onClick={() => setIsEditingNote(false)}>CANCEL</button>
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
                                <div className="text-center p-10">
                                    <button className="mega-btn mega-btn-primary text-xl" onClick={startQuiz}>START QUIZ</button>
                                </div>
                            ) : quizState.completed ? (
                                <div className="text-center p-10">
                                    <h3 className="text-4xl text-green-400 mb-4">COMPLETE!</h3>
                                    <p className="text-2xl mb-8">Score: {quizState.score}</p>
                                    <button className="mega-btn mega-btn-primary" onClick={startQuiz}>PLAY AGAIN</button>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-between mb-8 text-xl font-bold">
                                        <span>Q: {quizState.current + 1}/{quizState.questions.length}</span>
                                        <span>Score: {quizState.score}</span>
                                        <span className="text-yellow-400">{quizState.timeLeft}s</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-6">{quizState.questions[quizState.current].q}</h3>
                                    <div className="grid gap-4">
                                        {quizState.questions[quizState.current].opts.map((opt, i) => (
                                            <button key={i} className="p-4 border border-gray-600 hover:bg-blue-900/50 text-left rounded" onClick={() => handleQuizAnswer(i)}>{opt}</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MegaLearnHub;
