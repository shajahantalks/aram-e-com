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
  VideoPreset,
  ShippingAddress,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_GALLERY,
  INITIAL_ORDERS,
  INITIAL_ENQUIRIES,
  INITIAL_CUSTOMERS,
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'aram_products_v1',
  CATEGORIES: 'aram_categories_v1',
  ORDERS: 'aram_orders_v1',
  CART: 'aram_cart_v1',
  GALLERY: 'aram_gallery_v1',
  ENQUIRIES: 'aram_enquiries_v1',
  CUSTOMERS: 'aram_customers_v1',
  CURRENT_USER: 'aram_current_user_v1',
  LANGUAGE: 'aram_language_v1',
  VIDEO_CONFIG: 'aram_temple_video_config_v1',
  WISHLIST: 'aram_wishlist_v1',
};

export const TEMPLE_VIDEO_PRESETS: VideoPreset[] = [
  {
    id: 'brihadeeswarar',
    name: 'Thanjavur Brihadeeswarar Temple • Golden Sunrise',
    nameTa: 'தஞ்சைப் பெரிய கோவில் • மங்கள உதய தீப தரிசனம்',
    location: 'Thanjavur, Tamil Nadu',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traditional-temple-architecture-in-india-42999-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
    description: 'Ancient 1000-year Chola Granite Vimana bathed in morning sun rays and sanctum resonance.',
  },
  {
    id: 'meenakshi',
    name: 'Madurai Meenakshi Amman Temple • Sacred Deepams',
    nameTa: 'மதுரை மீனாட்சி சுந்தரேஸ்வரர் • திருவிளக்கு பூஜை',
    location: 'Madurai, Tamil Nadu',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-smoke-from-incense-sticks-in-a-temple-42994-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1609137144822-1d547f42b3eb?auto=format&fit=crop&w=1600&q=80',
    description: 'Gopuram sculptures and divine camphor incense rising before Goddess Meenakshi.',
  },
  {
    id: 'swamimalai',
    name: 'Swamimalai Lost-Wax Bronze Sanctum Fire',
    nameTa: 'சுவாமிமலை ஐம்பொன் வார்ப்பு • கைவினை அக்னி',
    location: 'Swamimalai, Thanjavur',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-brass-statues-and-traditional-lamps-43012-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1599818817740-d92e595085d6?auto=format&fit=crop&w=1600&q=80',
    description: 'Chola heritage bronze artisans pouring molten panchaloha into sacred deity moulds.',
  },
  {
    id: 'chidambaram',
    name: 'Chidambaram Nataraja Temple Bells & Deeparadhana',
    nameTa: 'சிதம்பரம் நடராஜர் கோவில் • மங்கள மணி நாதம்',
    location: 'Chidambaram, Cuddalore',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-oil-lamp-flickering-in-a-dark-room-41364-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1627993077759-9946e38b3687?auto=format&fit=crop&w=1600&q=80',
    description: 'Rhythmic bronze bells ringing in unison as holy camphor flames illuminate the sanctum.',
  },
];

export const DEFAULT_TEMPLE_VIDEO_CONFIG: TempleVideoConfig = {
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traditional-temple-architecture-in-india-42999-large.mp4',
  posterUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
  title: 'Sacred Splendor of Tamil Temple Traditions',
  titleTa: 'அறம் பிராண்ட் • தமிழ் பாரம்பரிய & கோவில் கலைப் பொக்கிஷங்கள்',
  subtitle: 'Authentic Swamimalai lost-wax bronzes, Nachiyar Koil brass Deepams, Kanchipuram mulberry silks, and stone-ground Chettinad pantry treasures — shipped directly with temple blessings.',
  subtitleTa: 'சுவாமிமலை வெண்கல சிலைகள், நாச்சியார்கோவில் பித்தளை விளக்குகள், காஞ்சி கைத்தறி பட்டு மற்றும் மரச்செக்கு எண்ணெய்கள் — தலைமுறை கைவினைக் கலைஞர்களிடமிருந்து நேரடியாக உங்கள் இல்லத்திற்கு.',
  badgeText: 'Live Sanctum Ambiance • Pure Tamil Temple Traditions',
  badgeTextTa: 'மங்கல துவக்கம் • தெய்வ அருள் நிறைந்த பாரம்பரியம்',
  quoteText: 'அறத்தான் வருவதே இன்பம்மற் றெல்லாம் புறத்த புகழும் இல.',
  quoteCitation: '— திருக்குறள் 39 • "True joy stems from righteousness (Aram); all other pleasure is hollow."',
  overlayOpacity: 55,
  amberTint: 65,
  playbackSpeed: 1,
  autoplay: true,
  loop: true,
  muted: true,
  showParticles: true,
  showFlames: true,
  layoutStyle: 'split',
  activePresetId: 'brihadeeswarar',
};

