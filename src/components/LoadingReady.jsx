import React, { useState, useEffect } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

const LoadingReady = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const steps = [
      { progress: 20, text: 'Loading question bank...' },
      { progress: 40, text: 'Setting up AI engine...' },
      { progress: 60, text: 'Preparing study modes...' },
      { progress: 80, text: 'Finalizing setup...' },
      { progress: 100, text: 'Ready to learn!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].progress);
        setLoadingText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onFinish, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        {/* Logo */}
        <div className="mb-8">
          <div className="bg-indigo-100 p-6 rounded-2xl inline-block mb-4">
            <GraduationCap className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Study Hub</h1>
          <p className="text-gray-600">AI-Powered Learning Platform</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3 flex items-center justify-center">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
            {loadingText}
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingReady;