
import React from 'react';

// "NexusChess" - Masterful Graphic Design Icons
// Uses Global IDs defined in App.tsx

interface PieceBaseProps {
  className?: string;
  children?: React.ReactNode;
  color: 'w' | 'b';
}

const PieceBase = ({ className, children, color }: PieceBaseProps) => {
  const gradId = `chess-grad-${color}`;
  const filterId = `chess-shadow-${color}`;
  
  const strokeColor = color === 'w' ? '#94a3b8' : '#0f172a';
  const strokeWidth = color === 'w' ? "1.5" : "1";
  
  // Fallback solid fill if gradient fails to load
  const fallbackFill = color === 'w' ? '#e2e8f0' : '#1e293b';

  return (
    <svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible' }}>
      <g filter={`url(#${filterId})`}>
         {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                    fill: `url(#${gradId})`,
                    // Add style as fallback mechanism
                    style: { fill: `url(#${gradId})`,  '--fallback': fallbackFill } as React.CSSProperties,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
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

// Standalone Rook Shape for UI Icons (Navigation/Home)
export const RookShapeUI = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
         {/* Tall Tower Silhouette */}
         <path d="M30 80 L70 80 L66 65 L34 65 Z M36 65 L38 30 L62 30 L64 65 Z M30 30 L70 30 L70 12 L60 12 L60 18 L52 18 L52 12 L48 12 L48 18 L40 18 L40 12 L30 12 Z" />
    </svg>
);

export const PieceIcons: Record<string, React.FC<{ className?: string, color: 'w' | 'b' }>> = {
  p: ({ className, color }) => (
    <PieceBase className={className} color={color}>
      {/* Pawn: Futuristic Soldier / Drone */}
      <path d="M50 20 C42 20 38 26 38 32 C38 38 42 42 45 44 C42 48 35 62 32 75 L68 75 C65 62 58 48 55 44 C58 42 62 38 62 32 C62 26 58 20 50 20 Z" />
      <circle cx="50" cy="28" r="3" fill="rgba(0,0,0,0.2)" stroke="none" />
    </PieceBase>
  ),
  n: ({ className, color }) => (
    <PieceBase className={className} color={color}>
      {/* Knight: The Fierce Stallion (Redesigned) */}
      
      {/* Base */}
      <path d="M25 78 L 75 78 L 72 65 L 28 65 Z" />

      {/* Body/Neck - Muscular Curve */}
      <path d="M30 65 C 25 50 28 40 35 30 L 38 15 L 42 10 L 45 15 C 48 10 52 8 58 10 C 65 14 68 25 68 38 C 70 48 72 58 72 65 L 30 65" />
      
      {/* Snout - Flat Horse Nose */}
      <path d="M35 30 L 22 35 L 20 42 L 32 45 L 35 38" />

      {/* Mane - Cyber Spikes */}
      <path d="M58 10 L 62 18 L 60 25 L 66 32 L 64 42" fill="none" strokeWidth="2" stroke={color === 'w' ? '#cbd5e1' : '#334155'} />

      {/* Eye - Aggressive Slit */}
      <path d="M38 22 L 46 24" strokeWidth="2" stroke={color === 'w' ? '#38bdf8' : '#f43f5e'} />
      
      {/* Ear */}
      <path d="M42 10 L 44 4 L 48 10" strokeWidth="1.5" />
    </PieceBase>
  ),
  b: ({ className, color }) => (
    <PieceBase className={className} color={color}>
      {/* Bishop: High Tech Spire / Laser Cannon */}
      <path d="M50 8 L38 28 L36 65 L28 75 L72 75 L64 65 L62 28 L50 8 Z" />
      <path d="M50 25 L50 55" strokeWidth="2" stroke={color === 'w' ? '#cbd5e1' : '#334155'} />
      <path d="M40 40 L60 40" strokeWidth="2" stroke={color === 'w' ? '#cbd5e1' : '#334155'} />
      <circle cx="50" cy="18" r="3" fill="rgba(0,0,0,0.2)" stroke="none" />
    </PieceBase>
  ),
  r: ({ className, color }) => (
    <PieceBase className={className} color={color}>
       {/* Rook: Tall Tower / Monolith - Refined */}
       
       {/* Base */}
       <path d="M30 80 L70 80 L66 65 L34 65 Z" /> 
       {/* Shaft - Tapering Upward slightly */}
       <path d="M36 65 L38 30 L62 30 L64 65 Z" /> 
       
       {/* Turret Head with Crenellations */}
       <path d="M30 30 L70 30 L70 12 L60 12 L60 18 L52 18 L52 12 L48 12 L48 18 L40 18 L40 12 L30 12 Z" />
       
       {/* 3D Detail Lines */}
       <path d="M36 65 L64 65" stroke={color === 'w' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'} strokeWidth="1" />
       <path d="M30 30 L70 30" stroke={color === 'w' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'} strokeWidth="1" />
       
       {/* Vertical Energy Slit */}
       <path d="M50 38 L50 58" stroke={color === 'w' ? '#38bdf8' : '#f43f5e'} strokeWidth="2" strokeLinecap="round" />
    </PieceBase>
  ),
  q: ({ className, color }) => (
    <PieceBase className={className} color={color}>
      {/* Queen: The Matriarch / Crowned Star */}
      <path d="M50 10 L58 30 L76 22 L68 42 L74 75 L26 75 L32 42 L24 22 L42 30 L50 10 Z" />
      <circle cx="50" cy="8" r="3" fill={color === 'w' ? '#e0f2fe' : '#fecdd3'} />
      <circle cx="24" cy="22" r="2" />
      <circle cx="76" cy="22" r="2" />
      <path d="M50 45 L50 65" strokeWidth="1" stroke="rgba(0,0,0,0.2)" />
    </PieceBase>
  ),
  k: ({ className, color }) => (
    <PieceBase className={className} color={color}>
      {/* King: The Commander - Epic Cross Design */}
      
      {/* Heavy Base */}
      <path d="M25 80 L75 80 L70 65 L30 65 Z" />
      
      {/* Main Body Column */}
      <path d="M35 65 L35 35 L65 35 L65 65 Z" />
      
      {/* Shoulder Armor / Cape */}
      <path d="M35 35 L20 45 L20 55 L30 65" fill="none" strokeWidth="2" />
      <path d="M65 35 L80 45 L80 55 L70 65" fill="none" strokeWidth="2" />

      {/* The Crown Rim */}
      <path d="M32 35 L68 35 L72 25 L58 28 L50 22 L42 28 L28 25 Z" />

      {/* The Epic Cross - Distinct from Bishop */}
      <path d="M50 5 L50 22" strokeWidth="3" />
      <path d="M42 12 L58 12" strokeWidth="3" />
      
      {/* Central Gem */}
      <rect x="46" y="45" width="8" height="10" rx="1" fill={color === 'w' ? '#38bdf8' : '#f43f5e'} stroke="none" />
      
      {/* Vertical Line Detail */}
      <path d="M50 55 L50 65" stroke="rgba(0,0,0,0.2)" />
    </PieceBase>
  )
};
