import React, { useMemo } from 'react';
import { Bar, Doughnut, PolarArea } from 'react-chartjs-2';
import {
    BarChart3,
    TrendingUp,
    PieChart,
    Brain,
    Coffee
} from 'lucide-react';

const StatisticsView = ({ history, coins }) => {
    // Calculate stats
    const stats = useMemo(() => {
        const totalQuizzes = history.length;
        const totalQuestions = history.reduce((acc, h) => acc + (h.total || 0), 0);
        const correctAnswers = history.reduce((acc, h) => acc + (h.score || 0), 0);

        // Category scores
        const categoryStats = {};
        history.forEach(h => {
            const cat = (h.topic || 'General').toLowerCase();
            if (!categoryStats[cat]) categoryStats[cat] = { score: 0, total: 0 };
            categoryStats[cat].score += h.score;
            categoryStats[cat].total += h.total;
        });

        const categoryScores = {};
        Object.keys(categoryStats).forEach(cat => {
            const { score, total } = categoryStats[cat];
            categoryScores[cat] = total > 0 ? Math.round((score / total) * 100) : 0;
        });

        return {
            categoryScores,
            correctAnswers,
            totalQuestions,
            timeOfDayStats: { morning: 15, afternoon: 45, evening: 30, night: 10 } // Mock data for now
        };
    }, [history]);

    // Chart Data
    const categoryChartData = {
        labels: Object.keys(stats.categoryScores).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
        datasets: [{
            label: 'Category Scores',
            data: Object.values(stats.categoryScores),
            backgroundColor: [
                'rgba(56, 189, 248, 0.8)', // Cyan
                'rgba(168, 85, 247, 0.8)', // Purple
                'rgba(244, 63, 94, 0.8)',  // Rose
                'rgba(251, 146, 60, 0.8)', // Orange
                'rgba(34, 197, 94, 0.8)',  // Emerald
            ],
            borderColor: '#1e293b',
            borderWidth: 2
        }]
    };

    const accuracyChartData = {
        labels: ['Correct', 'Incorrect'],
        datasets: [{
            data: [stats.correctAnswers, stats.totalQuestions - stats.correctAnswers],
            backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
            borderColor: '#1e293b',
            borderWidth: 2
        }]
    };

    const timeOfDayData = {
        labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
        datasets: [{
            label: 'Activity',
            data: Object.values(stats.timeOfDayStats),
            backgroundColor: [
                'rgba(251, 191, 36, 0.6)',
                'rgba(59, 130, 246, 0.6)',
                'rgba(168, 85, 247, 0.6)',
                'rgba(99, 102, 241, 0.6)'
            ],
            borderColor: '#1e293b',
            borderWidth: 2
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(51, 65, 85, 0.5)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Category Performance */}
                <div className="p-6 rounded-2xl bg-[#1e293b]/50 border border-[#334155] backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-cyan-400" />
                        Sector Analysis
                    </h3>
                    <div className="h-64">
                        <Bar data={categoryChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Accuracy Donut */}
                <div className="p-6 rounded-2xl bg-[#1e293b]/50 border border-[#334155] backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-emerald-400" />
                        Hit Rate
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                        <div className="w-48 h-48">
                            <Doughnut data={accuracyChartData} options={{ ...chartOptions, cutout: '70%', scales: { display: false } }} />
                        </div>
                    </div>
                </div>

                {/* Time Distribution */}
                <div className="p-6 rounded-2xl bg-[#1e293b]/50 border border-[#334155] backdrop-blur-sm lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Coffee className="w-5 h-5 text-amber-400" />
                        Temporal Activity
                    </h3>
                    <div className="h-64">
                        <PolarArea data={timeOfDayData} options={{ ...chartOptions, scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { display: false, backdropColor: 'transparent' } } } }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsView;
