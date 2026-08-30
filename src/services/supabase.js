import { createClient } from "@supabase/supabase-js";

// Read environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Check if credentials are properly configured (not empty and not default placeholder)
export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project-ref") &&
    !supabaseAnonKey.includes("your-anon-key-here")
  );
};

// Initialize Supabase Client with graceful fallback
let supabaseClient = null;

if (isSupabaseConfigured()) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    console.info("⚡ Supabase successfully initialized with live backend.");
  } catch (err) {
    console.warn("⚠️ Failed to initialize Supabase client. Running in offline/simulator mode.", err);
  }
} else {
  // Graceful fallback for local development
  console.info("ℹ️ Supabase environment variables not configured. Running in high-performance local demo mode.");
}

export const supabase = supabaseClient;

export const fromSupabaseProduct = (product) => ({
  ...product,
  nameEn: product.nameEn || product.name_en || product.name || product.id,
  nameTa: product.nameTa || product.name_ta || product.name_en || product.name || product.id,
  originalPrice: product.originalPrice ?? product.original_price,
  discount: product.discount ?? product.discount_percent ?? 0,
  reviewCount: product.reviewCount ?? product.review_count ?? 0,
  descriptionEn: product.descriptionEn || product.description_en || "",
  descriptionTa: product.descriptionTa || product.description_ta || "",
  images: product.images || (product.image ? [product.image] : []),
  isNew: product.isNew ?? product.is_new ?? false,
  isActive: product.isActive ?? product.is_active ?? true
});

export const toSupabaseProduct = (product) => ({
  id: product.id,
  name_en: product.nameEn,
  name_ta: product.nameTa || product.nameEn,
  category: product.category || null,
  price: product.price,
  original_price: product.originalPrice ?? null,
  discount_percent: product.discount ?? 0,
  rating: product.rating ?? 4.8,
  review_count: product.reviewCount ?? 0,
  stock: product.stock ?? 0,
  sku: product.sku || null,
  badge: product.badge || null,
  description_en: product.descriptionEn || "",
  description_ta: product.descriptionTa || "",
  fabric: product.fabric || null,
  weave: product.weave || null,
  zari: product.zari || null,
  care: product.care || null,
  length: product.length || null,
  origin: product.origin || "Dindigul, Tamil Nadu",
  colors: product.colors || [],
  sizes: product.sizes || [],
  images: product.images || []
});

export const fromSupabaseCategory = (category) => ({
  ...category,
  nameEn: category.nameEn || category.name_en || category.name || category.id,
  nameTa: category.nameTa || category.name_ta || category.name_en || category.name || category.id,
  slug: category.slug || category.id,
  itemCount: category.itemCount ?? category.count ?? 0
});

/**
 * DATABASE HELPER SERVICES
 * These methods query Supabase when connected, with graceful catch blocks.
 */

// 1. Products Service
export const productService = {
  async getAll() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data?.map(fromSupabaseProduct) || [];
    } catch (err) {
      console.warn("Supabase fetch products error:", err.message);
      return null;
    }
  },

  async upsert(product) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("products")
        .upsert(toSupabaseProduct(product))
        .select();
      if (error) throw error;
      return data?.[0] ? fromSupabaseProduct(data[0]) : null;
    } catch (err) {
      console.warn("Supabase upsert product error:", err.message);
      return null;
    }
  },

  async delete(id) {
    if (!supabase) return null;
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn("Supabase delete product error:", err.message);
      return false;
    }
  }
};

// 2. Orders Service
export const orderService = {
  async getAll() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase fetch orders error:", err.message);
      return null;
    }
  },

  async getById(orderId) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase fetch order by id error:", err.message);
      return null;
    }
  },

  async create(order) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert([order])
        .select();
      if (error) throw error;
      return data?.[0];
    } catch (err) {
      console.warn("Supabase create order error:", err.message);
      return null;
    }
  },

  async updateStatus(orderId, status, timeline) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status, timeline, updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .select();
      if (error) throw error;
      return data?.[0];
    } catch (err) {
      console.warn("Supabase update order status error:", err.message);
      return null;
    }
  }
};

// 3. Categories Service
export const categoryService = {
  async getAll() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase fetch categories error:", err.message);
      return null;
    }
  },

  async upsert(category) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("categories")
        .upsert(category)
        .select();
      if (error) throw error;
      return data?.[0];
    } catch (err) {
      console.warn("Supabase upsert category error:", err.message);
      return null;
    }
  }
};

// 4. Coupons Service
export const couponService = {
  async getAll() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*");
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase fetch coupons error:", err.message);
      return null;
    }
  }
};

// 5. Profile Service
export const profileService = {
  async getProfile(userId) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (err) {
      console.warn("Supabase get profile error:", err.message);
      return null;
    }
  },

  async upsertProfile(profile) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert(profile)
        .select();
      if (error) throw error;
      return data?.[0];
    } catch (err) {
      console.warn("Supabase upsert profile error:", err.message);
      return null;
    }
  }
};

// 6. Auth Service
export const authService = {
  async signUp(email, password, metadata = {}) {
    if (!supabase) return { data: null, error: { message: "Supabase not connected" } };
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
  },

  async signIn(email, password) {
    if (!supabase) return { data: null, error: { message: "Supabase not connected" } };
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  async signOut() {
    if (!supabase) return { error: null };
    return await supabase.auth.signOut();
  },

  async resetPassword(email) {
    if (!supabase) return { error: { message: "Supabase not connected" } };
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
  },

  async getUser() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback) {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  }
};
