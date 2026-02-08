
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Move, PieceSymbol } from 'chess.js';
import Board from '../components/Board';
import InfoPanel from '../components/InfoPanel';
import GameOverOverlay from '../components/GameOverOverlay';
import LiveStreamOverlay from '../components/LiveStreamOverlay'; // Import Overlay
import { RotateCw, RefreshCw, Undo2, ChevronLeft, Play, Pause, FastForward, Rewind, Eye, Flag, AlertTriangle, X, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBestMove } from '../utils/chessAI';
import { playSound } from '../utils/gameLogic';
import { UserManager } from '../utils/storage';
import { User, MatchRecord } from '../types';

interface GamePageProps {
  gameMode: 'human' | 'computer' | 'replay' | 'online' | 'spectator';
  difficulty?: 'easy' | 'medium' | 'hard';
  replayMatch?: MatchRecord;
  opponent?: User;
  playerColor?: 'w' | 'b' | 'random';
  onExit: () => void;
}

const GamePage: React.FC<GamePageProps> = ({ gameMode, difficulty = 'medium', replayMatch, opponent, playerColor = 'w', onExit }) => {
  const [game, setGame] = useState(() => new Chess());
  const [captured, setCaptured] = useState<{ w: PieceSymbol[]; b: PieceSymbol[] }>({ w: [], b: [] });
  const [boardOrientation, setBoardOrientation] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [notification, setNotification] = useState<{ type: string, message: string } | null>(null);
  
  // Streaming State
  const [isStreaming, setIsStreaming] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  // Determined Player Color (after handling 'random')
  const [userSide, setUserSide] = useState<'w' | 'b'>('w');
  
  // Exit Confirmation State
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Mobile History State
  const [showMobileHistory, setShowMobileHistory] = useState(false);
  const mobileHistoryRef = useRef<HTMLDivElement>(null);
  
  // Game Over State
  const [gameOverData, setGameOverData] = useState<{
      type: 'checkmate' | 'draw' | 'stalemate' | 'threefold' | 'insufficient' | 'timeout' | 'resign';
      winner: 'w' | 'b' | null;
  } | null>(null);

  // Timer State
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes default
  const [blackTime, setBlackTime] = useState(600);
  const lastTimeRef = useRef<number>(Date.now());
  
  // Replay State
  const [replayStep, setReplayStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState<1 | 2 | 4>(1); // 1x, 2x, 4x speed

  // Users for InfoPanel
  const currentUser = UserManager.getCurrentUser();
  const [whiteUser, setWhiteUser] = useState<User | undefined>(undefined);
  const [blackUser, setBlackUser] = useState<User | undefined>(undefined);

  // Initialize Game & Users
  useEffect(() => {
    if (gameMode === 'spectator') {
        // Mock Spectator Setup
        setWhiteUser({ ...currentUser!, username: 'GrandmasterGary', elo: 2800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gary' });
        setBlackUser({ ...currentUser!, username: 'DeepBlue', elo: 3000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Blue' });
        startNewGame();
        setIsPlaying(true); // Start AI vs AI loop
    } else if (gameMode === 'replay' && replayMatch) {
        // Accurate Replay Initialization
        try {
            const tempGame = new Chess();
            tempGame.loadPgn(replayMatch.pgn);
            setTotalSteps(tempGame.history().length);
            
            const cleanGame = new Chess();
            setGame(cleanGame);
            setReplayStep(0);

            // Set Orientation based on what the user played as
            const isUserWhite = replayMatch.playerSide === 'w';
            setUserSide(replayMatch.playerSide);
            setBoardOrientation(!isUserWhite);

            // Reconstruct User Objects for InfoPanel
            // We assume the stored opponent name is accurate. ELO is snapshot from match record.
            const opponentObj: User = { 
                id: 'replay_opp', 
                username: replayMatch.opponent, 
                elo: replayMatch.opponentElo, 
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${replayMatch.opponent}`, // Consistent seed
                country: 'Unknown', bio: '', email: '', joinedDate: '', stats: {wins:0,losses:0,draws:0}, banner: '', followers: [], following: [], level: 1, xp: 0, streak: 0, lastLoginDate: '', activeQuests: [], completedLessons: []
            };

            if (currentUser) {
                if (isUserWhite) {
                    setWhiteUser(currentUser);
                    setBlackUser(opponentObj);
                } else {
                    setWhiteUser(opponentObj);
                    setBlackUser(currentUser);
                }
            }
        } catch (e) { console.error("Replay Init Error", e); }
    } else {
        // Standard Game Initialization
        let finalSide: 'w' | 'b' = 'w';
        if (gameMode === 'computer' || gameMode === 'online') {
            if (playerColor === 'random') {
                finalSide = Math.random() > 0.5 ? 'w' : 'b';
            } else {
                finalSide = playerColor === 'b' ? 'b' : 'w';
            }
        }
        setUserSide(finalSide);
        setBoardOrientation(finalSide === 'b'); // Flip if Black

        // Setup Players
        if (currentUser) {
            const opponentObj = opponent || { 
                id: 'p2', 
                username: gameMode === 'computer' ? 'Stockfish Lite' : 'Player 2', 
                elo: difficulty === 'hard' ? 2000 : difficulty === 'medium' ? 1200 : 800, 
                avatar: gameMode === 'computer' ? 'https://api.dicebear.com/7.x/bottts/svg?seed=SF' : 'https://api.dicebear.com/7.x/avataaars/svg?seed=P2',
                bio: '', email: '', joinedDate: '', country: gameMode === 'computer' ? 'CPU' : 'Local', stats: {wins:0,losses:0,draws:0}, banner: '', followers: [], following: []
            };

            if (finalSide === 'w') {
                setWhiteUser(currentUser);
                setBlackUser(opponentObj);
            } else {
                setWhiteUser(opponentObj);
                setBlackUser(currentUser);
            }
        }
        startNewGame();
    }
  }, [gameMode, replayMatch, opponent, playerColor]);

  // Viewer Count Simulation
  useEffect(() => {
      let interval: number;
      if (isStreaming) {
          setNotification({ type: 'info', message: 'You are LIVE! Opponent notified.' });
          setViewerCount(Math.floor(Math.random() * 50) + 10);
          interval = window.setInterval(() => {
              setViewerCount(prev => Math.max(0, prev + Math.floor(Math.random() * 5) - 2));
          }, 3000);
      } else {
          setViewerCount(0);
      }
      return () => clearInterval(interval);
  }, [isStreaming]);

  const toggleStream = () => {
      if (isStreaming) {
          // Stop Streaming
          setNotification({ type: 'info', message: 'Stream Ended. VOD Saved.' });
          setIsStreaming(false);
      } else {
          setIsStreaming(true);
      }
  };

  const startNewGame = () => {
        const newGame = new Chess();
        setGame(newGame);
        setWhiteTime(600);
        setBlackTime(600);
        setCaptured({ w: [], b: [] });
        setGameOverData(null);
        setNotification({ type: 'info', message: 'GAME START' });
        lastTimeRef.current = Date.now(); // Reset timestamp
        playSound('start');
  };

  // ROBUST TIMER LOGIC
  // Uses Date.now() delta to ensure timer keeps accurate time even if main thread blocks during AI calculation
  useEffect(() => {
    let animationFrameId: number;
    
    const updateTimer = () => {
        if (gameMode !== 'replay' && !gameOverData) {
            const now = Date.now();
            const delta = now - lastTimeRef.current;
            
            // Update only if at least 100ms passed to avoid excessive state updates, but keep precise tracking
            if (delta >= 100) {
                const deltaSeconds = delta / 1000;
                
                if (game.turn() === 'w') {
                    setWhiteTime(prev => {
                        const next = Math.max(0, prev - deltaSeconds);
                        if (next <= 0 && !gameOverData) {
                            setGameOverData({ type: 'timeout', winner: 'b' });
                        }
                        return next;
                    });
                } else {
                    setBlackTime(prev => {
                        const next = Math.max(0, prev - deltaSeconds);
                        if (next <= 0 && !gameOverData) {
                            setGameOverData({ type: 'timeout', winner: 'w' });
                        }
                        return next;
                    });
                }
                lastTimeRef.current = now;
            }
            
            animationFrameId = requestAnimationFrame(updateTimer);
        }
    };

    if (gameMode !== 'replay' && !gameOverData) {
        lastTimeRef.current = Date.now(); // Sync start time
        animationFrameId = requestAnimationFrame(updateTimer);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameMode, gameOverData, game.turn()]); // Dependency on turn ensures we switch clocks correctly

  // Handle Game End Logic & Saving
  useEffect(() => {
    if (gameMode !== 'replay' && gameMode !== 'spectator' && game.isGameOver()) {
        let type: any = 'draw';
        let winner: any = null;
        
        if (game.isCheckmate()) {
            type = 'checkmate';
            winner = game.turn() === 'w' ? 'b' : 'w';
        } else if (game.isStalemate()) type = 'stalemate';
        else if (game.isThreefoldRepetition()) type = 'threefold';
        else if (game.isInsufficientMaterial()) type = 'insufficient';
        else if (game.isDraw()) type = 'draw';

        setGameOverData({ type, winner });
        
        // AUTO STOP STREAM ON GAME OVER
        const wasStreaming = isStreaming;
        if (isStreaming) {
            setIsStreaming(false);
            setNotification({ type: 'info', message: 'Stream Ended (Game Over)' });
        }

        saveGameResult(winner, type, wasStreaming);
    }
  }, [game]);

  const saveGameResult = (winner: 'w' | 'b' | null, type: string, wasStreaming: boolean) => {
        // Only save if it's a "real" match
        if (gameMode === 'computer' || gameMode === 'online') {
            const result = winner ? (winner === userSide ? 'win' : 'loss') : 'draw';
            
            const opponentName = (userSide === 'w' ? blackUser?.username : whiteUser?.username) || 'Opponent';
            const vodTitle = wasStreaming ? `Live Stream vs ${opponentName}` : undefined;

            setTimeout(() => {
                UserManager.saveMatch({
                    date: new Date().toISOString(),
                    opponent: opponentName,
                    opponentElo: (userSide === 'w' ? blackUser?.elo : whiteUser?.elo) || 1200,
                    result, 
                    pgn: game.pgn(),
                    mode: gameMode === 'computer' ? 'computer' : 'rapid',
                    playerSide: userSide,
                    isStreamVod: wasStreaming,
                    vodTitle
                });
            }, 1000);
        }
  };

  const handleExitRequest = () => {
      if (gameOverData || gameMode === 'replay' || gameMode === 'spectator' || gameMode === 'human') {
          if (isStreaming) setIsStreaming(false);
          onExit();
      } else {
          setShowExitConfirm(true);
      }
  };

  const confirmExit = () => {
       // This is for exiting MID-GAME via the menu (Forfeit)
       handleResign();
  };

  const handleResign = () => {
       // Identify Winner (Opponent wins if I resign)
       const winner = userSide === 'w' ? 'b' : 'w';
       
       const wasStreaming = isStreaming;
       if (isStreaming) setIsStreaming(false);

       // 1. Set Game Over State (Triggers Overlay)
       setGameOverData({ type: 'resign', winner });
       
       // 2. Play Sound
       playSound('game-over');

       // 3. Save Result
       saveGameResult(winner, 'resign', wasStreaming);
       
       // 4. Close Confirmation
       setShowExitConfirm(false);
  };

  // Replay Logic with Speed Control
  useEffect(() => {
    let interval: number;
    if (gameMode === 'replay' && isPlaying && replayMatch) {
        // Base speed is 1.5s per move for "Real Time" feel
        const delay = 1500 / replaySpeed;
        
        interval = window.setInterval(() => {
            if (replayStep < totalSteps) stepReplay(1);
            else setIsPlaying(false);
        }, delay);
    }
    return () => clearInterval(interval);
  }, [isPlaying, replayStep, totalSteps, gameMode, replayMatch, replaySpeed]);

  const stepReplay = (direction: number) => {
      if (!replayMatch) return;
      const targetStep = replayStep + direction;
      if (targetStep < 0 || targetStep > totalSteps) return;

      const masterGame = new Chess();
      masterGame.loadPgn(replayMatch.pgn);
      const history = masterGame.history();
      
      const newDisplayGame = new Chess();
      for (let i = 0; i < targetStep; i++) newDisplayGame.move(history[i]);
      
      setGame(newDisplayGame);
      setReplayStep(targetStep);
      playSound('move');
  };

  const updateCapturedFromHistory = useCallback((currentHistory: Move[]) => {
      const newCaptured: { w: PieceSymbol[], b: PieceSymbol[] } = { w: [], b: [] };
      currentHistory.forEach(move => {
          if (move.captured) newCaptured[move.color].push(move.captured);
      });
      setCaptured(newCaptured);
  }, []);

  useEffect(() => {
     const history = game.history({ verbose: true });
     updateCapturedFromHistory(history);
     
     // Scroll mobile history
     if(mobileHistoryRef.current) {
         mobileHistoryRef.current.scrollLeft = mobileHistoryRef.current.scrollWidth;
     }
  }, [game, updateCapturedFromHistory]);

  // AI & Spectator Logic
  useEffect(() => {
    if (gameOverData) return;

    // AI Opponent Move Logic
    // Trigger if it's Computer/Online mode and it is NOT the user's turn
    if ((gameMode === 'computer' || gameMode === 'online') && game.turn() !== userSide) {
        
        // Safety Delay: Wait 600ms before starting AI thinking to let user animations finish
        const animationSafetyTimer = setTimeout(() => {
            const makeAiMove = async () => {
                setIsAiThinking(true);
                const diff = gameMode === 'online' ? 'hard' : difficulty;
                const moveString = await getBestMove(game, diff as 'easy' | 'medium' | 'hard');
                setIsAiThinking(false);
                
                if (moveString) executeGameMove(moveString);
            };
            makeAiMove();
        }, 600); // Wait for sliding animation (approx 500ms)

        return () => clearTimeout(animationSafetyTimer);
    }

    // Spectator Mode (AI vs AI)
    if (gameMode === 'spectator' && isPlaying) {
        const makeSpectatorMove = async () => {
            const delay = Math.random() * 1000 + 500;
            setTimeout(async () => {
                const moveString = await getBestMove(game, 'hard'); 
                if (moveString) executeGameMove(moveString);
                else setIsPlaying(false); 
            }, delay);
        };
        makeSpectatorMove();
    }

  }, [game.fen(), gameMode, difficulty, gameOverData, isPlaying, userSide]);

  const executeGameMove = (moveString: string) => {
        try {
            const result = game.move(moveString);
            if (result) {
                const newGame = new Chess();
                newGame.loadPgn(game.pgn());
                setGame(newGame);
                if (newGame.inCheck() && !newGame.isGameOver()) playSound('check');
                else if (result.captured) playSound('capture');
                else playSound('move');
            }
        } catch (e) { console.error(e); }
  };

  const handleMove = (move: Move) => { /* Board component handles setGame */ };

  const undoMove = () => {
      // STRICT CONTROL: Only allowed in Computer mode during user turn
      if (gameMode !== 'computer' || gameOverData || isAiThinking) return;
      
      const newGame = new Chess();
      newGame.loadPgn(game.pgn());
      
      // If it's my turn, undo last two moves (AI then Me)
      // If AI hasn't moved yet (rare race condition), just undo me
      if (game.turn() === userSide) {
          newGame.undo(); // Undo AI
          newGame.undo(); // Undo Me
      }
      setGame(newGame);
      playSound('move');
  };

  const historyRows = game.history({ verbose: true }).reduce((rows: any[], move, index) => {
    if (index % 2 === 0) rows.push({ white: move, black: null, num: Math.floor(index/2) + 1 });
    else rows[rows.length - 1].black = move;
    return rows;
  }, []);

  const simpleHistory = game.history();

  return (
    <div className="w-full h-[100dvh] flex flex-col lg:flex-row bg-[#050505] overflow-hidden">
        <LiveStreamOverlay isStreaming={isStreaming} onStopStream={toggleStream} viewerCount={viewerCount} />

        <AnimatePresence>
            {gameOverData && (
                <GameOverOverlay 
                    type={gameOverData.type}
                    winner={gameOverData.winner}
                    onRematch={startNewGame}
                    onExit={onExit}
                />
            )}
            
            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-slate-900 border border-rose-500/30 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-rose-900/30 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-rose-500" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">STOP MATCH?</h2>
                        <p className="text-slate-400 text-sm mb-6">
                            Exiting now will result in an automatic <span className="text-rose-400 font-bold">LOSS</span>. Are you sure?
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowExitConfirm(false)}
                                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmExit}
                                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-900/20"
                            >
                                Forfeit
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* --- MOBILE: Top Bar --- */}
        <div className="lg:hidden flex justify-between items-center p-3 bg-slate-900 border-b border-slate-800 z-10 shrink-0">
            <button onClick={handleExitRequest} className="p-2 text-slate-400"><ChevronLeft className="w-5 h-5" /></button>
            <div className="font-black text-lg tracking-tight flex items-center gap-2">
                NEXUS<span className="text-cyan-400">CHESS</span>
                {gameMode === 'spectator' && <span className="text-[10px] bg-red-600 px-2 rounded text-white animate-pulse">LIVE</span>}
            </div>
            <div className="w-9" />
        </div>

        {/* --- DESKTOP: Sidebar / Controls --- */}
        <div className="hidden lg:flex flex-col w-80 bg-slate-900/50 border-r border-slate-800 p-6 z-10 shrink-0">
             <button onClick={handleExitRequest} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8">
                <ChevronLeft className="w-4 h-4" /> Exit
            </button>
            
            {/* Info Panel: Pass isReplay to modify display */}
            <InfoPanel 
                game={game} 
                captured={captured} 
                whiteTime={whiteTime} 
                blackTime={blackTime} 
                whiteUser={whiteUser} 
                blackUser={blackUser}
                isReplay={gameMode === 'replay'}
                replayStep={replayStep}
                totalSteps={totalSteps}
            />
            
            <div className="mt-6 space-y-3">
                 {/* Stream Button */}
                 {(gameMode === 'computer' || gameMode === 'online') && !gameOverData && (
                     <button 
                        onClick={toggleStream} 
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                            isStreaming 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
                            : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30'
                        }`}
                     >
                        {isStreaming ? <><X className="w-4 h-4"/> Stop Stream</> : <><Radio className="w-4 h-4"/> Stream Match</>}
                     </button>
                 )}

                 {gameMode === 'computer' && (
                    <button onClick={undoMove} className="w-full py-3 bg-slate-800 rounded-xl font-bold text-slate-300 hover:bg-slate-700 flex items-center justify-center gap-2"><Undo2 className="w-4 h-4"/> Undo</button>
                 )}
                 {gameMode !== 'online' && gameMode !== 'spectator' && gameMode !== 'replay' && (
                     <button onClick={() => setBoardOrientation(!boardOrientation)} className="w-full py-3 bg-slate-800 rounded-xl font-bold text-slate-300 hover:bg-slate-700 flex items-center justify-center gap-2"><RotateCw className="w-4 h-4"/> Flip Board</button>
                 )}
                 {gameMode === 'online' ? (
                     <button onClick={() => setShowExitConfirm(true)} className="w-full py-3 bg-rose-900/30 text-rose-400 rounded-xl font-bold hover:bg-rose-900/50 flex items-center justify-center gap-2"><Flag className="w-4 h-4"/> Resign</button>
                 ) : (gameMode !== 'spectator' && gameMode !== 'replay') && (
                     <button onClick={startNewGame} className="w-full py-3 bg-cyan-600/20 text-cyan-400 rounded-xl font-bold hover:bg-cyan-600/30 flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4"/> New Game</button>
                 )}
                 {gameMode === 'spectator' && (
                     <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl text-center">
                         <div className="flex items-center justify-center gap-2 text-red-500 font-bold mb-2">
                             <Eye className="w-5 h-5" /> SPECTATING
                         </div>
                         <p className="text-xs text-red-300">Live Grandmaster Match</p>
                     </div>
                 )}
                 
                 {/* Replay Controls - Enhanced */}
                 {gameMode === 'replay' && (
                     <div className="flex flex-col gap-3">
                         {/* Playback Controls */}
                         <div className="flex gap-2">
                             <button onClick={() => stepReplay(-1)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center">
                                 <ChevronLeft className="w-4 h-4" />
                             </button>
                             <button onClick={() => setIsPlaying(!isPlaying)} className={`flex-1 py-3 rounded-xl flex items-center justify-center ${isPlaying ? 'bg-amber-500 hover:bg-amber-400 text-slate-900' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}>
                                 {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                             </button>
                             <button onClick={() => stepReplay(1)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center">
                                 <Play className="w-4 h-4" />
                             </button>
                         </div>
                         
                         {/* Speed Toggles */}
                         <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl">
                             {[1, 2, 4].map(speed => (
                                 <button 
                                    key={speed}
                                    onClick={() => setReplaySpeed(speed as any)}
                                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${replaySpeed === speed ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                 >
                                     {speed}x
                                 </button>
                             ))}
                         </div>
                     </div>
                 )}
            </div>
            
            {/* Move List */}
            <div className="flex-1 mt-6 bg-slate-950/50 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
                <div className="p-3 bg-slate-900 font-bold text-xs text-slate-500 uppercase">Moves</div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                     <table className="w-full text-left text-sm text-slate-300">
                         <tbody>
                            {historyRows.map((row, i) => (
                                <tr key={i} className="border-b border-slate-800/50 last:border-0">
                                    <td className="p-1 text-slate-600 w-8">{row.num}.</td>
                                    <td className="p-1">{row.white.san}</td>
                                    <td className="p-1">{row.black?.san}</td>
                                </tr>
                            ))}
                            <tr ref={el => el?.scrollIntoView()} />
                         </tbody>
                     </table>
                </div>
            </div>
        </div>

        {/* --- MAIN AREA (BOARD) --- */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#020617] relative p-0 lg:p-4">
            {/* Board Container - Responsive logic */}
            <div className="w-full max-w-[100vw] lg:max-w-2xl px-2 lg:px-0 flex-1 flex flex-col justify-center">
                <div className="lg:hidden w-full mb-2">
                     {/* Mobile Top Opponent Info */}
                     <InfoPanel game={game} captured={captured} whiteTime={whiteTime} blackTime={blackTime} whiteUser={whiteUser} blackUser={blackUser} mobileMode="top" isReplay={gameMode === 'replay'} replayStep={replayStep} totalSteps={totalSteps} />
                </div>

                <div className="w-full aspect-square relative z-0">
                    <Board 
                        game={game} 
                        setGame={setGame} 
                        onMove={handleMove}
                        flip={boardOrientation}
                        setNotification={setNotification}
                        isReadOnly={gameMode === 'replay' || !!gameOverData || gameMode === 'spectator' || ((gameMode === 'online' || gameMode === 'computer') && game.turn() !== userSide)} 
                        isGameOver={!!gameOverData}
                    />
                </div>

                <div className="lg:hidden w-full mt-2">
                     {/* Mobile Bottom Player Info */}
                     <InfoPanel game={game} captured={captured} whiteTime={whiteTime} blackTime={blackTime} whiteUser={whiteUser} blackUser={blackUser} mobileMode="bottom" isReplay={gameMode === 'replay'} replayStep={replayStep} totalSteps={totalSteps} />
                </div>
                
                {/* Mobile History View */}
                <div className="lg:hidden w-full mt-2 h-10 bg-slate-900/80 rounded-lg overflow-x-auto whitespace-nowrap flex items-center px-2 border border-slate-800" ref={mobileHistoryRef}>
                    {simpleHistory.length === 0 ? (
                        <span className="text-xs text-slate-600 italic">Game started...</span>
                    ) : (
                        simpleHistory.map((move, i) => (
                            <span key={i} className="text-sm font-mono text-slate-400 mr-2">
                                {i % 2 === 0 ? <span className="text-slate-600 mr-1">{(i/2)+1}.</span> : ''}
                                <span className={i === simpleHistory.length - 1 ? "text-cyan-400 font-bold" : ""}>{move}</span>
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* Mobile Controls Bar */}
             <div className="lg:hidden w-full bg-slate-900 border-t border-slate-800 p-2 flex gap-2 justify-center shrink-0 safe-pb">
                 {gameMode === 'spectator' ? (
                     <div className="w-full text-center text-red-500 font-bold py-3 flex items-center justify-center gap-2">
                         <Eye className="w-5 h-5" /> WATCHING LIVE
                     </div>
                 ) : gameMode === 'replay' ? (
                     <>
                        <button onClick={() => stepReplay(-1)} className="flex-1 py-3 bg-slate-800 rounded-lg text-white"><ChevronLeft className="w-5 h-5 mx-auto"/></button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className={`flex-1 py-3 rounded-lg text-white ${isPlaying ? 'bg-amber-500' : 'bg-cyan-600'}`}>{isPlaying ? <Pause className="w-5 h-5 mx-auto"/> : <Play className="w-5 h-5 mx-auto"/></button>
                        <button onClick={() => stepReplay(1)} className="flex-1 py-3 bg-slate-800 rounded-lg text-white"><Play className="w-5 h-5 mx-auto"/></button>
                     </>
                 ) : (
                     <>
                        {gameMode === 'computer' && (
                             <button onClick={undoMove} className="flex-1 py-3 bg-slate-800 rounded-lg text-slate-400"><Undo2 className="w-5 h-5 mx-auto"/></button>
                        )}
                        
                        {(gameMode === 'computer' || gameMode === 'online') && (
                             <button onClick={toggleStream} className={`flex-1 py-3 rounded-lg ${isStreaming ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
                                 <Radio className="w-5 h-5 mx-auto" />
                             </button>
                        )}

                        {gameMode === 'online' ? (
                             <button onClick={() => setShowExitConfirm(true)} className="flex-1 py-3 bg-rose-900/30 text-rose-400 rounded-lg"><Flag className="w-5 h-5 mx-auto"/></button>
                        ) : (
                             <button onClick={startNewGame} className="flex-1 py-3 bg-cyan-900/30 text-cyan-400 rounded-lg"><RefreshCw className="w-5 h-5 mx-auto"/></button>
                        )}
                     </>
                 )}
             </div>
        </div>
    </div>
  );
};

export default GamePage;
