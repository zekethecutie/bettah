
import React from 'react';

// "NexusChess" - Masterful Graphic Design Icons
// Includes Standard, Retro (8-bit), and Neon (Wireframe) sets

interface PieceProps {
  className?: string;
  color: 'w' | 'b';
  set?: 'standard' | 'retro' | 'neon';
}

const Defs = ({ color, set }: { color: 'w' | 'b', set: string }) => {
    // Only standard uses complex gradient fills defined in GlobalDefs
    // Retro uses solid colors
    // Neon uses stroke colors
    return null; 
}

const StandardPiece = ({ className, children, color }: any) => {
  const gradId = `chess-grad-${color}`;
  const filterId = `chess-shadow-${color}`;
  const strokeColor = color === 'w' ? '#94a3b8' : '#0f172a';
  const strokeWidth = color === 'w' ? "1.5" : "1";
  
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible' }}>
      <g filter={`url(#${filterId})`}>
         {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                    fill: `url(#${gradId})`,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeLinejoin: "round",
                    strokeLinecap: "round"
                });
            }
            return child;
         })}
      </g>
    </svg>
  );
};

const RetroPiece = ({ className, children, color }: any) => {
    // Pixel Art Style - Blocky, no gradients, hard shadows
    const fill = color === 'w' ? '#f1f5f9' : '#334155';
    const stroke = color === 'w' ? '#475569' : '#0f172a';
    
    return (
        <svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible', shapeRendering: 'crispEdges' }}>
            <filter id="retro-shadow">
                <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="rgba(0,0,0,0.5)" />
            </filter>
            <g filter="url(#retro-shadow)">
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child as React.ReactElement<any>, {
                            fill: fill,
                            stroke: stroke,
                            strokeWidth: "3", // Thicker strokes for retro feel
                            strokeLinejoin: "miter",
                            strokeLinecap: "square"
                        });
                    }
                    return child;
                })}
            </g>
        </svg>
    );
};

const NeonPiece = ({ className, children, color }: any) => {
    // Wireframe Style - No fill, glowing stroke
    const stroke = color === 'w' ? '#22d3ee' : '#f472b6'; // Cyan vs Pink
    const shadowColor = color === 'w' ? '#0891b2' : '#be185d';
    
    return (
        <svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible' }}>
            <filter id={`neon-glow-${color}`}>
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={stroke} />
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={shadowColor} />
            </filter>
            <g filter={`url(#neon-glow-${color})`}>
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child as React.ReactElement<any>, {
                            fill: "transparent",
                            stroke: stroke,
                            strokeWidth: "2",
                            strokeLinejoin: "round",
                            strokeLinecap: "round",
                            vectorEffect: "non-scaling-stroke"
                        });
                    }
                    return child;
                })}
            </g>
        </svg>
    );
};

// --- PIECE PATHS ---

