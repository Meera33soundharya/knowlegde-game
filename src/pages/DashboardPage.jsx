import React, { useState } from 'react';
import { X, TrendingUp, Clock, Target, Award, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

const DashboardPage = ({ onClose, score, total, userAnswers, timeLeft, history }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate statistics
  const totalQuizzes = history.length;
  const averageScore = history.length > 0 ? 
    Math.round(history.reduce((sum, h) => sum + (h.score / h.total * 100), 0) / history.length) : 0;
  const totalCorrect = history.reduce((sum, h) => sum + h.score, 0);
  const totalQuestions = history.reduce((sum, h) => sum + h.total, 0);
  
  // Recent performance trend
  const recentHistory = history.slice(0, 7).reverse();
  const trendData = {
    labels: recentHistory.map((_, i) => `Quiz ${i + 1}`),
    datasets: [{
      label: 'Score %',
      data: recentHistory.map(h => Math.round((h.score / h.total) * 100)),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  // Topic performance
  const topicStats = {};
  history.forEach(h => {
    if (!topicStats[h.topic]) {
      topicStats[h.topic] = { total: 0, correct: 0, attempts: 0 };
    }
    topicStats[h.topic].total += h.total;
    topicStats[h.topic].correct += h.score;
    topicStats[h.topic].attempts += 1;
  });

  const topicData = {
    labels: Object.keys(topicStats).slice(0, 5),
    datasets: [{
      data: Object.values(topicStats).slice(0, 5).map(t => Math.round((t.correct / t.total) * 100)),
      backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'],
      hoverOffset: 4
    }]
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'indigo' }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        <Icon className={`w-12 h-12 text-${color}-500`} />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Study Analytics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'topics', label: 'Topics', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={Award}
                  title="Total Quizzes"
                  value={totalQuizzes}
                  subtitle="Completed"
                  color="indigo"
                />
                <StatCard
                  icon={Target}
                  title="Average Score"
                  value={`${averageScore}%`}
                  subtitle="Across all quizzes"
                  color="green"
                />
                <StatCard
                  icon={TrendingUp}
                  title="Questions Answered"
                  value={totalQuestions}
                  subtitle={`${totalCorrect} correct`}
                  color="purple"
                />
                <StatCard
                  icon={Clock}
                  title="Study Streak"
                  value="7"
                  subtitle="Days active"
                  color="orange"
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {history.slice(0, 5).map((entry, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{entry.topic}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{entry.timestamp}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">{entry.score}/{entry.total}</p>
                        <p className="text-sm text-gray-500">{Math.round((entry.score/entry.total)*100)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Trend</h3>
                {recentHistory.length > 0 ? (
                  <Line data={trendData} options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true, max: 100 }
                    }
                  }} />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data available yet. Take some quizzes to see your progress!</p>
                )}
              </div>

              {/* Performance Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Strengths</h3>
                  <div className="space-y-2">
                    {Object.entries(topicStats)
                      .sort((a, b) => (b[1].correct/b[1].total) - (a[1].correct/a[1].total))
                      .slice(0, 3)
                      .map(([topic, stats]) => (
                        <div key={topic} className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                          <span className="font-bold text-green-600">{Math.round((stats.correct/stats.total)*100)}%</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Areas to Improve</h3>
                  <div className="space-y-2">
                    {Object.entries(topicStats)
                      .sort((a, b) => (a[1].correct/a[1].total) - (b[1].correct/b[1].total))
                      .slice(0, 3)
                      .map(([topic, stats]) => (
                        <div key={topic} className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                          <span className="font-bold text-orange-600">{Math.round((stats.correct/stats.total)*100)}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Topic Performance</h3>
                  {Object.keys(topicStats).length > 0 ? (
                    <Doughnut data={topicData} options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }} />
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No topic data available yet.</p>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Topic Details</h3>
                  <div className="space-y-4">
                    {Object.entries(topicStats).map(([topic, stats]) => (
                      <div key={topic} className="border-l-4 border-indigo-500 pl-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">{topic}</h4>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{stats.attempts} attempts</span>
                          <span>{stats.correct}/{stats.total} correct</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(stats.correct/stats.total)*100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;