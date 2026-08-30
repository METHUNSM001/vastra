import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  Home, 
  Download, 
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { generateInvoicePDF } from "../../services/invoiceGenerator";
import { getWhatsAppUrl } from "../../services/razorpay";

export const OrderTrackingView = () => {
  const { lang, t, orders, activeOrderId, setActiveOrderId, navigateTo } = useApp();
  const [searchInput, setSearchInput] = useState(activeOrderId || "");

  const currentOrder = orders.find((o) => o.id.toLowerCase() === (searchInput || "").trim().toLowerCase()) 
    || orders[0];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const found = orders.find((o) => o.id.toLowerCase() === searchInput.trim().toLowerCase());
      if (found) setActiveOrderId(found.id);
    }
  };

  const statusOrder = [
    { key: "confirmed", label: t.orderTracking.statusStages.confirmed, icon: CheckCircle2 },
    { key: "processing", label: t.orderTracking.statusStages.processing, icon: Clock },
    { key: "packed", label: t.orderTracking.statusStages.packed, icon: Package },
    { key: "shipped", label: t.orderTracking.statusStages.shipped, icon: Truck },
    { key: "delivered", label: t.orderTracking.statusStages.delivered, icon: Home }
  ];

  const getStatusIndex = (status) => {
    const map = { confirmed: 0, processing: 1, packed: 2, shipped: 3, out_for_delivery: 3, delivered: 4 };
    return map[status] !== undefined ? map[status] : 0;
  };

  const activeIndex = getStatusIndex(currentOrder?.status || "confirmed");

  return (
    <div className="container" style={{ padding: "40px 20px 80px 20px", maxWidth: "880px" }}>
      
      {/* Header & Search Bar */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h1 className="font-serif" style={{ fontSize: "2rem", color: "var(--brand-primary)", marginBottom: "8px" }}>
          {t.orderTracking.title}
        </h1>
        <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
          Enter your Vastra Lakshnam Order ID to view real-time courier updates
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearch} style={{ maxWidth: "460px", margin: "0 auto", display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t.orderTracking.searchPlaceholder}
            style={{ flex: 1, textTransform: "uppercase" }}
          />
          <button type="submit" className="btn-primary" style={{ padding: "10px 22px" }}>
            {t.orderTracking.trackBtn}
          </button>
        </form>
      </div>

      {currentOrder ? (
        <div style={{ backgroundColor: "var(--bg-surface)", padding: "32px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
          
          {/* Top Order Information */}
          <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: "16px", paddingBottom: "24px", borderBottom: "1px solid var(--border-light)" }}>
            <div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>
                Order ID
              </div>
              <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "var(--brand-primary)" }}>
                {currentOrder.id}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Placed on {new Date(currentOrder.createdAt || Date.now()).toLocaleDateString("en-IN")}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => generateInvoicePDF(currentOrder)}
                className="btn-secondary"
                style={{ padding: "8px 16px", fontSize: "0.85rem" }}
              >
                <Download size={15} />
                <span>{t.orderTracking.downloadInvoice}</span>
              </button>

              <a
                href={getWhatsAppUrl(`Hi Vastra Lakshnam! I'm inquiring about the tracking status of order ${currentOrder.id}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ padding: "8px 16px", fontSize: "0.85rem" }}
              >
                <MessageSquare size={15} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Visual Status Journey Tracker */}
          <div style={{ margin: "40px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
              {statusOrder.map((step, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;
                const IconComp = step.icon;

                return (
                  <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, flex: 1, textAlign: "center" }}>
                    <div 
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        backgroundColor: isPassed ? "var(--brand-primary)" : "var(--bg-secondary)",
                        color: isPassed ? "#FFFFFF" : "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "10px",
                        border: isCurrent ? "3px solid var(--brand-secondary)" : "none",
                        boxShadow: isCurrent ? "0 0 12px rgba(212, 163, 115, 0.5)" : "none"
                      }}
                    >
                      <IconComp size={20} />
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: isCurrent ? "700" : "500", color: isPassed ? "var(--text-main)" : "var(--text-muted)", maxWidth: "100px" }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Detailed Audit Trail */}
          <div style={{ marginTop: "32px", padding: "20px", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "14px" }}>
              {t.orderTracking.timeline}
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {(currentOrder.timeline || []).map((tl, index) => (
                <div key={index} className="flex items-center gap-3" style={{ fontSize: "0.85rem" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--brand-primary)" }} />
                  <span style={{ color: "var(--text-muted)", width: "160px" }}>{tl.time}</span>
                  <strong style={{ color: "var(--text-main)" }}>{tl.title}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Items In Shipment */}
          <div style={{ marginTop: "28px" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "12px" }}>
              {t.orderTracking.itemsInOrder}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentOrder.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between" style={{ padding: "10px", backgroundColor: "var(--bg-secondary)", borderRadius: "var(--radius-sm)" }}>
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.nameEn} style={{ width: "42px", height: "52px", objectFit: "cover", borderRadius: "4px" }} />
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: "600" }}>{lang === "ta" ? item.nameTa || item.nameEn : item.nameEn}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Size: {item.size} | Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: "700", color: "var(--brand-primary)", fontSize: "0.9rem" }}>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-lg)" }}>
          <AlertCircle size={36} color="var(--brand-primary)" style={{ margin: "0 auto 12px" }} />
          <h3>Order Not Found</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>Please check your Order ID and try again.</p>
        </div>
      )}

    </div>
  );
};
