
import React, { useState, useEffect } from 'react';
import { Swords, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pages & Components
import Auth from './pages/Auth';
import Navigation from './components/Navigation';
import Profile from './pages/Profile';
import Social from './pages/Social';
import GamePage from './pages/GamePage';
import Home from './pages/Home';
import PostView from './pages/PostView';
import Legal from './pages/Legal';
import Notifications from './pages/Notifications';
import ChatDrawer from './components/ChatDrawer';
import Landing from './pages/Landing'; 
import Learn from './pages/Learn'; 
import Leaderboard from './pages/Leaderboard'; 
import Docs from './pages/Docs'; // New Page
import { UserManager } from './utils/storage';
import { User, Friend, MatchRecord } from './types';

// Global Styles & Defs
const GlobalChessDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute', top: -9999, left: -9999, visibility: 'hidden' }}>
    <defs>
       <linearGradient id="chess-grad-w" x1="20%" y1="20%" x2="80%" y2="80%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#94a3b8" />
       </linearGradient>
       <filter id="chess-shadow-w" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
          <feSpecularLighting surfaceScale="5" specularConstant="1" specularExponent="20" lightingColor="#ffffff" result="spec">
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="spec" />
          <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
       </filter>

       <linearGradient id="chess-grad-b" x1="20%" y1="20%" x2="80%" y2="80%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#020617" />
       </linearGradient>
       <filter id="chess-shadow-b" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.6)" />
          <feSpecularLighting surfaceScale="3" specularConstant="0.5" specularExponent="15" lightingColor="#cbd5e1" result="spec">
             <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="spec" />
          <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" />
       </filter>
    </defs>
  </svg>
);

type Screen = 'landing' | 'auth' | 'home' | 'game' | 'profile' | 'social' | 'post_view' | 'notifications' | 'rules' | 'privacy' | 'terms' | 'learn' | 'leaderboard' | 'docs';

