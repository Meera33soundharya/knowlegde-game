import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, TrendingDown, Users, DollarSign, Activity, BarChart3,
    RefreshCw, Calendar, Download, Settings, Home, PieChart, FileText,
    ShoppingCart, MessageCircle, Bell, Search, ChevronDown
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
        { id: 1, type: 'sale', message: 'New order received from John Doe', time: '2 min ago', icon: ShoppingCart, color: 'text-green-500' },
        { id: 2, type: 'user', message: 'Sarah joined as premium member', time: '5 min ago', icon: Users, color: 'text-blue-500' },
        { id: 3, type: 'message', message: 'New customer support message', time: '12 min ago', icon: MessageCircle, color: 'text-purple-500' },
        { id: 4, type: 'sale', message: 'Payment received - $299.00', time: '18 min ago', icon: DollarSign, color: 'text-green-500' },
        { id: 5, type: 'user', message: 'Michael updated profile information', time: '25 min ago', icon: Users, color: 'text-blue-500' },
    ]);

    // Chart Refs
    const lineChartRef = useRef(null);
    const barChartRef = useRef(null);
    const doughnutChartRef = useRef(null);
    const areaChartRef = useRef(null);

    // Chart instances
    const [charts, setCharts] = useState({});

    useEffect(() => {
        createCharts();
        return () => {
            // Cleanup charts on unmount
            Object.values(charts).forEach(chart => chart?.destroy());
        };
    }, []);

    const createCharts = () => {
        // Line Chart - Revenue Trends
        if (lineChartRef.current) {
            const lineCtx = lineChartRef.current.getContext('2d');
            const lineChart = new ChartJS(lineCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Revenue ($)',
                        data: [4200, 5100, 4800, 6200, 7100, 6800, 7500],
                        borderColor: 'rgb(99, 102, 241)',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: 'rgb(99, 102, 241)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgb(99, 102, 241)',
                            borderWidth: 1,
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.05)' },
                            ticks: { color: '#6b7280' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#6b7280' }
                        }
                    }
                }
            });

            // Bar Chart - User Growth
            if (barChartRef.current) {
                const barCtx = barChartRef.current.getContext('2d');
                const barChart = new ChartJS(barCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'New Users',
                            data: [650, 890, 1200, 1100, 1400, 1650],
                            backgroundColor: [
                                'rgba(59, 130, 246, 0.8)',
                                'rgba(139, 92, 246, 0.8)',
                                'rgba(236, 72, 153, 0.8)',
                                'rgba(249, 115, 22, 0.8)',
                                'rgba(34, 197, 94, 0.8)',
                                'rgba(14, 165, 233, 0.8)',
                            ],
                            borderRadius: 8,
                            borderSkipped: false,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                padding: 12,
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                                ticks: { color: '#6b7280' }
                            },
                            x: {
                                grid: { display: false },
                                ticks: { color: '#6b7280' }
                            }
                        }
                    }
                });

                // Doughnut Chart - Traffic Sources
                if (doughnutChartRef.current) {
                    const doughnutCtx = doughnutChartRef.current.getContext('2d');
                    const doughnutChart = new ChartJS(doughnutCtx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Organic', 'Direct', 'Referral', 'Social'],
                            datasets: [{
                                data: [45, 25, 20, 10],
                                backgroundColor: [
                                    'rgba(59, 130, 246, 0.8)',
                                    'rgba(139, 92, 246, 0.8)',
                                    'rgba(236, 72, 153, 0.8)',
                                    'rgba(249, 115, 22, 0.8)',
                                ],
                                borderWidth: 0,
                                hoverOffset: 10
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 15,
                                        font: { size: 12, weight: '600' },
                                        color: '#374151'
                                    }
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    padding: 12,
                                }
                            },
                            cutout: '70%',
                        }
                    });

                    // Area Chart - Sessions
                    if (areaChartRef.current) {
                        const areaCtx = areaChartRef.current.getContext('2d');
                        const areaChart = new ChartJS(areaCtx, {
                            type: 'line',
                            data: {
                                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                                datasets: [{
                                    label: 'Sessions',
                                    data: [120, 90, 450, 890, 1200, 980, 600],
                                    borderColor: 'rgb(34, 197, 94)',
                                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                    fill: true,
                                    tension: 0.4,
                                    pointRadius: 0,
                                    borderWidth: 3,
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        padding: 12,
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                                        ticks: { color: '#6b7280' }
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: { color: '#6b7280' }
                                    }
                                }
                            }
                        });

                        setCharts({ lineChart, barChart, doughnutChart, areaChart });
                    }
                }
            }
        }
    };

    const refreshStats = () => {
        // Simulate real-time data updates
        setStats({
            revenue: Math.floor(Math.random() * 20000) + 40000,
            revenueChange: (Math.random() * 30) - 10,
            users: Math.floor(Math.random() * 5000) + 6000,
            usersChange: (Math.random() * 20) - 5,
            conversionRate: Math.random() * 5 + 2,
            conversionChange: (Math.random() * 10) - 5,
            sessions: Math.floor(Math.random() * 8000) + 10000,
            sessionsChange: (Math.random() * 25) - 7,
        });
    };

    const StatCard = ({ title, value, change, icon: Icon, gradient }) => {
        const isPositive = change >= 0;
        return (
            <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden group`}
            >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{title}</p>
                            <p className="text-3xl font-black text-gray-900">{value}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/80 backdrop-blur rounded-xl flex items-center justify-center shadow-md">
                            <Icon className="w-6 h-6 text-gray-700" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isPositive ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{change.toFixed(1)}%
                        </span>
                        <span className="text-sm text-gray-500">vs last period</span>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-xl z-50">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-black text-gray-900">Analytics</h1>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { icon: Home, label: 'Overview', active: true },
                            { icon: BarChart3, label: 'Analytics', active: false },
                            { icon: Users, label: 'Users', active: false },
                            { icon: DollarSign, label: 'Revenue', active: false },
                            { icon: Settings, label: 'Settings', active: false },
                        ].map((item, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ x: 5 }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${item.active
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </motion.button>
                        ))}
                    </nav>
                </div>

                {/* User Profile */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">John Doe</p>
                            <p className="text-xs text-gray-500">Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 mb-2">Dashboard Overview</h2>
                        <p className="text-gray-600 font-medium">Track your business metrics and performance</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Time Filter */}
                        <div className="flex bg-white rounded-xl shadow-md border border-gray-200 p-1">
                            {['24h', '7d', '30d', '90d'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setTimeFilter(filter)}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${timeFilter === filter
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05, rotate: 180 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={refreshStats}
                            className="p-3 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
                        >
                            <RefreshCw className="w-5 h-5 text-gray-700" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Export
                        </motion.button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.revenue.toLocaleString()}`}
                        change={stats.revenueChange}
                        icon={DollarSign}
                        gradient="from-blue-50 to-blue-100"
                    />
                    <StatCard
                        title="Active Users"
                        value={stats.users.toLocaleString()}
                        change={stats.usersChange}
                        icon={Users}
                        gradient="from-purple-50 to-purple-100"
                    />
                    <StatCard
                        title="Conversion Rate"
                        value={`${stats.conversionRate.toFixed(2)}%`}
                        change={stats.conversionChange}
                        icon={TrendingUp}
                        gradient="from-pink-50 to-pink-100"
                    />
                    <StatCard
                        title="Total Sessions"
                        value={stats.sessions.toLocaleString()}
                        change={stats.sessionsChange}
                        icon={Activity}
                        gradient="from-green-50 to-green-100"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Line Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                    >
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            Revenue Trends
                        </h3>
                        <div className="h-64">
                            <canvas ref={lineChartRef}></canvas>
                        </div>
                    </motion.div>

                    {/* Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                    >
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            User Growth
                        </h3>
                        <div className="h-64">
                            <canvas ref={barChartRef}></canvas>
                        </div>
                    </motion.div>

                    {/* Doughnut Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                    >
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-pink-600" />
                            Traffic Sources
                        </h3>
                        <div className="h-64">
                            <canvas ref={doughnutChartRef}></canvas>
                        </div>
                    </motion.div>

                    {/* Area Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                    >
                        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-600" />
                            Daily Sessions
                        </h3>
                        <div className="h-64">
                            <canvas ref={areaChartRef}></canvas>
                        </div>
                    </motion.div>
                </div>

                {/* Activity Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                >
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-orange-600" />
                        Recent Activity
                    </h3>

                    <div className="space-y-4">
                        {activities.map((activity, idx) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + idx * 0.05 }}
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center ${activity.color}`}>
                                    <activity.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{activity.message}</p>
                                    <p className="text-sm text-gray-500">{activity.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
