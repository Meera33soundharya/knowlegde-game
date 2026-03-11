import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
    Users, DollarSign, Activity, TrendingUp, RefreshCw, Download,
    FileText, CheckCircle, AlertTriangle, Info, Monitor, Database,
    Server, Cloud, Award, Target, Zap, Clock
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        revenue: 0,
        sessions: 0,
        conversion: 0
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
    const [activityFeed, setActivityFeed] = useState([
        { icon: Users, text: 'New user registered', time: '2 min ago', color: 'text-blue-400' },
        { icon: DollarSign, text: 'Payment received: $249', time: '5 min ago', color: 'text-green-400' },
        { icon: FileText, text: 'Report generated successfully', time: '12 min ago', color: 'text-purple-400' },
        { icon: AlertTriangle, text: 'System update completed', time: '18 min ago', color: 'text-yellow-400' }
    ]);

    // Simulated Chart Data
    const salesData = [
        { name: 'Mon', value: 12000 },
        { name: 'Tue', value: 19000 },
        { name: 'Wed', value: 15000 },
        { name: 'Thu', value: 25000 },
        { name: 'Fri', value: 22000 },
        { name: 'Sat', value: 30000 },
        { name: 'Sun', value: 28000 }
    ];

    const trafficData = [
        { name: 'Organic', value: 35, color: '#3B82F6' },
        { name: 'Direct', value: 25, color: '#8B5CF6' },
        { name: 'Social', value: 20, color: '#EC4899' },
        { name: 'Referral', value: 12, color: '#22C55E' },
        { name: 'Email', value: 8, color: '#F97316' }
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Try to get real data if available, or simulate
                const [usersRes, sessionsRes] = await Promise.all([
                    axios.get(`${API_URL}/auth/me`).catch(() => ({ data: {} })),
                    axios.get(`${API_URL}/study/sessions`).catch(() => ({ data: [] }))
                ]);

                // Simulate growing metrics
                setStats({
                    totalUsers: 45678 + Math.floor(Math.random() * 100),
                    revenue: 125340 + Math.floor(Math.random() * 500),
                    sessions: 8234 + (sessionsRes.data?.length || 0),
                    conversion: 3.7
                });
            } catch (error) {
                console.error("Dashboard data fetch failed", error);
            } finally {
                setLoading(false);
                setLastUpdate(new Date().toLocaleTimeString());
            }
        };

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000); // Live update simulation
        return () => clearInterval(interval);
    }, []);

    const MetricCard = ({ title, value, prefix = '', suffix = '', change, icon: Icon, color }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className={`bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 relative overflow-hidden group`}
        >
            <div className={`absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Icon className="w-32 h-32" />
            </div>
            <div className="relative z-10">
                <p className={`${color} text-sm font-bold mb-2 uppercase tracking-wider`}>{title}</p>
                <h3 className="text-4xl font-black text-white mb-2">
                    {prefix}{value.toLocaleString()}{suffix}
                </h3>
                <div className="flex items-center text-sm font-medium">
                    <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded mr-2 inline-flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> {change}
                    </span>
                    <span className="text-slate-400">vs last month</span>
                </div>
            </div>
        </motion.div>
    );

    const ProgressBar = ({ label, value, color }) => (
        <div className="mb-4">
            <div className="flex justify-between mb-2 text-sm font-medium">
                <span className="text-gray-300">{label}</span>
                <span className={color}>{value}%</span>
            </div>
            <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${color === 'text-purple-400' ? 'from-blue-500 to-purple-500' : color === 'text-green-400' ? 'from-green-500 to-emerald-500' : color === 'text-yellow-400' ? 'from-yellow-500 to-orange-500' : 'from-pink-500 to-rose-500'}`}
                />
            </div>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
            <RefreshCw className="w-10 h-10 animate-spin text-purple-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6 md:p-8 font-['Inter'] text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                            Interactive Analytics Dashboard
                        </h1>
                        <p className="text-slate-400 mt-1 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-green-400" />
                            Real-time insights • Last updated: {lastUpdate}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => window.location.reload()} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 border border-white/10">
                            <RefreshCw className="w-4 h-4" /> Refresh
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-purple-500/25">
                            <Download className="w-4 h-4" /> Export Report
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Users"
                        value={stats.totalUsers}
                        change="+12.5%"
                        icon={Users}
                        color="text-blue-400"
                    />
                    <MetricCard
                        title="Revenue"
                        value={stats.revenue}
                        prefix="$"
                        change="+8.2%"
                        icon={DollarSign}
                        color="text-green-400"
                    />
                    <MetricCard
                        title="Active Sessions"
                        value={stats.sessions}
                        change="+0.5%"
                        icon={Zap}
                        color="text-purple-400"
                    />
                    <MetricCard
                        title="Conversion Rate"
                        value={stats.conversion}
                        suffix="%"
                        change="+3.1%"
                        icon={Target}
                        color="text-orange-400"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Sales Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-400" /> Sales Overview
                            </h3>
                            <select className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#ffffff20', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value) => [`$${value}`, 'Sales']}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Traffic Sources */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl"
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-400" /> Traffic Sources
                        </h3>
                        <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={trafficData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {trafficData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#ffffff20', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Goals */}
                    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-red-400" /> Monthly Goals
                        </h3>
                        <ProgressBar label="User Acquisition" value={78} color="text-purple-400" />
                        <ProgressBar label="Revenue Target" value={92} color="text-green-400" />
                        <ProgressBar label="Engagement Rate" value={65} color="text-yellow-400" />
                        <ProgressBar label="Customer Satisfaction" value={88} color="text-pink-400" />
                    </div>

                    {/* Activity Feed */}
                    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" /> Recent Activity
                            </h3>
                            <span className="text-xs text-green-400 animate-pulse">● Live</span>
                        </div>
                        <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                            {activityFeed.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-4 p-3 bg-slate-700/30 rounded-xl border border-white/5 hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className={`p-2 rounded-lg bg-slate-800 ${item.color}`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-white">{item.text}</p>
                                        <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Status Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {[
                        { label: 'API Server', status: 'Online', color: 'text-green-400', icon: Server },
                        { label: 'Database', status: 'Healthy', color: 'text-green-400', icon: Database },
                        { label: 'CDN', status: 'Active', color: 'text-blue-400', icon: Cloud },
                        { label: 'Backup', status: 'Running', color: 'text-yellow-400', icon: CheckCircle },
                    ].map((sys, idx) => (
                        <div key={idx} className="bg-slate-800/30 rounded-xl p-4 flex items-center justify-between border border-white/5">
                            <div className="flex items-center gap-3">
                                <sys.icon className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-300 font-medium">{sys.label}</span>
                            </div>
                            <span className={`text-sm font-bold flex items-center gap-2 ${sys.color}`}>
                                <span className={`w-2 h-2 rounded-full bg-current animate-pulse`}></span>
                                {sys.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
