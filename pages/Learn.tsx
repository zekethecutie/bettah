
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, GraduationCap, CheckCircle, ChevronRight, PlayCircle, Trophy, RefreshCw, ArrowLeft, Target, Shield, Swords, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import { Chess, Move, Square } from 'chess.js';
import Board, { Arrow } from '../components/Board';
import { LESSONS } from '../utils/lessonContent';
import { UserManager } from '../utils/storage';
import { User, Lesson } from '../types';

interface LearnProps {}

const CATEGORIES = [
    { id: 'Tactics', icon: Swords, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { id: 'Openings', icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { id: 'Endgame', icon: Target, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { id: 'Strategy', icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' }
];

const Learn: React.FC<LearnProps> = () => {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [user, setUser] = useState<User | null>(UserManager.getCurrentUser());
    const [activeCategory, setActiveCategory] = useState<string>('Tactics');
    
    // Lesson State
    const [game, setGame] = useState(new Chess());
    const [moveIndex, setMoveIndex] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [notification, setNotification] = useState<{type:string, message:string}|null>(null);
    const [arrows, setArrows] = useState<Arrow[]>([]);

    useEffect(() => {
        setUser(UserManager.getCurrentUser());
    }, [selectedLesson]);

    const startLesson = (lesson: Lesson) => {
        const newGame = new Chess();
        if (lesson.fen) {
            newGame.load(lesson.fen);
        }
        setGame(newGame);
        setMoveIndex(0);
        setFeedback(null);
        setIsSuccess(false);
        setArrows([]);
        setSelectedLesson(lesson);
    };

    const showHint = () => {
        if (!selectedLesson) return;
        const expectedSan = selectedLesson.solutionMoves[moveIndex];
        
        const tempGame = new Chess(game.fen());
        const moves = tempGame.moves({ verbose: true });
        const correctMoveObj = moves.find(m => m.san === expectedSan);
        
        if (correctMoveObj) {
            setArrows([{ from: correctMoveObj.from, to: correctMoveObj.to, color: 'green' }]);
            setFeedback("Hint: Try looking at the green arrow.");
        }
    };

    const handleLessonMove = (move: Move) => {
        if (!selectedLesson) return;
        
        const expectedSan = selectedLesson.solutionMoves[moveIndex];
        
        if (move.san === expectedSan) {
            // Correct Move
            const nextIndex = moveIndex + 1;
            setMoveIndex(nextIndex);
            
            // Draw Green Arrow for success
            setArrows([{ from: move.from, to: move.to, color: 'green' }]);

            setFeedback("Correct! " + (nextIndex === selectedLesson.solutionMoves.length ? selectedLesson.explanation : "Keep going..."));
            setNotification({ type: 'info', message: 'EXCELLENT' });

            if (nextIndex === selectedLesson.solutionMoves.length) {
                setIsSuccess(true);
                UserManager.completeLesson(selectedLesson.id);
            }
        } else {
            // Wrong Move Logic
            const specificHint = selectedLesson.hints ? selectedLesson.hints[move.san] : null;
            const msg = specificHint || "Incorrect. Analyze the position and try again.";
            
            setFeedback(msg);
            setNotification({ type: 'check', message: 'MISTAKE' });

            const userArrow: Arrow = { from: move.from, to: move.to, color: 'red' };
            
            setTimeout(() => {
                const undoGame = new Chess(game.fen());
                undoGame.undo(); 
                
                const moves = undoGame.moves({ verbose: true });
                const correctMoveObj = moves.find(m => m.san === expectedSan);
                
                const hints: Arrow[] = [userArrow];
                if (correctMoveObj) {
                    hints.push({ from: correctMoveObj.from, to: correctMoveObj.to, color: 'green' });
                }
                
                setGame(undoGame);
                setArrows(hints);
            }, 800); 
        }
    };

    const filteredLessons = LESSONS.filter(l => l.category === activeCategory);

    return (
        <div className="w-full h-full p-4 lg:p-8 animate-in fade-in duration-500 flex flex-col gap-8 mb-20 lg:mb-0 pb-24 lg:pb-8">
            
            {/* Header & Sidebar - HIDDEN when lesson is active */}
            {!selectedLesson && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row gap-8"
                >
                    {/* Category Selection */}
                    <div className="lg:w-64 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 shrink-0 custom-scrollbar">
                        <div className="hidden lg:block mb-6">
                            <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
                                <GraduationCap className="w-8 h-8 text-cyan-400" /> ACADEMY
                            </h1>
                            <p className="text-xs text-slate-500 mt-1">Master the game, one move at a time.</p>
                        </div>
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`p-4 rounded-xl flex items-center gap-3 transition-all border ${
                                        isActive ? `${cat.bg} ${cat.border} ring-1 ring-white/10` : 'bg-slate-900/30 border-transparent hover:bg-slate-800'
                                    } min-w-[140px] lg:min-w-0`}
                                >
                                    <div className={`${isActive ? cat.color : 'text-slate-500'}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{cat.id}</p>
                                        <p className="text-[10px] text-slate-600">
                                            {LESSONS.filter(l => l.category === cat.id).length} Lessons
                                        </p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {/* Lesson Grid */}
                    <div className="flex-1">
                        <motion.div 
                            key={activeCategory}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {filteredLessons.length > 0 ? filteredLessons.map((lesson) => {
                                const isCompleted = user?.completedLessons.includes(lesson.id);
                                return (
                                    <div 
                                        key={lesson.id}
                                        onClick={() => startLesson(lesson)}
                                        className={`group relative p-6 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                                            isCompleted 
                                            ? 'bg-emerald-900/10 border-emerald-500/30 hover:bg-emerald-900/20' 
                                            : 'bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-cyan-400'}`}>
                                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                                                lesson.difficulty === 'Grandmaster' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' : 
                                                'bg-slate-950/50 text-slate-500 border-slate-800'
                                            }`}>
                                                {lesson.difficulty}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{lesson.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{lesson.description}</p>
                                        
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                                            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> +200 XP</span>
                                            {isCompleted && <span className="text-emerald-500 flex items-center gap-1 ml-auto"><CheckCircle className="w-3 h-3"/> Done</span>}
                                        </div>
                                        
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                    </div>
                                );
                            }) : (
                                <div className="col-span-full py-20 text-center opacity-50">
                                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                                    <p>No lessons available in this category yet.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {/* Active Lesson View - Takes Full Screen */}
            <AnimatePresence>
                {selectedLesson && (
                    <motion.div 
                        key="lesson-view"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col xl:flex-row gap-8 h-full max-w-7xl mx-auto w-full"
                    >
                        {/* Board Area */}
                        <div className="flex-1 flex justify-center items-start bg-[#020617] rounded-3xl border border-slate-800 p-4 shadow-2xl relative min-h-[400px]">
                            <div className="w-full max-w-[600px] aspect-square relative">
                                <Board 
                                    game={game} 
                                    setGame={setGame} 
                                    onMove={handleLessonMove}
                                    flip={false}
                                    setNotification={setNotification}
                                    isReadOnly={isSuccess}
                                    arrows={arrows}
                                />
                            </div>
                            
                            {/* Success Overlay - High Z-Index to cover arrows */}
                            {isSuccess && (
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] rounded-3xl"
                                >
                                    <div className="text-center p-8 bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
                                        <Trophy className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                        <h2 className="text-3xl font-black text-white mb-2">LESSON COMPLETE</h2>
                                        <p className="text-emerald-300 font-bold mb-6">+200 XP Earned</p>
                                        <div className="flex flex-col gap-3">
                                            <button onClick={() => setSelectedLesson(null)} className="px-6 py-3 bg-slate-800 rounded-xl font-bold text-white hover:bg-slate-700 w-full">Back to Menu</button>
                                            <button onClick={() => startLesson(selectedLesson)} className="px-6 py-3 bg-emerald-600 rounded-xl font-bold text-white hover:bg-emerald-500 w-full">Retry Lesson</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Instructions Sidebar */}
                        <div className="xl:w-96 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col h-fit shrink-0">
                            <button onClick={() => setSelectedLesson(null)} className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 w-fit">
                                <ArrowLeft className="w-4 h-4" /> Back to Lessons
                            </button>

                            <h2 className="text-3xl font-black text-white mb-2 leading-tight">{selectedLesson.title}</h2>
                            <div className="flex gap-2 mb-6">
                                <span className="inline-block px-3 py-1 rounded-full bg-cyan-900/30 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                                    {selectedLesson.category}
                                </span>
                                <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold border border-slate-700">
                                    {selectedLesson.difficulty}
                                </span>
                            </div>

                            <div className="prose prose-invert text-sm text-slate-300 mb-8 leading-relaxed">
                                <p>{selectedLesson.description}</p>
                            </div>

                            <div className={`mt-auto p-4 rounded-xl border transition-colors ${
                                isSuccess ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-200' 
                                : feedback?.includes('Incorrect') ? 'bg-rose-900/20 border-rose-500/30 text-rose-200'
                                : feedback?.includes('Hint') ? 'bg-amber-900/20 border-amber-500/30 text-amber-200'
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {feedback?.includes('Incorrect') && <AlertTriangle className="w-4 h-4" />}
                                    {feedback?.includes('Hint') && <Lightbulb className="w-4 h-4" />}
                                    <h4 className="font-bold text-xs uppercase opacity-70">Instructor Feedback</h4>
                                </div>
                                <p className="font-medium text-sm">
                                    {feedback || "Analyze the position and make the best move."}
                                </p>
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button 
                                    onClick={showHint}
                                    disabled={isSuccess}
                                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-amber-400 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <Lightbulb className="w-4 h-4" /> Hint
                                </button>
                                <button 
                                    onClick={() => startLesson(selectedLesson)}
                                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" /> Reset
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Learn;
