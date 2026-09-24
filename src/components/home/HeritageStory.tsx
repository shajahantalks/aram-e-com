import React from 'react';
import { Sparkles, ShieldCheck, Heart, Award, CheckCircle } from 'lucide-react';
import { Language } from '../../types';

interface HeritageStoryProps {
  language: Language;
}

export const HeritageStory: React.FC<HeritageStoryProps> = ({ language }) => {
  return (
    <section className="py-16 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E8] to-[#FFFDF9] border-b border-amber-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Collage with Temple Motifs */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400 shadow-2xl bg-amber-950">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80"
                alt="Brihadisvara Temple Tanjore"
                className="w-full h-[420px] object-cover mix-blend-luminosity opacity-85 hover:opacity-100 hover:mix-blend-normal transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-yellow-400 shadow-lg text-stone-900">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] block">
                  The Philosophy of Aram (அறம்)
                </span>
                <p className="font-tamil text-sm font-bold mt-0.5 text-stone-950">
                  "அழுக்கா றவாவெகுளி இன்னாச்சொல் நான்கும் இழுக்கா இயன்ற தறம்."
                </p>
                <p className="text-[11px] text-stone-600 mt-1 italic">
                  Righteousness is conducting trade with honesty, fair compensation to artisans, and unwavering purity.
                </p>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-stone-950 border border-yellow-200 p-3.5 rounded-2xl shadow-xl hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-950/10 flex items-center justify-center text-xl">
                🪔
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-stone-950">Chola Dynasty Legacy</p>
                <p className="text-[10px] text-stone-800 font-semibold">1000+ Years Living Tradition</p>
              </div>
            </div>
          </div>

          {/* Right Column: Story Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B45309]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'ta' ? 'அறம் பிராண்ட் தத்துவம்' : 'The Soul of Aram Brand'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] font-heading leading-tight">
              {language === 'ta' ? (
                <>
                  தமிழ்க் கலாச்சாரமும் <br />
                  <span className="gold-gradient-text">அழிந்துவிடாத கலைப் பெருமையும்</span>
                </>
              ) : (
                <>
                  Born from the Sacred Soil of <br />
                  <span className="gold-gradient-text">Temples, Weavers & Sculptors</span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {language === 'ta'
                ? 'அறம் (Aram) என்பது வெறும் வணிகப்பெயர் அல்ல; அது சங்க காலம் தொட்டு தமிழர்கள் போற்றிப் பாதுகாத்த அறநெறி. கோவில்களில் இறைவனுக்கு செய்யப்படும் தீபாராதனை முதல், நமது இல்லங்களில் விளக்கேற்றி வழிபாடு செய்யும் வரை அனைத்து மங்கலப் பொருட்களும் எவ்வித கலப்படமுமின்றி தூய்மையாக இருக்க வேண்டும் என்பதே எங்கள் கடமை.'
                : 'Named after the timeless Tamil virtue of Aram (ethical righteousness), our brand exists to protect and celebrate the irreplaceable heritage of Tamil Nadu. We work hand-in-hand with hereditary master sculptors in Swamimalai, traditional weavers in Kanchipuram, and organic cold-pressers in Erode.'}
            </p>

            {/* 4 Pillars of Aram Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Artisan Welfare</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Zero middlemen. Fair living wages paid directly to generational weavers and bronzesmiths.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Native Pure Materials</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Virgin brass alloys, genuine mulberry silks with Silk Mark, and wood-pressed seed oils.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Temple Sanctum Packaged</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Every order includes sacred temple vibhuti prasadam and vibration-dampened casing.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Global Sacred Transit</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Delivering across all Indian PIN codes, Singapore, Malaysia, Dubai, UK & USA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
