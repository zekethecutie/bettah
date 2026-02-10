
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Cpu, Users, Zap, Globe, Play, X, Crown, HelpCircle, Flame, Target, GraduationCap, Layers, Activity, Smartphone, Swords, Star, Eye } from 'lucide-react';
import { UserManager } from '../utils/storage';
import { User } from '../types';
import { RookShapeUI, PieceIcons } from '../components/Icons';
import { getLevelTitle, getXpForNextLevel } from '../utils/questSystem';

interface HomeProps {
  onStartGame: (mode: 'human' | 'computer' | 'online' | 'spectator', difficulty?: 'easy' | 'medium' | 'hard', opponent?: User, playerColor?: 'w' | 'b' | 'random') => void;
  onViewProfile?: (user: User) => void;
}

const Home: React.FC<HomeProps> = ({ onStartGame, onViewProfile }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Setup Modal State
  const [showSetup, setShowSetup] = useState(false);
  const [setupConfig, setSetupConfig] = useState<{
      difficulty: 'easy' | 'medium' | 'hard';
      color: 'w' | 'b' | 'random';
  }>({ difficulty: 'medium', color: 'w' });

  useEffect(() => {
    setCurrentUser(UserManager.getCurrentUser());
  }, []);

  const handleOnlineSearch = () => {
      setIsSearching(true);
      setTimeout(() => {
          setIsSearching(false);
          const mockOpponent: User = { 
              id: 'cpu', 
              username: 'GrandmasterGary', 
              elo: 2400, 
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gary', 
              country: '🇷🇺 Russia', 
              bio: '', email: '', joinedDate: '', stats: {wins:0,losses:0,draws:0}, banner: '', followers: [], following: [], level: 50, xp: 0, streak: 100, lastLoginDate: '', activeQuests: [], completedLessons: [],
              coins: 0,
              inventory: { ownedItems: [], equipped: { boardTheme: 'board_classic', pieceSet: 'pieces_standard' } }
          };
          onStartGame('online', undefined, mockOpponent, 'random');
      }, 3000);
  };

  const handleStartComputerGame = () => {
      setShowSetup(false);
      onStartGame('computer', setupConfig.difficulty, undefined, setupConfig.color);
  };

  const MOCK_STREAMS = [
      { id: 's1', p1: 'Hikaru', p2: 'Magnus', viewers: 1240, elo: 2800 },
      { id: 's2', p1: 'Botez', p2: 'Hammer', viewers: 850, elo: 2300 },
  ];
  
  const xpNeeded = currentUser ? getXpForNextLevel(currentUser.level) : 1000;
  const xpProgress = currentUser ? (currentUser.xp / xpNeeded) * 100 : 0;

  return (
    <div className="w-full h-full p-6 lg:p-8 flex flex-col gap-8 animate-in fade-in zoom-in duration-500 relative pb-24 lg:pb-8">
      
      {/* Search Overlay */}
      <AnimatePresence>
          {isSearching && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] backdrop-blur-md flex flex-col items-center justify-center"
                style={{ backgroundColor: 'var(--panel-bg)' }}
              >
                  <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-current animate-spin" style={{ color: 'var(--primary)' }} />
                      <Globe className="absolute inset-0 m-auto w-10 h-10 animate-pulse" style={{ color: 'var(--primary)' }} />
                  </div>
                  <h2 className="text-2xl font-black mt-8 tracking-tighter" style={{ color: 'var(--text-main)' }}>SEARCHING FOR OPPONENT</h2>
                  <p className="font-mono mt-2" style={{ color: 'var(--primary)' }}>ESTIMATED WAIT: 0:03</p>
                  <button onClick={() => setIsSearching(false)} className="mt-8 px-6 py-2 rounded-full border hover:bg-white/10" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Game Setup Modal */}
      <AnimatePresence>
          {showSetup && (
              <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="border p-8 rounded-3xl w-full max-w-md shadow-2xl relative"
                    style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}
                  >
                      <button onClick={() => setShowSetup(false)} className="absolute top-4 right-4 hover:text-white" style={{ color: 'var(--text-muted)' }}><X className="w-5 h-5"/></button>
                      
                      <h2 className="text-2xl font-black mb-6 flex items-center gap-3" style={{ color: 'var(--text-main)' }}>
                          <Cpu className="w-8 h-8" style={{ color: 'var(--primary)' }} /> 
                          VS COMPUTER
                      </h2>

                      <div className="space-y-6">
                          <div className="space-y-3">
                              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Difficulty</label>
                              <div className="grid grid-cols-3 gap-3">
                                  {['easy', 'medium', 'hard'].map((d) => (
                                      <button 
                                        key={d}
                                        onClick={() => setSetupConfig(prev => ({ ...prev, difficulty: d as any }))}
                                        className={`py-3 rounded-xl text-sm font-bold capitalize transition-all border ${
                                            setupConfig.difficulty === d 
                                            ? 'shadow-[0_0_15px_rgba(0,0,0,0.2)]' 
                                            : 'hover:bg-white/5'
                                        }`}
                                        style={{ 
                                            backgroundColor: setupConfig.difficulty === d ? 'var(--primary-dim)' : 'var(--element-bg)',
                                            color: setupConfig.difficulty === d ? 'var(--primary)' : 'var(--text-muted)',
                                            borderColor: setupConfig.difficulty === d ? 'var(--primary)' : 'var(--border-color)'
                                        }}
                                      >
                                          {d}
                                      </button>
                                  ))}
                              </div>
                          </div>

                          <div className="space-y-3">
                              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>I want to play as</label>
                              <div className="grid grid-cols-3 gap-3">
                                  <button onClick={() => setSetupConfig(prev => ({ ...prev, color: 'w' }))} className={`py-4 rounded-xl flex items-center justify-center transition-all ${setupConfig.color === 'w' ? 'bg-slate-200 text-slate-900 ring-2' : 'bg-slate-800 text-slate-400'}`} style={{ '--tw-ring-color': 'var(--primary)' } as React.CSSProperties}> <Crown className="w-6 h-6 fill-current" /> </button>
                                  <button onClick={() => setSetupConfig(prev => ({ ...prev, color: 'random' }))} className={`py-4 rounded-xl flex items-center justify-center transition-all ${setupConfig.color === 'random' ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-white ring-2' : 'bg-slate-800 text-slate-400'}`} style={{ '--tw-ring-color': 'var(--primary)' } as React.CSSProperties}> <HelpCircle className="w-6 h-6" /> </button>
                                  <button onClick={() => setSetupConfig(prev => ({ ...prev, color: 'b' }))} className={`py-4 rounded-xl flex items-center justify-center transition-all ${setupConfig.color === 'b' ? 'bg-slate-950 text-slate-200 ring-2' : 'bg-slate-800 text-slate-400'}`} style={{ '--tw-ring-color': 'var(--primary)' } as React.CSSProperties}> <Crown className="w-6 h-6 fill-current" /> </button>
                              </div>
                          </div>

                          <button onClick={handleStartComputerGame} className="w-full py-4 text-white font-bold text-lg rounded-2xl shadow-lg transition-all transform hover:scale-[1.02]" style={{ backgroundColor: 'var(--primary)' }}>
                              Start Match
                          </button>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      {/* Hero / Branding */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-4">
         <div className="space-y-4">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl shadow-lg">
                    <RookShapeUI className="w-8 h-8 text-white fill-current" />
                </div>
                <div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tighter" style={{ color: 'var(--text-main)' }}>
                        NEXUS<span style={{ color: 'var(--primary)' }}>CHESS</span>
                    </h1>
                </div>
            </motion.div>
         </div>

         {/* Stats Bar */}
         <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             {currentUser && (
                 <>
                    <div className="p-4 border rounded-xl text-center min-w-[100px] flex-1 md:flex-none" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
                        <p className="text-xs uppercase font-bold mb-1 flex items-center justify-center gap-1" style={{ color: 'var(--text-muted)' }}>
                            Streak <Flame className="w-3 h-3 text-orange-500" />
                        </p>
                        <p className="text-xl font-mono font-bold text-orange-400">{currentUser.streak}</p>
                    </div>
                    <div className="p-4 border rounded-xl text-center min-w-[160px] flex-1 md:flex-none" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
                        <div className="flex justify-between items-center text-xs uppercase font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
                            <span>Lvl {currentUser.level}</span>
                            <span className="truncate max-w-[80px]">{getLevelTitle(currentUser.level)}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} className="h-full" style={{ backgroundColor: 'var(--primary)' }} />
                        </div>
                        <p className="text-[10px] text-right mt-1" style={{ color: 'var(--text-muted)' }}>{currentUser.xp} / {xpNeeded} XP</p>
                    </div>
                 </>
             )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
         
         {/* Main Actions */}
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
                <button 
                    onClick={() => setShowSetup(true)}
                    className="col-span-1 p-6 md:p-8 border rounded-3xl flex flex-row md:flex-col items-center md:items-start gap-4 group transition-all shadow-xl"
                    style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}
                >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0" style={{ backgroundColor: 'var(--element-bg)' }}>
                        <Cpu className="w-6 h-6 md:w-8 md:h-8" style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="text-left">
                        <h3 className="text-xl md:text-2xl font-black mb-1" style={{ color: 'var(--text-main)' }}>VS COMPUTER</h3>
                        <p className="text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>Adaptive engine difficulty.</p>
                    </div>
                </button>

                <button 
                    onClick={() => onStartGame('human')}
                    className="col-span-1 p-6 md:p-8 border rounded-3xl flex flex-row md:flex-col items-center md:items-start gap-4 group transition-all shadow-xl"
                    style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}
                >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0" style={{ backgroundColor: 'var(--element-bg)' }}>
                        <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-xl md:text-2xl font-black mb-1" style={{ color: 'var(--text-main)' }}>LOCAL DUEL</h3>
                        <p className="text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>Play on same device.</p>
                    </div>
                </button>

                {/* PLAY ONLINE */}
                <div className="col-span-1 md:col-span-2 p-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    <button 
                        onClick={handleOnlineSearch}
                        className="w-full h-full p-6 md:p-8 rounded-[22px] flex flex-col md:flex-row items-start md:items-center justify-between group hover:brightness-110 transition-all relative overflow-hidden gap-4"
                        style={{ backgroundColor: 'var(--panel-bg)' }}
                    >
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="p-3 md:p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--primary)' }}>
                                <Zap className="w-6 h-6 md:w-8 md:h-8 text-white fill-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">PLAY ONLINE</h3>
                                <p className="text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>Ranked Matchmaking • Global</p>
                            </div>
                        </div>
                        <div className="relative z-10 w-full md:w-auto px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl group-hover:scale-105 transition-transform flex items-center justify-center gap-2">
                             Find Match <Globe className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Daily Quests Dashboard */}
            {currentUser && (
                <div className="border rounded-3xl p-6" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
                     <div className="flex items-center gap-3 mb-4">
                         <Target className="w-5 h-5 text-emerald-400" />
                         <h3 className="font-black tracking-wide uppercase" style={{ color: 'var(--text-main)' }}>Daily Quests</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {currentUser.activeQuests.map((quest) => (
                             <div 
                                key={quest.id}
                                className={`p-4 rounded-xl border flex flex-col justify-between relative overflow-hidden ${
                                    quest.completed 
                                    ? 'bg-emerald-900/20 border-emerald-500/30' 
                                    : ''
                                }`}
                                style={!quest.completed ? { backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)' } : {}}
                             >
                                 <div className="relative z-10">
                                     <h4 className={`font-bold text-sm mb-1 ${quest.completed ? 'text-emerald-400' : 'text-white'}`}>{quest.title}</h4>
                                     <p className="text-[10px] mb-3" style={{ color: 'var(--text-muted)' }}>{quest.description}</p>
                                     <div className="flex items-center justify-between text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                                         <span>{quest.progress} / {quest.target}</span>
                                         <span className="flex items-center gap-1 text-amber-400"><Star className="w-3 h-3 fill-current" /> +{quest.rewardXp}</span>
                                     </div>
                                     <div className="w-full h-1.5 bg-slate-900 rounded-full mt-2 overflow-hidden">
                                         <div 
                                            className={`h-full ${quest.completed ? 'bg-emerald-500' : ''}`} 
                                            style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%`, backgroundColor: !quest.completed ? 'var(--primary)' : undefined }} 
                                         />
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            )}
         </div>

         {/* Right Column */}
         <div className="space-y-6">
             <div className="border rounded-3xl p-6" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Live Now</h3>
                </div>
                <div className="space-y-4">
                    {MOCK_STREAMS.map(s => (
                        <button 
                            key={s.id}
                            onClick={() => onStartGame('spectator')}
                            className="w-full border p-4 rounded-2xl flex items-center justify-between transition-all group hover:brightness-110"
                            style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)' }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                                    <Play className="w-4 h-4 text-white fill-current" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{s.p1} vs {s.p2}</p>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Rated {s.elo} • Blitz</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-red-400 text-xs font-bold bg-red-950/30 px-2 py-1 rounded">
                                <Eye className="w-3 h-3" /> {s.viewers}
                            </div>
                        </button>
                    ))}
                </div>
             </div>
             
             <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-8 text-center">
                 <Swords className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-white mb-2">Join a Tournament</h3>
                 <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Weekly blitz arena starts in 2 hours.</p>
                 <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-sm">Register Now</button>
             </div>
         </div>

      </div>
    </div>
  );
};

export default Home;