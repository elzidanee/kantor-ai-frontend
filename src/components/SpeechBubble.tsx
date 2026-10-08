import React from 'react';
import { Lightbulb, Hourglass, Coffee, Moon, Sparkles, AlertCircle, Bath, Laptop } from 'lucide-react';

interface SpeechBubbleProps {
  text: string;
  type?: string;
  onClick?: () => void;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, type = 'IDLE', onClick }) => {
  const getIcon = () => {
    switch (type) {
      case 'WORKING':
        return <Laptop className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />;
      case 'THINKING':
        return <Lightbulb className="w-3.5 h-3.5 text-amber-400 animate-bounce" />;
      case 'WAITING':
        return <Hourglass className="w-3.5 h-3.5 text-indigo-400" />;
      case 'RESTING':
        return <Coffee className="w-3.5 h-3.5 text-emerald-400" />;
      case 'PRAYING':
        return <Sparkles className="w-3.5 h-3.5 text-teal-300" />;
      case 'TOILET':
        return <Bath className="w-3.5 h-3.5 text-sky-400" />;
      case 'OFFLINE':
        return <Moon className="w-3.5 h-3.5 text-slate-400" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const getStyle = () => {
    switch (type) {
      case 'WORKING':
        return 'border-cyan-500/50 bg-slate-900/95 text-cyan-100 shadow-[0_4px_20px_rgba(6,182,212,0.25)]';
      case 'THINKING':
        return 'border-amber-500/50 bg-slate-900/95 text-amber-100 shadow-[0_4px_20px_rgba(245,158,11,0.25)]';
      case 'WAITING':
        return 'border-indigo-500/50 bg-slate-900/95 text-indigo-100 shadow-[0_4px_20px_rgba(99,102,241,0.25)]';
      case 'RESTING':
        return 'border-emerald-500/50 bg-slate-900/95 text-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.25)]';
      case 'PRAYING':
        return 'border-teal-500/50 bg-slate-900/95 text-teal-100 shadow-[0_4px_20px_rgba(20,184,166,0.25)]';
      case 'TOILET':
        return 'border-sky-500/50 bg-slate-900/95 text-sky-100 shadow-[0_4px_20px_rgba(14,165,233,0.25)]';
      case 'OFFLINE':
        return 'border-slate-700 bg-slate-900/95 text-slate-300 shadow-lg';
      default:
        return 'border-slate-700/80 bg-slate-900/95 text-slate-100 shadow-xl';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer animate-float relative z-30 max-w-[220px] px-3 py-2 rounded-2xl border backdrop-blur-md transition-all duration-200 hover:scale-105 hover:z-40 ${getStyle()}`}
      title={text}
    >
      <div className="flex items-start gap-2">
        <div className="shrink-0 mt-0.5 p-1 rounded-lg bg-white/10 flex items-center justify-center">
          {getIcon()}
        </div>
        <p className="text-[11px] leading-snug font-medium line-clamp-2 select-none tracking-tight">
          {text}
        </p>
      </div>

      {/* Comic Balloon Tail pointing downwards */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-inherit bg-inherit" />
    </div>
  );
};
