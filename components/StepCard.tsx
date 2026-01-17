
import React from 'react';

interface StepCardProps {
  number: string;
  title: string;
  content: string;
  isLast?: boolean;
}

export const StepCard: React.FC<StepCardProps> = ({ number, title, content, isLast }) => {
  return (
    <div className={`relative pl-8 pb-8 ${isLast ? '' : 'border-l-2 border-slate-700/50'}`}>
      <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]">
        {number}
      </div>
      <div className="glass rounded-xl p-5 hover:border-blue-500/30 transition-all duration-300">
        <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
          {title}
        </h3>
        <div className="text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none">
          {content.split('\n').map((line, i) => (
            <p key={i} className="mb-2 last:mb-0">{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
