import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  User,
  Phone,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';
import { Language, Category } from '../../types';
import { TempleBell } from './TempleBell';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  onOpenCustomerPanel?: () => void;
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeView: string;
  setActiveView: (view: 'home' | 'products' | 'gallery' | 'contact' | 'orders') => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  cartCount,
  onOpenCart,
  onOpenAccount,
  onOpenAdmin,
  onOpenCustomerPanel,
  categories,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  activeView,
  setActiveView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const handleCustomerPanelClick = () => {
    if (onOpenCustomerPanel) {
      onOpenCustomerPanel();
    } else {
      onOpenAccount();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FEFDF5]/95 backdrop-blur-md shadow-xs border-b border-yellow-300/70">
      {/* Top Banner with Thirukkural & Sacred Offer */}
      <div className="bg-gradient-to-r from-[#F59E0B] via-[#EAB308] to-[#F59E0B] text-[#3B1F04] text-xs px-4 py-1.5 font-semibold border-b border-yellow-400 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span className="font-tamil tracking-wide font-bold">
              {language === 'ta'
                ? 'அறத்தான் வருவதே இன்பம் • மங்கல மஞ்சள் & தெய்வத் திருவருள் பொக்கிஷங்கள்'
                : 'Aram: Righteousness Brings Pure Joy • Pure Golden Tamil Heritage & Temple Crafts'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#451A03] font-semibold">
            <span className="hidden sm:inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#78350F]" />
              {language === 'ta' ? 'அகில உலக விநியோகம்' : 'Free Sacred Delivery Over ₹999'}
            </span>
            <span className="hidden sm:inline">|</span>
            <a
              href="tel:+919840012345"
              className="inline-flex items-center gap-1 hover:text-[#78350F] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#78350F]" />
              <span>+91 98400 12345</span>
            </a>
            <span className="hidden sm:inline">|</span>
            <button
              onClick={handleCustomerPanelClick}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-[#451A03] text-[10px] font-bold border border-yellow-500/40 transition cursor-pointer"
            >
              <User className="w-3 h-3 text-[#78350F]" />
              <span>{language === 'ta' ? 'வாடிக்கையாளர் பலகை' : 'Customer Panel'}</span>
            </button>
            <span className="hidden sm:inline">|</span>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900 hover:bg-stone-800 text-yellow-300 text-[10px] font-bold shadow-xs transition cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-yellow-400" />
              <span>{language === 'ta' ? 'நிர்வாக பலகை' : 'Admin Panel'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo with Gopuram Motif */}
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            {/* Animated Temple Gopuram Vector */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#EAB308] via-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-md p-1.5 border border-yellow-200">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-stone-900 drop-shadow group-hover:scale-105 transition-transform"
              >
                {/* Kalasam spire */}
                <path d="M24 2L26 8H22L24 2Z" fill="#FFFBEB" />
                <circle cx="24" cy="4" r="1.5" fill="#78350F" />
                {/* Tier 1 */}
                <path d="M19 8H29L31 15H17L19 8Z" fill="#FEF08A" />
                {/* Tier 2 */}
                <path d="M15 15H33L35 23H13L15 15Z" fill="#FDE047" />
                {/* Tier 3 */}
                <path d="M11 23H37L39 33H9L11 23Z" fill="#CA8A04" />
                {/* Temple Gateway Sanctum Door */}
                <path d="M7 33H41V46H7V33Z" fill="#854D0E" />
                <path d="M20 37C20 34.7909 21.7909 33 24 33C26.2091 33 28 34.7909 28 37V46H20V37Z" fill="#291809" />
                {/* Small Diya flame inside door */}
                <circle cx="24" cy="40" r="1.5" fill="#EF4444" className="animate-flame" />
              </svg>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#854D0E] font-heading">
                  ARAM
                </span>
                <span className="text-sm sm:text-base font-bold text-[#A16207] font-tamil">
                  அறம்
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] block uppercase tracking-wider text-[#78350F] font-semibold -mt-1">
                Pure Tamil Heritage & Temple Crafts
              </span>
            </div>
          </button>

          {/* Search Bar - Center */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'பித்தளை விளக்கு, பட்டு, மரச்செக்கு எண்ணெய் தேடுக...'
                    : 'Search brass lamps, Kanchi silk, chekku oils...'
                }
                className="w-full pl-10 pr-4 py-2 text-sm bg-yellow-50/70 border border-yellow-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition placeholder:text-stone-500"
              />
              <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Interactive Temple Bell */}
            <TempleBell language={language} />

            {/* Language Switcher */}
            <div className="flex items-center border border-yellow-400 rounded-full p-0.5 bg-yellow-100/70 text-xs font-semibold">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#CA8A04] text-white font-bold shadow-xs'
                    : 'text-stone-800 hover:text-amber-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('ta')}
                className={`px-2.5 py-1 rounded-full font-tamil transition cursor-pointer ${
                  language === 'ta'
                    ? 'bg-[#CA8A04] text-white font-bold shadow-xs'
                    : 'text-stone-800 hover:text-amber-900'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Account / Profile Button */}
            <button
              onClick={onOpenAccount}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-yellow-300 bg-yellow-50/60 text-stone-800 hover:bg-yellow-100 hover:text-[#854D0E] transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="My Account"
            >
              <User className="w-4 h-4 text-amber-800" />
              <span className="hidden md:inline">
                {language === 'ta' ? 'கணக்கு' : 'Account'}
              </span>
            </button>

            {/* Cart Button with Radiant Yellow Theme */}
            <button
              onClick={onOpenCart}
              className="relative p-2 sm:px-3.5 sm:py-2 rounded-full bg-gradient-to-r from-[#EAB308] to-[#F59E0B] hover:from-[#CA8A04] hover:to-[#D97706] text-stone-950 font-extrabold shadow-md transition flex items-center gap-2 cursor-pointer border border-yellow-200"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-stone-950 fill-stone-950/20" />
              <span className="hidden sm:inline text-xs font-black tracking-wide">
                {language === 'ta' ? 'கூடை' : 'Cart'}
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-stone-950 text-yellow-300 font-black text-[11px] rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-800 hover:bg-yellow-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="lg:hidden mt-2 pt-2 border-t border-yellow-200">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                language === 'ta'
                  ? 'பொருட்களை தேடுக...'
                  : 'Search products, crafts...'
              }
              className="w-full pl-9 pr-4 py-2 text-xs bg-yellow-50/60 border border-yellow-300 rounded-full focus:outline-none focus:border-yellow-600"
            />
            <Search className="w-4 h-4 text-amber-700 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Desktop Category & Navigation Bar */}
      <nav className="hidden lg:block bg-yellow-50/60 border-t border-yellow-200 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-1">
            {/* All Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-yellow-200/80 hover:bg-yellow-300 text-stone-900 rounded-t-md transition font-bold cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                <span>
                  {language === 'ta' ? 'அனைத்து பிரிவுகள் (15)' : 'All 15 Categories'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-stone-700" />
              </button>

              {categoryDropdownOpen && (
                <div
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                  className="absolute top-full left-0 w-80 bg-white border border-yellow-300 rounded-b-xl shadow-xl z-50 py-2 max-h-96 overflow-y-auto"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setActiveView('products');
                        setCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-yellow-50 flex items-center justify-between text-stone-800 hover:text-[#854D0E] transition group cursor-pointer"
                    >
                      <div>
                        <p className="font-semibold text-xs group-hover:translate-x-1 transition-transform">
                          {language === 'ta' ? cat.nameTa : cat.name}
                        </p>
                        <p className="text-[10px] text-stone-500">
                          {language === 'ta' ? cat.name : cat.nameTa}
                        </p>
                      </div>
                      <span className="text-[10px] bg-yellow-100 text-stone-900 px-1.5 py-0.5 rounded-full font-bold">
                        {cat.itemCount}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Links */}
            <button
              onClick={() => setActiveView('home')}
              className={`px-3 py-2.5 rounded-md transition cursor-pointer ${
                activeView === 'home'
                  ? 'text-[#854D0E] font-extrabold border-b-2 border-[#EAB308]'
                  : 'text-stone-700 hover:text-[#854D0E]'
              }`}
            >
              {language === 'ta' ? 'முகப்பு' : 'Home'}
            </button>
            <button
              onClick={() => {
                onSelectCategory('all');
                setActiveView('products');
              }}
              className={`px-3 py-2.5 rounded-md transition cursor-pointer ${
                activeView === 'products'
                  ? 'text-[#854D0E] font-extrabold border-b-2 border-[#EAB308]'
                  : 'text-stone-700 hover:text-[#854D0E]'
              }`}
            >
              {language === 'ta' ? 'பொருட்கள் அங்காடி' : 'Full Catalog'}
            </button>
            <button
              onClick={() => setActiveView('gallery')}
              className={`px-3 py-2.5 rounded-md transition cursor-pointer ${
                activeView === 'gallery'
                  ? 'text-[#854D0E] font-extrabold border-b-2 border-[#EAB308]'
                  : 'text-stone-700 hover:text-[#854D0E]'
              }`}
            >
              {language === 'ta' ? 'கோவில் & கைவினை கேலரி' : 'Temple & Artisan Gallery'}
            </button>
            <button
              onClick={() => setActiveView('contact')}
              className={`px-3 py-2.5 rounded-md transition cursor-pointer ${
                activeView === 'contact'
                  ? 'text-[#854D0E] font-extrabold border-b-2 border-[#EAB308]'
                  : 'text-stone-700 hover:text-[#854D0E]'
              }`}
            >
              {language === 'ta' ? 'தொடர்புக்கு & முகவரி' : 'Contact & Store Location'}
            </button>
            <button
              onClick={() => setActiveView('orders')}
              className={`px-3 py-2.5 rounded-md transition cursor-pointer ${
                activeView === 'orders'
                  ? 'text-[#854D0E] font-extrabold border-b-2 border-[#EAB308]'
                  : 'text-stone-700 hover:text-[#854D0E]'
              }`}
            >
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-700" />
                {language === 'ta' ? 'ஆர்டர் கண்காணிப்பு' : 'Track Order'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-stone-600 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              <MapPin className="w-3 h-3 text-emerald-600" />
              {language === 'ta' ? 'மதுரை & தஞ்சாவூர் மையம்' : 'Madurai & Thanjavur Hub'}
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-yellow-50/90 border-b border-yellow-300 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-yellow-100 rounded-lg text-stone-900 font-bold text-left"
            >
              {language === 'ta' ? 'முகப்பு' : 'Home'}
            </button>
            <button
              onClick={() => {
                onSelectCategory('all');
                setActiveView('products');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-yellow-100 rounded-lg text-stone-900 font-bold text-left"
            >
              {language === 'ta' ? 'அனைத்து பொருட்கள்' : 'All Products'}
            </button>
            <button
              onClick={() => {
                setActiveView('gallery');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-yellow-100 rounded-lg text-stone-900 font-bold text-left"
            >
              {language === 'ta' ? 'புகைப்பட கேலரி' : 'Heritage Gallery'}
            </button>
            <button
              onClick={() => {
                setActiveView('contact');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-yellow-100 rounded-lg text-stone-900 font-bold text-left"
            >
              {language === 'ta' ? 'தொடர்புக்கு' : 'Contact Us'}
            </button>
            <button
              onClick={() => {
                setActiveView('orders');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-yellow-100 rounded-lg text-stone-900 font-bold text-left col-span-2"
            >
              {language === 'ta' ? 'ஆர்டர் டிராக்கிங்' : 'Track Order Status'}
            </button>
            <button
              onClick={() => {
                handleCustomerPanelClick();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-950 font-bold text-left flex items-center gap-2"
            >
              <User className="w-4 h-4 text-amber-800" />
              <span>{language === 'ta' ? 'வாடிக்கையாளர் பலகை' : 'Customer Panel'}</span>
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-stone-900 text-yellow-300 rounded-lg font-bold text-left flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-yellow-400" />
              <span>{language === 'ta' ? 'நிர்வாக பலகை' : 'Admin Panel'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-yellow-300">
            <p className="text-xs font-bold text-amber-950 mb-2">
              {language === 'ta' ? 'பிரிவுகள் (Categories):' : 'Explore Categories:'}
            </p>
            <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setActiveView('products');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-xs py-1.5 px-2 hover:bg-yellow-200/60 rounded flex justify-between text-stone-800"
                >
                  <span>{language === 'ta' ? cat.nameTa : cat.name}</span>
                  <span className="text-[10px] text-stone-500 font-semibold">({cat.itemCount})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
