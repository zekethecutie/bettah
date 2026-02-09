
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Clock, Gamepad2, Trash2 } from 'lucide-react';
import { UserManager } from '../utils/storage';
import { Notification, User } from '../types';

interface NotificationsProps {
  onAcceptGame: (opponent: User) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onAcceptGame }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refresh = () => {
      setNotifications(UserManager.getNotifications());
  };

  useEffect(() => {
      refresh();
      // Mark all as read when opening page
      const unread = UserManager.getNotifications().filter(n => !n.read);
      unread.forEach(n => UserManager.markRead(n.id));

      window.addEventListener('storage', refresh);
      return () => window.removeEventListener('storage', refresh);
  }, []);

  const handleDelete = (id: string) => {
      UserManager.deleteNotification(id);
      refresh();
  };

  const handleAcceptInvite = (notif: Notification) => {
      if (!notif.fromUser) return;
      
      // Check Expiry
      if (notif.meta?.expiresAt) {
          const expires = new Date(notif.meta.expiresAt).getTime();
          if (Date.now() > expires) {
              alert("This invitation has expired.");
              handleDelete(notif.id);
              return;
          }
      }

      // Convert notification sender to User object structure for game start
      const opponent: User = {
          id: notif.fromUser.id,
          username: notif.fromUser.username,
          avatar: notif.fromUser.avatar,
          elo: 1500, // Mock ELO if not in payload
          country: 'International',
          bio: '',
          email: '',
          joinedDate: '',
          banner: '',
          stats: { wins:0, losses:0, draws:0 },
          followers: [],
          following: [],
          level: 1, xp: 0, streak: 0, lastLoginDate: new Date().toISOString(), activeQuests: [], completedLessons: [],
          coins: 0,
          inventory: { ownedItems: [], equipped: { boardTheme: 'board_classic', pieceSet: 'pieces_standard' } }
      };

      UserManager.deleteNotification(notif.id);
      onAcceptGame(opponent);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 lg:p-8 animate-in fade-in duration-500 pb-28 lg:pb-8">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <Bell className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-white tracking-tighter">NOTIFICATIONS</h1>
                <p className="text-slate-400 text-sm">Game invites and alerts.</p>
            </div>
        </div>

        <div className="space-y-4">
            {notifications.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-500 font-bold">No new notifications</p>
                </div>
            ) : (
                <AnimatePresence>
                    {notifications.map((notif) => {
                        const isInvite = notif.type === 'game_invite';
                        const isExpired = notif.meta?.expiresAt ? Date.now() > new Date(notif.meta.expiresAt).getTime() : false;

                        return (
                            <motion.div
                                key={notif.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start gap-4 transition-all ${
                                    notif.read ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-900 border-cyan-900/50 shadow-lg'
                                }`}
                            >
                                <div className="flex items-start gap-4 w-full">
                                    <div className={`mt-1 p-2 rounded-lg shrink-0 ${isInvite ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                                        {isInvite ? <Gamepad2 className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-white text-lg truncate pr-2">{notif.title}</h3>
                                            <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                                                <Clock className="w-3 h-3" />
                                                {new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-1 break-words">{notif.content}</p>
                                        
                                        {isInvite && !isExpired && (
                                            <div className="flex flex-wrap gap-3 mt-4">
                                                <button 
                                                    onClick={() => handleAcceptInvite(notif)}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                                                >
                                                    <Check className="w-4 h-4" /> Accept
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(notif.id)}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-900/30 hover:text-rose-400 text-slate-300 text-sm font-bold rounded-lg transition-colors border border-slate-700 hover:border-rose-500/30"
                                                >
                                                    <X className="w-4 h-4" /> Decline
                                                </button>
                                            </div>
                                        )}
                                        {isInvite && isExpired && (
                                            <div className="mt-2 text-xs text-rose-500 font-bold bg-rose-900/10 inline-block px-2 py-1 rounded">
                                                Invitation Expired
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full md:w-auto flex justify-end">
                                    <button onClick={() => handleDelete(notif.id)} className="text-slate-600 hover:text-rose-400 p-2" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            )}
        </div>
    </div>
  );
};

export default Notifications;
