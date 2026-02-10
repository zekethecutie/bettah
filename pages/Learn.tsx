
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, GraduationCap, CheckCircle, PlayCircle, Trophy, RefreshCw, ArrowLeft, Target, Shield, Swords, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import { Chess, Move } from 'chess.js';
import Board, { Arrow } from '../components/Board';
import { LESSONS } from '../utils/lessonContent';
import { UserManager } from '../utils/storage';
import { User, Lesson } from '../types';
import { playSound } from '../utils/gameLogic';

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

    // Handle Opponent Auto-Moves
    useEffect(() => {
        if (!selectedLesson || isSuccess) return;

        // Solution array contains all moves: User, Opponent, User, Opponent...
        if (moveIndex < selectedLesson.solutionMoves.length && moveIndex % 2 !== 0) {
            // It is the opponent's turn in the script
            const timer = setTimeout(() => {
                const opponentMoveSan = selectedLesson.solutionMoves[moveIndex];
                try {
                    // Execute Opponent Move
                    const result = game.move(opponentMoveSan);
                    if (result) {
                        const newGame = new Chess();
                        newGame.loadPgn(game.pgn());
                        setGame(newGame);
                        playSound(result.captured ? 'capture' : 'move');
                        
                        // Advance Index
                        setMoveIndex(prev => prev + 1);
                    }
                } catch (e) {
                    console.error("Auto-play error", e);
                }
            }, 800); 
            return () => clearTimeout(timer);
        }
    }, [moveIndex, selectedLesson, game, isSuccess]);


    const startLesson = (lesson: Lesson) => {
        const newGame = new Chess();
        if (lesson.fen) {
            try {
                newGame.load(lesson.fen);
            } catch (e) {
                console.error("Invalid FEN in lesson:", lesson.title);
                newGame.reset();
            }
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
        if (moveIndex >= selectedLesson.solutionMoves.length) return;

        const expectedSan = selectedLesson.solutionMoves[moveIndex];
        const tempGame = new Chess(game.fen());
        const moves = tempGame.moves({ verbose: true });
        const correctMoveObj = moves.find(m => m.san === expectedSan);
        
        if (correctMoveObj) {
            setArrows([{ from: correctMoveObj.from, to: correctMoveObj.to, color: 'green' }]);
            setFeedback("Hint: Follow the green arrow for the best move.");
        } else {
            setFeedback("Hint: Look for a move that matches the lesson description.");
        }
    };

    const handleLessonMove = (move: Move) => {
        if (!selectedLesson) return;
        if (moveIndex >= selectedLesson.solutionMoves.length) return;
        if (moveIndex % 2 !== 0) return; 

        const expectedSan = selectedLesson.solutionMoves[moveIndex];
        
        if (move.san === expectedSan) {
            const nextIndex = moveIndex + 1;
            setMoveIndex(nextIndex);
            
            setArrows([{ from: move.from, to: move.to, color: 'green' }]);
            setTimeout(() => setArrows([]), 800);

            if (nextIndex >= selectedLesson.solutionMoves.length) {
                setFeedback("Correct! " + selectedLesson.explanation);
                setNotification({ type: 'info', message: 'COMPLETED' });
                setIsSuccess(true);
                UserManager.completeLesson(selectedLesson.id);
            } else {
                setFeedback("Correct! Wait for response...");
                setNotification({ type: 'info', message: 'GOOD MOVE' });
            }
        } else {
            const specificHint = selectedLesson.hints ? selectedLesson.hints[move.san] : null;
            const msg = specificHint || "Incorrect move. Try to find the best continuation.";
            
            setFeedback(msg);
            setNotification({ type: 'check', message: 'TRY AGAIN' });
            playSound('check'); 

            const userArrow: Arrow = { from: move.from, to: move.to, color: 'red' };
            setArrows([userArrow]);
            
            setTimeout(() => {
                const undoGame = new Chess(game.fen());
                undoGame.undo(); 
                setGame(undoGame);
            }, 800); 
        }
    };

    const filteredLessons = LESSONS.filter(l => l.category === activeCategory);

    return (
        <div className="w-full min-h-full p-4 lg:p-8 animate-in fade-in duration-500 flex flex-col gap-8 pb-32 lg:pb-8">
            
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
                            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                <GraduationCap className="w-8 h-8" style={{ color: 'var(--primary)' }} /> ACADEMY
                            </h1>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Master the game, one move at a time.</p>
                        </div>
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`p-4 rounded-xl flex items-center gap-3 transition-all border ${
                                        isActive ? `${cat.bg} ${cat.border} ring-1 ring-white/10` : 'border-transparent hover:bg-white/5'
                                    } min-w-[140px] lg:min-w-0`}
                                    style={!isActive ? { backgroundColor: 'var(--element-bg)' } : {}}
                                >
                                    <div className={`${isActive ? cat.color : ''}`} style={!isActive ? { color: 'var(--text-muted)' } : {}}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm font-bold`} style={{ color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>{cat.id}</p>
                                        <p className="text-[10px]" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
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
                                            : 'hover:border-cyan-500/50 hover:bg-white/5'
                                        }`}
                                        style={{ backgroundColor: isCompleted ? undefined : 'var(--panel-bg)', borderColor: isCompleted ? undefined : 'var(--border-color)' }}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-2 rounded-lg`} style={{ backgroundColor: isCompleted ? '#10b981' : 'var(--element-bg)', color: isCompleted ? 'white' : 'var(--primary)' }}>
                                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border`} style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                                                {lesson.difficulty}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--primary)] transition-colors" style={{ color: 'var(--text-main)' }}>{lesson.title}</h3>
                                        <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{lesson.description}</p>
                                        
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
                                            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> +200 XP</span>
                                            {isCompleted && <span className="text-emerald-500 flex items-center gap-1 ml-auto"><CheckCircle className="w-3 h-3"/> Done</span>}
                                        </div>
                                        
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                    </div>
                                );
                            }) : (
                                <div className="col-span-full py-20 text-center opacity-50">
                                    <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                                    <p style={{ color: 'var(--text-muted)' }}>No lessons available in this category yet.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {/* Active Lesson View - Board First on Mobile */}
            <AnimatePresence>
                {selectedLesson && (
                    <motion.div 
                        key="lesson-view"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto"
                    >
                        {/* Board Area - Order 1 on Mobile ensures it's at the top */}
                        <div className="w-full lg:flex-1 flex justify-center items-start lg:rounded-3xl lg:border lg:p-4 lg:shadow-2xl relative order-1" style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--border-color)' }}>
                            <div className="w-full max-w-md lg:max-w-[600px] aspect-square relative mx-auto">
                                <Board 
                                    game={game} 
                                    setGame={setGame} 
                                    onMove={handleLessonMove}
                                    flip={false}
                                    setNotification={setNotification}
                                    isReadOnly={isSuccess || moveIndex % 2 !== 0}
                                    arrows={arrows}
                                />
                                
                                {isSuccess && (
                                    <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] rounded-lg"
                                    >
                                        <div className="text-center p-6 bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-2xl max-w-[280px] w-full">
                                            <Trophy className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                                            <h2 className="text-2xl font-black text-white mb-2">COMPLETE</h2>
                                            <p className="text-emerald-300 font-bold mb-4 text-sm">+200 XP Earned</p>
                                            <div className="flex flex-col gap-2">
                                                <button onClick={() => setSelectedLesson(null)} className="px-4 py-2 bg-slate-800 rounded-xl font-bold text-white text-sm hover:bg-slate-700 w-full">Back to Menu</button>
                                                <button onClick={() => startLesson(selectedLesson)} className="px-4 py-2 bg-emerald-600 rounded-xl font-bold text-white text-sm hover:bg-emerald-500 w-full">Retry</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Instructions Sidebar - Order 2 on Mobile */}
                        <div className="w-full lg:w-96 border rounded-3xl p-6 flex flex-col h-fit shrink-0 order-2" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
                            <button onClick={() => setSelectedLesson(null)} className="flex items-center gap-2 hover:text-white mb-6 w-fit" style={{ color: 'var(--text-muted)' }}>
                                <ArrowLeft className="w-4 h-4" /> Back to Lessons
                            </button>

                            <h2 className="text-2xl lg:text-3xl font-black mb-2 leading-tight" style={{ color: 'var(--text-main)' }}>{selectedLesson.title}</h2>
                            <div className="flex gap-2 mb-6">
                                <span className="inline-block px-3 py-1 rounded-full bg-cyan-900/30 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                                    {selectedLesson.category}
                                </span>
                                <span className="inline-block px-3 py-1 rounded-full border text-xs font-bold" style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                                    {selectedLesson.difficulty}
                                </span>
                            </div>

                            <div className="prose prose-invert text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                <p>{selectedLesson.description}</p>
                            </div>

                            <div className={`mt-auto p-4 rounded-xl border transition-colors ${
                                isSuccess ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-200' 
                                : feedback?.includes('Incorrect') ? 'bg-rose-900/20 border-rose-500/30 text-rose-200'
                                : feedback?.includes('Hint') ? 'bg-amber-900/20 border-amber-500/30 text-amber-200'
                                : ''
                            }`} style={!isSuccess && !feedback ? { backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' } : {}}>
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
                                    disabled={isSuccess || moveIndex % 2 !== 0}
                                    className="flex-1 py-3 hover:opacity-80 disabled:opacity-50 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    style={{ backgroundColor: 'var(--element-bg)', color: 'var(--primary)' }}
                                >
                                    <Lightbulb className="w-4 h-4" /> Hint
                                </button>
                                <button 
                                    onClick={() => startLesson(selectedLesson)}
                                    className="flex-1 py-3 hover:opacity-80 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    style={{ backgroundColor: 'var(--element-bg)', color: 'var(--text-main)' }}
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
