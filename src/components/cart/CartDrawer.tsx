import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import { CartItem, Language } from '../../types';
import { formatCurrency } from '../../services/storageService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  language: Language;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  discountAmount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  language,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  discountAmount,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = items.length === 0 || isFreeShipping ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const success = onApplyCoupon(couponInput.trim().toUpperCase());
    if (!success) {
      setCouponError('Invalid coupon. Try: ARAM10, VANAKKAM, or FESTIVE');
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#FFFDF9] h-full shadow-2xl flex flex-col justify-between border-l border-amber-300 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-yellow-200/80 bg-yellow-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-yellow-600" />
            <h2 className="text-base font-bold text-stone-900 font-heading">
              {language === 'ta' ? 'உங்கள் கூடை' : 'Sacred Cart'} ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        {items.length > 0 && (
          <div className="px-5 py-2.5 bg-amber-50/80 border-b border-amber-200/60 text-xs">
            <div className="flex items-center justify-between text-amber-900 font-semibold mb-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-700" />
                {isFreeShipping ? (
                  <span className="text-emerald-700 font-bold">
                    ✓ You unlocked FREE Sacred Delivery!
                  </span>
                ) : (
                  <span>
                    Add {formatCurrency(remainingForFreeShipping)} more for FREE Sacred Delivery
                  </span>
                )}
              </span>
            </div>
            <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{
                  width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-2xl">
                🪔
              </div>
              <h3 className="text-sm font-bold text-stone-800">
                {language === 'ta' ? 'கூடை காலியாக உள்ளது' : 'Your cart is empty'}
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                {language === 'ta'
                  ? 'பாரம்பரிய காமாட்சி விளக்குகள் மற்றும் கைத்தறி உடைகளை கூடையில் சேர்க்கவும்.'
                  : 'Add authentic temple brassware, silks, and pure cold-pressed oils to begin.'}
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 text-xs font-bold hover:from-yellow-300 hover:to-amber-300 transition border border-yellow-500 cursor-pointer"
              >
                {language === 'ta' ? 'பொருட்களை காண்க' : 'Explore Collections'}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 bg-white rounded-xl border border-yellow-200/80 shadow-2xs"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover bg-amber-50 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {language === 'ta' ? item.product.nameTa : item.product.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-stone-400 hover:text-red-600 transition p-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-500">
                    {formatCurrency(item.product.price)} each
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-stone-50">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                        }
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 text-xs font-bold cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 text-xs font-bold cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#B45309]">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-yellow-200/80 bg-white space-y-3">
            {/* Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon: ARAM10 / FESTIVE"
                    className="w-full pl-7 pr-2 py-1.5 text-xs uppercase border border-stone-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
                  />
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-yellow-300 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[10px] text-red-600">{couponError}</p>}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  <span className="font-semibold">
                    ✓ Applied: {appliedCoupon} (-{formatCurrency(discountAmount)})
                  </span>
                  <button
                    type="button"
                    onClick={onRemoveCoupon}
                    className="text-stone-500 hover:text-red-600 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </form>

            {/* Bill Summary */}
            <div className="space-y-1 text-xs pt-1 border-t border-stone-100">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Delivery:</span>
                <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-[#B45309] pt-1 border-t border-stone-200">
                <span>Total Amount:</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-stone-950 font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 border border-yellow-500 cursor-pointer"
            >
              <span>
                {language === 'ta' ? 'செக் அவுட் செய்ய' : 'Proceed to Secure Checkout'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Razorpay 256-Bit SSL Encryption • Cash on Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
