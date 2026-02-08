// Hardcoded Moderation Algorithm
// Checks for profanity, explicit content, and spam patterns.

const BANNED_WORDS = [
    // Explicit / Offensive (Placeholder list - extend as needed)
    'badword', 'explicit', 'violence', 'hate', 'racist', 'kill', 'attack', 
    'idiot', 'stupid', 'scam', 'spam', 'xxx', 'porn', 'gambling'
];

const SPAM_REGEX = /(http|https):\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const REPEATED_CHARS = /(.)\1{4,}/; // "aaaaa"

export const moderateContent = (title: string, content: string): { approved: boolean; reason?: string } => {
    const combined = `${title} ${content}`.toLowerCase();

    // 1. Length Check
    if (content.length < 5) {
        return { approved: false, reason: "Content is too short. Please elaborate." };
    }

    // 2. Explicit Word Filter
    for (const word of BANNED_WORDS) {
        if (combined.includes(word)) {
            return { approved: false, reason: "Your post contains prohibited language." };
        }
    }

    // 3. Spam/Link Check (Strict for this platform)
    if (combined.match(SPAM_REGEX)) {
         return { approved: false, reason: "External links and emails are not allowed." };
    }

    // 4. Heuristic: Yelling / Spam patterns
    if (combined.match(REPEATED_CHARS)) {
        return { approved: false, reason: "Please do not spam repeated characters." };
    }

    // 5. Heuristic: Relevance (Simple keyword check for chess terms)
    // If it doesn't mention *anything* related to chess/game/strategy, flag it (Optional strict mode)
    const CHESS_KEYWORDS = ['chess', 'game', 'play', 'move', 'king', 'queen', 'rook', 'bishop', 'knight', 'pawn', 'elo', 'board', 'strategy', 'opening', 'endgame', 'check', 'mate', 'draw', 'win', 'loss', 'time', 'white', 'black', 'puzzle', 'tactic'];
    const hasRelevance = CHESS_KEYWORDS.some(kw => combined.includes(kw));
    
    // We allow "Hi" or introductions, so only flag if it's long and irrelevant
    if (combined.length > 20 && !hasRelevance) {
         // Soft warning, maybe allow but suggest editing. For now, we approve but could tag.
         // return { approved: false, reason: "Post seems unrelated to chess." };
    }

    return { approved: true };
};