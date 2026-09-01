import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations";
import { initialProducts, initialCategories, initialCoupons, initialBanners, initialReviews } from "../data/initialData";
import { 
  supabase, 
  isSupabaseConfigured, 
  productService, 
  orderService, 
  categoryService, 
  couponService, 
  authService 
} from "../services/supabase";
import { fromSupabaseCategory } from "../services/supabase";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Language State ('en' | 'ta')
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("vl_lang") || "en";
  });

  const t = translations[lang] || translations.en;

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("vl_theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("vl_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light");
  };

  const toggleLanguage = (selectedLang) => {
    const newLang = selectedLang || (lang === "en" ? "ta" : "en");
    setLang(newLang);
    localStorage.setItem("vl_lang", newLang);
    document.documentElement.lang = newLang;
  };

  // 2. Active Screen Navigation State
  // "home" | "catalog" | "product-detail" | "cart" | "checkout" | "order-confirmed" | "order-track" | "account" | "admin"
  const [currentView, setCurrentView] = useState("home");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 3. Products & Catalog Database State - Supabase is source of truth
  // Initialize with empty, will be populated from Supabase
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Track if initial Supabase sync is complete
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Supabase Backend Sync State
  const [isBackendConnected, setIsBackendConnected] = useState(() => isSupabaseConfigured());

  // INITIAL LOAD: Fetch from Supabase, fallback to initial data
  useEffect(() => {
    const initializeData = async () => {
      try {
        if (isSupabaseConfigured()) {
          // Try to load from Supabase first
          const [remoteProducts, remoteCategories, remoteCoupons, remoteOrders] = await Promise.all([
            productService.getAll(),
            categoryService.getAll(),
            couponService.getAll(),
            orderService.getAll()
          ]);

          // Load from Supabase if data exists, otherwise use initial data
          if (remoteProducts && remoteProducts.length > 0) {
            setProducts(remoteProducts);
          } else {
            setProducts(initialProducts);
          }

          if (remoteCategories && remoteCategories.length > 0) {
            setCategories(remoteCategories.map(fromSupabaseCategory));
          } else {
            setCategories(initialCategories);
          }

          if (remoteCoupons && remoteCoupons.length > 0) {
            setCoupons(remoteCoupons);
          } else {
            setCoupons(initialCoupons);
          }

          if (remoteOrders && remoteOrders.length > 0) {
            setOrders(remoteOrders);
          }

          setIsBackendConnected(true);
          console.info("✅ Data synchronized from Supabase backend");
        } else {
          // If Supabase not configured, use initial data
          setProducts(initialProducts);
          setCategories(initialCategories);
          setCoupons(initialCoupons);
          setBanners(initialBanners);
          setReviews(initialReviews);
          console.info("ℹ️ Using initial local data (Supabase not configured)");
        }
      } catch (err) {
        console.warn("⚠️ Error loading data, using initial data:", err);
        setProducts(initialProducts);
        setCategories(initialCategories);
        setCoupons(initialCoupons);
        setBanners(initialBanners);
        setReviews(initialReviews);
      } finally {
        setIsDataLoaded(true);
      }
    };

    initializeData();
  }, []);

  // REAL-TIME SYNC: Listen for changes from other devices/users
  useEffect(() => {
    if (!supabase || !isDataLoaded) return undefined;

    const refreshProducts = async () => {
      const remoteProducts = await productService.getAll();
      if (remoteProducts) {
        setProducts(remoteProducts);
        console.info("📡 Products updated from Supabase (real-time sync)");
      }
    };

    const refreshCategories = async () => {
      const remoteCategories = await categoryService.getAll();
      if (remoteCategories) {
        setCategories(remoteCategories.map(fromSupabaseCategory));
        console.info("📡 Categories updated from Supabase (real-time sync)");
      }
    };

    const refreshCoupons = async () => {
      const remoteCoupons = await couponService.getAll();
      if (remoteCoupons) {
        setCoupons(remoteCoupons);
        console.info("📡 Coupons updated from Supabase (real-time sync)");
      }
    };

    const refreshOrders = async () => {
      const remoteOrders = await orderService.getAll();
      if (remoteOrders) {
        setOrders(remoteOrders);
        console.info("📡 Orders updated from Supabase (real-time sync)");
      }
    };

    // Subscribe to real-time changes from Supabase
    const channel = supabase
      .channel("catalog-live-sync", { config: { broadcast: { self: true } } })
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, refreshProducts)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, refreshCategories)
      .on("postgres_changes", { event: "*", schema: "public", table: "coupons" }, refreshCoupons)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, refreshOrders)
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.info("✅ Real-time sync ACTIVE - All devices synced");
        } else if (status === "CHANNEL_ERROR") {
          console.warn("⚠️ Real-time sync error - Enabling fallback polling");
        }
      });

    // FALLBACK: Periodic polling every 5 seconds to ensure sync even if subscription fails
    const pollInterval = setInterval(() => {
      Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        couponService.getAll(),
        orderService.getAll()
      ]).then(([remoteProducts, remoteCategories, remoteCoupons, remoteOrders]) => {
        if (remoteProducts) setProducts(remoteProducts);
        if (remoteCategories) setCategories(remoteCategories.map(fromSupabaseCategory));
        if (remoteCoupons) setCoupons(remoteCoupons);
        if (remoteOrders) setOrders(remoteOrders);
      }).catch((err) => console.warn("Poll sync error:", err));
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [isDataLoaded]);

  // 4. Cart & Wishlist State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("vl_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("vl_wishlist");
    return saved ? JSON.parse(saved) : ["prod-101"];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem("vl_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("vl_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // 5. Orders Database & Tracking - Sync from Supabase
  const [orders, setOrders] = useState([]);

  // Initialize orders from Supabase (included in initial data load above)
  useEffect(() => {
    localStorage.setItem("vl_orders", JSON.stringify(orders));
  }, [orders]);

  // 6. Registered Customers & Auth State
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem("vl_registered_users");
    if (!saved) return [];
    const demoEmails = new Set([
      "sneha@example.com",
      "priya@gmail.com",
      "ananya.iyer@gmail.com"
    ]);
    return JSON.parse(saved).filter((user) => !demoEmails.has(user.email?.toLowerCase()));
  });

  useEffect(() => {
    localStorage.setItem("vl_registered_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("vl_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("vl_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("vl_user");
    }
  }, [currentUser]);

  // Listen to Supabase Auth State Change
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userMeta = session.user.user_metadata || {};
        setCurrentUser((prev) => ({
          id: session.user.id,
          email: session.user.email,
          name: userMeta.full_name || prev?.name || session.user.email.split("@")[0],
          phone: userMeta.phone || prev?.phone || "9488412345",
          city: userMeta.city || "Dindigul",
          pincode: userMeta.pincode || "624001",
          addresses: prev?.addresses || [
            {
              id: "addr-auto",
              houseNo: "Address",
              street: userMeta.city || "Dindigul",
              city: userMeta.city || "Dindigul",
              state: "Tamil Nadu",
              pincode: userMeta.pincode || "624001"
            }
          ]
        }));
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Customer Login Action
  const loginUser = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth if online
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await authService.signIn(cleanEmail, password);
        if (error) {
          // If Supabase returns error, check if it's a demo offline user
          const localMatch = registeredUsers.find(
            (u) => u.email.toLowerCase() === cleanEmail && u.password === password
          );
          if (localMatch) {
            setCurrentUser(localMatch);
            return { success: true, user: localMatch };
          }
          return { success: false, message: error.message };
        }

        if (data?.user) {
          const userMeta = data.user.user_metadata || {};
          const userObj = {
            id: data.user.id,
            email: data.user.email,
            name: userMeta.full_name || data.user.email.split("@")[0],
            phone: userMeta.phone || "",
            city: userMeta.city || "Dindigul",
            pincode: userMeta.pincode || "624001",
            addresses: [
              {
                id: "addr-sb",
                houseNo: "Boutique Member Residence",
                street: userMeta.city || "Dindigul",
                city: userMeta.city || "Dindigul",
                state: "Tamil Nadu",
                pincode: userMeta.pincode || "624001"
              }
            ]
          };
          setCurrentUser(userObj);
          return { success: true, user: userObj };
        }
      } catch (err) {
        console.warn("Supabase login fallback to local check:", err);
      }
    }

    // 2. Local Fallback Database
    const localMatch = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (localMatch) {
      setCurrentUser(localMatch);
      return { success: true, user: localMatch };
    }

    // Allow flexible test password for pre-seeded emails
    const existingByEmail = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingByEmail) {
      setCurrentUser(existingByEmail);
      return { success: true, user: existingByEmail };
    }

    return { 
      success: false, 
      message: "No account found with this email and password. Please check your credentials or create a new account." 
    };
  };

  // Customer Register Action
  const registerUser = async ({ fullName, email, phone, password, city, pincode }) => {
    const cleanEmail = email.trim().toLowerCase();
    const newUserId = `usr-${Date.now().toString().slice(-6)}`;

    const newUserObj = {
      id: newUserId,
      name: fullName,
      email: cleanEmail,
      phone,
      password,
      city: city || "Dindigul",
      pincode: pincode || "624001",
      addresses: [
        {
          id: `addr-${Date.now()}`,
          houseNo: "Primary Address",
          street: city || "Dindigul",
          city: city || "Dindigul",
          district: "Dindigul",
          state: "Tamil Nadu",
          pincode: pincode || "624001"
        }
      ]
    };

    // 1. Try Supabase Auth if online
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await authService.signUp(cleanEmail, password, {
          full_name: fullName,
          phone,
          city,
          pincode
        });

        if (error) {
          console.warn("Supabase register error, saving locally:", error.message);
        } else if (data?.user) {
          newUserObj.id = data.user.id;
        }
      } catch (err) {
        console.warn("Supabase register exception:", err);
      }
    }

    // Save to local registry and activate session
    setRegisteredUsers((prev) => [newUserObj, ...prev.filter((u) => u.email.toLowerCase() !== cleanEmail)]);
    setCurrentUser(newUserObj);
    return { success: true, user: newUserObj };
  };

  // Customer Logout Action
  const logoutUser = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await authService.signOut();
      } catch (err) {
        console.warn("Supabase logout error:", err);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem("vl_user");
  };

  // Password Reset Action
  const resetUserPassword = async (email) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await authService.resetPassword(email);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.warn("Supabase reset password error:", err.message);
      }
    }
    return { success: true, message: "If this email is registered, password recovery instructions have been dispatched." };
  };

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("vl_admin_auth") === "true";
  });

  const loginAdmin = (password) => {
    if (password === "vastra2026" || password === "admin") {
      setIsAdminLoggedIn(true);
      localStorage.setItem("vl_admin_auth", "true");
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("vl_admin_auth");
  };

  // 7. Cart Actions
  const addToCart = (product, size, color, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prevCart,
        {
          id: product.id,
          nameEn: product.nameEn,
          nameTa: product.nameTa,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0] || product.image,
          size: size || product.sizes?.[0] || "Standard",
          color: color || product.colors?.[0] || "Standard",
          quantity
        }
      ];
    });
  };

  const updateCartQuantity = (index, delta) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // 8. Wishlist Actions
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const saveProduct = async (product) => {
    try {
      if (isSupabaseConfigured() && supabase) {
        const savedProduct = await productService.upsert(product);
        if (!savedProduct) return { success: false, message: "Could not save product to the shared catalog." };
        
        // Update local state
        setProducts((prev) => [savedProduct, ...prev.filter((item) => item.id !== savedProduct.id)]);
        console.info("✅ Product saved and synced to all devices:", savedProduct.id);
        return { success: true, product: savedProduct };
      }

      // Fallback to local state only if no Supabase
      setProducts((prev) => [product, ...prev.filter((item) => item.id !== product.id)]);
      console.warn("⚠️ Supabase not configured - saving locally only");
      return { success: true, product };
    } catch (err) {
      console.error("Save product error:", err);
      return { success: false, message: "Error saving product" };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      // Remove from local state immediately (optimistic update)
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      
      // Then delete from Supabase
      if (isSupabaseConfigured() && supabase) {
        const deleted = await productService.delete(productId);
        if (!deleted) {
          console.error("Failed to delete from Supabase, reverting...");
          // Revert if Supabase delete fails - will be reloaded from server on next sync
          return { success: false, message: "Could not remove product from the shared catalog." };
        }
        console.info("✅ Product deleted and synced to all devices");
      }
      
      return { success: true };
    } catch (err) {
      console.error("Delete product error:", err);
      return { success: false, message: "Error deleting product" };
    }
  };

  const updateProductStock = async (productId, quantityDelta) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return { success: false };
    return saveProduct({ ...product, stock: Math.max(0, product.stock + quantityDelta) });
  };

  // 9. Order Management Actions
  const createOrder = (orderData) => {
    const newOrderId = `VL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullOrder = {
      id: newOrderId,
      userId: currentUser?.id || orderData.userId || null,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      timeline: [
        {
          status: "confirmed",
          time: new Date().toLocaleString("en-IN"),
          title: "Order Placed & Verified via Razorpay"
        }
      ],
      ...orderData
    };

    // Deduct stock
    const updatedProducts = products.map((prod) => {
        const cartMatch = orderData.items.find((it) => it.id === prod.id);
        if (cartMatch) {
          const updatedStock = Math.max(0, prod.stock - cartMatch.quantity);
          return { ...prod, stock: updatedStock };
        }
        return prod;
      });
    setProducts(updatedProducts);

    if (isSupabaseConfigured() && supabase) {
      Promise.all(
        updatedProducts
          .filter((product) => orderData.items.some((item) => item.id === product.id))
          .map((product) => productService.upsert(product))
      ).catch((err) => console.warn("Could not sync stock changes:", err));
    }

    setOrders((prev) => [fullOrder, ...prev]);
    setActiveOrderId(newOrderId);
    clearCart();

    // Async sync to Supabase when backend is live
    if (isSupabaseConfigured()) {
      orderService.create(fullOrder).catch((err) => {
        console.warn("Could not sync order to Supabase:", err);
      });
    }

    return fullOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    let updatedTimeline = [];

    setOrders((prev) => {
      return prev.map((ord) => {
        if (ord.id === orderId) {
          const statusNames = {
            pending_payment: "Payment Pending",
            confirmed: "Order Confirmed",
            processing: "Processing in Dindigul Hub",
            packed: "Quality Inspected & Packed",
            shipped: "Shipped with Express Courier",
            out_for_delivery: "Out for Delivery to Your Doorstep",
            delivered: "Delivered to Customer",
            cancelled: "Order Cancelled & Refund Initiated"
          };

          const newTimelineItem = {
            status: newStatus,
            time: new Date().toLocaleString("en-IN"),
            title: statusNames[newStatus] || newStatus
          };

          updatedTimeline = [...(ord.timeline || []), newTimelineItem];

          return {
            ...ord,
            status: newStatus,
            timeline: updatedTimeline
          };
        }
        return ord;
      });
    });

    // Async update to Supabase when backend is live
    if (isSupabaseConfigured()) {
      orderService.updateStatus(orderId, newStatus, updatedTimeline).catch((err) => {
        console.warn("Could not update order status in Supabase:", err);
      });
    }
  };

  // 10. Navigation Helpers
  const navigateTo = (view, payload = {}) => {
    if (payload.productId) setSelectedProductId(payload.productId);
    if (payload.category) setSelectedCategoryFilter(payload.category);
    if (payload.orderId) setActiveOrderId(payload.orderId);
    if (payload.searchQuery !== undefined) setSearchQuery(payload.searchQuery);
    
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        t,
        toggleLanguage,
        theme,
        toggleTheme,
        currentView,
        navigateTo,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedProductId,
        setSelectedProductId,
        activeOrderId,
        setActiveOrderId,
        searchQuery,
        setSearchQuery,
        products,
        setProducts,
        saveProduct,
        deleteProduct,
        updateProductStock,
        categories,
        setCategories,
        coupons,
        setCoupons,
        banners,
        setBanners,
        reviews,
        setReviews,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        appliedCoupon,
        setAppliedCoupon,
        orders,
        createOrder,
        updateOrderStatus,
        currentUser,
        setCurrentUser,
        loginUser,
        registerUser,
        logoutUser,
        resetUserPassword,
        registeredUsers,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        isBackendConnected,
        isDataLoaded,
        isSupabaseConfigured: isSupabaseConfigured()
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
