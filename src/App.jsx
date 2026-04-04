import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import QuizHome from "./pages/QuizHome";
import DashboardPage from "./pages/DashboardPage";
import ResumeBuilder from "./pages/ResumeBuilder";
import MegaLearnHub from "./components/MegaLearnHub";
import InteractiveDashboard from "./components/InteractiveDashboard";
import EduHubDashboard from "./components/EduHubDashboard";
import BrainSparkDashboard from "./components/BrainSparkDashboard";
import Login from "./pages/Login";
import Translator from "./components/Translator";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";

// Wrapper for Dashboard to provide history data if accessed directly
const DashboardWrapper = () => {
    const navigate = useNavigate();

    // Load history from localStorage if available
    const [history, setHistory] = React.useState(() => {
        try {
            const saved = localStorage.getItem('studyHistory');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed.filter(h => h && h.topic) : [];
        } catch (e) {
            console.error("Failed to parse history:", e);
            return [];
        }
    });

    // Mock coins for now, could be loaded from generic storage
    const coins = 1250;

    const handleClose = () => {
        navigate('/');
    };

    return (
        <InteractiveDashboard
            history={history}
            coins={coins}
            onClose={handleClose}
        />
    );
};

const MegaHubWrapper = ({ screen }) => {
    const navigate = useNavigate();
    return <MegaLearnHub initialScreen={screen} onBack={() => navigate('/')} />;
};

const EduHubWrapper = () => {
    const navigate = useNavigate();

    // Load history from localStorage if available
    const [history, setHistory] = React.useState(() => {
        try {
            const saved = localStorage.getItem('studyHistory');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed.filter(h => h && h.topic) : [];
        } catch (e) {
            console.error("Failed to parse history:", e);
            return [];
        }
    });

    const coins = 1250;

    return (
        <EduHubDashboard
            history={history}
            coins={coins}
            userName="Student"
            onClose={() => navigate('/')}
        />
    );
};

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/ask" element={<QuizHome />} />

                {/* Dashboard Routes with Layout */}
                <Route path="/app" element={<DashboardLayout />}>
                    <Route index element={<DashboardWrapper />} />
                    <Route path="arena" element={<BrainSparkDashboard />} />
                    <Route path="study" element={<EduHubWrapper />} />
                    <Route path="notes" element={<MegaHubWrapper screen="notes" />} />
                    <Route path="flashcards" element={<MegaHubWrapper screen="flashcards" />} />
                    <Route path="games" element={<MegaHubWrapper screen="matching" />} />
                    <Route path="wisdom" element={<MegaHubWrapper screen="wisdom" />} />
                    <Route path="reword" element={<MegaHubWrapper screen="reword" />} />
                    <Route path="buddy" element={<MegaHubWrapper screen="buddy" />} />
                    <Route path="resume" element={<ResumeBuilder />} />
                    <Route path="translator" element={<Translator />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
