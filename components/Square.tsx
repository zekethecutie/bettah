import React from 'react';
import { Square as SquareType } from 'chess.js';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface SquareProps {
  square: SquareType;
  isDark: boolean;
  isSelected: boolean;
  isLastMove: boolean;
  isValidMove: boolean;
  isValidCapture: boolean;
  inCheck: boolean;
  rankLabel?: string;
  fileLabel?: string;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({
  square,
  isDark,
  isSelected,
  isLastMove,
  isValidMove,
  isValidCapture,
  inCheck,
  rankLabel,
  fileLabel,
  onClick
}) => {
  const baseColor = isDark 
    ? 'bg-[#1e293b]' // Slate-800
    : 'bg-[#334155]'; // Slate-700
    
  // Subtle gradient for depth
  const gradientOverlay = isDark
    ? 'bg-gradient-to-br from-transparent to-black/20'
    : 'bg-gradient-to-br from-white/5 to-transparent';

  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative w-full h-full select-none transition-colors duration-200 overflow-hidden',
        baseColor,
        gradientOverlay,
        // Last move highlight
        isLastMove && 'bg-indigo-500/30 shadow-[inset_0_0_20px_rgba(99,102,241,0.3)]',
        // Check highlight (red pulse) - Note: This usually applies to the King's square, but we handle that in the Piece layer or here if passed explicitly
        inCheck && 'bg-rose-500/40 animate-pulse'
      )}
      data-square={square}
    >
        {/* Notation Labels */}
        {rankLabel && (
            <span className={clsx("absolute top-0.5 left-1 text-[9px] font-bold pointer-events-none opacity-50", isDark ? "text-slate-400" : "text-slate-300")}>
                {rankLabel}
            </span>
        )}
        {fileLabel && (
            <span className={clsx("absolute bottom-0 right-1 text-[9px] font-bold pointer-events-none opacity-50", isDark ? "text-slate-400" : "text-slate-300")}>
                {fileLabel}
            </span>
        )}

        {/* Selection Glow (Background) */}
        <AnimatePresence>
            {isSelected && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-cyan-500/20 z-0"
                />
            )}
        </AnimatePresence>

        {/* Valid Move Marker (Dot) */}
        {isValidMove && !isValidCapture && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-3 h-3 rounded-full bg-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            </div>
        )}

        {/* Valid Capture Marker (Corners) */}
        {isValidCapture && (
             <div className="absolute inset-0 z-10 pointer-events-none">
                 <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-rose-500 rounded-tl-sm" />
                 <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-rose-500 rounded-tr-sm" />
                 <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-rose-500 rounded-bl-sm" />
                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-rose-500 rounded-br-sm" />
                 <div className="absolute inset-0 bg-rose-500/10 animate-pulse" />
             </div>
        )}
    </div>
  );
};

export default Square;