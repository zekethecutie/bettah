
import { User, MatchRecord, Friend, Post, Comment, Notification, ChatMessage, ShopItem } from '../types';
import { supabase } from './supabase';
import { handleDailyLogin, checkQuestProgress, getXpForNextLevel } from './questSystem';
import { SHOP_ITEMS } from './shopData';

// Local Storage Keys (Fallback)
const KEY_USERS = 'neon_chess_users';
const KEY_CURRENT_USER_ID = 'neon_chess_current_user_id';
const KEY_MATCHES = 'neon_chess_matches';
const KEY_FORUM = 'neon_chess_forum_posts';
const KEY_NOTIFS = 'neon_chess_notifications';
const KEY_CHATS = 'neon_chess_chats';

// --- ELO CALCULATOR ---
const calculateEloChange = (playerElo: number, opponentElo: number, result: 'win' | 'loss' | 'draw') => {
    const K = 32; // K-factor determines rating volatility
    const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
    const actualScore = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
    
    return Math.round(K * (actualScore - expectedScore));
};

// --- DATA HELPERS (Hybrid Approach) ---
const useSupabase = true;

const getLocalUsers = (): Record<string, User> => {
    const data = localStorage.getItem(KEY_USERS);
    return data ? JSON.parse(data) : {};
};

const saveLocalUsers = (users: Record<string, User>) => {
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
};

const DEFAULT_USER: User = {
  id: 'guest',
  username: 'Guest Player',
  email: '',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
  banner: 'linear-gradient(to right, #0f172a, #334155)',
  bio: 'Just here for the chess vibes.',
  country: 'International',
  elo: 800,
  joinedDate: new Date().toISOString(),
  stats: { wins: 0, losses: 0, draws: 0 },
  followers: [],
  following: [],
  // Progression
  level: 1,
  xp: 0,
  coins: 100, // Starting bonus
  streak: 0,
  lastLoginDate: new Date(Date.now() - 86400000).toISOString(),
  activeQuests: [],
  completedLessons: [],
  inventory: {
      ownedItems: ['board_classic', 'pieces_standard'],
      equipped: {
          boardTheme: 'board_classic',
          pieceSet: 'pieces_standard'
      }
  }
};

// Mock Friends
const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', username: 'KasparovAI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kasparov', status: 'online' },
  { id: 'f2', username: 'QueenGambit', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Beth', status: 'in-game' },
];

