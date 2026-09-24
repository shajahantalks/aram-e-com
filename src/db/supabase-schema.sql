-- ==============================================================================
-- ARAM BRAND (அறம்) - SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Compatible with Supabase Database / Antigravity / PostgreSQL 15+
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT 'cat-' || uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_ta TEXT,
  image TEXT,
  icon_name TEXT DEFAULT 'Sparkles',
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT 'aram-prod-' || uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  category TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  discount_percentage INTEGER DEFAULT 0,
  rating NUMERIC(3, 1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  description_ta TEXT NOT NULL,
  short_desc TEXT,
  short_desc_ta TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 10,
  sku TEXT UNIQUE NOT NULL,
  weight TEXT,
  origin TEXT,
  material TEXT,
  cultural_note TEXT,
  cultural_note_ta TEXT,
  features TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_festival_special BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Customer Profiles
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY DEFAULT 'cust-' || uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT 'order-' || uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0,
  shipping_fee NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('razorpay', 'cod')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  order_status TEXT NOT NULL DEFAULT 'placed' CHECK (order_status IN ('placed', 'confirmed', 'packed', 'dispatched', 'out_for_delivery', 'delivered', 'cancelled')),
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  tracking_number TEXT,
  courier_name TEXT DEFAULT 'DTDC Temple Express',
  delivery_date_estimated DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Gallery Items Table
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY DEFAULT 'gal-' || uuid_generate_v4(),
  title TEXT NOT NULL,
  title_ta TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('temple', 'artisan', 'handloom', 'festivals')),
  image TEXT NOT NULL,
  description TEXT,
  description_ta TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Contact Enquiries Table
CREATE TABLE IF NOT EXISTS contact_enquiries (
  id TEXT PRIMARY KEY DEFAULT 'enq-' || uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
