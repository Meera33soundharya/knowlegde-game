import React, { useMemo } from 'react';
import { Line, Radar } from 'react-chartjs-2';
import {
    Zap,
    Target,
    Shield,
    Crown,
    Brain,
    Activity,
    Clock
} from 'lucide-react';

const OverviewView = ({ history, coins, level, accuracy, totalXP, totalQuizzes }) => {

    const { skillData, activityData, radarOptions } = useMemo(() => {
        // Chart Data for Overview
        const sData = {
            labels: ['Memory', 'Speed', 'Logic', 'Knowledge', 'Focus', 'Precision'],
            datasets: [{
                label: 'Player Stats',
                data: [85, 70 + (history.length * 2), 60 + (accuracy / 2), 40 + (level * 5), 75, accuracy],
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                borderColor: '#38bdf8',
                pointBackgroundColor: '#38bdf8',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#38bdf8',
                borderWidth: 2,
            }]
        };

        const rOptions = {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#94a3b8', font: { size: 12 } },
                    ticks: { display: false, backdropColor: 'transparent' }
                }
            },
            plugins: { legend: { display: false } }
        };

        const aData = {
            labels: history.slice(0, 7).map((_, i) => `Q${i + 1}`),
            datasets: [{
                label: 'Score',
                data: history.slice(0, 7).map(h => h.score),
                borderColor: '#f43f5e',
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        return { skillData: sData, activityData: aData, radarOptions: rOptions };
    }, [history, accuracy, level]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total XP', value: totalXP.toLocaleString(), sub: 'Next Lvl: ' + (1000 - (totalXP % 1000)) + ' XP', icon: Zap, color: 'text-yellow-400', border: 'border-yellow-400/30', bg: 'bg-yellow-400/10' },
                    { label: 'Accuracy', value: `${accuracy}%`, sub: 'Battle Efficiency', icon: Target, color: 'text-cyan-400', border: 'border-cyan-400/30', bg: 'bg-cyan-400/10' },
                    { label: 'Quizzes', value: totalQuizzes, sub: 'Missions Complete', icon: Shield, color: 'text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-400/10' },
                    { label: 'Rank', value: `#${Math.max(1, 100 - history.length)}`, sub: 'Global Standing', icon: Crown, color: 'text-purple-400', border: 'border-purple-400/30', bg: 'bg-purple-400/10' }
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-black/20 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`text-xs font-mono px-2 py-1 rounded bg-black/20 ${stat.color}`}>+24%</div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-400">{stat.label}</div>
                        <div className="text-xs text-slate-500 mt-2 font-mono">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Radar Chart (Skills) */}
                <div className="lg:col-span-1 p-6 rounded-2xl bg-[#1e293b]/50 border border-[#334155] backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-cyan-400" />
                        Neural Profile
                    </h3>
                    <div className="aspect-square relative">
                        <Radar data={skillData} options={radarOptions} />
                    </div>
                </div>

                {/* Activity Graph */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#1e293b]/50 border border-[#334155] backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-rose-400" />
                        Performance Log
                    </h3>
                    <div className="h-[300px] w-full">
                        <Line data={activityData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                            },
                            plugins: { legend: { display: false } }
                        }} />
                    </div>
                </div>

            </div>

            {/* Recent Missions List */}
            <div className="p-6 rounded-2xl bg-[#1e293b]/50 border border-[#334155] backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    Recent Ops
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#334155] text-slate-400 text-sm uppercasetracking-wider">
                                <th className="pb-3 pl-4">Mission</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3">Score</th>
                                <th className="pb-3 text-right pr-4">XP Gained</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {history.length === 0 ? (
                                <tr><td colSpan="4" className="py-4 text-center text-slate-500 font-mono">No data logs found.</td></tr>
                            ) : history.slice(0, 5).map((h, i) => (
                                <tr key={i} className="group hover:bg-[#334155]/50 transition-colors border-b border-[#334155]/50 last:border-0">
                                    <td className="py-4 pl-4 font-medium text-white group-hover:text-cyan-400 transition-colors">{h.topic || 'Unknown Sector'}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${h.score > (h.total / 2) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {h.score > (h.total / 2) ? 'COMPLETED' : 'FAILED'}
                                        </span>
                                    </td>
                                    <td className="py-4 text-slate-300 font-mono">{h.score}/{h.total}</td>
                                    <td className="py-4 pr-4 text-right text-yellow-400 font-mono">+{h.score * 10}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OverviewView;
