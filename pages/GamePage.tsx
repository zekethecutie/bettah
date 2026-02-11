
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Move, PieceSymbol } from 'chess.js';
import Board from '../components/Board';
import InfoPanel from '../components/InfoPanel';
import GameOverOverlay from '../components/GameOverOverlay';
import LiveStreamOverlay from '../components/LiveStreamOverlay'; 
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
  const isMounted = useRef(true);
  
  // Streaming State
  const [isStreaming, setIsStreaming] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  // Determined Player Color
  const [userSide, setUserSide] = useState<'w' | 'b'>('w');
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
  const [whiteTime, setWhiteTime] = useState(600); 
  const [blackTime, setBlackTime] = useState(600);
  const lastTimeRef = useRef<number>(Date.now());
  
  // Replay State
  const [replayStep, setReplayStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState<1 | 2 | 4>(1); 
  const replayMasterGame = useRef<Chess | null>(null); // Keep a reference to the full game for replay

  // Users
  const currentUser = UserManager.getCurrentUser();
  const [whiteUser, setWhiteUser] = useState<User | undefined>(undefined);
  const [blackUser, setBlackUser] = useState<User | undefined>(undefined);

  useEffect(() => {
      isMounted.current = true;
      return () => { isMounted.current = false; };
  }, []);

  // Initialize Game & Users
  useEffect(() => {
    if (gameMode === 'spectator') {
        setWhiteUser({ ...currentUser!, username: 'GrandmasterGary', elo: 2800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gary' });
        setBlackUser({ ...currentUser!, username: 'DeepBlue', elo: 3000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Blue' });
        startNewGame();
        setIsPlaying(true); 
    } else if (gameMode === 'replay' && replayMatch) {
        try {
            const master = new Chess();
            master.loadPgn(replayMatch.pgn);
            replayMasterGame.current = master;
            
            setTotalSteps(master.history().length);
            
            const cleanGame = new Chess();
            setGame(cleanGame);
            setReplayStep(0);

            const isUserWhite = replayMatch.playerSide === 'w';
            setUserSide(replayMatch.playerSide);
            setBoardOrientation(!isUserWhite);

            const opponentObj: User = { 
                id: 'replay_opp', 
                username: replayMatch.opponent, 
                elo: replayMatch.opponentElo, 
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${replayMatch.opponent}`, 
                country: 'Unknown', bio: '', email: '', joinedDate: '', stats: {wins:0,losses:0,draws:0}, banner: '', followers: [], following: [], level: 1, xp: 0, streak: 0, lastLoginDate: '', activeQuests: [], completedLessons: [],
                coins: 0,
                inventory: { ownedItems: [], equipped: { boardTheme: 'board_classic', pieceSet: 'pieces_standard' } }
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
        let finalSide: 'w' | 'b' = 'w';
        if (gameMode === 'computer' || gameMode === 'online') {
            if (playerColor === 'random') finalSide = Math.random() > 0.5 ? 'w' : 'b';
            else finalSide = playerColor === 'b' ? 'b' : 'w';
        }
        setUserSide(finalSide);
        setBoardOrientation(finalSide === 'b'); 

        if (currentUser) {
            const opponentObj = opponent || { 
                id: 'p2', 
                username: gameMode === 'computer' ? 'Stockfish Lite' : 'Player 2', 
                elo: difficulty === 'hard' ? 2000 : difficulty === 'medium' ? 1200 : 800, 
                avatar: gameMode === 'computer' ? 'https://api.dicebear.com/7.x/bottts/svg?seed=SF' : 'https://api.dicebear.com/7.x/avataaars/svg?seed=P2',
                bio: '', email: '', joinedDate: '', country: gameMode === 'computer' ? 'CPU' : 'Local', stats: {wins:0,losses:0,draws:0}, banner: '', followers: [], following: [],
                level: 1, xp: 0, streak: 0, lastLoginDate: '', activeQuests: [], completedLessons: [],
                coins: 0,
                inventory: { ownedItems: [], equipped: { boardTheme: 'board_classic', pieceSet: 'pieces_standard' } }
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

  // Viewer Count
  useEffect(() => {
      let interval: number;
      if (isStreaming) {
          setNotification({ type: 'info', message: 'You are LIVE! Match recording.' });
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
          setNotification({ type: 'info', message: 'Stream Ended.' });
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
        lastTimeRef.current = Date.now(); 
        playSound('start');
  };

  // Timer Logic
  useEffect(() => {
    let animationFrameId: number;
    const updateTimer = () => {
        if (!isMounted.current) return;
        if (gameMode !== 'replay' && !gameOverData) {
            const now = Date.now();
            const delta = now - lastTimeRef.current;
            if (delta >= 100) {
                const deltaSeconds = delta / 1000;
                if (game.turn() === 'w') {
                    setWhiteTime(prev => {
                        const next = Math.max(0, prev - deltaSeconds);
                        if (next <= 0 && !gameOverData) setGameOverData({ type: 'timeout', winner: 'b' });
                        return next;
                    });
                } else {
                    setBlackTime(prev => {
                        const next = Math.max(0, prev - deltaSeconds);
                        if (next <= 0 && !gameOverData) setGameOverData({ type: 'timeout', winner: 'w' });
                        return next;
                    });
                }
                lastTimeRef.current = now;
            }
            animationFrameId = requestAnimationFrame(updateTimer);
        }
    };
    if (gameMode !== 'replay' && !gameOverData) {
        lastTimeRef.current = Date.now(); 
        animationFrameId = requestAnimationFrame(updateTimer);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameMode, gameOverData, game.turn()]);

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
        
        // Pass the PGN at the moment of game end
        saveGameResult(winner, type, isStreaming, game.pgn());
        
        if (isStreaming) {
            setIsStreaming(false);
            setNotification({ type: 'info', message: 'Stream Ended (Game Over)' });
        }
    }
  }, [game]);

  const saveGameResult = (winner: 'w' | 'b' | null, type: string, wasStreaming: boolean, finalPgn?: string) => {
        if (gameMode === 'computer' || gameMode === 'online') {
            const result = winner ? (winner === userSide ? 'win' : 'loss') : 'draw';
            const opponentName = (userSide === 'w' ? blackUser?.username : whiteUser?.username) || 'Opponent';
            const vodTitle = wasStreaming ? `Live Stream vs ${opponentName}` : undefined;
            const pgnToSave = finalPgn || game.pgn();

            setTimeout(() => {
                if (isMounted.current) {
                    UserManager.saveMatch({
                        date: new Date().toISOString(),
                        opponent: opponentName,
                        opponentElo: (userSide === 'w' ? blackUser?.elo : whiteUser?.elo) || 1200,
                        result, 
                        pgn: pgnToSave, // Ensure PGN is saved
                        mode: gameMode === 'computer' ? 'computer' : 'rapid',
                        playerSide: userSide,
                        isStreamVod: wasStreaming,
                        vodTitle
                    });
                }
            }, 500);
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

  const confirmExit = () => { handleResign(); };

  const handleResign = () => {
       const winner = userSide === 'w' ? 'b' : 'w';
       const wasStreaming = isStreaming;
       if (isStreaming) setIsStreaming(false);
       setGameOverData({ type: 'resign', winner });
       playSound('game-over');
       saveGameResult(winner, 'resign', wasStreaming, game.pgn());
       setShowExitConfirm(false);
  };

  // --- REPLAY STEP LOGIC ---
  const stepReplay = (direction: number) => {
      if (!replayMasterGame.current) return;
      const targetStep = replayStep + direction;
      if (targetStep < 0 || targetStep > totalSteps) return;

      const history = replayMasterGame.current.history();
      
      const newDisplayGame = new Chess();
      for (let i = 0; i < targetStep; i++) {
          newDisplayGame.move(history[i]);
      }
      
      setGame(newDisplayGame);
      setReplayStep(targetStep);
      playSound('move');
  };

  // Auto Replay Loop
  useEffect(() => {
    let interval: number;
    if (gameMode === 'replay' && isPlaying && replayMasterGame.current) {
        const delay = 1000 / replaySpeed;
        interval = window.setInterval(() => {
            setReplayStep(prev => {
                if (prev < totalSteps) {
                    stepReplay(1); // Manually trigger step from previous state logic
                    return prev + 1; // Update state
                } else {
                    setIsPlaying(false);
                    return prev;
                }
            });
        }, delay);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps, gameMode, replaySpeed]); // Removed replayStep dep to avoid re-creating interval rapidly

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
     if(mobileHistoryRef.current) mobileHistoryRef.current.scrollLeft = mobileHistoryRef.current.scrollWidth;
  }, [game, updateCapturedFromHistory]);

  // AI & Spectator Logic
  useEffect(() => {
    if (gameOverData) return;

    if ((gameMode === 'computer' || gameMode === 'online') && game.turn() !== userSide) {
        const animationSafetyTimer = setTimeout(() => {
            const makeAiMove = async () => {
                if (!isMounted.current) return;
                setIsAiThinking(true);
                const diff = gameMode === 'online' ? 'hard' : difficulty;
                
                try {
                    const moveString = await getBestMove(game, diff as 'easy' | 'medium' | 'hard');
                    if (!isMounted.current) return;
                    setIsAiThinking(false);
                    if (moveString) executeGameMove(moveString);
                } catch (e) {
                    if (isMounted.current) setIsAiThinking(false);
                }
            };
            makeAiMove();
        }, 600);
        return () => clearTimeout(animationSafetyTimer);
    }

    if (gameMode === 'spectator' && isPlaying) {
        const makeSpectatorMove = async () => {
            const delay = Math.random() * 1000 + 500;
            setTimeout(async () => {
                if (!isMounted.current) return;
                const moveString = await getBestMove(game, 'hard'); 
                if (!isMounted.current) return;
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

  const handleMove = (move: Move) => { /* Board handles state */ };

  const undoMove = () => {
      if (gameMode !== 'computer' || gameOverData || isAiThinking) return;
      const newGame = new Chess();
      newGame.loadPgn(game.pgn());
      if (game.turn() === userSide) {
          newGame.undo(); 
          newGame.undo(); 
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
    <div 
        className="w-full h-full lg:h-[100dvh] flex flex-col lg:flex-row overflow-hidden fixed inset-0"
        style={{ background: 'var(--app-bg)', color: 'var(--text-main)' }}
    >
        <LiveStreamOverlay isStreaming={isStreaming} onStopStream={toggleStream} viewerCount={viewerCount} />

        <AnimatePresence>
            {gameOverData && (
                <GameOverOverlay type={gameOverData.type} winner={gameOverData.winner} onRematch={startNewGame} onExit={onExit} />
            )}
            
            {showExitConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-rose-500/30 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
                        <div className="w-16 h-16 rounded-full bg-rose-900/30 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-rose-500" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">STOP MATCH?</h2>
                        <p className="text-slate-400 text-sm mb-6">Exiting now will result in an automatic <span className="text-rose-400 font-bold">LOSS</span>. Are you sure?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl">Cancel</button>
                            <button onClick={confirmExit} className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg">Forfeit</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* --- MOBILE: Top Bar (Fixed) --- */}
        <div 
            className="lg:hidden flex justify-between items-center p-3 border-b z-20 shrink-0 safe-pt"
            style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}
        >
            <button onClick={handleExitRequest} className="p-2" style={{ color: 'var(--text-muted)' }}><ChevronLeft className="w-5 h-5" /></button>
            <div className="font-black text-lg tracking-tight flex items-center gap-2">
                NEXUS<span style={{ color: 'var(--primary)' }}>CHESS</span>
                {gameMode === 'spectator' && <span className="text-[10px] bg-red-600 px-2 rounded text-white animate-pulse">LIVE</span>}
            </div>
            <div className="w-9" />
        </div>

        {/* --- DESKTOP: Sidebar (Fixed Width) --- */}
        <div 
            className="hidden lg:flex flex-col w-80 border-r p-6 z-10 shrink-0 h-full"
            style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}
        >
             <button onClick={handleExitRequest} className="flex items-center gap-2 hover:text-white mb-8" style={{ color: 'var(--text-muted)' }}>
                <ChevronLeft className="w-4 h-4" /> Exit Match
            </button>
            
            <InfoPanel game={game} captured={captured} whiteTime={whiteTime} blackTime={blackTime} whiteUser={whiteUser} blackUser={blackUser} isReplay={gameMode === 'replay'} replayStep={replayStep} totalSteps={totalSteps} />
            
            <div className="mt-6 space-y-3">
                 {(gameMode === 'computer' || gameMode === 'online') && !gameOverData && (
                     <button onClick={toggleStream} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isStreaming ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-indigo-600/20 text-indigo-400'}`}>
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
            </div>
            
            <div className="flex-1 mt-6 rounded-xl border overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
                <div className="p-3 font-bold text-xs uppercase" style={{ backgroundColor: 'var(--element-bg)', color: 'var(--text-muted)' }}>Moves</div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                     <table className="w-full text-left text-sm" style={{ color: 'var(--text-muted)' }}>
                         <tbody>
                            {historyRows.map((row, i) => (
                                <tr key={i} className="border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                                    <td className="p-1 w-8 opacity-70">{row.num}.</td>
                                    <td className="p-1 font-mono text-white">{row.white.san}</td>
                                    <td className="p-1 font-mono text-white">{row.black?.san}</td>
                                </tr>
                            ))}
                            <tr ref={el => el?.scrollIntoView()} />
                         </tbody>
                     </table>
                </div>
            </div>
        </div>

        {/* --- MAIN AREA: BOARD + MOBILE CONTROLS --- */}
        <div 
            className="flex-1 flex flex-col relative w-full h-full overflow-hidden"
            style={{ backgroundColor: 'transparent' }}
        >
            <div className="flex-1 flex flex-col justify-center items-center px-4 w-full min-h-0 relative">
                
                <div className="lg:hidden w-full max-w-md pb-2 shrink-0">
                     <InfoPanel game={game} captured={captured} whiteTime={whiteTime} blackTime={blackTime} whiteUser={whiteUser} blackUser={blackUser} mobileMode="top" isReplay={gameMode === 'replay'} replayStep={replayStep} totalSteps={totalSteps} />
                </div>

                <div className="w-full max-w-md aspect-square relative z-0 shrink-1" style={{ maxHeight: 'calc(100dvh - 240px)' }}> 
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

                <div className="lg:hidden w-full max-w-md pt-2 shrink-0">
                     <InfoPanel game={game} captured={captured} whiteTime={whiteTime} blackTime={blackTime} whiteUser={whiteUser} blackUser={blackUser} mobileMode="bottom" isReplay={gameMode === 'replay'} replayStep={replayStep} totalSteps={totalSteps} />
                </div>
            </div>

             <div 
                className="lg:hidden w-full border-t p-3 flex flex-col gap-2 shrink-0 safe-pb z-20"
                style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}
             >
                 <div className="h-8 rounded-lg overflow-x-auto whitespace-nowrap flex items-center px-2 border" style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)' }} ref={mobileHistoryRef}>
                    {simpleHistory.length === 0 ? <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Game started...</span> : simpleHistory.map((move, i) => (
                        <span key={i} className="text-xs font-mono mr-2" style={{ color: 'var(--text-muted)' }}>{i % 2 === 0 ? <span className="mr-1 opacity-70">{(i/2)+1}.</span> : ''}<span className={i === simpleHistory.length - 1 ? "font-bold text-[var(--primary)]" : "text-white"}>{move}</span></span>
                    ))}
                 </div>

                 <div className="flex gap-2">
                     {gameMode === 'spectator' ? (
                         <div className="w-full text-center text-red-500 font-bold py-2 flex items-center justify-center gap-2 bg-red-900/10 rounded-lg border border-red-900/30">
                             <Eye className="w-4 h-4" /> WATCHING LIVE
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
    </div>
  );
};

export default GamePage;
