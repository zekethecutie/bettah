
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, MapPin, Calendar, Trophy, TrendingUp, TrendingDown, Swords, Save, X, Upload, Camera, Clock, UserPlus, UserMinus, Users, Star, Flame, Video } from 'lucide-react';
import { User, MatchRecord } from '../types';
import { UserManager } from '../utils/storage';
import ImageCropper from '../components/ImageCropper';
import { getLevelTitle, getXpForNextLevel } from '../utils/questSystem';
import { RankEmblem, getRankDetails } from '../utils/rankSystem';

interface ProfileProps {
  user: User;
  isCurrentUser: boolean;
  onReplayGame: (match: MatchRecord) => void;
}

// Holographic Level Card
const LevelCard = ({ user }: { user: User }) => {
    const xpNeeded = getXpForNextLevel(user.level);
    const progress = (user.xp / xpNeeded) * 100;
    const title = getLevelTitle(user.level);
    const rankData = getRankDetails(user.elo);

    return (
        <div className="relative w-full md:w-80 h-48 rounded-2xl overflow-hidden group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black border border-slate-700 rounded-2xl shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-y-6">
                
                {/* Holographic Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ backgroundSize: '200% 200%' }} />
                
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Nexus Rank</p>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter">{title}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]">
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
                                <p className="text-[10px] text-slate-500 font-mono">{user.elo} ELO</p>
                                {rankData.tier !== 'Ascendant' && (
                                    <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full" 
                                            style={{ width: `${rankData.progress}%`, backgroundColor: rankData.config.color }} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                        <span>XP Progress</span>
                        <span>{Math.floor(user.xp)} / {xpNeeded}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4 relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
        </div>
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
    </div>
);

const Profile: React.FC<ProfileProps> = ({ user, isCurrentUser, onReplayGame }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(user.bio);
  
  const [displayUser, setDisplayUser] = useState(user);
  const currentUser = UserManager.getCurrentUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [cropperState, setCropperState] = useState<{ src: string, type: 'avatar' | 'banner' } | null>(null);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const history = UserManager.getHistory();

  useEffect(() => {
      setDisplayUser(user);
      if (currentUser && user.followers) {
          setIsFollowing(user.followers.includes(currentUser.id));
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

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in zoom-in duration-500 mb-20 lg:mb-0">
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

      {/* Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
          {/* Banner */}
          <div className="h-40 md:h-64 relative overflow-hidden bg-slate-950">
              {displayUser.banner && (displayUser.banner.startsWith('http') || displayUser.banner.startsWith('data:')) ? (
                  <img src={displayUser.banner} alt="Banner" className="w-full h-full object-cover opacity-80" />
              ) : (
                  <div className="w-full h-full bg-gradient-to-r from-slate-900 to-slate-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              
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
              {/* Avatar - Fixed Z-Index & Layout */}
              <div className="relative group/avatar shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-slate-900 overflow-hidden bg-slate-800 shadow-2xl relative z-10">
                      <img src={displayUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Rank Emblem Overlay - Moved Outside Overflow */}
                  <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-slate-900 rounded-full p-1.5 border-4 border-slate-800 shadow-xl z-20">
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
                      <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{displayUser.username}</h1>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                          <span className="text-sm font-black uppercase tracking-wider" style={{ color: rankData.config.color }}>
                              {rankData.tierName}
                          </span>
                      </div>
                  </div>
                  <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm mb-4">
                      <MapPin className="w-4 h-4" /> {displayUser.country}
                      <span className="w-1 h-1 bg-slate-600 rounded-full" />
                      <Calendar className="w-4 h-4" /> Joined {new Date(displayUser.joinedDate).toLocaleDateString()}
                  </p>
                  
                  {/* Bio */}
                  {isEditing ? (
                      <div className="flex flex-col gap-2 w-full max-w-lg mx-auto md:mx-0">
                          <textarea 
                              value={editBio} 
                              onChange={(e) => setEditBio(e.target.value)}
                              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                              rows={3}
                          />
                          <div className="flex gap-2 justify-end">
                              <button onClick={handleCancel} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                              <button onClick={handleSave} className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 flex items-center gap-2"><Save className="w-3 h-3" /> Save</button>
                          </div>
                      </div>
                  ) : (
                      <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
                          {displayUser.bio || "No bio yet."}
                      </p>
                  )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 min-w-[140px] w-full md:w-auto">
                  {isCurrentUser ? (
                      <button 
                        onClick={() => { setEditBio(displayUser.bio); setIsEditing(true); }}
                        className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700 hover:border-slate-500 flex items-center justify-center gap-2"
                      >
                          <Edit2 className="w-4 h-4" /> Edit Profile
                      </button>
                  ) : (
                      <button 
                        onClick={toggleFollow}
                        className={`w-full px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isFollowing ? 'bg-slate-800 text-slate-300 hover:text-rose-400' : 'bg-cyan-600 text-white hover:bg-cyan-500'}`}
                      >
                          {isFollowing ? <><UserMinus className="w-4 h-4" /> Unfollow</> : <><UserPlus className="w-4 h-4" /> Follow</>}
                      </button>
                  )}
                  
                  <div className="flex justify-between px-4 py-3 bg-slate-950/50 rounded-xl border border-slate-800">
                      <div className="text-center flex-1">
                          <p className="text-xs text-slate-500 uppercase font-bold">Followers</p>
                          <p className="font-black text-white">{displayUser.followers?.length || 0}</p>
                      </div>
                      <div className="w-px bg-slate-800 mx-2" />
                      <div className="text-center flex-1">
                          <p className="text-xs text-slate-500 uppercase font-bold">Following</p>
                          <p className="font-black text-white">{displayUser.following?.length || 0}</p>
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
              <div className="flex gap-4 mb-6 border-b border-slate-800 pb-2 overflow-x-auto">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 px-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'overview' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-white'}`}
                  >
                      Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className={`pb-2 px-4 font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'history' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-white'}`}
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
                          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 text-center border-dashed">
                              <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                              <h3 className="text-xl font-bold text-white">Season 1 Performance</h3>
                              <p className="text-slate-400 text-sm mt-2">Win rate: {((displayUser.stats.wins / (displayUser.stats.wins + displayUser.stats.losses || 1)) * 100).toFixed(1)}%</p>
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
                                    className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 group hover:bg-slate-800/80 transition-colors"
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
                                              <p className="font-bold text-white text-sm flex items-center gap-2">
                                                  vs {match.opponent}
                                                  <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-500">{match.opponentElo}</span>
                                              </p>
                                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                  <Clock className="w-3 h-3" />
                                                  {new Date(match.date).toLocaleDateString()}
                                                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
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
                                        className="w-full md:w-auto px-6 py-2 bg-slate-950 hover:bg-cyan-900/30 text-slate-400 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/30 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                                      >
                                          <Swords className="w-4 h-4" /> Analyze
                                      </button>
                                  </div>
                              ))
                          ) : (
                              <div className="text-center py-12 text-slate-500">No matches played yet.</div>
                          )}
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>
      </div>
    </div>
  );
};

export default Profile;
