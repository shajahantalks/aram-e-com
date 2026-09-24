import React, { useState, useEffect } from 'react';
import {
  Category,
  Product,
  Order,
  GalleryItem,
  ContactEnquiry,
  CustomerUser,
  CartItem,
  Language,
  TempleVideoConfig,
} from './types';
import { storageService, TEMPLE_VIDEO_PRESETS } from './services/storageService';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { FeaturedCategories } from './components/home/FeaturedCategories';
import { ProductCard } from './components/product/ProductCard';
import { ProductCatalog } from './components/product/ProductCatalog';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { GalleryView } from './components/gallery/GalleryView';
import { ContactView } from './components/contact/ContactView';
import { AccountModal } from './components/account/AccountModal';
import { CustomerPanel } from './components/account/CustomerPanel';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OrderTrackingView } from './components/orders/OrderTrackingView';
import { HeritageStory } from './components/home/HeritageStory';
import { TestimonialSection } from './components/home/TestimonialSection';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { FloatingCart } from './components/common/FloatingCart';
import { Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { templeBell } from './utils/audio';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => storageService.getLanguage());
  const [activeView, setActiveView] = useState<'home' | 'products' | 'gallery' | 'contact' | 'orders'>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data states from storage
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);

  // Cart & Modals
  const [cart, setCart] = useState<CartItem[]>(() => storageService.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCustomerPanelOpen, setIsCustomerPanelOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [videoConfig, setVideoConfig] = useState<TempleVideoConfig>(() => storageService.getVideoConfig());
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [latestCompletedOrder, setLatestCompletedOrder] = useState<Order | null>(null);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshData = () => {
    setCategories(storageService.getCategories());
    setProducts(storageService.getProducts());
    setOrders(storageService.getOrders());
    setGallery(storageService.getGallery());
    setEnquiries(storageService.getEnquiries());
    setCustomers(storageService.getCustomers());
    setCurrentUser(storageService.getCurrentUser());
    setVideoConfig(storageService.getVideoConfig());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    storageService.setLanguage(lang);
  };

  const handleUpdateVideoConfig = (newConfig: TempleVideoConfig) => {
    setVideoConfig(newConfig);
    storageService.saveVideoConfig(newConfig);
    showToast(
      language === 'ta'
        ? 'கோவில் அனிமேஷன் காணொளி வெற்றிகரமாக புதுப்பிக்கப்பட்டது!'
        : 'Temple animation video settings successfully updated!'
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cart, { product, quantity }];
    }

    setCart(updatedCart);
    storageService.saveCart(updatedCart);
    templeBell.ring();
    showToast(
      language === 'ta'
        ? `"${product.nameTa}" கூடையில் சேர்க்கப்பட்டது!`
        : `Added "${product.name}" to cart!`
    );
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    const updated = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    setCart(updated);
    storageService.saveCart(updated);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    setCart(updated);
    storageService.saveCart(updated);
  };

  const handleClearCart = () => {
    setCart([]);
    storageService.saveCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // Coupon handling
  const handleApplyCoupon = (code: string): boolean => {
    const cartSubtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    if (code === 'ARAM10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(discount);
      setAppliedCoupon('ARAM10 (10% OFF)');
      return true;
    } else if (code === 'VANAKKAM') {
      const discount = Math.min(cartSubtotal, 200);
      setDiscountAmount(discount);
      setAppliedCoupon('VANAKKAM (₹200 OFF)');
      return true;
    } else if (code === 'FESTIVE') {
      const discount = Math.round(cartSubtotal * 0.15);
      setDiscountAmount(discount);
      setAppliedCoupon('FESTIVE (15% OFF)');
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const handleOrderCompleted = (order: Order) => {
    setIsCheckoutOpen(false);
    handleClearCart();
    setOrders(storageService.getOrders());
    setLatestCompletedOrder(order);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const featuredProducts = products.filter((p) => p.isFeatured || p.isBestSeller).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#2C1810]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#F59E0B] text-stone-950 px-4 py-2.5 rounded-xl shadow-xl border border-yellow-400 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-stone-900" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={() => setIsCustomerPanelOpen(true)}
        onOpenCustomerPanel={() => setIsCustomerPanelOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        categories={categories}
        onSelectCategory={(id) => {
          setSelectedCategoryId(id);
          setActiveView('products');
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) setActiveView('products');
        }}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div>
            {/* Animated Temple Gopuram Hero with Video */}
            <HeroBanner
              videoConfig={videoConfig}
              language={language}
              onExplore={() => {
                setSelectedCategoryId('all');
                setActiveView('products');
              }}
              onViewStory={() => {
                const storyEl = document.getElementById('heritage-story');
                if (storyEl) storyEl.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAdminVideo={() => setIsAdminOpen(true)}
              onSelectPreset={(presetId) => {
                const preset = TEMPLE_VIDEO_PRESETS.find((p) => p.id === presetId);
                if (preset) {
                  handleUpdateVideoConfig({
                    ...videoConfig,
                    activePresetId: preset.id,
                    videoUrl: preset.videoUrl,
                    posterUrl: preset.posterUrl,
                    title: preset.name,
                    titleTa: preset.nameTa,
                    subtitle: preset.description,
                    subtitleTa: `${preset.location} • புனித பாரம்பரிய பொக்கிஷம்`,
                  });
                }
              }}
            />

            {/* 15 Featured Categories Grid */}
            <FeaturedCategories
              categories={categories}
              language={language}
              onSelectCategory={(id) => {
                setSelectedCategoryId(id);
                setActiveView('products');
              }}
              selectedCategoryId={selectedCategoryId}
            />

            {/* Curated Temple Best Sellers Section */}
            <section className="py-14 bg-[#FFFDF9] border-b border-amber-200/60">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B45309]">
                      <Flame className="w-4 h-4 text-amber-500 animate-flame" />
                      <span>
                        {language === 'ta' ? 'அதிகம் விரும்பப்படும் கைவினைப் பொக்கிஷங்கள்' : 'Revered Best Sellers'}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1810] font-heading mt-1">
                      {language === 'ta'
                        ? 'கோவில் தீபங்கள் & தூய கைத்தறி உடைகள்'
                        : 'Authentic Deepams, Silks & Sacred Pantry'}
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategoryId('all');
                      setActiveView('products');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B45309] hover:text-amber-800 transition cursor-pointer"
                  >
                    <span>{language === 'ta' ? 'அனைத்தையும் காண்க' : 'View Full Catalog (150+ Crafts)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {featuredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      language={language}
                      onAddToCart={handleAddToCart}
                      onQuickView={(prod) => setQuickViewProduct(prod)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Heritage Story & Cultural Ethics */}
            <div id="heritage-story">
              <HeritageStory language={language} />
            </div>

            {/* Customer Testimonials & Temple Trust */}
            <TestimonialSection language={language} />
          </div>
        )}

        {activeView === 'products' && (
          <ProductCatalog
            products={products}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            language={language}
            onAddToCart={handleAddToCart}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {activeView === 'gallery' && (
          <GalleryView galleryItems={gallery} language={language} />
        )}

        {activeView === 'contact' && (
          <ContactView language={language} />
        )}

        {activeView === 'orders' && (
          <OrderTrackingView orders={orders} language={language} />
        )}
      </main>

      {/* Floating Cart Button */}
      <FloatingCart
        itemCount={totalCartCount}
        totalAmount={totalCartAmount}
        onClick={() => setIsCartOpen(true)}
        language={language}
      />

      {/* Floating WhatsApp Support */}
      <WhatsAppButton language={language} />

      {/* Global Footer */}
      <Footer
        language={language}
        categories={categories}
        onSelectCategory={(id) => {
          setSelectedCategoryId(id);
          setActiveView('products');
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        setActiveView={setActiveView}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        language={language}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        discountAmount={discountAmount}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedCoupon={appliedCoupon}
        discountAmount={discountAmount}
        onOrderCompleted={handleOrderCompleted}
        language={language}
      />

      {/* Order Success Confirmation */}
      <OrderSuccessModal
        order={latestCompletedOrder}
        onClose={() => setLatestCompletedOrder(null)}
        language={language}
      />

      {/* Product Quick View / Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        language={language}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Customer Panel Modal */}
      <CustomerPanel
        isOpen={isCustomerPanelOpen || isAccountOpen}
        onClose={() => {
          setIsCustomerPanelOpen(false);
          setIsAccountOpen(false);
        }}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        orders={orders}
        products={products}
        language={language}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onTrackOrder={(_orderNumber) => {
          setIsCustomerPanelOpen(false);
          setIsAccountOpen(false);
          setActiveView('orders');
        }}
      />

      {/* Comprehensive Admin Dashboard with full video and product editing */}
      {isAdminOpen && (
        <AdminDashboard
          products={products}
          categories={categories}
          orders={orders}
          gallery={gallery}
          enquiries={enquiries}
          customers={customers}
          videoConfig={videoConfig}
          onUpdateVideoConfig={handleUpdateVideoConfig}
          onClose={() => setIsAdminOpen(false)}
          language={language}
          onRefreshData={refreshData}
        />
      )}
    </div>
  );
}
