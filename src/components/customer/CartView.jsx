import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, ShieldCheck } from "lucide-react";

export const CartView = () => {
  const { 
    lang, 
    t, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    appliedCoupon, 
    setAppliedCoupon, 
    coupons, 
    navigateTo,
    currentUser
  } = useApp();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate discount based on applied coupon
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.min(appliedCoupon.maxDiscount || 9999, Math.round((subtotal * appliedCoupon.discountPercent) / 100));
    } else if (appliedCoupon.discountAmount) {
      discount = appliedCoupon.discountAmount;
    }
  }

  // Free delivery over ₹999
  const deliveryCharge = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const totalAmount = Math.max(0, subtotal - discount + deliveryCharge);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    const found = coupons.find((c) => c.code.toUpperCase() === couponInput.trim().toUpperCase() && c.isActive);

    if (!found) {
      setCouponError(lang === "ta" ? "செல்லுபடியாகாத கூப்பன் குறியீடு" : "Invalid coupon code");
      return;
    }

    if (found.minOrderValue && subtotal < found.minOrderValue) {
      setCouponError(
        lang === "ta"
          ? `இந்த கூப்பனுக்கு குறைந்தபட்சம் ₹${found.minOrderValue} தேவை`
          : `Minimum order value for ${found.code} is ₹${found.minOrderValue}`
      );
      return;
    }

    setAppliedCoupon(found);
    setCouponInput("");
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", backgroundColor: "var(--bg-surface)", padding: "40px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
          <span style={{ fontSize: "3.5rem", display: "block", marginBottom: "16px" }}>🛍️</span>
          <h2 className="font-serif" style={{ fontSize: "1.8rem", color: "var(--text-main)", marginBottom: "8px" }}>
            {t.cart.emptyTitle}
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "28px" }}>
            {t.cart.emptySubtitle}
          </p>
          <button onClick={() => navigateTo("catalog")} className="btn-primary" style={{ width: "100%" }}>
            {t.cart.startShopping}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 20px 80px 20px" }}>
      
      <h1 className="font-serif" style={{ fontSize: "2rem", color: "var(--brand-primary)", marginBottom: "28px" }}>
        {t.cart.title} ({cart.reduce((s, i) => s + i.quantity, 0)})
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "40px" }} className="cart-layout">
        
        {/* Left Column: Cart Items List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {cart.map((item, index) => {
            const name = lang === "ta" ? item.nameTa || item.nameEn : item.nameEn;

            return (
              <div
                key={`${item.id}-${item.size}-${item.color}-${index}`}
                style={{
                  backgroundColor: "var(--bg-surface)",
                  padding: "18px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  gap: "18px",
                  alignItems: "center"
                }}
              >
                {/* Product Thumbnail */}
                <img
                  src={item.image}
                  alt={name}
                  style={{
                    width: "84px",
                    height: "105px",
                    objectFit: "cover",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "#F7EFEA"
                  }}
                />

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "4px" }}>
                    {name}
                  </h3>
                  
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "10px", display: "flex", gap: "12px" }}>
                    <span>{t.cart.size}: <strong>{item.size}</strong></span>
                    <span>{t.cart.color}: <strong>{item.color}</strong></span>
                  </div>

                  <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: "12px" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--brand-primary)" }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center" style={{ border: "1px solid var(--border-medium)", borderRadius: "var(--radius-full)", padding: "2px 6px", backgroundColor: "var(--bg-subtle)" }}>
                      <button
                        onClick={() => updateCartQuantity(index, -1)}
                        style={{ width: "26px", height: "26px", background: "none", fontWeight: "600" }}
                      >
                        -
                      </button>
                      <span style={{ padding: "0 10px", fontWeight: "700", fontSize: "0.88rem" }}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(index, 1)}
                        style={{ width: "26px", height: "26px", background: "none", fontWeight: "600" }}
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => removeFromCart(index)}
                      style={{ background: "none", color: "var(--text-muted)", padding: "4px", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.82rem" }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                      <span>{t.cart.remove}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => navigateTo("catalog")}
            style={{
              alignSelf: "flex-start",
              background: "none",
              color: "var(--brand-primary)",
              fontWeight: "600",
              fontSize: "0.9rem",
              marginTop: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            ← {t.cart.continueShopping}
          </button>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div>
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              padding: "24px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
              position: "sticky",
              top: "140px"
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "20px" }}>
              {t.cart.orderSummary}
            </h3>

            {/* Coupon Box */}
            <div style={{ marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid var(--border-light)" }}>
              {appliedCoupon ? (
                <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", padding: "10px 14px", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div className="flex items-center gap-2" style={{ color: "#065F46", fontSize: "0.88rem", fontWeight: "600" }}>
                    <Tag size={16} />
                    <span>{appliedCoupon.code} Applied (₹{discount} OFF)</span>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    style={{ background: "none", color: "#991B1B", fontSize: "0.78rem", fontWeight: "600" }}
                  >
                    {t.cart.removeCoupon}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={t.cart.couponPlaceholder}
                      style={{ flex: 1, textTransform: "uppercase", fontSize: "0.85rem" }}
                    />
                    <button type="submit" className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                      {t.cart.apply}
                    </button>
                  </div>
                  {couponError && (
                    <div style={{ color: "#DC2626", fontSize: "0.78rem", marginTop: "6px" }}>
                      {couponError}
                    </div>
                  )}
                  {/* Available Coupon Suggestion */}
                  <div style={{ marginTop: "8px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    💡 Use <strong>VASTRA10</strong> for 10% OFF above ₹999
                  </div>
                </form>
              )}
            </div>

            {/* Breakdown Calculations */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.92rem", marginBottom: "20px" }}>
              <div className="flex items-center justify-between" style={{ color: "var(--text-secondary)" }}>
                <span>{t.cart.subtotal}</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between" style={{ color: "#059669", fontWeight: "500" }}>
                  <span>{t.cart.couponDiscount}</span>
                  <span>- ₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex items-center justify-between" style={{ color: "var(--text-secondary)" }}>
                <span>{t.cart.deliveryCharge}</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <strong style={{ color: "#059669" }}>{t.cart.free}</strong>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>

              <div 
                className="flex items-center justify-between" 
                style={{
                  borderTop: "1.5px dashed var(--border-medium)",
                  paddingTop: "14px",
                  fontSize: "1.15rem",
                  fontWeight: "700",
                  color: "var(--brand-primary)"
                }}
              >
                <span>{t.cart.total}</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                if (!currentUser) {
                  navigateTo("auth", { redirectView: "checkout" });
                } else {
                  navigateTo("checkout");
                }
              }}
              className="btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "1rem" }}
            >
              <span>
                {!currentUser 
                  ? (lang === "ta" ? "உள்நுழைந்து ஆர்டர் செய்க" : "Sign In to Checkout") 
                  : t.cart.proceedCheckout}
              </span>
              <ArrowRight size={18} />
            </button>

            {/* Trust Assurance */}
            <div className="flex items-center justify-center gap-2" style={{ marginTop: "16px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              <ShieldCheck size={16} color="var(--brand-secondary)" />
              <span>{t.cart.secureCheckoutNote}</span>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .cart-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  );
};
