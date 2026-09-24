import React from 'react';
import {
  Flame,
  Sparkles,
  Crown,
  Shield,
  Droplet,
  Utensils,
  Wind,
  Layers,
  Sun,
  Heart,
  Coffee,
  Compass,
  Bell,
  Flower,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Category, Language } from '../../types';

interface FeaturedCategoriesProps {
  categories: Category[];
  language: Language;
  onSelectCategory: (categoryId: string) => void;
  selectedCategoryId: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Flame: <Flame className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Crown: <Crown className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Droplet: <Droplet className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  Wind: <Wind className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
  Flower: <Flower className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
};

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  categories,
  language,
  onSelectCategory,
  selectedCategoryId,
}) => {
  return (
    <section className="py-12 bg-[#FBF7F0] border-b border-amber-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B45309]">
            <span>❖</span>
            <span>{language === 'ta' ? 'பாரம்பரிய கைவினைப் பிரிவுகள்' : 'Sacred Collections'}</span>
            <span>❖</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1810] font-heading">
            {language === 'ta'
              ? '15 தமிழ் பண்பாட்டு அங்காடி பிரிவுகள்'
              : 'Explore Our 15 Heritage Categories'}
          </h2>
          <p className="text-sm text-stone-600">
            {language === 'ta'
              ? 'கோவில் பூஜை பொருட்கள் முதல் பட்டு நெசவு, மரச்செக்கு எண்ணெய் வரை அனைத்தும் தூய முறையில்.'
              : 'From consecrated brassware and pure handloom silks to stone-pressed spices and temple fragrance.'}
          </p>
        </div>

        {/* Categories Grid - 15 items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative text-left rounded-xl p-3.5 transition-all duration-300 border flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-stone-950 border-yellow-500 shadow-md ring-2 ring-yellow-400 font-medium'
                    : 'bg-white hover:bg-yellow-50/80 border-yellow-200/80 hover:border-yellow-400 shadow-2xs hover:shadow-md'
                }`}
              >
                {/* Background miniature preview image with subtle fade */}
                <div className="absolute right-0 bottom-0 w-16 h-16 opacity-15 group-hover:opacity-25 transition-opacity rounded-tl-full overflow-hidden pointer-events-none">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2 relative z-10">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-stone-950 text-yellow-300'
                        : 'bg-yellow-100 text-amber-800 group-hover:bg-yellow-400 group-hover:text-stone-950'
                    }`}
                  >
                    {ICON_MAP[cat.iconName] || <Sparkles className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3
                      className={`text-xs sm:text-sm font-bold leading-snug line-clamp-1 ${
                        isSelected ? 'text-stone-950 font-black' : 'text-stone-900 group-hover:text-amber-800'
                      }`}
                    >
                      {language === 'ta' ? cat.nameTa : cat.name}
                    </h3>
                    <p
                      className={`text-[11px] line-clamp-1 ${
                        isSelected ? 'text-stone-800' : 'text-stone-500 font-tamil'
                      }`}
                    >
                      {language === 'ta' ? cat.name : cat.nameTa}
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] relative z-10 ${
                    isSelected ? 'border-amber-600/30 text-stone-900 font-bold' : 'border-stone-100 text-stone-400'
                  }`}
                >
                  <span>{cat.itemCount} items</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${
                      isSelected ? 'text-stone-950' : 'text-amber-700'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
