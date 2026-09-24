import React, { useState, useRef } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Search,
  ArrowLeft,
  Truck,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  Layers,
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Copy,
  Eye,
  Sliders,
  Flame,
  RotateCcw,
} from 'lucide-react';
import {
  Product,
  Category,
  Order,
  GalleryItem,
  ContactEnquiry,
  CustomerUser,
  Language,
  TempleVideoConfig,
} from '../../types';
import {
  storageService,
  formatCurrency,
  TEMPLE_VIDEO_PRESETS,
  DEFAULT_TEMPLE_VIDEO_CONFIG,
} from '../../services/storageService';
import { openPrintableInvoice } from '../../utils/invoiceGenerator';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  gallery: GalleryItem[];
  enquiries: ContactEnquiry[];
  customers: CustomerUser[];
  onClose: () => void;
  language: Language;
  onRefreshData: () => void;
  videoConfig?: TempleVideoConfig;
  onUpdateVideoConfig?: (config: TempleVideoConfig) => void;
  initialTab?: 'analytics' | 'video' | 'products' | 'orders' | 'categories' | 'gallery' | 'enquiries' | 'customers';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  orders,
  gallery,
  enquiries,
  customers,
  onClose,
  language,
  onRefreshData,
  videoConfig = DEFAULT_TEMPLE_VIDEO_CONFIG,
  onUpdateVideoConfig,
  initialTab = 'analytics',
}) => {
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'video' | 'products' | 'orders' | 'categories' | 'gallery' | 'enquiries' | 'customers'
  >(initialTab);

  // Video Studio State
  const [adminVideoConfig, setAdminVideoConfig] = useState<TempleVideoConfig>(videoConfig);
  const [videoSavedFeedback, setVideoSavedFeedback] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);
  const [isPreviewMuted, setIsPreviewMuted] = useState(true);

  // Product Add / Edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    nameTa: '',
    category: 'Temple Puja & Brassware',
    categoryId: 'cat-1',
    price: 999,
    originalPrice: 1299,
    discountPercentage: 23,
    images: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?auto=format&fit=crop&w=800&q=80',
    description: '',
    descriptionTa: '',
    shortDesc: 'Auspicious handcrafted craft',
    shortDescTa: 'பாரம்பரிய தெய்வ கலைப் பொக்கிஷம்',
    inStock: true,
    stockQuantity: 20,
    sku: `ARM-${Date.now().toString().slice(-4)}`,
    weight: '1.0 kg',
    origin: 'Madurai, Tamil Nadu',
    material: 'Pure Brass / Traditional Craft',
    culturalNote: '',
  });

  // Gallery Add modal state
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    titleTa: '',
    category: 'temple' as 'temple' | 'artisan' | 'handloom' | 'festivals',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    description: '',
    descriptionTa: '',
    location: 'Madurai, Tamil Nadu',
  });

  // Tracking number editing
  const [editingTrackingOrderId, setEditingTrackingOrderId] = useState<string | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  // Search & Filter in Products Tab
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // High-level analytics
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0),
    0
  );
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const activeProductsCount = products.filter((p) => p.inStock).length;

  // VIDEO EDITING STUDIO HANDLERS
  const handleApplyPreset = (presetId: string) => {
    const preset = TEMPLE_VIDEO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setAdminVideoConfig({
      ...adminVideoConfig,
      activePresetId: preset.id,
      videoUrl: preset.videoUrl,
      posterUrl: preset.posterUrl,
    });
  };

  const handleSaveVideoConfig = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveVideoConfig(adminVideoConfig);
    if (onUpdateVideoConfig) {
      onUpdateVideoConfig(adminVideoConfig);
    }
    setVideoSavedFeedback(true);
    setTimeout(() => setVideoSavedFeedback(false), 3000);
  };

  const handleResetVideoDefaults = () => {
    if (confirm('Reset video configuration to sacred default settings?')) {
      const def = storageService.resetVideoConfig();
      setAdminVideoConfig(def);
      if (onUpdateVideoConfig) {
        onUpdateVideoConfig(def);
      }
    }
  };

  // PRODUCT CRUD HANDLERS
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const imgs = productForm.images
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProduct) {
      storageService.updateProduct({
        ...editingProduct,
        name: productForm.name,
        nameTa: productForm.nameTa,
        category: productForm.category,
        categoryId: productForm.categoryId,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        discountPercentage: Math.max(
          0,
          Math.round(
            ((Number(productForm.originalPrice) - Number(productForm.price)) /
              Number(productForm.originalPrice)) *
              100
          )
        ),
        images: imgs.length > 0 ? imgs : editingProduct.images,
        description: productForm.description,
        descriptionTa: productForm.descriptionTa,
        shortDesc: productForm.shortDesc,
        shortDescTa: productForm.shortDescTa,
        inStock: productForm.inStock,
        stockQuantity: Number(productForm.stockQuantity),
        sku: productForm.sku,
        weight: productForm.weight,
        origin: productForm.origin,
        material: productForm.material,
        culturalNote: productForm.culturalNote,
      });
      setEditingProduct(null);
    } else {
      storageService.addProduct({
        name: productForm.name,
        nameTa: productForm.nameTa,
        category: productForm.category,
        categoryId: productForm.categoryId,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        discountPercentage: Math.max(
          0,
          Math.round(
            ((Number(productForm.originalPrice) - Number(productForm.price)) /
              Number(productForm.originalPrice)) *
              100
          )
        ),
        rating: 5.0,
        reviewCount: 1,
        images: imgs,
        description: productForm.description,
        descriptionTa: productForm.descriptionTa,
        shortDesc: productForm.shortDesc,
        shortDescTa: productForm.shortDescTa,
        inStock: productForm.inStock,
        stockQuantity: Number(productForm.stockQuantity),
        sku: productForm.sku,
        weight: productForm.weight,
        origin: productForm.origin,
        material: productForm.material,
        features: ['Handcrafted with sacred care', '100% authentic traditional material'],
        culturalNote: productForm.culturalNote,
      });
      setIsAddingProduct(false);
    }
    onRefreshData();
  };

  const handleDuplicateProduct = (p: Product) => {
    storageService.addProduct({
      ...p,
      name: `${p.name} (Copy)`,
      nameTa: `${p.nameTa} (நகல்)`,
      sku: `${p.sku}-CPY${Date.now().toString().slice(-3)}`,
    });
    onRefreshData();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to permanently remove this craft from the catalog?')) {
      storageService.deleteProduct(id);
      onRefreshData();
    }
  };

  const handleToggleStock = (product: Product) => {
    storageService.updateProduct({
      ...product,
      inStock: !product.inStock,
    });
    onRefreshData();
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    storageService.updateOrderStatus(orderId, status);
    onRefreshData();
  };

  const handleSaveTrackingNumber = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (ord) {
      storageService.updateOrderStatus(orderId, ord.orderStatus, trackingNumberInput);
      setEditingTrackingOrderId(null);
      setTrackingNumberInput('');
      onRefreshData();
    }
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.addGalleryItem({
      title: galleryForm.title,
      titleTa: galleryForm.titleTa,
      category: galleryForm.category,
      image: galleryForm.image,
      description: galleryForm.description,
      descriptionTa: galleryForm.descriptionTa,
      location: galleryForm.location,
    });
    setIsAddingGallery(false);
    onRefreshData();
  };

  const handleDeleteGallery = (id: string) => {
    storageService.deleteGalleryItem(id);
    onRefreshData();
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = productCategoryFilter === 'all' || p.categoryId === productCategoryFilter;
    const matchQuery =
      productSearch === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.nameTa.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.origin.toLowerCase().includes(productSearch.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFBF7] overflow-y-auto flex flex-col">
      {/* Top Admin Header Bar */}
      <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-stone-950 px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-yellow-500 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950 text-yellow-300 hover:bg-stone-900 text-xs font-bold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>
          <div className="h-5 w-px bg-stone-900/20" />
          <div>
            <h1 className="text-base sm:text-lg font-black font-heading flex items-center gap-2 text-stone-950">
              <span>ARAM BRAND MASTER ADMIN</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-950 text-yellow-300 font-bold">
                FULL ACCESS v3.0
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Reset entire catalog, orders, and demo data to default state?')) {
                storageService.resetToDefaults();
                onRefreshData();
              }
            }}
            className="px-2.5 py-1 rounded bg-stone-900/80 hover:bg-stone-900 text-yellow-300 text-[11px] font-semibold cursor-pointer"
          >
            Reset Seed Data
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-950/10 hover:bg-stone-950/20 text-stone-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="bg-white border-b border-yellow-200 px-4 sm:px-8 flex overflow-x-auto gap-2 py-2 shrink-0 text-xs font-bold">
        {[
          { key: 'analytics', label: 'Analytics & Overview', icon: <BarChart3 className="w-4 h-4" /> },
          { key: 'video', label: 'Temple Video & Media Studio 🎦', icon: <Video className="w-4 h-4 text-amber-700" /> },
          { key: 'products', label: `Products Catalog (${products.length})`, icon: <Package className="w-4 h-4" /> },
          { key: 'orders', label: `Orders (${orders.length})`, icon: <ShoppingCart className="w-4 h-4" /> },
          { key: 'categories', label: `Categories (${categories.length})`, icon: <Layers className="w-4 h-4" /> },
          { key: 'customers', label: `Customers (${customers.length})`, icon: <Users className="w-4 h-4" /> },
          { key: 'gallery', label: `Gallery (${gallery.length})`, icon: <ImageIcon className="w-4 h-4" /> },
          { key: 'enquiries', label: `Inquiries (${enquiries.length})`, icon: <MessageSquare className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 cursor-pointer ${
              activeTab === tab.key
                ? 'bg-yellow-400 text-stone-950 font-black shadow-xs border border-yellow-500'
                : 'text-stone-600 hover:bg-yellow-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* TAB 1: ANALYTICS OVERVIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-yellow-200/80 shadow-2xs space-y-1">
                <span className="text-stone-500 text-xs font-semibold">Total Revenue (Gross)</span>
                <p className="text-2xl font-black text-[#B45309]">{formatCurrency(totalRevenue)}</p>
                <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +28% from sacred season
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-yellow-200/80 shadow-2xs space-y-1">
                <span className="text-stone-500 text-xs font-semibold">Total Orders Processed</span>
                <p className="text-2xl font-black text-stone-900">{totalOrdersCount}</p>
                <span className="text-[11px] text-stone-500">100% fulfillment rate</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-yellow-200/80 shadow-2xs space-y-1">
                <span className="text-stone-500 text-xs font-semibold">Avg. Order Value (AOV)</span>
                <p className="text-2xl font-black text-amber-900">{formatCurrency(avgOrderValue)}</p>
                <span className="text-[11px] text-stone-500">Traditional crafts basket</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-yellow-200/80 shadow-2xs space-y-1">
                <span className="text-stone-500 text-xs font-semibold">Active Catalog Crafts</span>
                <p className="text-2xl font-black text-emerald-800">{activeProductsCount}</p>
                <span className="text-[11px] text-stone-500">Across 15 GI categories</span>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-yellow-300 font-bold block">
                  Quick Administration Access
                </span>
                <h3 className="text-lg font-black mt-1">Master Craft & Video Customization</h3>
                <p className="text-xs text-yellow-100/80 mt-0.5">
                  Update homepage temple animation videos, manage lost-wax bronze stock, and track live dispatches.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('video')}
                  className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-stone-950 text-xs font-black transition cursor-pointer shadow-md"
                >
                  Configure Temple Video 🎦
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddingProduct(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-200 text-xs font-bold transition cursor-pointer"
                >
                  + Add New Craft
                </button>
              </div>
            </div>

            {/* Recent Orders Feed */}
            <div className="bg-white rounded-2xl border border-yellow-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-stone-200 flex justify-between items-center">
                <h3 className="text-sm font-bold text-stone-900 font-heading">Recent Orders Feed</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#B45309] font-bold hover:underline cursor-pointer"
                >
                  View All Orders →
                </button>
              </div>
              <div className="divide-y divide-stone-100 text-xs">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-stone-800">{o.orderNumber}</span>
                      <p className="text-stone-500 text-[11px]">
                        {o.customerName} • {o.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#B45309]">{formatCurrency(o.totalAmount)}</p>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {o.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPLETE TEMPLE VIDEO & MEDIA STUDIO */}
        {activeTab === 'video' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 font-heading flex items-center gap-2">
                  <Video className="w-5 h-5 text-amber-700" />
                  <span>Homepage Temple Animation Video Studio</span>
                </h2>
                <p className="text-xs text-stone-500">
                  Full access to configure, customize, replace, and fine-tune the first page temple animation video.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetVideoDefaults}
                  className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {videoSavedFeedback && (
              <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>
                  ✓ Temple Animation Video updated and applied live to the Homepage and First Page!
                </span>
              </div>
            )}

            {/* Presets Quick Picker */}
            <div className="p-4 bg-yellow-50/80 rounded-2xl border border-yellow-300 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                Select Temple Animation Video Preset:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {TEMPLE_VIDEO_PRESETS.map((p) => {
                  const isCur = adminVideoConfig.activePresetId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleApplyPreset(p.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isCur
                          ? 'bg-yellow-400 border-yellow-500 text-stone-950 font-black shadow-md ring-2 ring-yellow-400'
                          : 'bg-white hover:bg-yellow-100/60 border-stone-200 text-stone-800'
                      }`}
                    >
                      <div>
                        <span className="text-lg block mb-1">🪔</span>
                        <p className="font-bold leading-snug">{p.name}</p>
                        <p className="text-[10px] text-stone-600 mt-1 line-clamp-1">{p.location}</p>
                      </div>
                      <span className="text-[10px] mt-2 block font-semibold opacity-75">
                        {isCur ? '✓ Active Preset' : 'Click to Load'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video Studio Form & Live Preview Grid */}
            <form onSubmit={handleSaveVideoConfig} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Controls Left */}
              <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-yellow-200 shadow-2xs space-y-4 text-xs">
                <h3 className="text-sm font-bold text-stone-900 border-b pb-2 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-700" />
                  <span>Video Source & Visual Controls</span>
                </h3>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Temple Animation Video URL (MP4 / WebM / Direct Stream) *
                  </label>
                  <input
                    type="url"
                    required
                    value={adminVideoConfig.videoUrl}
                    onChange={(e) =>
                      setAdminVideoConfig({ ...adminVideoConfig, videoUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl font-mono text-[11px] focus:outline-none focus:border-yellow-500"
                    placeholder="https://..."
                  />
                  <span className="text-[10px] text-stone-500">
                    Supports high-resolution MP4 temple footage or animated 3D video loop.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Poster / Fallback Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={adminVideoConfig.posterUrl}
                    onChange={(e) =>
                      setAdminVideoConfig({ ...adminVideoConfig, posterUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl font-mono text-[11px] focus:outline-none focus:border-yellow-500"
                    placeholder="https://..."
                  />
                </div>

                {/* Text Overlays */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Hero Title (English)
                    </label>
                    <input
                      type="text"
                      value={adminVideoConfig.title}
                      onChange={(e) =>
                        setAdminVideoConfig({ ...adminVideoConfig, title: e.target.value })
                      }
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Hero Title (தமிழ்)
                    </label>
                    <input
                      type="text"
                      value={adminVideoConfig.titleTa}
                      onChange={(e) =>
                        setAdminVideoConfig({ ...adminVideoConfig, titleTa: e.target.value })
                      }
                      className="w-full px-3 py-1.5 border rounded-lg font-tamil"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">
                      Subtitle / Tagline (English)
                    </label>
                    <textarea
                      rows={2}
                      value={adminVideoConfig.subtitle}
                      onChange={(e) =>
                        setAdminVideoConfig({ ...adminVideoConfig, subtitle: e.target.value })
                      }
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">
                      Subtitle / Tagline (தமிழ்)
                    </label>
                    <textarea
                      rows={2}
                      value={adminVideoConfig.subtitleTa}
                      onChange={(e) =>
                        setAdminVideoConfig({ ...adminVideoConfig, subtitleTa: e.target.value })
                      }
                      className="w-full px-3 py-1.5 border rounded-lg font-tamil"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Auspicious Badge Text
                    </label>
                    <input
                      type="text"
                      value={adminVideoConfig.badgeText}
                      onChange={(e) =>
                        setAdminVideoConfig({ ...adminVideoConfig, badgeText: e.target.value })
                      }
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Auspicious Badge Text (தமிழ்)
                    </label>
                    <input
                      type="text"
                      value={adminVideoConfig.badgeTextTa}
                      onChange={(e) =>
                        setAdminVideoConfig({ ...adminVideoConfig, badgeTextTa: e.target.value })
                      }
                      className="w-full px-3 py-1.5 border rounded-lg font-tamil"
                    />
                  </div>
                </div>

                {/* Visual Sliders: Darkness & Amber Tint */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <div className="flex justify-between font-semibold text-stone-700 mb-1">
                      <span>Overlay Darkness:</span>
                      <span className="font-bold text-[#B45309]">{adminVideoConfig.overlayOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={90}
                      value={adminVideoConfig.overlayOpacity}
                      onChange={(e) =>
                        setAdminVideoConfig({
                          ...adminVideoConfig,
                          overlayOpacity: Number(e.target.value),
                        })
                      }
                      className="w-full accent-yellow-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-stone-700 mb-1">
                      <span>Temple Amber Tint:</span>
                      <span className="font-bold text-[#B45309]">{adminVideoConfig.amberTint}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={adminVideoConfig.amberTint}
                      onChange={(e) =>
                        setAdminVideoConfig({
                          ...adminVideoConfig,
                          amberTint: Number(e.target.value),
                        })
                      }
                      className="w-full accent-yellow-500"
                    />
                  </div>
                </div>

                {/* Toggles: Particles, Flames, Autoplay, Mute */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={adminVideoConfig.autoplay}
                      onChange={(e) =>
                        setAdminVideoConfig({ ...adminVideoConfig, autoplay: e.target.checked })
                      }
                      className="rounded text-yellow-500 focus:ring-yellow-400"
                    />
                    <span>Autoplay</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={adminVideoConfig.loop}
                      onChange={(e) =>
                        setAdminVideoConfig({ ...adminVideoConfig, loop: e.target.checked })
                      }
                      className="rounded text-yellow-500 focus:ring-yellow-400"
                    />
                    <span>Loop Video</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={adminVideoConfig.showParticles}
                      onChange={(e) =>
                        setAdminVideoConfig({
                          ...adminVideoConfig,
                          showParticles: e.target.checked,
                        })
                      }
                      className="rounded text-yellow-500 focus:ring-yellow-400"
                    />
                    <span>Gold Sparks</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={adminVideoConfig.showFlames}
                      onChange={(e) =>
                        setAdminVideoConfig({ ...adminVideoConfig, showFlames: e.target.checked })
                      }
                      className="rounded text-yellow-500 focus:ring-yellow-400"
                    />
                    <span>Diya Flames</span>
                  </label>
                </div>

                {/* Playback Speed */}
                <div className="pt-2 border-t flex items-center justify-between">
                  <span className="font-semibold text-stone-700">Playback Speed:</span>
                  <div className="flex gap-1.5">
                    {[0.5, 0.75, 1, 1.25, 1.5].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() =>
                          setAdminVideoConfig({ ...adminVideoConfig, playbackSpeed: spd })
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          adminVideoConfig.playbackSpeed === spd
                            ? 'bg-yellow-400 text-stone-950 border border-yellow-500'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-stone-950 font-black rounded-2xl shadow-lg border border-yellow-500 hover:from-yellow-300 hover:to-amber-300 transition cursor-pointer text-xs sm:text-sm flex items-center gap-2"
                  >
                    <span>Save & Apply Video to Front Page</span>
                    <Sparkles className="w-4 h-4 text-stone-950" />
                  </button>
                </div>
              </div>

              {/* Live Preview Player Right */}
              <div className="lg:col-span-5 space-y-3">
                <div className="bg-stone-950 p-4 rounded-3xl border-3 border-yellow-400 shadow-xl space-y-3">
                  <div className="flex items-center justify-between text-yellow-300 text-xs font-bold border-b border-white/10 pb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span>Live Real-Time Video Preview</span>
                    </span>
                    <span className="text-[10px] text-yellow-400/80">
                      {adminVideoConfig.playbackSpeed}x Speed
                    </span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-black">
                    <video
                      ref={previewVideoRef}
                      src={adminVideoConfig.videoUrl}
                      poster={adminVideoConfig.posterUrl}
                      autoPlay={adminVideoConfig.autoplay}
                      loop={adminVideoConfig.loop}
                      muted={isPreviewMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* Darkness and Tint preview */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundColor: `rgba(20, 10, 2, ${
                          (adminVideoConfig.overlayOpacity ?? 55) / 100
                        })`,
                      }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none mix-blend-color"
                      style={{
                        backgroundColor: `rgba(245, 158, 11, ${
                          ((adminVideoConfig.amberTint ?? 65) / 100) * 0.4
                        })`,
                      }}
                    />

                    {/* Preview controls */}
                    <div className="absolute bottom-2 right-2 flex gap-1.5 z-20">
                      <button
                        type="button"
                        onClick={() => {
                          if (!previewVideoRef.current) return;
                          if (isPreviewPlaying) {
                            previewVideoRef.current.pause();
                            setIsPreviewPlaying(false);
                          } else {
                            previewVideoRef.current.play();
                            setIsPreviewPlaying(true);
                          }
                        }}
                        className="p-1.5 rounded-full bg-black/70 text-yellow-300 hover:bg-yellow-400 hover:text-stone-950 transition"
                      >
                        {isPreviewPlaying ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPreviewMuted(!isPreviewMuted)}
                        className="p-1.5 rounded-full bg-black/70 text-yellow-300 hover:bg-yellow-400 hover:text-stone-950 transition"
                      >
                        {isPreviewMuted ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Diya badge preview */}
                    {adminVideoConfig.showFlames && (
                      <div className="absolute bottom-2 left-2 p-1.5 rounded-xl bg-black/70 border border-yellow-400/50 flex items-center gap-1.5 text-[10px] text-yellow-300">
                        <span className="text-sm">🪔</span>
                        <span>Diya Active</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-stone-300 space-y-1">
                    <p className="font-bold text-yellow-300">Title Preview:</p>
                    <p className="line-clamp-1">{adminVideoConfig.title}</p>
                    <p className="text-[10px] text-stone-400 font-tamil line-clamp-1">
                      {adminVideoConfig.titleTa}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-heading">
                  Traditional Crafts Catalog Management ({products.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Add new crafts, edit prices, duplicate variants, toggle inventory, and update GI tag origins.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    nameTa: '',
                    category: categories[0]?.name || 'Temple Puja & Brassware',
                    categoryId: categories[0]?.id || 'cat-1',
                    price: 1499,
                    originalPrice: 1999,
                    discountPercentage: 25,
                    images:
                      'https://images.unsplash.com/photo-1609743522653-52354461eb27?auto=format&fit=crop&w=800&q=80',
                    description: '',
                    descriptionTa: '',
                    shortDesc: 'Auspicious handcrafted sacred treasure',
                    shortDescTa: 'தெய்வ அருள் நிறைந்த பாரம்பரிய கைவினைப் பொக்கிஷம்',
                    inStock: true,
                    stockQuantity: 25,
                    sku: `ARM-${Date.now().toString().slice(-4)}`,
                    weight: '1.2 kg',
                    origin: 'Swamimalai, Thanjavur',
                    material: 'Pure Bronze / Brass',
                    culturalNote: '',
                  });
                  setIsAddingProduct(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 text-xs font-black hover:from-yellow-300 hover:to-amber-300 transition flex items-center gap-1.5 shadow-xs border border-yellow-500 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Craft</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-yellow-200 text-xs">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search craft name, SKU, or origin..."
                  className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-500">Category:</span>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 border rounded-lg bg-white text-xs"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-yellow-200/80 shadow-2xs overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-700">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price / MRP</th>
                    <th className="p-3.5">Stock Status</th>
                    <th className="p-3.5">GI Origin</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-yellow-50/40">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-amber-50"
                        />
                        <div>
                          <p className="font-bold text-stone-900 line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-stone-500 font-mono">SKU: {p.sku}</p>
                        </div>
                      </td>
                      <td className="p-3.5 text-stone-600">{p.category}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-[#B45309]">{formatCurrency(p.price)}</span>
                        {p.originalPrice > p.price && (
                          <span className="text-[10px] text-stone-400 line-through ml-1.5">
                            {formatCurrency(p.originalPrice)}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleStock(p)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition ${
                            p.inStock
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {p.inStock ? `In Stock (${p.stockQuantity})` : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="p-3.5 text-stone-500 truncate max-w-[140px]">{p.origin}</td>
                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => handleDuplicateProduct(p)}
                          className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 cursor-pointer"
                          title="Duplicate Craft Variant"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProductForm({
                              name: p.name,
                              nameTa: p.nameTa,
                              category: p.category,
                              categoryId: p.categoryId,
                              price: p.price,
                              originalPrice: p.originalPrice,
                              discountPercentage: p.discountPercentage,
                              images: p.images.join(', '),
                              description: p.description,
                              descriptionTa: p.descriptionTa,
                              shortDesc: p.shortDesc,
                              shortDescTa: p.shortDescTa,
                              inStock: p.inStock,
                              stockQuantity: p.stockQuantity,
                              sku: p.sku,
                              weight: p.weight,
                              origin: p.origin,
                              material: p.material,
                              culturalNote: p.culturalNote || '',
                            });
                            setIsAddingProduct(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700 cursor-pointer"
                          title="Edit Craft Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 cursor-pointer"
                          title="Delete Craft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-heading">
                Customer Orders & Sacred Dispatch ({orders.length})
              </h2>
              <p className="text-xs text-stone-500">
                Update delivery progress steps, enter courier AWB numbers, and print official GST invoices.
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 bg-white rounded-2xl border border-yellow-200/80 shadow-2xs space-y-4 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-[#B45309]">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.orderStatus === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </div>
                      <p className="text-stone-500 text-[11px] mt-0.5">
                        Placed on {new Date(ord.createdAt).toLocaleString()} by {ord.customerName} ({ord.customerPhone})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          handleUpdateOrderStatus(ord.id, e.target.value as Order['orderStatus'])
                        }
                        className="px-2.5 py-1.5 border rounded-lg bg-stone-50 font-bold text-xs"
                      >
                        <option value="placed">Status: Placed</option>
                        <option value="confirmed">Status: Confirmed</option>
                        <option value="packed">Status: Consecrated & Packed</option>
                        <option value="dispatched">Status: Dispatched</option>
                        <option value="out_for_delivery">Status: Out for Delivery</option>
                        <option value="delivered">Status: Delivered</option>
                        <option value="cancelled">Status: Cancelled</option>
                      </select>

                      <button
                        onClick={() => openPrintableInvoice(ord)}
                        className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 rounded-lg font-bold flex items-center gap-1 border border-yellow-500 hover:from-yellow-300 hover:to-amber-300 transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-stone-900" />
                        <span>Print Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Courier Tracking Number Editor */}
                  <div className="p-3 bg-yellow-50/60 rounded-xl border border-yellow-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-stone-700">
                      <Truck className="w-4 h-4 text-amber-700" />
                      <span>
                        Courier: <b>{ord.courierName}</b> | Tracking AWB: <b>{ord.trackingNumber || 'Pending'}</b>
                      </span>
                    </div>

                    {editingTrackingOrderId === ord.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={trackingNumberInput}
                          onChange={(e) => setTrackingNumberInput(e.target.value)}
                          placeholder="e.g. DTDC-TN-9842"
                          className="px-2 py-1 border rounded text-xs"
                        />
                        <button
                          onClick={() => handleSaveTrackingNumber(ord.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTrackingOrderId(null)}
                          className="px-2 py-1 border rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingTrackingOrderId(ord.id);
                          setTrackingNumberInput(ord.trackingNumber || '');
                        }}
                        className="text-amber-800 font-bold hover:underline"
                      >
                        Edit Tracking Number ✏️
                      </button>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-stone-100">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="py-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img
                            src={it.image}
                            alt={it.productName}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span>
                            {it.productName} (x{it.quantity})
                          </span>
                        </div>
                        <span className="font-bold text-stone-900">
                          {formatCurrency(it.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-stone-100 flex justify-between font-bold text-sm text-[#B45309]">
                      <span>Total Amount Paid:</span>
                      <span>{formatCurrency(ord.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-heading">
                GI Traditional Craft Categories ({categories.length})
              </h2>
              <p className="text-xs text-stone-500">
                15 distinct heritage classifications from lost-wax bronzes to Chettinad kitchenware.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-white rounded-2xl border border-yellow-200/80 shadow-2xs space-y-2 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-stone-900 text-sm">{c.name}</h4>
                    <span className="font-tamil text-amber-800">{c.nameTa}</span>
                  </div>
                  <p className="text-stone-500 text-[11px] line-clamp-2">{c.description}</p>
                  <div className="pt-2 border-t border-stone-100 flex justify-between text-[11px] text-stone-400">
                    <span>Slug: {c.slug}</span>
                    <span className="font-bold text-[#B45309]">{c.itemCount} items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CUSTOMERS MANAGEMENT */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-heading">
                Customer Accounts & Registered Devotees ({customers.length})
              </h2>
              <p className="text-xs text-stone-500">
                Manage buyer records, phone numbers, and order histories.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-yellow-200/80 shadow-2xs overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-yellow-200 font-bold text-stone-700">
                  <tr>
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">Contact Details</th>
                    <th className="p-3.5">Orders Count</th>
                    <th className="p-3.5">Membership Tier</th>
                    <th className="p-3.5">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-yellow-50/50">
                      <td className="p-3.5 font-bold text-stone-900">{c.name}</td>
                      <td className="p-3.5">
                        <p>{c.email}</p>
                        <p className="text-stone-400 text-[11px]">{c.phone}</p>
                      </td>
                      <td className="p-3.5 font-bold text-[#B45309]">{c.orderIds.length} orders</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-amber-900 font-bold text-[10px]">
                          {c.tier || 'Sacred Patron'}
                        </span>
                      </td>
                      <td className="p-3.5 text-stone-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-heading">
                  Heritage Gallery Photos ({gallery.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Living photography of Tamil temples, brass foundries, and handloom traditions.
                </p>
              </div>
              <button
                onClick={() => setIsAddingGallery(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 text-xs font-black hover:from-yellow-300 hover:to-amber-300 transition flex items-center gap-1.5 border border-yellow-500 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Gallery Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div
                  key={g.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs group text-xs"
                >
                  <div className="relative aspect-video">
                    <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDeleteGallery(g.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-stone-900 truncate">{g.title}</p>
                    <p className="text-[11px] text-amber-800">{g.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: INQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-heading">
                Customer Inquiries & Bulk Orders ({enquiries.length})
              </h2>
              <p className="text-xs text-stone-500">
                Messages sent via Contact Form with direct WhatsApp reply capability.
              </p>
            </div>

            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-5 bg-white rounded-2xl border border-yellow-200/80 shadow-2xs space-y-3 text-xs"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{enq.subject}</h4>
                      <p className="text-stone-500 text-[11px]">
                        From: <b>{enq.name}</b> ({enq.email} | {enq.phone}) •{' '}
                        {new Date(enq.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Vanakkam ${enq.name}, Greetings from Aram Brand regarding your enquiry: "${enq.subject}".`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-700 transition"
                      >
                        WhatsApp Reply
                      </a>
                    </div>
                  </div>
                  <p className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 leading-relaxed">
                    {enq.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto border border-yellow-300">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-stone-900 font-heading text-lg">
                {editingProduct ? 'Edit Craft Product' : 'Add New Heritage Craft Product'}
              </h3>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Product Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Product Title (தமிழ் - Tamil) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.nameTa}
                    onChange={(e) => setProductForm({ ...productForm, nameTa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-tamil"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => {
                      const sel = categories.find((c) => c.id === e.target.value);
                      setProductForm({
                        ...productForm,
                        categoryId: e.target.value,
                        category: sel ? sel.name : productForm.category,
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Original Price / MRP (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, originalPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stockQuantity}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Weight</label>
                  <input
                    type="text"
                    value={productForm.weight}
                    onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g. 2.5 kg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Image URLs (comma separated) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.images}
                    onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border rounded-lg font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Origin City / GI Location</label>
                  <input
                    type="text"
                    value={productForm.origin}
                    onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Material Details</label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Description (தமிழ்)</label>
                  <textarea
                    rows={2}
                    value={productForm.descriptionTa}
                    onChange={(e) => setProductForm({ ...productForm, descriptionTa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-tamil"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 border rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 rounded-xl font-black hover:from-yellow-300 hover:to-amber-300 border border-yellow-500 cursor-pointer shadow-xs"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Gallery Photo Modal */}
      {isAddingGallery && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-yellow-300">
            <h3 className="font-bold text-stone-900 font-heading text-lg">Add Heritage Gallery Photo</h3>
            <form onSubmit={handleSaveGallery} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={galleryForm.image}
                  onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Location</label>
                <input
                  type="text"
                  value={galleryForm.location}
                  onChange={(e) => setGalleryForm({ ...galleryForm, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingGallery(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 rounded-xl font-black hover:from-yellow-300 hover:to-amber-300 border border-yellow-500 cursor-pointer shadow-xs"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
