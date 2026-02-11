
import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
    // --- BOARD THEMES ---
    {
        id: 'board_classic',
        name: 'Nexus Slate',
        description: 'The standard issue high-contrast look. Professional and clean.',
        price: 0,
        type: 'board_theme',
        rarity: 'common',
        previewGradient: 'from-slate-700 to-slate-900',
        config: { 
            light: 'bg-[#475569]', 
            dark: 'bg-[#1e293b]',
            // Global Palette
            appBg: '#020617', 
            sidebarBg: 'rgba(15, 23, 42, 0.95)',
            panelBg: 'rgba(30, 41, 59, 0.4)', 
            elementBg: 'rgba(51, 65, 85, 0.4)', 
            borderColor: 'rgba(148, 163, 184, 0.1)', 
            accentColor: '#38bdf8', 
            textColor: '#f8fafc',
            textMuted: '#94a3b8',
            moveIndicatorColor: '#38bdf8',
            checkColor: '#f43f5e'
        }
    },
    {
        id: 'board_midnight',
        name: 'Midnight Wood',
        description: 'Deep mahogany and brass. The study of a grandmaster.',
        price: 300,
        type: 'board_theme',
        rarity: 'common',
        previewGradient: 'from-orange-900 to-slate-950',
        config: { 
            light: 'bg-[#7c2d12]', // Rich Wood Light
            dark: 'bg-[#451a03]',  // Deep Wood Dark
            // Global Palette
            appBg: 'linear-gradient(to bottom, #1a0803, #0f0502)', // Deep espresso
            sidebarBg: 'rgba(28, 10, 5, 0.95)',
            panelBg: 'rgba(67, 20, 7, 0.3)',
            elementBg: 'linear-gradient(to right, rgba(124, 45, 18, 0.2), rgba(69, 26, 3, 0.2))',
            borderColor: 'rgba(217, 119, 6, 0.2)', // Bronze border
            accentColor: '#fbbf24', // Amber gold
            textColor: '#fffbeb', // Warm white
            textMuted: '#d6d3d1',
            moveIndicatorColor: '#f59e0b',
            checkColor: '#dc2626'
        }
    },
    {
        id: 'board_cyber',
        name: 'Cyberpunk 2077',
        description: 'High voltage neon grid. Hacker terminal aesthetic.',
        price: 1500,
        type: 'board_theme',
        rarity: 'epic',
        previewGradient: 'from-fuchsia-600 via-purple-900 to-cyan-900',
        config: { 
            light: 'bg-[#1e1b4b] border border-fuchsia-500/30 shadow-[inset_0_0_15px_rgba(232,121,249,0.2)]', 
            dark: 'bg-[#020617] border border-cyan-500/30 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]',
            // Global Palette
            appBg: 'radial-gradient(circle at 50% 0%, #2e1065 0%, #020617 70%)',
            sidebarBg: 'rgba(10, 5, 20, 0.9)',
            panelBg: 'rgba(19, 7, 30, 0.7)',
            elementBg: 'rgba(255, 0, 255, 0.05)',
            borderColor: 'rgba(217, 70, 239, 0.4)', // Neon Pink Border
            accentColor: '#22d3ee', // Cyan
            textColor: '#e879f9', // Light Pink Text
            textMuted: '#a78bfa',
            moveIndicatorColor: '#00ffaa',
            checkColor: '#ff003c'
        }
    },
    {
        id: 'board_glass',
        name: 'Frutiger Aero',
        description: 'Relive the 2000s. Glossy textures, fresh grass, and aurora skies.',
        price: 1200,
        type: 'board_theme',
        rarity: 'rare',
        previewGradient: 'from-green-400 via-cyan-400 to-blue-500',
        config: { 
            // Glossy/Glassy Tiles
            // Light = Glossy White/Blue tint
            light: 'bg-gradient-to-b from-white/60 to-white/20 border-t border-white/80 shadow-[inset_0_5px_10px_rgba(255,255,255,0.5)] backdrop-blur-sm',
            // Dark = Glossy Green/Blue tint (Vista Style)
            dark: 'bg-gradient-to-b from-[#8edc9d]/80 to-[#43c6ac]/80 border-t border-white/40 shadow-[inset_0_2px_5px_rgba(255,255,255,0.3)] backdrop-blur-md',
            
            // Global Palette: Frutiger Aero (Aurora Borealis + Grass)
            // Background is a rich aurora gradient
            appBg: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)', 
            
            sidebarBg: 'rgba(255, 255, 255, 0.25)', // Milky glass
            panelBg: 'rgba(255, 255, 255, 0.35)', 
            elementBg: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.1))',
            borderColor: 'rgba(255, 255, 255, 0.6)',
            accentColor: '#0061ff', // Deep Aero Blue
            textColor: '#0f172a', // Dark text for light bg
            textMuted: '#334155',
            moveIndicatorColor: '#ffffff',
            moveIndicatorRing: '#0061ff', // Blue ring
            checkColor: '#ff0055'
        }
    },
    {
        id: 'board_void',
        name: 'The Void',
        description: 'Absolute darkness. Minimal distractions.',
        price: 2000,
        type: 'board_theme',
        rarity: 'epic',
        previewGradient: 'from-gray-900 to-black',
        config: { 
            light: 'bg-[#262626]', 
            dark: 'bg-[#0a0a0a]',
            // Global Palette
            appBg: '#000000',
            sidebarBg: '#000000',
            panelBg: '#0a0a0a',
            elementBg: '#171717',
            borderColor: '#262626',
            accentColor: '#ffffff',
            textColor: '#e5e5e5',
            textMuted: '#525252',
            moveIndicatorColor: '#525252',
            checkColor: '#7f1d1d'
        }
    },
    {
        id: 'board_gold',
        name: 'Midas Touch',
        description: 'Pure luxury. Onyx and liquid gold.',
        price: 5000,
        type: 'board_theme',
        rarity: 'legendary',
        previewGradient: 'from-yellow-300 via-amber-500 to-yellow-600',
        config: { 
            // Board: Black Marble vs Gold Leaf
            light: 'bg-gradient-to-br from-[#fcd34d] to-[#d97706] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]', 
            dark: 'bg-[#0f0f0f] border border-[#78350f] shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]',
            // Global Palette: Expensive Dark Mode
            appBg: 'radial-gradient(circle at top, #27272a 0%, #000000 100%)',
            sidebarBg: 'rgba(12, 10, 9, 0.95)',
            panelBg: 'linear-gradient(135deg, rgba(28, 25, 23, 0.9) 0%, rgba(0,0,0,0.9) 100%)',
            elementBg: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.05), rgba(0,0,0,0))', // Subtle gold tint
            borderColor: '#b45309', // Dark Gold Border
            accentColor: '#fbbf24', // Bright Gold
            textColor: '#fffbeb', // Ivory
            textMuted: '#a8a29e', // Warm Grey
            moveIndicatorColor: '#fbbf24', // Gold Dots
            moveIndicatorRing: '#000000', // Black Outline for visibility on gold squares
            checkColor: '#ef4444'
        }
    },
    
    // --- PIECE SETS ---
    {
        id: 'pieces_standard',
        name: 'Nexus Standard',
        description: 'Precision vector pieces designed for readability.',
        price: 0,
        type: 'piece_set',
        rarity: 'common',
        pieceSetId: 'standard'
    },
    {
        id: 'pieces_retro',
        name: 'Pixel Warriors',
        description: '8-Bit Kingdom style pieces. Tintable for any board.',
        price: 1000,
        type: 'piece_set',
        rarity: 'rare',
        pieceSetId: 'retro',
        previewGradient: 'from-indigo-500 to-purple-600'
    },
    {
        id: 'pieces_neon',
        name: 'Cybermytica',
        description: 'Advanced circuitry. Holographic wireframes with energy nodes.',
        price: 2500,
        type: 'piece_set',
        rarity: 'epic',
        pieceSetId: 'neon',
        previewGradient: 'from-cyan-500 to-rose-600'
    },
    {
        id: 'pieces_ranked',
        name: 'Ranked Elite',
        description: 'Forged from competitive ranks. Platinum/Diamond (White) vs Ascendant (Black).',
        price: 5000,
        type: 'piece_set',
        rarity: 'legendary',
        pieceSetId: 'ranked',
        previewGradient: 'from-blue-500 via-purple-500 to-red-500'
    },
    {
        id: 'pieces_cyber2',
        name: 'Cybermytica 2',
        description: 'Titan Blue vs Tartarus Red. The ultimate cyber-warfare set.',
        price: 8000,
        type: 'piece_set',
        rarity: 'legendary',
        pieceSetId: 'cyber2',
        previewGradient: 'from-cyan-500 via-slate-900 to-red-600'
    },

    // --- CURRENCY ---
    {
        id: 'coins_handful',
        name: 'Handful of Coins',
        description: 'A small boost to your treasury.',
        price: 0, 
        coinValue: 500,
        type: 'currency',
        rarity: 'common',
        previewGradient: 'from-amber-300 to-amber-500'
    },
    {
        id: 'coins_sack',
        name: 'Sack of Coins',
        description: 'Enough to buy a rare theme.',
        price: 0, 
        coinValue: 2000,
        type: 'currency',
        rarity: 'rare',
        previewGradient: 'from-amber-400 to-orange-600'
    },
    {
        id: 'coins_chest',
        name: 'Treasure Chest',
        description: 'Become a Nexus whale.',
        price: 0,
        coinValue: 10000,
        type: 'currency',
        rarity: 'legendary',
        previewGradient: 'from-yellow-300 via-amber-500 to-purple-600'
    }
];

export const getItem = (id: string) => SHOP_ITEMS.find(i => i.id === id);
