import React, { useState, useEffect } from 'react';
import { Target, Flame, Trophy, CheckCircle, Lock, ArrowRight, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

const QuestsView = ({ history = [], level = 1 }) => {
    const [filter, setFilter] = useState('all');

    // Initial State with Quests
    const [quests, setQuests] = useState([
        {
            id: 1,
            category: 'Ignite',
            title: 'Morning Spark',
            description: 'Complete a quiz before 10 AM',
            progress: 1,
            total: 1,
            reward: '50 XP',
            status: 'claimable',
            icon: Flame,
            color: 'text-orange-400',
            bg: 'bg-orange-400/10',
            border: 'border-orange-400/30'
        },
        {
            id: 2,
            category: 'Grow',
            title: 'Knowledge Builder',
            description: 'Maintain 80% accuracy in last 3 quizzes',
            progress: 0,
            total: 3,
            reward: '150 XP',
            status: 'active',
            icon: Target,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            border: 'border-emerald-400/30'
        },
        {
            id: 3,
            category: 'Quest',
            title: 'Cyber Scholar',
            description: 'Reach Level 5',
            progress: 0,
            total: 5,
            reward: 'Badge',
            status: 'active',
            icon: Trophy,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            border: 'border-purple-400/30'
        },
        {
            id: 4,
            category: 'Ignite',
            title: 'Streak Master',
            description: '7 day streak',
            progress: 4, // Mocked for now
            total: 7,
            reward: '200 XP',
            status: 'active',
            icon: Flame,
            color: 'text-orange-400',
            bg: 'bg-orange-400/10',
            border: 'border-orange-400/30'
        }
    ]);

    // Update progress based on real props
    useEffect(() => {
        setQuests(prevQuests => prevQuests.map(q => {
            // Knowledge Builder Logic
            if (q.id === 2) {
                if (q.status === 'completed') return q;

                const last3 = history.slice(0, 3); // Assuming history is ordered from most recent to oldest
                let highAccuracyCount = 0;
                last3.forEach(h => {
                    const acc = h.total > 0 ? (h.score / h.total) : 0;
                    if (acc >= 0.8) highAccuracyCount++;
                });

                // If history is less than 3, we just show current high accuracy count
                // But description implies "3 consecutive". Let's just count how many of the last N (up to 3) were good.
                // Or to be strict: check if absolute last 3 were good.
                // Let's go with "count of high accuracy in reset history" for simplicity or just "last 3".

                const progress = highAccuracyCount;
                const isComplete = progress >= 3;

                return {
                    ...q,
                    progress: progress,
                    status: isComplete ? 'claimable' : 'active'
                };
            }

            // Cyber Scholar Logic
            if (q.id === 3) {
                if (q.status === 'completed') return q;
                const progress = Math.min(level, 5);
                return {
                    ...q,
                    progress: progress,
                    status: progress >= 5 ? 'claimable' : 'active'
                };
            }

            return q;
        }));
    }, [history, level]);

    const handleClaim = (id) => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        setQuests(prev => prev.map(q =>
            q.id === id ? { ...q, status: 'completed' } : q
        ));
    };

    const filteredQuests = quests.filter(q => {
        if (filter === 'all') return true;
        if (filter === 'active') return q.status === 'active' || q.status === 'claimable';
        if (filter === 'completed') return q.status === 'completed';
        return true;
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Flame className="w-6 h-6 text-orange-400" />
                        <h3 className="text-lg font-bold text-white">Daily Ignite</h3>
                    </div>
                    <p className="text-sm text-slate-300 mb-4">Keep your streak alive!</p>
                    <div className="text-3xl font-bold text-white">4 Day Streak</div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Target className="w-6 h-6 text-emerald-400" />
                        <h3 className="text-lg font-bold text-white">Growth Path</h3>
                    </div>
                    <p className="text-sm text-slate-300 mb-4">Mastery progress.</p>
                    <div className="text-3xl font-bold text-white">Lvl 3 Scholar</div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-500/30 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy className="w-6 h-6 text-purple-400" />
                        <h3 className="text-lg font-bold text-white">Achievements</h3>
                    </div>
                    <p className="text-sm text-slate-300 mb-4">Badges earned.</p>
                    <div className="text-3xl font-bold text-white">
                        {quests.filter(q => q.status === 'completed').length} / {quests.length}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-8 mb-4">
                <h3 className="text-xl font-bold text-white">Mission Log</h3>
                <div className="flex bg-[#1e293b] p-1 rounded-lg border border-[#334155]">
                    {['all', 'active', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === f
                                ? 'bg-cyan-500 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quest List */}
            <div className="space-y-4">
                {filteredQuests.map((quest) => (
                    <div key={quest.id} className={`group relative overflow-hidden p-6 rounded-xl border ${quest.border} ${quest.bg} hover:bg-opacity-20 transition-all duration-300`}>
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg bg-black/20 ${quest.color}`}>
                                    <quest.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{quest.title}</h4>
                                    <p className="text-sm text-slate-400">{quest.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Status/Action Button */}
                                {quest.status === 'claimable' ? (
                                    <button
                                        onClick={() => handleClaim(quest.id)}
                                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg flex items-center gap-2 animate-bounce shadow-lg shadow-yellow-400/20 transition-all"
                                    >
                                        <Gift className="w-4 h-4" />
                                        Claim Rewards
                                    </button>
                                ) : quest.status === 'completed' ? (
                                    <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg flex items-center gap-2 font-bold">
                                        <CheckCircle className="w-4 h-4" />
                                        Completed
                                    </div>
                                ) : (
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-300">
                                            {quest.progress} / {quest.total}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">{quest.reward}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress Bar (Only for active quests) */}
                        {quest.status === 'active' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
                                <div
                                    className="h-full bg-cyan-500 transition-all duration-1000"
                                    style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                ))}

                {filteredQuests.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-[#1e293b]/30 rounded-xl border border-[#334155] border-dashed">
                        No quests found in this category.
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestsView;
