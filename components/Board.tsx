
import React, { useState, useEffect, useRef } from 'react';
import { Chess, Square as SquareType, Move, PieceSymbol, Color } from 'chess.js';
import Square from './Square';
import { PieceIcons } from './Icons';
import PromotionModal from './PromotionModal';
import { FILES, RANKS, Particle } from '../types';
import { getSquareColor, playSound } from '../utils/gameLogic';
import { motion, AnimatePresence } from 'framer-motion';

// Interface for persistent piece state
interface TrackedPiece {
  id: number;
  type: PieceSymbol;
  color: Color;
  square: SquareType;
}

export interface Arrow {
  from: SquareType;
  to: SquareType;
  color: 'green' | 'red' | 'blue' | 'orange';
}

interface BoardProps {
  game: Chess;
  setGame: React.Dispatch<React.SetStateAction<Chess>>;
  onMove: (move: Move) => void;
  flip: boolean;
  setNotification: (n: { type: string, message: string } | null) => void;
  isReadOnly?: boolean;
  isGameOver?: boolean;
  arrows?: Arrow[]; // New Prop for Learning visuals
}

const Board: React.FC<BoardProps> = ({ game, setGame, onMove, flip, setNotification, isReadOnly = false, isGameOver = false, arrows = [] }) => {
  const [selectedSquare, setSelectedSquare] = useState<SquareType | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shake, setShake] = useState(0);
  
  // Promotion State
  const [promotionSquare, setPromotionSquare] = useState<SquareType | null>(null);
  const [pendingMove, setPendingMove] = useState<Move | null>(null);

  // Pieces State
  const [pieces, setPieces] = useState<TrackedPiece[]>([]);
  const nextId = useRef(0);
  const currentFen = useRef(game.fen());

  // Initialize Pieces
  useEffect(() => {
    if (pieces.length === 0 && game.fen() !== '8/8/8/8/8/8/8/8 w - - 0 1') {
       syncPiecesFromScratch();
    }
  }, []);

  // Sync Effect & Game Over FX
  useEffect(() => {
    if (game.fen() !== currentFen.current) {
        const history = game.history({ verbose: true });
        
        if (history.length === 0) {
            syncPiecesFromScratch();
        } else {
            const lastMove = history[history.length - 1];
            
            // Sync Logic
            setPieces(prevPieces => {
                const newPieces = [...prevPieces];
                const movingPieceIndex = newPieces.findIndex(p => p.square === lastMove.from);
                
                if (movingPieceIndex !== -1) {
                     if (lastMove.captured) {
                        const capturedIndex = newPieces.findIndex(p => p.square === lastMove.to);
                        if (capturedIndex !== -1) newPieces.splice(capturedIndex, 1);
                        if (lastMove.flags.includes('e')) {
                             const capturedPawnSquare = (lastMove.to[0] + lastMove.from[1]) as SquareType; 
                             const epIndex = newPieces.findIndex(p => p.square === capturedPawnSquare);
                             if (epIndex !== -1) newPieces.splice(epIndex, 1);
                        }
                    }
                    const pieceId = prevPieces[movingPieceIndex].id;
                    const idx = newPieces.findIndex(p => p.id === pieceId);
                    if (idx !== -1) {
                        newPieces[idx].square = lastMove.to;
                        if (lastMove.promotion) newPieces[idx].type = lastMove.promotion;
                        if (lastMove.flags.includes('k') || lastMove.flags.includes('q')) {
                            let rookFrom: SquareType | null = null;
                            let rookTo: SquareType | null = null;
                            if (lastMove.color === 'w') {
                                if (lastMove.flags.includes('k')) { rookFrom = 'h1'; rookTo = 'f1'; }
                                if (lastMove.flags.includes('q')) { rookFrom = 'a1'; rookTo = 'd1'; }
                            } else {
                                if (lastMove.flags.includes('k')) { rookFrom = 'h8'; rookTo = 'f8'; }
                                if (lastMove.flags.includes('q')) { rookFrom = 'a8'; rookTo = 'd8'; }
                            }
                            if (rookFrom && rookTo) {
                                const rookIndex = newPieces.findIndex(p => p.square === rookFrom);
                                if (rookIndex !== -1) newPieces[rookIndex].square = rookTo;
                            }
                        }
                        return newPieces;
                    }
                }
                // Fallback scratch sync
                const board = game.board();
                const scratchPieces: TrackedPiece[] = [];
                nextId.current = 0;
                board.forEach(rank => {
                    rank.forEach(piece => {
                        if (piece) {
                            scratchPieces.push({
                                id: nextId.current++,
                                type: piece.type,
                                color: piece.color,
                                square: piece.square
                            });
                        }
                    });
                });
                return scratchPieces;
            });
        }
        currentFen.current = game.fen();
    }
    
    // Check Game Over FX
    if (game.isGameOver()) {
        if (game.isCheckmate()) {
            const loserColor = game.turn();
            const board = game.board();
            let kingSquare: SquareType | null = null;
            board.forEach(rank => {
                rank.forEach(piece => {
                    if (piece && piece.type === 'k' && piece.color === loserColor) {
                        kingSquare = piece.square;
                    }
                });
            });
            if (kingSquare) {
                const { x, y } = getSquareCenterPercent(kingSquare);
                setTimeout(() => {
                    spawnParticles(x, y, loserColor === 'w' ? '#cbd5e1' : '#475569', 'explosion');
                    playSound('game-over');
                }, 500);
            }
        }
    }
  }, [game]);

  const syncPiecesFromScratch = () => {
     const board = game.board();
     const newPieces: TrackedPiece[] = [];
     nextId.current = 0;
     
     board.forEach(rank => {
        rank.forEach(piece => {
            if (piece) {
                newPieces.push({
                    id: nextId.current++,
                    type: piece.type,
                    color: piece.color,
                    square: piece.square
                });
            }
        });
     });
     setPieces(newPieces);
     currentFen.current = game.fen();
  };

  useEffect(() => {
    const history = game.history({ verbose: true });
    if (history.length > 0) {
        const last = history[history.length - 1];
        setLastMove({ from: last.from, to: last.to });
        if (!isReadOnly && !isGameOver) checkGameState();
    } else {
        setLastMove(null);
    }
  }, [game, isReadOnly, isGameOver]);

  const checkGameState = () => {
    if (game.inCheck() && !game.isGameOver()) {
        setNotification({ type: 'check', message: 'CHECK' });
    }
  };

  const spawnParticles = (x: number, y: number, color: string, type: 'capture' | 'move' | 'select' | 'explosion') => {
    const isExplosion = type === 'explosion';
    const isCapture = type === 'capture';
    const isSelect = type === 'select';
    
    const count = isExplosion ? 150 : isCapture ? 50 : isSelect ? 20 : 15;
    
    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
        let pType: 'circle' | 'spark' | 'ring' = 'circle';
        if ((isCapture || isExplosion) && i % 5 === 0) pType = 'ring';
        if (Math.random() > 0.6) pType = 'spark';
        const speed = isExplosion ? 150 : isCapture ? 60 : 30;

        return {
            id: Math.random().toString(36).substr(2, 9),
            x,
            y,
            color: pType === 'spark' ? '#fff' : color,
            velocity: {
                x: (Math.random() - 0.5) * speed,
                y: (Math.random() - 0.5) * speed,
            },
            life: isExplosion ? 1.5 + Math.random() : (isSelect ? 0.6 + Math.random() * 0.3 : 0.8 + Math.random() * 0.4),
            size: isExplosion ? Math.random() * 20 + 5 : (isCapture ? Math.random() * 12 + 4 : Math.random() * 6 + 2),
            type: pType
        };
    });
    setParticles((prev) => [...prev, ...newParticles]);
  };

  useEffect(() => {
    let animationFrameId: number;
    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.velocity.x * 0.85, 
            y: p.y + p.velocity.y * 0.85, 
            velocity: { x: p.velocity.x * 0.9, y: p.velocity.y * 0.9 + (p.type === 'spark' ? 0.8 : 0.2) }, 
            life: p.life - 0.03,
            size: p.size * 0.95 
          }))
          .filter((p) => p.life > 0)
      );
      animationFrameId = requestAnimationFrame(updateParticles);
    };
    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(updateParticles);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [particles.length]);

  const getSquarePosPercent = (square: SquareType) => {
     const fileIdx = FILES.indexOf(square[0]);
     const rankIdx = RANKS.indexOf(square[1]);
     const left = flip ? 7 - fileIdx : fileIdx;
     const top = flip ? 7 - rankIdx : rankIdx;
     return { left: left * 12.5, top: top * 12.5 };
  };

  const getSquareCenterPercent = (square: SquareType) => {
      const { left, top } = getSquarePosPercent(square);
      return { x: left + 6.25, y: top + 6.25 };
  };

  // Helper to render Arrows SVG
  const renderArrows = () => {
      if (!arrows || arrows.length === 0) return null;

      return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-[60]" viewBox="0 0 100 100">
              <defs>
                  <marker id="arrowhead-green" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                      <polygon points="0 0, 4 2, 0 4" fill="#34d399" />
                  </marker>
                  <marker id="arrowhead-red" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                      <polygon points="0 0, 4 2, 0 4" fill="#f43f5e" />
                  </marker>
                  <marker id="arrowhead-blue" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                      <polygon points="0 0, 4 2, 0 4" fill="#38bdf8" />
                  </marker>
              </defs>
              {arrows.map((arrow, i) => {
                  const from = getSquareCenterPercent(arrow.from);
                  const to = getSquareCenterPercent(arrow.to);
                  // Shorten the arrow slightly so it doesn't overlap pieces perfectly
                  const dx = to.x - from.x;
                  const dy = to.y - from.y;
                  const angle = Math.atan2(dy, dx);
                  const len = Math.sqrt(dx * dx + dy * dy);
                  const shortLen = len - 8; // Stop 8% short
                  const endX = from.x + Math.cos(angle) * shortLen;
                  const endY = from.y + Math.sin(angle) * shortLen;

                  let stroke = '#38bdf8';
                  let marker = 'url(#arrowhead-blue)';
                  if(arrow.color === 'green') { stroke = '#34d399'; marker = 'url(#arrowhead-green)'; }
                  if(arrow.color === 'red') { stroke = '#f43f5e'; marker = 'url(#arrowhead-red)'; }

                  return (
                      <motion.line
                          key={i}
                          x1={from.x} y1={from.y}
                          x2={endX} y2={endY}
                          stroke={stroke}
                          strokeWidth="1.5"
                          markerEnd={marker}
                          strokeOpacity="0.8"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                      />
                  );
              })}
          </svg>
      );
  };

  const handleSquareClick = (square: SquareType) => {
    if (isReadOnly || promotionSquare || isGameOver) return;

    // 1. Select Friendly Piece
    const clickedPiece = pieces.find(p => p.square === square);
    const isFriendly = clickedPiece && clickedPiece.color === game.turn();
    
    if (isFriendly) {
        if (selectedSquare === square) {
            setSelectedSquare(null);
            setValidMoves([]);
        } else {
            setSelectedSquare(square);
            setValidMoves(game.moves({ square, verbose: true }) as Move[]);
            playSound('start'); // Using start sound as "Select"
            const { x, y } = getSquareCenterPercent(square);
            spawnParticles(x, y, '#22d3ee', 'select');
        }
        return;
    }

    // 2. Move to target
    if (selectedSquare) {
        const move = validMoves.find((m) => m.to === square);
        if (move) {
            // Check Promotion
            if (move.flags.includes('p')) {
                setPendingMove(move);
                setPromotionSquare(square);
                return;
            }
            executeMove(move);
        } else {
            // Invalid move click (helpful for learning mode to detect "wrong" attempts if we wanted to visualize them)
            // But here we rely on standard validation. 
            // If the parent component wants to know about invalid moves, we could trigger a callback.
        }
        setSelectedSquare(null);
        setValidMoves([]);
    }
  };

  const executeMove = (move: Move, promotionPiece?: PieceSymbol) => {
    try {
        const moveString = promotionPiece ? `${move.from}${move.to}${promotionPiece}` : move.san;
        const result = game.move(moveString);

        if (result) {
            // FX
            const { x, y } = getSquareCenterPercent(result.to);
            if (result.captured || result.flags.includes('e')) {
                setShake(6);
                setTimeout(() => setShake(0), 300);
                spawnParticles(x, y, '#f43f5e', 'capture');
            } else {
                spawnParticles(x, y, '#ffffff', 'move');
            }

            const newGame = new Chess();
            newGame.loadPgn(game.pgn());
            setGame(newGame);
            onMove(result);
        }
    } catch (e) {
        console.error("Move execution failed", e);
        syncPiecesFromScratch();
    }
  };

  const handlePromotionSelect = (piece: PieceSymbol) => {
    if (pendingMove) {
        executeMove(pendingMove, piece);
    }
    setPromotionSquare(null);
    setPendingMove(null);
  };

  return (
    <motion.div 
        animate={{ x: shake * (Math.random() - 0.5), y: shake * (Math.random() - 0.5) }}
        className="relative w-full aspect-square select-none bg-[#0f172a] rounded-lg shadow-2xl ring-1 ring-white/10" 
    >
      <AnimatePresence>
        {promotionSquare && (
            <PromotionModal color={game.turn()} onSelect={handlePromotionSelect} />
        )}
      </AnimatePresence>

      <div className="w-full h-full flex flex-wrap rounded-md overflow-hidden relative z-0">
         {/* Grid Rendering */}
         {Array.from({length: 64}).map((_, i) => {
            const r = Math.floor(i / 8);
            const c = i % 8;
            const rankIdx = flip ? 7 - r : r;
            const fileIdx = flip ? 7 - c : c;
            const square = (FILES[fileIdx] + RANKS[rankIdx]) as SquareType;
            const isDark = getSquareColor(fileIdx, rankIdx) === 'dark';
            
            const isSelected = selectedSquare === square;
            const isLast = lastMove ? (lastMove.from === square || lastMove.to === square) : false;
            
            const validMove = validMoves.find(m => m.to === square);
            const isValidMove = !!validMove;
            const targetPiece = pieces.find(p => p.square === square);
            const isValidCapture = !!validMove && (!!targetPiece || validMove.flags.includes('e'));
            const inCheck = game.inCheck() && targetPiece?.type === 'k' && targetPiece?.color === game.turn();

            return (
                <div key={square} style={{ width: '12.5%', height: '12.5%' }}>
                    <Square
                        square={square}
                        isDark={isDark}
                        isSelected={isSelected}
                        isLastMove={isLast}
                        isValidMove={isValidMove}
                        isValidCapture={isValidCapture}
                        inCheck={inCheck || false}
                        rankLabel={c === 0 ? RANKS[rankIdx] : undefined}
                        fileLabel={r === 7 ? FILES[fileIdx] : undefined}
                        onClick={() => handleSquareClick(square)}
                    />
                </div>
            );
         })}
      </div>

      <div className={`absolute inset-1.5 pointer-events-none z-20 transition-opacity duration-1000 ${isGameOver ? 'opacity-30 grayscale' : 'opacity-100'}`}>
         {pieces.map((p) => {
            const { left, top } = getSquarePosPercent(p.square);
            const Icon = PieceIcons[p.type];
            const isSelected = selectedSquare === p.square;
            const isKingInCheck = game.inCheck() && p.type === 'k' && p.color === game.turn();
            
            return (
                <motion.div
                    key={p.id} 
                    initial={false}
                    animate={{ 
                        left: `${left}%`, 
                        top: `${top}%`, 
                        opacity: 1, 
                        scale: isSelected ? 1.15 : 1,
                        zIndex: isSelected ? 50 : 10
                    }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 250, 
                        damping: 25,
                        mass: 0.8
                    }}
                    className="absolute w-[12.5%] h-[12.5%] flex items-center justify-center"
                >
                    {isSelected && (
                        <motion.div 
                           layoutId="selection-glow"
                           className="absolute w-[120%] h-[120%] bg-cyan-400/30 blur-xl rounded-full -z-10" 
                        />
                    )}
                    {isKingInCheck && !isGameOver && (
                        <div className="absolute w-[140%] h-[140%] bg-rose-500/50 blur-2xl rounded-full animate-pulse -z-10" />
                    )}
                    <div className={`w-[85%] h-[85%] ${isSelected ? 'drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]' : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'}`}>
                        <Icon color={p.color} className="w-full h-full" />
                    </div>
                </motion.div>
            );
         })}
      </div>

      {renderArrows()}

      <div className="absolute inset-0 pointer-events-none rounded-md overflow-hidden z-[100]">
        <AnimatePresence>
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className={`absolute rounded-full ${p.type === 'ring' ? 'border-2 bg-transparent' : ''}`}
                    style={{ 
                        backgroundColor: p.type === 'ring' ? 'transparent' : p.color,
                        borderColor: p.color,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: `${p.x}%`, 
                        top: `${p.y}%`,
                        boxShadow: p.type === 'spark' ? `0 0 10px ${p.color}, 0 0 20px ${p.color}` : 'none'
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 1, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: p.life, ease: "easeOut" }}
                />
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Board;
