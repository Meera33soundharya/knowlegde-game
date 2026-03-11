import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import QuizHome from "./pages/QuizHome";
import DashboardPage from "./pages/DashboardPage";
import ResumeBuilder from "./pages/ResumeBuilder";
import MegaLearnHub from "./components/MegaLearnHub";
import ModernDashboard from "./components/ModernDashboard";

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
        <ModernDashboard
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

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/ask" element={<QuizHome />} />
                <Route path="/dashboard" element={<DashboardWrapper />} />

                {/* Wired Routes */}
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/notes" element={<MegaHubWrapper screen="notes" />} />
                <Route path="/flashcards" element={<MegaHubWrapper screen="flashcards" />} />
                <Route path="/games" element={<MegaHubWrapper screen="matching" />} />
                <Route path="/resume" element={<ResumeBuilder />} />

                {/* Fallback */}
                <Route path="*" element={<Index />} />
            </Routes>
        </BrowserRouter>
    );
}
