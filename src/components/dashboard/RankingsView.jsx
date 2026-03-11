import React from 'react';
import { Trophy, Medal, User, Crown } from 'lucide-react';

const RankingsView = ({ history }) => {
    // Mock Leaderboard Data (mixed with real user data if possible, but for now mock mainly)
    const leaderboard = [
        { rank: 1, name: 'CyberWiz_99', xp: 12500, level: 12, avatar: 'CY' },
        { rank: 2, name: 'NeonCoder', xp: 11200, level: 11, avatar: 'NE' },
        { rank: 3, name: 'Player One', xp: Math.max(500, history.length * 100), level: Math.floor((history.length * 100) / 1000) + 1, avatar: 'P1', isUser: true },
        { rank: 4, name: 'DataHawk', xp: 9800, level: 9, avatar: 'DA' },
        { rank: 5, name: 'NullPointer', xp: 8500, level: 8, avatar: 'NU' },
    ].sort((a, b) => b.xp - a.xp).map((p, i) => ({ ...p, rank: i + 1 }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <div className="p-6 rounded-2xl bg-[#1e293b]/50 border border-[#334155] backdrop-blur-sm text-center">
                <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Global Leaderboard</h2>
                <p className="text-slate-400">Compete with other cyber-scholars for glory.</p>
            </div>

            <div className="space-y-4">
                {leaderboard.map((user) => (
                    <div
                        key={user.rank}
                        className={`group flex items-center p-4 rounded-xl border transition-all duration-300 ${user.isUser
                            ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.1)] transform scale-[1.02]'
                            : 'bg-[#1e293b]/40 border-[#334155] hover:bg-[#1e293b]/60'}`}
                    >
                        <div className="w-12 flex justify-center font-bold text-xl text-slate-500">
                            {user.rank === 1 ? <Medal className="w-6 h-6 text-yellow-400" /> :
                                user.rank === 2 ? <Medal className="w-6 h-6 text-slate-300" /> :
                                    user.rank === 3 ? <Medal className="w-6 h-6 text-amber-600" /> :
                                        user.rank}
                        </div>

                        <div className="ml-4 w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center border border-slate-500 font-bold text-white text-xs">
                            {user.avatar}
                        </div>

                        <div className="ml-4 flex-1">
                            <div className={`font-bold ${user.isUser ? 'text-cyan-400' : 'text-white'}`}>
                                {user.name} {user.isUser && '(You)'}
                            </div>
                            <div className="text-xs text-slate-400">Level {user.level}</div>
                        </div>

                        <div className="text-right">
                            <div className="font-mono font-bold text-white">{user.xp.toLocaleString()} XP</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RankingsView;
