import React from "react";
import { useApp } from "../../context/AppContext";
import { 
  CheckCircle, 
  Download, 
  Truck, 
  MessageSquare, 
  ArrowRight, 
  Sparkles,
  MapPin,
  Calendar,
  CreditCard
} from "lucide-react";
import { generateInvoicePDF } from "../../services/invoiceGenerator";
import { getWhatsAppUrl } from "../../services/razorpay";

export const OrderConfirmationView = () => {
  const { lang, t, orders, activeOrderId, navigateTo } = useApp();

  const order = orders.find((o) => o.id === activeOrderId) || orders[0];

  if (!order) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2>No Order Selected</h2>
        <button onClick={() => navigateTo("home")} className="btn-primary" style={{ marginTop: "16px" }}>
          Return Home
        </button>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    generateInvoicePDF(order);
  };

  const waHelpMessage = `Hi Vastra Lakshnam Dindigul! I recently placed order #${order.id}. Could you please update me on dispatch?`;

  return (
    <div className="container" style={{ padding: "40px 20px 80px 20px", maxWidth: "880px" }}>
      
      {/* Success Header Card */}
      <div 
        className="glass-panel"
        style={{
          backgroundColor: "#FFFFFF",
          padding: "40px 30px",
          borderRadius: "var(--radius-xl)",
          textAlign: "center",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-md)",
          marginBottom: "32px"
        }}
      >
        <div 
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: "#ECFDF5",
            color: "#059669",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px"
          }}
        >
          <CheckCircle size={42} />
        </div>

        <h1 className="font-serif" style={{ fontSize: "2.2rem", color: "var(--brand-primary)", marginBottom: "8px" }}>
          {t.orderConfirmation.successTitle}
        </h1>

        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: "540px", margin: "0 auto 20px", lineHeight: 1.5 }}>
          {t.orderConfirmation.subtitle}
        </p>

        {/* Order & Payment ID Badges */}
        <div className="flex items-center justify-center gap-4" style={{ flexWrap: "wrap", marginBottom: "28px" }}>
          <div style={{ backgroundColor: "var(--bg-secondary)", padding: "8px 16px", borderRadius: "var(--radius-full)", fontSize: "0.88rem" }}>
            <span>{t.orderConfirmation.orderId}: </span>
            <strong style={{ color: "var(--brand-primary)" }}>{order.id}</strong>
          </div>

          <div style={{ backgroundColor: "var(--bg-secondary)", padding: "8px 16px", borderRadius: "var(--radius-full)", fontSize: "0.88rem" }}>
            <span>{t.orderConfirmation.paymentId}: </span>
            <strong style={{ color: "#065F46" }}>{order.paymentId || "Verified Razorpay"}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3" style={{ flexWrap: "wrap" }}>
          <button onClick={handleDownloadInvoice} className="btn-secondary" style={{ display: "inline-flex", gap: "8px" }}>
            <Download size={18} />
            <span>{t.orderConfirmation.downloadInvoice}</span>
          </button>

          <button onClick={() => navigateTo("order-track", { orderId: order.id })} className="btn-primary" style={{ display: "inline-flex", gap: "8px" }}>
            <Truck size={18} />
            <span>{t.orderConfirmation.trackOrder}</span>
          </button>
        </div>
      </div>

      {/* Order Details & Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }} className="order-summary-grid">
        
        {/* Ordered Items List */}
        <div style={{ backgroundColor: "var(--bg-surface)", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "16px", color: "var(--text-main)" }}>
            {t.orderConfirmation.orderSummary}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between" style={{ paddingBottom: "12px", borderBottom: "1px solid var(--border-light)" }}>
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.nameEn} style={{ width: "52px", height: "64px", objectFit: "cover", borderRadius: "4px" }} />
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>{lang === "ta" ? item.nameTa || item.nameEn : item.nameEn}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Size: {item.size} | Qty: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: "700", color: "var(--brand-primary)", fontSize: "0.95rem" }}>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed var(--border-medium)", display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "1.1rem", color: "var(--brand-primary)" }}>
            <span>Total Paid</span>
            <span>₹{order.total?.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Shipping & Support */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ backgroundColor: "var(--bg-surface)", padding: "20px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
            <div className="flex items-center gap-2" style={{ fontWeight: "600", fontSize: "0.95rem", marginBottom: "8px" }}>
              <MapPin size={18} color="var(--brand-primary)" />
              <span>{t.orderConfirmation.shippingTo}</span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              <div><strong>{order.customer?.name}</strong> ({order.customer?.phone})</div>
              <div>{order.shippingAddress?.houseNo}, {order.shippingAddress?.street}</div>
              <div>{order.shippingAddress?.city}, {order.shippingAddress?.district}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</div>
            </div>
          </div>

          {/* WhatsApp Assistance */}
          <div style={{ backgroundColor: "var(--bg-blush)", padding: "20px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-medium)" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--brand-primary)", marginBottom: "6px" }}>
              {lang === "ta" ? "திண்டுக்கல் வாட்ஸ்அப் உதவி" : "Dindigul Order Desk"}
            </h4>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "14px" }}>
              {t.orderConfirmation.needHelpWithOrder}
            </p>
            <a
              href={getWhatsAppUrl(waHelpMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ width: "100%", fontSize: "0.88rem", padding: "10px" }}
            >
              <MessageSquare size={16} />
              <span>Contact Order Desk</span>
            </a>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .order-summary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  );
};
