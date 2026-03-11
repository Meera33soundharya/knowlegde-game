import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import {
    Brain,
    BookOpen,
    Layers,
    FileText,
    Gamepad2,
    Sparkles,
    Search,
    Zap,
    Target,
    TrendingUp,
    ArrowRight,
} from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "AI-Powered Q&A",
        description: "Get instant answers to your questions with our intelligent AI assistant.",
        href: "/ask",
        gradient: "from-primary to-[hsl(280_75%_55%)]",
    },
    {
        icon: BookOpen,
        title: "Smart Notes",
        description: "Create, organize, and export your study notes with ease.",
        href: "/notes",
        gradient: "from-[hsl(172_66%_50%)] to-info",
    },
    {
        icon: Layers,
        title: "Flashcards & Quizzes",
        description: "Master any subject with AI-generated flashcards and interactive quizzes.",
        href: "/flashcards",
        gradient: "from-warning to-[hsl(25_95%_53%)]",
    },
    {
        icon: FileText,
        title: "Resume Builder",
        description: "Create professional resumes with AI-powered suggestions.",
        href: "/resume",
        gradient: "from-success to-[hsl(172_66%_50%)]",
    },
    {
        icon: Gamepad2,
        title: "Educational Games",
        description: "Learn while having fun with engaging educational games.",
        href: "/games",
        gradient: "from-[hsl(280_75%_55%)] to-destructive",
    },
    {
        icon: Target,
        title: "Progress Tracking",
        description: "Monitor your learning journey with detailed analytics.",
        href: "/dashboard",
        gradient: "from-info to-primary",
    },
];

const stats = [
    { label: "Active Students", value: "50K+", icon: TrendingUp },
    { label: "Questions Answered", value: "1M+", icon: Sparkles },
    { label: "Study Hours Saved", value: "100K+", icon: Zap },
];

export default function Index() {
    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse-soft" />
                    <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
                    <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-warning/10 blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
                </div>

                <div className="container mx-auto px-4 py-20 md:py-32 relative">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-primary/20 animate-fade-in">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-secondary-foreground">
                                AI-Powered Learning Platform
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            Learn Smarter,{" "}
                            <span className="gradient-text">Not Harder</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            Your all-in-one educational companion. Ask questions, create notes,
                            master flashcards, build resumes, and track your progress — all powered by AI.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <Link to="/onboarding">
                                <Button variant="hero" size="xl" className="group">
                                    <Search className="w-5 h-5" />
                                    Start Learning
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link to="/dashboard">
                                <Button variant="outline" size="xl">
                                    View Dashboard
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 md:gap-8 pt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            {stats.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={stat.label} className="stat-card text-center">
                                        <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                                        <div className="text-2xl md:text-3xl font-bold gradient-text">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs md:text-sm text-muted-foreground">
                                            {stat.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything You Need to{" "}
                            <span className="gradient-text">Excel</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Powerful tools designed specifically for students to enhance learning,
                            boost productivity, and achieve academic success.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Link
                                    key={feature.title}
                                    to={feature.href}
                                    className="group"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="interactive-card h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {feature.description}
                                        </p>
                                        <div className="mt-4 flex items-center text-primary text-sm font-medium">
                                            Get Started
                                            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-16 text-center">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-10 left-10 w-32 h-32 border border-primary-foreground rounded-full" />
                            <div className="absolute bottom-10 right-10 w-48 h-48 border border-primary-foreground rounded-full" />
                            <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-primary-foreground rounded-full" />
                        </div>

                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground">
                                Ready to Transform Your Learning?
                            </h2>
                            <p className="text-lg text-primary-foreground/80">
                                Join thousands of students who are already learning smarter with EduPlatform.
                            </p>
                            <Link to="/ask">
                                <Button size="xl" className="bg-card text-foreground hover:bg-card/90">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
