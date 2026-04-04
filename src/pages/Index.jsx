import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, BookOpen, Brain, Trophy, FileText, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Index() {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/30 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-pink-900/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center">
                {/* Navbar */}
                <nav className="w-full flex justify-between items-center mb-16 backdrop-blur-md bg-white/5 rounded-2xl px-6 py-4 border border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Knowledge Game</span>
                    </div>
                    <div>
                        <Link to="/login">
                            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 mr-2">Log In</Button>
                        </Link>
                        <Link to="/login">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">Sign Up</Button>
                        </Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="text-center max-w-4xl mx-auto mb-20"
                >
                    <motion.div variants={item} className="mb-6 flex justify-center">
                        <span className="px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4" />
                            Welcome to the Future of Learning
                        </span>
                    </motion.div>

                    <motion.h1 variants={item} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200">
                        Knowledge <span className="text-purple-500">Game</span>
                    </motion.h1>

                    <motion.p variants={item} className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Master new skills, challenge your friends, and build your career portfolio in one immersive platform.
                    </motion.p>

                    <motion.div variants={item} className="flex flex-wrap justify-center gap-4">
                        <Link to="/app/arena">
                            <Button className="h-14 px-8 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 shadow-lg shadow-purple-500/25 transition-all hover:scale-105">
                                <Rocket className="mr-2 h-5 w-5" />
                                Enter Arena
                            </Button>
                        </Link>
                        <Link to="/app/study">
                            <Button variant="outline" className="h-14 px-8 text-lg border-purple-500/30 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-105">
                                <BookOpen className="mr-2 h-5 w-5" />
                                Start Learning
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Feature Cards Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
                >
                    {/* Card 1: BrainSpark Arena */}
                    <Link to="/app/arena" className="group">
                        <motion.div variants={item} className="h-full p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-md group-hover:bg-gray-800/50 group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">BrainSpark Arena</h3>
                            <p className="text-gray-400 mb-4">
                                Compete in real-time knowledge battles, climb the leaderboards, and earn XP.
                            </p>
                            <div className="flex items-center text-sm text-purple-400 font-medium">
                                Play Now <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Card 2: EduHub */}
                    <Link to="/app/study" className="group">
                        <motion.div variants={item} className="h-full p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-pink-500/50 transition-all duration-300 backdrop-blur-md group-hover:bg-gray-800/50 group-hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)]">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-pink-300 transition-colors">Study Hub</h3>
                            <p className="text-gray-400 mb-4">
                                Access curated learning paths, interactive quizzes, and track your progress.
                            </p>
                            <div className="flex items-center text-sm text-pink-400 font-medium">
                                Start Learning <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Card 3: MegaLearn Hub */}
                    <Link to="/app/notes" className="group">
                        <motion.div variants={item} className="h-full p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-md group-hover:bg-gray-800/50 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                <BookOpen className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">MegaLearn Hub</h3>
                            <p className="text-gray-400 mb-4">
                                Organize your notes, flashcards, and resources in one powerful workspace.
                            </p>
                            <div className="flex items-center text-sm text-blue-400 font-medium">
                                Open Hub <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Card 4: Resume Builder */}
                    <Link to="/app/resume" className="group">
                        <motion.div variants={item} className="h-full p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-all duration-300 backdrop-blur-md group-hover:bg-gray-800/50 group-hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-green-300 transition-colors">Resume Builder</h3>
                            <p className="text-gray-400 mb-4">
                                Craft a professional resume that highlights your skills and achievements.
                            </p>
                            <div className="flex items-center text-sm text-green-400 font-medium">
                                Build Resume <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Card 5: Dashboard */}
                    <Link to="/app" className="group md:col-span-2 lg:col-span-2">
                        <motion.div variants={item} className="h-full p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-purple-900/20 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-md flex flex-col md:flex-row items-center gap-8 group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.2)]">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wider">
                                        Your Progress
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold mb-4 text-white">Interactive Dashboard</h3>
                                <p className="text-gray-400 mb-6">
                                    Get a comprehensive overview of your learning journey, track your stats, and see where you stand among peers.
                                </p>
                                <Button className="bg-white text-black hover:bg-gray-200 font-bold px-6">
                                    Go to Dashboard
                                </Button>
                            </div>
                            <div className="hidden md:flex items-center justify-center">
                                <Trophy className="w-32 h-32 text-purple-500/20 group-hover:text-purple-500/40 transition-colors duration-500" />
                            </div>
                        </motion.div>
                    </Link>

                </motion.div>
            </div>
        </div>
    );
}
