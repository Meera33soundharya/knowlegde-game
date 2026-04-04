import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    Sparkles,
    Rocket,
    BookOpen,
    FileText,
    LayoutDashboard,
    Settings,
    LogOut,
    Bell,
    Search,
    Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        KG Platform
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/app"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </NavLink>

                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Apps
                    </div>

                    <NavLink
                        to="/app/arena"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <Rocket className="w-5 h-5" />
                        <span>BrainSpark Arena</span>
                    </NavLink>

                    <NavLink
                        to="/app/study"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <BookOpen className="w-5 h-5" />
                        <span>Study Hub</span>
                    </NavLink>

                    <NavLink
                        to="/app/notes"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <FileText className="w-5 h-5" />
                        <span>MegaLearn Hub</span>
                    </NavLink>

                    <NavLink
                        to="/app/translator"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <Languages className="w-5 h-5" />
                        <span>AI Translator</span>
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={handleLogout}>
                        <LogOut className="w-5 h-5 mr-3" />
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4 text-gray-400">
                        {/* Mobile Menu Trigger would go here */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-gray-800 border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-purple-500 w-64 text-white"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white/20"></div>
                    </div>
                </header>

                {/* Content Rendered Here */}
                <main className="flex-1 overflow-auto bg-black p-4 md:p-6 relative">
                    {/* Background Elements specific to content area */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
                    </div>
                    <div className="relative z-10 h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
