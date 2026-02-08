
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

export interface GameState {
  fen: string;
  turn: Color;
  inCheck: boolean;
  isGameOver: boolean;
  result: string | null;
  history: string[];
  captured: { w: PieceSymbol[]; b: PieceSymbol[] };
}

export type Theme = 'neon' | 'glass' | 'classic';

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
  penaltyXp: number;
  expiresAt: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'grandmaster';
  isBonus?: boolean; // New flag for auto-refilled quests
}

export interface Lesson {
  id: string;
  title: string;
  category: 'Tactics' | 'Openings' | 'Endgame' | 'Strategy';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Grandmaster';
  description: string;
  fen: string;
  solutionMoves: string[]; // SAN array
  explanation: string;
  hints?: Record<string, string>; // Map specific wrong moves to feedback strings
}

// Social & Account Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string; // URL or base64 or preset id
  banner: string; // Color or image URL
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
  
  // Progression
  level: number;
  xp: number;
  streak: number;
  lastLoginDate: string;
  activeQuests: Quest[];
  completedLessons: string[]; // IDs
}

export interface MatchRecord {
  id: string;
  date: string;
  opponent: string; // Username or "Computer"
  opponentElo: number;
  result: 'win' | 'loss' | 'draw';
  pgn: string;
  mode: 'bullet' | 'blitz' | 'rapid' | 'computer';
  playerSide: 'w' | 'b'; // Crucial for accurate replays
  isStreamVod?: boolean;
  vodTitle?: string;
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
  timestamp: string; // ISO string
  read: boolean;
  meta?: any; // For game invite IDs, etc.
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}
