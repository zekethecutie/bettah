
import React from 'react';

// Ranking Configuration
// ELO ranges for each tier. Each tier (except Ascendant) has 5 divisions.
// Example: Gold is 1600-1999. Range is 400. 400/5 = 80 pts per division.
// Gold V: 1600-1679
// Gold IV: 1680-1759
// ...
// Gold I: 1920-1999

export type RankTier = 'Iron' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Ascendant';

export interface RankConfig {
    name: RankTier;
    minElo: number;
    range: number; // Total points in this tier
    color: string;
    gradient: string[];
    shadow: string;
    accent: string;
}

export const RANK_CONFIGS: RankConfig[] = [
    { name: 'Iron', minElo: 0, range: 800, color: '#71717a', gradient: ['#3f3f46', '#18181b'], shadow: 'rgba(113, 113, 122, 0.3)', accent: '#a1a1aa' },
    { name: 'Bronze', minElo: 800, range: 400, color: '#cd7f32', gradient: ['#9a3412', '#451a03'], shadow: 'rgba(205, 127, 50, 0.4)', accent: '#fdba74' },
    { name: 'Silver', minElo: 1200, range: 400, color: '#e4e4e7', gradient: ['#d4d4d8', '#71717a'], shadow: 'rgba(228, 228, 231, 0.5)', accent: '#ffffff' },
    { name: 'Gold', minElo: 1600, range: 400, color: '#fbbf24', gradient: ['#f59e0b', '#b45309'], shadow: 'rgba(251, 191, 36, 0.6)', accent: '#fde68a' },
    { name: 'Platinum', minElo: 2000, range: 400, color: '#22d3ee', gradient: ['#06b6d4', '#0e7490'], shadow: 'rgba(34, 211, 238, 0.7)', accent: '#a5f3fc' },
    { name: 'Diamond', minElo: 2400, range: 400, color: '#818cf8', gradient: ['#6366f1', '#312e81'], shadow: 'rgba(129, 140, 248, 0.8)', accent: '#c7d2fe' },
    { name: 'Ascendant', minElo: 2800, range: 9999, color: '#f43f5e', gradient: ['#e11d48', '#881337'], shadow: 'rgba(244, 63, 94, 0.9)', accent: '#fda4af' },
];

export interface RankDetails {
    tier: RankTier;
    division: number; // 5 to 1 (5 is lowest)
    tierName: string; // "Gold I"
    config: RankConfig;
    nextRankElo: number;
    progress: number; // 0 to 100 for current division
}

export const getRankDetails = (elo: number): RankDetails => {
    // 1. Find Tier
    // Reverse find to match highest possible tier
    let config = [...RANK_CONFIGS].reverse().find(r => elo >= r.minElo) || RANK_CONFIGS[0];
    
    // 2. Calculate Division
    // Ascendant has no divisions (always I)
    if (config.name === 'Ascendant') {
        return {
            tier: config.name,
            division: 1,
            tierName: "Ascendant",
            config,
            nextRankElo: config.minElo + 1000, // Arbitrary goal
            progress: 100
        };
    }

    // Points earned within this tier
    const pointsInTier = elo - config.minElo;
    // Points per division (e.g. 400 / 5 = 80)
    const ptsPerDiv = config.range / 5;
    
    // Div 5 = 0-79, Div 4 = 80-159...
    // 0 index is lowest (Div 5)
    const divIndex = Math.min(4, Math.floor(pointsInTier / ptsPerDiv)); 
    const division = 5 - divIndex; // Convert 0->5, 4->1

    // Points earned within current division
    const pointsInDiv = pointsInTier % ptsPerDiv;
    const progress = (pointsInDiv / ptsPerDiv) * 100;

    return {
        tier: config.name,
        division,
        tierName: `${config.name} ${["I", "II", "III", "IV", "V"][division - 1] || "V"}`,
        config,
        nextRankElo: config.minElo + ((divIndex + 1) * ptsPerDiv),
        progress
    };
};

const getRoman = (num: number) => {
    const map = ["", "I", "II", "III", "IV", "V"];
    return map[num] || "";
};

