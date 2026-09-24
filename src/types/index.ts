export type Language = 'en' | 'ta';

export interface Category {
  id: string;
  name: string;
  nameTa: string;
  slug: string;
  description: string;
  descriptionTa: string;
  image: string;
  iconName: string;
  itemCount: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameTa: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  descriptionTa: string;
  shortDesc: string;
  shortDescTa: string;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  weight: string;
  origin: string;
  material: string;
  culturalNote?: string;
  culturalNoteTa?: string;
  features: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isFestivalSpecial?: boolean;
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'home' | 'work' | 'other';
}

export type PaymentMethod = 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productNameTa: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  trackingNumber?: string;
  courierName?: string;
  createdAt: string;
  updatedAt: string;
  deliveryDateEstimated?: string;
  notes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  titleTa: string;
  category: 'temple' | 'artisan' | 'handloom' | 'festivals';
  image: string;
  description: string;
  descriptionTa: string;
  location: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'in_progress' | 'resolved';
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: ShippingAddress;
  addresses?: ShippingAddress[];
  orderIds: string[];
  wishlist?: string[];
  rewardPoints?: number;
  tier?: string;
  createdAt: string;
}

export interface VideoPreset {
  id: string;
  name: string;
  nameTa: string;
  location: string;
  videoUrl: string;
  posterUrl: string;
  description: string;
}

export interface TempleVideoConfig {
  videoUrl: string;
  posterUrl: string;
  title: string;
  titleTa: string;
  subtitle: string;
  subtitleTa: string;
  badgeText: string;
  badgeTextTa: string;
  quoteText: string;
  quoteCitation: string;
  overlayOpacity: number; // 0 to 100
  amberTint: number; // 0 to 100
  playbackSpeed: number; // 0.5 to 2.0
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  showParticles: boolean;
  showFlames: boolean;
  layoutStyle: 'split' | 'cinematic' | 'theater';
  activePresetId: string;
}
