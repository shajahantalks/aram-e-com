import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Language } from '../../types';

interface WhatsAppButtonProps {
  language: Language;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMsg = encodeURIComponent(
    'Vanakkam Aram Brand! I am browsing your online store and would like to inquire about authentic temple crafts and orders.'
  );
  const whatsappUrl = `https://wa.me/919840012345?text=${defaultMsg}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Tooltip Popup */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-emerald-300 p-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                🪔
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Aram Brand Heritage Desk</p>
                <p className="text-[10px] text-emerald-600 font-semibold">● Online • Fast Response</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed mb-3">
            {language === 'ta'
              ? 'வணக்கம்! கோவில் பூஜை பொருட்கள் அல்லது ஆர்டர்கள் குறித்த உதவிக்கு எங்களை தொடர்பு கொள்ளவும்.'
              : 'Vanakkam! Need assistance selecting authentic brass lamps, silks, or tracking your order?'}
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{language === 'ta' ? 'வாட்ஸ்அப்பில் பேசுக' : 'Start WhatsApp Chat'}</span>
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 relative group cursor-pointer"
        title="Chat on WhatsApp"
        aria-label="WhatsApp Support"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full"></span>
      </button>
    </div>
  );
};
