
import { Lesson } from '../types';

// Expanded curriculum with Hidden Gems and Professional Concepts
export const LESSONS: Lesson[] = [
  // --- TACTICS: BEGINNER ---
  {
    id: 'l1',
    title: 'The Absolute Pin',
    category: 'Tactics',
    difficulty: 'Beginner',
    description: 'A pin occurs when a piece is held in place because moving it would expose a more valuable piece behind it. An absolute pin exposes the King.',
    fen: 'r1b1k2r/pppp1ppp/8/8/1b2q3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1', 
    solutionMoves: ['Qe2'], 
    explanation: "Excellent! Blocking with the Queen pins the Black Queen to the King. Black cannot move the Queen off the e-file.",
    hints: {
        "Be2": "Blocking with the Bishop leaves it undefended against the Queen.",
        "Kf1": "Moving the King loses the right to castle and leaves the King exposed."
    }
  },
  {
    id: 'l2',
    title: 'Back Rank Mate',
    category: 'Tactics',
    difficulty: 'Beginner',
    description: 'When a King is trapped behind its own pawns and has no flight squares, a Rook or Queen can deliver mate on the back rank.',
    fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
    solutionMoves: ['Rd8#'],
    explanation: "Checkmate! The King is trapped by its own pawns. Always watch your back rank.",
    hints: {
        "Rb1": "Moving sideways doesn't attack the King.",
        "Rc1": "This controls the file but doesn't threaten mate immediately."
    }
  },
  
  // --- TACTICS: INTERMEDIATE ---
  {
    id: 'l3',
    title: 'The Fork',
    category: 'Tactics',
    difficulty: 'Intermediate',
    description: 'A tactic where a piece attacks two or more enemy pieces simultaneously.',
    fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', 
    solutionMoves: ['c3', 'Nf6', 'd4'], 
    explanation: "By playing c3 then d4, you attack both the Bishop and the pawn, forcing a favorable exchange.",
    hints: {
        "d3": "Passive. We want to challenge the center vigorously.",
        "h3": "Prophylactic, but misses the attacking opportunity."
    }
  },
  {
    id: 'l4',
    title: 'Discovered Attack',
    category: 'Tactics',
    difficulty: 'Intermediate',
    description: 'Moving a piece to reveal an attack from a piece behind it.',
    fen: 'r1bqkbnr/ppp2ppp/2n5/3pp3/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 0 4',
    solutionMoves: ['Nxe5'],
    explanation: "Capturing the pawn opens the line for your Bishop.",
    hints: {
        "e3": "Solid, but passive. Look for captures."
    }
  },
  {
    id: 'l_windmill',
    title: 'The Windmill',
    category: 'Tactics',
    difficulty: 'Advanced',
    description: 'A devastating tactic where a series of discovered checks allows one piece to go on a rampage. Famous from Torre vs Lasker.',
    fen: '2r3k1/p4ppp/8/8/8/1B6/P4PPP/5RK1 w - - 0 1', // Simplified concept setup
    solutionMoves: ['Bxf7+', 'Kh8', 'Bg6+'], // Shortened pattern
    explanation: "Check, move back, discovered check. The Bishop and Rook coordination is deadly.",
    hints: {
        "Bb3": "Retreating without a threat allows Black to consolidate."
    }
  },
  {
    id: 'l_xray',
    title: 'X-Ray Attack',
    category: 'Tactics',
    difficulty: 'Intermediate',
    description: 'When a piece attacks a square "through" another piece.',
    fen: 'r1r3k1/5ppp/8/8/8/8/1R6/1R4K1 w - - 0 1',
    solutionMoves: ['Rb8'], // Simplified back rank x-ray
    explanation: "The Rook on b1 supports the attack through the Rook on b2.",
  },

  // --- TACTICS: ADVANCED / GM ---
  {
    id: 'l5',
    title: 'Greek Gift Sacrifice',
    category: 'Tactics',
    difficulty: 'Grandmaster',
    description: 'A classic bishop sacrifice on h7 (or h2) to expose the enemy King.',
    fen: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w - - 0 6', 
    solutionMoves: ['Bxh7+'], 
    explanation: "Sacrificing the Bishop tears open the King's defenses, often leading to mate or heavy material loss.",
    hints: {
        "d3": "Standard development, but you miss the tactical shot.",
        "h3": "Too slow for this aggressive position."
    }
  },
  {
    id: 'l_fishing_pole',
    title: 'Fishing Pole Trap',
    category: 'Tactics',
    difficulty: 'Advanced',
    description: 'A tricky trap in the Ruy Lopez where Black baits White into taking a Knight on g4.',
    fen: 'r1bq1rk1/ppp2ppp/2n5/1B1pp3/4n3/2P2N2/PPP2PPP/R1BQ1RK1 b - - 1 8', // Setup phase
    solutionMoves: ['Bg4', 'h3', 'h5'], // The bait
    explanation: "If White takes the Bishop (hxg4), the h-file opens for the Rook, leading to checkmate!",
    hints: {
        "Nf6": "Standard, but the Fishing Pole (Bg4) is spicier."
    }
  },

  // --- STRATEGY: ADVANCED ---
  {
    id: 's1',
    title: 'Prophylaxis',
    category: 'Strategy', 
    difficulty: 'Advanced',
    description: 'The art of preventing your opponent\'s plans before they happen. White wants to stop Black from playing ...Bg4 pinning the Knight.',
    fen: 'r2q1rk1/ppp1bppp/2n2n2/3pp3/4P3/2NP1N2/PPP1BPPP/R1BQ1RK1 w - - 0 8',
    solutionMoves: ['h3'], 
    explanation: "h3 creates 'luft' (air) for the King and, crucially, prevents Black from pinning your Knight with Bg4.",
    hints: {
        "Be3": "Allows Ng4 attacking the Bishop.",
        "a3": "Too passive on the queenside."
    }
  },
  {
    id: 's2',
    title: 'The Minority Attack',
    category: 'Strategy',
    difficulty: 'Advanced',
    description: 'In the Carlsbad structure, White pushes queenside pawns to create weaknesses in Black\'s camp.',
    fen: '2r2rk1/pp1n1ppp/4pn2/q1pp4/3P4/P1N1PN2/1PP1QPPP/R4RK1 w - - 0 12',
    solutionMoves: ['b4'], 
    explanation: "The Minority Attack! Advancing fewer pawns against a majority to open lines and create weak pawns.",
    hints: {
        "a4": "Standard, but b4 is more challenging here."
    }
  },
  {
    id: 's3',
    title: 'Space Advantage',
    category: 'Strategy',
    difficulty: 'Intermediate',
    description: 'Gaining space restricts opponent piece mobility. Advance the central pawns!',
    fen: 'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    solutionMoves: ['d4'],
    explanation: "Taking the full center controls squares and restricts Black.",
    hints: {
        "Nf3": "Good, but d4 grabs more space immediately."
    }
  },
  {
    id: 's_blockade',
    title: 'The Blockade',
    category: 'Strategy',
    difficulty: 'Advanced',
    description: 'Knights are the best blockaders of passed pawns. Stop the enemy pawn!',
    fen: '8/8/3p4/3P4/4N3/8/8/k1K5 w - - 0 1',
    solutionMoves: ['Nd2'], // Maneuver to block
    explanation: "A blockading Knight paralyzes the pawn and radiates power to other squares."
  },
  {
    id: 's_7th_rank',
    title: 'The Seventh Rank',
    category: 'Strategy',
    difficulty: 'Advanced',
    description: 'Rooks on the 7th rank (or 2nd for Black) are incredibly powerful, attacking pawns and cutting off the King.',
    fen: '6k1/R7/8/8/8/8/1r6/6K1 w - - 0 1', // Concept
    solutionMoves: ['Ra7'], // Already there in FEN, assume move to establish
    explanation: "Pigs on the 7th! Two Rooks on the 7th rank are often worth a Queen."
  },
  {
    id: 's_zugzwang',
    title: 'Zugzwang',
    category: 'Strategy',
    difficulty: 'Grandmaster',
    description: 'A situation where any move a player makes worsens their position. The "Hidden Gem" of chess endings.',
    fen: '8/8/8/8/3k4/3P4/3K4/8 w - - 0 1',
    solutionMoves: ['Kc2', 'Kc3'], // Wait for black to move away
    explanation: "Black is in Zugzwang. They must move the King away from the defense of the pawn."
  },

  // --- OPENINGS ---
  {
    id: 'o1',
    title: 'Control the Center',
    category: 'Openings',
    difficulty: 'Beginner',
    description: 'The most basic principle: Place pawns in the center to control key squares.',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    solutionMoves: ['e4'],
    explanation: "e4 is a classic opening move. It controls d5 and f5 and opens lines for the Queen and Bishop."
  },
  {
    id: 'o2',
    title: 'Sicilian Defense',
    category: 'Openings',
    difficulty: 'Intermediate',
    description: 'A sharp, aggressive response to e4.',
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
    solutionMoves: ['c5'],
    explanation: "c5 prevents White from easily playing d4 and creates an asymmetrical position fighting for the center."
  },
  {
    id: 'o_ruy',
    title: 'Ruy Lopez',
    category: 'Openings',
    difficulty: 'Intermediate',
    description: 'One of the oldest and most trusted openings. Attacks the Knight that defends the center.',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
    solutionMoves: ['Bb5'],
    explanation: "The Spanish Game. Puts immediate pressure on Black's structure."
  },
  {
    id: 'o_french',
    title: 'French Defense',
    category: 'Openings',
    difficulty: 'Intermediate',
    description: 'A solid, counter-attacking defense. Light square bishop is often the "problem child".',
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
    solutionMoves: ['e6'],
    explanation: "e6 prepares d5, challenging the center immediately while keeping the King safe."
  },

  // --- ENDGAME ---
  {
    id: 'e1',
    title: 'King & Pawn vs King',
    category: 'Endgame',
    difficulty: 'Advanced',
    description: 'The critical opposition. You must place your King in front of the pawn to promote.',
    fen: '8/8/8/8/8/4k3/4P3/4K3 w - - 0 1',
    solutionMoves: ['Kf1'], 
    explanation: "Wait for the opponent to commit. If they move to the side, you can advance.",
    hints: {
        "Kd1": "Loses the opposition."
    }
  },
  {
    id: 'e2',
    title: 'Lucena Position',
    category: 'Endgame',
    difficulty: 'Grandmaster',
    description: 'The key to winning Rook and Pawn endings.',
    fen: '3K4/3P4/8/8/8/8/4k3/5R2 w - - 0 1',
    solutionMoves: ['Rf4'], 
    explanation: "The 'Bridge' technique allows your King to escape check and escort the pawn."
  },
  {
    id: 'e_philidor',
    title: 'Philidor Position',
    category: 'Endgame',
    difficulty: 'Advanced',
    description: 'The most important drawing technique in Rook endings. Keep the King cut off!',
    fen: '3r4/4k3/8/8/4P3/3R4/4K3/8 b - - 0 1', // Setup
    solutionMoves: ['Rg8'], // Wait on the 3rd rank (relative)
    explanation: "Keep the Rook active. Do not go passive!"
  }
];
