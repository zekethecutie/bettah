
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, EyeOff, Cpu, Zap, Brain, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GameCard = ({ title, desc, icon: Icon, color, onClick, badge }: any) => (
    <motion.button 
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="relative overflow-hidden rounded-3xl p-6 text-left border flex flex-col h-full shadow-xl group transition-all"
        style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}
    >
        <div className={`absolute top-0 right-0 p-32 bg-${color}-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-${color}-500/20 transition-colors`} />
        
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-slate-950/30 border border-white/5 shadow-inner text-${color}-400`}>
            <Icon className="w-8 h-8" />
        </div>
        
        <div className="relative z-10 flex-1">
            <h3 className="text-2xl font-black text-white italic mb-2" style={{ color: 'var(--text-main)' }}>{title}</h3>
            <p className="text-sm font-medium opacity-70 mb-6" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            
            {badge && (
                <span className={`absolute top-0 right-0 text-[10px] font-black uppercase px-2 py-1 rounded-bl-xl bg-${color}-500 text-white shadow-lg`}>
                    {badge}
                </span>
            )}
        </div>

        <div className="mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all" style={{ color: 'var(--primary)' }}>
            Play Now <Play className="w-4 h-4 fill-current" />
        </div>
    </motion.button>
);

const GamesHub = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full h-full p-4 lg:p-8 animate-in fade-in duration-500 pb-28 lg:pb-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2" style={{ color: 'var(--text-main)' }}>ARCADE</h1>
                    <p className="text-lg" style={{ color: 'var(--text-muted)' }}>Test your skills in variant modes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <GameCard 
                        title="Pulse Mode" 
                        desc="3 Minutes. 3 Strikes. Solve endless tactical puzzles against the clock."
                        icon={Activity}
                        color="rose"
                        onClick={() => navigate('/pulse-intro')}
                        badge="Popular"
                    />
                    <GameCard 
                        title="Blindfold" 
                        desc="Test your memory. Pieces disappear from the board after you move."
                        icon={EyeOff}
                        color="purple"
                        onClick={() => alert("Blindfold mode coming soon in next update!")} 
                    />
                    <GameCard 
                        title="Hyper Bullet" 
                        desc="10 seconds on the clock. Pure instinct and speed."
                        icon={Zap}
                        color="amber"
                        onClick={() => navigate('/game')} // Just defaults to regular game for now
                    />
                    <GameCard 
                        title="Stockfish 16" 
                        desc="Challenge the max level engine. Grandmaster difficulty."
                        icon={Cpu}
                        color="emerald"
                        onClick={() => navigate('/game')} // Defaults to computer setup
                    />
                    <GameCard 
                        title="Daily Puzzle" 
                        desc="Solve the featured position of the day."
                        icon={Brain}
                        color="cyan"
                        onClick={() => navigate('/learn')} 
                    />
                </div>
            </div>
        </div>
    );
};

export default GamesHub;
