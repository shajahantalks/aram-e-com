import React, { useState } from 'react';
import {
  Search,
  Truck,
  Package,
  Calendar,
  CheckCircle2,
  FileText,
  MapPin,
  Sparkles,
  Phone,
} from 'lucide-react';
import { Order, Language } from '../../types';
import { formatCurrency } from '../../services/storageService';
import { openPrintableInvoice } from '../../utils/invoiceGenerator';

interface OrderTrackingViewProps {
  orders: Order[];
  language: Language;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  language,
}) => {
  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const q = query.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
    );
    setSelectedOrder(found || null);
    setSearched(true);
  };

  const steps = [
    { key: 'placed', label: 'Order Received', labelTa: 'ஆர்டர் பெறப்பட்டது' },
    { key: 'confirmed', label: 'Temple Sanctum Care', labelTa: 'ஆசி பெற்ற பேக்கிங்' },
    { key: 'packed', label: 'Secured Boxed', labelTa: 'பாதுகாப்பு பெட்டி' },
    { key: 'dispatched', label: 'In Sacred Transit', labelTa: 'விநியோகத்தில்' },
    { key: 'out_for_delivery', label: 'Out for Delivery', labelTa: 'இன்றைய விநியோகம்' },
    { key: 'delivered', label: 'Delivered Blessings', labelTa: 'சேர்க்கப்பட்டது' },
  ];

  const getStepIndex = (status: Order['orderStatus']) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'packed':
        return 2;
      case 'dispatched':
        return 3;
      case 'out_for_delivery':
        return 4;
      case 'delivered':
        return 5;
      default:
        return 0;
    }
  };

  const currentStepIndex = selectedOrder ? getStepIndex(selectedOrder.orderStatus) : 0;

  return (
    <div className="py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B45309]">
            <Truck className="w-4 h-4 text-amber-500" />
            <span>{language === 'ta' ? 'ஆர்டர் நேரடி கண்காணிப்பு' : 'Live Sacred Tracking'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#2C1810] font-heading">
            {language === 'ta' ? 'உங்கள் ஆர்டரை கண்காணிக்கவும்' : 'Track Your Shipment'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Enter your Order ID (e.g. ARAM-2026-9812) or registered phone number.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. ARAM-2026-9812 or 9840123456"
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400 shadow-2xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-stone-950 rounded-xl text-xs sm:text-sm font-black shadow-md border border-yellow-500 transition cursor-pointer"
          >
            Track Order
          </button>
        </form>

        {/* Demo Quick Select Pill */}
        <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
          <span>Try Demo Order:</span>
          {orders.slice(0, 2).map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setQuery(o.orderNumber);
                setSelectedOrder(o);
                setSearched(true);
              }}
              className="px-2.5 py-1 bg-yellow-100 hover:bg-yellow-200 text-stone-900 border border-yellow-300 rounded-lg font-mono font-bold text-[11px] cursor-pointer"
            >
              {o.orderNumber}
            </button>
          ))}
        </div>

        {/* Order Details Card */}
        {selectedOrder ? (
          <div className="bg-white rounded-3xl border border-yellow-200/80 shadow-md p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                  Order Number
                </span>
                <h3 className="text-xl font-black text-[#B45309] font-mono">
                  {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-stone-500">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                  Logistics Partner
                </span>
                <span className="font-bold text-stone-900 text-xs">{selectedOrder.courierName}</span>
                <p className="text-xs text-amber-800 font-mono font-semibold">
                  AWB: {selectedOrder.trackingNumber}
                </p>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="py-4">
              <div className="relative">
                {/* Line */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-stone-200 -z-0" />
                <div
                  className="absolute top-4 left-0 h-1 bg-yellow-500 -z-0 transition-all duration-500"
                  style={{
                    width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  }}
                />

                <div className="grid grid-cols-6 relative z-10">
                  {steps.map((st, i) => {
                    const isCompleted = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    return (
                      <div key={st.key} className="text-center flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                            isCompleted
                              ? 'bg-yellow-400 text-stone-950 border-yellow-500 shadow-md font-black'
                              : 'bg-white text-stone-400 border-stone-300'
                          } ${isCurrent ? 'ring-4 ring-yellow-300/80 scale-110' : ''}`}
                        >
                          {isCompleted ? '✓' : i + 1}
                        </div>
                        <span
                          className={`mt-2 text-[10px] sm:text-[11px] font-semibold leading-tight max-w-[80px] ${
                            isCompleted ? 'text-stone-900 font-bold' : 'text-stone-400'
                          }`}
                        >
                          {language === 'ta' ? st.labelTa : st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Delivery Status Banner */}
            <div className="p-4 bg-yellow-50/70 rounded-2xl border border-yellow-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-800" />
                <div>
                  <span className="font-bold text-stone-900">
                    Status: {selectedOrder.orderStatus.replace('_', ' ').toUpperCase()}
                  </span>
                  <p className="text-[11px] text-stone-500">
                    Estimated Doorstep Delivery: <b>{selectedOrder.deliveryDateEstimated || 'In 2-4 days'}</b>
                  </p>
                </div>
              </div>
              <button
                onClick={() => openPrintableInvoice(selectedOrder)}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 rounded-xl font-black flex items-center gap-1.5 hover:from-yellow-300 hover:to-amber-300 transition shadow-xs border border-yellow-500 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-stone-900" />
                <span>View / Print GST Invoice</span>
              </button>
            </div>

            {/* Package Contents */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Contents in this parcel:
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.productName} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-stone-900">{it.productName}</p>
                        <p className="text-stone-500 text-[11px]">Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#B45309]">{formatCurrency(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          searched && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300 p-8">
              <p className="text-sm font-bold text-stone-700">No order found matching "{query}"</p>
              <p className="text-xs text-stone-400 mt-1">Please double check your Order ID or contact support.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
