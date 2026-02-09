
import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
    // --- BOARD THEMES ---
    {
        id: 'board_classic',
        name: 'Nexus Slate',
        description: 'The standard issue high-contrast board.',
        price: 0,
        type: 'board_theme',
        rarity: 'common',
        config: { light: 'bg-[#334155]', dark: 'bg-[#1e293b]' }
    },
    {
        id: 'board_emerald',
        name: 'Emerald City',
        description: 'A soothing green palette for focused minds.',
        price: 500,
        type: 'board_theme',
        rarity: 'common',
        config: { light: 'bg-emerald-800/30', dark: 'bg-emerald-900/60' }
    },
    {
        id: 'board_ocean',
        name: 'Deep Ocean',
        description: 'Dive deep with these azure tones.',
        price: 1200,
        type: 'board_theme',
        rarity: 'rare',
        config: { light: 'bg-cyan-900/30', dark: 'bg-blue-950/80' }
    },
    {
        id: 'board_purple',
        name: 'Nebula',
        description: 'Play amongst the stars.',
        price: 1500,
        type: 'board_theme',
        rarity: 'rare',
        config: { light: 'bg-purple-900/30', dark: 'bg-[#1e1b4b]' }
    },
    {
        id: 'board_gold',
        name: 'Midas Touch',
        description: 'For the grandmasters of wealth.',
        price: 5000,
        type: 'board_theme',
        rarity: 'legendary',
        config: { light: 'bg-amber-700/20', dark: 'bg-yellow-900/40' }
    },
    
    // --- PIECE SETS (Future Implementation hooks) ---
    {
        id: 'pieces_standard',
        name: 'Nexus Standard',
        description: 'Futuristic vector pieces.',
        price: 0,
        type: 'piece_set',
        rarity: 'common',
    },
    {
        id: 'pieces_neon',
        name: 'Cyber Neon',
        description: 'Glowing edges for night play.',
        price: 2500,
        type: 'piece_set',
        rarity: 'epic',
    }
];

export const getItem = (id: string) => SHOP_ITEMS.find(i => i.id === id);
