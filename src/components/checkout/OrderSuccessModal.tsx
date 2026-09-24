import React from 'react';
import {
  CheckCircle2,
  FileText,
  Truck,
  Package,
  Calendar,
  Sparkles,
  Phone,
  MessageCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { Order, Language } from '../../types';
import { formatCurrency } from '../../services/storageService';
import { openPrintableInvoice } from '../../utils/invoiceGenerator';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  language: Language;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  language,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    openPrintableInvoice(order);
  };

  const steps = [
    { key: 'placed', label: 'Order Placed', labelTa: 'ஆர்டர் பெறப்பட்டது', active: true },
    { key: 'confirmed', label: 'Temple Sanctum Care', labelTa: 'ஆசி பெற்ற பேக்கிங்', active: true },
    { key: 'packed', label: 'Fragile Boxed', labelTa: 'பாதுகாப்பு பெட்டி', active: order.orderStatus !== 'placed' },
    {
      key: 'dispatched',
      label: 'Sacred Transit',
      labelTa: 'விநியோகத்தில்',
      active: ['dispatched', 'out_for_delivery', 'delivered'].includes(order.orderStatus),
    },
    { key: 'delivered', label: 'Delivered', labelTa: 'சேர்க்கப்பட்டது', active: order.orderStatus === 'delivered' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl shadow-2xl border border-amber-300 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Auspicious Header Banner */}
        <div className="bg-gradient-to-r from-[#713F12] via-[#854D0E] to-[#B45309] text-yellow-50 p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-yellow-400/20 border-2 border-yellow-300/80 flex items-center justify-center mx-auto mb-3 text-3xl shadow-lg">
            🪔
          </div>
          <span className="text-xs uppercase tracking-widest text-yellow-300 font-bold">
            {language === 'ta' ? 'அறம் பிராண்ட் நல்வாழ்த்துக்கள்' : 'Aram Brand • Auspicious Blessings'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
            {language === 'ta' ? 'உங்கள் ஆர்டர் வெற்றிகரமாக பதிவானது!' : 'Order Placed Successfully!'}
          </h2>
          <p className="text-xs sm:text-sm text-yellow-100/90 mt-1 max-w-md mx-auto">
            {language === 'ta'
              ? 'உங்கள் இல்லத்திற்கு மங்கலமும் லட்சுமி கடாட்சமும் பெருக எங்கள் பிராத்தனைகள்.'
              : 'Thank you for revering authentic Tamil arts. Your order has been initiated with holy sanctuary care.'}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-black/40 backdrop-blur-xs px-4 py-1.5 rounded-full border border-yellow-400/50 text-xs text-yellow-200 font-mono">
            <span>Order ID:</span>
            <span className="font-bold text-yellow-300">{order.orderNumber}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Tracking Timeline Stepper */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-800" />
              <span>Live Order Journey & Tracking:</span>
            </h4>
            <div className="grid grid-cols-5 gap-1 pt-2">
              {steps.map((st, i) => (
                <div key={st.key} className="text-center space-y-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      st.active ? 'bg-yellow-500' : 'bg-stone-200'
                    }`}
                  />
                  <span
                    className={`block text-[10px] leading-tight font-bold ${
                      st.active ? 'text-[#B45309]' : 'text-stone-400'
                    }`}
                  >
                    {language === 'ta' ? st.labelTa : st.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 bg-yellow-50/70 rounded-xl border border-yellow-200/80 flex flex-wrap items-center justify-between text-xs text-stone-700 gap-2">
              <div>
                <span className="text-stone-500">Courier Partner: </span>
                <span className="font-semibold text-stone-900">{order.courierName}</span>
              </div>
              <div>
                <span className="text-stone-500">AWB Tracking No: </span>
                <span className="font-mono font-bold text-[#B45309]">{order.trackingNumber}</span>
              </div>
              <div>
                <span className="text-stone-500">Est. Delivery: </span>
                <span className="font-semibold text-emerald-800">
                  {order.deliveryDateEstimated || 'In 3-5 days'}
                </span>
              </div>
            </div>
          </div>

          {/* Ordered Items Preview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Items in this sacred package:
            </h4>
            <div className="divide-y divide-yellow-100 border border-yellow-200 rounded-2xl overflow-hidden bg-white">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-yellow-50"
                    />
                    <div>
                      <h5 className="font-bold text-stone-900">{item.productName}</h5>
                      <p className="text-[11px] text-stone-500 font-tamil">
                        {item.productNameTa} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-[#B45309]">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">
                Delivery Destination:
              </span>
              <p className="font-bold text-stone-900 mt-0.5">{order.shippingAddress.fullName}</p>
              <p className="text-stone-600 leading-snug">
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.pincode}
              </p>
              <p className="text-stone-600 mt-1">📞 {order.shippingAddress.phone}</p>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">
                Payment Summary:
              </span>
              <p className="font-bold text-stone-900 mt-0.5">
                {order.paymentMethod === 'razorpay' ? 'Razorpay Online Paid' : 'Cash on Delivery (COD)'}
              </p>
              <p className="text-emerald-700 font-medium">Status: {order.paymentStatus.toUpperCase()}</p>
              <p className="text-base font-extrabold text-[#B45309] mt-1">
                Total Paid: {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>

          {/* Actions: Download Invoice & Continue Shopping */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl border-2 border-yellow-500 text-stone-900 bg-yellow-50 hover:bg-yellow-100 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 text-amber-800" />
              <span>Download / Print GST Tax Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-stone-950 text-xs sm:text-sm font-black shadow-md border border-yellow-500 transition cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
