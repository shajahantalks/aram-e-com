import React from 'react';
import { Star, ShoppingBag, Eye, Heart, MessageCircle } from 'lucide-react';
import { Product, Language } from '../../types';
import { formatCurrency } from '../../services/storageService';

interface ProductCardProps {
  product: Product;
  language: Language;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onAddToCart,
  onQuickView,
}) => {
  const whatsappUrl = `https://wa.me/919840012345?text=${encodeURIComponent(
    `Vanakkam Aram Brand! I am interested in purchasing: "${product.name}" (SKU: ${product.sku}, Price: ${formatCurrency(product.price)}). Is this currently in stock?`
  )}`;

  return (
    <div className="group bg-white rounded-2xl border border-amber-200/70 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-amber-400">
      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-amber-50/40">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.discountPercentage > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-700 text-white font-bold text-[10px] shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-extrabold text-[10px] shadow-sm">
              ★ BESTSELLER
            </span>
          )}
          {product.origin && (
            <span className="px-2 py-0.5 rounded-full bg-stone-900/80 text-amber-200 text-[9px] backdrop-blur-xs">
              {product.origin.split(',')[0]}
            </span>
          )}
        </div>

        {/* Quick Action Floating Bar */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onQuickView(product)}
            className="p-2 rounded-full bg-white/95 hover:bg-yellow-400 text-stone-800 hover:text-stone-950 shadow-md transition cursor-pointer"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition"
            title="Inquire on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span className="text-amber-800 font-medium truncate max-w-[150px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-700 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="text-sm font-bold text-stone-900 line-clamp-2 hover:text-[#B45309] cursor-pointer transition leading-snug"
          >
            {language === 'ta' ? product.nameTa : product.name}
          </h3>

          <p className="text-[11px] text-stone-500 line-clamp-1 font-tamil">
            {language === 'ta' ? product.shortDescTa : product.shortDesc}
          </p>
        </div>

        {/* Price & Action Area */}
        <div className="pt-2 border-t border-amber-100/70 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-[#B45309]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              {product.inStock ? 'In Stock' : 'Pre-Order'}
            </span>
          </div>

          {/* Add to Cart & Buy Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onQuickView(product)}
              className="py-2 px-2.5 rounded-lg border border-yellow-400 text-stone-900 hover:bg-yellow-100/60 text-xs font-semibold transition text-center cursor-pointer"
            >
              {language === 'ta' ? 'விவரம்' : 'Details'}
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="py-2 px-2.5 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-stone-950 text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-xs border border-yellow-500/50 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-stone-900" />
              <span>{language === 'ta' ? 'வாங்கு' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
