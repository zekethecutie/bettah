
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, MessageSquare, Gamepad2, Share2, Heart, MessageCircle, Send, X, AlertTriangle, CheckCircle, User as UserIcon } from 'lucide-react';
import { UserManager } from '../utils/storage';
import { Post, Friend, User } from '../types';
import { moderateContent } from '../utils/moderation';

interface SocialProps {
    onViewPost?: (postId: string) => void;
    onChatStart: (friend: Friend) => void;
    onViewProfile?: (user: User) => void; 
}

interface ActivityLog {
    id: string;
    friendId: string;
    username: string;
    avatar: string;
    action: string; 
    time: string;
}

const Social: React.FC<SocialProps> = ({ onViewPost, onChatStart, onViewProfile }) => {
  const [friends, setFriends] = useState(UserManager.getFriends());
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'forum'>('friends');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [moderationError, setModerationError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  
  const [inviteSentId, setInviteSentId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [activityFeed, setActivityFeed] = useState<ActivityLog[]>([]);

  const currentUser = UserManager.getCurrentUser();

  useEffect(() => {
      setPosts(UserManager.getPosts());
      generateActivity();
  }, []);

  const generateActivity = () => {
      const currentFriends = UserManager.getFriends();
      const logs: ActivityLog[] = [];
      const actions = [
          "won a match against a Grandmaster",
          "is on a 5 game winning streak",
          "posted a new discussion in the forum",
          "reached a new ELO peak!",
          "solved 20 puzzles today"
      ];

      currentFriends.forEach(f => {
          if (Math.random() > 0.3) {
             logs.push({
                 id: Math.random().toString(),
                 friendId: f.id,
                 username: f.username,
                 avatar: f.avatar,
                 action: actions[Math.floor(Math.random() * actions.length)],
                 time: `${Math.floor(Math.random() * 59) + 1}m ago`
             });
          }
      });
      setActivityFeed(logs);
  };

  useEffect(() => {
      if (searchQuery.trim().length > 1) {
          const results = UserManager.searchUsers(searchQuery);
          setSearchResults(results);
      } else {
          setSearchResults([]);
      }
  }, [searchQuery]);

  const showToastMsg = (msg: string) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
  };

  const handleLike = (e: React.MouseEvent, postId: string) => {
      e.stopPropagation();
      UserManager.likePost(postId);
      setPosts(UserManager.getPosts()); 
  };

  const handleCreatePost = (e: React.FormEvent) => {
      e.preventDefault();
      setModerationError(null);

      const moderation = moderateContent(newPostTitle, newPostContent);
      if (!moderation.approved) {
          setModerationError(moderation.reason || "Content violates community guidelines.");
          return;
      }

      if(newPostTitle && newPostContent) {
          UserManager.createPost(newPostTitle, newPostContent);
          setPosts(UserManager.getPosts());
          setShowNewPostModal(false);
          setNewPostTitle('');
          setNewPostContent('');
          showToastMsg("Post published successfully!");
      }
  };

  const handleInvite = (e: React.MouseEvent, friendId: string) => {
      e.stopPropagation();
      const success = UserManager.sendGameInvite(friendId);
      if (success) {
          setInviteSentId(friendId);
          setTimeout(() => setInviteSentId(null), 3000);
      }
  };

  const handleUserClick = (user: User) => {
      if (onViewProfile) {
          onViewProfile(user);
      }
      setSearchResults([]);
      setSearchQuery('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-8 animate-in fade-in duration-500 pb-28 lg:pb-8 relative">
        
        {/* Toast Notification */}
        <AnimatePresence>
            {toast && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-6 right-6 z-[100] bg-emerald-900/90 border border-emerald-500/50 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md"
                >
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm">{toast}</span>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tighter">COMMUNITY</h1>
                <p className="text-slate-400">Connect, Discuss, and Compete.</p>
            </div>
            
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
                <button 
                    onClick={() => setActiveTab('friends')}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'friends' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Friends
                </button>
                <button 
                    onClick={() => setActiveTab('forum')}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'forum' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Forum
                </button>
            </div>
        </div>

        {activeTab === 'friends' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {/* Search Bar */}
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl relative z-20">
                        <div className="flex items-center gap-2">
                            <Search className="w-5 h-5 text-slate-500" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Find players by username..." 
                                className="bg-transparent border-none outline-none text-white placeholder-slate-600 w-full"
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {searchResults.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto"
                                >
                                    {searchResults.map(user => (
                                        <div 
                                            key={user.id}
                                            onClick={() => handleUserClick(user)}
                                            className="p-3 hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors border-b border-slate-800/50 last:border-0"
                                        >
                                            <img src={user.avatar} className="w-8 h-8 rounded-lg bg-slate-800" />
                                            <div>
                                                <p className="text-white text-sm font-bold">{user.username}</p>
                                                <p className="text-xs text-slate-500">ELO {user.elo}</p>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden relative z-10">
                        <div className="p-4 bg-slate-950/50 border-b border-slate-800">
                            <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider">Your Friends</h3>
                        </div>
                        <div className="divide-y divide-slate-800/50">
                            {friends.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <p>No friends yet. Follow users to make friends!</p>
                                </div>
                            ) : (
                                friends.map((friend) => (
                                    <div 
                                        key={friend.id} 
                                        onClick={() => {
                                            const u: User = { 
                                                id: friend.id, 
                                                username: friend.username, 
                                                avatar: friend.avatar, 
                                                elo: 1200, 
                                                country: 'Unknown', 
                                                bio: '', email: '', joinedDate: '', stats: {wins:0,losses:0,draws:0}, banner: '', followers:[], following:[],
                                                level: 1, xp: 0, streak: 0, lastLoginDate: new Date().toISOString(), activeQuests: [], completedLessons: [],
                                                coins: 0,
                                                inventory: { ownedItems: [], equipped: { boardTheme: 'board_classic', pieceSet: 'pieces_standard' } }
                                            };
                                            handleUserClick(u);
                                        }}
                                        className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img src={friend.avatar} alt={friend.username} className="w-10 h-10 rounded-lg bg-slate-800" />
                                                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-[#020617] rounded-full ${
                                                    friend.status === 'online' ? 'bg-emerald-500' :
                                                    friend.status === 'in-game' ? 'bg-amber-500' : 'bg-slate-500'
                                                }`} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{friend.username}</p>
                                                <p className="text-xs text-slate-500 capitalize">{friend.status}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onChatStart(friend); }}
                                                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100" 
                                                title="Message"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                            
                                            {inviteSentId === friend.id ? (
                                                <div className="flex items-center gap-1 bg-emerald-900/30 text-emerald-400 px-3 py-2 rounded-lg text-xs font-bold border border-emerald-500/30">
                                                    <CheckCircle className="w-3 h-3" /> Sent
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={(e) => handleInvite(e, friend.id)}
                                                    className="p-2 hover:bg-cyan-500/20 rounded-lg text-cyan-400 hover:text-cyan-300 transition-all opacity-0 group-hover:opacity-100" 
                                                    title="Challenge to Game"
                                                >
                                                    <Gamepad2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-4">Friend Activity</h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {activityFeed.length > 0 ? (
                                activityFeed.map((act) => (
                                    <div key={act.id} className="flex gap-3 text-sm border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                                        <img src={act.avatar} className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
                                        <div>
                                            <p className="text-slate-300"><span className="font-bold text-white hover:text-cyan-400 cursor-pointer">{act.username}</span> {act.action}</p>
                                            <p className="text-xs text-slate-600 mt-1">{act.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-600 italic">No recent activity.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="space-y-4 relative">
                {/* New Post Button */}
                <button 
                    onClick={() => setShowNewPostModal(true)}
                    className="w-full py-4 rounded-xl bg-slate-900/50 border border-slate-800 border-dashed text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 mb-6 group"
                >
                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-bold">Start a Discussion</span>
                </button>

                {/* Posts List */}
                {posts.map((post) => (
                    <div 
                        key={post.id} 
                        onClick={() => onViewPost && onViewPost(post.id)}
                        className="p-6 bg-slate-900/30 border border-slate-800 rounded-2xl hover:bg-slate-900/50 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-start gap-4">
                             <div className="flex-col items-center gap-1 hidden md:flex">
                                <button 
                                    onClick={(e) => handleLike(e, post.id)}
                                    className={`p-1 hover:text-cyan-400 transition-colors ${post.likedBy.includes(currentUser?.id || '') ? 'text-cyan-400' : 'text-slate-500'}`}
                                >
                                    <div className="rotate-180">V</div>
                                </button>
                                <span className={`font-bold text-sm ${post.likedBy.includes(currentUser?.id || '') ? 'text-cyan-400' : 'text-white'}`}>{post.likes}</span>
                                <button className="p-1 text-slate-500 hover:text-rose-400">V</button>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src={post.authorAvatar} className="w-6 h-6 rounded-full bg-slate-800" />
                                    <span className="text-xs font-bold text-slate-400">{post.authorName}</span>
                                    <span className="text-xs text-slate-600">• {new Date(post.timestamp).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-slate-400 text-sm mt-1 line-clamp-3">
                                    {post.content}
                                </p>
                                <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                                        <MessageCircle className="w-3 h-3" /> {post.comments} comments
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                                        <Share2 className="w-3 h-3" /> Share
                                    </button>
                                    {/* Mobile Like Button */}
                                    <button 
                                        onClick={(e) => handleLike(e, post.id)}
                                        className={`flex md:hidden items-center gap-1 ${post.likedBy.includes(currentUser?.id || '') ? 'text-cyan-400' : 'hover:text-white'}`}
                                    >
                                        <Heart className={`w-3 h-3 ${post.likedBy.includes(currentUser?.id || '') ? 'fill-current' : ''}`} /> {post.likes}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* New Post Modal */}
        <AnimatePresence>
            {showNewPostModal && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-lg shadow-2xl relative"
                    >
                        <button 
                            onClick={() => setShowNewPostModal(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold text-white mb-2">Create New Post</h3>
                        <p className="text-xs text-slate-400 mb-6">Please follow our community guidelines. Posts are moderated.</p>
                        
                        {moderationError && (
                            <div className="mb-4 p-3 bg-rose-900/30 border border-rose-500/50 rounded-lg flex items-center gap-2 text-rose-300 text-sm">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>{moderationError}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Title</label>
                                <input 
                                    type="text" 
                                    value={newPostTitle}
                                    onChange={(e) => setNewPostTitle(e.target.value)}
                                    placeholder="Interesting Gambit Idea..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors mt-1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Content</label>
                                <textarea 
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors mt-1 h-32 resize-none"
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" /> Post
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default Social;
