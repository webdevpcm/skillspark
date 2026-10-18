import React from 'react';
import { Check, X } from 'lucide-react';

export default function SkillTag({ skill, variant = 'neutral', onRemove }) {
  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let icon = null;

  if (variant === 'matched') {
    styles = 'bg-teal-50 text-teal-800 border-teal-200 font-medium';
    icon = <Check className="w-3 h-3 text-teal-600 mr-1 inline" />;
  } else if (variant === 'missing') {
    styles = 'bg-rose-50 text-rose-800 border-rose-200 font-medium';
    icon = <X className="w-3 h-3 text-rose-500 mr-1 inline" />;
  } else if (variant === 'primary') {
    styles = 'bg-brand-50 text-brand-800 border-brand-200 font-medium';
  } else if (variant === 'accent') {
    styles = 'bg-amber-50 text-amber-800 border-amber-200 font-medium';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs border ${styles}`}>
      {icon}
      <span>{skill}</span>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="ml-1.5 hover:text-rose-600 focus:outline-none"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
