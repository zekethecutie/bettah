
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Cpu, Globe, Shield, Zap, Layout, BarChart3, Users, Play, Target, GraduationCap, Layers, Activity, Smartphone } from 'lucide-react';
import { RookShapeUI, PieceIcons } from '../components/Icons';

interface LandingProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all group"
  >
    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-cyan-500/50 transition-all shadow-lg">
      <Icon className="w-6 h-6 text-cyan-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const Landing: React.FC<LandingProps> = ({ onGetStarted, onSignIn }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  
  const [activePiece, setActivePiece] = useState(0);
  
  useEffect(() => {
      const interval = setInterval(() => {
          setActivePiece(prev => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(interval);
  }, []);

  const demoPieces = [
      { id: 'k', Icon: PieceIcons['k'], label: 'Master Strategy' },
      { id: 'q', Icon: PieceIcons['q'], label: 'Unlimited Power' },
      { id: 'n', Icon: PieceIcons['n'], label: 'Dynamic Moves' },
      { id: 'r', Icon: PieceIcons['r'], label: 'Solid Defense' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-cyan-500/30">
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-[#020617] to-transparent pointer-events-none">
            <div className="flex items-center gap-3 pointer-events-auto">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <RookShapeUI className="w-6 h-6 text-white fill-current" />
                </div>
                <span className="text-xl font-black tracking-tighter hidden md:block">NEXUS<span className="text-cyan-400">CHESS</span></span>
            </div>
            <div className="flex gap-4 pointer-events-auto">
                <button onClick={onSignIn} className="px-6 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors">Sign In</button>
                <button onClick={onGetStarted} className="px-6 py-2.5 bg-white text-slate-950 text-sm font-bold rounded-full hover:bg-cyan-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Create Account
                </button>
            </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-cyan-600/10 rounded-full blur-[120px]" />
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-700/50 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            Next Gen Chess Platform
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
                            MASTER <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">THE BOARD</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                            Experience chess like never before. Real-time analysis, stunning visuals, and a global community of grandmasters in the making.
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button 
                            onClick={onGetStarted}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all group"
                        >
                            Start Playing Now
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                            onClick={onSignIn}
                            className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Existing User
                        </button>
                    </motion.div>

                    <div className="pt-8 flex items-center gap-8 text-slate-500">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 55}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <p className="text-white font-bold">10k+ Active Players</p>
                            <p>Join the fastest growing community</p>
                        </div>
                    </div>
                </div>

                <div className="relative h-[600px] hidden lg:block">
                    {/* Floating Abstract Board */}
                    <motion.div style={{ y: y1 }} className="absolute right-0 top-0 w-full h-full">
                         <div className="relative w-full h-full perspective-1000">
                             <motion.div 
                                animate={{ rotateX: 20, rotateY: -20, rotateZ: 5 }}
                                className="w-[500px] h-[500px] bg-slate-900/40 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl absolute right-10 top-20 grid grid-cols-8 grid-rows-8 overflow-hidden"
                             >
                                 {/* Mock Grid */}
                                 {Array.from({length: 64}).map((_, i) => (
                                     <div key={i} className={`w-full h-full ${((Math.floor(i/8) + i%8) % 2 === 1) ? 'bg-slate-950/50' : 'bg-transparent'}`} />
                                 ))}
                                 
                                 {/* Floating Main Piece */}
                                 <motion.div 
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                 >
                                    <div className="w-64 h-64 drop-shadow-[0_20px_50px_rgba(34,211,238,0.4)]">
                                        {React.createElement(demoPieces[activePiece].Icon, { color: 'w', className: "w-full h-full" })}
                                    </div>
                                 </motion.div>
                             </motion.div>
                             
                             {/* Floating Cards */}
                             <motion.div 
                                style={{ y: y2 }}
                                className="absolute -left-10 bottom-40 bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-xl flex items-center gap-4 w-64"
                             >
                                 <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                                     <Zap className="w-6 h-6" />
                                 </div>
                                 <div>
                                     <p className="text-xs text-slate-500 font-bold uppercase">Game Analysis</p>
                                     <p className="text-white font-bold">Brilliant Move!</p>
                                 </div>
                             </motion.div>

                             <motion.div 
                                style={{ y: y1 }}
                                className="absolute -right-4 top-40 bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-xl flex items-center gap-4 w-56"
                             >
                                 <div className="w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center text-rose-400">
                                     <Users className="w-6 h-6" />
                                 </div>
                                 <div>
                                     <p className="text-xs text-slate-500 font-bold uppercase">Live Match</p>
                                     <p className="text-white font-bold">Magnus vs Hikaru</p>
                                 </div>
                             </motion.div>
                         </div>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 relative z-10 bg-[#020617]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">BUILT FOR <span className="text-cyan-400">VICTORY</span></h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Whether you're a beginner learning the ropes or a grandmaster refining your opening repertoire, NexusChess provides the ultimate environment.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard 
                        icon={Target}
                        title="Daily Quests"
                        desc="Earn XP and build streaks by completing daily challenges tailored to your skill level from 1-100."
                        delay={0.1}
                    />
                    <FeatureCard 
                        icon={GraduationCap}
                        title="Nexus Academy"
                        desc="Interactive lessons for tactics, openings, and endgames. Learn by doing, not just watching."
                        delay={0.2}
                    />
                    <FeatureCard 
                        icon={Cpu}
                        title="Advanced AI"
                        desc="Practice against our adaptive Stockfish-powered engine that learns from your mistakes."
                        delay={0.3}
                    />
                    <FeatureCard 
                        icon={Globe}
                        title="Global Ranked"
                        desc="Connect instantly with players from around the world. Climb the ELO ladder."
                        delay={0.4}
                    />
                </div>
            </div>
        </section>

        {/* How it Works Section */}
        <section className="py-24 bg-slate-900/30 border-y border-slate-900">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase mb-6">How it Works</div>
                        <h2 className="text-4xl font-black text-white mb-6">YOUR PATH TO MASTERY</h2>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 font-bold text-lg text-white">1</div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Create Your Profile</h4>
                                    <p className="text-slate-400 text-sm">Choose your avatar, set your skill level, and join the global leaderboard instantly.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 font-bold text-lg text-white">2</div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Complete Quests & Lessons</h4>
                                    <p className="text-slate-400 text-sm">Engage with daily tasks generated by our algorithm. Learn tactics through interactive puzzles.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 font-bold text-lg text-white">3</div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Climb the Ranks</h4>
                                    <p className="text-slate-400 text-sm">Earn XP, level up from Novice to Legend, and showcase your achievements.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full" />
                        <div className="relative grid grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl transform translate-y-8">
                                <Activity className="w-8 h-8 text-emerald-400 mb-4" />
                                <h4 className="font-bold text-white mb-1">Real-time Analytics</h4>
                                <p className="text-xs text-slate-500">Track your ELO progression and accuracy.</p>
                            </div>
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
                                <Layers className="w-8 h-8 text-cyan-400 mb-4" />
                                <h4 className="font-bold text-white mb-1">Depth of Strategy</h4>
                                <p className="text-xs text-slate-500">Analyze moves with Stockfish integration.</p>
                            </div>
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl transform translate-y-8">
                                <Smartphone className="w-8 h-8 text-rose-400 mb-4" />
                                <h4 className="font-bold text-white mb-1">Mobile First</h4>
                                <p className="text-xs text-slate-500">Play seamlessly on any device.</p>
                            </div>
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
                                <Globe className="w-8 h-8 text-amber-400 mb-4" />
                                <h4 className="font-bold text-white mb-1">Global Community</h4>
                                <p className="text-xs text-slate-500">Forums, chats, and social features.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Learning Path Preview */}
        <section className="py-24 bg-gradient-to-b from-[#020617] to-slate-950">
             <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                 <div>
                     <h2 className="text-4xl font-black text-white mb-6">THE MASTERY PATH</h2>
                     <p className="text-slate-400 mb-8 leading-relaxed">
                         Our proprietary learning algorithm generates endless tactical puzzles and scenarios. From simple pins to complex grandmaster sacrifices, 
                         NexusChess tracks your progress and adapts the curriculum.
                     </p>
                     <div className="space-y-4">
                         {['Dynamic Difficulty Scaling', 'Instant Visual Feedback', 'Endless Generated Tasks'].map((item, i) => (
                             <div key={i} className="flex items-center gap-3">
                                 <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                     <Zap className="w-3 h-3" />
                                 </div>
                                 <span className="font-bold text-white">{item}</span>
                             </div>
                         ))}
                     </div>
                 </div>
                 <div className="relative">
                     <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />
                     <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                         <div className="flex justify-between items-center mb-6">
                             <div className="flex gap-2">
                                 <div className="w-3 h-3 rounded-full bg-red-500" />
                                 <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                 <div className="w-3 h-3 rounded-full bg-green-500" />
                             </div>
                             <span className="text-xs font-bold text-slate-500">ACADEMY PREVIEW</span>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                                 <h4 className="font-bold text-white text-lg">The Fork</h4>
                                 <p className="text-xs text-slate-400 mb-2">Tactics • Intermediate</p>
                                 <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                                     <div className="w-3/4 h-full bg-cyan-400" />
                                 </div>
                             </div>
                             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 opacity-50">
                                 <h4 className="font-bold text-white text-lg">Queen Sac</h4>
                                 <p className="text-xs text-slate-400 mb-2">Tactics • Expert</p>
                                 <div className="w-full h-1 bg-slate-700 rounded-full" />
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-blue-900/20" />
            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                    READY TO MAKE YOUR MOVE?
                </h2>
                <button 
                    onClick={onGetStarted}
                    className="px-10 py-5 bg-white text-slate-900 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                >
                    Join NexusChess Today
                </button>
            </div>
        </section>
        
        {/* Footer */}
        <footer className="border-t border-slate-900 py-12 bg-[#01030d]">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-50 text-sm">
                <div className="flex items-center gap-2">
                    <RookShapeUI className="w-5 h-5" />
                    <span className="font-bold">© 2024 NexusChess Inc.</span>
                </div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white">Privacy</a>
                    <a href="#" className="hover:text-white">Terms</a>
                    <a href="#" className="hover:text-white">Contact</a>
                </div>
            </div>
        </footer>

    </div>
  );
};

export default Landing;
