
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, X, Trophy, MinusCircle, Flag } from 'lucide-react';

interface GameOverOverlayProps {
  type: 'checkmate' | 'draw' | 'stalemate' | 'threefold' | 'insufficient' | 'timeout' | 'resign';
  winner: 'w' | 'b' | null;
  onRematch: () => void;
  onExit: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ type, winner, onRematch, onExit }) => {
  let title = '';
  let sub = '';
  let colorClass = '';
  let Icon: any = Trophy;
  
  if (type === 'checkmate') {
      title = 'CHECKMATE';
      sub = winner === 'w' ? 'White Wins' : 'Black Wins';
      colorClass = winner === 'w' ? 'text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)]' : 'text-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.8)]';
  } else if (type === 'timeout') {
      title = 'TIME OUT';
      sub = winner === 'w' ? 'White Wins' : 'Black Wins';
      colorClass = winner === 'w' ? 'text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)]' : 'text-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.8)]';
  } else if (type === 'resign') {
      title = 'RESIGNATION';
      sub = winner === 'w' ? 'Black Resigned' : 'White Resigned';
      colorClass = winner === 'w' ? 'text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)]' : 'text-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.8)]';
      Icon = Flag;
  } else {
      title = type === 'stalemate' ? 'STALEMATE' : 'DRAW';
      sub = type === 'stalemate' ? 'No legal moves' : 'Game drawn';
      colorClass = 'text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]';
      Icon = MinusCircle;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
        {/* Backdrop - fades in with blur */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
        />

        {/* Dynamic Background Beams */}
        <motion.div 
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 0.3 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", opacity: { duration: 1 } }}
            className={`absolute w-[200vw] h-[200vw] bg-gradient-to-r from-transparent via-${winner === 'w' ? 'cyan' : winner === 'b' ? 'rose' : 'amber'}-500/10 to-transparent`}
            style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${winner === 'w' ? '#22d3ee' : winner === 'b' ? '#f43f5e' : '#fbbf24'}20 180deg, transparent 360deg)` }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-md">
             <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                className="mb-10 text-center flex flex-col items-center"
             >
                 {type !== 'stalemate' && type !== 'draw' && (
                     <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                        className={`mb-6 p-6 rounded-full border-4 ${winner === 'w' ? 'border-cyan-500 bg-cyan-900/50' : 'border-rose-500 bg-rose-900/50'} shadow-2xl`}
                     >
                        <Icon className={`w-16 h-16 ${winner === 'w' ? 'text-cyan-400' : 'text-rose-400'}`} />
                     </motion.div>
                 )}
                 
                 <h1 className={`text-6xl md:text-8xl font-black italic tracking-tighter mb-2 ${colorClass}`}>
                    {title}
                 </h1>
                 
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className={`h-1.5 rounded-full mb-4 ${winner === 'w' ? 'bg-cyan-500' : winner === 'b' ? 'bg-rose-500' : 'bg-amber-500'}`}
                 />

                 <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="text-xl md:text-2xl text-white font-bold tracking-[0.2em] uppercase"
                 >
                    {sub}
                 </motion.p>
             </motion.div>
             
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="flex flex-col w-full gap-3 px-8"
             >
                 <button 
                    onClick={onRematch}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 hover:bg-slate-200 font-black rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all transform hover:scale-105"
                 >
                     <RefreshCw className="w-5 h-5" /> PLAY AGAIN
                 </button>
                 <button 
                    onClick={onExit}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-all transform hover:scale-105"
                 >
                     <X className="w-5 h-5" /> EXIT MENU
                 </button>
             </motion.div>
        </div>
    </div>
  );
};

export default GameOverOverlay;