const PIECE_PATHS: Record<string, Record<string, React.ReactNode>> = {
    standard: {
        p: <><path d="M50 20 C42 20 38 26 38 32 C38 38 42 42 45 44 C42 48 35 62 32 75 L68 75 C65 62 58 48 55 44 C58 42 62 38 62 32 C62 26 58 20 50 20 Z" /><circle cx="50" cy="28" r="3" fill="rgba(0,0,0,0.2)" stroke="none" /></>,
        n: <><path d="M25 78 L 75 78 L 72 65 L 28 65 Z" /><path d="M30 65 C 25 50 28 40 35 30 L 38 15 L 42 10 L 45 15 C 48 10 52 8 58 10 C 65 14 68 25 68 38 C 70 48 72 58 72 65 L 30 65" /><path d="M35 30 L 22 35 L 20 42 L 32 45 L 35 38" /><path d="M58 10 L 62 18 L 60 25 L 66 32 L 64 42" fill="none" strokeWidth="2" /><path d="M38 22 L 46 24" strokeWidth="2" /></>,
        b: <><path d="M50 8 L38 28 L36 65 L28 75 L72 75 L64 65 L62 28 L50 8 Z" /><path d="M50 25 L50 55" strokeWidth="2" /><path d="M40 40 L60 40" strokeWidth="2" /><circle cx="50" cy="18" r="3" fill="rgba(0,0,0,0.2)" stroke="none" /></>,
        r: <><path d="M30 80 L70 80 L66 65 L34 65 Z" /><path d="M36 65 L38 30 L62 30 L64 65 Z" /><path d="M30 30 L70 30 L70 12 L60 12 L60 18 L52 18 L52 12 L48 12 L48 18 L40 18 L40 12 L30 12 Z" /><path d="M36 65 L64 65" stroke="rgba(0,0,0,0.2)" strokeWidth="1" /><path d="M50 38 L50 58" strokeWidth="2" strokeLinecap="round" /></>,
        q: <><path d="M50 10 L58 30 L76 22 L68 42 L74 75 L26 75 L32 42 L24 22 L42 30 L50 10 Z" /><circle cx="50" cy="8" r="3" /><circle cx="24" cy="22" r="2" /><circle cx="76" cy="22" r="2" /><path d="M50 45 L50 65" strokeWidth="1" stroke="rgba(0,0,0,0.2)" /></>,
        k: <><path d="M25 80 L75 80 L70 65 L30 65 Z" /><path d="M35 65 L35 35 L65 35 L65 65 Z" /><path d="M35 35 L20 45 L20 55 L30 65" fill="none" strokeWidth="2" /><path d="M65 35 L80 45 L80 55 L70 65" fill="none" strokeWidth="2" /><path d="M32 35 L68 35 L72 25 L58 28 L50 22 L42 28 L28 25 Z" /><path d="M50 5 L50 22" strokeWidth="3" /><path d="M42 12 L58 12" strokeWidth="3" /><rect x="46" y="45" width="8" height="10" rx="1" stroke="none" /></>
    },
    retro: {
        // Blocky approximations
        p: <path d="M40 70 L60 70 L60 60 L70 60 L70 40 L60 40 L60 30 L40 30 L40 40 L30 40 L30 60 L40 60 Z" />,
        n: <path d="M30 70 L70 70 L70 60 L60 60 L60 30 L50 30 L50 20 L40 20 L40 30 L30 30 L30 40 L20 40 L20 50 L30 50 L30 60 Z" />,
        b: <path d="M45 70 L55 70 L55 60 L65 60 L65 40 L55 40 L55 20 L45 20 L45 40 L35 40 L35 60 L45 60 Z M 45 30 L 55 30" />,
        r: <path d="M30 70 L70 70 L70 60 L60 60 L60 30 L70 30 L70 20 L30 20 L30 30 L40 30 L40 60 L30 60 Z M 40 20 L 40 30 M 50 20 L 50 30 M 60 20 L 60 30" />,
        q: <path d="M30 70 L70 70 L70 60 L60 60 L60 40 L70 30 L60 30 L50 20 L40 30 L30 30 L40 40 L40 60 L30 60 Z" />,
        k: <path d="M30 70 L70 70 L70 60 L60 60 L60 40 L70 40 L70 30 L60 30 L60 20 L50 20 L50 10 L40 10 L40 20 L30 20 L30 30 L20 30 L20 40 L30 40 L30 60 L30 70 Z" />
    },
    neon: {
        // Simple geometric wireframes
        p: <path d="M35 75 L65 75 L50 25 Z M 50 25 L 50 20" />,
        n: <path d="M30 75 L70 75 L70 65 L40 65 L40 45 L65 35 L65 20 L45 20 L30 40 Z" />,
        b: <path d="M50 10 L30 75 L70 75 Z M 50 10 L 50 75 M 35 45 L 65 45" />,
        r: <rect x="30" y="20" width="40" height="55" rx="5" />,
        q: <path d="M50 10 L75 35 L65 75 L35 75 L25 35 Z M 50 10 L 50 75 M 25 35 L 75 35" />,
        k: <path d="M30 75 L70 75 L70 30 L30 30 Z M 50 10 L 50 30 M 40 20 L 60 20" />
    }
};

// Standalone Rook Shape for UI Icons (Navigation/Home)
export const RookShapeUI = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
         <path d="M30 80 L70 80 L66 65 L34 65 Z M36 65 L38 30 L62 30 L64 65 Z M30 30 L70 30 L70 12 L60 12 L60 18 L52 18 L52 12 L48 12 L48 18 L40 18 L40 12 L30 12 Z" />
    </svg>
);

export const PieceIcons: Record<string, React.FC<PieceProps>> = {
  p: (props) => {
      const set = props.set || 'standard';
      const Container = set === 'retro' ? RetroPiece : set === 'neon' ? NeonPiece : StandardPiece;
      return <Container {...props}>{PIECE_PATHS[set].p}</Container>;
  },
  n: (props) => {
      const set = props.set || 'standard';
      const Container = set === 'retro' ? RetroPiece : set === 'neon' ? NeonPiece : StandardPiece;
      return <Container {...props}>{PIECE_PATHS[set].n}</Container>;
  },
  b: (props) => {
      const set = props.set || 'standard';
      const Container = set === 'retro' ? RetroPiece : set === 'neon' ? NeonPiece : StandardPiece;
      return <Container {...props}>{PIECE_PATHS[set].b}</Container>;
  },
  r: (props) => {
      const set = props.set || 'standard';
      const Container = set === 'retro' ? RetroPiece : set === 'neon' ? NeonPiece : StandardPiece;
      return <Container {...props}>{PIECE_PATHS[set].r}</Container>;
  },
  q: (props) => {
      const set = props.set || 'standard';
      const Container = set === 'retro' ? RetroPiece : set === 'neon' ? NeonPiece : StandardPiece;
      return <Container {...props}>{PIECE_PATHS[set].q}</Container>;
  },
  k: (props) => {
      const set = props.set || 'standard';
      const Container = set === 'retro' ? RetroPiece : set === 'neon' ? NeonPiece : StandardPiece;
      return <Container {...props}>{PIECE_PATHS[set].k}</Container>;
  }
};
