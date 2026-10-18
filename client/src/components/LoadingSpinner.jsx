import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm font-medium text-slate-500">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6 gap-2">
      <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
      <span className="text-sm font-medium text-slate-500">{text}</span>
    </div>
  );
}
