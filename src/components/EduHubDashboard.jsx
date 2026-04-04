import React, { useState, useEffect } from 'react';
import {
    Home,
    BookOpen,
    CheckSquare,
    Code,
    Trophy,
    Music,
    Mail,
    Calendar,
    Bell,
    Search,
    Plus,
    ChevronRight,
    Circle,
    CheckCircle2,
    Target,
    TrendingUp,
    Award,
    Clock,
    Zap
} from 'lucide-react';

const EduHubDashboard = ({ onClose, history = [], coins = 0, userName = "John" }) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Complete Python Assignment', priority: 'Clarify', completed: false },
        { id: 2, title: 'Review Full Project A/2', priority: 'Recorder', completed: false },
        { id: 3, title: 'Scratch Session #2', priority: 'Unfinish', completed: false },
        { id: 4, title: 'Update Portfolio', priority: 'New', completed: false }
    ]);

    // Calculate stats from history
    const coursesCompleted = history.filter(h => h.score >= (h.total * 0.7)).length;
    const tasksFinished = history.length;
    const learningStreak = calculateStreak(history);
    const leaderboardRank = 342;

    // Continued learning courses
    const continuedLearning = [
        { title: 'Advanced React Patterns', progress: 75, color: 'from-purple-500 to-purple-600', icon: '⚛️' },
        { title: 'Python for Data Science', progress: 45, color: 'from-blue-500 to-blue-600', icon: '🐍' },
        { title: 'UI/UX Design Mastery', progress: 60, color: 'from-pink-500 to-pink-600', icon: '🎨' }
    ];

    // Explore modules
    const modules = [
        { title: 'Courses', description: 'Access 100+ courses across development, design, and business', icon: BookOpen, color: 'bg-purple-500', stats: { enrolled: 12, completed: 8 } },
        { title: 'Task Manager', description: 'Organize projects, track deadlines, and boost productivity', icon: CheckSquare, color: 'bg-cyan-500', stats: { active: 24, done: 156 } },
        { title: 'Code Editor', description: 'Write, compile, and test code in 20+ programming languages', icon: Code, color: 'bg-purple-600', stats: { projects: 8, files: 42 } },
        { title: 'Jobs Portal', description: 'Find apprenticeships matching your skills and aspirations', icon: Trophy, color: 'bg-orange-500', stats: { matches: 15, applied: 3 } }
    ];

    // Recent activity
    const recentActivity = [
        { action: 'Completed React Advanced Module', time: '2 hours ago', icon: CheckCircle2, color: 'text-green-500' },
        { action: 'Finished UI Design Task', time: '5 hours ago', icon: Award, color: 'text-purple-500' },
        { action: 'Started Code Challenge #42', time: '1 day ago', icon: Code, color: 'text-blue-500' },
        { action: 'Earned Fast Learner Badge', time: '2 days ago', icon: Zap, color: 'text-yellow-500' }
    ];

    function calculateStreak(history) {
        if (!history.length) return 0;
        // Simple streak calculation - count consecutive days
        return Math.min(14, history.length);
    }

    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const weeklyGoalProgress = 68;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex overflow-hidden z-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
                {/* Logo */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-slate-800">EduHub</h1>
                            <p className="text-xs text-slate-500">Learning Platform</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {[
                        { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null },
                        { id: 'courses', icon: BookOpen, label: 'Courses', badge: '12' },
                        { id: 'tasks', icon: CheckSquare, label: 'Tasks', badge: '24' },
                        { id: 'quiz', icon: Target, label: 'Quiz Editor', badge: null },
                        { id: 'music', icon: Music, label: 'Music', badge: null },
                        { id: 'contact', icon: Mail, label: 'Contact', badge: null },
                        { id: 'calendar', icon: Calendar, label: 'Calendar', badge: null }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeSection === item.id
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                            {item.badge && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${activeSection === item.id ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                                    }`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search courses, tasks, docs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New Task
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                            <Bell className="w-5 h-5 text-slate-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Calendar className="w-5 h-5 text-slate-600" />
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                        >
                            Exit
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">
                            Welcome back, <span className="text-purple-600">{userName}</span> 👋
                        </h2>
                        <p className="text-slate-600">Ready to continue your learning journey? You have 4 tasks today.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Courses Completed</p>
                                    <p className="text-2xl font-bold text-slate-800">{coursesCompleted}</p>
                                    <p className="text-xs text-green-600 font-medium">+2 this week</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                                    <CheckSquare className="w-6 h-6 text-cyan-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Tasks Finished</p>
                                    <p className="text-2xl font-bold text-slate-800">{tasksFinished}</p>
                                    <p className="text-xs text-green-600 font-medium">+7 this week</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Learning Streak</p>
                                    <p className="text-2xl font-bold text-slate-800">{learningStreak} days</p>
                                    <p className="text-xs text-green-600 font-medium">Keep it up!</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Leaderboard Rank</p>
                                    <p className="text-2xl font-bold text-slate-800">#{leaderboardRank}</p>
                                    <p className="text-xs text-green-600 font-medium">Top 5% globally</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - 2/3 width */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Continued Learning */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-slate-800">Continued Learning</h3>
                                    <button className="text-purple-600 text-sm font-semibold hover:text-purple-700 flex items-center gap-1">
                                        View all courses
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {continuedLearning.map((course, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                                                {course.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-slate-800 mb-1">{course.title}</h4>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                                                            style={{ width: `${course.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-600">{course.progress}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Explore Modules */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800 mb-6">Explore Modules</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {modules.map((module, idx) => (
                                        <div key={idx} className="p-5 bg-slate-50 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer border border-slate-200 hover:border-purple-200">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                                    <module.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-800 mb-1">{module.title}</h4>
                                                    <p className="text-xs text-slate-600 leading-relaxed">{module.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs">
                                                {Object.entries(module.stats).map(([key, value]) => (
                                                    <div key={key} className="flex items-center gap-1">
                                                        <span className="text-slate-500 capitalize">{key}:</span>
                                                        <span className="font-semibold text-slate-700">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - 1/3 width */}
                        <div className="space-y-8">
                            {/* Weekly Goal */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Weekly Goal</h3>
                                <div className="flex flex-col items-center">
                                    <div className="relative w-32 h-32 mb-4">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="#e2e8f0"
                                                strokeWidth="12"
                                                fill="none"
                                            />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="url(#gradient)"
                                                strokeWidth="12"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 56}`}
                                                strokeDashoffset={`${2 * Math.PI * 56 * (1 - weeklyGoalProgress / 100)}`}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000"
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#9333ea" />
                                                    <stop offset="100%" stopColor="#7c3aed" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-3xl font-bold text-slate-800">{weeklyGoalProgress}%</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 text-center">
                                        You're <span className="font-semibold text-purple-600">3 lessons</span> away from your goal!
                                    </p>
                                </div>
                            </div>

                            {/* Upcoming Tasks */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-800">Upcoming Tasks</h3>
                                    <button className="text-purple-600 text-sm font-semibold hover:text-purple-700">
                                        View all
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {tasks.map(task => (
                                        <div key={task.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                            <button
                                                onClick={() => toggleTask(task.id)}
                                                className="mt-0.5"
                                            >
                                                {task.completed ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-slate-400" />
                                                )}
                                            </button>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                                    {task.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Clock className="w-3 h-3 text-slate-400" />
                                                    <span className="text-xs text-slate-500">{task.priority}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
                                    <button className="text-purple-600 text-sm font-semibold hover:text-purple-700">
                                        View all
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {recentActivity.map((activity, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center ${activity.color}`}>
                                                <activity.icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-700 font-medium">{activity.action}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EduHubDashboard;
