
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Layout, Crown, Lock, Check, Coins, Zap } from 'lucide-react';
import { SHOP_ITEMS } from '../utils/shopData';
import { UserManager } from '../utils/storage';
import { User, ShopItem } from '../types';
import ShopModal from '../components/ShopModal';

const Shop: React.FC = () => {
    const [user, setUser] = useState<User | null>(UserManager.getCurrentUser());
    const [activeTab, setActiveTab] = useState<'board_theme' | 'piece_set' | 'currency'>('board_theme');
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const [successAnim, setSuccessAnim] = useState<string | null>(null);

    const handleBuy = (item: ShopItem) => {
        if (!user) return;
        const result = UserManager.buyItem(item.id);
        
        if (result.success) {
            setSelectedItem(null); // Close modal
            setSuccessAnim(result.message);
            setUser(UserManager.getCurrentUser()); // Refresh state
            setTimeout(() => setSuccessAnim(null), 3000);
        } else {
            alert(result.message);
        }
    };

    const handleEquip = (item: ShopItem) => {
        if (item.type === 'board_theme') UserManager.equipItem(item.id, 'boardTheme');
        else if (item.type === 'piece_set') UserManager.equipItem(item.id, 'pieceSet');
        setUser(UserManager.getCurrentUser());
        setSelectedItem(null);
        // Force reload for theme application (basic approach) or rely on App.tsx effect
    };

    const filteredItems = SHOP_ITEMS.filter(i => i.type === activeTab);

    return (
        <div className="w-full h-full p-4 lg:p-8 animate-in fade-in pb-28 lg:pb-8 relative">
            
            <ShopModal 
                item={selectedItem} 
                user={user} 
                onClose={() => setSelectedItem(null)} 
                onBuy={handleBuy}
                onEquip={handleEquip}
            />

            {/* Success Overlay */}
            <AnimatePresence>
                {successAnim && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-slate-900/90 backdrop-blur-md border border-emerald-500/50 px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center">
                            <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }} 
                                className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/30"
                            >
                                <Check className="w-8 h-8" />
                            </motion.div>
                            <h2 className="text-2xl font-black text-white tracking-tight">SUCCESS!</h2>
                            <p className="text-emerald-400 font-bold">{successAnim}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tighter flex items-center gap-3" style={{ color: 'var(--text-main)' }}>
                        <ShoppingBag className="w-10 h-10" style={{ color: 'var(--primary)' }} />
                        MARKETPLACE
                    </h1>
                    <p className="mt-2 max-w-lg" style={{ color: 'var(--text-muted)' }}>Customize your experience with premium themes and assets.</p>
                </div>
                {user && (
                    <div className="border px-6 py-4 rounded-2xl flex items-center gap-4 shadow-xl" style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)' }}>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                            <Coins className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Balance</p>
                            <p className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>{user.coins.toLocaleString()}</p>
                        </div>
                        <button 
                            onClick={() => setActiveTab('currency')}
                            className="ml-2 px-3 py-1 bg-amber-500 text-amber-950 text-xs font-black uppercase rounded-lg hover:bg-amber-400 transition-colors"
                        >
                            + Add
                        </button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 custom-scrollbar">
                {[
                    { id: 'board_theme', label: 'Board Themes', icon: Layout },
                    { id: 'piece_set', label: 'Piece Sets', icon: Crown },
                    { id: 'currency', label: 'Currency', icon: Coins },
                ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                                isActive 
                                ? 'text-white shadow-lg ring-1' 
                                : 'hover:bg-white/10'
                            }`}
                            style={{ 
                                backgroundColor: isActive ? 'var(--primary)' : 'var(--element-bg)',
                                color: isActive ? 'white' : 'var(--text-muted)',
                                '--tw-ring-color': isActive ? 'var(--primary)' : 'transparent'
                            } as React.CSSProperties}
                        >
                            <Icon className="w-4 h-4" /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => {
                    const isOwned = user?.inventory.ownedItems.includes(item.id);
                    const isEquipped = user?.inventory.equipped.boardTheme === item.id || user?.inventory.equipped.pieceSet === item.id;
                    
                    return (
                        <motion.div 
                            key={item.id}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedItem(item)}
                            className="border rounded-3xl overflow-hidden group transition-all cursor-pointer relative shadow-lg hover:shadow-2xl"
                            style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}
                        >
                            {/* Preview Area */}
                            <div className={`h-48 relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${item.previewGradient || 'from-slate-800 to-slate-950'}`}>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                                
                                {/* Visual Representation */}
                                {item.type === 'board_theme' && item.config ? (
                                    <div className="w-32 h-32 grid grid-cols-2 grid-rows-2 rotate-12 shadow-2xl rounded-lg overflow-hidden border-2 border-white/10">
                                        <div className={item.config.light} />
                                        <div className={item.config.dark} />
                                        <div className={item.config.dark} />
                                        <div className={item.config.light} />
                                    </div>
                                ) : item.type === 'currency' ? (
                                    <Coins className="w-20 h-20 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                                ) : (
                                    <Crown className="w-20 h-20 text-white/50" />
                                )}

                                {/* Status Tags */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                    {isEquipped && (
                                        <div className="text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-lg flex items-center gap-1" style={{ backgroundColor: 'var(--primary)' }}>
                                            <Zap className="w-3 h-3 fill-current" /> Active
                                        </div>
                                    )}
                                    {isOwned && !isEquipped && (
                                        <div className="bg-slate-700/80 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-lg flex items-center gap-1 border border-white/10">
                                            <Check className="w-3 h-3" /> Owned
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg leading-tight" style={{ color: 'var(--text-main)' }}>{item.name}</h3>
                                </div>
                                
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                                        item.rarity === 'legendary' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' :
                                        item.rarity === 'epic' ? 'bg-pink-900/30 text-pink-400 border-pink-500/30' :
                                        item.rarity === 'rare' ? 'bg-cyan-900/30 text-cyan-400 border-cyan-500/30' :
                                        'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                        {item.rarity}
                                    </span>
                                    {item.type === 'currency' && (
                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-500/20">
                                            +{item.coinValue} Coins
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                                    {isOwned && item.type !== 'currency' ? (
                                        <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>View Details</span>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            {item.type === 'currency' ? (
                                                <span className="text-white font-bold text-sm">Free Claim</span>
                                            ) : (
                                                <>
                                                    <span className="text-amber-400 font-bold">{item.price}</span>
                                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Coins</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:text-white" style={{ backgroundColor: 'var(--element-bg)', color: 'var(--text-muted)' }}>
                                        <ShoppingBag className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Shop;