import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types';

interface TestimonialSectionProps {
  language: Language;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ language }) => {
  const reviews = [
    {
      name: 'Dr. R. Meenakshi Sundaram',
      location: 'Mylapore, Chennai',
      title: 'Divine Brass Kamakshi Deepam',
      comment:
        'The weight and casting purity of the Nachiyar Koil Kamakshi Vilakku exceeded my expectations. The oil does not leak, and lighting it at dawn fills our pooja room with immense serenity.',
      rating: 5,
      date: 'Verified Buyer • 2 weeks ago',
    },
    {
      name: 'Kavitha & Sridhar',
      location: 'Little India, Singapore',
      title: 'Kanchipuram Temple Border Silk',
      comment:
        'Finding authentic Silk Mark certified Kanchipuram sarees overseas is hard. Aram Brand delivered it in 5 days straight from Tamil Nadu with temple prasadam. The korvai borders are stunning!',
      rating: 5,
      date: 'Verified Buyer • 1 month ago',
    },
    {
      name: 'Subramanian Natarajan',
      location: 'Koramangala, Bangalore',
      title: 'Swamimalai Nataraja Bronze & Chekku Oil',
      comment:
        'The lost-wax bronze idol of Nataraja is a museum-grade masterpiece. The marachekku gingelly oil has that nostalgic aroma from our ancestral village in Erode. Pure bliss.',
      rating: 5,
      date: 'Verified Buyer • 3 weeks ago',
    },
  ];

  return (
    <section className="py-16 bg-[#FFFDF9] border-b border-amber-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B45309]">
            <span>❖</span>
            <span>{language === 'ta' ? 'வாடிக்கையாளர் திருப்தி' : 'Customer Blessings & Reviews'}</span>
            <span>❖</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1810] font-heading">
            {language === 'ta'
              ? 'பக்தர்கள் & வாடிக்கையாளர்களின் அனுபவங்கள்'
              : 'Cherished by 15,000+ Homes Worldwide'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Real feedback from families who revere authentic Tamil temple arts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-amber-200/60" />
                </div>

                <h4 className="font-bold text-stone-900 text-sm">{rev.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-stone-900 flex items-center gap-1">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                  </p>
                  <p className="text-[11px] text-stone-500">{rev.location}</p>
                </div>
                <span className="text-[10px] text-stone-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
