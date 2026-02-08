
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, X, Send, Video, Mic, Activity } from 'lucide-react';

interface LiveStreamOverlayProps {
  isStreaming: boolean;
  onStopStream: () => void;
  viewerCount: number;
}

// Mock Chat Generator
const MOCK_NAMES = ["ChessFan123", "GrandmasterWannabe", "PawnStar", "RookNRoll", "CheckMatey", "BishopBasher"];
const MOCK_COMMENTS = [
    "What a move!", "Is that blunder?", "GG", "Wow", "Analyzing...", "Stream looks good!", 
    "Can you explain that?", "Unbelievable!", "Sacrifice the Queen!", "Hello from Brazil 🇧🇷"
];

const LiveStreamOverlay: React.FC<LiveStreamOverlayProps> = ({ isStreaming, onStopStream, viewerCount }) => {
  const [messages, setMessages] = useState<{id: string, user: string, text: string}[]>([]);
  const [minimized, setMinimized] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Generate Chat
  useEffect(() => {
      let interval: number;
      if (isStreaming) {
          interval = window.setInterval(() => {
              if (Math.random() > 0.6) {
                  const newMsg = {
                      id: Math.random().toString(),
                      user: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
                      text: MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)]
                  };
                  setMessages(prev => [...prev.slice(-15), newMsg]); // Keep last 15
              }
          }, 2000);
      }
      return () => clearInterval(interval);
  }, [isStreaming]);

  // Auto Scroll
  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isStreaming) return null;

  return (
    <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="fixed top-24 right-4 z-50 flex flex-col gap-2 pointer-events-none" // pointer-events-none to let clicks pass through empty space
    >
        {/* Stream Status Badge */}
        <div className="bg-red-600 text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 animate-pulse pointer-events-auto w-fit self-end">
            <span className="w-2 h-2 bg-white rounded-full" />
            LIVE
        </div>

        {/* Viewer Count */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 pointer-events-auto w-fit self-end">
            <Users className="w-3 h-3" />
            {viewerCount.toLocaleString()} Viewers
        </div>

        {/* Chat Box */}
        <div className={`bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all pointer-events-auto ${minimized ? 'w-12 h-12 rounded-full cursor-pointer' : 'w-72 h-80'}`}>
            {minimized ? (
                <button onClick={() => setMinimized(false)} className="w-full h-full flex items-center justify-center text-cyan-400 hover:bg-white/10">
                    <MessageSquare className="w-5 h-5" />
                </button>
            ) : (
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <span className="text-xs font-bold text-slate-400 uppercase">Stream Chat</span>
                        <div className="flex gap-2">
                            <button onClick={() => setMinimized(true)} className="p-1 hover:text-white text-slate-500"><Activity className="w-3 h-3" /></button>
                            <button onClick={onStopStream} className="p-1 hover:text-rose-500 text-slate-500" title="End Stream"><X className="w-3 h-3" /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {messages.map(msg => (
                            <div key={msg.id} className="text-xs">
                                <span className="font-bold text-cyan-400 mr-1">{msg.user}:</span>
                                <span className="text-slate-200">{msg.text}</span>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input (Disabled/Mock) */}
                    <div className="p-2 border-t border-slate-800">
                        <div className="bg-slate-900 rounded-lg p-2 flex items-center gap-2 opacity-50">
                            <input disabled placeholder="Chat is read-only..." className="bg-transparent border-none outline-none text-xs text-white w-full" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    </motion.div>
  );
};

export default LiveStreamOverlay;
