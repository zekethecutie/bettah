
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Swords, Zap, BookOpen, Crown, Target, Users, Layout } from 'lucide-react';
import { RANK_CONFIGS, RankEmblem } from '../utils/rankSystem';

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:bg-slate-800/50 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

const Docs: React.FC = () => {
    return (
        <div className="w-full h-full p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar pb-32 lg:pb-12">
            <div className="max-w-5xl mx-auto space-y-16">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 text-cyan-400 text-xs font-bold uppercase tracking-widest border border-cyan-500/20">
                        Official Guide
                    </div>
                    <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tighter">
                        NEXUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">SYSTEMS</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto">
                        A complete breakdown of our competitive ranking algorithms, progression paths, and platform features.
                    </p>
                </div>

                {/* RANKING SYSTEM */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                        <Crown className="w-8 h-8 text-amber-400" />
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-black text-white">Competitive Ranks</h2>
                            <p className="text-slate-400 text-sm">ELO-based matchmaking tiers.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {RANK_CONFIGS.map((rank) => (
                            <motion.div 
                                key={rank.name}
                                whileHover={{ y: -5 }}
                                className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center overflow-hidden group"
                            >
                                <div className={`absolute top-0 left-0 w-full h-1`} style={{ backgroundColor: rank.color }} />
                                
                                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    {/* Render a representative rank (e.g. Division I) for the card */}
                                    <RankEmblem elo={rank.minElo + (rank.range * 0.9)} className="w-24 h-24" />
                                </div>
                                
                                <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{rank.name}</h3>
                                <p className="text-sm font-mono font-bold opacity-70" style={{ color: rank.color }}>
                                    {rank.minElo} - {rank.name === 'Ascendant' ? '+' : rank.minElo + rank.range - 1} ELO
                                </p>
                                
                                <div className="mt-4 text-xs text-slate-500 leading-snug">
                                    {rank.name === 'Ascendant' 
                                        ? "The pinnacle of mastery. Only the top 0.1% reach this tier."
                                        : "Comprises 5 Divisions (V to I). Win matches to climb divisions."}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* PROGRESSION SYSTEM */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                        <Target className="w-8 h-8 text-emerald-400" />
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-black text-white">Account Progression</h2>
                            <p className="text-slate-400 text-sm">XP, Levels, and Quests.</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Leveling Up</h3>
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                Every action on NexusChess earns you Experience Points (XP). Winning games, solving puzzles, and completing daily quests contribute to your account level.
                            </p>
                            <div className="space-y-3">
                                {[
                                    { lvl: "1-10", title: "Novice", xp: "Fast Progression" },
                                    { lvl: "11-30", title: "Apprentice to Adept", xp: "Medium Grind" },
                                    { lvl: "31-60", title: "Strategist to Master", xp: "High Effort" },
                                    { lvl: "61-90", title: "Grandmaster to Legend", xp: "Elite Status" },
                                    { lvl: "91-100", title: "Nexus Divinity", xp: "Ultimate Prestige" },
                                ].map((tier, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                                        <span className="font-mono text-cyan-400 font-bold w-16">Lvl {tier.lvl}</span>
                                        <span className="font-bold text-white flex-1 px-4">{tier.title}</span>
                                        <span className="text-xs text-slate-500 uppercase">{tier.xp}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <Zap className="w-6 h-6 text-indigo-400" />
                                    <h3 className="text-xl font-bold text-white">Daily Streaks</h3>
                                </div>
                                <p className="text-slate-300 mb-4">
                                    Login consecutively to build your <strong>Streak Flame</strong>. 
                                    Higher streaks provide a passive multiplier to all XP gained from matches.
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
                                    <div className="px-3 py-1 bg-indigo-500/20 rounded-lg">7 Days = 1.1x XP</div>
                                    <div className="px-3 py-1 bg-indigo-500/20 rounded-lg">30 Days = 1.5x XP</div>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                                <h3 className="text-xl font-bold text-white mb-2">Daily Quests</h3>
                                <p className="text-slate-400 text-sm">
                                    Three unique challenges generated daily based on your skill level. Complete them before midnight (UTC) to earn massive XP rewards.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PLATFORM FEATURES */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                        <Layout className="w-8 h-8 text-purple-400" />
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-black text-white">Core Features</h2>
                            <p className="text-slate-400 text-sm">Tools designed for mastery.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard 
                            icon={Swords}
                            title="Matchmaking"
                            desc="Real-time pairing with opponents of similar ELO. Supports Bullet, Blitz, and Rapid time controls."
                        />
                        <FeatureCard 
                            icon={BookOpen}
                            title="Nexus Academy"
                            desc="Interactive lessons covering Tactics, Openings, Strategy, and Endgames. Features dynamic feedback."
                        />
                        <FeatureCard 
                            icon={Shield}
                            title="Stockfish AI"
                            desc="Play against a computer engine that scales difficulty. Useful for offline practice."
                        />
                        <FeatureCard 
                            icon={Users}
                            title="Social Hub"
                            desc="Follow players, challenge friends directly, and discuss strategy in the global forum."
                        />
                        <FeatureCard 
                            icon={Zap}
                            title="Analysis Board"
                            desc="Replay your past matches with step-by-step navigation to identify mistakes."
                        />
                    </div>
                </section>

                {/* FOOTER */}
                <div className="pt-12 border-t border-slate-900 text-center text-slate-500 text-sm">
                    <p>NexusChess Platform Documentation • Version 1.0</p>
                </div>

            </div>
        </div>
    );
};

export default Docs;