export const UserManager = {
    login: async (username: string, details?: Partial<User>): Promise<User> => {
        let user: User | null = null;

        if (useSupabase) {
            try {
                const { data, error } = await supabase.from('users').select('*').eq('username', username).single();
                if (data) user = data as User;
            } catch (e) { }
        }

        // Fallback or Create New
        if (!user) {
            const localUsers = getLocalUsers();
            const found = Object.values(localUsers).find(u => u.username.toLowerCase() === username.toLowerCase());
            
            if (found) {
                user = found;
                // Migration: Ensure new fields exist
                if(user.coins === undefined) user.coins = 100;
                if(!user.inventory) user.inventory = DEFAULT_USER.inventory;
                if(!user.activeQuests) user.activeQuests = [];
            } else {
                // Create New
                const newUser: User = {
                    ...DEFAULT_USER,
                    id: Math.random().toString(36).substr(2, 9),
                    username,
                    avatar: details?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                    country: details?.country || 'International',
                    bio: details?.bio || 'Just here for the chess vibes.',
                    elo: 800 + Math.floor(Math.random() * 400),
                    joinedDate: new Date().toISOString()
                };
                
                if (useSupabase) {
                    try { await supabase.from('users').insert(newUser); } catch (e) {}
                }
                
                localUsers[newUser.id] = newUser;
                saveLocalUsers(localUsers);
                user = newUser;
            }
        }

        // --- QUEST SYSTEM: Daily Logic ---
        const { user: refreshedUser, notification } = handleDailyLogin(user);
        
        // Save
        const localUsers = getLocalUsers();
        localUsers[refreshedUser.id] = refreshedUser;
        saveLocalUsers(localUsers);
        
        localStorage.setItem(KEY_CURRENT_USER_ID, refreshedUser.id);
        
        if (notification) {
            setTimeout(() => {
                UserManager.createMockNotification({
                    id: Math.random().toString(),
                    type: 'system',
                    title: 'Daily Update',
                    content: notification,
                    timestamp: new Date().toISOString(),
                    read: false
                });
            }, 1000);
        }

        return refreshedUser;
    },

    getCurrentUser: (): User | null => {
        const id = localStorage.getItem(KEY_CURRENT_USER_ID);
        if (!id) return null;
        const localUsers = getLocalUsers();
        const user = localUsers[id] || null;
        if(user) {
             // Migration checks
             if(user.coins === undefined) user.coins = 100;
             if(!user.inventory) user.inventory = DEFAULT_USER.inventory;
        }
        return user;
    },

    logout: () => {
        localStorage.removeItem(KEY_CURRENT_USER_ID);
    },

    updateProfile: async (updates: Partial<User>) => {
        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) return;

        const localUsers = getLocalUsers();
        const updatedUser = { ...currentUser, ...updates };
        localUsers[currentUser.id] = updatedUser;
        saveLocalUsers(localUsers);

        if (useSupabase) {
            try { await supabase.from('users').update(updates).eq('id', currentUser.id); } catch (e) {}
        }

        return updatedUser;
    },

    // --- ECONOMY ---
    buyItem: (itemId: string): { success: boolean; message: string } => {
        const user = UserManager.getCurrentUser();
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        
        if (!user || !item) return { success: false, message: 'User or item not found.' };
        if (user.inventory.ownedItems.includes(itemId)) return { success: false, message: 'Item already owned.' };
        if (user.coins < item.price) return { success: false, message: 'Insufficient coins.' };

        // Transaction
        const updatedInventory = { ...user.inventory, ownedItems: [...user.inventory.ownedItems, itemId] };
        UserManager.updateProfile({
            coins: user.coins - item.price,
            inventory: updatedInventory
        });

        return { success: true, message: `Purchased ${item.name}!` };
    },

    equipItem: (itemId: string, type: 'boardTheme' | 'pieceSet') => {
        const user = UserManager.getCurrentUser();
        if (!user) return;
        
        if (!user.inventory.ownedItems.includes(itemId)) return;

        const updatedEquipped = { ...user.inventory.equipped, [type]: itemId };
        UserManager.updateProfile({
            inventory: { ...user.inventory, equipped: updatedEquipped }
        });
    },

    // --- SOCIAL ---
    searchUsers: (query: string): User[] => {
        if (!query) return [];
        const localUsers = getLocalUsers();
        const lowerQ = query.toLowerCase();
        return Object.values(localUsers).filter(u => 
            u.id !== 'guest' &&
            u.username.toLowerCase().includes(lowerQ)
        );
    },

    followUser: (targetUserId: string) => {
        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) return;
        
        const localUsers = getLocalUsers();
        const targetUser = localUsers[targetUserId];
        if (!targetUser) return;

        if (!currentUser.following) currentUser.following = [];
        if (!targetUser.followers) targetUser.followers = [];

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            currentUser.following = currentUser.following.filter(id => id !== targetUserId);
            targetUser.followers = targetUser.followers.filter(id => id !== currentUser.id);
        } else {
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUser.id);
            if (targetUser.following?.includes(currentUser.id)) {
                 UserManager.createMockNotification({
                     id: Math.random().toString(),
                     type: 'system',
                     title: 'New Friend!',
                     content: `You and ${targetUser.username} are now friends!`,
                     timestamp: new Date().toISOString(),
                     read: false,
                     fromUser: { id: targetUser.id, username: targetUser.username, avatar: targetUser.avatar }
                 });
            }
        }

        localUsers[currentUser.id] = currentUser;
        localUsers[targetUserId] = targetUser;
        saveLocalUsers(localUsers);

        return currentUser;
    },

    getFriends: (): Friend[] => {
        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) return MOCK_FRIENDS; 
        
        const localUsers = getLocalUsers();
        const realFriends: Friend[] = [];

        if (currentUser.following) {
            currentUser.following.forEach(followingId => {
                const user = localUsers[followingId];
                if (user && user.following && user.following.includes(currentUser.id)) {
                    realFriends.push({
                        id: user.id,
                        username: user.username,
                        avatar: user.avatar,
                        status: 'offline'
                    });
                }
            });
        }
        const uniqueMocks = MOCK_FRIENDS.filter(m => !realFriends.find(r => r.id === m.id));
        return [...realFriends, ...uniqueMocks];
    },

    getLeaderboard: async (sortBy: 'elo' | 'level' | 'matches' | 'followers' = 'elo'): Promise<User[]> => {
        const users = Object.values(getLocalUsers()).filter(u => u.id !== 'guest');
        if (sortBy === 'elo') return users.sort((a, b) => b.elo - a.elo).slice(0, 50);
        else if (sortBy === 'level') return users.sort((a, b) => (b.level - a.level) || (b.xp - a.xp)).slice(0, 50);
        else if (sortBy === 'matches') return users.sort((a, b) => ((a.stats?.wins||0) + (a.stats?.losses||0) + (a.stats?.draws||0)) - ((b.stats?.wins||0) + (b.stats?.losses||0) + (b.stats?.draws||0)) * -1).slice(0, 50); // bug fix in sort
        else if (sortBy === 'followers') return users.sort((a, b) => (b.followers?.length || 0) - (a.followers?.length || 0)).slice(0, 50);
        return users.slice(0, 50);
    },

    saveMatch: async (record: Omit<MatchRecord, 'id'>) => {
        let currentUser = UserManager.getCurrentUser();
        if (!currentUser) return;

        // Skip ELO for pulse/computer unless specifically ranked
        const isRanked = record.mode === 'rapid' || record.mode === 'blitz' || record.mode === 'bullet';
        
        const eloChange = isRanked ? calculateEloChange(currentUser.elo, record.opponentElo, record.result) : 0;
        const newElo = Math.max(0, currentUser.elo + eloChange);

        const newStats = { ...currentUser.stats };
        if (record.result === 'win') newStats.wins++;
        else if (record.result === 'loss') newStats.losses++;
        else newStats.draws++;

        // Quest Progress
        currentUser = checkQuestProgress(currentUser, 'play', 1);
        if (record.result === 'win') currentUser = checkQuestProgress(currentUser, 'win', 1);

        // Coin Reward for playing
        const coinReward = record.result === 'win' ? 50 : 10;
        currentUser.coins += coinReward;

        if (useSupabase) {
            try {
                await supabase.from('matches').insert({ ...record, user_id: currentUser.id });
                await supabase.from('users').update({ 
                    elo: newElo, 
                    stats: newStats, 
                    xp: currentUser.xp,
                    coins: currentUser.coins,
                    level: currentUser.level,
                    activeQuests: currentUser.activeQuests 
                }).eq('id', currentUser.id);
            } catch (e) {}
        }

        const matchesStr = localStorage.getItem(KEY_MATCHES);
        const matches: Record<string, MatchRecord[]> = matchesStr ? JSON.parse(matchesStr) : {};
        const userMatches = matches[currentUser.id] || [];
        userMatches.unshift({ ...record, id: Math.random().toString() });
        matches[currentUser.id] = userMatches;
        localStorage.setItem(KEY_MATCHES, JSON.stringify(matches));

        const localUsers = getLocalUsers();
        localUsers[currentUser.id] = { ...currentUser, elo: newElo, stats: newStats };
        saveLocalUsers(localUsers);
    },

    getHistory: (): MatchRecord[] => {
        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) return [];
        const matchesStr = localStorage.getItem(KEY_MATCHES);
        const matches: Record<string, MatchRecord[]> = matchesStr ? JSON.parse(matchesStr) : {};
        return matches[currentUser.id] || [];
    },

    // --- FORUM & NOTIFICATIONS (Abbreviated for length, logic same as before) ---
    getPosts: (): Post[] => {
        const postsStr = localStorage.getItem(KEY_FORUM);
        return postsStr ? JSON.parse(postsStr) : [];
    },
    getPost: (postId: string): Post | undefined => {
        return UserManager.getPosts().find(p => p.id === postId);
    },
    createPost: async (title: string, content: string) => {
        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) return;
        const newPost: Post = {
            id: Math.random().toString(36).substr(2, 9),
            authorId: currentUser.id,
            authorName: currentUser.username,
            authorAvatar: currentUser.avatar,
            title, content, likes: 0, comments: 0, timestamp: new Date().toISOString(), likedBy: [], commentList: []
        };
        const posts = UserManager.getPosts();
        posts.unshift(newPost);
        localStorage.setItem(KEY_FORUM, JSON.stringify(posts));
        return newPost;
    },
    likePost: async (postId: string) => {
        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) return;
        const posts = UserManager.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (post.likedBy.includes(currentUser.id)) {
                post.likedBy = post.likedBy.filter(id => id !== currentUser.id);
                post.likes--;
            } else {
                post.likedBy.push(currentUser.id);
                post.likes++;
            }
            localStorage.setItem(KEY_FORUM, JSON.stringify(posts));
        }
    },
    addComment: async (postId: string, content: string) => {
        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) return;
        const posts = UserManager.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (!post.commentList) post.commentList = [];
            const newComment: Comment = {
                id: Math.random().toString(36).substr(2, 9),
                authorId: currentUser.id,
                authorName: currentUser.username,
                authorAvatar: currentUser.avatar,
                content, timestamp: new Date().toISOString()
            };
            post.commentList.push(newComment);
            post.comments++;
            localStorage.setItem(KEY_FORUM, JSON.stringify(posts));
        }
    },
    getNotifications: (): Notification[] => {
        const str = localStorage.getItem(KEY_NOTIFS);
        return str ? JSON.parse(str) : [];
    },
    createMockNotification: (notification: Notification) => {
        const notifs = UserManager.getNotifications();
        notifs.unshift(notification);
        localStorage.setItem(KEY_NOTIFS, JSON.stringify(notifs));
        window.dispatchEvent(new Event('storage'));
    },
    sendGameInvite: (friendId: string) => {
        const friend = MOCK_FRIENDS.find(f => f.id === friendId);
        if(!friend) return true; 
        setTimeout(() => {
             const expiryTime = new Date(Date.now() + 5 * 60 * 1000).toISOString(); 
             UserManager.createMockNotification({
                id: Math.random().toString(36).substr(2, 9),
                type: 'game_invite',
                fromUser: { id: friend.id, username: friend.username, avatar: friend.avatar },
                title: 'Invite Returned',
                content: `${friend.username} wants to play right now!`,
                timestamp: new Date().toISOString(),
                read: false,
                meta: { expiresAt: expiryTime }
             });
        }, 1500);
        return true;
    },
    markRead: (notifId: string) => {
        const notifs = UserManager.getNotifications();
        const idx = notifs.findIndex(n => n.id === notifId);
        if (idx !== -1) {
            notifs[idx].read = true;
            localStorage.setItem(KEY_NOTIFS, JSON.stringify(notifs));
            window.dispatchEvent(new Event('storage'));
        }
    },
    deleteNotification: (notifId: string) => {
        let notifs = UserManager.getNotifications();
        notifs = notifs.filter(n => n.id !== notifId);
        localStorage.setItem(KEY_NOTIFS, JSON.stringify(notifs));
        window.dispatchEvent(new Event('storage'));
    },
    getChatMessages: (friendId: string): ChatMessage[] => {
        const allChatsStr = localStorage.getItem(KEY_CHATS);
        const allChats = allChatsStr ? JSON.parse(allChatsStr) : {};
        return allChats[friendId] || [];
    },
    sendChatMessage: (friendId: string, text: string) => {
        const currentUser = UserManager.getCurrentUser();
        if(!currentUser) return;
        const allChatsStr = localStorage.getItem(KEY_CHATS);
        const allChats = allChatsStr ? JSON.parse(allChatsStr) : {};
        const chat = allChats[friendId] || [];
        chat.push({ id: Math.random().toString(36).substr(2, 9), senderId: currentUser.id, text, timestamp: new Date().toISOString() });
        setTimeout(() => {
            const replies = ["Interesting move!", "Let's play later?", "I'm practicing tactics."];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            chat.push({ id: Math.random().toString(36).substr(2, 9), senderId: friendId, text: randomReply, timestamp: new Date().toISOString() });
            allChats[friendId] = chat;
            localStorage.setItem(KEY_CHATS, JSON.stringify(allChats));
            window.dispatchEvent(new CustomEvent('chat-update', { detail: { friendId } }));
        }, 1000 + Math.random() * 2000);
        allChats[friendId] = chat;
        localStorage.setItem(KEY_CHATS, JSON.stringify(allChats));
        window.dispatchEvent(new CustomEvent('chat-update', { detail: { friendId } }));
    },
    completeLesson: (lessonId: string) => {
        let user = UserManager.getCurrentUser();
        if (!user) return;
        if (!user.completedLessons.includes(lessonId)) {
            user.completedLessons.push(lessonId);
            user.xp += 200; 
            user.coins += 50; // Coin reward
            user = checkQuestProgress(user, 'puzzle', 1);
            let xpNeeded = getXpForNextLevel(user.level);
            while (user.xp >= xpNeeded) {
                user.xp -= xpNeeded;
                user.level += 1;
                user.coins += 100; // Level up bonus
                xpNeeded = getXpForNextLevel(user.level);
            }
            UserManager.updateProfile({ 
                completedLessons: user.completedLessons, 
                xp: user.xp, 
                coins: user.coins,
                level: user.level,
                activeQuests: user.activeQuests 
            });
        }
    }
};
