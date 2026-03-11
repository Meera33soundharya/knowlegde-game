import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import {
    Activity,
    BarChart3,
    Trophy,
    Target,
    Zap,
    User,
    Bell
} from 'lucide-react';
import OverviewView from './dashboard/OverviewView';
import StatisticsView from './dashboard/StatisticsView';
import QuestsView from './dashboard/QuestsView';
import RankingsView from './dashboard/RankingsView';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ModernDashboard = ({ onClose, history = [], coins = 0 }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    // Derived Stats (passed down to Overview)
    const totalXP = coins * 10;
    const level = Math.floor(totalXP / 1000) + 1;
    // const progressToNext = ((totalXP % 1000) / 1000) * 100; // Not used in top stats directly anymore
    const totalQuizzes = history.length;

    // Calculate Accuracy
    const totalPossibleScore = history.reduce((acc, h) => acc + (h.total || 0), 0);
    const totalScore = history.reduce((acc, h) => acc + (h.score || 0), 0);
    const accuracy = totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0;



    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewView
                    history={history}
                    coins={coins}
                    level={level}
                    accuracy={accuracy}
                    totalXP={totalXP}
                    totalQuizzes={totalQuizzes}
                />;
            case 'stats':
                return <StatisticsView history={history} coins={coins} />;
            case 'quests':
                return <QuestsView history={history} level={level} />;
            case 'leaderboard':
                return <RankingsView history={history} />;
            default:
                return <OverviewView history={history} />;
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a] text-white font-sans overflow-hidden z-50 flex">

            {/* Sidebar */}
            <aside className="w-20 lg:w-64 bg-[#1e293b] border-r border-[#334155] flex flex-col items-center lg:items-stretch py-6 transition-all">
                <div className="mb-10 px-4 flex items-center justify-center lg:justify-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Zap className="text-white w-6 h-6" />
                    </div>
                    <span className="hidden lg:block font-bold text-xl tracking-wider">NEO<span className="text-cyan-400">DASH</span></span>
                </div>

                <nav className="flex-1 w-full space-y-2 px-2">
                    {[
                        { id: 'overview', icon: Activity, label: 'Overview' },
                        { id: 'stats', icon: BarChart3, label: 'Statistics' },
                        { id: 'quests', icon: Target, label: 'Quests' },
                        { id: 'leaderboard', icon: Trophy, label: 'Rankings' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full p-3 rounded-xl flex items-center justify-center lg:justify-start gap-4 transition-all duration-300 ${activeTab === item.id
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                : 'text-slate-400 hover:bg-[#334155] hover:text-white'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="hidden lg:block font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-[#334155]">
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                            <User className="w-5 h-5 text-slate-300" />
                        </div>
                        <div className="hidden lg:block overflow-hidden">
                            <p className="text-sm font-bold truncate">Player One</p>
                            <p className="text-xs text-cyan-400">Lvl {level} Cyber-Scholar</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-[#0f172a] relative overflow-hidden">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* Header */}
                <header className="h-20 border-b border-[#334155] flex items-center justify-between px-8 relative z-10 backdrop-blur-sm bg-[#0f172a]/80">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        {activeTab === 'overview' && 'Command Center'}
                        {activeTab === 'stats' && 'Performance Analytics'}
                        {activeTab === 'quests' && 'Mission Control'}
                        {activeTab === 'leaderboard' && 'Hall of Fame'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg hover:bg-[#334155] text-slate-400 hover:text-white transition">
                            <div className="relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            </div>
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 font-medium text-sm flex items-center gap-2"
                        >
                            System Exit
                        </button>
                    </div>
                </header>

                {/* Dashboard View */}
                <div className="flex-1 overflow-y-auto p-8 relative z-10">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default ModernDashboard;

