import React, { useState, useEffect, useRef } from 'react';
import { Line, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import {
    TrendingUp, Award, Target, Zap, Brain, Clock, Calendar, Star, Trophy, Flame,
    BookOpen, Activity, BarChart3, PieChart, Users, CheckCircle, XCircle,
    AlertCircle, Download, Share2, Filter, RefreshCw, ChevronRight, Sparkles,
    Medal, Crown, Rocket, Coffee, Moon, Sun, Settings, X
} from 'lucide-react';
import confetti from 'canvas-confetti';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler);

const InteractiveDashboard = ({ onClose, history = [], coins = 0 }) => {
    const [timeRange, setTimeRange] = useState('week');
    const [selectedView, setSelectedView] = useState('overview'); // overview, analytics, achievements, activity, community
    const [animateStats, setAnimateStats] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [hoveredStat, setHoveredStat] = useState(null);

    // Enhanced stats with more data
    // Enhanced stats with more data
    // Calculate stats from history prop
    const stats = React.useMemo(() => {
        const totalQuizzes = history.length;
        const totalQuestions = history.reduce((acc, h) => acc + (h.total || 0), 0);
        const correctAnswers = history.reduce((acc, h) => acc + (h.score || 0), 0);
        const totalStudyTime = totalQuestions * 1;
        const averageAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        // Calculate category scores
        const categoryStats = {};
        history.forEach(h => {
            const cat = (h.topic || 'General').toLowerCase();
            if (!categoryStats[cat]) categoryStats[cat] = { score: 0, total: 0 };
            categoryStats[cat].score += h.score;
            categoryStats[cat].total += h.total;
        });

        const categoryScores = {};
        Object.keys(categoryStats).forEach(cat => {
            const { score, total } = categoryStats[cat];
            categoryScores[cat] = total > 0 ? Math.round((score / total) * 100) : 0;
        });

        // Recent Activity
        const recentActivity = history.slice(0, 10).map((h, i) => ({
            id: h.id || i,
            date: h.timestamp || new Date().toLocaleDateString(),
            topic: h.topic,
            score: h.score,
            total: h.total,
            time: (h.total || 10) * 30,
            category: 'General',
            difficulty: 'Medium'
        }));

        // Basic achievement logic
        const unlockedAchievements = (history.length > 0 ? 1 : 0) + (coins > 100 ? 1 : 0);
        const totalAchievements = 15;
        const xp = coins * 10;
        const level = Math.floor(xp / 500) + 1;

        return {
            totalQuizzes,
            totalQuestions,
            correctAnswers,
            totalStudyTime,
            currentStreak: 1,
            longestStreak: 1,
            coinsEarned: coins,
            level,
            xp,
            totalAchievements,
            unlockedAchievements,
            perfectScores: history.filter(h => h.score === h.total).length,
            averageAccuracy,
            weeklyData: [0, 0, 0, 0, 0, 0, averageAccuracy],
            monthlyData: [],
            categoryScores,
            timeOfDayStats: { morning: 10, afternoon: 20, evening: 30, night: 5 },
            recentActivity,
            achievements: [
                { id: 1, name: 'First Steps', icon: '🎯', unlocked: history.length > 0, description: 'Complete your first quiz', date: '2026-01-15', rarity: 'common' },
                { id: 2, name: 'Perfect Score', icon: '💯', unlocked: history.some(h => h.score === h.total), description: 'Get 100% on a quiz', date: '2026-01-16', rarity: 'rare' },
                { id: 10, name: 'Quiz Master', icon: '🎓', unlocked: history.length >= 50, description: 'Complete 50 quizzes', date: '2026-02-01', rarity: 'rare' },
                { id: 11, name: 'Coin Collector', icon: '💰', unlocked: coins >= 500, description: 'Earn 500 coins', date: '2026-01-31', rarity: 'uncommon' },
            ],
            milestones: [
                { id: 1, title: 'Joined', date: '2026-02-01', icon: '🚀' }
            ],
            leaderboard: [
                { rank: 1, name: 'AlexTheGenius', score: 12500, avatar: '👤' },
                { rank: 2, name: 'StudyMaster99', score: 11200, avatar: '📚' },
                { rank: 3, name: 'QuizWizard', score: 10850, avatar: '🧙‍♂️' },
                { rank: 4, name: 'Brainiac', score: 9500, avatar: '🧠' },
                { rank: 5, name: 'You', score: coins * 10, avatar: '😊', highlight: true },
            ],
            friendsActivity: [
                { id: 1, user: 'Sarah', action: 'completed a Python Quiz', time: '2h ago' },
                { id: 2, user: 'Mike', action: 'leveled up to Level 5', time: '4h ago' },
                { id: 3, user: 'Emma', action: 'earned the "Speed Demon" badge', time: '1d ago' },
            ],
            activeChallenges: [
                { id: 1, title: 'Weekend Warrior', description: 'Complete 5 quizzes this weekend', progress: 3, total: 5, reward: '500 Coins' },
                { id: 2, title: 'Perfect Streak', description: 'Get 100% on 3 quizzes in a row', progress: 1, total: 3, reward: 'Rare Badge' },
            ]
        };
    }, [history, coins]);

    useEffect(() => {
        setAnimateStats(true);
        const timer = setTimeout(() => setAnimateStats(false), 1000);
        return () => clearTimeout(timer);
    }, [selectedView]);

    // Calculate derived stats
    const accuracy = Math.round((stats.correctAnswers / (stats.totalQuestions || 1)) * 100);
    const avgTimePerQuiz = Math.round(stats.totalStudyTime / (stats.totalQuizzes || 1));
    const xpToNextLevel = (stats.level + 1) * 500;
    const levelProgress = ((stats.xp % 500) / 500) * 100;
    const achievementProgress = Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100);

    // Chart Data
    const performanceChartData = {
        labels: timeRange === 'week'
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        datasets: [{
            label: 'Performance Score',
            data: timeRange === 'week' ? stats.weeklyData : stats.monthlyData,
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointBackgroundColor: 'rgb(99, 102, 241)',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointHoverBackgroundColor: 'rgb(99, 102, 241)',
            pointHoverBorderColor: '#fff'
        }]
    };

    const categoryChartData = {
        labels: Object.keys(stats.categoryScores).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
        datasets: [{
            label: 'Category Scores',
            data: Object.values(stats.categoryScores),
            backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(251, 146, 60, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(234, 179, 8, 0.8)',
                'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: '#fff',
            borderWidth: 3,
            hoverOffset: 10
        }]
    };

    const accuracyChartData = {
        labels: ['Correct', 'Incorrect'],
        datasets: [{
            data: [stats.correctAnswers, stats.totalQuestions - stats.correctAnswers],
            backgroundColor: ['rgba(34, 197, 94, 0.9)', 'rgba(239, 68, 68, 0.9)'],
            borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
            borderWidth: 3,
            hoverOffset: 15
        }]
    };

    const radarChartData = {
        labels: Object.keys(stats.categoryScores).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
        datasets: [{
            label: 'Skill Level',
            data: Object.values(stats.categoryScores),
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgb(99, 102, 241)',
            pointBackgroundColor: 'rgb(99, 102, 241)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(99, 102, 241)',
            pointRadius: 5,
            pointHoverRadius: 8,
            borderWidth: 3
        }]
    };

    const timeOfDayData = {
        labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
        datasets: [{
            label: 'Study Time (minutes)',
            data: Object.values(stats.timeOfDayStats),
            backgroundColor: [
                'rgba(251, 191, 36, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(99, 102, 241, 0.8)'
            ],
            borderWidth: 0
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                titleColor: isDarkMode ? '#fff' : '#000',
                bodyColor: isDarkMode ? '#fff' : '#000',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                cornerRadius: 8,
                displayColors: true
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    font: { size: 11 },
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 11 },
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                }
            }
        }
    };

    const StatCard = ({ icon: Icon, label, value, change, color, trend, subtitle, onClick }) => (
        <div
            className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 ${color} transform hover:scale-105 cursor-pointer relative overflow-hidden group`}
            onClick={onClick}
            onMouseEnter={() => setHoveredStat(label)}
            onMouseLeave={() => setHoveredStat(null)}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${color.replace('border-', 'bg-').replace('-500', '-100')} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div className={`text-3xl font-bold mb-1 relative z-10 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {animateStats ? (
                    <span className="inline-block animate-pulse">{value}</span>
                ) : value}
            </div>

            <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{label}</div>

            {subtitle && (
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
                    <Sparkles className="w-3 h-3" />
                    {subtitle}
                </div>
            )}

            {hoveredStat === label && (
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    Click for details →
                </div>
            )}
        </div>
    );

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return 'bg-gray-100 border-gray-300 text-gray-700';
            case 'uncommon': return 'bg-green-100 border-green-400 text-green-700';
            case 'rare': return 'bg-blue-100 border-blue-400 text-blue-700';
            case 'epic': return 'bg-purple-100 border-purple-400 text-purple-700';
            case 'legendary': return 'bg-yellow-100 border-yellow-400 text-yellow-700';
            default: return 'bg-gray-100 border-gray-300 text-gray-700';
        }
    };

    const exportData = () => {
        const dataStr = JSON.stringify(stats, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `study-hub-stats-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const shareStats = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        alert(`🎉 Your Stats:\n\n📊 Total Quizzes: ${stats.totalQuizzes}\n🎯 Accuracy: ${accuracy}%\n🔥 Streak: ${stats.currentStreak} days\n⭐ Level: ${stats.level}\n\nKeep up the great work!`);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'} p-6`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`text-4xl font-bold mb-2 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            <Activity className="w-10 h-10 text-indigo-600" />
                            Interactive Dashboard
                        </h1>
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Track your learning journey and celebrate achievements
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'} shadow-md hover:shadow-lg transition-all`}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={shareStats}
                            className={`px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'} shadow-md hover:shadow-lg transition-all flex items-center gap-2`}
                        >
                            <Share2 className="w-5 h-5" />
                            Share
                        </button>

                        <button
                            onClick={exportData}
                            className={`px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'} shadow-md hover:shadow-lg transition-all flex items-center gap-2`}
                        >
                            <Download className="w-5 h-5" />
                            Export
                        </button>

                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
                        >
                            ← Back to Hub
                        </button>
                    </div>
                </div>

                {/* View Tabs */}
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                        { id: 'achievements', label: 'Achievements', icon: Trophy },
                        { id: 'activity', label: 'Activity', icon: Calendar },
                        { id: 'community', label: 'Community', icon: Users }
                    ].map(view => (
                        <button
                            key={view.id}
                            onClick={() => setSelectedView(view.id)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${selectedView === view.id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                                : isDarkMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                                }`}
                        >
                            <view.icon className="w-5 h-5" />
                            {view.label}
                        </button>
                    ))}
                </div>

                {/* Time Range Selector */}
                {(selectedView === 'overview' || selectedView === 'analytics') && (
                    <div className="flex gap-3 mb-6">
                        {['week', 'month', 'year'].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${timeRange === range
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : isDarkMode
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                )}

                {/* Overview View */}
                {selectedView === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={Trophy}
                                label="Total Quizzes"
                                value={stats.totalQuizzes}
                                subtitle="+5 this week"
                                color="border-indigo-500"
                                trend={12}
                            />
                            <StatCard
                                icon={Target}
                                label="Accuracy Rate"
                                value={`${accuracy}%`}
                                subtitle="Above average"
                                color="border-green-500"
                                trend={8}
                            />
                            <StatCard
                                icon={Flame}
                                label="Current Streak"
                                value={`${stats.currentStreak} days`}
                                subtitle={`Best: ${stats.longestStreak} days`}
                                color="border-orange-500"
                                trend={5}
                            />
                            <StatCard
                                icon={Clock}
                                label="Study Time"
                                value={`${Math.floor(stats.totalStudyTime / 60)}h ${stats.totalStudyTime % 60}m`}
                                subtitle={`Avg: ${avgTimePerQuiz}m/quiz`}
                                color="border-purple-500"
                                trend={15}
                            />
                        </div>

                        {/* Level Progress */}
                        <div className={`${isDarkMode ? 'bg-gradient-to-r from-indigo-900 to-purple-900' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} rounded-2xl p-6 shadow-xl text-white`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                                        <Star className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="text-sm opacity-90">Current Level</div>
                                        <div className="text-3xl font-bold">Level {stats.level}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm opacity-90">Total XP</div>
                                    <div className="text-2xl font-bold">{stats.xp.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                                <div
                                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                                    style={{ width: `${levelProgress}%` }}
                                >
                                    <span className="text-xs font-bold text-white drop-shadow">
                                        {Math.round(levelProgress)}%
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm mt-2 opacity-90">
                                {xpToNextLevel - (stats.xp % 500)} XP to Level {stats.level + 1}
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
                                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                                    Performance Trend
                                </h3>
                                <div className="h-64">
                                    <Line data={performanceChartData} options={chartOptions} />
                                </div>
                            </div>

                            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
                                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <Target className="w-5 h-5 text-green-600" />
                                    Accuracy Breakdown
                                </h3>
                                <div className="h-64 flex items-center justify-center">
                                    <div className="w-48 h-48">
                                        <Doughnut data={accuracyChartData} options={{ ...chartOptions, cutout: '70%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics View */}
                {selectedView === 'analytics' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
                                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <PieChart className="w-5 h-5 text-purple-600" />
                                    Category Performance
                                </h3>
                                <div className="h-64">
                                    <Bar data={categoryChartData} options={chartOptions} />
                                </div>
                            </div>

                            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
                                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <Brain className="w-5 h-5 text-pink-600" />
                                    Skill Distribution
                                </h3>
                                <div className="h-64">
                                    <Radar data={radarChartData} options={{ ...chartOptions, scales: { r: { beginAtZero: true, max: 100, grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }, ticks: { color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' } } } }} />
                                </div>
                            </div>

                            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
                                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <Coffee className="w-5 h-5 text-amber-600" />
                                    Study Time by Period
                                </h3>
                                <div className="h-64">
                                    <PolarArea data={timeOfDayData} options={chartOptions} />
                                </div>
                            </div>

                            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
                                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Key Metrics
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Perfect Scores</span>
                                        <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.perfectScores}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Average Accuracy</span>
                                        <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.averageAccuracy}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Coins Earned</span>
                                        <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.coinsEarned}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Achievement Progress</span>
                                        <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{achievementProgress}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Achievements View */}
                {selectedView === 'achievements' && (
                    <div className="space-y-6">
                        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <Award className="w-6 h-6 text-yellow-600" />
                                    Achievements ({stats.unlockedAchievements}/{stats.totalAchievements})
                                </h3>
                                <div className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {achievementProgress}% Complete
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {stats.achievements.map(achievement => (
                                    <div
                                        key={achievement.id}
                                        className={`p-4 rounded-xl text-center transition-all cursor-pointer border-2 ${achievement.unlocked
                                            ? `${getRarityColor(achievement.rarity)} hover:scale-105 shadow-lg`
                                            : isDarkMode
                                                ? 'bg-gray-700 border-gray-600 opacity-50 hover:opacity-75'
                                                : 'bg-gray-100 border-gray-300 opacity-50 hover:opacity-75'
                                            }`}
                                        onClick={() => achievement.unlocked && confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })}
                                    >
                                        <div className="text-4xl mb-2">{achievement.icon}</div>
                                        <div className={`font-bold text-sm mb-1 ${isDarkMode && !achievement.unlocked ? 'text-gray-400' : ''}`}>
                                            {achievement.name}
                                        </div>
                                        <div className={`text-xs mb-2 ${isDarkMode && !achievement.unlocked ? 'text-gray-500' : 'text-gray-600'}`}>
                                            {achievement.description}
                                        </div>
                                        {achievement.unlocked ? (
                                            <>
                                                <div className="text-xs font-semibold text-green-600 mb-1">✓ Unlocked</div>
                                                <div className="text-xs text-gray-500">{achievement.date}</div>
                                            </>
                                        ) : (
                                            <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>🔒 Locked</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Milestones */}
                        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                <Medal className="w-5 h-5 text-indigo-600" />
                                Milestones
                            </h3>
                            <div className="space-y-3">
                                {stats.milestones.map(milestone => (
                                    <div key={milestone.id} className={`flex items-center gap-4 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <div className="text-3xl">{milestone.icon}</div>
                                        <div className="flex-1">
                                            <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{milestone.title}</div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{milestone.date}</div>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Activity View */}
                {selectedView === 'activity' && (
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
                        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            Recent Activity
                        </h3>
                        <div className="space-y-3">
                            {stats.recentActivity.map((activity) => (
                                <div key={activity.id} className={`flex items-center justify-between p-4 rounded-xl hover:scale-[1.02] transition-all cursor-pointer ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${activity.score === activity.total ? 'bg-green-100' : 'bg-blue-100'}`}>
                                            {activity.score === activity.total ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <BookOpen className="w-5 h-5 text-blue-600" />
                                            )}
                                        </div>
                                        <div>
                                            <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{activity.topic}</div>
                                            <div className={`text-sm flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                <span>{activity.date}</span>
                                                <span>•</span>
                                                <span className="capitalize">{activity.category}</span>
                                                <span>•</span>
                                                <span className={`px-2 py-0.5 rounded text-xs ${activity.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                    activity.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {activity.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{activity.score}/{activity.total}</div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{Math.round((activity.score / activity.total) * 100)}%</div>
                                        </div>
                                        <div className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <Clock className="w-4 h-4" />
                                            {Math.floor(activity.time / 60)}m {activity.time % 60}s
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Community View */}
                {selectedView === 'community' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Leaderboard */}
                            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
                                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    Global Leaderboard
                                </h3>
                                <div className="space-y-3">
                                    {stats.leaderboard.map((user, index) => (
                                        <div key={index} className={`flex items-center justify-between p-3 rounded-xl ${user.highlight
                                            ? (isDarkMode ? 'bg-indigo-900/50 border border-indigo-500' : 'bg-indigo-50 border border-indigo-200')
                                            : (isDarkMode ? 'bg-gray-700' : 'bg-gray-50')
                                            } ${index < 3 ? 'transform hover:scale-105 transition-transform' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    index === 1 ? 'bg-gray-200 text-gray-700' :
                                                        index === 2 ? 'bg-orange-100 text-orange-700' :
                                                            (isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-white text-gray-500')
                                                    }`}>
                                                    {user.rank}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{user.avatar}</span>
                                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                                        {user.name} {user.highlight && '(You)'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="font-bold flex items-center gap-1 text-indigo-500">
                                                {user.score.toLocaleString()} <span className="text-xs text-gray-400">XP</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Active Challenges */}
                            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
                                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <Target className="w-5 h-5 text-red-500" />
                                    Active Challenges
                                </h3>
                                <div className="space-y-4">
                                    {stats.activeChallenges.map(challenge => (
                                        <div key={challenge.id} className={`p-4 rounded-xl border-l-4 border-red-500 ${isDarkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{challenge.title}</h4>
                                                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{challenge.description}</p>
                                                </div>
                                                <span className="text-xs font-bold bg-white px-2 py-1 rounded text-red-600 shadow-sm border border-red-100">
                                                    {challenge.reward}
                                                </span>
                                            </div>
                                            <div className="mt-3">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Progress</span>
                                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{challenge.progress}/{challenge.total}</span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Friends Activity */}
                            <div className={`col-span-1 lg:col-span-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
                                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    <Users className="w-5 h-5 text-green-500" />
                                    Friends Activity
                                </h3>
                                <div className="space-y-3">
                                    {stats.friendsActivity.map(activity => (
                                        <div key={activity.id} className={`flex items-center gap-4 p-3 rounded-lg hover:bg-opacity-80 transition-colors ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                                                {activity.user.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                                    <span className="font-bold">{activity.user}</span> {activity.action}
                                                </p>
                                                <p className="text-xs text-gray-400">{activity.time}</p>
                                            </div>
                                            <button className={`text-xs px-3 py-1 rounded-full border ${isDarkMode ? 'border-gray-600 hover:bg-gray-600 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'}`}>
                                                Cheer 🎉
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractiveDashboard;
