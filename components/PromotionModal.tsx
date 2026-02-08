
import React from 'react';
import { motion } from 'framer-motion';
import { PieceIcons } from './Icons';
import { PieceSymbol } from 'chess.js';

interface PromotionModalProps {
  color: 'w' | 'b';
  onSelect: (piece: PieceSymbol) => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ color, onSelect }) => {
  const pieces: { id: PieceSymbol, label: string }[] = [
      { id: 'q', label: 'Queen' },
      { id: 'r', label: 'Rook' },
      { id: 'n', label: 'Knight' },
      { id: 'b', label: 'Bishop' },
  ];

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-[#0f172a] border border-cyan-500/30 p-4 rounded-2xl shadow-2xl max-w-[320px] w-full"
      >
        <h2 className="text-lg font-black text-white mb-4 text-center uppercase tracking-wider border-b border-slate-800 pb-2">
            Pawn Promotion
        </h2>

        <div className="grid grid-cols-2 gap-3">
        {pieces.map((p) => {
          const Icon = PieceIcons[p.id];
          return (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(34,211,238,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(p.id)}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-700 bg-slate-900 transition-colors gap-2 hover:border-cyan-500/50"
            >
              <div className="w-10 h-10">
                <Icon color={color} className="w-full h-full drop-shadow-md" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{p.label}</span>
            </motion.button>
          );
        })}
        </div>
      </motion.div>
    </div>
  );
};

export default PromotionModal;
