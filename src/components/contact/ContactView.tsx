import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Sparkles,
  Instagram,
  Facebook,
  Youtube,
  Globe,
} from 'lucide-react';
import { Language } from '../../types';
import { storageService } from '../../services/storageService';

interface ContactViewProps {
  language: Language;
}

export const ContactView: React.FC<ContactViewProps> = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    storageService.addEnquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject || 'Store Enquiry',
      message: formData.message,
    });

    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B45309]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'ta' ? 'தொடர்பு & கோவில் மையம்' : 'Contact & Heritage Center'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] font-heading">
            {language === 'ta' ? 'அறம் இல்லத்திற்கு நல்வரவு' : 'Connect with Aram Brand'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            {language === 'ta'
              ? 'கோவில் கும்பாபிஷேக மொத்த ஆர்டர்கள், சிறப்பு பித்தளை தயாரிப்புகள் அல்லது சந்தேகங்களுக்கு எங்களை அணுகலாம்.'
              : 'Inquire about custom temple bronze icons, bulk wedding gifts, silk drapes, or artisan partnerships.'}
          </p>
        </div>

        {/* 3 Quick Action Cards: Call, WhatsApp, Heritage Center */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Click to Call */}
          <div className="p-6 bg-white rounded-2xl border border-yellow-200/80 shadow-2xs text-center space-y-3 hover:border-yellow-400 transition">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto text-[#B45309]">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-heading">
              {language === 'ta' ? 'தொலைபேசி நேரடி அழைப்பு' : 'Direct Call Support'}
            </h3>
            <p className="text-xs text-stone-500">
              Speak directly with our Tamil heritage craft consultants.
            </p>
            <a
              href="tel:+919840012345"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 text-xs font-bold hover:from-yellow-300 hover:to-amber-300 transition shadow-xs border border-yellow-500 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+91 98400 12345</span>
            </a>
          </div>

          {/* WhatsApp Direct Chat */}
          <div className="p-6 bg-white rounded-2xl border border-amber-200/80 shadow-2xs text-center space-y-3 hover:border-emerald-400 transition">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-heading">
              {language === 'ta' ? 'வாட்ஸ்அப் உதவி' : 'WhatsApp Concierge'}
            </h3>
            <p className="text-xs text-stone-500">
              Share photos of required temple items or get instant tracking.
            </p>
            <a
              href="https://wa.me/919840012345?text=Vanakkam%20Aram%20Brand!%20I%20would%20like%20to%20inquire%20about%20your%20traditional%20crafts."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Heritage Center Location */}
          <div className="p-6 bg-white rounded-2xl border border-amber-200/80 shadow-2xs text-center space-y-3 hover:border-amber-400 transition">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-800">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-heading">
              {language === 'ta' ? 'பாரம்பரிய மையம்' : 'Sanctum Store'}
            </h3>
            <p className="text-xs text-stone-500">
              108 Raja Veedhi, East Gopuram Gateway, Madurai, TN - 625001
            </p>
            <span className="inline-block text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Open Daily: 8:00 AM – 9:00 PM
            </span>
          </div>
        </div>

        {/* Contact Form & Interactive Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-md space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-heading">
                {language === 'ta' ? 'எங்களுக்கு செய்தி அனுப்புக' : 'Send an Enquiry / Bulk Order'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                We respond within 4 business hours with detailed catalogs and pricing.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">
                  {language === 'ta' ? 'நன்றி! உங்கள் செய்தி பெறப்பட்டது' : 'Message Received with Blessings!'}
                </h3>
                <p className="text-xs text-emerald-700">
                  Our team will contact you shortly via email / phone.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Meenakshi"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98400 12345"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="meenakshi@example.com"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Enquiry Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Kumbhabhishekam Brass Vilakku bulk inquiry"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Message / Custom Requirement Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe the craft items, required quantity, or pooja ceremony specifications..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-stone-950 font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 border border-yellow-500 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'ta' ? 'விசாரணையை அனுப்புக' : 'Submit Enquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Interactive Google Maps Visualization & Social Links */}
          <div className="lg:col-span-6 space-y-6">
            {/* Map Card */}
            <div className="bg-white rounded-3xl border border-yellow-200/80 shadow-md overflow-hidden">
              <div className="p-4 bg-stone-50 border-b border-yellow-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#B45309]" />
                  <span className="text-xs font-bold text-stone-900">
                    Heritage Center Location (Madurai - Thanjavur Arts Corridor)
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                  Live Landmark
                </span>
              </div>

              {/* Styled Interactive Map Embed representation */}
              <div className="relative h-72 bg-yellow-50">
                <iframe
                  title="Aram Brand Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.9866891039864!2d78.1172836!3d9.9195324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c582b1189633%3A0xdc955b7264f63933!2sMadurai%20Meenakshi%20Amman%20Temple!5e0!3m2!1sen!2sin!4v1689000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full filter saturate-150 contrast-95"
                />

                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-yellow-300 shadow-md text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-[#B45309]">Aram Brand Heritage Sanctum</p>
                    <p className="text-[10px] text-stone-600">108 Raja Veedhi, East Gate, Madurai, TN</p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Madurai+Meenakshi+Temple"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-stone-950 text-[11px] rounded-lg font-black transition border border-yellow-500"
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media & Digital Connect */}
            <div className="p-6 bg-white rounded-3xl border border-amber-200/80 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Connect on Traditional Social Channels:
              </h3>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-amber-500/10 border border-pink-200 hover:border-pink-400 text-pink-700 flex items-center justify-center gap-2 text-xs font-bold transition"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-3 rounded-xl bg-red-50 border border-red-200 hover:border-red-400 text-red-700 flex items-center justify-center gap-2 text-xs font-bold transition"
                >
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span>YouTube</span>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-3 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-400 text-blue-700 flex items-center justify-center gap-2 text-xs font-bold transition"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
