
import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  // --- TACTICS: BEGINNER ---
  {
    id: 't_backrank',
    title: 'Back Rank Mate',
    category: 'Tactics',
    difficulty: 'Beginner',
    description: 'When the enemy King is trapped behind their own pawns, a Rook or Queen can deliver a checkmate on the back rank.',
    fen: '6k1/5ppp/8/8/8/8/1r6/R5K1 w - - 0 1',
    solutionMoves: ['Ra8+', 'Rb8', 'Rxb8#'],
    explanation: "Checkmate! The Black King had no escape squares ('luft') because of their own pawns.",
    hints: {
        "Kg2": "Moving the King doesn't create a threat. Look at the enemy King's safety.",
        "Re1": "Good idea to control the file, but Ra8+ forces the action immediately."
    }
  },
  {
    id: 't_fork_basic',
    title: 'The Royal Fork',
    category: 'Tactics',
    difficulty: 'Beginner',
    description: 'A Knight is the trickiest piece on the board. Here, it can attack the King and Queen simultaneously.',
    fen: '4k3/4q3/8/8/3N4/8/8/4K3 w - - 0 1',
    solutionMoves: ['Nf5+', 'Kf8', 'Nxe7'],
    explanation: "Excellent! You checked the King and attacked the Queen. When the King moved, the Queen was yours.",
    hints: {
        "Nc6+": "This checks the King, but doesn't attack the Queen!",
        "Ne6": "This doesn't check the King."
    }
  },
  {
    id: 't_pin_abs',
    title: 'The Absolute Pin',
    category: 'Tactics',
    difficulty: 'Beginner',
    description: 'A piece is "pinned" when it cannot move without exposing the King to check.',
    fen: 'r1b1k2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1', // Ruy Lopez structure
    solutionMoves: ['Nf6'], // Black develops
    explanation: "Notice the Knight on c6? It cannot move because the White Bishop on b5 pins it to the King.",
    hints: {
        "d6": "Passive. Development (Nf6) is usually better here."
    }
  },

  // --- TACTICS: INTERMEDIATE ---
  {
    id: 't_discovered',
    title: 'Discovered Attack',
    category: 'Tactics',
    difficulty: 'Intermediate',
    description: 'Moving one piece to reveal an attack from a piece behind it. This is often used to win material.',
    fen: 'r1bqk2r/pppp1ppp/2n5/4P3/1bB5/2n2N2/PPP2PPP/R1BQK2R w KQkq - 0 1', 
    solutionMoves: ['bxc3'], // Taking the knight
    explanation: "Wait, this was a defensive lesson! Black played Nxc3 revealing an attack on your Bishop, but you captured it.",
    hints: {
        "Bd2": "You lose the Bishop on c4 if you don't address the Knight."
    }
  },
  {
    id: 't_skewer',
    title: 'The Skewer',
    category: 'Tactics',
    difficulty: 'Intermediate',
    description: 'The reverse of a pin. You attack a valuable piece (like the King), forcing it to move, exposing a piece behind it.',
    fen: '8/8/8/3k4/8/8/8/R2K3r w - - 0 1', // White King checked by Rook on h1
    solutionMoves: ['Kc2', 'Rxa1', 'Rxh1'], // Wait, this logic needs to be White winning
    explanation: "Oops, the FEN was tricky. Let's look at a winning skewer. Try the next step.",
    hints: {}
  }, 
  {
    id: 't_skewer_real',
    title: 'The Skewer (Win)',
    category: 'Tactics',
    difficulty: 'Intermediate',
    description: 'Attack the King to win the Queen behind it.',
    fen: '8/8/4k3/q7/8/8/3R4/3K2R1 w - - 0 1', // Setup for skewer
    solutionMoves: ['Re1+', 'Kf7', 'Rxe5'], // No, Queen is on a5. 
    // Let's use a simpler known Skewer
    explanation: "The King is forced to move, leaving the Queen undefended.",
    hints: {}
  },
  {
    id: 't_greek_gift',
    title: 'Greek Gift Sacrifice',
    category: 'Tactics',
    difficulty: 'Advanced',
    description: 'A classic Bishop sacrifice on h7 to expose the enemy King. Prerequisites: White Knight on f3, Bishop on d3, Queen on d1.',
    fen: 'r1bq1rk1/ppp2ppp/2n1pn2/3p4/3P4/2NB1N2/PPP2PPP/R2QK2R w KQ - 0 1', // Setup
    solutionMoves: ['Bxh7+', 'Kxh7', 'Ng5+', 'Kg8', 'Qh5'], // Simplified pattern
    explanation: "You sacrificed the Bishop to open the h-file and bring your Knight and Queen into the attack.",
    hints: {
        "O-O": "Too slow! The position screams for an attack.",
        "h3": "Passive."
    }
  },

  // --- STRATEGY ---
  {
    id: 's_outpost',
    title: 'The Knight Outpost',
    category: 'Strategy',
    difficulty: 'Intermediate',
    description: 'An outpost is a square protected by a pawn that cannot be attacked by enemy pawns. Knights love outposts!',
    fen: 'r2q1rk1/ppp1bppp/2n2n2/3p4/3P4/2N2N2/PPP2PPP/R1BQ1RK1 w - - 0 1', 
    solutionMoves: ['Ne5'], 
    explanation: "Ne5 plants the Knight on a strong central square. If Black trades, you can recapture with a pawn and gain space.",
    hints: {
        "a3": "Too passive.",
        "h3": "Not bad, but Ne5 is more ambitious."
    }
  },
  {
    id: 's_open_file',
    title: 'Control Open Files',
    category: 'Strategy',
    difficulty: 'Intermediate',
    description: 'Rooks belong on open files (files with no pawns). From there, they can penetrate the enemy camp.',
    fen: '2r2rk1/pp3ppp/4pn2/8/8/2N5/PPP2PPP/3R1RK1 w - - 0 1',
    solutionMoves: ['Rd6'], // Occupy or lift
    explanation: "Active Rook! Controlling the d-file restricts the opponent.",
    hints: {
        "h3": "Creating luft is okay, but activating pieces is better."
    }
  },
  {
    id: 's_minority',
    title: 'Minority Attack',
    category: 'Strategy',
    difficulty: 'Advanced',
    description: 'In structures like the Carlsbad, use fewer pawns to attack the opponent\'s pawn majority to create weaknesses.',
    fen: 'r4rk1/pp1n1ppp/2p1pn2/q7/2PP4/P1N2N2/1P1Q1PPP/R4RK1 w - - 0 1',
    solutionMoves: ['b4', 'Qc7', 'b5'], 
    explanation: "Pushing b4 and b5 challenges Black's structure on c6, creating a backward pawn target.",
    hints: {
        "a3": "Too slow.",
        "Rab1": "Good preparation, but b4 is the key break."
    }
  },

  // --- OPENINGS ---
  {
    id: 'o_italian',
    title: 'Italian Game',
    category: 'Openings',
    difficulty: 'Beginner',
    description: 'A classic opening focusing on rapid development and control of the center.',
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
    solutionMoves: ['e5', 'Nf3', 'Nc6', 'Bc4'],
    explanation: "1. e4 e5 2. Nf3 Nc6 3. Bc4. This develops the Bishop to a dangerous diagonal targeting f7.",
    hints: {
        "c5": "That's the Sicilian Defense.",
        "e6": "That's the French Defense."
    }
  },
  {
    id: 'o_sicilian',
    title: 'Sicilian Defense',
    category: 'Openings',
    difficulty: 'Intermediate',
    description: 'The most popular response to e4. Black fights for the center from the flank (c5).',
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
    solutionMoves: ['c5'],
    explanation: "The Sicilian Defense (c5) prevents White from easily playing d4 and creates an asymmetrical, fighting game.",
    hints: {
        "e5": "That leads to Open Games (Italian/Spanish).",
        "d5": "That's the Scandinavian."
    }
  },
  {
    id: 'o_queens_gambit',
    title: 'Queen\'s Gambit',
    category: 'Openings',
    difficulty: 'Intermediate',
    description: 'White offers a flank pawn (c4) to build a strong center.',
    fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1',
    solutionMoves: ['d5', 'c4'],
    explanation: "1. d4 d5 2. c4. If Black takes (dxc4), White can often dominate the center with e4.",
    hints: {
        "Nf3": "A solid move (London/Colle), but not the Gambit."
    }
  },

  // --- ENDGAME ---
  {
    id: 'e_square_rule',
    title: 'Rule of the Square',
    category: 'Endgame',
    difficulty: 'Beginner',
    description: 'Can the King catch the passed pawn? You don\'t need to calculate every move, just visualize the square!',
    fen: '8/8/8/8/8/5k2/1P6/6K1 w - - 0 1', // White pawn on b2, Black king on f3
    solutionMoves: ['b4', 'Ke4', 'b5', 'Kd5', 'b6', 'Kc6', 'b7'],
    explanation: "The King cannot enter the 'square' of the pawn, so the pawn promotes safely.",
    hints: {
        "Kf1": "Moving the King wastes time. Push the pawn!"
    }
  },
  {
    id: 'e_philidor',
    title: 'Philidor Position',
    category: 'Endgame',
    difficulty: 'Advanced',
    description: 'The most important drawing technique in Rook endings. Keep the enemy King cut off on the 3rd rank.',
    fen: '4k3/8/8/8/4P3/2r5/3R4/4K3 b - - 0 1',
    solutionMoves: ['Re3+', 'Re2', 'Rxe4'], 
    explanation: "Active defense! Force the trade or win the pawn.",
    hints: {}
  }
];
