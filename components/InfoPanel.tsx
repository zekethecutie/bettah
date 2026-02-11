
import React from 'react';
import { Chess, PieceSymbol } from 'chess.js';
import { PieceIcons } from './Icons';
import { motion } from 'framer-motion';
import { User } from '../types';
import { RankEmblem } from '../utils/rankSystem';

interface InfoPanelProps {
  game: Chess;
  captured: { w: PieceSymbol[], b: PieceSymbol[] };
  whiteTime: number;
  blackTime: number;
  whiteUser?: User;
  blackUser?: User;
  mobileMode?: 'top' | 'bottom';
  isReplay?: boolean;
  replayStep?: number;
  totalSteps?: number;
}

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60); // Ensure integer seconds
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const CapturedList = ({ pieces, color }: { pieces: PieceSymbol[], color: 'w' | 'b' }) => {
  if (pieces.length === 0) return <div className="h-6 w-2"></div>;
  
  // Sort pieces by value
  const valueMap = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  const sorted = [...pieces].sort((a, b) => valueMap[b] - valueMap[a]);

  const isWhite = color === 'w';
  const containerClass = isWhite
    ? "bg-slate-200/10 border-slate-300/20 text-slate-200"
    : "bg-slate-950/40 border-slate-700/30 text-slate-800";

  return (
    <div className="flex -space-x-1.5 h-6 items-center pl-1">
      {sorted.map((p, i) => {
        const Icon = PieceIcons[p];
        return (
          <div 
            key={`${p}-${i}`}
            className={`w-5 h-5 rounded-full flex items-center justify-center border backdrop-blur-md relative z-0 ${containerClass}`}
          >
             <div className="w-[75%] h-[75%]">
                <Icon color={color} className="w-full h-full" />
             </div>
          </div>
        );
      })}
    </div>
  );
};

const UserDisplay = ({ user, time, isTurn, color, captured, isTop, isReplay, replayStep, totalSteps }: any) => {
    
    return (
        <div 
            className={`flex items-center justify-between p-3 rounded-xl border backdrop-blur-md shadow-lg relative overflow-hidden transition-all duration-300 ${isTurn ? (color === 'w' ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]') : ''}`}
            style={{ 
                backgroundColor: 'var(--element-bg)', 
                borderColor: isTurn ? undefined : 'var(--border-color)'
            }}
        >
            {isTurn && <div className={`absolute inset-0 bg-gradient-to-r ${color === 'w' ? 'from-cyan-900/10' : 'from-rose-900/10'} via-transparent to-transparent animate-pulse`} />}
            
            <div className="flex items-center gap-3 relative z-10 overflow-hidden">
                <div className={`relative w-10 h-10 rounded-lg shrink-0 flex items-center justify-center shadow-inner border overflow-visible ${isTurn ? 'border-cyan-500/50' : 'border-slate-700'}`} style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover rounded-lg overflow-hidden" />
                    {/* Tiny Rank Badge */}
                    <div className="absolute -bottom-1.5 -right-1.5 z-20">
                        <RankEmblem elo={user.elo} className="w-5 h-5" />
                    </div>
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-sm truncate flex items-center gap-1" style={{ color: 'var(--text-main)' }}>
                        {user.username}
                        <span className="text-[10px] bg-slate-800 px-1 rounded font-mono" style={{ color: 'var(--text-muted)' }}>{user.elo}</span>
                    </p>
                    <div className="flex items-center gap-1">
                        {user.country && <span className="text-xs grayscale opacity-70">{user.country.split(' ')[0]}</span>}
                        <CapturedList pieces={captured} color={color === 'w' ? 'b' : 'w'} />
                    </div>
                </div>
            </div>

            <div 
                className={`text-lg font-mono font-bold tracking-wider px-2 py-0.5 rounded-lg border relative z-10 transition-colors duration-300 ${
                    isTurn ? (color === 'w' ? 'bg-slate-950/80 text-cyan-400 border-cyan-500/30' : 'bg-slate-950/80 text-rose-400 border-rose-500/30') 
                    : 'text-slate-500'
                }`}
                style={!isTurn ? { backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' } : {}}
            >
                {isReplay ? (
                    <span className="text-xs">
                        {isTurn ? `Move ${Math.ceil(replayStep / 2)}` : 'Waiting'}
                    </span>
                ) : (
                    formatTime(time)
                )}
            </div>
        </div>
    );
};

const InfoPanel: React.FC<InfoPanelProps> = ({ game, captured, whiteTime, blackTime, whiteUser, blackUser, mobileMode, isReplay, replayStep, totalSteps }) => {
  const turn = game.turn();
  const isGameOver = game.isGameOver();
  let status = "";
  
  if (isGameOver) {
    if (game.isCheckmate()) status = `Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins.`;
    else status = "Game Over";
  } else {
    status = `${turn === 'w' ? "White" : "Black"}'s Turn`;
  }

  // Default Mock Users if not provided
  const wUser = whiteUser || { username: 'You', elo: 1200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You', country: '🇺🇸' };
  const bUser = blackUser || { username: 'Opponent', elo: 1200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Opponent', country: '🌍' };

  if (mobileMode === 'top') {
      return <UserDisplay user={bUser} time={blackTime} isTurn={turn === 'b'} color="b" captured={captured.w} isTop={true} isReplay={isReplay} replayStep={replayStep} totalSteps={totalSteps} />;
  }
  if (mobileMode === 'bottom') {
      return <UserDisplay user={wUser} time={whiteTime} isTurn={turn === 'w'} color="w" captured={captured.b} isTop={false} isReplay={isReplay} replayStep={replayStep} totalSteps={totalSteps} />;
  }

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      <UserDisplay user={bUser} time={blackTime} isTurn={turn === 'b'} color="b" captured={captured.w} isTop={true} isReplay={isReplay} replayStep={replayStep} totalSteps={totalSteps} />
      
      {/* Status Badge */}
      <div className="relative h-6 flex items-center justify-center">
          <motion.div 
            key={status}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute"
          >
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-md shadow-lg ${
                isGameOver 
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-900/20' 
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-cyan-900/20'
            }`}>
                {status}
            </span>
          </motion.div>
      </div>

      <UserDisplay user={wUser} time={whiteTime} isTurn={turn === 'w'} color="w" captured={captured.b} isTop={false} isReplay={isReplay} replayStep={replayStep} totalSteps={totalSteps} />
    </div>
  );
};

export default InfoPanel;
