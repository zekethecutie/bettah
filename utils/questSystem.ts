
import { Quest, User } from '../types';

const TIER_NAMES = [
    "Novice", "Apprentice", "Journeyman", "Adept", "Strategist", 
    "Tactician", "Master", "Grandmaster", "Legend", "Nexus Divinity"
];

export const getLevelTitle = (level: number) => {
    const tierIndex = Math.min(Math.floor((level - 1) / 10), TIER_NAMES.length - 1);
    return TIER_NAMES[tierIndex];
};

export const getXpForNextLevel = (level: number) => {
    return Math.floor(100 * Math.pow(level, 1.5));
};

const createQuest = (
    userLevel: number, 
    typeOverride?: Quest['type'], 
    isBonus: boolean = false
): Quest => {
    const now = new Date();
    const expiresAt = new Date(now.setHours(23, 59, 59, 999)).toISOString();
    
    const types: Quest['type'][] = ['play', 'win', 'capture', 'puzzle'];
    const type = typeOverride || types[Math.floor(Math.random() * types.length)];
    
    let title = '';
    let target = 1;
    let xp = 100;
    let coins = 20;
    let difficulty: Quest['difficulty'] = 'medium';
    let description = '';

    const scaler = Math.max(1, Math.floor(userLevel / 5));

    switch (type) {
        case 'play':
            target = 1 + Math.floor(Math.random() * 2) * scaler;
            title = isBonus ? "Overtime: Play Matches" : "Daily Grind: Play Matches";
            xp = 50 * target;
            coins = 10 * target;
            description = `Complete ${target} matches (win or loss).`;
            difficulty = 'easy';
            break;
        case 'win':
            target = Math.max(1, Math.floor(scaler / 2));
            title = isBonus ? "Victory Lap: Win Games" : "Glory: Win Games";
            xp = 150 * target;
            coins = 50 * target;
            description = `Defeat opponents in ${target} matches.`;
            difficulty = 'hard';
            break;
        case 'capture':
            target = 5 * scaler;
            title = "Hunter: Capture Pieces";
            xp = 10 * target;
            coins = 5 * target;
            description = `Capture ${target} enemy pieces in total.`;
            difficulty = 'medium';
            break;
        case 'puzzle':
            target = Math.max(1, Math.floor(scaler / 3));
            title = "Sharp Mind: Academy";
            xp = 100 * target;
            coins = 30 * target;
            description = `Complete ${target} lessons in the Academy.`;
            difficulty = 'easy';
            break;
    }

    if (isBonus) {
        xp = Math.floor(xp * 1.5); 
        coins = Math.floor(coins * 2);
        title = "BONUS: " + title;
        description += " (1.5x XP, 2x Coins)";
    }

    return {
        id: Math.random().toString(36).substr(2, 9),
        title, description, type, target, progress: 0,
        rewardXp: xp,
        rewardCoins: coins,
        penaltyXp: 0,
        expiresAt,
        completed: false,
        difficulty,
        isBonus
    };
};

export const generateDailyQuests = (userLevel: number): Quest[] => {
    const quests: Quest[] = [];
    const types: Quest['type'][] = ['play', 'win', 'puzzle'];
    types.forEach(t => {
        quests.push(createQuest(userLevel, t, false));
    });
    return quests;
};

export const checkQuestProgress = (user: User, eventType: Quest['type'], amount: number = 1): User => {
    let updatedUser = { ...user };
    let xpGained = 0;
    let coinsGained = 0;
    let anyCompletedNow = false;

    const newQuests = updatedUser.activeQuests.map(q => {
        if (q.completed || q.type !== eventType) return q;
        if (new Date(q.expiresAt).getTime() < Date.now()) return q;

        const newProgress = Math.min(q.target, q.progress + amount);
        const isJustCompleted = newProgress >= q.target && q.progress < q.target;
        
        if (isJustCompleted) {
            anyCompletedNow = true;
            xpGained += q.rewardXp;
            coinsGained += q.rewardCoins;
            const streakBonus = 1 + (Math.min(user.streak, 10) * 0.1); 
            xpGained = Math.floor(xpGained * streakBonus);
            
            return { ...q, progress: newProgress, completed: true };
        }
        return { ...q, progress: newProgress };
    });

    updatedUser.activeQuests = newQuests;
    updatedUser.xp += xpGained;
    updatedUser.coins += coinsGained;

    const allCompleted = updatedUser.activeQuests.every(q => q.completed);
    if (allCompleted && anyCompletedNow) {
        const bonusQuest = createQuest(updatedUser.level, undefined, true);
        updatedUser.activeQuests.push(bonusQuest);
    }

    let nextLevelXp = getXpForNextLevel(updatedUser.level);
    while (updatedUser.xp >= nextLevelXp && updatedUser.level < 100) {
        updatedUser.xp -= nextLevelXp;
        updatedUser.level += 1;
        updatedUser.coins += 100; // Level Up Bonus
        nextLevelXp = getXpForNextLevel(updatedUser.level);
    }

    return updatedUser;
};

export const handleDailyLogin = (user: User): { user: User, notification?: string } => {
    const now = new Date();
    const lastLogin = new Date(user.lastLoginDate);
    const updatedUser = { ...user };
    let notification = "";

    const isSameDay = now.toDateString() === lastLogin.toDateString();
    const isNextDay = (now.getTime() - lastLogin.getTime()) < (48 * 60 * 60 * 1000) && !isSameDay;

    if (isNextDay) {
        updatedUser.streak += 1;
        notification = `Streak continued! ${updatedUser.streak} days 🔥 (+50 Coins)`;
        updatedUser.coins += 50;
    } else if (!isSameDay) {
        if (updatedUser.streak > 0) notification = "Streak lost! Login daily to maintain XP boost.";
        updatedUser.streak = 1; 
    }

    const validQuests = updatedUser.activeQuests.filter(q => new Date(q.expiresAt).getTime() > now.getTime());
    let penaltyTotal = 0;
    updatedUser.activeQuests.forEach(q => {
        if (!q.completed && new Date(q.expiresAt).getTime() < now.getTime() && !q.isBonus) {
            penaltyTotal += q.penaltyXp;
        }
    });

    if (penaltyTotal > 0) {
        updatedUser.xp = Math.max(0, updatedUser.xp - penaltyTotal);
        notification = notification ? `${notification} | -${penaltyTotal} XP` : `-${penaltyTotal} XP`;
    }

    if (!isSameDay) {
        updatedUser.activeQuests = generateDailyQuests(updatedUser.level);
    } else {
        updatedUser.activeQuests = validQuests;
        if (updatedUser.activeQuests.length === 0) {
             updatedUser.activeQuests = generateDailyQuests(updatedUser.level);
        }
    }

    updatedUser.lastLoginDate = now.toISOString();
    return { user: updatedUser, notification };
};
