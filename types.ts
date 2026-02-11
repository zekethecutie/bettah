
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
export type ItemType = 'board_theme' | 'piece_set' | 'currency';

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    coinValue?: number;
    type: ItemType;
    rarity: ItemRarity;
    previewGradient?: string; 
    
    // Theme Configuration
    config?: {
        // Board Specifics
        light: string; // Tailwind class for light squares
        dark: string;  // Tailwind class for dark squares
        boardBorder?: string;
        
        // Global App Theming (CSS Variables or Classes)
        appBg?: string; // Main background class/gradient
        sidebarBg?: string; // Sidebar background
        panelBg?: string; // Panel background color
        elementBg?: string; // Element/Card background color
        borderColor?: string; // Border color
        accentColor?: string; // Hex for accents (buttons, active states)
        textColor?: string; // Primary text color override
        textMuted?: string; // Secondary text color override
        
        // Gameplay Visuals
        moveIndicatorColor?: string; // Hex for valid move dots
        moveIndicatorRing?: string; // Hex for ring/outline of valid move dots (for contrast)
        checkColor?: string; // Hex for check highlight
    };
    
    // Piece Set Configuration
    pieceSetId?: string; // 'standard', 'retro', 'neon', 'ranked'
}

export interface UserInventory {
    ownedItems: string[];
    equipped: {
        boardTheme: string;
        pieceSet: string;
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
  score?: number; 
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
