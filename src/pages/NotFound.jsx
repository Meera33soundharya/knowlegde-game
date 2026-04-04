import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 mb-4">404</h1>
            <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
            <p className="text-gray-400 max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
            </Link>
        </div>
    );
}
