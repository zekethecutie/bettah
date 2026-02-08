
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User as UserIcon } from 'lucide-react';
import { Friend, ChatMessage } from '../types';
import { UserManager } from '../utils/storage';

interface ChatDrawerProps {
  friend: Friend | null;
  onClose: () => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ friend, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = UserManager.getCurrentUser();

  useEffect(() => {
      if (friend) {
          // Load initial messages
          setMessages(UserManager.getChatMessages(friend.id));
          
          // Listen for new messages (bot replies)
          const handleUpdate = (e: any) => {
              if (e.detail?.friendId === friend.id) {
                  setMessages(UserManager.getChatMessages(friend.id));
              }
          };
          window.addEventListener('chat-update', handleUpdate);
          return () => window.removeEventListener('chat-update', handleUpdate);
      }
  }, [friend]);

  // Auto-scroll to bottom
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim() || !friend) return;
      
      UserManager.sendChatMessage(friend.id, inputValue);
      setMessages(UserManager.getChatMessages(friend.id)); // Optimistic update
      setInputValue('');
  };

  return (
    <AnimatePresence>
      {friend && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div 
             initial={{ x: '100%' }}
             animate={{ x: 0 }}
             exit={{ x: '100%' }}
             transition={{ type: "spring", damping: 30, stiffness: 300 }}
             className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0f172a] border-l border-slate-800 shadow-2xl z-[70] flex flex-col"
          >
             {/* Header */}
             <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                 <div className="flex items-center gap-3">
                     <div className="relative">
                         <img src={friend.avatar} alt={friend.username} className="w-10 h-10 rounded-full bg-slate-800" />
                         <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0f172a] rounded-full ${friend.status === 'online' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                     </div>
                     <div>
                         <h3 className="font-bold text-white">{friend.username}</h3>
                         <p className="text-xs text-slate-400 capitalize">{friend.status}</p>
                     </div>
                 </div>
                 <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                     <X className="w-5 h-5" />
                 </button>
             </div>

             {/* Messages Area */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#020617]/50">
                 {messages.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                         <MessageCircleIcon className="w-12 h-12 mb-2" />
                         <p className="text-sm">Start the conversation!</p>
                     </div>
                 ) : (
                     messages.map((msg) => {
                         const isMe = msg.senderId === currentUser?.id;
                         return (
                             <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                                     isMe 
                                     ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-100 rounded-tr-none' 
                                     : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                                 }`}>
                                     {msg.text}
                                     <div className={`text-[10px] mt-1 opacity-50 ${isMe ? 'text-cyan-200' : 'text-slate-400'} text-right`}>
                                         {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                     </div>
                                 </div>
                             </div>
                         );
                     })
                 )}
                 <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className="p-4 border-t border-slate-800 bg-slate-900">
                 <form onSubmit={handleSend} className="flex gap-2">
                     <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        autoFocus
                     />
                     <button 
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
                     >
                         <Send className="w-5 h-5" />
                     </button>
                 </form>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const MessageCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
);

export default ChatDrawer;
