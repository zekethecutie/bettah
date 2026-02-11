
import React from 'react';

// "NexusChess" - Masterful Graphic Design Icons
// Includes Standard, Pixel Warriors (8-bit), Cybermytica (Neon), Ranked Elite, and Cybermytica 2 sets

interface PieceProps {
  className?: string;
  color: 'w' | 'b';
  set?: 'standard' | 'retro' | 'neon' | 'ranked' | 'cyber2';
}

// --- STANDARD PIECE ---
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

// --- PIXEL WARRIORS (RETRO) ---
const RetroPiece = ({ className, children, color }: any) => {
    // White = Tintable Light Gray, Black = Tintable Dark Gray/Red
    // We use fill props directly on paths now to ensure tint works
    const fill = color === 'w' ? '#e2e8f0' : '#1e293b'; 
    const stroke = color === 'w' ? '#475569' : '#000000';
    
    return (
        <svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible', shapeRendering: 'crispEdges' }}>
            <filter id="retro-shadow">
                <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="rgba(0,0,0,0.5)" />
            </filter>
            <g filter="url(#retro-shadow)">
                <g transform="scale(3.125)">
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child as React.ReactElement<any>, {
                                fill: fill,
                                stroke: stroke,
                                strokeWidth: "0.2"
                            });
                        }
                        return child;
                    })}
                </g>
            </g>
        </svg>
    );
};

// --- CYBERMYTICA (NEON) - REVAMPED ---
const NeonPiece = ({ className, children, color }: any) => {
    const isWhite = color === 'w';
    // Menacing Mythic Colors
    const primaryColor = isWhite ? '#00f0ff' : '#ff003c'; // Cyan Laser vs Red Laser
    const coreColor = isWhite ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.8)'; // White Energy vs Void Black
    const glowColor = isWhite ? '#00f0ff' : '#ff0000';

    return (
        <svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible' }}>
            <defs>
                <filter id={`neon-glow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                    <feFlood floodColor={glowColor} result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="shadow" />
                    {/* Intensify the glow */}
                    <feMerge>
                        <feMergeNode in="shadow" />
                        <feMergeNode in="shadow" /> 
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <g filter={`url(#neon-glow-${color})`}>
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child as React.ReactElement<any>, {
                            fill: coreColor, 
                            stroke: primaryColor, 
                            strokeWidth: "1.5", 
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

// --- RANKED ELITE (PLATINUM/ASCENDANT) ---
const RankedPiece = ({ className, children, color }: any) => {
    // White = Platinum/Blue/Diamond look
    // Black = Ascendant/Red/Crimson look
    const id = `ranked-${color}`;
    
    return (
        <svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible' }}>
            <defs>
                <linearGradient id={`grad-ranked-w`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan/Platinum */}
                    <stop offset="50%" stopColor="#3b82f6" /> {/* Blue */}
                    <stop offset="100%" stopColor="#1e3a8a" /> {/* Deep Blue */}
                </linearGradient>
                <linearGradient id={`grad-ranked-b`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f472b6" /> {/* Pink */}
                    <stop offset="50%" stopColor="#e11d48" /> {/* Red */}
                    <stop offset="100%" stopColor="#881337" /> {/* Deep Crimson */}
                </linearGradient>
                <filter id="ranked-glow">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
                </filter>
            </defs>
            <g filter="url(#ranked-glow)">
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child as React.ReactElement<any>, {
                            fill: `url(#grad-ranked-${color})`,
                            stroke: "white",
                            strokeWidth: "1.5",
                            strokeLinejoin: "round"
                        });
                    }
                    return child;
                })}
            </g>
        </svg>
    );
};

// --- CYBERMYTICA 2 (LEGENDARY) ---
// Helper to recursively map children to handle Fragments
const recursiveMap = (children: React.ReactNode, fn: (child: React.ReactElement) => React.ReactElement): React.ReactNode => {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    if (child.type === React.Fragment) {
      return recursiveMap(child.props.children, fn);
    }
    return fn(child as React.ReactElement);
  });
};

