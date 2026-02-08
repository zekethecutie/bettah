import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Lock, ArrowRight, Mail, Globe, Sparkles, Check } from 'lucide-react';
import { UserManager } from '../utils/storage';
import { User } from '../types';
import { COUNTRIES } from '../utils/countries';

interface AuthProps {
  onLogin: (user: User) => void;
}

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Grandmaster'];

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'auth' | 'details' | 'experience'>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      country: 'International',
      countryFlag: '🌍',
      bio: '',
      level: 'Beginner'
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate check
    setTimeout(async () => {
        setLoading(false);
        if (isLogin) {
            // If login, just go in
            const user = await UserManager.login(formData.username);
            onLogin(user);
        } else {
            // If signup, go to next step
            setStep('details');
        }
    }, 800);
  };

  const handleFinalSubmit = () => {
      setLoading(true);
      setTimeout(async () => {
        const user = await UserManager.login(formData.username, {
            country: `${formData.countryFlag} ${formData.country}`,
            bio: formData.bio || `A ${formData.level} chess enthusiast.`
        });
        onLogin(user);
      }, 1000);
  };

  const updateForm = (key: string, value: string) => {
      setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center relative overflow-hidden bg-[#020617]">
       {/* Background Effects */}
       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
       <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '7s' }} />

       <AnimatePresence mode="wait">
        {step === 'auth' && (
           <motion.div 
             key="auth"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, x: -50 }}
             className="w-full max-w-md p-8 rounded-3xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-xl shadow-2xl relative z-10"
           >
              <div className="text-center mb-8">
                 <h2 className="text-3xl font-black text-white tracking-tighter mb-2">
                    {isLogin ? 'WELCOME BACK' : 'JOIN THE ELITE'}
                 </h2>
                 <p className="text-slate-400 text-sm">
                    {isLogin ? 'Enter the arena.' : 'Create your legacy.'}
                 </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Username</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                        <input 
                            type="text" 
                            value={formData.username}
                            onChange={(e) => updateForm('username', e.target.value)}
                            placeholder="Grandmaster..."
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            required
                        />
                    </div>
                 </div>

                 {!isLogin && (
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => updateForm('email', e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                     </div>
                 )}

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                        <input 
                            type="password" 
                            value={formData.password}
                            onChange={(e) => updateForm('password', e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                 </div>

                 <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 group mt-4"
                 >
                    {loading ? (
                        <span className="animate-pulse">Processing...</span>
                    ) : (
                        <>
                            {isLogin ? 'Sign In' : 'Continue'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                 </button>
              </form>

              <div className="mt-6 text-center">
                 <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                 >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                 </button>
              </div>
           </motion.div>
        )}

        {step === 'details' && (
             <motion.div 
             key="details"
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -50 }}
             className="w-full max-w-md p-8 rounded-3xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-xl shadow-2xl relative z-10"
           >
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-white tracking-tighter mb-2">WHO ARE YOU?</h2>
                    <p className="text-slate-400 text-sm">Tell the world your story.</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Country</label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <select 
                                value={`${formData.country}`}
                                onChange={(e) => {
                                    const selected = COUNTRIES.find(c => c.name === e.target.value);
                                    if(selected) {
                                        setFormData(prev => ({...prev, country: selected.name, countryFlag: selected.flag}));
                                    }
                                }}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
                            >
                                {COUNTRIES.map(c => (
                                    <option key={c.code} value={c.name}>
                                        {c.flag} {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Bio (Optional)</label>
                        <textarea 
                            value={formData.bio}
                            onChange={(e) => updateForm('bio', e.target.value)}
                            placeholder="I love the Sicilian Defense..."
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors h-24 resize-none"
                        />
                    </div>
                    
                    <button 
                        onClick={() => setStep('experience')}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 group mt-4"
                    >
                        Next Step
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
           </motion.div>
        )}

        {step === 'experience' && (
             <motion.div 
             key="experience"
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 50 }}
             className="w-full max-w-md p-8 rounded-3xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-xl shadow-2xl relative z-10"
           >
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-white tracking-tighter mb-2">EXPERIENCE LEVEL</h2>
                    <p className="text-slate-400 text-sm">Help us match you correctly.</p>
                </div>

                <div className="space-y-3 mb-8">
                    {LEVELS.map((level) => (
                        <button
                            key={level}
                            onClick={() => updateForm('level', level)}
                            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                                formData.level === level 
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-600'
                            }`}
                        >
                            <span className="font-bold">{level}</span>
                            {formData.level === level && <Check className="w-5 h-5" />}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 group"
                >
                    {loading ? (
                        <span className="animate-pulse">Creating Account...</span>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Finish Setup
                        </>
                    )}
                </button>
           </motion.div>
        )}

       </AnimatePresence>
    </div>
  );
};

export default Auth;