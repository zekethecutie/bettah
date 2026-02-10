
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Users, Swords, Crown, Search } from 'lucide-react';
import { UserManager } from '../utils/storage';
import { User } from '../types';
import { RankEmblem, getRankDetails } from '../utils/rankSystem';

interface LeaderboardProps {
    onViewProfile: (user: User) => void;
}

const CATEGORIES = [
    { id: 'elo', label: 'Ranked', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'level', label: 'Legends', icon: Flame, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { id: 'matches', label: 'Gladiators', icon: Swords, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { id: 'followers', label: 'Influencers', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' }
];

const Leaderboard: React.FC<LeaderboardProps> = ({ onViewProfile }) => {
    const [activeCategory, setActiveCategory] = useState<string>('elo');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const data = await UserManager.getLeaderboard(activeCategory as any);
            setUsers(data);
            setLoading(false);
        };
        fetchUsers();
    }, [activeCategory]);

    const getMetric = (user: User) => {
        switch(activeCategory) {
            case 'elo': return `${user.elo}`;
            case 'level': return `Lvl ${user.level}`;
            case 'matches': return `${(user.stats.wins + user.stats.losses + user.stats.draws)}`;
            case 'followers': return `${user.followers?.length || 0}`;
            default: return '';
        }
    };

    const getMetricLabel = () => {
        switch(activeCategory) {
            case 'elo': return 'RATING';
            case 'level': return 'LEVEL';
            case 'matches': return 'GAMES';
            case 'followers': return 'FANS';
            default: return 'SCORE';
        }
    };

    return (
        <div className="w-full h-full p-4 lg:p-8 animate-in fade-in duration-500 flex flex-col gap-8 mb-20 lg:mb-0">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter flex items-center gap-4 mb-2" style={{ color: 'var(--text-main)' }}>
                        <Trophy className="w-8 h-8 lg:w-12 lg:h-12" style={{ color: 'var(--primary)' }} /> 
                        LEADERBOARD
                    </h1>
                    <p className="font-medium text-sm lg:text-base" style={{ color: 'var(--text-muted)' }}>Top players across the Nexus network.</p>
                </div>
                
                {/* Category Switcher */}
                <div className="flex gap-2 p-1.5 border rounded-xl overflow-x-auto max-w-full w-full lg:w-auto custom-scrollbar" style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)' }}>
                    {CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-1 lg:flex-none justify-center ${
                                    isActive 
                                    ? `shadow-lg ring-1` 
                                    : 'hover:opacity-80'
                                }`}
                                style={{ 
                                    backgroundColor: isActive ? 'var(--primary-dim)' : 'transparent',
                                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                    borderColor: isActive ? 'var(--primary)' : 'transparent'
                                }}
                            >
                                <Icon className={`w-4 h-4`} style={isActive ? { color: 'var(--primary)' } : {}} />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Top 3 Podium - Improved Design */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 items-end">
                    {users.slice(0, 3).map((u, i) => {
                        let displayOrder = 0;
                        let scale = 1;
                        let rank = 0;
                        
                        if (i === 0) { displayOrder = 2; scale = 1.05; rank = 1; } 
                        if (i === 1) { displayOrder = 1; scale = 0.95; rank = 2; } 
                        if (i === 2) { displayOrder = 3; scale = 0.9; rank = 3; } 

                        const rankData = getRankDetails(u.elo);

                        return (
                            <motion.div 
                                key={u.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => onViewProfile(u)}
                                className={`relative order-${displayOrder} backdrop-blur-md border rounded-3xl p-6 flex flex-col items-center text-center cursor-pointer group hover:bg-white/5 transition-all ${
                                    rank === 1 ? 'shadow-[0_0_40px_rgba(251,191,36,0.15)] z-10' : ''
                                }`}
                                style={{ 
                                    backgroundColor: 'var(--panel-bg)',
                                    borderColor: rank === 1 ? 'var(--primary)' : 'var(--border-color)',
                                    transform: window.innerWidth > 768 ? `scale(${scale})` : 'none' 
                                }}
                            >
                                {/* Rank Crown/Badge */}
                                <div className={`absolute -top-6 w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-lg border-4 border-[#020617] ${
                                    rank === 1 ? 'bg-amber-400 text-amber-900 shadow-amber-500/50' : 
                                    rank === 2 ? 'bg-slate-300 text-slate-900 shadow-slate-300/50' : 
                                    'bg-orange-700 text-orange-100 shadow-orange-700/50'
                                }`}>
                                    {rank}
                                </div>

                                {/* Avatar with Glow */}
                                <div className="relative mb-4 mt-4">
                                    <div className={`absolute inset-0 bg-gradient-to-tr ${rank === 1 ? 'from-amber-500 to-yellow-300' : 'from-slate-700 to-slate-500'} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full`} />
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 relative z-10 shadow-2xl">
                                        <img src={u.avatar} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 z-20 drop-shadow-lg">
                                        <RankEmblem elo={u.elo} className="w-14 h-14" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>{u.username}</h3>
                                <p className="text-xs font-bold uppercase tracking-widest mb-4 mt-1 px-3 py-1 rounded-full border border-white/5" style={{ color: rankData.config.color, backgroundColor: 'rgba(0,0,0,0.3)' }}>
                                    {rankData.tierName}
                                </p>

                                <div className="w-full py-3 rounded-xl border" style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)' }}>
                                    <p className="text-xs uppercase font-bold mb-1" style={{ color: 'var(--text-muted)' }}>{getMetricLabel()}</p>
                                    <p className="text-2xl font-mono font-black" style={{ color: 'var(--text-main)' }}>{getMetric(u)}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* List View */}
                <div className="lg:col-span-12 border rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b text-xs font-bold uppercase tracking-wider" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--element-bg)', color: 'var(--text-muted)' }}>
                                    <th className="px-6 py-5 w-20 text-center">Rank</th>
                                    <th className="px-6 py-5">Player</th>
                                    <th className="px-6 py-5 hidden md:table-cell">Tier</th>
                                    <th className="px-6 py-5 text-right">{getMetricLabel()}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                                {loading ? (
                                    <tr><td colSpan={4} className="text-center py-12 animate-pulse" style={{ color: 'var(--text-muted)' }}>Scanning the Nexus...</td></tr>
                                ) : (
                                    users.slice(3).map((u, index) => {
                                        const rankData = getRankDetails(u.elo);
                                        return (
                                            <tr 
                                                key={u.id} 
                                                onClick={() => onViewProfile(u)}
                                                className="hover:bg-white/[0.05] transition-colors cursor-pointer group"
                                                style={{ borderBottomColor: 'var(--border-color)' }}
                                            >
                                                <td className="px-6 py-4 text-center font-mono font-bold group-hover:text-white" style={{ color: 'var(--text-muted)' }}>
                                                    #{index + 4}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <img src={u.avatar} className="w-10 h-10 rounded-xl border" style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)' }} />
                                                            <div className="absolute -bottom-2 -right-2 md:hidden">
                                                                <RankEmblem elo={u.elo} className="w-6 h-6" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold transition-colors group-hover:text-[var(--primary)]" style={{ color: 'var(--text-main)' }}>{u.username}</div>
                                                            <div className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                                                {u.country}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <div className="flex items-center gap-3">
                                                        <RankEmblem elo={u.elo} className="w-8 h-8 drop-shadow-md" />
                                                        <span className="text-sm font-bold uppercase tracking-wide" style={{ color: rankData.config.color }}>
                                                            {rankData.tierName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-mono font-bold text-lg group-hover:text-[var(--primary)]" style={{ color: 'var(--text-main)' }}>{getMetric(u)}</span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
