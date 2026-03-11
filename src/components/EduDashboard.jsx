import React, { useState } from 'react';
import {
    LayoutDashboard,
    BookOpen,
    CheckSquare,
    Code2,
    Briefcase,
    Languages,
    Music,
    FileText,
    Globe,
    Search,
    Bell,
    Plus,
    Play,
    Award,
    TrendingUp,
    Users,
    MoreHorizontal
} from 'lucide-react';
// For now, I will build the overview structure inline to match the image exactly, then we can componentize.

const EduDashboard = ({ history = [], coins = 0, level = 1 }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');

    // Derived Stats
    const coursesCompleted = history.length;
    const tasksFinished = history.reduce((acc, curr) => acc + (curr.total || 0), 0);
    const weeklyGoalPercent = 68; // Mocked
    const rank = 342; // Mocked

    return (
        <div className="min-h-screen bg-[#f8f9fc] font-sans text-slate-900 flex">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">EduHub</h1>
                        <p className="text-xs text-slate-400 font-medium">Learning Platform</p>
                    </div>
                </div>

                <div className="px-4 py-2 flex-1 overflow-y-auto space-y-1">
                    <NavButton active={activeTab === 'dashboard'} icon={LayoutDashboard} label="Dashboard" onClick={() => setActiveTab('dashboard')} />
                    <NavButton active={activeTab === 'courses'} icon={BookOpen} label="Courses" onClick={() => setActiveTab('courses')} />
                    <NavButton active={activeTab === 'tasks'} icon={CheckSquare} label="Tasks" onClick={() => setActiveTab('tasks')} />
                    <NavButton active={activeTab === 'code'} icon={Code2} label="Code Editor" onClick={() => setActiveTab('code')} />
                    <NavButton active={activeTab === 'jobs'} icon={Briefcase} label="Jobs Portal" onClick={() => setActiveTab('jobs')} />
                    <NavButton active={activeTab === 'languages'} icon={Languages} label="Languages" onClick={() => setActiveTab('languages')} />
                    <NavButton active={activeTab === 'music'} icon={Music} label="Music" onClick={() => setActiveTab('music')} />
                    <NavButton active={activeTab === 'content'} icon={FileText} label="Content" onClick={() => setActiveTab('content')} />
                    <NavButton active={activeTab === 'translator'} icon={Globe} label="Translator" onClick={() => setActiveTab('translator')} />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="w-96 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search courses, tasks, jobs..."
                            className="w-full bg-slate-50 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-100 transition-all border-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
                            ✨ Pro Plan
                        </button>
                        <button className="relative p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-500">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 ring-2 ring-offset-2 ring-purple-100 cursor-pointer"></div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Welcome Section */}
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, John 👋</h2>
                                    <p className="text-slate-500">Ready to continue your learning journey? You have 4 tasks due today.</p>
                                </div>
                                <div className="flex gap-3">
                                    <ActionButton icon={Plus} label="New Task" />
                                    <ActionButton icon={Play} label="Resume Course" />
                                    <ActionButton icon={Code2} label="Code Challenge" />
                                    <ActionButton icon={FileText} label="Create Content" />
                                    <ActionButton icon={Search} label="Find Jobs" />
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-4 gap-6">
                                <StatsCard
                                    label="Courses Completed"
                                    value={coursesCompleted.toString()}
                                    sub="+2 this week"
                                    icon={Award}
                                    iconColor="text-purple-600"
                                    bg="bg-purple-100"
                                />
                                <StatsCard
                                    label="Tasks Finished"
                                    value={tasksFinished.toString()}
                                    sub="+12 this week"
                                    icon={CheckSquare}
                                    iconColor="text-cyan-500"
                                    bg="bg-cyan-100"
                                />
                                <StatsCard
                                    label="Learning Streak"
                                    value="14 days"
                                    sub="Keep it up!"
                                    icon={TrendingUp}
                                    iconColor="text-pink-500"
                                    bg="bg-pink-100"
                                />
                                <StatsCard
                                    label="Community Rank"
                                    value={`#${rank}`}
                                    sub="↑ 58 positions"
                                    icon={Users}
                                    iconColor="text-emerald-500"
                                    bg="bg-emerald-100"
                                />
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-3 gap-8">
                                {/* Left Column: Continue Learning */}
                                <div className="col-span-2 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-lg text-slate-900">Continue Learning</h3>
                                        <button className="text-sm text-purple-600 font-medium hover:text-purple-700">View all courses</button>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Course Card 1 */}
                                        <CourseCard
                                            title="Advanced React Patterns"
                                            author="Sarah Johnson"
                                            progress={75}
                                            color="bg-purple-600"
                                            image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                                        />

                                        {/* Course Card 2 */}
                                        <CourseCard
                                            title="Python for Data Science"
                                            author="Michael Chen"
                                            progress={32}
                                            color="bg-yellow-500"
                                            image="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Widgets */}
                                <div className="space-y-6">
                                    {/* Weekly Goal */}
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                                        <div className="w-20 h-20 relative flex items-center justify-center">
                                            {/* Circular Progress Mockup */}
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                                                <circle cx="40" cy="40" r="32" stroke="#7c3aed" strokeWidth="8" fill="transparent" strokeDasharray="200" strokeDashoffset={200 - (200 * 0.68)} strokeLinecap="round" />
                                            </svg>
                                            <span className="absolute font-bold text-slate-900">68%</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">Weekly Goal</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">You're on track! Complete 2 more lessons to hit your target.</p>
                                        </div>
                                    </div>

                                    {/* Upcoming Tasks */}
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-bold text-slate-900">Upcoming Tasks</h4>
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">4 pending</span>
                                        </div>
                                        {/* Task items placeholder */}
                                        <div className="space-y-3">
                                            {[1, 2].map(i => (
                                                <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                                    <div className="w-5 h-5 rounded border-2 border-slate-300 group-hover:border-purple-500 transition-colors"></div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-700">Complete Quiz Level {i}</p>
                                                        <p className="text-xs text-slate-400">Due Tomorrow</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const NavButton = ({ active, icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
    >
        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span className="font-medium text-sm">{label}</span>
    </button>
);

const ActionButton = ({ icon: Icon, label }) => (
    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
        <Icon className="w-4 h-4 text-slate-500" />
        {label}
    </button>
);

const StatsCard = ({ label, value, sub, icon: Icon, iconColor, bg }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-md transition-all">
        <div className="flex justify-between items-start">
            <div className="">
                <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${bg} ${iconColor}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        <div>
            <span className={`text-xs font-bold ${sub.includes('+') || sub.includes('↑') ? 'text-emerald-500' : 'text-purple-600'}`}>{sub}</span>
        </div>
    </div>
);

const CourseCard = ({ title, author, progress, color, image }) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 group hover:shadow-md transition-all cursor-pointer">
        <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex-1 flex flex-col justify-center">
            <h4 className="font-bold text-slate-900 text-lg mb-1">{title}</h4>
            <p className="text-sm text-slate-500 mb-4">{author}</p>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
        <div className="flex items-center pr-4">
            <span className="font-bold text-slate-700">{progress}%</span>
        </div>
    </div>
);

export default EduDashboard;
