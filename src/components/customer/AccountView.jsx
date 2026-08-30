import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  LogOut, 
  Eye, 
  Download, 
  Edit, 
  Trash2,
  Plus,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { generateInvoicePDF } from "../../services/invoiceGenerator";
import { AuthView } from "./AuthView";

export const AccountView = ({ initialTab = "profile" }) => {
  const { 
    lang, 
    t, 
    currentUser, 
    setCurrentUser, 
    logoutUser,
    orders, 
    wishlist, 
    products, 
    toggleWishlist, 
    addToCart, 
    navigateTo 
  } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.name || "");
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || "");
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "");
  const [profileCity, setProfileCity] = useState(currentUser?.city || "Dindigul");
  const [profilePincode, setProfilePincode] = useState(currentUser?.pincode || "624001");

  // If customer is not logged in, display the AuthView
  if (!currentUser) {
    return (
      <div className="container" style={{ padding: "20px 20px 80px 20px" }}>
        <AuthView redirectView="account" />
      </div>
    );
  }

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  // Strictly filter orders matching THIS current customer's account only
  const displayOrders = orders.filter((o) => {
    if (!currentUser) return false;
    const matchUserId = o.userId && (o.userId === currentUser.id);
    const matchEmail = o.customer?.email && currentUser.email && (o.customer.email.toLowerCase() === currentUser.email.toLowerCase());
    const matchPhone = o.customer?.phone && currentUser.phone && (o.customer.phone === currentUser.phone);
    return matchUserId || matchEmail || matchPhone;
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: profileName,
      phone: profilePhone,
      email: profileEmail,
      city: profileCity,
      pincode: profilePincode
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="container" style={{ padding: "40px 20px 80px 20px" }}>
      
      <div style={{ marginBottom: "32px" }}>
        <h1 className="font-serif account-welcome-title" style={{ fontSize: "2rem", color: "var(--brand-primary)" }}>
          {t.account.welcome}, {currentUser?.name || "Customer"} 🌸
        </h1>
        <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", marginTop: "4px" }}>
          Manage your personal details, order tracking, and wishlist
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "36px" }} className="account-layout">
        
        {/* Navigation Sidebar */}
        <aside style={{ backgroundColor: "var(--bg-surface)", padding: "16px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", height: "fit-content" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            
            <button
              onClick={() => setActiveTab("profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: activeTab === "profile" ? "var(--bg-blush)" : "transparent",
                color: activeTab === "profile" ? "var(--brand-primary)" : "var(--text-main)",
                fontWeight: activeTab === "profile" ? "600" : "500",
                fontSize: "0.9rem"
              }}
            >
              <User size={18} />
              <span>{t.account.tabs.profile}</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: activeTab === "orders" ? "var(--bg-blush)" : "transparent",
                color: activeTab === "orders" ? "var(--brand-primary)" : "var(--text-main)",
                fontWeight: activeTab === "orders" ? "600" : "500",
                fontSize: "0.9rem"
              }}
            >
              <ShoppingBag size={18} />
              <span>{t.account.tabs.orders} ({displayOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: activeTab === "wishlist" ? "var(--bg-blush)" : "transparent",
                color: activeTab === "wishlist" ? "var(--brand-primary)" : "var(--text-main)",
                fontWeight: activeTab === "wishlist" ? "600" : "500",
                fontSize: "0.9rem"
              }}
            >
              <Heart size={18} />
              <span>{t.account.tabs.wishlist} ({wishlist.length})</span>
            </button>

            <button
              onClick={() => navigateTo("order-track")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-main)",
                fontSize: "0.9rem"
              }}
            >
              <MapPin size={18} />
              <span>{t.account.tabs.track}</span>
            </button>

            <div style={{ height: "1px", backgroundColor: "var(--border-light)", margin: "8px 0" }} />

            <button
              onClick={() => logoutUser()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                color: "#DC2626",
                fontSize: "0.9rem",
                fontWeight: "500",
                background: "none",
                textAlign: "left",
                width: "100%",
                cursor: "pointer"
              }}
            >
              <LogOut size={18} />
              <span>{lang === "ta" ? "வெளியேறு (Logout)" : "Sign Out"}</span>
            </button>

          </div>
        </aside>

        {/* Content Pane */}
        <main>
          
          {/* TAB 1: Profile */}
          {activeTab === "profile" && (
            <div style={{ backgroundColor: "var(--bg-surface)", padding: "32px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "24px" }}>
                <div className="flex items-center gap-3">
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--text-main)", margin: 0 }}>
                    {t.account.profileDetails}
                  </h3>
                  <span className="badge badge-featured" style={{ fontSize: "0.75rem" }}>
                    🌸 Verified Member
                  </span>
                </div>
                {!isEditingProfile && (
                  <button onClick={() => setIsEditingProfile(true)} className="btn-secondary" style={{ padding: "6px 14px", fontSize: "0.82rem" }}>
                    <Edit size={14} />
                    <span>{t.account.editProfile}</span>
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "480px" }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>Name</label>
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} style={{ width: "100%" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>Mobile Number</label>
                    <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} style={{ width: "100%" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>Email</label>
                    <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} style={{ width: "100%" }} />
                  </div>
                  <div className="profile-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>City</label>
                      <input type="text" value={profileCity} onChange={(e) => setProfileCity(e.target.value)} style={{ width: "100%" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "4px" }}>Pincode</label>
                      <input type="text" value={profilePincode} onChange={(e) => setProfilePincode(e.target.value)} style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div className="flex gap-3" style={{ marginTop: "8px" }}>
                    <button type="submit" className="btn-primary">{t.account.saveChanges}</button>
                    <button type="button" onClick={() => setIsEditingProfile(false)} className="btn-secondary">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "0.92rem" }}>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>Customer Name</div>
                    <strong style={{ color: "var(--text-main)", fontSize: "1rem" }}>{currentUser?.name}</strong>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>Phone Number</div>
                    <strong style={{ color: "var(--text-main)", fontSize: "1rem" }}>+91 {currentUser?.phone}</strong>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>Email Address</div>
                    <strong style={{ color: "var(--text-main)", fontSize: "1rem" }}>{currentUser?.email}</strong>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>City & Pincode</div>
                    <strong style={{ color: "var(--text-main)", fontSize: "1rem" }}>{currentUser?.city || "Dindigul"} - {currentUser?.pincode || "624001"}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Orders List */}
          {activeTab === "orders" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {displayOrders.length === 0 ? (
                <div style={{ backgroundColor: "var(--bg-surface)", padding: "40px", textAlign: "center", borderRadius: "var(--radius-lg)" }}>
                  <p>{t.account.noOrders}</p>
                </div>
              ) : (
                displayOrders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      padding: "20px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-light)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px"
                    }}
                  >
                    <div className="flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Order ID: </span>
                        <strong style={{ color: "var(--brand-primary)" }}>{order.id}</strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "12px" }}>
                          {new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      <div className="badge badge-featured" style={{ textTransform: "capitalize" }}>
                        {order.status}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.nameEn} style={{ width: "42px", height: "52px", objectFit: "cover", borderRadius: "4px" }} />
                            <div>
                              <div style={{ fontSize: "0.88rem", fontWeight: "600" }}>{lang === "ta" ? item.nameTa || item.nameEn : item.nameEn}</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Size: {item.size} | Qty: {item.quantity}</div>
                            </div>
                          </div>
                          <div style={{ fontWeight: "700", color: "var(--brand-primary)" }}>
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between" style={{ borderTop: "1px solid var(--border-light)", paddingTop: "12px" }}>
                      <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>
                        Total: ₹{order.total?.toLocaleString("en-IN")}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => generateInvoicePDF(order)} className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                          <Download size={14} />
                          <span>Invoice</span>
                        </button>
                        <button onClick={() => navigateTo("order-track", { orderId: order.id })} className="btn-primary" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Wishlist */}
          {activeTab === "wishlist" && (
            <div>
              {wishlistedProducts.length === 0 ? (
                <div style={{ backgroundColor: "var(--bg-surface)", padding: "40px", textAlign: "center", borderRadius: "var(--radius-lg)" }}>
                  <p>{t.account.noWishlist}</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                  {wishlistedProducts.map((prod) => (
                    <div key={prod.id} style={{ backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-light)", padding: "12px" }}>
                      <img src={prod.images?.[0] || prod.image} alt={prod.nameEn} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
                      <h4 style={{ fontSize: "0.9rem", margin: "10px 0 6px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {lang === "ta" ? prod.nameTa || prod.nameEn : prod.nameEn}
                      </h4>
                      <div style={{ fontWeight: "700", color: "var(--brand-primary)", marginBottom: "10px" }}>₹{prod.price}</div>
                      <div className="flex gap-2">
                        <button onClick={() => addToCart(prod, "Free Size", "Standard", 1)} className="btn-primary" style={{ flex: 1, padding: "6px", fontSize: "0.78rem" }}>
                          Add to Cart
                        </button>
                        <button onClick={() => toggleWishlist(prod.id)} style={{ background: "none", color: "#DC2626", padding: "6px" }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .account-layout { grid-template-columns: 1fr !important; }
          .profile-grid { grid-template-columns: 1fr !important; }
          .profile-form-grid { grid-template-columns: 1fr !important; }
          .account-welcome-title { font-size: 1.5rem !important; }
        }
      `}</style>

    </div>
  );
};
