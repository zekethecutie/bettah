import { Chess, Move, Square } from 'chess.js';

// Piece values
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Simplified Piece-Square Tables (PST) - flipped for black automatically in logic
const PAWN_PST = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_PST = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_PST = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
];

// Evaluate board position
const evaluateBoard = (game: Chess): number => {
  let totalEvaluation = 0;
  const board = game.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = PIECE_VALUES[piece.type];
        
        // Positional score
        let positionalScore = 0;
        const isWhite = piece.color === 'w';
        
        // Flip ranks for white (PST are defined from white perspective usually, 
        // but board array is 0=rank8. Let's adjust indices accordingly)
        // Board[0] is Rank 8. Board[7] is Rank 1.
        
        const r = isWhite ? i : 7 - i; 
        const c = j; // Files are symmetric usually

        if (piece.type === 'p') positionalScore = PAWN_PST[r][c];
        if (piece.type === 'n') positionalScore = KNIGHT_PST[r][c];
        if (piece.type === 'b') positionalScore = BISHOP_PST[r][c];
        
        // Add values
        if (isWhite) {
            totalEvaluation += value + positionalScore;
        } else {
            totalEvaluation -= (value + positionalScore);
        }
      }
    }
  }
  return totalEvaluation;
};

// Minimax with Alpha-Beta Pruning
const minimax = (
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean
): number => {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = game.moves();

  if (isMaximizingPlayer) { // White
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalValue = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalValue);
      alpha = Math.max(alpha, evalValue);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else { // Black
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalValue = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalValue);
      beta = Math.min(beta, evalValue);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

export const getBestMove = (gameInstance: Chess, difficulty: 'easy' | 'medium' | 'hard'): Promise<string | null> => {
  return new Promise((resolve) => {
    // Clone the game to prevent mutation of the UI state during calculation
    const game = new Chess(gameInstance.fen());
    
    // Delay slightly to mimic thinking
    setTimeout(() => {
        const possibleMoves = game.moves();
        if (possibleMoves.length === 0) {
            resolve(null);
            return;
        }

        // Easy: Random move often
        if (difficulty === 'easy' && Math.random() > 0.5) {
             const randomIndex = Math.floor(Math.random() * possibleMoves.length);
             resolve(possibleMoves[randomIndex]);
             return;
        }

        let bestMove = null;
        let bestValue = game.turn() === 'w' ? -Infinity : Infinity;
        
        // Depth based on difficulty
        const depth = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
        const isMaximizing = game.turn() === 'w';

        for (const move of possibleMoves) {
            game.move(move);
            const boardValue = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
            game.undo();

            if (isMaximizing) {
                if (boardValue > bestValue) {
                    bestValue = boardValue;
                    bestMove = move;
                }
            } else {
                if (boardValue < bestValue) {
                    bestValue = boardValue;
                    bestMove = move;
                }
            }
        }
        
        resolve(bestMove || possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
    }, 200);
  });
};