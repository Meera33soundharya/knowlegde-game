import React, { useEffect } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export default function Dashboard({ score, total, userAnswers, timeLeft }) {
  const correct = userAnswers.filter(a => a.correct).length
  const wrong = userAnswers.length - correct

  const donutData = {
    labels: ['Correct', 'Wrong'],
    datasets: [{ data: [correct, wrong], backgroundColor: ['#10B981', '#EF4444'], hoverOffset: 6 }]
  }

  const barData = {
    labels: userAnswers.map((u, i) => `Q${i+1}`),
    datasets: [{ label: 'Answered (1=correct, 0=wrong)', data: userAnswers.map(u => u.correct ? 1 : 0), backgroundColor: userAnswers.map(u => u.correct ? '#34D399' : '#FB7185') }]
  }

  return (
    <aside className="fixed right-4 top-20 w-80 bg-white/70 dark:bg-slate-800/70 backdrop-blur rounded-2xl p-4 shadow-lg z-40">
      <h3 className="font-bold text-lg mb-2">Live Dashboard</h3>
      <div className="mb-3">
        <div className="text-sm text-slate-600 dark:text-slate-300">Score</div>
        <div className="text-2xl font-extrabold">{score} / {total || 0}</div>
      </div>

      <div className="mb-3">
        <div className="text-sm text-slate-600 dark:text-slate-300">Progress</div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden mt-1">
          <div className="bg-indigo-500 h-3 rounded-full transition-all" style={{ width: `${(userAnswers.length / (total || 1)) * 100}%` }} />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <Doughnut data={donutData} />
        </div>
        <div className="w-1/2">
          <Bar data={barData} options={{ plugins: { legend: { display: false } }, scales: { y: { display: false } } }} />
        </div>
      </div>

      <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">Time Left: <span className="font-semibold text-slate-800 dark:text-white">{timeLeft}s</span></div>
    </aside>
  )
}
