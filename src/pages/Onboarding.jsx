import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    User, BookOpen, Code, Rocket, Star, Check,
    ChevronRight, Brain, Target, Zap, Briefcase,
    Layout, Shield, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

// Step 1: Profile Setup
const Step1Profile = ({ data, updateData, nextStep }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 w-full max-w-md"
        >
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <User className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Let's get to know you!</h2>
                <p className="text-muted-foreground">Setup your profile to personalize your learning journey.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">What should we call you?</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => updateData('name', e.target.value)}
                        className="w-full p-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        placeholder="Type your name..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Age</label>
                        <input
                            type="number"
                            value={data.age}
                            onChange={(e) => updateData('age', e.target.value)}
                            className="w-full p-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="18"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Education</label>
                        <select
                            value={data.education}
                            onChange={(e) => updateData('education', e.target.value)}
                            className="w-full p-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        >
                            <option value="school">School</option>
                            <option value="college">College</option>
                            <option value="graduated">Graduated</option>
                            <option value="professional">Professional</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Experience Level</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                            <button
                                key={level}
                                onClick={() => updateData('level', level)}
                                className={cn(
                                    "p-2 rounded-lg text-sm font-medium border transition-all hover:scale-105",
                                    data.level === level
                                        ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                                        : "bg-card hover:bg-accent"
                                )}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Button
                onClick={nextStep}
                className="w-full rounded-xl py-6 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                disabled={!data.name}
            >
                Continue <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
        </motion.div>
    );
};

// Step 2: Skills & Interests
const Step2Skills = ({ data, updateData, nextStep, prevStep }) => {
    const interests = [
        { id: 'coding', label: 'Coding', icon: Code, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'science', label: 'Science', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { id: 'math', label: 'Mathematics', icon: CalculatorIcon, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { id: 'design', label: 'Design', icon: Layout, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { id: 'business', label: 'Business', icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { id: 'ai', label: 'AI & ML', icon: Rocket, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    const toggleInterest = (id) => {
        const current = data.interests || [];
        const updated = current.includes(id)
            ? current.filter(i => i !== id)
            : [...current, id];
        updateData('interests', updated);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 w-full max-w-md"
        >
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">What interests you?</h2>
                <p className="text-muted-foreground">Select topics you want to master.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {interests.map((item) => {
                    const isSelected = (data.interests || []).includes(item.id);
                    return (
                        <button
                            key={item.id}
                            onClick={() => toggleInterest(item.id)}
                            className={cn(
                                "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 relative overflow-hidden group",
                                isSelected
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 scale-105"
                                    : "bg-card hover:border-primary/50 hover:bg-accent"
                            )}
                        >
                            <div className={cn("p-2 rounded-full transition-colors", item.bg, isSelected && "bg-background")}>
                                <item.icon className={cn("w-6 h-6", item.color)} />
                            </div>
                            <span className="font-medium text-sm">{item.label}</span>
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="w-1/3 py-6 rounded-xl">
                    Back
                </Button>
                <Button
                    onClick={() => {
                        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                        nextStep();
                    }}
                    className="w-2/3 py-6 rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
                >
                    Build Dashboard <Star className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
};

// Step 3: Pre-Ready Dashboard
const Step3Dashboard = ({ data, startLearning }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl"
        >
            {/* Welcome Header */}
            <div className="text-center mb-8 space-y-2">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        Welcome, {data.name}!
                    </h1>
                    <p className="text-xl text-muted-foreground mt-2">
                        Your personalized learning workstation is ready.
                    </p>
                </motion.div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

                {/* Card 1: Learning Path */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-border/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full">
                            {data.level}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">Learning Path</h3>
                    <p className="text-sm text-muted-foreground mb-4">Customized for {data.education} level</p>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "15%" }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="h-full bg-blue-500"
                        />
                    </div>
                    <div className="mt-2 text-xs font-medium text-right text-blue-500">15% Ready</div>
                </motion.div>

                {/* Card 2: Coding Activity */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card border border-border/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <Zap className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 rounded-full">
                            0 Day Streak
                        </span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">Coding Activity</h3>
                    <p className="text-sm text-muted-foreground mb-4">Start your streak today!</p>
                    <div className="flex items-end gap-1 h-8 mt-2">
                        {[20, 45, 30, 60, 25, 10].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 0.8 + (i * 0.1) }}
                                className="w-1/6 bg-orange-200 dark:bg-orange-900/30 rounded-t-sm"
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Card 3: Career Readiness */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer lg:col-span-1 md:col-span-2"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <Target className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold mb-1">Career Goal</h3>
                    <p className="text-sm text-muted-foreground mb-4">Target: Software Engineer</p>
                    <div className="flex gap-2 flex-wrap">
                        {(data.interests || ['Coding']).slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs border px-2 py-1 rounded-md">{tag}</span>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Action Area */}
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, type: 'spring' }}
                    className="relative"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                    <Button
                        size="xl"
                        onClick={startLearning}
                        className="relative min-w-[250px] py-8 text-xl font-bold rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                    >
                        GO TO LEARNING
                        <Rocket className="ml-3 w-6 h-6 animate-pulse" />
                    </Button>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-sm text-muted-foreground animate-pulse"
                >
                    Preparing your environment...
                </motion.p>
            </div>
        </motion.div>
    );
};

// Utils
function CalculatorIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="16" height="20" x="4" y="2" rx="2" />
            <line x1="8" x2="16" y1="6" y2="6" />
            <line x1="16" x2="16" y1="14" y2="18" />
            <path d="M16 10h.01" />
            <path d="M12 10h.01" />
            <path d="M8 10h.01" />
            <path d="M12 14h.01" />
            <path d="M8 14h.01" />
            <path d="M12 18h.01" />
            <path d="M8 18h.01" />
        </svg>
    )
}

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({
        name: '',
        age: '',
        education: 'college',
        level: 'Beginner',
        interests: []
    });

    const updateData = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleFinish = () => {
        localStorage.setItem('userProfile', JSON.stringify(userData));
        localStorage.setItem('onboardingComplete', 'true');
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full animate-blob" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[100px] rounded-full animate-blob animation-delay-2000" />

            {/* Progress Bar (Visible only for Step 1 & 2) */}
            {step < 3 && (
                <div className="absolute top-10 left-0 right-0 max-w-md mx-auto px-4">
                    <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
                        <span className={step >= 1 ? "text-primary transition-colors" : ""}>Profile</span>
                        <span className={step >= 2 ? "text-primary transition-colors" : ""}>Interests</span>
                        <span className={step >= 3 ? "text-primary transition-colors" : ""}>Ready</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            className="h-full bg-primary transition-all duration-500"
                        />
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 1 && <Step1Profile key="step1" data={userData} updateData={updateData} nextStep={nextStep} />}
                {step === 2 && <Step2Skills key="step2" data={userData} updateData={updateData} nextStep={nextStep} prevStep={prevStep} />}
                {step === 3 && <Step3Dashboard key="step3" data={userData} startLearning={handleFinish} />}
            </AnimatePresence>
        </div>
    );
}
