import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Home, BookOpen, Trophy, MessageSquare, LogOut,
  Brain, Zap, Clock, TrendingUp, Users, Plus, Settings,
  Bell, MoreHorizontal, Play, Pause, RotateCcw, CheckCircle, List, ArrowRight, BarChart3
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

const Sidebar = ({ user, logout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Zap, label: 'Mega Hub', path: '/mega-hub' },
    { icon: Brain, label: 'BrainSpark', path: '/brainspark' },
    { icon: Clock, label: 'Focus Timer', path: '/focus' },
    { icon: List, label: 'Tasks', path: '/tasks' },
    { icon: BookOpen, label: 'My Quiz', path: '/quiz' },
    { icon: MessageSquare, label: 'Community', path: '/community' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#6C5DD3] text-white flex flex-col z-50 shadow-2xl">
      <div className="p-8 pb-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl mb-4 flex items-center justify-center text-3xl font-bold shadow-inner">{user?.username?.[0]?.toUpperCase()}</div>
        <h2 className="text-xl font-bold tracking-wide">StudyHub</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item, idx) => (
          <Link key={idx} to={item.path} className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 font-medium ${isActive(item.path) ? 'bg-white text-[#6C5DD3] shadow-lg translate-x-2' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <item.icon className="w-5 h-5" /> {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-6 mt-auto">
        <button onClick={logout} className="flex items-center gap-3 text-white/60 hover:text-white px-2 transition font-medium"><LogOut className="w-5 h-5" /> Logout</button>
      </div>
    </aside>
  );
};

const FocusTimer = () => {
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
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
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

  const setTimerMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setSeconds(0);
    if (newMode === 'focus') setMinutes(25);
    else if (newMode === 'shortBreak') setMinutes(5);
    else setMinutes(15);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full bg-[#F7F7FF]">
      <div className="bg-white rounded-[40px] shadow-xl p-12 text-center w-full max-w-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Focus Timer</h2>
        <div className="flex justify-center gap-2 mb-8 bg-gray-100 p-2 rounded-2xl inline-flex text-center mx-auto">
          {[
            { id: 'focus', label: 'Focus' },
            { id: 'shortBreak', label: 'Short Break' },
            { id: 'longBreak', label: 'Long Break' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setTimerMode(m.id)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${mode === m.id ? 'bg-[#6C5DD3] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="text-[120px] font-bold text-gray-800 leading-none mb-10 tabular-nums tracking-tighter">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="flex justify-center gap-6">
          <button onClick={toggleTimer} className="w-20 h-20 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center shadow-lg hover:bg-indigo-600 transition hover:scale-105">
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
          <button onClick={resetTimer} className="w-20 h-20 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition hover:scale-105">
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
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="p-8 h-full bg-[#F7F7FF]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">My Tasks</h2>
        <form onSubmit={addTask} className="mb-8 relative">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="w-full p-5 bg-white rounded-2xl border-none shadow-lg outline-none focus:ring-2 focus:ring-[#6C5DD3] text-gray-700 font-medium pl-6"
          />
          <button type="submit" className="absolute right-3 top-3 bg-[#6C5DD3] text-white p-2.5 rounded-xl hover:bg-indigo-600 transition">
            <Plus className="w-5 h-5" />
          </button>
        </form>
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className={`flex items-center p-5 bg-white rounded-2xl shadow-sm border border-gray-100 group transition ${task.completed ? 'opacity-50' : ''}`}>
              <button onClick={() => toggleTask(task.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-[#6C5DD3]'}`}>
                {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
              </button>
              <span className={`flex-1 font-medium text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.text}</span>
              <button onClick={() => removeTask(task.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                <LogOut className="w-5 h-5 rotate-90" />
              </button>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-center text-gray-400 mt-10">No tasks yet. Add one above!</p>}
        </div>
      </div>
    </div>
  )
}

const RightPanel = ({ user }) => (
  <aside className="fixed right-0 top-0 h-screen w-80 bg-white border-l border-gray-100 hidden xl:flex flex-col p-8 z-40 overflow-y-auto">
    <div className="flex justify-between items-center mb-10"><h3 className="font-bold text-gray-800">{user?.username}</h3></div>
    <div className="bg-[#6C5DD3] rounded-3xl p-6 text-white relative overflow-hidden h-40"><h3 className="font-bold relative z-10">Premium Access</h3><Zap className="absolute bottom-0 right-0 w-24 h-24 rotate-12 opacity-10" /></div>
  </aside>
)

function AppRoutes() {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/dashboard" element={user ? <div className="layout-wrapper flex h-screen overflow-hidden"><Sidebar user={user} logout={() => window.location.reload()} /><main className="flex-1 ml-64 xl:mr-80 overflow-y-auto"><Dashboard user={user} /></main><RightPanel user={user} /></div> : <Navigate to="/login" />} />
      <Route path="/analytics" element={user ? <AnalyticsDashboard /> : <Navigate to="/login" />} />
      <Route path="/mega-hub" element={user ? <MegaLearnHub /> : <Navigate to="/login" />} />
      <Route path="/focus" element={user ? <div className="layout-wrapper flex h-screen"><Sidebar user={user} /><main className="flex-1 ml-64 p-0"><FocusTimer /></main><RightPanel user={user} /></div> : <Navigate to="/login" />} />
      <Route path="/tasks" element={user ? <div className="layout-wrapper flex h-screen"><Sidebar user={user} /><main className="flex-1 ml-64 p-0"><TaskList /></main><RightPanel user={user} /></div> : <Navigate to="/login" />} />
      <Route path="/quiz" element={user ? <div className="layout-wrapper flex h-screen"><Sidebar user={user} /><main className="flex-1 ml-64 p-8 overflow-y-auto"><QuizApp /></main><RightPanel user={user} /></div> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      <Route path="/community" element={user ? <div className="layout-wrapper bg-[#F7F7FF] flex h-screen overflow-hidden"><Sidebar user={user} /><main className="flex-1 ml-64 p-8 overflow-y-auto"><h1 className="text-3xl font-bold mb-6">Community</h1><p>Community features coming soon...</p></main><RightPanel user={user} /></div> : <Navigate to="/login" />} />
      <Route path="/brainspark" element={<BrainSpark />} />
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
      alert('Error');
    }
  };
  return (
    <div className="min-h-screen bg-[#F0EFFB] flex items-center justify-center">
      <div className="bg-white p-12 rounded-[40px] shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">StudyHub</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-4 bg-gray-50 rounded-xl" placeholder="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
          <input className="w-full p-4 bg-gray-50 rounded-xl" type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          <button className="w-full bg-[#6C5DD3] text-white py-4 rounded-xl font-bold">Login</button>
        </form>
        <p className="text-center mt-4 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "No account? Sign up" : "Login"}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
