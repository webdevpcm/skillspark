import React from 'react';
import { Sparkles } from 'lucide-react';

export default function MatchBadge({ score, size = 'md' }) {
  if (score === undefined || score === null) return null;

  const getColor = () => {
    if (score >= 80) return 'bg-teal-50 text-teal-700 border-teal-300 ring-teal-500/20';
    if (score >= 60) return 'bg-blue-50 text-blue-700 border-blue-300 ring-blue-500/20';
    if (score >= 40) return 'bg-amber-50 text-amber-700 border-amber-300 ring-amber-500/20';
    return 'bg-slate-100 text-slate-700 border-slate-300 ring-slate-500/20';
  };

  const sizeClasses = size === 'lg' 
    ? 'px-3 py-1.5 text-sm gap-1.5' 
    : 'px-2 py-0.5 text-xs gap-1';

  return (
    <span className={`inline-flex items-center font-bold rounded-full border ring-1 ${getColor()} ${sizeClasses}`}>
      <Sparkles className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} />
      <span>{score}% Match</span>
    </span>
  );
}
