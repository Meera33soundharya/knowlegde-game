import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ArrowRightLeft, Copy, Check, RotateCcw, Volume2, Sparkles } from 'lucide-react';
import axios from 'axios';

const Translator = () => {
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('Spanish');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const languages = [
        'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Hindi', 
        'Arabic', 'Russian', 'Portuguese', 'Korean', 'Italian', 'Telugu', 'Tamil'
    ];

    const handleTranslate = async () => {
        if (!sourceText.trim()) return;
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/api/translate', {
                text: sourceText,
                targetLanguage
            });
            setTranslatedText(response.data.translated);
        } catch (error) {
            console.error('Translation failed', error);
            setTranslatedText('Translation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(translatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setSourceText('');
        setTranslatedText('');
    };

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header */}
            <div className="mb-10 text-center">
                <div className="inline-flex p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-4 animate-bounce">
                    <Languages size={32} />
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                    Linguist <span className="text-indigo-400">AI</span>
                </h1>
                <p className="text-slate-400 text-lg">AI-powered translation for 13+ languages</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                {/* Source Input */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-[#0f172a] rounded-3xl p-6 border border-white/5 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Source Text</span>
                            <span className="text-xs text-slate-500 font-mono">{sourceText.length} chars</span>
                        </div>
                        <textarea
                            className="bg-transparent border-none outline-none text-xl text-white placeholder-slate-600 resize-none flex-1 min-h-[200px]"
                            placeholder="Type or paste text here..."
                            value={sourceText}
                            onChange={(e) => setSourceText(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
                            <button 
                                onClick={handleReset}
                                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 transition-colors"
                                title="Reset"
                            >
                                <RotateCcw size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transfer Icon */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
                    <div className="p-4 rounded-full bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)] text-white border-4 border-[#020617]">
                        <ArrowRightLeft size={24} />
                    </div>
                </div>

                {/* Target Output */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-[#0f172a] rounded-3xl p-6 border border-white/5 h-full flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <select 
                                className="bg-indigo-500/10 text-indigo-400 text-xs font-bold outline-none px-3 py-1.5 rounded-lg border border-indigo-500/20 cursor-pointer hover:bg-indigo-500/20 transition-all uppercase tracking-wider"
                                value={targetLanguage}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                            >
                                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                            </select>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleCopy}
                                    className={`p-2 rounded-xl transition-all duration-300 ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </button>
                                <button className="p-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 transition-colors">
                                    <Volume2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className={`text-xl leading-relaxed flex-1 min-h-[200px] ${loading ? 'animate-pulse text-slate-600' : 'text-slate-200'}`}>
                            {loading ? (
                                <div className="flex flex-col gap-2">
                                    <div className="h-6 w-3/4 bg-slate-800 rounded-full"></div>
                                    <div className="h-6 w-full bg-slate-800 rounded-full"></div>
                                    <div className="h-6 w-1/2 bg-slate-800 rounded-full"></div>
                                </div>
                            ) : (
                                translatedText || <span className="text-slate-700 italic">Translated text will appear here...</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Translate Button */}
            <div className="mt-12 flex justify-center">
                <button
                    onClick={handleTranslate}
                    disabled={loading || !sourceText.trim()}
                    className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 active:scale-95 shadow-[0_0_30px_rgba(79,70,229,0.4)]"
                >
                    <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="relative flex items-center gap-2">
                        {loading ? 'COMPUTING...' : 'TRANSLATE NOW'} <Sparkles size={18} className={loading ? 'animate-spin' : ''} />
                    </span>
                </button>
            </div>
            
            {/* Features Row */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-slate-400 text-sm italic">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                ✦ Real-time Context Understanding
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                ✦ High-fidelity Language Models
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                ✦ Optimized for Accuracy
                </div>
            </div>
        </div>
    );
};

export default Translator;