export const RankEmblem = ({ elo, className = "w-16 h-16" }: { elo: number, className?: string }) => {
    const { tier, division, config } = getRankDetails(elo);
    const id = `rank-${tier}-${division}-${Math.random().toString(36).substr(2,5)}`;
    
    // Visual Complexity based on Tier & Division
    const isHighTier = ['Platinum', 'Diamond', 'Ascendant'].includes(tier);
    const isAscendant = tier === 'Ascendant';
    
    // Division Accents: Div 5 = Simple, Div 1 = Complex
    // We add "wings" or "stars" based on division (inverted logic: 1 is best)
    const complexity = 6 - division; // 1 (Div V) to 5 (Div I)

    return (
        <svg viewBox="0 0 120 120" className={`${className} overflow-visible`} style={{ filter: `drop-shadow(0 4px 12px ${config.shadow})` }}>
            <defs>
                <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={config.gradient[0]} />
                    <stop offset="100%" stopColor={config.gradient[1]} />
                </linearGradient>
                <linearGradient id={`${id}-accent`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={config.accent} stopOpacity="0.8" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.2" />
                </linearGradient>
                {isAscendant && (
                    <radialGradient id={`${id}-glow`}>
                        <stop offset="0%" stopColor={config.color} stopOpacity="0.6" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                )}
            </defs>

            {/* --- ASCENDANT GLOW --- */}
            {isAscendant && (
                <circle cx="60" cy="60" r="50" fill={`url(#${id}-glow)`} className="animate-pulse" />
            )}

            {/* --- BACKPLATE / WINGS (Based on Complexity) --- */}
            {complexity >= 3 && (
                <path 
                    d="M10 40 Q 30 60 60 90 Q 90 60 110 40 L 100 20 Q 80 40 60 70 Q 40 40 20 20 Z" 
                    fill={config.gradient[1]} 
                    opacity="0.6" 
                    className="animate-in fade-in"
                />
            )}
            {complexity >= 5 && (
                <path 
                    d="M0 30 Q 30 20 60 5 Q 90 20 120 30 L 110 50 Q 80 40 60 25 Q 40 40 10 50 Z" 
                    fill={config.gradient[0]} 
                    stroke={config.accent} 
                    strokeWidth="1"
                />
            )}

            {/* --- MAIN SHIELD SHAPE --- */}
            <path 
                d={
                    tier === 'Iron' ? "M30 30 L90 30 L90 80 Q60 100 30 80 Z" : // Simple Shield
                    tier === 'Bronze' ? "M30 20 L90 20 L85 85 Q60 100 35 85 Z" : // Tapered
                    tier === 'Silver' ? "M30 20 L90 20 L100 50 L90 80 L60 100 L30 80 L20 50 Z" : // Hexagonal
                    tier === 'Gold' ? "M20 20 L100 20 L90 90 L60 110 L30 90 Z" : // Wide Shield
                    tier === 'Platinum' ? "M60 10 L100 30 L90 90 L60 110 L30 90 L20 30 Z" : // Gem Cut
                    tier === 'Diamond' ? "M60 5 L110 35 L85 100 L60 115 L35 100 L10 35 Z" : // Sharp Diamond
                    "M60 0 L110 25 L100 85 L60 120 L20 85 L10 25 Z" // Ascendant Spike
                }
                fill={`url(#${id})`}
                stroke={config.accent}
                strokeWidth={isHighTier ? 2 : 1}
            />

            {/* --- INNER DETAIL (Shine/Depth) --- */}
            <path 
                d={
                    tier === 'Iron' ? "M40 35 L80 35 L80 75 Q60 90 40 75 Z" :
                    tier === 'Ascendant' ? "M60 10 L100 30 L90 80 L60 105 L30 80 L20 30 Z" :
                    "M40 30 L80 30 L80 80 L60 95 L40 80 Z"
                }
                fill={`url(#${id}-accent)`}
                opacity="0.3"
            />

            {/* --- DIVISION INDICATORS (Stars/Gems) --- */}
            {tier !== 'Ascendant' && (
                <g transform="translate(60, 95)">
                    {/* Render dots based on division (inverse: Div 1 = 5 dots, Div 5 = 1 dot) */}
                    {/* Actually usually Div 1 is best, so show 5 items for Div 1? 
                        Let's show items = complexity. Div V (complexity 1) = 1 pip. Div I = 5 pips.
                    */}
                    {Array.from({length: complexity}).map((_, i) => {
                        const spread = 12;
                        const x = (i - (complexity - 1) / 2) * spread;
                        return (
                            <circle 
                                key={i} 
                                cx={x} 
                                cy="0" 
                                r={tier === 'Diamond' || tier === 'Platinum' ? 2.5 : 2} 
                                fill="white" 
                                className="drop-shadow-md"
                            />
                        );
                    })}
                </g>
            )}

            {/* --- CENTER ICON --- */}
            <g transform="translate(60, 60) scale(0.8)">
                {isAscendant ? (
                    <path d="M0 -30 L 10 -10 L 30 0 L 10 10 L 0 30 L -10 10 L -30 0 L -10 -10 Z" fill="white" className="animate-pulse" />
                ) : isHighTier ? (
                    <path d="M0 -20 L 15 0 L 0 20 L -15 0 Z" fill="white" opacity="0.9" />
                ) : (
                    <circle r="15" fill="none" stroke="white" strokeWidth="3" opacity="0.5" />
                )}
            </g>
            
            {/* Division Text (Optional, visual clarity) */}
            {!isAscendant && (
                <text x="60" y="65" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif" style={{ textShadow: '0 2px 4px black' }}>
                    {getRoman(division)}
                </text>
            )}

        </svg>
    );
};
