import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Home, BookOpen, Trophy, MessageSquare, LogOut,
  Brain, Zap, Clock, TrendingUp, Users, Plus, Settings,
  Bell, MoreHorizontal, Play, Pause, RotateCcw, CheckCircle, List, ArrowRight, BarChart3,
  Cpu, Activity, Shield, Terminal
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import MegaLearnHub from './components/MegaLearnHub';
import BrainSpark from './components/BrainSpark';
import Dashboard from './components/Dashboard';
import QuizApp from './components/QuizApp';
import AnalyticsDashboard from './components/AnalyticsDashboard';

const API_URL = 'http://localhost:5000/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_URL}/auth/me`)
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);
  const login = async (username, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { username, password });
    localStorage.setItem('token', res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };
  const register = async (username, email, password) => {
    const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    localStorage.setItem('token', res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>;
}

const CyberSidebar = ({ user, logout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navItems = [
    { icon: Home, label: 'HUB', path: '/dashboard' },
    { icon: BarChart3, label: 'DATA', path: '/analytics' },
    { icon: Zap, label: 'MEGA', path: '/mega-hub' },
    { icon: Brain, label: 'SPARK', path: '/brainspark' },
    { icon: Clock, label: 'NODE', path: '/focus' },
    { icon: List, label: 'GRID', path: '/tasks' },
    { icon: BookOpen, label: 'TEST', path: '/quiz' },
    { icon: MessageSquare, label: 'COMM', path: '/community' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 xl:w-64 bg-black/60 backdrop-blur-xl border-r border-white/10 flex flex-col z-50 transition-all duration-300">
      <div className="p-4 xl:p-8 flex flex-col items-center">
        <div className="w-12 h-12 xl:w-16 xl:h-16 bg-white/5 border border-white/20 rounded-lg mb-4 flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_rgba(0,255,0,0.2)] text-[#39ff14] font-retro">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <h2 className="hidden xl:block text-xl font-retro tracking-[3px] text-white">STUDY_HUB</h2>
        <div className="hidden xl:block text-[10px] text-[#39ff14] font-mono opacity-50 tracking-[2px]">VER_1.0.42</div>
      </div>

      <nav className="flex-1 px-3 xl:px-4 space-y-4 mt-8 pb-8 custom-scrollbar overflow-y-auto">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`flex items-center justify-center xl:justify-start gap-4 p-3 xl:px-6 xl:py-4 rounded-lg transition-all duration-300 font-mono text-[11px] tracking-widest ${isActive(item.path)
                ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 shadow-[0_0_15px_rgba(0,255,0,0.1)]'
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'animate-pulse' : ''}`} />
            <span className="hidden xl:block">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 xl:p-6 mt-auto border-t border-white/5">
        <button onClick={logout} className="flex items-center justify-center xl:justify-start gap-4 text-white/40 hover:text-red-400 w-full transition-colors p-2">
          <LogOut className="w-5 h-5" />
          <span className="hidden xl:block font-mono text-[10px] tracking-widest">DISCONNECT</span>
        </button>
      </div>
    </aside>
  );
};

const FocusTimer = () => {
  // Keep internal logic but style it cyber
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus');

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
          } else { setMinutes(minutes - 1); setSeconds(59); }
        } else { setSeconds(seconds - 1); }
      }, 1000);
    } else { clearInterval(interval); }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'focus') setMinutes(25);
    else if (mode === 'shortBreak') setMinutes(5);
    else setMinutes(15);
    setSeconds(0);
  };

  return (
    <div className="min-h-full flex items-center justify-center p-8 bg-transparent">
      <div className="glass-panel p-12 text-center w-full max-w-lg border-t-2 border-[#39ff14]">
        <h2 className="font-retro text-4xl text-[#39ff14] mb-8 tracking-[4px]">FOCUS_NODE</h2>
        <div className="flex justify-center gap-3 mb-12">
          {['focus', 'shortBreak', 'longBreak'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setIsActive(false); setSeconds(0); setMinutes(m === 'focus' ? 25 : m === 'shortBreak' ? 5 : 15); }}
              className={`px-4 py-1 font-mono text-[10px] border tracking-widest transition-all ${mode === m ? 'bg-[#39ff14]/20 border-[#39ff14] text-[#39ff14]' : 'border-white/10 text-white/40 hover:border-white/30'}`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="text-[120px] font-retro text-white leading-none mb-12 tabular-nums animate-flicker">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="flex justify-center gap-8">
          <button onClick={toggleTimer} className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-red-500/20 text-red-500 border border-red-500' : 'bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]'}`}>
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          <button onClick={resetTimer} className="w-20 h-20 rounded-full bg-white/5 text-white/40 flex items-center justify-center border border-white/10 hover:border-white/30">
            <RotateCcw className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now(), text: newTask, completed: false }, ...tasks]);
    setNewTask('');
  };

  return (
    <div className="p-8 h-full">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-retro text-5xl text-[#39ff14] mb-12 tracking-[6px] text-center italic">SYSTEM_TASKS</h2>
        <form onSubmit={addTask} className="mb-12 relative overflow-hidden group">
          <div className="absolute left-0 top-0 w-1 h-full bg-[#39ff14]"></div>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="INPUT NEW COMMAND..."
            className="w-full p-6 bg-white/5 border border-white/10 outline-none focus:border-[#39ff14]/50 text-[#39ff14] font-mono tracking-widest placeholder:text-white/20"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#39ff14] hover:scale-125 transition-transform">
            <Plus className="w-6 h-6" />
          </button>
        </form>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="glass-panel p-5 flex items-center group relative overflow-hidden">
              <div className={`absolute left-0 top-0 h-full w-1 ${task.completed ? 'bg-green-500' : 'bg-white/20'}`}></div>
              <button
                onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
                className={`w-6 h-6 rounded border flex items-center justify-center mr-6 transition-all ${task.completed ? 'bg-green-500 border-green-500' : 'border-white/20 hover:border-[#39ff14]'}`}
              >
                {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
              </button>
              <span className={`flex-1 font-mono tracking-wider ${task.completed ? 'line-through text-white/20' : 'text-white'}`}>{task.text.toUpperCase()}</span>
              <button
                onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                className="text-white/10 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5 rotate-90" />
              </button>
            </div>
          ))}
          {tasks.length === 0 && <div className="text-center font-mono opacity-20 mt-20 tracking-[10px]">GRID_EMPTY</div>}
        </div>
      </div>
    </div>
  );
};

