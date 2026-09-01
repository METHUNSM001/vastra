import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Image, 
  BarChart3, 
  Boxes, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  LogOut, 
  ArrowLeft,
  Search,
  Filter,
  DollarSign
} from "lucide-react";
import { generateInvoicePDF } from "../../services/invoiceGenerator";

export const AdminDashboard = () => {
  const { 
    lang, 
    t, 
    theme,
    isAdminLoggedIn, 
    loginAdmin, 
    logoutAdmin, 
    products, 
    setProducts, 
    categories, 
    setCategories, 
    saveProduct,
    deleteProduct,
    updateProductStock,
    orders, 
    updateOrderStatus, 
    coupons, 
    setCoupons, 
    banners, 
    setBanners, 
    navigateTo 
  } = useApp();

  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeAdminTab, setActiveAdminTab] = useState("dashboard");

  // Product Add/Edit Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pNameEn, setPNameEn] = useState("");
  const [pNameTa, setPNameTa] = useState("");
  const [pCategory, setPCategory] = useState("sarees");
  const [pPrice, setPPrice] = useState("");
  const [pOriginalPrice, setPOriginalPrice] = useState("");
  const [pStock, setPStock] = useState("");
  const [pFabric, setPFabric] = useState("");
  const [pImage, setPImage] = useState("");
  const [pDescEn, setPDescEn] = useState("");
  const [pDescTa, setPDescTa] = useState("");

  // Coupon Modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [cCode, setCCode] = useState("");
  const [cPercent, setCPercent] = useState(10);
  const [cMinOrder, setCMinOrder] = useState(999);
  const [cMaxDiscount, setCMaxDiscount] = useState(500);

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === "confirmed" || o.status === "processing").length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginAdmin(passwordInput)) {
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Please try again.");
    }
  };

  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setPNameEn(prod.nameEn);
      setPNameTa(prod.nameTa || "");
      setPCategory(prod.category);
      setPPrice(prod.price);
      setPOriginalPrice(prod.originalPrice || "");
      setPStock(prod.stock);
      setPFabric(prod.fabric || "");
      setPImage(prod.images?.[0] || prod.image);
      setPDescEn(prod.descriptionEn || "");
      setPDescTa(prod.descriptionTa || "");
    } else {
      setEditingProduct(null);
      setPNameEn("");
      setPNameTa("");
      setPCategory(categories[0]?.slug || categories[0]?.id || "sarees");
      setPPrice("");
      setPOriginalPrice("");
      setPStock(20);
      setPFabric("100% Handloom Cotton");
      setPImage("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80");
      setPDescEn("");
      setPDescTa("");
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const productData = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      sku: editingProduct ? editingProduct.sku : `VL-${pCategory.substring(0,3).toUpperCase()}-${Math.floor(10 + Math.random()*90)}`,
      nameEn: pNameEn,
      nameTa: pNameTa || pNameEn,
      category: pCategory,
      price: Number(pPrice),
      originalPrice: Number(pOriginalPrice) || Number(pPrice) * 1.3,
      discount: pOriginalPrice ? Math.round(((pOriginalPrice - pPrice) / pOriginalPrice) * 100) : 25,
      stock: Number(pStock),
      fabric: pFabric,
      images: [pImage],
      sizes: editingProduct ? editingProduct.sizes : ["Free Size", "S", "M", "L", "XL"],
      colors: editingProduct ? editingProduct.colors : ["Standard"],
      descriptionEn: pDescEn,
      descriptionTa: pDescTa || pDescEn,
      rating: editingProduct ? editingProduct.rating : 4.8,
      reviewCount: editingProduct ? editingProduct.reviewCount : 12,
      isNew: true,
      isActive: true
    };

    const result = await saveProduct(productData);
    if (result.success) setShowProductModal(false);
    else window.alert(result.message);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to remove this product from catalog?")) {
      const result = await deleteProduct(id);
      if (!result.success) window.alert(result.message);
    }
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    const newCoupon = {
      id: `cp-${Date.now()}`,
      code: cCode.toUpperCase(),
      discountPercent: Number(cPercent),
      maxDiscount: Number(cMaxDiscount),
      minOrderValue: Number(cMinOrder),
      isActive: true,
      descriptionEn: `${cPercent}% OFF above ₹${cMinOrder}`,
      descriptionTa: `₹${cMinOrder}-க்கு மேல் ${cPercent}% தள்ளுபடி`
    };
    setCoupons([newCoupon, ...coupons]);
    setShowCouponModal(false);
    setCCode("");
  };

  // ADMIN LOGIN SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="container" style={{ padding: "80px 20px", display: "flex", justifyContent: "center" }}>
        <div 
          className="glass-panel"
          style={{
            backgroundColor: "#FFFFFF",
            padding: "40px",
            borderRadius: "var(--radius-xl)",
            maxWidth: "420px",
            width: "100%",
            textAlign: "center",
            boxShadow: "var(--shadow-lg)"
          }}
        >
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "var(--bg-blush)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            🔒
          </div>

          <h2 className="font-serif" style={{ fontSize: "1.6rem", color: "var(--brand-primary)", marginBottom: "6px" }}>
            Vastra Lakshnam Admin
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
            Enter your administrative password to manage boutique inventory and orders.
          </p>

          <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Admin Password (e.g. admin)"
              required
              style={{ width: "100%", textAlign: "center", fontSize: "1rem", letterSpacing: "0.1em" }}
            />

            {authError && (
              <div style={{ color: "#DC2626", fontSize: "0.8rem" }}>{authError}</div>
            )}

            <button type="submit" className="btn-primary" style={{ width: "100%" }}>
              Access Admin Hub
            </button>
          </form>

          <button 
            onClick={() => navigateTo("home")}
            style={{ marginTop: "20px", background: "none", color: "var(--text-muted)", fontSize: "0.82rem" }}
          >
            ← Return to Customer Storefront
          </button>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD
  const adminBg = theme === "dark" ? "#0F0A0D" : "#F7F5F2";
  const adminTextMain = theme === "dark" ? "#FFFFFF" : "#1A1A1A";
  const adminTextSecondary = theme === "dark" ? "#D1D5DB" : "#666666";
  const adminCardBg = theme === "dark" ? "#1A1515" : "#FFFFFF";
  const adminBorder = theme === "dark" ? "#2D2525" : "var(--border-light)";
  const adminHeaderBg = theme === "dark" ? "#20171B" : "#F0F0F0";
  const adminTableHeaderBg = theme === "dark" ? "#2D2525" : "#F3F4F6";
  const adminTableHeaderText = theme === "dark" ? "#FFFFFF" : "#1F2937";

  return (
    <div style={{ backgroundColor: adminBg, minHeight: "100vh", paddingBottom: "60px" }}>
      
      {/* Admin Top Header */}
      <div style={{ backgroundColor: theme === "dark" ? "#20171B" : "#F0F0F0", color: theme === "dark" ? "#FFFFFF" : adminTextMain, padding: "16px 24px", borderBottom: "2px solid var(--brand-secondary)" }}>
        <div className="container-wide flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "1.4rem" }}>🌸</span>
            <div>
              <div style={{ fontWeight: "700", fontSize: "1.1rem", letterSpacing: "0.02em" }}>Vastra Lakshnam Admin Hub</div>
              <div style={{ fontSize: "0.72rem", color: "var(--brand-secondary)" }}>Dindigul Headquarters Operations</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo("home")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#FFFFFF",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.82rem"
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Store</span>
            </button>

            <button
              onClick={logoutAdmin}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#DC2626",
                color: "#FFFFFF",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.82rem"
              }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div style={{ backgroundColor: adminCardBg, borderBottom: `1px solid ${adminBorder}`, padding: "0 24px" }}>
        <div className="container-wide flex gap-6" style={{ overflowX: "auto", flexWrap: "wrap" }}>
          {[
            { id: "dashboard", label: "Dashboard Overview", icon: BarChart3 },
            { id: "products", label: `Products (${products.length})`, icon: Package },
            { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: "inventory", label: "Inventory & Alerts", icon: Boxes },
            { id: "coupons", label: "Coupons & Offers", icon: Tag }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "16px 0",
                  borderBottom: isActive ? "3px solid var(--brand-primary)" : "3px solid transparent",
                  color: isActive ? "var(--brand-primary)" : adminTextSecondary,
                  fontWeight: isActive ? "700" : "500",
                  fontSize: "0.92rem",
                  background: "none"
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="container-wide" style={{ padding: "30px 24px" }}>
        
        {/* VIEW 1: DASHBOARD METRICS */}
        {activeAdminTab === "dashboard" && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
              
              <div style={{ backgroundColor: adminCardBg, padding: "20px", borderRadius: "var(--radius-lg)", border: `1px solid ${adminBorder}`, boxShadow: "var(--shadow-sm)" }}>
                <div style={{ fontSize: "0.82rem", color: adminTextSecondary, fontWeight: "600", textTransform: "uppercase" }}>Total Sales Revenue</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--brand-primary)", marginTop: "4px" }}>
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#059669", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <TrendingUp size={14} /> 100% Razorpay Verified
                </div>
              </div>

              <div style={{ backgroundColor: adminCardBg, padding: "20px", borderRadius: "var(--radius-lg)", border: `1px solid ${adminBorder}`, boxShadow: "var(--shadow-sm)" }}>
                <div style={{ fontSize: "0.82rem", color: adminTextSecondary, fontWeight: "600", textTransform: "uppercase" }}>Total Orders Placed</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "700", color: adminTextMain, marginTop: "4px" }}>
                  {totalOrdersCount}
                </div>
                <div style={{ fontSize: "0.78rem", color: adminTextSecondary, marginTop: "4px" }}>
                  {pendingOrdersCount} orders requiring fulfillment
                </div>
              </div>

              <div style={{ backgroundColor: adminCardBg, padding: "20px", borderRadius: "var(--radius-lg)", border: `1px solid ${adminBorder}`, boxShadow: "var(--shadow-sm)" }}>
                <div style={{ fontSize: "0.82rem", color: adminTextSecondary, fontWeight: "600", textTransform: "uppercase" }}>Active Catalog Products</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "700", color: adminTextMain, marginTop: "4px" }}>
                  {products.length}
                </div>
                <div style={{ fontSize: "0.78rem", color: adminTextSecondary, marginTop: "4px" }}>
                  Across {categories.length} categories
                </div>
              </div>

              <div style={{ backgroundColor: adminCardBg, padding: "20px", borderRadius: "var(--radius-lg)", border: `1px solid ${adminBorder}`, boxShadow: "var(--shadow-sm)" }}>
                <div style={{ fontSize: "0.82rem", color: adminTextSecondary, fontWeight: "600", textTransform: "uppercase" }}>Low Stock Alert</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "700", color: lowStockCount > 0 ? "#DC2626" : "#059669", marginTop: "4px" }}>
                  {lowStockCount} items
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Stock ≤ 5 units remaining
                </div>
              </div>

            </div>

            {/* Recent Orders Overview */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "18px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Recent Orders</h3>
                <button onClick={() => setActiveAdminTab("orders")} className="btn-secondary" style={{ padding: "6px 14px", fontSize: "0.82rem" }}>
                  View All Orders →
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--bg-secondary)", textAlign: "left" }}>
                      <th style={{ padding: "10px 14px" }}>Order ID</th>
                      <th style={{ padding: "10px 14px" }}>Customer</th>
                      <th style={{ padding: "10px 14px" }}>Amount</th>
                      <th style={{ padding: "10px 14px" }}>Payment</th>
                      <th style={{ padding: "10px 14px" }}>Order Status</th>
                      <th style={{ padding: "10px 14px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                        <td style={{ padding: "12px 14px", fontWeight: "600", color: "var(--brand-primary)" }}>{ord.id}</td>
                        <td style={{ padding: "12px 14px" }}>{ord.customer?.name || "Customer"}</td>
                        <td style={{ padding: "12px 14px", fontWeight: "700" }}>₹{ord.total?.toLocaleString("en-IN")}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ backgroundColor: "#ECFDF5", color: "#065F46", padding: "3px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "700" }}>
                            {ord.paymentStatus || "PAID"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", textTransform: "capitalize" }}>{ord.status}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <button onClick={() => generateInvoicePDF(ord)} className="btn-secondary" style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
                            Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PRODUCT MANAGEMENT */}
        {activeAdminTab === "products" && (
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: adminTextMain }}>Manage Product Catalog</h2>
              <button onClick={() => handleOpenProductModal(null)} className="btn-primary">
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            </div>

            <div style={{ backgroundColor: adminCardBg, borderRadius: "var(--radius-lg)", border: `1px solid ${adminBorder}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", maxWidth: "100%" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", minWidth: "600px" }}>
                <thead>
                  <tr style={{ backgroundColor: adminTableHeaderBg, textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", color: adminTableHeaderText, fontWeight: "600", whiteSpace: "nowrap" }}>Product</th>
                    <th style={{ padding: "12px 16px", color: adminTableHeaderText, fontWeight: "600", whiteSpace: "nowrap" }}>Category</th>
                    <th style={{ padding: "12px 16px", color: adminTableHeaderText, fontWeight: "600", whiteSpace: "nowrap" }}>Price</th>
                    <th style={{ padding: "12px 16px", color: adminTableHeaderText, fontWeight: "600", whiteSpace: "nowrap" }}>Stock</th>
                    <th style={{ padding: "12px 16px", color: adminTableHeaderText, fontWeight: "600", whiteSpace: "nowrap" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: `1px solid ${adminBorder}` }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div className="flex items-center gap-3">
                          <img src={prod.images?.[0] || prod.image} alt={prod.nameEn} style={{ width: "42px", height: "54px", objectFit: "cover", borderRadius: "4px" }} />
                          <div>
                            <strong style={{ display: "block", color: adminTextMain }}>{prod.nameEn}</strong>
                            <span style={{ fontSize: "0.78rem", color: adminTextSecondary }}>{prod.nameTa}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", textTransform: "capitalize", color: adminTextMain }}>{prod.category}</td>
                      <td style={{ padding: "12px 16px", fontWeight: "700", color: "var(--brand-primary)" }}>₹{prod.price}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ color: prod.stock <= 5 ? "#DC2626" : "#065F46", fontWeight: "600" }}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div className="flex gap-3" style={{ display: "flex", gap: "12px" }}>
                          <button onClick={() => handleOpenProductModal(prod)} style={{ background: "none", color: "var(--brand-primary)", padding: "6px 8px", cursor: "pointer", borderRadius: "4px", transition: "background 0.2s", display: "inline-flex", alignItems: "center" }} onMouseEnter={(e) => e.target.style.backgroundColor = theme === "dark" ? "rgba(236,72,153,0.1)" : "rgba(236,72,153,0.1)"} onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDeleteProduct(prod.id)} style={{ background: "none", color: "#DC2626", padding: "6px 8px", cursor: "pointer", borderRadius: "4px", transition: "background 0.2s", display: "inline-flex", alignItems: "center", fontSize: "1rem" }} onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(220,38,38,0.1)"} onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"} title="Delete Product">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ORDER LIFECYCLE MANAGEMENT */}
        {activeAdminTab === "orders" && (
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "20px" }}>Order Fulfillment Hub</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {orders.map((ord) => (
                <div key={ord.id} style={{ backgroundColor: adminCardBg, padding: "20px", borderRadius: "var(--radius-md)", border: `1px solid ${adminBorder}`, boxShadow: "var(--shadow-sm)" }}>
                  
                  <div className="flex items-center justify-between" style={{ borderBottom: `1px solid ${adminBorder}`, paddingBottom: "12px", marginBottom: "14px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: adminTextSecondary }}>Order ID: </span>
                      <strong style={{ color: "var(--brand-primary)", fontSize: "1.1rem" }}>{ord.id}</strong>
                      <span style={{ marginLeft: "14px", fontSize: "0.85rem", color: adminTextSecondary }}>
                        Customer: <strong style={{ color: adminTextMain }}>{ord.customer?.name}</strong> (+91 {ord.customer?.phone})
                      </span>
                    </div>

                    {/* Order Status Update Selector */}
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "0.82rem", fontWeight: "600" }}>Update Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        style={{ padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", borderColor: "var(--brand-primary)" }}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing in Dindigul</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      
                      <button onClick={() => generateInvoicePDF(ord)} className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                        Invoice
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}>
                    {/* Items */}
                    <div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "6px" }}>Products:</div>
                      {ord.items?.map((it, idx) => (
                        <div key={idx} style={{ fontSize: "0.85rem", marginBottom: "4px" }}>
                          • {it.nameEn} (Size: {it.size}, Color: {it.color}) x {it.quantity} = <strong>₹{it.price * it.quantity}</strong>
                        </div>
                      ))}
                      <div style={{ fontWeight: "700", marginTop: "8px", color: "var(--brand-primary)" }}>
                        Total Paid: ₹{ord.total}
                      </div>
                    </div>

                    {/* Address */}
                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", backgroundColor: "var(--bg-secondary)", padding: "10px", borderRadius: "4px" }}>
                      <strong>Shipping Address:</strong><br />
                      {ord.shippingAddress?.houseNo}, {ord.shippingAddress?.street}, {ord.shippingAddress?.city}, {ord.shippingAddress?.district} - {ord.shippingAddress?.pincode}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: INVENTORY & STOCK ALERTS */}
        {activeAdminTab === "inventory" && (
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "20px", color: adminTextMain }}>Inventory & Replenishment Monitor</h2>

            <div style={{ backgroundColor: adminCardBg, borderRadius: "var(--radius-lg)", border: `1px solid ${adminBorder}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", maxWidth: "100%" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", minWidth: "650px" }}>
                <thead>
                  <tr style={{ backgroundColor: adminTableHeaderBg, textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", color: adminTableHeaderText, fontWeight: "600", whiteSpace: "nowrap" }}>SKU</th>
                    <th style={{ padding: "12px 16px", color: adminTableHeaderText, fontWeight: "600", whiteSpace: "nowrap" }}>Product Name</th>
                    <th style={{ padding: "12px 16px", color: adminTableHeaderText, fontWeight: "600", whiteSpace: "nowrap" }}>Category</th>
                    <th style={{ padding: "12px 16px", color: adminTableHeaderText, fontWeight: "600", whiteSpace: "nowrap" }}>Available Stock</th>
                    <th style={{ padding: "12px 16px", color: adminTableHeaderText, fontWeight: "600", whiteSpace: "nowrap" }}>Status</th>
                    <th style={{ padding: "12px 16px", color: adminTableHeaderText, fontWeight: "600", whiteSpace: "nowrap" }}>Quick Restock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${adminBorder}` }}>
                      <td style={{ padding: "12px 16px", fontWeight: "600", color: adminTextMain }}>{p.sku || p.id}</td>
                      <td style={{ padding: "12px 16px", color: adminTextMain }}>{p.nameEn}</td>
                      <td style={{ padding: "12px 16px", textTransform: "capitalize" }}>{p.category}</td>
                      <td style={{ padding: "12px 16px", fontWeight: "700" }}>{p.stock}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {p.stock <= 0 ? (
                          <span style={{ color: "#DC2626", fontWeight: "700" }}>Out of Stock</span>
                        ) : p.stock <= 5 ? (
                          <span style={{ color: "#D97706", fontWeight: "700" }}>⚠ Low Stock</span>
                        ) : (
                          <span style={{ color: "#059669", fontWeight: "600" }}>In Stock</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              updateProductStock(p.id, 10);
                            }}
                            className="btn-secondary"
                            style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                          >
                            +10 Units
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: COUPONS */}
        {activeAdminTab === "coupons" && (
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Promotional Coupons</h2>
              <button onClick={() => setShowCouponModal(true)} className="btn-primary">
                <Plus size={16} />
                <span>Create Coupon</span>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              {coupons.map((c) => (
                <div key={c.id} style={{ backgroundColor: adminCardBg, padding: "20px", borderRadius: "var(--radius-md)", border: `1px solid ${adminBorder}`, boxShadow: "var(--shadow-sm)" }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: "10px" }}>
                    <div style={{ backgroundColor: "var(--bg-blush)", color: "var(--brand-primary)", padding: "4px 10px", borderRadius: "4px", fontWeight: "700", letterSpacing: "0.05em" }}>
                      {c.code}
                    </div>
                    <button
                      onClick={() => setCoupons(coupons.filter((cp) => cp.id !== c.id))}
                      style={{ background: "none", color: "#DC2626", cursor: "pointer", display: "inline-flex", alignItems: "center", padding: "4px" }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "4px", color: adminTextMain }}>{c.descriptionEn}</div>
                  <div style={{ fontSize: "0.8rem", color: adminTextSecondary }}>Min Order: ₹{c.minOrderValue} | Max Discount: ₹{c.maxDiscount}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: adminCardBg, padding: "30px", borderRadius: "var(--radius-lg)", maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "20px", color: adminTextMain }}>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>

            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px", color: adminTextMain }}>English Name *</label>
                <input type="text" required value={pNameEn} onChange={(e) => setPNameEn(e.target.value)} style={{ width: "100%", backgroundColor: theme === "dark" ? "#2D2525" : "#F5F5F5", color: adminTextMain, padding: "8px 12px", borderRadius: "4px", border: `1px solid ${adminBorder}` }} />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px", color: adminTextMain }}>Tamil Name (தமிழ்)</label>
                <input type="text" value={pNameTa} onChange={(e) => setPNameTa(e.target.value)} style={{ width: "100%", backgroundColor: theme === "dark" ? "#2D2525" : "#F5F5F5", color: adminTextMain, padding: "8px 12px", borderRadius: "4px", border: `1px solid ${adminBorder}` }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>Category</label>
                  <select value={pCategory} onChange={(e) => setPCategory(e.target.value)} style={{ width: "100%" }}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>Fabric / Material</label>
                  <input type="text" value={pFabric} onChange={(e) => setPFabric(e.target.value)} style={{ width: "100%" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>Price (₹) *</label>
                  <input type="number" required value={pPrice} onChange={(e) => setPPrice(e.target.value)} style={{ width: "100%" }} />
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>Original Price (₹)</label>
                  <input type="number" value={pOriginalPrice} onChange={(e) => setPOriginalPrice(e.target.value)} style={{ width: "100%" }} />
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>Stock Units *</label>
                  <input type="number" required value={pStock} onChange={(e) => setPStock(e.target.value)} style={{ width: "100%" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>Image URL</label>
                <input type="url" required value={pImage} onChange={(e) => setPImage(e.target.value)} style={{ width: "100%" }} />
              </div>

              <div className="flex justify-between" style={{ marginTop: "12px" }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: adminCardBg, padding: "30px", borderRadius: "var(--radius-lg)", maxWidth: "420px", width: "100%" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "16px", color: adminTextMain }}>Create Coupon</h3>
            <form onSubmit={handleCreateCoupon} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px", color: adminTextMain }}>Coupon Code</label>
                <input type="text" required value={cCode} onChange={(e) => setCCode(e.target.value)} placeholder="e.g. FESTIVE20" style={{ width: "100%", textTransform: "uppercase", backgroundColor: theme === "dark" ? "#2D2525" : "#F5F5F5", color: adminTextMain, padding: "8px 12px", borderRadius: "4px", border: `1px solid ${adminBorder}` }} />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px", color: adminTextMain }}>Discount Percentage (%)</label>
                <input type="number" required value={cPercent} onChange={(e) => setCPercent(e.target.value)} style={{ width: "100%", backgroundColor: theme === "dark" ? "#2D2525" : "#F5F5F5", color: adminTextMain, padding: "8px 12px", borderRadius: "4px", border: `1px solid ${adminBorder}` }} />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px", color: adminTextMain }}>Minimum Order Value (₹)</label>
                <input type="number" required value={cMinOrder} onChange={(e) => setCMinOrder(e.target.value)} style={{ width: "100%", backgroundColor: theme === "dark" ? "#2D2525" : "#F5F5F5", color: adminTextMain, padding: "8px 12px", borderRadius: "4px", border: `1px solid ${adminBorder}` }} />
              </div>
              <div className="flex justify-between" style={{ marginTop: "12px" }}>
                <button type="button" onClick={() => setShowCouponModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
