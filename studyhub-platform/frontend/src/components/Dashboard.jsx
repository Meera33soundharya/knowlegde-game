import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
    Users, DollarSign, Activity, TrendingUp, RefreshCw, Download,
    FileText, CheckCircle, AlertTriangle, Info, Monitor, Database,
    Server, Cloud, Award, Target, Zap, Clock, Cpu, Globe, Zap as Flash
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 45678,
        revenue: 125340,
        sessions: 8234,
        conversion: 3.7
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
    const [activityFeed, setActivityFeed] = useState([
        { icon: Users, text: 'USER_SIG_DET: ASYNC_REGISTER_01', time: '2 min ago', color: 'neon-text-blue' },
        { icon: DollarSign, text: 'CREDIT_LINK: TRANS_SUCCESS_$249', time: '5 min ago', color: 'neon-text-green' },
        { icon: FileText, text: 'CORE_LOG: REPORT_GEN_AUTO', time: '12 min ago', color: 'neon-text-pink' },
        { icon: AlertTriangle, text: 'SYS_INT: UPDATE_SYNC_COMPLETE', time: '18 min ago', color: 'text-yellow-400' }
    ]);

    const salesData = [
        { name: 'MON', value: 12000 },
        { name: 'TUE', value: 19000 },
        { name: 'WED', value: 15000 },
        { name: 'THU', value: 25000 },
        { name: 'FRI', value: 22000 },
        { name: 'SAT', value: 30000 },
        { name: 'SUN', value: 28000 }
    ];

    const trafficData = [
        { name: 'ORGANIC', value: 35, color: '#00FF00' },
        { name: 'DIRECT', value: 25, color: '#00f3ff' },
        { name: 'SOCIAL', value: 20, color: '#ff10f0' },
        { name: 'REFERRAL', value: 12, color: '#39ff14' },
        { name: 'E_MAIL', value: 8, color: '#ffff00' }
    ];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const MetricCard = ({ title, value, prefix = '', suffix = '', change, icon: Icon, colorClass }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 relative group overflow-hidden"
        >
            <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:scale-125 transition-transform">
                <Icon className="w-24 h-24" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Icon className={`w-4 h-4 ${colorClass}`} />
                    <span className="font-mono text-[10px] tracking-[3px] text-white/40 uppercase">{title}</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-4xl font-retro tracking-widest text-white`}>
                        {prefix}{value.toLocaleString()}{suffix}
                    </span>
                </div>
                <div className="font-mono text-[9px] flex items-center gap-2">
                    <span className="text-[#39ff14] bg-[#39ff14]/10 px-1.5 py-0.5 border border-[#39ff14]/30">+{change}</span>
                    <span className="text-white/20 whitespace-nowrap">SRC: INTERNAL_API</span>
                </div>
            </div>
        </motion.div>
    );

    const ProgressRow = ({ label, value, color }) => (
        <div className="mb-6">
            <div className="flex justify-between mb-2 font-mono text-[10px] tracking-widest">
                <span className="text-white/40">{label}</span>
                <span style={{ color }}>{value}%</span>
            </div>
            <div className="h-1 bg-white/5 border border-white/5 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.5, ease: "anticipate" }}
                    style={{ background: color, boxShadow: `0 0 10px ${color}` }}
                    className="h-full"
                />
            </div>
        </div>
    );

    if (loading) return null;

    return (
        <div className="animate-fadeIn">
            {/* Header Section */}
            <div className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                    <h1 className="font-retro text-5xl text-white tracking-[10px] mb-2 uppercase italic">OVERVIEW_MATRX</h1>
                    <div className="flex items-center gap-4 font-mono text-[10px] text-white/40 tracking-[3px]">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></div>SYSTEM_UP</span>
                        <span>•</span>
                        <span>SYNC_TIME: {lastUpdate}</span>
                        <span>•</span>
                        <span className="text-[#39ff14]">SECURE_SOCKET_ACTV</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="cyber-btn text-xs px-4 flex items-center gap-2" onClick={() => window.location.reload()}>
                        <RefreshCw className="w-3 h-3" /> RELOAD_DATA
                    </button>
                    <button className="cyber-btn cyber-btn-primary text-xs px-6 flex items-center gap-2">
                        <Download className="w-3 h-3" /> EXPORT_LOG
                    </button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <MetricCard title="ACTIVE_UNITS" value={stats.totalUsers} change="12.5%" icon={Users} colorClass="neon-text-blue" />
                <MetricCard title="CREDIT_YIELD" value={stats.revenue} prefix="$" change="8.2%" icon={DollarSign} colorClass="neon-text-green" />
                <MetricCard title="PROC_SESSIONS" value={stats.sessions} change="0.5%" icon={Flash} colorClass="neon-text-pink" />
                <MetricCard title="SYNC_EFFICIENCY" value={stats.conversion} suffix="%" change="3.1%" icon={Target} colorClass="text-yellow-400" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Sales Analytics */}
                <div className="glass-panel p-8 border-t-2 border-electric-blue">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="font-retro text-2xl text-white tracking-widest flex items-center gap-3 italic">
                            DATA_STREAM
                        </h3>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 font-mono text-[9px] text-[#00f3ff]">TIME_FRM: 7_DAYS</div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} fontFamily="JetBrains Mono" axisLine={false} tickLine={false} />
                                <YAxis stroke="#ffffff20" fontSize={10} fontFamily="JetBrains Mono" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', borderColor: '#00f3ff', borderRadius: '0px', padding: '10px' }}
                                    itemStyle={{ color: '#00f3ff', fontFamily: 'JetBrains Mono', fontSize: '10px' }}
                                />
                                <Area type="stepAfter" dataKey="value" stroke="#00f3ff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Traffic Distro */}
                <div className="glass-panel p-8 border-t-2 border-[#ff10f0]">
                    <h3 className="font-retro text-2xl text-white tracking-widest flex items-center gap-3 italic mb-10">
                        ORIGIN_MAP
                    </h3>
                    <div className="h-[300px] flex items-center justify-center relative">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                            <Globe className="w-48 h-48 animate-spin-slow" />
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={trafficData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {trafficData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', borderColor: '#ff10f0', borderRadius: '0px', padding: '10px' }}
                                    itemStyle={{ color: '#fff', fontFamily: 'JetBrains Mono', fontSize: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 flex-wrap">
                            {trafficData.map(t => (
                                <div key={t.name} className="flex items-center gap-2 font-mono text-[8px] tracking-tighter opacity-60">
                                    <div className="w-1.5 h-1.5" style={{ background: t.color }}></div>
                                    {t.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quota Progress */}
                <div className="glass-panel p-8 border-l-4 border-yellow-400">
                    <h3 className="font-retro text-2xl text-white tracking-widest flex items-center gap-3 italic mb-8">
                        QUOTA_STATUS
                    </h3>
                    <ProgressRow label="ACQ_PROTOCOL_B" value={78} color="#00f3ff" />
                    <ProgressRow label="YIELD_TARGET_ALPHA" value={92} color="#00ff00" />
                    <ProgressRow label="SYNC_RATIO_Z" value={65} color="#ffff00" />
                    <ProgressRow label="INTEGRITY_INDEX" value={88} color="#ff10f0" />
                </div>

                {/* Event Logs */}
                <div className="glass-panel p-8 border-l-4 border-[#39ff14]">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-retro text-2xl text-white tracking-widest flex items-center gap-3 italic">
                            EVENT_PIPE
                        </h3>
                        <span className="font-mono text-[8px] text-[#39ff14] animate-pulse">>> LIVE_FEED</span>
                    </div>
                    <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {activityFeed.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-start gap-4 p-4 border border-white/5 bg-white/5 hover:border-[#39ff14]/30 hover:bg-[#39ff14]/5 transition-all group"
                            >
                                <div className={`p-2 bg-black/40 border border-white/10 group-hover:border-[#39ff14]/50 transition-colors`}>
                                    <item.icon className="w-4 h-4 text-white/40 group-hover:text-[#39ff14]" />
                                </div>
                                <div className="flex-1">
                                    <p className={`font-mono text-[10px] tracking-wider mb-1 ${item.color}`}>{item.text}</p>
                                    <p className="font-mono text-[8px] text-white/20 uppercase">STAMP: {item.time}</p>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-[#39ff14]"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Clusters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                    { label: 'API_NODE', val: 'ONLINE', col: '#39ff14', icon: Server },
                    { label: 'DB_CLUSTER', val: 'SYNCED', col: '#39ff14', icon: Database },
                    { label: 'CDN_GRID', val: 'ROUTED', col: '#00f3ff', icon: Cloud },
                    { label: 'BK_PROTOCOL', val: 'STABLE', col: '#ffff00', icon: CheckCircle },
                ].map((sys, idx) => (
                    <div key={idx} className="glass-panel p-4 flex items-center justify-between group cursor-help">
                        <div className="flex items-center gap-3">
                            <sys.icon className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                            <span className="font-mono text-[9px] tracking-[2px] text-white/40">{sys.label}</span>
                        </div>
                        <span className="font-mono text-[9px] font-bold" style={{ color: sys.col }}>{sys.val}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