export const storageService = {
  // Categories
  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveCategories(INITIAL_CATEGORIES);
    return INITIAL_CATEGORIES;
  },

  saveCategories(categories: Category[]) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  // Products
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  },

  saveProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  },

  addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `aram-prod-${Date.now()}`,
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  },

  updateProduct(updated: Product): Product {
    const products = this.getProducts().map((p) => (p.id === updated.id ? updated : p));
    this.saveProducts(products);
    return updated;
  },

  deleteProduct(id: string) {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(products);
  },

  // Orders
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveOrders(INITIAL_ORDERS);
    return INITIAL_ORDERS;
  },

  saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  addOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const orders = this.getOrders();
    const orderCount = orders.length + 101;
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      orderNumber: `ARAM-2026-${randomDigits}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingNumber: `DTDC-TN-${randomDigits}`,
      courierName: 'DTDC Temple Express Courier',
      deliveryDateEstimated: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Also record under customer if email exists
    const customers = this.getCustomers();
    const existing = customers.find((c) => c.email.toLowerCase() === order.customerEmail.toLowerCase());
    if (existing) {
      existing.orderIds.push(newOrder.id);
      this.saveCustomers(customers);
    } else {
      const newCust: CustomerUser = {
        id: `cust-${Date.now()}`,
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        address: order.shippingAddress,
        orderIds: [newOrder.id],
        createdAt: new Date().toISOString(),
      };
      customers.push(newCust);
      this.saveCustomers(customers);
    }

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['orderStatus'], trackingNumber?: string): Order | undefined {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      order.updatedAt = new Date().toISOString();
      if (trackingNumber) order.trackingNumber = trackingNumber;
      this.saveOrders(orders);
    }
    return order;
  },

  // Cart
  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  },

  saveCart(cart: CartItem[]) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  // Gallery
  getGallery(): GalleryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveGallery(INITIAL_GALLERY);
    return INITIAL_GALLERY;
  },

  saveGallery(gallery: GalleryItem[]) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  },

  addGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
    const gallery = this.getGallery();
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
    };
    gallery.unshift(newItem);
    this.saveGallery(gallery);
    return newItem;
  },

  deleteGalleryItem(id: string) {
    const gallery = this.getGallery().filter((g) => g.id !== id);
    this.saveGallery(gallery);
  },

  // Enquiries
  getEnquiries(): ContactEnquiry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveEnquiries(INITIAL_ENQUIRIES);
    return INITIAL_ENQUIRIES;
  },

  saveEnquiries(enquiries: ContactEnquiry[]) {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  },

  addEnquiry(enquiry: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>): ContactEnquiry {
    const enquiries = this.getEnquiries();
    const newEnquiry: ContactEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    enquiries.unshift(newEnquiry);
    this.saveEnquiries(enquiries);
    return newEnquiry;
  },

  updateEnquiryStatus(id: string, status: ContactEnquiry['status']) {
    const enquiries = this.getEnquiries();
    const target = enquiries.find((e) => e.id === id);
    if (target) {
      target.status = status;
      this.saveEnquiries(enquiries);
    }
  },

  // Customers
  getCustomers(): CustomerUser[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveCustomers(INITIAL_CUSTOMERS);
    return INITIAL_CUSTOMERS;
  },

  saveCustomers(customers: CustomerUser[]) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  // Current User
  getCurrentUser(): CustomerUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return null;
  },

  setCurrentUser(user: CustomerUser | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Language
  getLanguage(): Language {
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
      if (lang === 'en' || lang === 'ta') return lang;
    } catch {
      // fallback
    }
    return 'en';
  },

  setLanguage(lang: Language) {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  // Temple Video Configuration
  getVideoConfig(): TempleVideoConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VIDEO_CONFIG);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    this.saveVideoConfig(DEFAULT_TEMPLE_VIDEO_CONFIG);
    return DEFAULT_TEMPLE_VIDEO_CONFIG;
  },

  saveVideoConfig(config: TempleVideoConfig) {
    localStorage.setItem(STORAGE_KEYS.VIDEO_CONFIG, JSON.stringify(config));
  },

  resetVideoConfig(): TempleVideoConfig {
    this.saveVideoConfig(DEFAULT_TEMPLE_VIDEO_CONFIG);
    return DEFAULT_TEMPLE_VIDEO_CONFIG;
  },

  // Wishlist
  getWishlist(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  },

  saveWishlist(wishlist: string[]) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  },

  toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    const index = list.indexOf(productId);
    let isAdded = false;
    if (index > -1) {
      list.splice(index, 1);
      isAdded = false;
    } else {
      list.push(productId);
      isAdded = true;
    }
    this.saveWishlist(list);
    return isAdded;
  },

  isInWishlist(productId: string): boolean {
    return this.getWishlist().includes(productId);
  },

  // Update Customer Profile
  updateCustomer(user: CustomerUser): CustomerUser {
    const customers = this.getCustomers();
    const updated = customers.map((c) => (c.id === user.id ? user : c));
    this.saveCustomers(updated);
    this.setCurrentUser(user);
    return user;
  },

  // Reset to initial demo data
  resetToDefaults() {
    this.saveProducts(INITIAL_PRODUCTS);
    this.saveCategories(INITIAL_CATEGORIES);
    this.saveOrders(INITIAL_ORDERS);
    this.saveGallery(INITIAL_GALLERY);
    this.saveEnquiries(INITIAL_ENQUIRIES);
    this.saveCustomers(INITIAL_CUSTOMERS);
    this.resetVideoConfig();
    this.saveWishlist([]);
  },
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
