import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, TrendingDown, Users, DollarSign, Activity, BarChart3,
    RefreshCw, Calendar, Download, Settings, Home, PieChart, FileText,
    ShoppingCart, MessageCircle, Bell, Search, ChevronDown, Cpu, Zap, Globe
} from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';

// Register Chart.js components
ChartJS.register(...registerables);

const AnalyticsDashboard = () => {
    const [timeFilter, setTimeFilter] = useState('7d');
    const [stats, setStats] = useState({
        revenue: 45231,
        revenueChange: 12.5,
        users: 8456,
        usersChange: 8.2,
        conversionRate: 3.24,
        conversionChange: -2.1,
        sessions: 12483,
        sessionsChange: 15.3
    });

    const [activities, setActivities] = useState([
        { id: 1, type: 'sale', message: 'SIG_DET: NODE_PAYMENT_REC_01', time: '2 min ago', icon: ShoppingCart, color: 'neon-text-green' },
        { id: 2, type: 'user', message: 'AUTH: SARAH_ADMIN_07_LINKED', time: '5 min ago', icon: Users, color: 'neon-text-blue' },
        { id: 3, type: 'message', message: 'COMM: INCOMING_ENCRYPTED_MSG', time: '12 min ago', icon: MessageCircle, color: 'neon-text-pink' },
        { id: 4, type: 'sale', message: 'DATA: PACKET_TRANS_COMPL_$299', time: '18 min ago', icon: DollarSign, color: 'neon-text-green' },
        { id: 5, type: 'user', message: 'SYS: MICHAEL_PROFILE_MODIFIED', time: '25 min ago', icon: Users, color: 'neon-text-blue' },
    ]);

    // Chart Refs
    const lineChartRef = useRef(null);
    const barChartRef = useRef(null);
    const doughnutChartRef = useRef(null);
    const areaChartRef = useRef(null);

    const [charts, setCharts] = useState({});

    useEffect(() => {
        createCharts();
        return () => { Object.values(charts).forEach(chart => chart?.destroy()); };
    }, []);

    const createCharts = () => {
        const themeColor = '#39ff14';
        const gridColor = 'rgba(255, 255, 255, 0.05)';
        const textColor = '#888';

        if (lineChartRef.current) {
            const lineCtx = lineChartRef.current.getContext('2d');
            const lineChart = new ChartJS(lineCtx, {
                type: 'line',
                data: {
                    labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                    datasets: [{
                        label: 'YIELD',
                        data: [4200, 5100, 4800, 6200, 7100, 6800, 7500],
                        borderColor: '#00f3ff',
                        backgroundColor: 'rgba(0, 243, 255, 0.1)',
                        tension: 0,
                        fill: true,
                        pointRadius: 4,
                        borderWidth: 2,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'JetBrains Mono' } } },
                        x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'JetBrains Mono' } } }
                    }
                }
            });

            if (barChartRef.current) {
                const barCtx = barChartRef.current.getContext('2d');
                const barChart = new ChartJS(barCtx, {
                    type: 'bar',
                    data: {
                        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
                        datasets: [{
                            data: [650, 890, 1200, 1100, 1400, 1650],
                            backgroundColor: '#39ff14',
                            borderColor: '#39ff14',
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'JetBrains Mono' } } },
                            x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'JetBrains Mono' } } }
                        }
                    }
                });

                if (doughnutChartRef.current) {
                    const doughnutCtx = doughnutChartRef.current.getContext('2d');
                    const doughnutChart = new ChartJS(doughnutCtx, {
                        type: 'doughnut',
                        data: {
                            labels: ['ORG', 'DIR', 'REF', 'SOC'],
                            datasets: [{
                                data: [45, 25, 20, 10],
                                backgroundColor: ['#39ff14', '#00f3ff', '#ff10f0', '#ffff00'],
                                borderWidth: 0,
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'bottom', labels: { color: textColor, font: { family: 'JetBrains Mono', size: 10 } } }
                            },
                        }
                    });

                    if (areaChartRef.current) {
                        const areaCtx = areaChartRef.current.getContext('2d');
                        const areaChart = new ChartJS(areaCtx, {
                            type: 'line',
                            data: {
                                labels: ['00', '04', '08', '12', '16', '20', '24'],
                                datasets: [{
                                    data: [120, 90, 450, 890, 1200, 980, 600],
                                    borderColor: '#ff10f0',
                                    backgroundColor: 'rgba(255, 16, 240, 0.1)',
                                    fill: true,
                                    tension: 0.4,
                                    pointRadius: 0,
                                    borderWidth: 2,
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'JetBrains Mono' } } },
                                    x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'JetBrains Mono' } } }
                                }
                            }
                        });
                        setCharts({ lineChart, barChart, doughnutChart, areaChart });
                    }
                }
            }
        }
    };

    const StatCard = ({ title, value, change, icon: Icon, colorClass }) => {
        const isPositive = change >= 0;
        return (
            <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-l-4 border-[#39ff14]">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="font-mono text-[10px] text-white/40 uppercase tracking-[3px] mb-2">{title}</p>
                        <p className="font-retro text-3xl text-white tracking-widest">{value}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/10">
                        <Icon className={`w-5 h-5 ${colorClass}`} />
                    </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                    {isPositive ? <TrendingUp size={12} className="text-green-500" /> : <TrendingDown size={12} className="text-red-500" />}
                    <span className={isPositive ? 'text-green-500' : 'text-red-500'}>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
                    <span className="text-white/20">VS_PREV_NODE</span>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="p-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="font-retro text-5xl text-white tracking-[10px] uppercase italic mb-2">ADV_ANALYTX</h1>
                    <div className="flex items-center gap-4 font-mono text-[10px] text-white/40 tracking-[3px]">
                        <span className="flex items-center gap-1">NODE_ID: 8456_X</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-bold text-[#39ff14]">SYS_STABLE_100%</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/5 border border-white/10 p-1">
                        {['24H', '7D', '30D'].map((filter) => (
                            <button key={filter} onClick={() => setTimeFilter(filter.toLowerCase())}
                                className={`px-4 py-1 font-mono text-[9px] tracking-widest transition-all ${timeFilter === filter.toLowerCase() ? 'bg-[#39ff14] text-black' : 'text-white/40 hover:text-white'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                    <button className="cyber-btn p-2" onClick={() => window.location.reload()}><RefreshCw className="w-4 h-4" /></button>
                    <button className="cyber-btn cyber-btn-primary text-xs px-6 flex items-center gap-2"><Download className="w-3 h-3" /> EXPORT</button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard title="TOT_YIELD" value={`$${stats.revenue.toLocaleString()}`} change={stats.revenueChange} icon={DollarSign} colorClass="neon-text-green" />
                <StatCard title="ACT_NODES" value={stats.users.toLocaleString()} change={stats.usersChange} icon={Users} colorClass="neon-text-blue" />
                <StatCard title="SYNC_RATIO" value={`${stats.conversionRate.toFixed(2)}%`} change={stats.conversionChange} icon={TrendingUp} colorClass="neon-text-pink" />
                <StatCard title="TOT_CYCLES" value={stats.sessions.toLocaleString()} change={stats.sessionsChange} icon={Activity} colorClass="text-yellow-400" />
            </div>

            {/* Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="glass-panel p-8 border-t-2 border-electric-blue">
                    <h3 className="font-retro text-2xl text-white tracking-widest mb-10 italic">YIELD_TRENDS</h3>
                    <div className="h-64"><canvas ref={lineChartRef}></canvas></div>
                </div>
                <div className="glass-panel p-8 border-t-2 border-[#39ff14]">
                    <h3 className="font-retro text-2xl text-white tracking-widest mb-10 italic">NODE_GROWTH</h3>
                    <div className="h-64"><canvas ref={barChartRef}></canvas></div>
                </div>
                <div className="glass-panel p-8 border-t-2 border-[#ff10f0]">
                    <h3 className="font-retro text-2xl text-white tracking-widest mb-10 italic">TRAFFIC_DIST</h3>
                    <div className="h-64"><canvas ref={doughnutChartRef}></canvas></div>
                </div>
                <div className="glass-panel p-8 border-t-2 border-yellow-400">
                    <h3 className="font-retro text-2xl text-white tracking-widest mb-10 italic">CYCLE_FLOW</h3>
                    <div className="h-64"><canvas ref={areaChartRef}></canvas></div>
                </div>
            </div>

            {/* Activity Pipe */}
            <div className="glass-panel p-8 border-l-4 border-electric-blue">
                <h3 className="font-retro text-2xl text-white tracking-widest mb-8 flex items-center gap-3 italic">
                    <Bell className="w-6 h-6 text-electric-blue animate-pulse" /> EVENT_STREAM
                </h3>
                <div className="space-y-4">
                    {activities.map((activity, idx) => (
                        <motion.div key={activity.id} whileHover={{ x: 10 }} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 hover:border-electric-blue/30 transition-all group">
                            <div className="w-10 h-10 bg-black/40 border border-white/10 flex items-center justify-center">
                                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                            </div>
                            <div className="flex-1">
                                <p className="font-mono text-xs tracking-wider text-white mb-1">{activity.message}</p>
                                <p className="font-mono text-[9px] text-white/20 uppercase">TIMESTAMP: {activity.time}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-white/10 group-hover:text-electric-blue" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