const CyberStatusPanel = ({ user }) => (
  <aside className="fixed right-0 top-0 h-screen w-80 bg-black/40 border-l border-white/5 hidden 2xl:flex flex-col p-8 z-40 overflow-y-auto overflow-x-hidden">
    <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
      <Activity className="w-5 h-5 text-[#39ff14] animate-pulse" />
      <span className="font-retro text-2xl tracking-[2px] text-white">SYSTEM_LOGS</span>
    </div>

    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-electric-blue">
        <h4 className="font-mono text-[10px] text-electric-blue mb-2 tracking-[2px]">USER_CREDENTIALS</h4>
        <div className="font-mono text-xs text-white/70">{user?.username?.toUpperCase()}</div>
        <div className="font-mono text-[9px] text-white/30 mt-1">LVL_07_ADMIN</div>
      </div>

      <div className="glass-panel p-6 border-l-4 border-[#39ff14]">
        <h4 className="font-mono text-[10px] text-[#39ff14] mb-2 tracking-[2px]">NETWORK_STATUS</h4>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></div>
          <div className="font-mono text-xs text-white/70">CONNECTED</div>
        </div>
        <div className="font-mono text-[9px] text-white/30 mt-2">DUMMY_IP: 192.168.1.1</div>
      </div>

      <div className="mt-8">
        <h4 className="font-mono text-[10px] text-white/40 mb-4 tracking-[3px]">ACTIVE_MODULES</h4>
        <div className="space-y-2">
          {['AUTH_SERVICE', 'DB_CLUSTER_01', 'WEBSOCKET_SRV', 'AI_ENGINE'].map(m => (
            <div key={m} className="flex items-center justify-between font-mono text-[10px] p-2 bg-white/5 rounded border border-white/5">
              <span className="text-white/60">{m}</span>
              <span className="text-[#39ff14]">RUNNING</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-auto pt-8">
      <div className="p-4 bg-white/5 rounded-lg border border-dashed border-white/10">
        <div className="flex items-center gap-2 text-yellow-400 mb-2">
          <Shield className="w-4 h-4" />
          <span className="font-retro text-lg tracking-widest">SECURE_TUNNEL</span>
        </div>
        <p className="font-mono text-[9px] text-white/30 leading-relaxed">END-TO-END ENCRYPTION ACTIVE. NO PACKET LEAKS DETECTED.</p>
      </div>
    </div>
  </aside>
);

function AppRoutes() {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black font-retro text-4xl text-[#39ff14] animate-pulse">
      BOOTING_SYSTEM...
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/dashboard" element={user ? (
        <div className="layout-wrapper flex min-h-screen overflow-hidden">
          <CyberSidebar user={user} logout={() => window.location.reload()} />
          <main className="flex-1 ml-20 xl:ml-64 xl:mr-80 2xl:mr-80 overflow-y-auto custom-scrollbar relative z-10 px-4 py-8">
            <Dashboard user={user} />
          </main>
          <CyberStatusPanel user={user} />
        </div>
      ) : <Navigate to="/login" />} />

      <Route path="/analytics" element={user ? (
        <div className="layout-wrapper flex h-screen overflow-hidden">
          <CyberSidebar user={user} logout={() => window.location.reload()} />
          <main className="flex-1 ml-20 xl:ml-64 overflow-y-auto"><AnalyticsDashboard /></main>
        </div>
      ) : <Navigate to="/login" />} />

      <Route path="/mega-hub" element={user ? <MegaLearnHub /> : <Navigate to="/login" />} />

      <Route path="/focus" element={user ? (
        <div className="layout-wrapper flex h-screen overflow-hidden">
          <CyberSidebar user={user} />
          <main className="flex-1 ml-20 xl:ml-64"><FocusTimer /></main>
          <CyberStatusPanel user={user} />
        </div>
      ) : <Navigate to="/login" />} />

      <Route path="/tasks" element={user ? (
        <div className="layout-wrapper flex h-screen overflow-hidden">
          <CyberSidebar user={user} />
          <main className="flex-1 ml-20 xl:ml-64"><TaskList /></main>
          <CyberStatusPanel user={user} />
        </div>
      ) : <Navigate to="/login" />} />

      <Route path="/quiz" element={user ? (
        <div className="layout-wrapper flex h-screen overflow-hidden">
          <CyberSidebar user={user} />
          <main className="flex-1 ml-20 xl:ml-64 p-8 overflow-y-auto"><QuizApp /></main>
          <CyberStatusPanel user={user} />
        </div>
      ) : <Navigate to="/login" />} />

      <Route path="/brainspark" element={
        <div className="layout-wrapper flex h-screen overflow-hidden">
          <CyberSidebar user={user} />
          <main className="flex-1 ml-20 xl:ml-64"><BrainSpark /></main>
        </div>
      } />

      <Route path="/community" element={user ? (
        <div className="layout-wrapper flex h-screen overflow-hidden">
          <CyberSidebar user={user} />
          <main className="flex-1 ml-20 xl:ml-64 p-8 overflow-y-auto">
            <h1 className="font-retro text-4xl text-[#39ff14] mb-8 italic tracking-widest">COMM_CHANNEL</h1>
            <div className="glass-panel p-20 text-center font-mono opacity-50 tracking-[5px]">ENCRYPTED_SIGNAL_LOST... RECONNECTING_IN_V1.1</div>
          </main>
          <CyberStatusPanel user={user} />
        </div>
      ) : <Navigate to="/login" />} />

      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { login, register } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) await login(formData.username, formData.password);
      else await register(formData.username, formData.email, formData.password);
      navigate('/dashboard');
    } catch (e) {
      alert('AUTHENTICATION_FAILED: ACCESS_DENIED');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      <div className="cyber-bg"></div>
      <div className="scanlines"></div>

      <div className="glass-panel p-8 xl:p-12 w-full max-w-md relative z-10 border-t-2 border-[#39ff14]">
        <div className="text-center mb-10">
          <Terminal className="w-12 h-12 text-[#39ff14] mx-auto mb-4" />
          <h1 className="font-retro text-5xl text-white tracking-[8px] mb-2 uppercase">TERMINAL</h1>
          <p className="font-mono text-[10px] text-[#39ff14]/60 tracking-[4px]">IDENTITY_VERIFICATION_REQUIRED</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#39ff14]/40"><Users size={16} /></div>
            <input className="w-full pl-12 pr-4 py-4 bg-black/60 border border-white/10 focus:border-[#39ff14] outline-none font-mono text-sm text-[#39ff14] placeholder:text-white/10" placeholder="USER_NAME" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#39ff14]/40"><Shield size={16} /></div>
            <input className="w-full pl-12 pr-4 py-4 bg-black/60 border border-white/10 focus:border-[#39ff14] outline-none font-mono text-sm text-[#39ff14] placeholder:text-white/10" type="password" placeholder="ACCESS_KEY" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>

          <button className="w-full cyber-btn cyber-btn-primary py-5 text-xl font-retro italic hover:italic-none">
            {isLogin ? 'ESTABLISH_CONNECTION' : 'CREATE_NEW_PROFILE'}
          </button>
        </form>

        <p className="text-center mt-8 cursor-pointer font-mono text-[10px] text-white/30 hover:text-[#39ff14] tracking-[2px] transition-colors" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? ">> NO_MATCHING_ID? INITIALIZE_REGISTRATION" : "<< BACK_TO_PRIMARY_LOGIN"}
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="relative overflow-x-hidden min-h-screen">
        <div className="cyber-bg"></div>
        <div className="scanlines"></div>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
