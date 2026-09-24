import React from 'react';
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Heart,
  Sparkles,
  Lock,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
} from 'lucide-react';
import { Language, Category } from '../../types';

interface FooterProps {
  language: Language;
  categories: Category[];
  onSelectCategory: (id: string) => void;
  onOpenAdmin: () => void;
  setActiveView: (view: 'home' | 'products' | 'gallery' | 'contact' | 'orders') => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  categories,
  onSelectCategory,
  onOpenAdmin,
  setActiveView,
}) => {
  return (
    <footer className="bg-[#2B180A] text-yellow-100/90 border-t-4 border-yellow-400 pt-16 pb-8 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Top Thirukkural Blessing Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-950/80 via-amber-950/70 to-yellow-950/80 border border-yellow-400/40 text-center space-y-2 shadow-md">
          <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest block">
            {language === 'ta' ? 'அறநெறி வழிகாட்டல்' : 'Sacred Guidance of Aram'}
          </span>
          <p className="font-tamil text-base sm:text-lg font-bold text-white">
            "அறத்தான் வருவதே இன்பம்மற் றெல்லாம் புறத்த புகழும் இல."
          </p>
          <p className="text-xs text-yellow-200/80 italic max-w-xl mx-auto">
            "Happiness originates from righteousness alone. Everything else is impermanent and bereft of true worth." — Thirukkural 39
          </p>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center p-1.5 shadow-md">
                <span className="text-2xl">🪔</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-heading tracking-wide">
                  ARAM BRAND
                </h3>
                <p className="font-tamil text-amber-300 font-bold -mt-0.5">
                  அறம் • Tamil Heritage & Temple Crafts
                </p>
              </div>
            </div>

            <p className="text-amber-100/70 leading-relaxed text-xs">
              Dedicated to upholding ancient Tamil temple craftsmanship, GI-tagged heritage arts, pure mulberry silks, and unrefined wood-pressed cold chekku oils. Handcrafted with reverence and shipped with sanctum blessings.
            </p>

            <div className="space-y-1.5 text-stone-300 pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>108 Raja Veedhi, Near East Gopuram, Madurai, TN - 625001</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 98400 12345 (Toll-Free Heritage Helpline)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>blessings@arambrand.com</span>
              </p>
            </div>
          </div>

          {/* Col 2: Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-amber-900 pb-1.5 font-heading">
              {language === 'ta' ? 'முக்கிய பிரிவுகள்' : 'Sacred Collections'}
            </h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setActiveView('products');
                    }}
                    className="hover:text-amber-300 transition text-left cursor-pointer"
                  >
                    {language === 'ta' ? cat.nameTa : cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-amber-900 pb-1.5 font-heading">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView('home')}
                  className="hover:text-amber-300 transition"
                >
                  Home (முகப்பு)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    setActiveView('products');
                  }}
                  className="hover:text-amber-300 transition"
                >
                  All Products Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('gallery')}
                  className="hover:text-amber-300 transition"
                >
                  Temple & Artisan Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('orders')}
                  className="hover:text-amber-300 transition"
                >
                  Track Order & Shipment
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('contact')}
                  className="hover:text-amber-300 transition"
                >
                  Contact & Store Location
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Admin Portal Login
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Business Integrations & Payment */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-amber-900 pb-1.5 font-heading">
              Support & Payments
            </h4>
            <div className="space-y-2">
              <a
                href="https://wa.me/919840012345"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Live Chat</span>
              </a>
              <a
                href="tel:+919840012345"
                className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 hover:bg-amber-900 transition"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Click-to-Call (+91 98400)</span>
              </a>
            </div>

            <div className="pt-2 space-y-1.5">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">
                Accepted Secure Payment Methods:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 bg-black/60 rounded border border-white/10 text-[10px] text-amber-300">
                  Razorpay
                </span>
                <span className="px-2 py-0.5 bg-black/60 rounded border border-white/10 text-[10px] text-amber-300">
                  UPI / GPay
                </span>
                <span className="px-2 py-0.5 bg-black/60 rounded border border-white/10 text-[10px] text-amber-300">
                  RuPay
                </span>
                <span className="px-2 py-0.5 bg-black/60 rounded border border-white/10 text-[10px] text-amber-300">
                  Visa / MC
                </span>
                <span className="px-2 py-0.5 bg-black/60 rounded border border-white/10 text-[10px] text-emerald-400 font-bold">
                  COD Available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Security Badges */}
        <div className="pt-8 border-t border-amber-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-amber-200/60">
          <p>© 2026 Aram Brand (அறம்). All rights reserved. Registered under Heritage Artisans Trust of Tamil Nadu.</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> Pure Tamil Tradition
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
