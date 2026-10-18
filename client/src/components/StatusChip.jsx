import React from 'react';

export default function StatusChip({ status }) {
  const getStyles = () => {
    switch (status) {
      case 'Submitted':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Reviewing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shortlisted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Accepted':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'accepted':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'declined':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}>
      <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
        status === 'Submitted' ? 'bg-slate-400' :
        status === 'Reviewing' ? 'bg-blue-500' :
        status === 'Shortlisted' ? 'bg-emerald-500' :
        status === 'Rejected' ? 'bg-rose-500' :
        status === 'Accepted' || status === 'accepted' ? 'bg-teal-500' :
        status === 'pending' ? 'bg-amber-500' : 'bg-slate-400'
      }`} />
      {status}
    </span>
  );
}
