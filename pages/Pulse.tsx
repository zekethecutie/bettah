
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, CheckCircle, AlertTriangle, Clock, Play, HelpCircle } from 'lucide-react';
import { Chess, Move } from 'chess.js';
import Board from '../components/Board';
import { playSound } from '../utils/gameLogic';
import { UserManager } from '../utils/storage';
import { LESSONS } from '../utils/lessonContent';
import { useNavigate } from 'react-router-dom';

const PULSE_TIME = 180; // 3 minutes

const Pulse: React.FC = () => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'over'>('intro');
    const [showTutorial, setShowTutorial] = useState(false);
    const [game, setGame] = useState(new Chess());
    const [currentPuzzle, setCurrentPuzzle] = useState<any>(null);
    const [score, setScore] = useState(0);
    const [strikes, setStrikes] = useState(0);
    const [timeLeft, setTimeLeft] = useState(PULSE_TIME);
    const [notification, setNotification] = useState<{type:string, message:string}|null>(null);
    
    // Derived from lessons for MVP, real app would fetch from puzzle DB
    const puzzles = useRef([...LESSONS].sort(() => Math.random() - 0.5));
    const puzzleIndex = useRef(0);

    useEffect(() => {
        let interval: number;
        if (gameState === 'playing') {
            interval = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState]);

    const startGame = () => {
        setScore(0);
        setStrikes(0);
        setTimeLeft(PULSE_TIME);
        puzzleIndex.current = 0;
        loadNextPuzzle();
        setGameState('playing');
        playSound('start');
    };

    const loadNextPuzzle = () => {
        if (puzzleIndex.current >= puzzles.current.length) {
            puzzles.current = [...LESSONS].sort(() => Math.random() - 0.5);
            puzzleIndex.current = 0;
        }
        const p = puzzles.current[puzzleIndex.current];
        puzzleIndex.current++;
        
        const puzzleGame = new Chess();
        puzzleGame.load(p.fen);
        setGame(puzzleGame);
        setCurrentPuzzle(p);
    };

    const handleMove = (move: Move) => {
        if (gameState !== 'playing' || !currentPuzzle) return;

        // Simple check: is it the first move of solution?
        const expectedSan = currentPuzzle.solutionMoves[0];
        
        if (move.san === expectedSan) {
            // Correct
            setScore(prev => prev + 1);
            playSound('capture');
            setNotification({ type: 'info', message: '+1' });
            
            // FX
            setTimeout(() => {
                loadNextPuzzle();
            }, 500);
        } else {
            // Wrong
            setStrikes(prev => {
                const newStrikes = prev + 1;
                if (newStrikes >= 3) endGame();
                return newStrikes;
            });
            playSound('check');
            setNotification({ type: 'error', message: 'MISS' });
            
            // Reset board state undoing the move
            setTimeout(() => {
                const g = new Chess(game.fen());
                g.undo();
                setGame(g);
            }, 500);
        }
    };

    const endGame = () => {
        setGameState('over');
        playSound('game-over');
        // Save score
        UserManager.saveMatch({
            date: new Date().toISOString(),
            opponent: 'Pulse Challenge',
            opponentElo: 0,
            result: 'win', // Always count as completed
            pgn: '',
            mode: 'pulse',
            playerSide: 'w',
            score: score
        });
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full h-[100dvh] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Pulse */}
            <div className={`absolute inset-0 bg-red-900/20 transition-opacity duration-500 ${timeLeft < 30 ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />

            {/* TUTORIAL MODAL */}
            <AnimatePresence>
                {showTutorial && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={() => setShowTutorial(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9 }} 
                            animate={{ scale: 1 }} 
                            className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-sm w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2"><HelpCircle /> How to Play</h2>
                            <ul className="space-y-4 text-slate-300 mb-8">
                                <li className="flex gap-3 items-start">
                                    <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                    <span><strong>3 Minutes</strong> on the clock. Speed is essential.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <span><strong>3 Strikes</strong> and you're out. Accuracy matters.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Solve as many tactical puzzles as you can to get a high score.</span>
                                </li>
                            </ul>
                            <button onClick={() => setShowTutorial(false)} className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200">Got it!</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {gameState === 'intro' && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="z-10 text-center p-8 bg-slate-900/80 border border-red-500/30 rounded-3xl backdrop-blur-xl shadow-2xl max-w-md mx-4">
                    <Activity className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
                    <h1 className="text-5xl font-black text-white italic mb-2 tracking-tighter">PULSE MODE</h1>
                    <p className="text-slate-400 mb-8 text-lg">Speed. Accuracy. Instinct.</p>
                    
                    <button 
                        onClick={() => setShowTutorial(true)}
                        className="mb-6 text-sm text-slate-400 hover:text-white flex items-center justify-center gap-2 mx-auto"
                    >
                        <HelpCircle className="w-4 h-4" /> How to Play
                    </button>

                    <div className="flex gap-4">
                        <button onClick={() => navigate('/games')} className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700">Exit</button>
                        <button onClick={startGame} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]">Start Run</button>
                    </div>
                </motion.div>
            )}

            {gameState === 'playing' && (
                <div className="w-full max-w-md h-full flex flex-col p-4 relative z-10">
                    {/* HUD */}
                    <div className="flex justify-between items-end mb-6 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
                        <div className="text-center">
                            <p className="text-xs text-slate-500 font-bold uppercase">Score</p>
                            <p className="text-4xl font-black text-white">{score}</p>
                        </div>
                        <div className={`text-center ${timeLeft < 30 ? 'text-red-500 scale-110' : 'text-white'} transition-all`}>
                            <p className="text-xs opacity-70 font-bold uppercase mb-1"><Clock className="w-4 h-4 mx-auto"/></p>
                            <p className="text-3xl font-mono font-bold">{formatTime(timeLeft)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 font-bold uppercase">Strikes</p>
                            <div className="flex gap-1 mt-2">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className={`w-3 h-8 rounded-full transition-colors ${i < strikes ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-slate-800'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Board */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="border-4 border-red-500/20 rounded-xl shadow-2xl overflow-hidden relative">
                            {notification && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }} 
                                    animate={{ opacity: 1, scale: 1.2 }} 
                                    exit={{ opacity: 0 }}
                                    key={score + strikes}
                                    className={`absolute inset-0 flex items-center justify-center z-50 pointer-events-none ${notification.type === 'error' ? 'text-red-500' : 'text-green-400'}`}
                                >
                                    <span className="text-6xl font-black drop-shadow-lg">{notification.message}</span>
                                </motion.div>
                            )}
                            <Board 
                                game={game} 
                                setGame={setGame} 
                                onMove={handleMove} 
                                flip={currentPuzzle?.fen.includes(' w ') ? false : true} // Flip based on whose turn it is
                                setNotification={() => {}} 
                            />
                        </div>
                        <p className="text-center text-slate-500 mt-4 text-sm font-medium animate-pulse">
                            {currentPuzzle?.fen.includes(' w ') ? "White to Move" : "Black to Move"}
                        </p>
                    </div>
                    
                    <button onClick={() => setGameState('over')} className="mt-4 text-slate-500 hover:text-white text-sm">Give Up</button>
                </div>
            )}

            {gameState === 'over' && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="z-10 text-center p-8 bg-slate-900/90 border border-slate-700 rounded-3xl backdrop-blur-xl shadow-2xl max-w-md w-full mx-4">
                    <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-widest mb-2">Run Complete</h2>
                    <h1 className="text-8xl font-black text-white mb-6">{score}</h1>
                    
                    <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl mb-8">
                        <div className="text-left">
                            <p className="text-xs text-slate-500">Coins Earned</p>
                            <p className="text-xl font-bold text-amber-400">+{Math.floor(score * 5)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500">Best Streak</p>
                            <p className="text-xl font-bold text-white">{score}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button onClick={startGame} className="w-full py-4 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-200">Play Again</button>
                        <button onClick={() => navigate('/games')} className="w-full py-4 bg-slate-800 text-slate-400 font-bold rounded-xl hover:text-white">Return to Arcade</button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Pulse;
