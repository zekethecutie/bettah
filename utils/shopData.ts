
import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
    // --- BOARD THEMES ---
    {
        id: 'board_classic',
        name: 'Nexus Slate',
        description: 'The standard issue high-contrast look.',
        price: 0,
        type: 'board_theme',
        rarity: 'common',
        previewGradient: 'from-slate-700 to-slate-900',
        config: { 
            light: 'bg-[#334155]', 
            dark: 'bg-[#1e293b]',
            // Global Palette (Default)
            appBg: '#020617', 
            sidebarBg: 'rgba(2, 6, 23, 0.8)',
            panelBg: 'rgba(15, 23, 42, 0.6)', // slate-900/60
            elementBg: 'rgba(30, 41, 59, 0.8)', // slate-800
            borderColor: 'rgba(51, 65, 85, 0.5)', // slate-700
            accentColor: '#22d3ee', 
            textColor: '#ffffff',
            // Custom prop for fallback
            moveIndicatorColor: '#22d3ee',
            checkColor: '#f43f5e'
        }
    },
    {
        id: 'board_midnight',
        name: 'Midnight Wood',
        description: 'Warm, sophisticated, and cozy.',
        price: 300,
        type: 'board_theme',
        rarity: 'common',
        previewGradient: 'from-amber-900 to-slate-950',
        config: { 
            light: 'bg-[#78350f]', 
            dark: 'bg-[#451a03]',
            // Global Palette
            appBg: '#1c100b', 
            sidebarBg: 'rgba(42, 23, 16, 0.95)',
            panelBg: 'rgba(67, 20, 7, 0.4)',
            elementBg: 'rgba(120, 53, 15, 0.3)',
            borderColor: 'rgba(146, 64, 14, 0.3)',
            accentColor: '#d97706',
            textColor: '#fef3c7',
            moveIndicatorColor: '#fbbf24',
            checkColor: '#ef4444'
        }
    },
    {
        id: 'board_cyber',
        name: 'Cyberpunk 2077',
        description: 'High voltage neon grid. Hacker terminal aesthetic.',
        price: 1500,
        type: 'board_theme',
        rarity: 'epic',
        previewGradient: 'from-pink-600 via-purple-600 to-cyan-600',
        config: { 
            light: 'bg-slate-900 border border-pink-500/20 shadow-[inset_0_0_10px_rgba(236,72,153,0.1)]', 
            dark: 'bg-black border border-cyan-500/20 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)]',
            // Global Palette
            appBg: '#050505',
            sidebarBg: 'rgba(10, 10, 15, 0.95)',
            panelBg: 'rgba(20, 20, 30, 0.8)',
            elementBg: 'rgba(236, 72, 153, 0.1)',
            borderColor: 'rgba(217, 70, 239, 0.3)',
            accentColor: '#d946ef',
            textColor: '#e879f9',
            moveIndicatorColor: '#d946ef',
            checkColor: '#ff0000',
            boardBorder: '1px solid #d946ef'
        }
    },
    {
        id: 'board_glass',
        name: 'Aero Glass',
        description: 'Clean, minimal, and weightless.',
        price: 1200,
        type: 'board_theme',
        rarity: 'rare',
        previewGradient: 'from-cyan-500/50 to-blue-500/50',
        config: { 
            light: 'bg-white/10 backdrop-blur-md border border-white/20', 
            dark: 'bg-black/20 backdrop-blur-md border border-white/5',
            // Global Palette
            appBg: '#0f172a', // Deep blue-grey
            sidebarBg: 'rgba(255, 255, 255, 0.05)',
            panelBg: 'rgba(255, 255, 255, 0.03)',
            elementBg: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            accentColor: '#38bdf8',
            textColor: '#f0f9ff',
            moveIndicatorColor: '#ffffff',
            checkColor: '#f43f5e'
        }
    },
    {
        id: 'board_void',
        name: 'The Void',
        description: 'Absolute darkness. Monochrome mastery.',
        price: 2000,
        type: 'board_theme',
        rarity: 'epic',
        previewGradient: 'from-gray-900 to-black',
        config: { 
            light: 'bg-neutral-800', 
            dark: 'bg-black',
            // Global Palette
            appBg: '#000000',
            sidebarBg: 'rgba(5, 5, 5, 1)',
            panelBg: 'rgba(20, 20, 20, 1)',
            elementBg: 'rgba(40, 40, 40, 1)',
            borderColor: 'rgba(60, 60, 60, 1)',
            accentColor: '#ffffff',
            textColor: '#ffffff',
            moveIndicatorColor: '#525252',
            checkColor: '#991b1b'
        }
    },
    {
        id: 'board_gold',
        name: 'Midas Touch',
        description: 'Pure luxury. Turns everything to gold.',
        price: 5000,
        type: 'board_theme',
        rarity: 'legendary',
        previewGradient: 'from-yellow-300 via-amber-500 to-yellow-600',
        config: { 
            light: 'bg-amber-100', 
            dark: 'bg-gradient-to-br from-amber-400 to-amber-600',
            // Global Palette
            appBg: '#1a1200',
            sidebarBg: 'rgba(40, 30, 0, 0.95)',
            panelBg: 'rgba(60, 45, 0, 0.6)',
            elementBg: 'rgba(251, 191, 36, 0.1)',
            borderColor: 'rgba(251, 191, 36, 0.4)',
            accentColor: '#fbbf24',
            textColor: '#fde68a',
            moveIndicatorColor: '#f59e0b',
            checkColor: '#dc2626'
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
        name: '8-Bit Kingdom',
        description: 'Pixel art pieces for the nostalgic tactician.',
        price: 1000,
        type: 'piece_set',
        rarity: 'rare',
        pieceSetId: 'retro',
        previewGradient: 'from-indigo-500 to-purple-600'
    },
    {
        id: 'pieces_neon',
        name: 'Laser Grid',
        description: 'Glowing wireframe pieces that cut through the dark.',
        price: 2500,
        type: 'piece_set',
        rarity: 'epic',
        pieceSetId: 'neon',
        previewGradient: 'from-green-400 to-cyan-500'
    },

    // --- CURRENCY BUNDLES ---
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
