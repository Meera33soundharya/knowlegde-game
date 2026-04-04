import React, { useState } from "react";

export default function BrainSparkDashboard() {
    const [xp, setXp] = useState(350);
    const [level, setLevel] = useState(5);
    const [coins, setCoins] = useState(1200);
    const [rank, setRank] = useState("Gold");
    const [streak, setStreak] = useState(3);

    const maxXP = 500;
    const xpPercent = (xp / maxXP) * 100;

    const handlePlay = () => {
        const gainedXP = 50;
        const gainedCoins = 100;

        let newXP = xp + gainedXP;
        let newLevel = level;

        if (newXP >= maxXP) {
            newXP = newXP - maxXP;
            newLevel += 1;
        }

        setXp(newXP);
        setLevel(newLevel);
        setCoins(coins + gainedCoins);
        setStreak(streak + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-purple-400">
                    🧠 BrainSpark Arena
                </h1>
                <div className="bg-gray-800 px-4 py-2 rounded-xl shadow-lg">
                    👤 Meerasoundharya
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
                    <h2 className="text-lg text-gray-400">Level</h2>
                    <p className="text-3xl font-bold text-purple-400">{level}</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
                    <h2 className="text-lg text-gray-400">Coins</h2>
                    <p className="text-3xl font-bold text-yellow-400">{coins} 🪙</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
                    <h2 className="text-lg text-gray-400">Rank</h2>
                    <p className="text-3xl font-bold text-green-400">{rank}</p>
                </div>
            </div>

            {/* XP Progress Bar */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl mb-8">
                <h2 className="text-lg text-gray-400 mb-2">XP Progress</h2>
                <div className="w-full bg-gray-700 rounded-full h-6">
                    <div
                        className="bg-purple-500 h-6 rounded-full transition-all duration-500"
                        style={{ width: `${xpPercent}%` }}
                    ></div>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                    {xp} / {maxXP} XP
                </p>
            </div>

            {/* Game Modes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                    onClick={handlePlay}
                    className="bg-purple-600 hover:bg-purple-700 p-6 rounded-2xl text-xl font-bold shadow-xl transition transform hover:scale-105"
                >
                    ⚡ Quick Spark
                </button>

                <button
                    onClick={handlePlay}
                    className="bg-blue-600 hover:bg-blue-700 p-6 rounded-2xl text-xl font-bold shadow-xl transition transform hover:scale-105"
                >
                    ⚔️ 1v1 Brain Duel
                </button>

                <button
                    onClick={handlePlay}
                    className="bg-pink-600 hover:bg-pink-700 p-6 rounded-2xl text-xl font-bold shadow-xl transition transform hover:scale-105"
                >
                    🌍 Global Tournament
                </button>

                <button
                    onClick={handlePlay}
                    className="bg-green-600 hover:bg-green-700 p-6 rounded-2xl text-xl font-bold shadow-xl transition transform hover:scale-105"
                >
                    🧩 Puzzle Mode
                </button>
            </div>

            {/* Streak Section */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl text-center">
                <h2 className="text-lg text-gray-400">🔥 Daily Streak</h2>
                <p className="text-3xl font-bold text-red-500">{streak} Days</p>
            </div>
        </div>
    );
}
