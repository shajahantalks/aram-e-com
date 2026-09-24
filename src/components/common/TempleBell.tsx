import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { templeBell } from '../../utils/audio';

interface TempleBellProps {
  language: 'en' | 'ta';
  className?: string;
}

export const TempleBell: React.FC<TempleBellProps> = ({ language, className = '' }) => {
  const [ringing, setRinging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleRing = () => {
    setRinging(true);
    templeBell.ring();
    setTimeout(() => setRinging(false), 800);
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleRing}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yellow-400 bg-yellow-100/80 hover:bg-yellow-200/90 text-stone-900 transition-all shadow-xs cursor-pointer ${className}`}
        title={language === 'ta' ? 'கோவில் மணி ஒலிக்கவும்' : 'Ring Temple Bell'}
      >
        <span
          className={`inline-block transition-transform duration-300 ${
            ringing ? 'animate-bounce text-amber-600 scale-125' : 'group-hover:rotate-12'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-700 fill-amber-500/20" />
        </span>
        <span className="text-xs font-semibold tracking-wide">
          {language === 'ta' ? 'கோவில் மணி' : 'Temple Bell'}
        </span>
      </button>

      {showTooltip && (
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900 text-amber-100 text-[11px] px-2.5 py-1 rounded shadow-lg z-50 pointer-events-none">
          {language === 'ta' ? 'சுப துவக்கத்திற்கு மணி ஒலிக்கவும்' : 'Click to ring the bronze pooja bell'}
        </div>
      )}
    </div>
  );
};
