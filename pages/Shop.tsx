
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Layout, Crown, Lock, Check } from 'lucide-react';
import { SHOP_ITEMS } from '../utils/shopData';
import { UserManager } from '../utils/storage';
import { User, ShopItem } from '../types';
import { useNavigate } from 'react-router-dom';

const Shop: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(UserManager.getCurrentUser());
    const [activeTab, setActiveTab] = useState<'board_theme' | 'piece_set'>('board_theme');
    const [notification, setNotification] = useState<string | null>(null);

    const handleBuy = (item: ShopItem) => {
        if (!user) return;
        const result = UserManager.buyItem(item.id);
        if (result.success) {
            setNotification(result.message);
            setUser(UserManager.getCurrentUser()); // Refresh
            setTimeout(() => setNotification(null), 3000);
        } else {
            alert(result.message);
        }
    };

    const filteredItems = SHOP_ITEMS.filter(i => i.type === activeTab);

    return (
        <div className="w-full h-full p-4 lg:p-8 animate-in fade-in pb-28 lg:pb-8">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 lg:w-10 lg:h-10 text-cyan-400" />
                        MARKETPLACE
                    </h1>
                    <p className="text-slate-400 mt-2">Customize your battle station.</p>
                </div>
                {user && (
                    <div className="bg-slate-900 border border-slate-700 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                            <span className="text-lg">🪙</span>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Balance</p>
                            <p className="text-xl font-black text-white">{user.coins.toLocaleString()}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Notification */}
            {notification && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl z-50 font-bold animate-bounce">
                    {notification}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                <button 
                    onClick={() => setActiveTab('board_theme')}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'board_theme' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                >
                    <Layout className="w-4 h-4" /> Board Themes
                </button>
                <button 
                    onClick={() => setActiveTab('piece_set')}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'piece_set' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                >
                    <Crown className="w-4 h-4" /> Piece Sets
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => {
                    const isOwned = user?.inventory.ownedItems.includes(item.id);
                    const canAfford = (user?.coins || 0) >= item.price;

                    return (
                        <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden group hover:border-cyan-500/30 transition-all hover:-translate-y-1">
                            {/* Preview Area */}
                            <div className="h-40 bg-slate-950 relative flex items-center justify-center overflow-hidden">
                                {item.type === 'board_theme' && item.config ? (
                                    <div className="w-full h-full grid grid-cols-4 grid-rows-4 rotate-12 scale-125 opacity-80">
                                        {Array.from({length: 16}).map((_, i) => (
                                            <div key={i} className={(Math.floor(i/4)+i%4)%2===0 ? item.config.light : item.config.dark} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-slate-700 font-black text-6xl opacity-20">?</div>
                                )}
                                
                                {isOwned && (
                                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                                        <Check className="w-3 h-3" /> OWNED
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-white text-lg">{item.name}</h3>
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${
                                        item.rarity === 'legendary' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' :
                                        item.rarity === 'rare' ? 'bg-cyan-900/30 text-cyan-400 border-cyan-500/30' :
                                        'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                        {item.rarity}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-xs mb-6 h-8">{item.description}</p>

                                {isOwned ? (
                                    <button 
                                        onClick={() => navigate('/profile')} 
                                        className="w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                                    >
                                        Go to Inventory
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleBuy(item)}
                                        disabled={!canAfford}
                                        className={`w-full py-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                                            canAfford 
                                            ? 'bg-white text-slate-900 hover:bg-cyan-50' 
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {canAfford ? (
                                            <>Buy for {item.price} 🪙</>
                                        ) : (
                                            <><Lock className="w-4 h-4" /> {item.price} 🪙</>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Shop;
