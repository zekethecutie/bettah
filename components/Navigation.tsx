
import React, { useEffect, useState } from 'react';
import { Home, User, Users, LogOut, Bell, GraduationCap, Trophy, Book } from 'lucide-react';
import { motion } from 'framer-motion';
import { RookShapeUI } from './Icons';
import { UserManager } from '../utils/storage';

interface NavigationProps {
  currentScreen: string;
  setScreen: (s: any) => void;
  onLogout: () => void;
  user: any;
}

const NavItem = ({ icon: Icon, label, isActive, onClick, isMobile = false, badge = 0 }: any) => (
  <button
    onClick={onClick}
    className={isMobile 
        ? `flex flex-col items-center justify-center p-2 rounded-xl transition-all relative ${isActive ? 'text-cyan-400' : 'text-slate-500'}`
        : `w-full p-3 rounded-xl flex items-center gap-4 transition-all duration-300 group relative overflow-hidden ${
            isActive ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`
    }
  >
    {!isMobile && isActive && (
        <motion.div 
            layoutId="nav-active"
            className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full"
        />
    )}
    <div className="relative">
        <Icon className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} ${isActive ? 'text-cyan-400' : ''}`} />
        {badge > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
                {badge > 9 ? '9+' : badge}
            </span>
        )}
    </div>
    {isMobile ? (
        <span className="text-[10px] font-bold mt-1">{label}</span>
    ) : (
        <div className="flex-1 flex justify-between items-center">
             <span className="font-medium text-sm tracking-wide">{label}</span>
             {badge > 0 && (
                 <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
             )}
        </div>
    )}
  </button>
);

const Navigation: React.FC<NavigationProps> = ({ currentScreen, setScreen, onLogout, user }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
      const checkNotifs = () => {
          const notifs = UserManager.getNotifications();
          setUnreadCount(notifs.filter(n => !n.read).length);
      };
      
      checkNotifs();
      // Listen for local storage updates to sync badge
      window.addEventListener('storage', checkNotifs);
      return () => window.removeEventListener('storage', checkNotifs);
  }, []);

  return (
    <>
        {/* Desktop Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden lg:flex flex-col w-64 h-screen bg-[#020617]/80 backdrop-blur-xl border-r border-slate-800/50 p-6 z-50 fixed left-0 top-0"
        >
          <div className="flex items-center gap-3 mb-10 px-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg p-1">
                <RookShapeUI className="w-5 h-5 text-white fill-current" />
             </div>
             <h1 className="text-xl font-black tracking-tighter text-white">
                NEXUS<span className="text-cyan-400">CHESS</span>
             </h1>
          </div>

          <div className="space-y-2 flex-1">
            <NavItem icon={Home} label="Home" isActive={currentScreen === 'home'} onClick={() => setScreen('home')} />
            <NavItem icon={GraduationCap} label="Academy" isActive={currentScreen === 'learn'} onClick={() => setScreen('learn')} />
            <NavItem icon={Trophy} label="Leaderboard" isActive={currentScreen === 'leaderboard'} onClick={() => setScreen('leaderboard')} />
            <NavItem icon={Book} label="Guide" isActive={currentScreen === 'docs'} onClick={() => setScreen('docs')} />
            <NavItem icon={Bell} label="Notifications" isActive={currentScreen === 'notifications'} onClick={() => setScreen('notifications')} badge={unreadCount} />
            <NavItem icon={User} label="Profile" isActive={currentScreen === 'profile'} onClick={() => setScreen('profile')} />
            <NavItem icon={Users} label="Community" isActive={currentScreen === 'social'} onClick={() => setScreen('social')} />
          </div>

          <div className="mt-auto pt-6 border-t border-slate-800/50 space-y-4">
            <div 
              onClick={() => setScreen('profile')}
              className="flex items-center gap-3 px-3 py-2 bg-slate-900/50 rounded-xl border border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors"
            >
                <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-full bg-slate-800" />
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{user?.username}</p>
                    <p className="text-xs text-slate-500 truncate">Lvl {user?.level || 1} • {user?.streak || 0} 🔥</p>
                </div>
            </div>
            
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-rose-400 transition-colors text-sm font-medium">
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Mobile Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#020617]/90 backdrop-blur-xl border-t border-slate-800 z-50 flex items-center justify-around px-2">
             <NavItem isMobile icon={Home} label="Home" isActive={currentScreen === 'home'} onClick={() => setScreen('home')} />
             <NavItem isMobile icon={GraduationCap} label="Learn" isActive={currentScreen === 'learn'} onClick={() => setScreen('learn')} />
             <NavItem isMobile icon={Trophy} label="Rank" isActive={currentScreen === 'leaderboard'} onClick={() => setScreen('leaderboard')} />
             <NavItem isMobile icon={User} label="Profile" isActive={currentScreen === 'profile'} onClick={() => setScreen('profile')} />
        </div>
    </>
  );
};

export default Navigation;
