import React, { useState } from 'react';
import { Sparkles, MapPin, Eye, X, Camera } from 'lucide-react';
import { GalleryItem, Language } from '../../types';

interface GalleryViewProps {
  galleryItems: GalleryItem[];
  language: Language;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  galleryItems,
  language,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'temple' | 'artisan' | 'handloom' | 'festivals'>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = selectedFilter === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedFilter);

  return (
    <div className="py-10 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B45309]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'ta' ? 'தமிழ் திருத்தல & கைவினைப் பார்வை' : 'Living Heritage & Temple Gallery'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] font-heading">
            {language === 'ta'
              ? 'அறம் பாரம்பரிய புகைப்படத் தொகுப்பு'
              : 'The Soul of Tamil Nadu in Pictures'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {language === 'ta'
              ? 'சுவாமிமலை வெண்கல வார்ப்பு, தஞ்சை பெரிய கோவில் கோபுரங்கள், காஞ்சி பட்டுத் தறிகள் மற்றும் கார்த்திகை தீப ஒளிகள்.'
              : 'Glimpse the consecrated temples, hereditary sthapatis casting bronze, and master weavers creating silk heirlooms.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center items-center gap-2 flex-wrap">
          {[
            { key: 'all', label: 'All Heritage Photos', labelTa: 'அனைத்து புகைப்படங்கள்' },
            { key: 'temple', label: 'Temple Architecture', labelTa: 'கோவில் கட்டடக்கலை' },
            { key: 'artisan', label: 'Artisans at Work', labelTa: 'கைவினைக் கலைஞர்கள்' },
            { key: 'handloom', label: 'Handloom & Weaving', labelTa: 'கைத்தறி நெசவு' },
            { key: 'festivals', label: 'Festivals & Deepam', labelTa: 'திருவிழா & தீபம்' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedFilter(tab.key as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                selectedFilter === tab.key
                  ? 'bg-yellow-400 text-stone-950 font-black shadow-md border border-yellow-500'
                  : 'bg-white border border-yellow-200 text-stone-700 hover:bg-yellow-50'
              }`}
            >
              {language === 'ta' ? tab.labelTa : tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative bg-white rounded-2xl border border-yellow-200/80 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-amber-50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-stone-950 text-xs font-black flex items-center gap-1.5 bg-yellow-400 px-3 py-1.5 rounded-full shadow-md">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Heritage Details</span>
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1 text-[11px] text-amber-800 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{item.location}</span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#B45309] transition line-clamp-1">
                  {language === 'ta' ? item.titleTa : item.title}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {language === 'ta' ? item.descriptionTa : item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-stone-900 rounded-3xl overflow-hidden border border-amber-400/40 text-amber-50 shadow-2xl">
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-8 bg-black flex items-center justify-center max-h-[70vh]">
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="md:col-span-4 p-6 flex flex-col justify-between space-y-4 bg-stone-900">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{activeItem.location}</span>
                    </div>

                    <h2 className="text-xl font-bold text-white font-heading">
                      {language === 'ta' ? activeItem.titleTa : activeItem.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {language === 'ta' ? activeItem.descriptionTa : activeItem.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400">
                    <p className="font-semibold text-amber-300">Aram Brand Photographic Archives</p>
                    <p>Documenting ancestral art forms & living craft communities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
