import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Share2,
  Heart,
  MessageCircle,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Product, Language } from '../../types';
import { formatCurrency } from '../../services/storageService';

interface ProductDetailModalProps {
  product: Product | null;
  language: Language;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  language,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    // Realistic estimated delivery logic
    if (pincode.startsWith('6')) {
      setPincodeStatus('✓ Delivery in 2-3 business days across Tamil Nadu & South India');
    } else {
      setPincodeStatus('✓ Delivery in 4-6 business days with Sacred Fragile Care Packaging');
    }
  };

  const whatsappUrl = `https://wa.me/919840012345?text=${encodeURIComponent(
    `Vanakkam Aram Brand! I want to purchase: "${product.name}" (SKU: ${product.sku}). Please confirm availability.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-amber-300 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-amber-50 border border-amber-200/60 shadow-inner">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-red-700 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-yellow-500 ring-2 ring-yellow-400 scale-95 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Artisan Guarantee Box */}
            <div className="p-3.5 rounded-xl bg-yellow-50/80 border border-yellow-300/80 text-xs space-y-1.5 text-stone-900">
              <div className="flex items-center gap-1.5 font-bold text-[#B45309]">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{language === 'ta' ? 'அறம் பாரம்பரிய சான்றளிப்பு' : 'Aram Authenticity Guarantee'}</span>
              </div>
              <p className="text-[11px] text-stone-600">
                {language === 'ta'
                  ? 'உண்மையான புவிசார் குறியீடு பெற்ற தமிழக கைவினைக் கலைஞர்களின் கைவண்ணம்.'
                  : 'Sourced directly from certified master artisans in Swamimalai, Kanchi & Thanjavur.'}
              </p>
            </div>
          </div>

          {/* Right Column: Specs & Buy Actions */}
          <div className="md:col-span-6 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                {product.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug font-heading mt-1">
                {language === 'ta' ? product.nameTa : product.name}
              </h2>
              <p className="text-xs text-stone-500 font-tamil mt-0.5">
                {language === 'ta' ? product.name : product.nameTa}
              </p>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded text-amber-900 font-bold border border-yellow-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-stone-500">
                {product.reviewCount} {language === 'ta' ? 'மதிப்புரைகள்' : 'verified reviews'}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500">SKU: {product.sku}</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 p-3 rounded-xl bg-yellow-50/70 border border-yellow-200">
              <span className="text-2xl sm:text-3xl font-black text-[#B45309]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-stone-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded ml-auto">
                Inclusive of all Taxes (GST)
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {language === 'ta' ? product.descriptionTa : product.description}
            </p>

            {/* Cultural Context Callout */}
            {product.culturalNote && (
              <div className="p-3 bg-yellow-50/90 rounded-xl border border-yellow-300/70 text-xs text-stone-700">
                <p className="font-bold text-[#B45309] mb-0.5 flex items-center gap-1">
                  <span>🪔</span>
                  <span>{language === 'ta' ? 'பாரம்பரிய குறிப்பு' : 'Cultural Significance'}</span>
                </p>
                <p className="font-tamil text-[11px] text-stone-600">
                  {language === 'ta' ? product.culturalNoteTa : product.culturalNote}
                </p>
              </div>
            )}

            {/* Material & Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-200">
              <div>
                <span className="text-stone-400 block text-[10px]">Origin:</span>
                <span className="font-semibold text-stone-800">{product.origin}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Material:</span>
                <span className="font-semibold text-stone-800">{product.material}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Net Weight:</span>
                <span className="font-semibold text-stone-800">{product.weight}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Availability:</span>
                <span className="font-semibold text-emerald-600">
                  {product.inStock ? `In Stock (${product.stockQuantity} units)` : 'Made to Order'}
                </span>
              </div>
            </div>

            {/* PIN Code Delivery Estimator */}
            <form onSubmit={handlePincodeCheck} className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-stone-700 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'ta' ? 'விநியோக கால அளவு அறிய பின் கோடு' : 'Check Delivery Pincode'}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 600001 (Chennai)"
                  className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-yellow-300 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Check
                </button>
              </div>
              {pincodeStatus && (
                <p className="text-[11px] font-medium text-emerald-700">{pincodeStatus}</p>
              )}
            </form>

            {/* Quantity Stepper & Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 transition font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl border-2 border-yellow-500 text-stone-900 bg-yellow-50 hover:bg-yellow-100 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-800" />
                  <span>{language === 'ta' ? 'கூடையில் சேர்க்க' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-stone-950 text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 shadow-md border border-yellow-500 cursor-pointer"
                >
                  <span>{language === 'ta' ? 'உடனே வாங்க' : 'Buy Now Securely'}</span>
                </button>
              </div>

              {/* WhatsApp direct support */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-200 transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {language === 'ta'
                    ? 'வாட்ஸ்அப்பில் விசாரிக்க (+91 98400 12345)'
                    : 'Instant WhatsApp Inquiry with Heritage Concierge'}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
