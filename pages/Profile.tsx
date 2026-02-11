
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, MapPin, Calendar, Trophy, TrendingUp, TrendingDown, Swords, Save, X, Upload, Camera, Clock, UserPlus, UserMinus, Users, Star, Flame, Video, Palette, Check } from 'lucide-react';
import { User, MatchRecord, ShopItem } from '../types';
import { UserManager } from '../utils/storage';
import ImageCropper from '../components/ImageCropper';
import { getLevelTitle, getXpForNextLevel } from '../utils/questSystem';
import { RankEmblem, getRankDetails } from '../utils/rankSystem';
import { getItem, SHOP_ITEMS } from '../utils/shopData';

interface ProfileProps {
  user: User;
  isCurrentUser: boolean;
  onReplayGame: (match: MatchRecord) => void;
}

// Holographic Level Card
const LevelCard = ({ user, accentColor }: { user: User, accentColor?: string }) => {
    const xpNeeded = getXpForNextLevel(user.level);
    const progress = (user.xp / xpNeeded) * 100;
    const title = getLevelTitle(user.level);
    const rankData = getRankDetails(user.elo);

    return (
        <div className="relative w-full md:w-80 h-48 rounded-2xl overflow-hidden group perspective-1000">
            <div 
                className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black border rounded-2xl shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-y-6" 
                style={{ 
                    borderColor: 'var(--border-color)', 
                    backgroundColor: 'var(--sidebar-bg)'
                }}
            >
                
                {/* Holographic Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ backgroundSize: '200% 200%' }} />
                
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Nexus Rank</p>
                        <h3 className="text-2xl font-black italic tracking-tighter" style={{ color: 'var(--text-main)' }}>{title}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black shadow-[0_0_15px_rgba(0,0,0,0.3)] border" style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--primary)', color: 'var(--text-main)', boxShadow: `0 0 10px var(--primary-dim)` }}>
                        {user.level}
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <RankEmblem elo={user.elo} className="w-10 h-10" />
                        <div>
                            <p className="text-sm font-black uppercase tracking-wide" style={{ color: rankData.config.color }}>
                                {rankData.tierName}
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{user.elo} ELO</p>
                                {rankData.tier !== 'Ascendant' && (
                                    <div className="w-16 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--element-bg)' }}>
                                        <div 
                                            className="h-full" 
                                            style={{ width: `${rankData.progress}%`, backgroundColor: rankData.config.color }} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between text-xs font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
                        <span>XP Progress</span>
                        <span>{Math.floor(user.xp)} / {xpNeeded}</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden border" style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)' }}>
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-white"
                            style={{ backgroundColor: 'var(--primary)' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="border p-4 rounded-xl flex items-center gap-4 relative overflow-hidden group hover:border-slate-700 transition-colors" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-2xl font-black" style={{ color: 'var(--text-main)' }}>{value}</p>
        </div>
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
    </div>
);

const ThemeSelector = ({ user, onClose }: { user: User, onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState<'boardTheme' | 'pieceSet'>('boardTheme');
    
    // Filter owned items
    const ownedThemes = SHOP_ITEMS.filter(i => i.type === 'board_theme' && user.inventory.ownedItems.includes(i.id));
    const ownedPieces = SHOP_ITEMS.filter(i => i.type === 'piece_set' && user.inventory.ownedItems.includes(i.id));

    const handleEquip = (itemId: string) => {
        UserManager.equipItem(itemId, activeTab);
        // Force refresh via window reload or context update if possible, 
        // but for now relying on state update in parent or standard flow
        window.location.reload(); 
    };

    const currentList = activeTab === 'boardTheme' ? ownedThemes : ownedPieces;

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-black text-white">Customize Appearance</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
                </div>
                
                <div className="p-4 flex gap-2">
                    <button onClick={() => setActiveTab('boardTheme')} className={`flex-1 py-2 rounded-lg font-bold text-sm ${activeTab === 'boardTheme' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Themes</button>
                    <button onClick={() => setActiveTab('pieceSet')} className={`flex-1 py-2 rounded-lg font-bold text-sm ${activeTab === 'pieceSet' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Pieces</button>
                </div>

                <div className="p-4 h-[400px] overflow-y-auto space-y-3">
                    {currentList.map(item => {
                        const isEquipped = user.inventory.equipped[activeTab] === item.id;
                        return (
                            <div key={item.id} className={`p-4 rounded-xl border flex items-center justify-between ${isEquipped ? 'border-cyan-500 bg-cyan-900/10' : 'border-slate-800 bg-slate-950'}`}>
                                <div>
                                    <p className="font-bold text-white">{item.name}</p>
                                    <p className="text-xs text-slate-500">{item.rarity}</p>
                                </div>
                                {isEquipped ? (
                                    <span className="text-cyan-400 text-xs font-bold uppercase flex items-center gap-1"><Check size={12}/> Active</span>
                                ) : (
                                    <button onClick={() => handleEquip(item.id)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-white">Equip</button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </motion.div>
        </div>
    );
};

const Profile: React.FC<ProfileProps> = ({ user, isCurrentUser, onReplayGame }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [editBio, setEditBio] = useState(user.bio);
  
  const [displayUser, setDisplayUser] = useState(user);
  const currentUser = UserManager.getCurrentUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [cropperState, setCropperState] = useState<{ src: string, type: 'avatar' | 'banner' } | null>(null);
  
  // Theme Overrides from user inventory
  const [themeConfig, setThemeConfig] = useState<any>({});

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const history = UserManager.getHistory();

  useEffect(() => {
      setDisplayUser(user);
      if (currentUser && user.followers) {
          setIsFollowing(user.followers.includes(currentUser.id));
      }
      
      // Calculate Profile Theme based on VIEWED user's equipment
      if (user.inventory?.equipped?.boardTheme) {
          const item = getItem(user.inventory.equipped.boardTheme);
          if (item && item.config) {
              setThemeConfig(item.config);
          } else {
              setThemeConfig({}); // Reset to default if no theme
          }
      }
  }, [user, currentUser?.id]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
      if (!isCurrentUser) return;
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setCropperState({ src: reader.result as string, type });
          };
          reader.readAsDataURL(file);
      }
      e.target.value = '';
  };

  const handleCropComplete = async (base64: string) => {
      if (cropperState && isCurrentUser) {
          const update = cropperState.type === 'avatar' ? { avatar: base64 } : { banner: base64 };
          // 1. Update Storage
          const updatedUser = await UserManager.updateProfile(update);
          
          // 2. Update Local UI State Immediately
          if (updatedUser) {
              setDisplayUser(prev => ({ ...prev, ...update }));
          }
      }
      setCropperState(null);
  };

  const handleSave = async () => {
      if (!isCurrentUser) return;
      const updated = await UserManager.updateProfile({ bio: editBio });
      if (updated) setDisplayUser(updated);
      setIsEditing(false);
  };

  const handleCancel = () => {
      setEditBio(displayUser.bio);
      setIsEditing(false);
  };

  const toggleFollow = () => {
      if (isCurrentUser) return;
      
      const updatedMe = UserManager.followUser(displayUser.id);
      if(updatedMe) {
          setIsFollowing(!isFollowing);
          setDisplayUser(prev => ({
              ...prev,
              followers: isFollowing 
                 ? prev.followers.filter(id => id !== currentUser?.id)
                 : [...(prev.followers || []), currentUser?.id || '']
          }));
      }
  };

  const rankData = getRankDetails(displayUser.elo);

  // Dynamic CSS Variables based on Viewed User's Theme
  const profileStyle = {
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
        className="w-full min-h-full transition-colors duration-500 rounded-3xl overflow-hidden"
        style={profileStyle}
    >
      {showThemeSelector && currentUser && (
          <ThemeSelector user={currentUser} onClose={() => setShowThemeSelector(false)} />
      )}

      <div className="w-full max-w-5xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in zoom-in duration-500 mb-20 lg:mb-0 relative mt-6">
        
        {/* Dynamic Background for Profile Stalking */}
        <div 
            className="absolute inset-0 z-[-1] pointer-events-none transition-all duration-500 rounded-3xl" 
            style={{ 
                background: themeConfig.appBg || 'transparent', 
                opacity: themeConfig.appBg ? 1 : 0 
            }} 
        />

        <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
        <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />

        {cropperState && (
            <ImageCropper 
                imageSrc={cropperState.src} 
                aspectRatio={cropperState.type === 'avatar' ? 1 : 3} 
                onCrop={handleCropComplete} 
                onCancel={() => setCropperState(null)} 
            />
        )}

        {/* Header Card - Customizable */}
        <div 
            className="relative rounded-3xl overflow-hidden shadow-2xl group transition-all duration-500 border"
            style={{ 
                backgroundColor: 'var(--sidebar-bg)',
                borderColor: 'var(--border-color)'
            }}
        >
            {/* Banner */}
            <div className="h-40 md:h-64 relative overflow-hidden bg-slate-950">
                {displayUser.banner && (displayUser.banner.startsWith('http') || displayUser.banner.startsWith('data:')) ? (
                    <img src={displayUser.banner} alt="Banner" className="w-full h-full object-cover opacity-80" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-slate-900 to-slate-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {isCurrentUser && (
                    <button 
                        onClick={() => bannerInputRef.current?.click()}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Camera className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="px-6 pb-6 md:px-10 md:pb-8 relative -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-6">
                {/* Avatar */}
                <div className="relative group/avatar shrink-0">
                    <div 
                        className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 overflow-hidden shadow-2xl relative z-10"
                        style={{ borderColor: 'var(--sidebar-bg)', backgroundColor: 'var(--element-bg)' }}
                    >
                        <img src={displayUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Rank Emblem */}
                    <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 rounded-full p-1.5 border-4 shadow-xl z-20" style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-bg)' }}>
                        <RankEmblem elo={displayUser.elo} className="w-12 h-12 md:w-14 md:h-14" />
                    </div>

                    {isCurrentUser && (
                        <button 
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-3xl m-1 z-30"
                        >
                            <Camera className="w-8 h-8 text-white" />
                        </button>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left mb-2 md:mb-0 mt-2 md:mt-0">
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-1">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>{displayUser.username}</h1>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full border" style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)' }}>
                            <span className="text-sm font-black uppercase tracking-wider" style={{ color: rankData.config.color }}>
                                {rankData.tierName}
                            </span>
                        </div>
                    </div>
                    <p className="flex items-center justify-center md:justify-start gap-2 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                        <MapPin className="w-4 h-4" /> {displayUser.country}
                        <span className="w-1 h-1 rounded-full bg-current" />
                        <Calendar className="w-4 h-4" /> Joined {new Date(displayUser.joinedDate).toLocaleDateString()}
                    </p>
                    
                    {/* Bio */}
                    {isEditing ? (
                        <div className="flex flex-col gap-2 w-full max-w-lg mx-auto md:mx-0">
                            <textarea 
                                value={editBio} 
                                onChange={(e) => setEditBio(e.target.value)}
                                className="w-full border rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] outline-none"
                                style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                                rows={3}
                            />
                            <div className="flex gap-2 justify-end">
                                <button onClick={handleCancel} className="px-4 py-2 text-sm hover:opacity-80" style={{ color: 'var(--text-muted)' }}>Cancel</button>
                                <button onClick={handleSave} className="px-4 py-2 text-sm text-white rounded-lg flex items-center gap-2 hover:opacity-90" style={{ backgroundColor: 'var(--primary)' }}><Save className="w-3 h-3" /> Save</button>
                            </div>
                        </div>
                    ) : (
                        <p className="max-w-xl text-sm leading-relaxed" style={{ color: 'var(--text-main)', opacity: 0.9 }}>
                            {displayUser.bio || "No bio yet."}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 min-w-[140px] w-full md:w-auto">
                    {isCurrentUser ? (
                        <>
                            <button 
                                onClick={() => setShowThemeSelector(true)}
                                className="w-full px-6 py-3 rounded-xl font-bold transition-all border flex items-center justify-center gap-2 hover:brightness-110"
                                style={{ backgroundColor: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }}
                            >
                                <Palette className="w-4 h-4" /> Customize Look
                            </button>
                            <button 
                                onClick={() => { setEditBio(displayUser.bio); setIsEditing(true); }}
                                className="w-full px-6 py-3 rounded-xl font-bold transition-all border flex items-center justify-center gap-2 hover:opacity-90"
                                style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                            >
                                <Edit2 className="w-4 h-4" /> Edit Profile
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={toggleFollow}
                            className={`w-full px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isFollowing ? 'hover:text-rose-400' : 'hover:opacity-90'}`}
                            style={{ 
                                backgroundColor: isFollowing ? 'var(--element-bg)' : 'var(--primary)', 
                                color: isFollowing ? 'var(--text-muted)' : 'white' 
                            }}
                        >
                            {isFollowing ? <><UserMinus className="w-4 h-4" /> Unfollow</> : <><UserPlus className="w-4 h-4" /> Follow</>}
                        </button>
                    )}
                    
                    <div className="flex justify-between px-4 py-3 rounded-xl border" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
                        <div className="text-center flex-1">
                            <p className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Followers</p>
                            <p className="font-black" style={{ color: 'var(--text-main)' }}>{displayUser.followers?.length || 0}</p>
                        </div>
                        <div className="w-px mx-2" style={{ backgroundColor: 'var(--border-color)' }} />
                        <div className="text-center flex-1">
                            <p className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Following</p>
                            <p className="font-black" style={{ color: 'var(--text-main)' }}>{displayUser.following?.length || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Stats */}
            <div className="space-y-6">
                <LevelCard user={displayUser} />
                
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    <StatCard label="Wins" value={displayUser.stats.wins} icon={Trophy} color="bg-emerald-500" />
                    <StatCard label="Losses" value={displayUser.stats.losses} icon={TrendingDown} color="bg-rose-500" />
                    <StatCard label="Draws" value={displayUser.stats.draws} icon={TrendingUp} color="bg-slate-500" />
                    <StatCard label="Matches" value={displayUser.stats.wins + displayUser.stats.losses + displayUser.stats.draws} icon={Swords} color="bg-indigo-500" />
                </div>
            </div>

            {/* Main Content Tabs */}
            <div className="lg:col-span-2">
                <div className="flex gap-4 mb-6 border-b pb-2 overflow-x-auto" style={{ borderColor: 'var(--border-color)' }}>
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`pb-2 px-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2' : 'hover:opacity-80'}`}
                        style={activeTab === 'overview' ? { color: 'var(--primary)', borderColor: 'var(--primary)' } : { color: 'var(--text-muted)' }}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`pb-2 px-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'history' ? 'border-b-2' : 'hover:opacity-80'}`}
                        style={activeTab === 'history' ? { color: 'var(--primary)', borderColor: 'var(--primary)' } : { color: 'var(--text-muted)' }}
                    >
                        Match History
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div 
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Featured Match or Recent Achievement placeholder */}
                            <div className="border rounded-2xl p-8 text-center border-dashed" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}>
                                <Trophy className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary)' }} />
                                <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>Season 1 Performance</h3>
                                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Win rate: {((displayUser.stats.wins / (displayUser.stats.wins + displayUser.stats.losses || 1)) * 100).toFixed(1)}%</p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'history' && (
                        <motion.div 
                            key="history"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {history.length > 0 ? (
                                history.map((match) => (
                                    <div 
                                        key={match.id}
                                        className="border rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 group hover:opacity-90 transition-opacity"
                                        style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }}
                                    >
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl shrink-0 ${
                                                match.result === 'win' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                match.result === 'loss' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                                'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                            }`}>
                                                {match.result === 'win' ? 'W' : match.result === 'loss' ? 'L' : 'D'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                                    vs {match.opponent}
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--element-bg)', color: 'var(--text-muted)' }}>{match.opponentElo}</span>
                                                </p>
                                                <div className="flex items-center gap-2 text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(match.date).toLocaleDateString()}
                                                    <span className="w-1 h-1 bg-current rounded-full" />
                                                    <span className="uppercase">{match.mode}</span>
                                                    {match.isStreamVod && (
                                                        <span className="flex items-center gap-1 text-red-400 ml-1">
                                                            <Video className="w-3 h-3" /> VOD
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => onReplayGame(match)}
                                            className="w-full md:w-auto px-6 py-2 border rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 hover:bg-white/5"
                                            style={{ backgroundColor: 'var(--element-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                                        >
                                            <Swords className="w-4 h-4" /> Analyze
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>No matches played yet.</div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
