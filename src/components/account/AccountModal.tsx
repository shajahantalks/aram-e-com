import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  MapPin,
  LogOut,
  FileText,
  Truck,
  CheckCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { CustomerUser, Order, Language } from '../../types';
import { storageService, formatCurrency } from '../../services/storageService';
import { openPrintableInvoice } from '../../utils/invoiceGenerator';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currentUser: CustomerUser | null;
  onUserChange: (user: CustomerUser | null) => void;
  language: Language;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentUser,
  onUserChange,
  language,
}) => {
  if (!isOpen) return null;

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  // Filter orders matching logged in user or show all recent for demo convenience
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
          currentUser.orderIds.includes(o.id)
      )
    : orders;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please provide your email');
      return;
    }
    const customers = storageService.getCustomers();
    let existing = customers.find((c) => c.email.toLowerCase() === email.toLowerCase());

    if (!existing) {
      existing = {
        id: `cust-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        phone: '+91 98400 00000',
        orderIds: [],
        createdAt: new Date().toISOString(),
      };
      customers.push(existing);
      storageService.saveCustomers(customers);
    }

    storageService.setCurrentUser(existing);
    onUserChange(existing);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email) {
      setError('Name and Email are required');
      return;
    }

    const customers = storageService.getCustomers();
    const existing = customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      storageService.setCurrentUser(existing);
      onUserChange(existing);
      return;
    }

    const newCust: CustomerUser = {
      id: `cust-${Date.now()}`,
      name,
      email,
      phone: phone || '+91 98400 12345',
      orderIds: [],
      createdAt: new Date().toISOString(),
    };
    customers.push(newCust);
    storageService.saveCustomers(customers);
    storageService.setCurrentUser(newCust);
    onUserChange(newCust);
  };

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    onUserChange(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl shadow-2xl border border-amber-300 overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-stone-950 flex items-center justify-between border-b border-yellow-500">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-stone-950" />
            <h2 className="text-base font-black font-heading">
              {currentUser
                ? `Vanakkam, ${currentUser.name}`
                : language === 'ta'
                ? 'பயனர் கணக்கு & உள்நுழைவு'
                : 'Customer Account & Order History'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-950/10 text-stone-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!currentUser ? (
            /* Auth Form */
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex border-b border-stone-200 text-xs font-bold text-center">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2.5 transition cursor-pointer ${
                    authMode === 'login'
                      ? 'border-b-2 border-yellow-500 text-stone-950 font-black'
                      : 'text-stone-500'
                  }`}
                >
                  Member Sign In
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2.5 transition cursor-pointer ${
                    authMode === 'register'
                      ? 'border-b-2 border-yellow-500 text-stone-950 font-black'
                      : 'text-stone-500'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. anand.natarajan@example.com"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Password (or One-Time OTP)
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                  {error && <p className="text-[11px] text-red-600">{error}</p>}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 font-black text-xs hover:from-yellow-300 hover:to-amber-300 transition shadow-xs border border-yellow-500 cursor-pointer"
                  >
                    Sign In to Account
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('anand.natarajan@example.com');
                        const cust = storageService.getCustomers()[0];
                        if (cust) {
                          storageService.setCurrentUser(cust);
                          onUserChange(cust);
                        }
                      }}
                      className="text-[11px] text-amber-800 underline hover:text-amber-900 font-semibold cursor-pointer"
                    >
                      ⚡ Quick Demo Login as "Anand Natarajan"
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Soundararajan"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 97900 11223"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                  {error && <p className="text-[11px] text-red-600">{error}</p>}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 font-black text-xs hover:from-yellow-300 hover:to-amber-300 transition shadow-xs border border-yellow-500 cursor-pointer"
                  >
                    Register New Account
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Logged in User Dashboard */
            <div className="space-y-6">
              {/* User Bar */}
              <div className="flex items-center justify-between p-3.5 bg-yellow-50/70 rounded-2xl border border-yellow-200">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{currentUser.name}</h3>
                  <p className="text-[11px] text-stone-500">
                    {currentUser.email} • {currentUser.phone}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-50 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#B45309]" />
                  <span>Your Sacred Orders & Tracking ({userOrders.length})</span>
                </h3>

                {userOrders.length === 0 ? (
                  <p className="text-xs text-stone-400 py-6 text-center">
                    No orders placed yet. Explore our temple collections to place your first order.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {userOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 bg-white rounded-2xl border border-yellow-200/80 shadow-2xs space-y-3 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                          <div>
                            <span className="font-mono font-bold text-[#B45309]">
                              {ord.orderNumber}
                            </span>
                            <span className="text-stone-400 ml-2">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              ord.orderStatus === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.orderStatus === 'dispatched'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                            }`}
                          >
                            Status: {ord.orderStatus.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-1.5">
                          {ord.items.map((it, i) => (
                            <div key={i} className="flex justify-between items-center text-[11px]">
                              <span className="truncate max-w-xs text-stone-800">
                                {it.productName} × {it.quantity}
                              </span>
                              <span className="font-semibold text-stone-900">
                                {formatCurrency(it.price * it.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Tracking & Total Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-stone-500">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Truck className="w-3.5 h-3.5 text-amber-700" />
                            <span>AWB: {ord.trackingNumber || 'Processing'}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-[#B45309] text-sm">
                              {formatCurrency(ord.totalAmount)}
                            </span>
                            <button
                              onClick={() => openPrintableInvoice(ord)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 hover:bg-yellow-200 text-stone-900 border border-yellow-300 rounded-lg text-xs font-bold transition cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-stone-800" />
                              <span>Invoice</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
