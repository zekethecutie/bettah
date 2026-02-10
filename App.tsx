
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

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
import Docs from './pages/Docs'; 
import Shop from './pages/Shop';
import Pulse from './pages/Pulse';

import { UserManager } from './utils/storage';
import { User, Friend, MatchRecord } from './types';
import { getItem } from './utils/shopData';

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

// Wrapper for screens to apply consistent layout
const ScreenWrapper = ({ children, noPadding = false }: { children?: React.ReactNode, noPadding?: boolean }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`w-full h-full ${noPadding ? '' : ''}`}
    >
        {children}
    </motion.div>
);

const AppContent = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Interaction State
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [activeChatFriend, setActiveChatFriend] = useState<Friend | null>(null);

  // Game Config State
  const [gameConfig, setGameConfig] = useState<{
      mode: 'human' | 'computer' | 'replay' | 'online' | 'spectator';
      difficulty?: 'easy' | 'medium' | 'hard';
      replayMatch?: MatchRecord;
      opponent?: User;
      playerColor?: 'w' | 'b' | 'random';
  }>({ mode: 'human' });

  // Theme Config
  const [themeConfig, setThemeConfig] = useState<any>({});

  // Init Auth Check
  useEffect(() => {
    const currentUser = UserManager.getCurrentUser();
    if (currentUser) {
        setUser(currentUser);
        // Redirect to home if on landing or auth page while logged in
        if (location.pathname === '/' || location.pathname === '/auth') {
            navigate('/home');
        }
    }
  }, []); 

  // Watch for theme changes and apply global variables
  useEffect(() => {
      if (user && user.inventory?.equipped?.boardTheme) {
          const item = getItem(user.inventory.equipped.boardTheme);
          if (item && item.config) {
              setThemeConfig(item.config);
          }
      }
  }, [user?.inventory?.equipped?.boardTheme]);

  const handleLogin = (u: any) => {
    setUser(u);
    navigate('/home');
  };

  const handleLogout = () => {
    UserManager.logout();
    setUser(null);
    navigate('/');
  };

  const startGame = (
      mode: 'human' | 'computer' | 'online' | 'spectator', 
      difficulty?: 'easy' | 'medium' | 'hard', 
      opponent?: User,
      playerColor: 'w' | 'b' | 'random' = 'w'
  ) => {
      setGameConfig({ mode, difficulty, opponent, playerColor });
      navigate('/game');
  };

  const startReplay = (match: MatchRecord) => {
      setGameConfig({ mode: 'replay', replayMatch: match });
      navigate('/game');
  };

  const handleViewProfile = (targetUser: User) => {
      if (targetUser.id === user?.id) {
          setViewedUser(null);
          navigate('/profile');
      } else {
          setViewedUser(targetUser);
          navigate('/profile');
      }
  };

  const handleAcceptInvite = (opponent: User) => {
      startGame('online', undefined, opponent, 'random');
  };

  // --- GLOBAL THEME INJECTION ---
  const cssVars = {
      '--app-bg': themeConfig.appBg || '#020617',
      '--panel-bg': themeConfig.panelBg || 'rgba(15, 23, 42, 0.6)',
      '--element-bg': themeConfig.elementBg || 'rgba(30, 41, 59, 0.8)',
      '--border-color': themeConfig.borderColor || 'rgba(51, 65, 85, 0.5)',
      '--text-main': themeConfig.textColor || '#ffffff',
      '--text-muted': themeConfig.textMuted || '#94a3b8',
      '--primary': themeConfig.accentColor || '#22d3ee',
      '--primary-dim': themeConfig.accentColor ? `${themeConfig.accentColor}33` : 'rgba(34, 211, 238, 0.2)',
      '--sidebar-bg': themeConfig.sidebarBg || 'rgba(2, 6, 23, 0.8)',
  } as React.CSSProperties;

  return (
    <div 
        className="min-h-screen h-full w-full flex overflow-hidden relative font-sans selection:bg-[var(--primary-dim)] transition-colors duration-500"
        style={{ ...cssVars, backgroundColor: 'var(--app-bg)', color: 'var(--text-main)' }}
    >
      <GlobalChessDefs />

      {/* Sidebar Navigation */}
      {user && location.pathname !== '/game' && location.pathname !== '/pulse' && (
          <Navigation 
              onLogout={handleLogout}
              user={user}
          />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 relative z-10 h-full overflow-y-auto ${user && location.pathname !== '/game' && location.pathname !== '/pulse' ? 'lg:pl-64' : ''}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Landing onGetStarted={() => navigate('/auth')} onSignIn={() => navigate('/auth')} />} />
                <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
                
                <Route path="/home" element={
                    <ScreenWrapper><Home onStartGame={startGame} onViewProfile={handleViewProfile} /></ScreenWrapper>
                } />
                
                <Route path="/shop" element={
                    <ScreenWrapper><Shop /></ScreenWrapper>
                } />

                <Route path="/learn" element={
                    <ScreenWrapper><Learn /></ScreenWrapper>
                } />

                <Route path="/leaderboard" element={
                    <ScreenWrapper><Leaderboard onViewProfile={handleViewProfile} /></ScreenWrapper>
                } />

                <Route path="/docs" element={
                    <ScreenWrapper><Docs /></ScreenWrapper>
                } />

                <Route path="/profile" element={
                    <ScreenWrapper><Profile user={viewedUser || user} isCurrentUser={!viewedUser} onReplayGame={startReplay} /></ScreenWrapper>
                } />

                <Route path="/notifications" element={
                    <ScreenWrapper><Notifications onAcceptGame={handleAcceptInvite} /></ScreenWrapper>
                } />

                <Route path="/social" element={
                    <ScreenWrapper>
                        <Social 
                            onViewPost={(id) => { setCurrentPostId(id); navigate(`/post/${id}`); }} 
                            onChatStart={(friend) => setActiveChatFriend(friend)} 
                            onViewProfile={handleViewProfile}
                        />
                    </ScreenWrapper>
                } />

                <Route path="/post/:id" element={
                    <ScreenWrapper>
                        <PostView postId={currentPostId || location.pathname.split('/').pop() || ''} onBack={() => navigate('/social')} />
                    </ScreenWrapper>
                } />

                <Route path="/legal/:section" element={
                    <ScreenWrapper><Legal section={location.pathname.split('/').pop() as any} onBack={() => navigate('/home')} /></ScreenWrapper>
                } />

                {/* Game Modes */}
                <Route path="/game" element={
                    <ScreenWrapper noPadding>
                        <GamePage 
                            gameMode={gameConfig.mode} 
                            difficulty={gameConfig.difficulty}
                            replayMatch={gameConfig.replayMatch}
                            opponent={gameConfig.opponent}
                            playerColor={gameConfig.playerColor}
                            onExit={() => navigate('/home')}
                        />
                    </ScreenWrapper>
                } />

                <Route path="/pulse-intro" element={
                    <ScreenWrapper noPadding><Pulse /></ScreenWrapper>
                } />

                {/* Catch-all for unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </AnimatePresence>
          
          {/* Footer Links (Only on Home) */}
          {location.pathname === '/home' && (
              <div className="absolute bottom-4 right-8 flex gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <button onClick={() => navigate('/legal/rules')} className="hover:text-[var(--primary)]">Rules</button>
                  <button onClick={() => navigate('/legal/privacy')} className="hover:text-[var(--primary)]">Privacy</button>
                  <button onClick={() => navigate('/legal/terms')} className="hover:text-[var(--primary)]">Terms</button>
              </div>
          )}
      </main>

      {/* Chat Drawer Overlay */}
      <ChatDrawer 
          friend={activeChatFriend} 
          onClose={() => setActiveChatFriend(null)} 
      />
    </div>
  );
};

const App = () => {
    return (
        <HashRouter>
            <AppContent />
        </HashRouter>
    );
}

export default App;