function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [user, setUser] = useState<any>(null);
  
  // Navigation State
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  
  // Chat State
  const [activeChatFriend, setActiveChatFriend] = useState<Friend | null>(null);

  // Game Config State
  const [gameConfig, setGameConfig] = useState<{
      mode: 'human' | 'computer' | 'replay' | 'online' | 'spectator';
      difficulty?: 'easy' | 'medium' | 'hard';
      replayMatch?: MatchRecord;
      opponent?: User;
      playerColor?: 'w' | 'b' | 'random';
  }>({ mode: 'human' });

  // Init Auth Check
  useEffect(() => {
    const currentUser = UserManager.getCurrentUser();
    if (currentUser) {
        setUser(currentUser);
        setScreen('home');
    }
  }, []);

  const handleLogin = (u: any) => {
    setUser(u);
    setScreen('home');
  };

  const handleLogout = () => {
    UserManager.logout();
    setUser(null);
    setScreen('landing');
  };

  const startGame = (
      mode: 'human' | 'computer' | 'online' | 'spectator', 
      difficulty?: 'easy' | 'medium' | 'hard', 
      opponent?: User,
      playerColor: 'w' | 'b' | 'random' = 'w'
  ) => {
      setGameConfig({ mode, difficulty, opponent, playerColor });
      setScreen('game');
  };

  const startReplay = (match: MatchRecord) => {
      setGameConfig({ mode: 'replay', replayMatch: match });
      setScreen('game');
  };

  const viewPost = (postId: string) => {
      setCurrentPostId(postId);
      setScreen('post_view');
  };

  const handleViewProfile = (targetUser: User) => {
      // If viewing self, ensure we use fresh data from storage to avoid stale state
      if (targetUser.id === user?.id) {
          handleMyProfile();
      } else {
          setViewedUser(targetUser);
          setScreen('profile');
      }
  };

  const handleMyProfile = () => {
      setViewedUser(null); // Null implies current user
      setScreen('profile');
  };

  const handleAcceptInvite = (opponent: User) => {
      // Direct access to Game with Online mode
      startGame('online', undefined, opponent, 'random');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden relative font-sans selection:bg-cyan-500/30">
      <GlobalChessDefs />

      {/* Ambient Background - only show if not in landing (Landing has its own) */}
      {screen !== 'landing' && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-900/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-cyan-900/10 rounded-full blur-[120px]" />
        </div>
      )}

      {screen === 'landing' ? (
          <Landing 
            onGetStarted={() => setScreen('auth')}
            onSignIn={() => setScreen('auth')} 
          />
      ) : screen === 'auth' ? (
          <Auth onLogin={handleLogin} />
      ) : (
          <>
            {/* Sidebar Navigation - Hidden on Game Screen for focus */}
            {screen !== 'game' && (
                <Navigation 
                    currentScreen={screen === 'post_view' ? 'social' : screen} 
                    setScreen={(s: Screen) => {
                        if (s === 'profile') handleMyProfile();
                        else setScreen(s);
                    }} 
                    onLogout={handleLogout}
                    user={user}
                />
            )}

            {/* Main Content Area */}
            <main className={`flex-1 relative z-10 h-screen overflow-y-auto ${screen !== 'game' ? 'lg:pl-64' : ''}`}>
                <AnimatePresence mode="wait">
                    {screen === 'home' && (
                        <motion.div 
                            key="home"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full h-full"
                        >
                            <Home onStartGame={startGame} onViewProfile={handleViewProfile} />
                        </motion.div>
                    )}

                    {screen === 'learn' && (
                        <motion.div 
                            key="learn"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full h-full"
                        >
                            <Learn />
                        </motion.div>
                    )}

                    {screen === 'leaderboard' && (
                        <motion.div 
                            key="leaderboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full h-full"
                        >
                            <Leaderboard onViewProfile={handleViewProfile} />
                        </motion.div>
                    )}

                    {screen === 'docs' && (
                        <motion.div 
                            key="docs"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full h-full"
                        >
                            <Docs />
                        </motion.div>
                    )}

                    {screen === 'profile' && user && (
                        <motion.div key="profile" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                            <Profile 
                                user={viewedUser || user} 
                                isCurrentUser={!viewedUser || viewedUser.id === user.id}
                                onReplayGame={startReplay} 
                            />
                        </motion.div>
                    )}

                    {screen === 'notifications' && (
                        <motion.div key="notifications" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                            <Notifications onAcceptGame={handleAcceptInvite} />
                        </motion.div>
                    )}

                    {screen === 'social' && (
                        <motion.div key="social" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                            <Social 
                                onViewPost={viewPost} 
                                onChatStart={(friend) => setActiveChatFriend(friend)} 
                                onViewProfile={handleViewProfile}
                            />
                        </motion.div>
                    )}

                    {screen === 'post_view' && currentPostId && (
                        <motion.div key="post_view" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 20}}>
                            <PostView postId={currentPostId} onBack={() => setScreen('social')} />
                        </motion.div>
                    )}

                    {screen === 'game' && (
                        <motion.div key="game" className="h-full" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                            <GamePage 
                                gameMode={gameConfig.mode} 
                                difficulty={gameConfig.difficulty}
                                replayMatch={gameConfig.replayMatch}
                                opponent={gameConfig.opponent}
                                playerColor={gameConfig.playerColor}
                                onExit={() => setScreen('home')}
                            />
                        </motion.div>
                    )}

                    {/* Legal Pages */}
                    {(screen === 'rules' || screen === 'privacy' || screen === 'terms') && (
                        <motion.div key="legal" className="h-full" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                           <Legal section={screen} onBack={() => setScreen('home')} />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Footer Links (Only on Home) */}
                {screen === 'home' && (
                    <div className="absolute bottom-4 right-8 flex gap-4 text-xs text-slate-600">
                        <button onClick={() => setScreen('rules')} className="hover:text-cyan-400">Rules</button>
                        <button onClick={() => setScreen('privacy')} className="hover:text-cyan-400">Privacy</button>
                        <button onClick={() => setScreen('terms')} className="hover:text-cyan-400">Terms</button>
                    </div>
                )}
            </main>

            {/* Chat Drawer Overlay */}
            <ChatDrawer 
                friend={activeChatFriend} 
                onClose={() => setActiveChatFriend(null)} 
            />

          </>
      )}
    </div>
  );
}

export default App;
