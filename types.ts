
import { Square, PieceSymbol, Color, Move } from 'chess.js';

export interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
  size: number;
  type: 'circle' | 'spark' | 'ring';
}

// Economy & Shop
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ItemType = 'board_theme' | 'piece_set' | 'avatar_frame';

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    type: ItemType;
    rarity: ItemRarity;
    previewColor?: string; // For board themes
    config?: any; // Technical config (colors, svg paths, etc)
}

export interface UserInventory {
    ownedItems: string[]; // List of Item IDs
    equipped: {
        boardTheme: string; // Item ID
        pieceSet: string; // Item ID
        avatarFrame?: string;
    };
}

export interface GameState {
  fen: string;
  turn: Color;
  inCheck: boolean;
  isGameOver: boolean;
  result: string | null;
  history: string[];
  captured: { w: PieceSymbol[]; b: PieceSymbol[] };
}

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Quest & Progression
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'win' | 'play' | 'puzzle' | 'capture';
  target: number;
  progress: number;
  rewardXp: number;
  rewardCoins: number;
  penaltyXp: number;
  expiresAt: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'grandmaster';
  isBonus?: boolean; 
}

export interface Lesson {
  id: string;
  title: string;
  category: 'Tactics' | 'Openings' | 'Endgame' | 'Strategy';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Grandmaster';
  description: string;
  fen: string;
  solutionMoves: string[]; 
  explanation: string;
  hints?: Record<string, string>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string; 
  banner: string; 
  bio: string;
  country: string;
  elo: number;
  joinedDate: string;
  stats: {
    wins: number;
    losses: number;
    draws: number;
  };
  followers: string[];
  following: string[];
  
  // Progression & Economy
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lastLoginDate: string;
  activeQuests: Quest[];
  completedLessons: string[];
  inventory: UserInventory;
}

export interface MatchRecord {
  id: string;
  date: string;
  opponent: string; 
  opponentElo: number;
  result: 'win' | 'loss' | 'draw';
  pgn: string;
  mode: 'bullet' | 'blitz' | 'rapid' | 'computer' | 'pulse';
  playerSide: 'w' | 'b'; 
  isStreamVod?: boolean;
  vodTitle?: string;
  score?: number; // For Pulse mode
}

export interface Friend {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'in-game';
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  likedBy: string[];
  commentList?: Comment[];
}

export interface Notification {
  id: string;
  type: 'game_invite' | 'message' | 'system';
  fromUser?: {
    id: string;
    username: string;
    avatar: string;
  };
  title: string;
  content: string;
  timestamp: string; 
  read: boolean;
  meta?: any; 
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}
