import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  Gift,
  HelpCircle,
  Settings,
  X,
  FileText,
  Truck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import {
  CustomerUser,
  Order,
  Product,
  Language,
  ShippingAddress,
  ContactEnquiry,
} from '../../types';
import { formatCurrency, storageService } from '../../services/storageService';
import { openPrintableInvoice } from '../../utils/invoiceGenerator';

interface CustomerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser | null;
  onUserChange: (user: CustomerUser | null) => void;
  orders: Order[];
  products: Product[];
  language: Language;
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  orders,
  products,
  language,
  onAddToCart,
  onBuyNow,
  onTrackOrder,
}) => {
  const [activeTab, setActiveTab] = useState<
    'orders' | 'addresses' | 'wishlist' | 'rewards' | 'support' | 'profile'
  >('orders');

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => storageService.getWishlist());
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);

  // Address form state
  const [addressForm, setAddressForm] = useState<ShippingAddress>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    street: '',
    landmark: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    addressType: 'home',
  });

  // Support enquiry form
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // Profile edit
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileSavedFeedback, setProfileSavedFeedback] = useState(false);

  if (!isOpen) return null;

  // Filter orders for current user
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
          currentUser.orderIds.includes(o.id)
      )
    : orders;

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleToggleWishlist = (productId: string) => {
    const updated = storageService.toggleWishlist(productId);
    setWishlistIds(storageService.getWishlist());
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const currentAddresses = currentUser.addresses || (currentUser.address ? [currentUser.address] : []);
    let updatedAddresses: ShippingAddress[];
    if (editingAddressIndex !== null) {
      updatedAddresses = [...currentAddresses];
      updatedAddresses[editingAddressIndex] = addressForm;
    } else {
      updatedAddresses = [...currentAddresses, addressForm];
    }
    const updatedUser: CustomerUser = {
      ...currentUser,
      addresses: updatedAddresses,
      address: updatedAddresses[0],
    };
    storageService.updateCustomer(updatedUser);
    onUserChange(updatedUser);
    setIsAddingAddress(false);
    setEditingAddressIndex(null);
  };

  const handleDeleteAddress = (index: number) => {
    if (!currentUser) return;
    const currentAddresses = currentUser.addresses || (currentUser.address ? [currentUser.address] : []);
    const updatedAddresses = currentAddresses.filter((_, i) => i !== index);
    const updatedUser: CustomerUser = {
      ...currentUser,
      addresses: updatedAddresses,
      address: updatedAddresses[0],
    };
    storageService.updateCustomer(updatedUser);
    onUserChange(updatedUser);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updatedUser: CustomerUser = {
      ...currentUser,
      name: profileName,
      phone: profilePhone,
    };
    storageService.updateCustomer(updatedUser);
    onUserChange(updatedUser);
    setProfileSavedFeedback(true);
    setTimeout(() => setProfileSavedFeedback(false), 2500);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.addEnquiry({
      name: currentUser?.name || 'Valued Devotee',
      email: currentUser?.email || 'customer@aram.in',
      phone: currentUser?.phone || '+91 98400 12345',
      subject: supportSubject,
      message: supportMessage,
    });
    setSupportSubmitted(true);
    setSupportSubject('');
    setSupportMessage('');
    setTimeout(() => setSupportSubmitted(false), 3000);
  };

  const userCoins = currentUser?.rewardPoints ?? 450;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FFFDF9] rounded-3xl shadow-2xl border-2 border-yellow-400 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Customer Header Banner */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-stone-950 flex flex-wrap items-center justify-between gap-4 border-b border-yellow-500 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-stone-950 text-yellow-300 flex items-center justify-center font-black text-xl shadow-md border-2 border-yellow-200">
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black font-heading leading-tight">
                  {currentUser ? `Vanakkam, ${currentUser.name}` : 'Aram Sacred Customer Portal'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-950 text-yellow-300 font-bold text-[10px] tracking-wide uppercase">
                  {currentUser?.tier || 'Aram Patron • புரவலர்'}
                </span>
              </div>
              <p className="text-xs text-stone-900 font-medium">
                {currentUser?.email || 'Sacred temple crafts devotee member'} • {currentUser?.phone || '+91 98401 23456'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Blessings Reward Coin Pill */}
            <div className="px-3.5 py-1.5 rounded-xl bg-stone-950/10 border border-stone-950/20 text-stone-950 text-xs font-black flex items-center gap-1.5">
              <span>🪙</span>
              <span>{userCoins} Temple Coins</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-950/15 text-stone-950 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-yellow-50/70 border-b border-yellow-200 px-4 sm:px-6 flex overflow-x-auto gap-2 py-2 shrink-0 text-xs font-bold">
          {[
            { key: 'orders', label: `My Orders (${userOrders.length})`, icon: <Package className="w-4 h-4" /> },
            { key: 'wishlist', label: `Sacred Wishlist (${wishlistIds.length})`, icon: <Heart className="w-4 h-4" /> },
            { key: 'addresses', label: 'Saved Addresses', icon: <MapPin className="w-4 h-4" /> },
            { key: 'rewards', label: 'Coins & Coupons', icon: <Gift className="w-4 h-4" /> },
            { key: 'support', label: 'Artisan Support', icon: <HelpCircle className="w-4 h-4" /> },
            { key: 'profile', label: 'Account Profile', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition shrink-0 cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-yellow-400 text-stone-950 font-black shadow-xs border border-yellow-500'
                  : 'text-stone-700 hover:bg-yellow-100/70'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Panel Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: ORDERS & TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                    Your Sacred Temple Orders ({userOrders.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    All orders are consecrated and safely dispatched with genuine transit insurance.
                  </p>
                </div>
              </div>

              {userOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-yellow-300 p-8 space-y-3">
                  <span className="text-4xl">🪔</span>
                  <p className="text-sm font-bold text-stone-800">No orders placed yet</p>
                  <p className="text-xs text-stone-500">Explore authentic Tamil crafts and bring temple blessings home.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 sm:p-5 bg-white rounded-2xl border border-yellow-200/90 shadow-2xs space-y-4 text-xs"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-[#B45309]">
                              {ord.orderNumber}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                ord.orderStatus === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'dispatched'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                              }`}
                            >
                              {ord.orderStatus.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Placed on {new Date(ord.createdAt).toLocaleDateString()} • Payment:{' '}
                            <span className="font-semibold text-stone-700 uppercase">
                              {ord.paymentMethod} ({ord.paymentStatus})
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onTrackOrder(ord.orderNumber)}
                            className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-stone-900 border border-yellow-300 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5 text-amber-800" />
                            <span>Live Track</span>
                          </button>

                          <button
                            onClick={() => openPrintableInvoice(ord)}
                            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-yellow-300 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Tax Invoice</span>
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-stone-100">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={it.image}
                                alt={it.productName}
                                className="w-12 h-12 rounded-lg object-cover bg-amber-50"
                              />
                              <div>
                                <p className="font-bold text-stone-900">{it.productName}</p>
                                <p className="text-[11px] text-stone-500">Qty: {it.quantity}</p>
                              </div>
                            </div>
                            <span className="font-bold text-stone-900">{formatCurrency(it.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total & Delivery note */}
                      <div className="pt-2 border-t border-stone-100 flex flex-wrap justify-between items-center text-xs">
                        <div className="text-stone-500 text-[11px]">
                          Courier: <span className="font-semibold text-stone-800">{ord.courierName}</span> • AWB:{' '}
                          <span className="font-mono text-stone-800">{ord.trackingNumber}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-stone-500 mr-2">Grand Total:</span>
                          <span className="text-base font-black text-[#B45309]">{formatCurrency(ord.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SACRED WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                    Your Sacred Wishlist ({wishlistProducts.length})
                  </h3>
                  <p className="text-xs text-stone-500">Traditional crafts you hold revered for your sanctum and family.</p>
                </div>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-yellow-300 p-8 space-y-3">
                  <span className="text-4xl">❤️</span>
                  <p className="text-sm font-bold text-stone-800">Your wishlist is empty</p>
                  <p className="text-xs text-stone-500">Browse the catalog and tap the heart icon to save sacred crafts.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-yellow-200/80 overflow-hidden shadow-2xs p-3 space-y-3 flex flex-col justify-between"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-amber-50">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleToggleWishlist(p.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-600 shadow cursor-pointer"
                          title="Remove from Wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 uppercase">{p.origin}</span>
                        <h4 className="font-bold text-stone-900 text-xs line-clamp-1">{p.name}</h4>
                        <p className="text-sm font-black text-[#B45309]">{formatCurrency(p.price)}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => onAddToCart(p)}
                          className="py-1.5 px-2 bg-yellow-100 hover:bg-yellow-200 text-stone-900 border border-yellow-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                        <button
                          onClick={() => onBuyNow(p)}
                          className="py-1.5 px-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 font-black rounded-lg text-xs transition border border-yellow-500 cursor-pointer"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                    Saved Delivery Addresses
                  </h3>
                  <p className="text-xs text-stone-500">Manage residences, temple halls, and gift destination addresses.</p>
                </div>

                {!isAddingAddress && (
                  <button
                    onClick={() => {
                      setAddressForm({
                        fullName: currentUser?.name || '',
                        phone: currentUser?.phone || '',
                        email: currentUser?.email || '',
                        street: '',
                        landmark: '',
                        city: 'Madurai',
                        state: 'Tamil Nadu',
                        pincode: '625001',
                        addressType: 'home',
                      });
                      setEditingAddressIndex(null);
                      setIsAddingAddress(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 text-xs font-black transition border border-yellow-500 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {isAddingAddress ? (
                <form
                  onSubmit={handleSaveAddress}
                  className="p-5 bg-white rounded-2xl border border-yellow-300 shadow-md space-y-4 text-xs"
                >
                  <h4 className="font-bold text-stone-900 text-sm">
                    {editingAddressIndex !== null ? 'Edit Address' : 'Add New Shipping Address'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Phone Number *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Street Address & Door No *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        placeholder="e.g. 108 Raja Street, East Gate"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">City / Town *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">State</label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-stone-50"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Address Label</label>
                      <select
                        value={addressForm.addressType}
                        onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value as any })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      >
                        <option value="home">Home (இல்லம்)</option>
                        <option value="work">Office / Workplace</option>
                        <option value="other">Temple / Pooja Hall</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 border rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 font-black rounded-xl border border-yellow-500 shadow-xs cursor-pointer"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(currentUser?.addresses || (currentUser?.address ? [currentUser.address] : [])).map((addr, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-2xl border border-yellow-200/90 shadow-2xs space-y-2 text-xs relative"
                    >
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-amber-900 font-bold uppercase text-[10px]">
                          {addr.addressType}
                        </span>
                        <div className="space-x-1">
                          <button
                            onClick={() => {
                              setAddressForm(addr);
                              setEditingAddressIndex(idx);
                              setIsAddingAddress(true);
                            }}
                            className="p-1 hover:bg-stone-100 rounded text-stone-600"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(idx)}
                            className="p-1 hover:bg-red-50 rounded text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h5 className="font-bold text-stone-900">{addr.fullName}</h5>
                      <p className="text-stone-600">{addr.street}</p>
                      <p className="text-stone-600">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-stone-500 text-[11px] pt-1">Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REWARDS & COUPONS */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-yellow-300 shadow-lg flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-yellow-400 font-bold">
                    Aram Blessings Wallet • புண்ணிய நாணயங்கள்
                  </span>
                  <h3 className="text-3xl font-black text-white">{userCoins} Coins</h3>
                  <p className="text-xs text-yellow-200/80">1 Temple Coin = ₹1 cash discount on checkout</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-yellow-400 text-stone-950 px-3 py-1 rounded-full font-black uppercase">
                    Auto Applied on Orders
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Available Auspicious Coupons
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 bg-white rounded-2xl border-2 border-yellow-300 shadow-2xs space-y-1">
                    <span className="font-mono font-black text-sm text-[#B45309]">ARAM10</span>
                    <p className="font-bold text-stone-900">10% Instant Off</p>
                    <p className="text-stone-500 text-[11px]">Valid on all bronze and brass pooja crafts.</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border-2 border-yellow-300 shadow-2xs space-y-1">
                    <span className="font-mono font-black text-sm text-[#B45309]">VANAKKAM</span>
                    <p className="font-bold text-stone-900">Flat ₹200 Off</p>
                    <p className="text-stone-500 text-[11px]">Welcome gift on your first sacred craft order.</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border-2 border-yellow-300 shadow-2xs space-y-1">
                    <span className="font-mono font-black text-sm text-[#B45309]">FESTIVE</span>
                    <p className="font-bold text-stone-900">15% Off Festival Special</p>
                    <p className="text-stone-500 text-[11px]">For orders containing festival deepams & silks.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ARTISAN SUPPORT & ENQUIRIES */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inquiry Form */}
                <div className="p-5 bg-white rounded-2xl border border-yellow-300/80 shadow-2xs space-y-4 text-xs">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Ask Our Temple Craftsmen (Sthapatis)</span>
                  </h4>
                  <p className="text-stone-500">
                    Custom deity statue dimensions, Kumbhabhishekam brass sets, or horoscope-specific metal casting.
                  </p>

                  {supportSubmitted && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold border border-emerald-300">
                      ✓ Your enquiry has been received with reverent care. Our artisan team will reply within 24 hours.
                    </div>
                  )}

                  <form onSubmit={handleSupportSubmit} className="space-y-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Subject / Craft Query</label>
                      <input
                        type="text"
                        required
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        placeholder="e.g. 24-inch Nataraja bronze custom weight"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Message Details</label>
                      <textarea
                        rows={3}
                        required
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        placeholder="Describe your altar space, required pooja specifications, or delivery urgency..."
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 font-black border border-yellow-500 shadow-xs cursor-pointer"
                    >
                      Submit Artisan Enquiry
                    </button>
                  </form>
                </div>

                {/* Direct Contact Channels */}
                <div className="space-y-4 text-xs">
                  <div className="p-5 bg-yellow-50/80 rounded-2xl border border-yellow-300 space-y-3">
                    <h5 className="font-bold text-stone-900">Direct Sanctuary Helpline</h5>
                    <p className="text-stone-600 leading-relaxed">
                      Our Madurai & Thanjavur heritage centers are open daily from 6:00 AM to 9:00 PM IST.
                    </p>
                    <div className="space-y-2 pt-1 font-semibold text-stone-800">
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-amber-700" /> +91 98400 12345 / +91 94431 88990
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-amber-700" /> blessings@arambrand.in
                      </p>
                    </div>
                    <a
                      href="https://wa.me/919840012345"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition"
                    >
                      <span>💬 Chat on WhatsApp with Sthapati</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ACCOUNT PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="max-w-xl space-y-6 text-xs">
              <form onSubmit={handleSaveProfile} className="p-5 bg-white rounded-2xl border border-yellow-300 space-y-4">
                <h4 className="font-bold text-stone-900 text-sm">Personal Devotee Profile</h4>

                {profileSavedFeedback && (
                  <p className="p-2 bg-emerald-100 text-emerald-800 font-bold rounded-lg">
                    ✓ Profile updated successfully!
                  </p>
                )}

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email (Registered)</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || 'devotee@aram.in'}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-100 text-stone-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mobile Phone (for Courier SMS)</label>
                  <input
                    type="text"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 font-black rounded-xl border border-yellow-500 shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>

              {/* Demo switch account */}
              <div className="p-4 bg-yellow-50/60 rounded-2xl border border-yellow-200 space-y-2">
                <h5 className="font-bold text-stone-800">Demo Customer Quick Switch</h5>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const custs = storageService.getCustomers();
                      if (custs[0]) {
                        onUserChange(custs[0]);
                        setProfileName(custs[0].name);
                        setProfilePhone(custs[0].phone);
                      }
                    }}
                    className="px-3 py-1.5 bg-white border border-yellow-300 rounded-lg text-[11px] font-bold hover:bg-yellow-100 cursor-pointer"
                  >
                    Switch to Anand Natarajan
                  </button>
                  <button
                    onClick={() => {
                      const custs = storageService.getCustomers();
                      if (custs[1]) {
                        onUserChange(custs[1]);
                        setProfileName(custs[1].name);
                        setProfilePhone(custs[1].phone);
                      }
                    }}
                    className="px-3 py-1.5 bg-white border border-yellow-300 rounded-lg text-[11px] font-bold hover:bg-yellow-100 cursor-pointer"
                  >
                    Switch to Priya Soundararajan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
