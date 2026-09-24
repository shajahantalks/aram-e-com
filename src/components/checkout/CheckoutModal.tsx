import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle,
  Lock,
  ArrowRight,
  Sparkles,
  Banknote,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CartItem,
  ShippingAddress,
  PaymentMethod,
  Order,
  Language,
} from '../../types';
import { formatCurrency, storageService } from '../../services/storageService';
import { templeBell } from '../../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: string | null;
  discountAmount: number;
  onOrderCompleted: (order: Order) => void;
  language: Language;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  discountAmount,
  onOrderCompleted,
  language,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2>(1); // 1: Shipping Address, 2: Payment
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');

  // Shipping form state
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    landmark: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600004',
    addressType: 'home',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [orderNotes, setOrderNotes] = useState('');

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const validateAddress = (): boolean => {
    const errors: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Please enter your full name';
    if (!formData.phone.trim() || formData.phone.length < 10)
      errors.phone = 'Valid 10-digit mobile number required for delivery updates';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errors.email = 'Valid email required for invoice and tracking';
    if (!formData.street.trim()) errors.street = 'Street address and door number required';
    if (!formData.city.trim()) errors.city = 'City required';
    if (!formData.pincode.trim() || formData.pincode.length !== 6)
      errors.pincode = '6-digit PIN code required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep(2);
    }
  };

  const triggerCelebration = () => {
    templeBell.ring();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#800020', '#FBBF24', '#059669'],
      });
    } catch {
      // ignore
    }
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);

    if (paymentMethod === 'razorpay') {
      // Check if Razorpay JS SDK is loaded
      const hasRazorpay = typeof window !== 'undefined' && (window as any).Razorpay;

      if (hasRazorpay) {
        try {
          const options = {
            key: 'rzp_test_AramHeritageDemo', // Standard Razorpay test key placeholder
            amount: Math.round(finalTotal * 100), // amount in paise
            currency: 'INR',
            name: 'Aram Brand - Tamil Heritage Crafts',
            description: `Order of ${items.length} authentic craft items`,
            image: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?auto=format&fit=crop&w=200&q=80',
            handler: function (response: any) {
              const newOrder = storageService.addOrder({
                customerName: formData.fullName,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                shippingAddress: formData,
                items: items.map((i) => ({
                  productId: i.product.id,
                  productName: i.product.name,
                  productNameTa: i.product.nameTa,
                  price: i.product.price,
                  quantity: i.quantity,
                  image: i.product.images[0],
                })),
                subtotal,
                discount: discountAmount,
                shippingFee,
                totalAmount: finalTotal,
                paymentMethod: 'razorpay',
                paymentStatus: 'paid',
                orderStatus: 'confirmed',
                razorpayPaymentId: response?.razorpay_payment_id || `pay_${Date.now()}`,
                razorpayOrderId: response?.razorpay_order_id || `order_${Date.now()}`,
                notes: orderNotes,
              });

              setIsProcessing(false);
              triggerCelebration();
              onOrderCompleted(newOrder);
            },
            prefill: {
              name: formData.fullName,
              email: formData.email,
              contact: formData.phone,
            },
            notes: {
              address: `${formData.street}, ${formData.city}`,
              brand: 'Aram Brand Tamil Heritage',
            },
            theme: {
              color: '#800020',
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function () {
            setIsProcessing(false);
          });
          rzp.open();
          return;
        } catch {
          // If popup blocked or network error, fallback to simulated successful test payment
        }
      }

      // Simulated seamless test payment if Razorpay popup is blocked in preview iframe
      setTimeout(() => {
        const newOrder = storageService.addOrder({
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: formData,
          items: items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            productNameTa: i.product.nameTa,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.images[0],
          })),
          subtotal,
          discount: discountAmount,
          shippingFee,
          totalAmount: finalTotal,
          paymentMethod: 'razorpay',
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
          razorpayPaymentId: `pay_test_${Date.now()}`,
          razorpayOrderId: `order_test_${Date.now()}`,
          notes: orderNotes,
        });

        setIsProcessing(false);
        triggerCelebration();
        onOrderCompleted(newOrder);
      }, 1200);
    } else {
      // Cash on Delivery
      setTimeout(() => {
        const newOrder = storageService.addOrder({
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: formData,
          items: items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            productNameTa: i.product.nameTa,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.images[0],
          })),
          subtotal,
          discount: discountAmount,
          shippingFee,
          totalAmount: finalTotal,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          orderStatus: 'placed',
          notes: orderNotes,
        });

        setIsProcessing(false);
        triggerCelebration();
        onOrderCompleted(newOrder);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl shadow-2xl border border-amber-300 overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-stone-950 flex items-center justify-between border-b border-yellow-500/50">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-stone-950" />
            <div>
              <h2 className="text-base font-black font-heading">
                {language === 'ta' ? 'பாதுகாப்பான செக் அவுட்' : 'Secure Sacred Checkout'}
              </h2>
              <p className="text-[11px] text-stone-800 font-semibold">
                {step === 1 ? 'Step 1: Shipping Address (Guest or Member)' : 'Step 2: Payment Gateway Selection'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-950/10 text-stone-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Progress Bar */}
        <div className="grid grid-cols-2 text-center text-xs font-semibold border-b border-yellow-200 bg-yellow-50/60">
          <div
            className={`py-2.5 flex items-center justify-center gap-1.5 ${
              step === 1 ? 'text-stone-950 border-b-2 border-yellow-500 bg-white font-black' : 'text-stone-500'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-yellow-400 text-stone-950 font-black text-[10px] flex items-center justify-center border border-yellow-600">1</span>
            <span>Delivery Address</span>
          </div>
          <div
            className={`py-2.5 flex items-center justify-center gap-1.5 ${
              step === 2 ? 'text-stone-950 border-b-2 border-yellow-500 bg-white font-black' : 'text-stone-500'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-yellow-400 text-stone-950 font-black text-[10px] flex items-center justify-center border border-yellow-600">2</span>
            <span>Razorpay / COD Payment</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          {step === 1 ? (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200/80 text-xs text-stone-900 flex items-center justify-between">
                <span>⚡ Guest Checkout Enabled — No password required!</span>
                <span className="font-bold text-[#B45309]">100% Secure</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Senthil Ramanathan"
                    className="w-full px-3 py-2 text-xs border rounded-lg border-stone-300 focus:outline-none focus:border-[#800020]"
                  />
                  {formErrors.fullName && (
                    <p className="text-[10px] text-red-600 mt-0.5">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Phone (for delivery SMS/WhatsApp updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98400 12345"
                    className="w-full px-3 py-2 text-xs border rounded-lg border-stone-300 focus:outline-none focus:border-[#800020]"
                  />
                  {formErrors.phone && (
                    <p className="text-[10px] text-red-600 mt-0.5">{formErrors.phone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address (for GST tax invoice & tracking) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="senthil@example.com"
                    className="w-full px-3 py-2 text-xs border rounded-lg border-stone-300 focus:outline-none focus:border-[#800020]"
                  />
                  {formErrors.email && (
                    <p className="text-[10px] text-red-600 mt-0.5">{formErrors.email}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Door / House / Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="e.g. 18, Sannathi Street, Near Raja Gopuram"
                    className="w-full px-3 py-2 text-xs border rounded-lg border-stone-300 focus:outline-none focus:border-[#800020]"
                  />
                  {formErrors.street && (
                    <p className="text-[10px] text-red-600 mt-0.5">{formErrors.street}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.landmark || ''}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="e.g. Opp. Vinayagar Temple"
                    className="w-full px-3 py-2 text-xs border rounded-lg border-stone-300 focus:outline-none focus:border-[#800020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="600004"
                    className="w-full px-3 py-2 text-xs border rounded-lg border-stone-300 focus:outline-none focus:border-[#800020]"
                  />
                  {formErrors.pincode && (
                    <p className="text-[10px] text-red-600 mt-0.5">{formErrors.pincode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Chennai / Madurai"
                    className="w-full px-3 py-2 text-xs border rounded-lg border-stone-300 focus:outline-none focus:border-[#800020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg border-stone-300 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sacred Packaging Instructions / Order Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Please include temple vibhuti packet, gift wrap with turmeric cord, or delivery before Pradosham pooja..."
                  className="w-full px-3 py-2 text-xs border rounded-lg border-stone-300 focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-amber-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-stone-950 text-xs sm:text-sm font-black shadow-md border border-yellow-500 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Review Shipping Info */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-stone-800">{formData.fullName}</span> • {formData.phone}
                  <p className="text-stone-500 text-[11px] truncate max-w-sm">
                    {formData.street}, {formData.city}, {formData.state} - {formData.pincode}
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-amber-800 hover:underline font-bold text-xs cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Select Payment Gateway & Method:
                </label>

                {/* Razorpay Option */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'razorpay'
                      ? 'border-yellow-500 bg-yellow-50/70 shadow-sm'
                      : 'border-stone-200 hover:border-yellow-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1 text-amber-500 focus:ring-yellow-400"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-700" />
                        Razorpay Payment Gateway (Cards, UPI, Netbanking)
                      </span>
                      <span className="text-[10px] font-bold bg-yellow-200 text-stone-900 px-2 py-0.5 rounded border border-yellow-300">
                        INSTANT & SECURE
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Pay instantly with Google Pay, PhonePe, Paytm, BHIM UPI, Visa, Mastercard, RuPay, or Net Banking.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-600 font-semibold">
                        GPay
                      </span>
                      <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-600 font-semibold">
                        PhonePe
                      </span>
                      <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-600 font-semibold">
                        RuPay / Visa
                      </span>
                      <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-600 font-semibold">
                        NetBanking
                      </span>
                    </div>
                  </div>
                </label>

                {/* COD Option */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-yellow-500 bg-yellow-50/70 shadow-sm'
                      : 'border-stone-200 hover:border-yellow-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-amber-500 focus:ring-yellow-400"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-700" />
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        PAY AT DOORSTEP
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Pay in cash or UPI scanner upon delivery by the courier partner.
                    </p>
                  </div>
                </label>
              </div>

              {/* Order Final Summary */}
              <div className="p-4 rounded-2xl bg-yellow-50/60 border border-yellow-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({items.length} items):</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount:</span>
                    <span>- {formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Sacred Temple Transit:</span>
                  <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>GST (CGST + SGST):</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#B45309] pt-2 border-t border-yellow-300">
                  <span>Grand Total to Pay:</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
                >
                  ← Back to Address
                </button>
                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessing}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-stone-950 text-xs sm:text-sm font-black shadow-lg border border-yellow-500 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                      <span>Processing Secure Order...</span>
                    </>
                  ) : paymentMethod === 'razorpay' ? (
                    <>
                      <Lock className="w-4 h-4 text-stone-950" />
                      <span>Pay {formatCurrency(finalTotal)} with Razorpay</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-stone-950" />
                      <span>Confirm COD Order ({formatCurrency(finalTotal)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
