import { Chess, Square } from 'chess.js';

export const getSquareColor = (fileIndex: number, rankIndex: number): 'light' | 'dark' => {
  const isDark = (fileIndex + rankIndex) % 2 === 1;
  return isDark ? 'dark' : 'light';
};

export const getPieceAt = (game: Chess, square: Square) => {
  return game.get(square);
};

// --- PRO AUDIO ENGINE ---
// Avoids recreating AudioContext constantly to prevent garbage collection glitches
let audioCtx: AudioContext | null = null;

const initAudio = () => {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

// Generates white noise buffer
const createNoiseBuffer = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 0.1; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
};

export const playSound = (type: 'move' | 'capture' | 'check' | 'start' | 'game-over') => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const t = ctx.currentTime;

    // RANDOM VARIANCE for organic feel (never sounds exactly the same)
    const pitchVar = 1 + (Math.random() - 0.5) * 0.15; // +/- 7.5% pitch
    const toneVar = (Math.random() - 0.5) * 100; // Filter variance

    if (type === 'move') {
        // High fidelity wooden thud
        // Layer 1: The "Knock" (Triangle wave with rapid decay)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(180 * pitchVar, t);
        osc1.frequency.exponentialRampToValueAtTime(60 * pitchVar, t + 0.1);
        gain1.gain.setValueAtTime(0.5, t);
        gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(t);
        osc1.stop(t + 0.15);

        // Layer 2: The "Body" (Sine wave for weight)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(80 * pitchVar, t);
        osc2.frequency.linearRampToValueAtTime(40, t + 0.15);
        gain2.gain.setValueAtTime(0.3, t);
        gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(t);
        osc2.stop(t + 0.15);

        // Layer 3: Texture (Filtered noise for surface contact)
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx);
        const noiseFilter = ctx.createBiquadFilter();
        const noiseGain = ctx.createGain();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 800 + toneVar;
        noiseGain.gain.setValueAtTime(0.2, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(t);

    } else if (type === 'capture') {
        // Aggressive, sharp impact
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'square'; // Rich harmonics
        osc1.frequency.setValueAtTime(200 * pitchVar, t);
        osc1.frequency.exponentialRampToValueAtTime(50, t + 0.15);
        gain1.gain.setValueAtTime(0.15, t);
        gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        const noise = ctx.createBufferSource();
        const noiseFilter = ctx.createBiquadFilter();
        const noiseGain = ctx.createGain();
        noise.buffer = createNoiseBuffer(ctx);
        noiseFilter.type = 'highpass'; 
        noiseFilter.frequency.value = 1500 + toneVar; // Snap sound
        noiseGain.gain.setValueAtTime(0.6, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        
        osc1.start(t);
        osc1.stop(t + 0.2);
        noise.start(t);

    } else if (type === 'check') {
       // Ominous bell/chime
       const osc1 = ctx.createOscillator();
       const osc2 = ctx.createOscillator();
       const gain = ctx.createGain();
       
       // Dissonant interval
       osc1.type = 'triangle';
       osc1.frequency.setValueAtTime(440, t);
       osc2.type = 'sine';
       osc2.frequency.setValueAtTime(450, t); // Beat frequency

       gain.gain.setValueAtTime(0.3, t);
       gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

       osc1.connect(gain);
       osc2.connect(gain);
       gain.connect(ctx.destination);

       osc1.start(t);
       osc2.start(t);
       osc1.stop(t + 1.5);

    } else if (type === 'game-over') {
         // Cinematic Boom
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.exponentialRampToValueAtTime(20, t + 2);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, t);
        filter.frequency.exponentialRampToValueAtTime(50, t + 2);

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 3);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 3.1);
    }
  } catch (e) {
    console.error("Audio error", e);
  }
};