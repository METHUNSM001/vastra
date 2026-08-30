-- =============================================================================
-- VASTRA LAKSHNAM - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Run this SQL in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- =============================================================================

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    icon TEXT,
    count INTEGER DEFAULT 0,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    category TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    discount_percent INTEGER DEFAULT 0,
    rating NUMERIC DEFAULT 4.8,
    review_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 10,
    sku TEXT,
    badge TEXT,
    description_en TEXT,
    description_ta TEXT,
    fabric TEXT,
    weave TEXT,
    zari TEXT,
    care TEXT,
    length TEXT,
    origin TEXT DEFAULT 'Dindigul, Tamil Nadu',
    colors JSONB DEFAULT '[]'::JSONB,
    sizes JSONB DEFAULT '[]'::JSONB,
    images JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    delivery_charge NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    payment_status TEXT DEFAULT 'PENDING',
    payment_id TEXT,
    status TEXT DEFAULT 'confirmed',
    timeline JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    code TEXT PRIMARY KEY,
    discount_type TEXT NOT NULL, -- 'percent' | 'fixed'
    discount_value NUMERIC NOT NULL,
    min_order NUMERIC DEFAULT 0,
    description_en TEXT,
    description_ta TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_location TEXT DEFAULT 'Tamil Nadu',
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMER PROFILES (Synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    addresses JSONB DEFAULT '[]'::JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable live catalog updates in all open customer sessions.
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow public read access to catalog and reviews
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);

-- Allow public / anon orders creation and order tracking lookup
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true);

-- Admin / Public CRUD for products and categories
CREATE POLICY "Public Upsert Categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Public Upsert Products" ON public.products FOR ALL USING (true);

-- Customer profile security
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================================================
-- SEED INITIAL DATA
-- =============================================================================

INSERT INTO public.categories (id, name_en, name_ta, icon, count, image)
VALUES 
    ('pure-silk', 'Pure Silk Sarees', 'தூய பட்டு புடவைகள்', 'Sparkles', 24, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'),
    ('handloom-cotton', 'Dindigul Handloom Cotton', 'திண்டுக்கல் கைத்தறி காட்டன்', 'Feather', 18, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80'),
    ('bridal-zari', 'Bridal Muhurtham Collections', 'முகூர்த்த பட்டு புடவைகள்', 'Crown', 15, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'),
    ('temple-border', 'Temple Border Heritage', 'கோயில் கரை பாரம்பரியம்', 'Flame', 12, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'),
    ('festive-chanderi', 'Festive Chanderi & Soft Silk', 'பண்டிகை சந்தேரி பட்டு', 'Gift', 20, 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.coupons (code, discount_type, discount_value, min_order, description_en, description_ta, active)
VALUES 
    ('VASTRA10', 'percent', 10, 1999, '10% instant discount on orders above ₹1,999', '₹1,999-க்கு மேல் 10% தள்ளுபடி', true),
    ('DINDIGUL500', 'fixed', 500, 3999, '₹500 flat off on heritage handloom weaves', 'கைத்தறி நெசவுகளுக்கு ₹500 நேரடி தள்ளுபடி', true),
    ('FESTIVE20', 'percent', 20, 4999, '20% Mega festive savings on bridal collections', 'முகூர்த்த சேகரிப்பில் 20% சிறப்பு தள்ளுபடி', true)
ON CONFLICT (code) DO NOTHING;
