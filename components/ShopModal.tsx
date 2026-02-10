
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Check, Sparkles, ShoppingBag, Coins } from 'lucide-react';
import { ShopItem, User } from '../types';
import { PieceIcons } from './Icons';

interface ShopModalProps {
    item: ShopItem | null;
    user: User | null;
    onClose: () => void;
    onBuy: (item: ShopItem) => void;
    onEquip: (item: ShopItem) => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ item, user, onClose, onBuy, onEquip }) => {
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    
    if (!item || !user || !mounted) return null;

    const isOwned = user.inventory.ownedItems.includes(item.id);
    const isEquipped = user.inventory.equipped.boardTheme === item.id || user.inventory.equipped.pieceSet === item.id;
    const canAfford = item.type === 'currency' ? true : user.coins >= item.price;
    const isCurrency = item.type === 'currency';

    const handleAction = () => {
        if (isOwned && !isCurrency) {
            onEquip(item);
        } else {
            setIsPurchasing(true);
            setTimeout(() => {
                onBuy(item);
                setIsPurchasing(false);
            }, 1500); // Fake network delay for effect
        }
    };

    const modalContent = (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            >
                {/* Modal Container */}
                <motion.div 
                    initial={{ scale: 0.9, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 50, opacity: 0 }}
                    className="relative w-full max-w-4xl bg-slate-900 rounded-[3rem] border border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-[600px]"
                >
                    <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>

                    {/* Left: Visual Preview Area */}
                    <div className="flex-1 relative overflow-hidden bg-slate-950 flex items-center justify-center p-8">
                        {/* Dynamic Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.previewGradient || 'from-slate-800 to-slate-950'} opacity-20`} />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                        
                        {/* Item Visual */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative z-10 w-full max-w-sm aspect-square shadow-2xl rounded-2xl overflow-hidden border-4 border-white/10 ring-1 ring-black/50"
                        >
                            {item.type === 'board_theme' && item.config ? (
                                <div className="w-full h-full grid grid-cols-4 grid-rows-4 rotate-0">
                                    {Array.from({length: 16}).map((_, i) => (
                                        <div key={i} className={`relative ${(Math.floor(i/4)+i%4)%2===0 ? item.config?.light : item.config?.dark}`}>
                                            {/* Simulate Pieces for realism */}
                                            {i === 5 && <div className="absolute inset-2 bg-slate-900/50 rounded-full shadow-lg" />}
                                            {i === 10 && <div className="absolute inset-2 bg-white/50 rounded-full shadow-lg" />}
                                        </div>
                                    ))}
                                </div>
                            ) : item.type === 'piece_set' ? (
                                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${item.previewGradient || 'from-slate-800 to-slate-700'}`}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="w-16 h-16 drop-shadow-xl">
                                            {React.createElement(PieceIcons['n'], { color: 'w', className: "w-full h-full", set: item.pieceSetId as any })}
                                        </div>
                                        <div className="w-16 h-16 drop-shadow-xl">
                                            {React.createElement(PieceIcons['k'], { color: 'b', className: "w-full h-full", set: item.pieceSetId as any })}
                                        </div>
                                        <div className="w-16 h-16 drop-shadow-xl">
                                            {React.createElement(PieceIcons['q'], { color: 'w', className: "w-full h-full", set: item.pieceSetId as any })}
                                        </div>
                                        <div className="w-16 h-16 drop-shadow-xl">
                                            {React.createElement(PieceIcons['r'], { color: 'b', className: "w-full h-full", set: item.pieceSetId as any })}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${item.previewGradient}`}>
                                    {isCurrency ? <Coins className="w-32 h-32 text-white drop-shadow-lg" /> : <ShoppingBag className="w-32 h-32 text-white/50" />}
                                </div>
                            )}
                        </motion.div>

                        {/* Rarity Tag */}
                        <div className={`absolute bottom-8 left-8 px-4 py-2 rounded-lg font-black uppercase tracking-widest text-xs border bg-black/50 backdrop-blur-md ${
                            item.rarity === 'legendary' ? 'border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                            item.rarity === 'epic' ? 'border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]' :
                            item.rarity === 'rare' ? 'border-cyan-500 text-cyan-400' :
                            'border-slate-600 text-slate-400'
                        }`}>
                            {item.rarity} Tier
                        </div>
                    </div>

                    {/* Right: Info & Action */}
                    <div className="w-full md:w-[400px] bg-slate-900 border-l border-slate-800 p-8 flex flex-col justify-center relative">
                        
                        <div className="mb-auto">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">{item.name}</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">{item.description}</p>
                            
                            {isCurrency && (
                                <div className="mt-6 flex items-center gap-2 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
                                    <Coins className="w-6 h-6 text-emerald-400" />
                                    <span className="text-emerald-300 font-bold">Contains {item.coinValue} Coins</span>
                                </div>
                            )}
                        </div>

                        {/* Purchase Button Area */}
                        <div className="mt-8 space-y-4">
                            {!canAfford && !isOwned && (
                                <div className="text-rose-400 text-sm font-bold flex items-center gap-2 bg-rose-950/30 p-3 rounded-lg border border-rose-500/20">
                                    <Lock className="w-4 h-4" /> Insufficient Funds
                                </div>
                            )}

                            <button
                                onClick={handleAction}
                                disabled={!canAfford && !isOwned && !isCurrency}
                                className={`w-full py-5 rounded-2xl font-black text-lg tracking-wide flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
                                    isOwned && !isCurrency
                                        ? isEquipped 
                                            ? 'bg-slate-800 text-slate-500 cursor-default'
                                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                                        : canAfford 
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:brightness-110'
                                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                }`}
                            >
                                {isPurchasing ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
                                ) : (
                                    <>
                                        {isOwned && !isCurrency ? (
                                            isEquipped ? <><Check className="w-6 h-6" /> Equipped</> : 'Equip Now'
                                        ) : (
                                            <>
                                                {item.type === 'currency' ? (
                                                    <span>Claim for FREE</span> /* Mocking Real Money Purchase */
                                                ) : (
                                                    <>Purchase {item.price} <span className="text-amber-400">🪙</span></>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                            
                            {!isOwned && !isCurrency && (
                                <p className="text-center text-xs text-slate-500">
                                    Current Balance: <span className="text-amber-400 font-bold">{user.coins} 🪙</span>
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default ShopModal;
