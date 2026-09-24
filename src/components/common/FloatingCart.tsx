import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Language } from '../../types';
import { formatCurrency } from '../../services/storageService';

interface FloatingCartProps {
  itemCount: number;
  totalAmount: number;
  onClick: () => void;
  language: Language;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({
  itemCount,
  totalAmount,
  onClick,
  language,
}) => {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-in slide-in-from-bottom duration-300">
      <button
        onClick={onClick}
        className="px-4 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-stone-950 shadow-2xl border-2 border-yellow-200 flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer group"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-stone-950" />
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-stone-950 text-yellow-300 font-black text-[10px] flex items-center justify-center border-2 border-yellow-400">
            {itemCount}
          </span>
        </div>
        <div className="text-left pr-1">
          <span className="text-[10px] text-stone-900 block uppercase font-black tracking-wider">
            {language === 'ta' ? 'கூடை மொத்தம்' : 'Sacred Cart'}
          </span>
          <span className="text-xs font-black text-stone-950">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </button>
    </div>
  );
};