const Cybermytica2Piece = ({ className, children, color }: any) => {
    // Theme 1: Titan Blue (White) | Theme 2: Tartarus Red (Black)
    const themeColor = color === 'w' ? '#00f7ff' : '#ff2a00';
    // Use React.useId for unique IDs to prevent filter collisions
    const uniqueId = React.useId().replace(/:/g, ''); 
    const defsId = `cyber2-${uniqueId}`; 
    
    return (
        <svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible' }}>
            <defs>
                <linearGradient id={`${defsId}-armorDark`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2a2a35" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0a0a12" stopOpacity="1" />
                </linearGradient>

                <filter id={`${defsId}-neonBloom`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
                    <feMerge>
                        <feMergeNode in="blur2"/>
                        <feMergeNode in="blur1"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g>
                {recursiveMap(children, (child) => {
                    const props = child.props as any;
                    
                    if (props.className?.includes('piece-silhouette')) {
                        return React.cloneElement(child, {
                            fill: `url(#${defsId}-armorDark)`,
                            stroke: themeColor,
                            strokeWidth: "1",
                            strokeLinejoin: "bevel"
                        });
                    }
                    if (props.className?.includes('piece-runes')) {
                         return React.cloneElement(child, {
                            fill: "none",
                            stroke: themeColor,
                            strokeWidth: "1.5",
                            strokeLinecap: "round",
                            filter: `url(#${defsId}-neonBloom)`,
                            opacity: 0.9
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
        p: <><rect x="12" y="4" width="8" height="6"/><rect x="10" y="10" width="12" height="4"/><rect x="8" y="14" width="16" height="8"/><rect x="6" y="22" width="20" height="8"/></>,
        r: <><rect x="6" y="2" width="6" height="6"/><rect x="20" y="2" width="6" height="6"/><rect x="6" y="8" width="20" height="6"/><rect x="10" y="14" width="12" height="8"/><rect x="6" y="22" width="20" height="8"/></>,
        n: <><rect x="14" y="2" width="6" height="4"/><rect x="12" y="6" width="10" height="4"/><rect x="8" y="10" width="18" height="6"/><rect x="8" y="16" width="12" height="6"/><rect x="10" y="22" width="12" height="4"/><rect x="6" y="26" width="20" height="4"/></>,
        b: <><rect x="14" y="2" width="4" height="4"/><rect x="12" y="6" width="8" height="6"/><rect x="10" y="12" width="12" height="6"/><rect x="8" y="18" width="16" height="6"/><rect x="6" y="24" width="20" height="6"/></>,
        k: <><rect x="15" y="0" width="2" height="6"/><rect x="13" y="2" width="6" height="2"/><rect x="10" y="6" width="12" height="4"/><rect x="8" y="10" width="16" height="6"/><rect x="6" y="16" width="20" height="6"/><rect x="8" y="22" width="16" height="4"/><rect x="6" y="26" width="20" height="4"/></>,
        q: <><rect x="6" y="2" width="4" height="4"/><rect x="14" y="2" width="4" height="4"/><rect x="22" y="2" width="4" height="4"/><rect x="8" y="6" width="16" height="6"/><rect x="6" y="12" width="20" height="6"/><rect x="8" y="18" width="16" height="4"/><rect x="6" y="22" width="20" height="4"/><rect x="4" y="26" width="24" height="4"/></>
    },
    neon: {
        // "Mythical Cyber" Redesign
        // Using sharp geometric primitive shapes with data lines
        p: (
            <>
                <path d="M50 20 L65 45 L50 85 L35 45 Z" />
                <path d="M50 20 L50 85" />
                <circle cx="50" cy="45" r="3" fill="currentColor" stroke="none" />
            </>
        ),
        n: (
            <>
                <path d="M30 85 L75 85 L70 65 L60 55 L70 30 L55 15 L35 25 L25 45 L30 65 Z" />
                <path d="M35 25 L45 28 M25 45 L40 45" />
                <circle cx="50" cy="35" r="2" fill="currentColor" stroke="none" />
                <path d="M30 65 L70 65" />
            </>
        ),
        b: (
            <>
                <path d="M50 10 L30 40 L40 85 L60 85 L70 40 Z" />
                <path d="M50 10 L50 85 M30 40 L70 40" />
                <circle cx="50" cy="25" r="3" fill="currentColor" stroke="none" />
                <circle cx="50" cy="65" r="3" fill="currentColor" stroke="none" />
            </>
        ),
        r: (
            <>
                <path d="M25 85 L75 85 L70 20 L55 30 L45 30 L30 20 Z" />
                <path d="M35 85 L35 25 M65 85 L65 25" />
                <path d="M25 65 L75 65 M28 45 L72 45" />
                <rect x="45" y="15" width="10" height="15" />
            </>
        ),
        q: (
            <>
                <path d="M50 10 L65 30 L80 20 L70 50 L75 85 L25 85 L30 50 L20 20 L35 30 Z" />
                <path d="M50 10 L50 85" />
                <path d="M35 30 L65 30 M30 50 L70 50" />
                <circle cx="50" cy="50" r="4" fill="currentColor" stroke="none" />
            </>
        ),
        k: (
            <>
                <path d="M50 5 L60 20 L60 40 L70 50 L60 85 L40 85 L30 50 L40 40 L40 20 Z" />
                <path d="M50 5 L50 85" />
                <path d="M35 50 L65 50 M40 20 L60 20" />
                <path d="M40 85 L25 85 L25 65 L35 65" /> {/* Tech detail */}
                <path d="M60 85 L75 85 L75 65 L65 65" />
            </>
        )
    },
    ranked: {
        // RANKED ELITE: Shield-like aesthetics with sharp edges
        p: <path d="M50 25 L65 40 L60 80 L40 80 L35 40 Z M50 25 L50 80" />,
        n: <path d="M30 80 L70 80 L65 60 L75 35 L60 20 L40 20 L35 40 L25 35 L25 60 Z M45 35 L50 35 M50 20 L50 80" />,
        b: <path d="M50 10 L65 30 L60 80 L40 80 L35 30 Z M50 10 L50 80 M40 40 L60 40" />,
        r: <path d="M30 80 L70 80 L65 60 L70 20 L60 20 L60 25 L50 25 L50 20 L40 20 L40 25 L30 25 L35 60 Z M35 60 L65 60" />,
        q: <path d="M50 10 L60 30 L80 25 L70 50 L75 80 L25 80 L30 50 L20 25 L40 30 Z M50 10 L50 80 M50 50 L70 50 M50 50 L30 50" />,
        k: <path d="M50 5 L60 25 L75 25 L65 40 L70 80 L30 80 L35 40 L25 25 L40 25 Z M50 5 L50 80 M40 50 L60 50 M50 30 L50 10" />
    },
    cyber2: {
        // CYBERMYTICA 2: Detailed mech/armor style
        p: (
            <>
                <path className="piece-silhouette" d="M35,85 L65,85 L60,75 Q70,70 70,55 L65,45 Q70,35 70,25 L60,15 L50,5 L40,15 L30,25 Q30,35 35,45 L30,55 Q30,70 40,75 Z" />
                <g className="piece-runes">
                    <path d="M45,15 L55,15 M50,20 L50,30 M35,45 L40,50 L35,55 M65,45 L60,50 L65,55 M40,75 L60,75 M45,80 L55,80" />
                    <circle cx="50" cy="35" r="2" />
                </g>
            </>
        ),
        r: (
            <>
                <path className="piece-silhouette" d="M25,85 L75,85 L70,75 L70,35 L80,35 L75,10 L65,10 L65,20 L55,20 L55,10 L45,10 L45,20 L35,20 L35,10 L25,10 L20,35 L30,35 L30,75 Z" />
                <g className="piece-runes">
                    <path d="M30,15 L35,15 M45,15 L55,15 M65,15 L70,15 M35,40 L65,40 M40,50 L40,65 M60,50 L60,65 M30,75 L70,75 M28,80 L72,80" />
                    <rect x="45" y="50" width="10" height="10" />
                </g>
            </>
        ),
        n: (
            <>
                <path className="piece-silhouette" d="M30,85 L75,85 L70,75 Q75,55 70,40 Q80,30 85,15 L70,5 L55,15 L35,10 Q20,10 15,25 L25,35 Q20,50 25,65 L20,75 Z" />
                <g className="piece-runes">
                    <circle cx="40" cy="22" r="3" />
                    <path d="M35,30 L45,30 M18,25 L25,28" />
                    <path d="M55,18 L65,12 M60,30 L70,25 M65,45 L75,40 M40,75 L65,75 M35,80 L70,80" />
                </g>
            </>
        ),
        b: (
            <>
                <path className="piece-silhouette" d="M35,85 L70,85 L65,75 Q75,60 70,40 L75,20 L55,5 L45,5 L25,20 L30,40 Q25,60 35,75 Z" />
                <g className="piece-runes">
                    <path d="M45,15 L55,15 M50,20 L50,35 M40,45 L60,45 M42,55 L58,55 M38,75 L62,75 M40,80 L60,80" />
                    <circle cx="50" cy="28" r="2.5" />
                    <path d="M48,8 L52,8" strokeWidth="2"/>
                </g>
            </>
        ),
        q: (
            <>
                <path className="piece-silhouette" d="M30,85 L75,85 L70,75 Q80,65 75,40 L85,25 L70,25 L65,10 L55,15 L50,5 L45,15 L35,10 L30,25 L15,25 L25,40 Q20,65 30,75 Z" />
                <g className="piece-runes">
                    <path d="M50,10 L50,25 M35,15 L35,30 M65,15 L65,30 M20,28 L30,35 M80,28 L70,35" />
                    <path d="M40,50 L60,50 M45,60 L55,60 M35,75 L65,75 M32,80 L68,80" />
                    <circle cx="50" cy="40" r="3" />
                </g>
            </>
        ),
        k: (
            <>
                <path className="piece-silhouette" d="M25,85 L80,85 L75,75 Q85,65 80,45 L90,30 L70,30 L70,15 L75,10 L65,10 L65,5 L55,5 L50,0 L45,5 L35,5 L35,10 L25,10 L30,15 L30,30 L10,30 L20,45 Q15,65 25,75 Z" />
                <g className="piece-runes">
                    <path d="M50,2 L50,15 M35,8 L65,8 M40,15 L60,15" />
                    <path d="M15,35 L30,35 M85,35 L70,35 M40,45 L60,45 M45,55 L55,55 M30,75 L75,75 M28,80 L77,80" />
                    <rect x="45" y="38" width="10" height="10" transform="rotate(45 50 43)"/>
                </g>
            </>
        )
    }
};

// Standalone Rook Shape for UI Icons (Navigation/Home)
export const RookShapeUI = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="currentColor">
         <path d="M30 80 L70 80 L66 65 L34 65 Z M36 65 L38 30 L62 30 L64 65 Z M30 30 L70 30 L70 12 L60 12 L60 18 L52 18 L52 12 L48 12 L48 18 L40 18 L40 12 L30 12 Z" />
    </svg>
);

export const LogoShapeUI = ({ className }: { className?: string }) => (
    <div className={`rounded-xl flex items-center justify-center shadow-lg ${className}`} style={{ background: 'linear-gradient(135deg, var(--primary), var(--app-bg))' }}>
        <RookShapeUI className="w-6 h-6 text-white fill-current" />
    </div>
);

export const PieceIcons: Record<string, React.FC<PieceProps>> = {
  p: (props) => {
      const set = props.set || 'standard';
      const Container = set === 'retro' ? RetroPiece : set === 'neon' ? NeonPiece : set === 'ranked' ? RankedPiece : set === 'cyber2' ? Cybermytica2Piece : StandardPiece;
      return <Container {...props}>{PIECE_PATHS[set].p}</Container>;
  },
  n: (props) => {
      const set = props.set || 'standard';
      const Container = set === 'retro' ? RetroPiece : set === 'neon' ? NeonPiece : set === 'ranked' ? RankedPiece : set === 'cyber2' ? Cybermytica2Piece : StandardPiece;
      return <Container {...props}>{PIECE_PATHS[set].n}</Container>;
  },
  b: (props) => {
      const set = props.set || 'standard';
      const Container = set === 'retro' ? RetroPiece : set === 'neon' ? NeonPiece : set === 'ranked' ? RankedPiece : set === 'cyber2' ? Cybermytica2Piece : StandardPiece;
      return <Container {...props}>{PIECE_PATHS[set].b}</Container>;
  },
  r: (props) => {
      const set = props.set || 'standard';
      const Container = set === 'retro' ? RetroPiece : set === 'neon' ? NeonPiece : set === 'ranked' ? RankedPiece : set === 'cyber2' ? Cybermytica2Piece : StandardPiece;
      return <Container {...props}>{PIECE_PATHS[set].r}</Container>;
  },
  q: (props) => {
      const set = props.set || 'standard';
      const Container = set === 'retro' ? RetroPiece : set === 'neon' ? NeonPiece : set === 'ranked' ? RankedPiece : set === 'cyber2' ? Cybermytica2Piece : StandardPiece;
      return <Container {...props}>{PIECE_PATHS[set].q}</Container>;
  },
  k: (props) => {
      const set = props.set || 'standard';
      const Container = set === 'retro' ? RetroPiece : set === 'neon' ? NeonPiece : set === 'ranked' ? RankedPiece : set === 'cyber2' ? Cybermytica2Piece : StandardPiece;
      return <Container {...props}>{PIECE_PATHS[set].k}</Container>;
  }
};
