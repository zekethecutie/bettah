import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Book, FileText, ChevronLeft, Lock, Gavel } from 'lucide-react';

interface LegalProps {
  section: 'rules' | 'privacy' | 'terms';
  onBack: () => void;
}

const Legal: React.FC<LegalProps> = ({ section, onBack }) => {
  const content = {
    rules: {
      title: "Community Guidelines",
      icon: Book,
      color: "text-emerald-400",
      text: (
        <div className="space-y-4 text-slate-300">
            <h3 className="text-white font-bold text-lg">1. Respect & Sportsmanship</h3>
            <p>Treat all opponents with respect. No harassment, bullying, or toxic behavior in chat or forums. We have a zero-tolerance policy.</p>
            
            <h3 className="text-white font-bold text-lg">2. No Cheating</h3>
            <p>Using chess engines, bot assistance, or outside help during "Human" or "Online" matches is strictly prohibited. Our algorithms monitor move times and accuracy.</p>
            
            <h3 className="text-white font-bold text-lg">3. Content Moderation</h3>
            <p>Do not post explicit, political, or advertising content. All forum posts are filtered automatically.</p>
            
            <h3 className="text-white font-bold text-lg">4. Account Integrity</h3>
            <p>One account per person. Boosting (losing on purpose to raise another's rating) will result in a ban.</p>
        </div>
      )
    },
    privacy: {
        title: "Privacy Policy",
        icon: Lock,
        color: "text-cyan-400",
        text: (
          <div className="space-y-4 text-slate-300">
              <h3 className="text-white font-bold text-lg">Data Collection</h3>
              <p>We collect your username, email, and game history to provide the service. Match data is public (PGN, results).</p>
              
              <h3 className="text-white font-bold text-lg">Cookies</h3>
              <p>We use local storage and session cookies to keep you logged in and save your preferences.</p>
              
              <h3 className="text-white font-bold text-lg">Third Parties</h3>
              <p>We do not sell your data. We use Supabase for database services. Avatars are generated via DiceBear.</p>
          </div>
        )
    },
    terms: {
        title: "Terms of Service",
        icon: Gavel,
        color: "text-amber-400",
        text: (
          <div className="space-y-4 text-slate-300">
              <h3 className="text-white font-bold text-lg">Acceptance</h3>
              <p>By using NeonChess, you agree to these terms. We reserve the right to ban users who violate our rules.</p>
              
              <h3 className="text-white font-bold text-lg">Disclaimer</h3>
              <p>The service is provided "as is". We are not responsible for server outages or data loss during beta.</p>
              
              <h3 className="text-white font-bold text-lg">Intellectual Property</h3>
              <p>The "NeonChess" brand and UI design are protected. Users retain rights to their forum content but grant us a license to display it.</p>
          </div>
        )
    }
  };

  const active = content[section];
  const Icon = active.icon;

  return (
    <div className="w-full h-full p-8 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ChevronLeft className="w-5 h-5" /> Back
        </button>

        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 ${active.color}`}>
                    <Icon className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter">{active.title}</h1>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl">
                {active.text}
            </div>
            
            <div className="mt-8 text-center text-slate-500 text-xs">
                Last updated: {new Date().toLocaleDateString()} &bull; NeonChess Inc.
            </div>
        </div>
    </div>
  );
};

export default Legal;