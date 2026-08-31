import React from "react";
import { useApp } from "../../context/AppContext";
import { Phone, Mail, MapPin, Heart, ShieldCheck, Truck, RefreshCw, MessageSquare } from "lucide-react";
import { getWhatsAppUrl } from "../../services/razorpay";

export const Footer = () => {
  const { lang, t, navigateTo, categories } = useApp();

  return (
    <footer style={{ background: "linear-gradient(180deg, #1b1216 0%, #120d10 100%)", color: "#F7EBE8", marginTop: "60px", paddingTop: "50px", paddingBottom: "30px", borderTop: "3px solid var(--brand-secondary)" }}>
      
      {/* Value Proposition Highlights */}
      <div className="container" style={{ paddingBottom: "40px", borderBottom: "1px solid rgba(247, 235, 232, 0.12)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
          
          <div className="flex items-center gap-3">
            <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(212, 163, 115, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-secondary)" }}>
              <Truck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "#FFFFFF" }}>{lang === "ta" ? "இலவச விரைவு டெலிவரி" : "Fast Delivery"}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(247, 235, 232, 0.7)" }}>{lang === "ta" ? "₹999-க்கு மேல் இலவசம்" : "Free over ₹999 across TN"}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(212, 163, 115, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-secondary)" }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "#FFFFFF" }}>{lang === "ta" ? "பாதுகாப்பான கட்டணம்" : "100% Razorpay Safe"}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(247, 235, 232, 0.7)" }}>{lang === "ta" ? "UPI, கார்டுகள் & NetBanking" : "UPI, Cards & NetBanking"}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(212, 163, 115, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-secondary)" }}>
              <RefreshCw size={24} />
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "#FFFFFF" }}>{lang === "ta" ? "எளிதான மாற்று வசதி" : "7-Day Easy Exchange"}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(247, 235, 232, 0.7)" }}>{lang === "ta" ? "நிபந்தனையற்ற வாடிக்கையாளர் திருப்தி" : "Guaranteed fabric satisfaction"}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "rgba(212, 163, 115, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-secondary)" }}>
              <MessageSquare size={24} />
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "#FFFFFF" }}>{lang === "ta" ? "வாட்ஸ்அப் ஆதரவு" : "WhatsApp Ordering"}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(247, 235, 232, 0.7)" }}>{lang === "ta" ? "திண்டுக்கல் நேரடி உதவி" : "+91 94884 12345"}</div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "36px" }}>
          
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
              <span style={{ fontSize: "1.6rem" }}>🌸</span>
              <span className="font-serif" style={{ fontSize: "1.6rem", fontWeight: "700", color: "#FFFFFF", letterSpacing: "0.02em" }}>
                {lang === "ta" ? "வஸ்த்ர லக்ஷ்ணம்" : "Vastra Lakshnam"}
              </span>
            </div>
            <div style={{ fontStyle: "italic", color: "var(--brand-secondary)", fontSize: "0.92rem", marginBottom: "14px" }}>
              "{t.brand.tagline}"
            </div>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(247, 235, 232, 0.75)", marginBottom: "20px" }}>
              {t.footer.aboutBrand}
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://www.instagram.com/vastralakshnam/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  backgroundColor: "rgba(255,255,255,0.08)", 
                  padding: "8px 14px", 
                  borderRadius: "var(--radius-full)",
                  color: "#FFFFFF",
                  fontSize: "0.82rem",
                  border: "1px solid rgba(255,255,255,0.15)"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>@vastralakshnam</span>
              </a>
              <a 
                href={getWhatsAppUrl("Hi Vastra Lakshnam! I'm reaching out from your website.")}
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  backgroundColor: "#25D366", 
                  padding: "8px 14px", 
                  borderRadius: "var(--radius-full)",
                  color: "#FFFFFF",
                  fontSize: "0.82rem",
                  fontWeight: "600"
                }}
              >
                <MessageSquare size={16} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "1.05rem", marginBottom: "18px", letterSpacing: "0.02em" }}>
              {t.footer.quickLinks}
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem" }}>
              <li>
                <button onClick={() => navigateTo("home")} style={{ background: "none", color: "rgba(247, 235, 232, 0.75)" }}>
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("catalog", { category: null })} style={{ background: "none", color: "rgba(247, 235, 232, 0.75)" }}>
                  {t.nav.newArrivals}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("account", { tab: "orders" })} style={{ background: "none", color: "rgba(247, 235, 232, 0.75)" }}>
                  {t.header.myOrders}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("account", { tab: "track" })} style={{ background: "none", color: "rgba(247, 235, 232, 0.75)" }}>
                  {t.orderTracking.title}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("admin")} style={{ background: "none", color: "var(--brand-secondary)" }}>
                  🔒 {t.nav.adminPortal}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "1.05rem", marginBottom: "18px", letterSpacing: "0.02em" }}>
              {t.footer.categories}
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem" }}>
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button 
                    onClick={() => navigateTo("catalog", { category: cat.slug })}
                    style={{ background: "none", color: "rgba(247, 235, 232, 0.75)" }}
                  >
                    {lang === "ta" ? cat.nameTa : cat.nameEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Dindigul Store Location & Support */}
          <div>
            <h4 style={{ color: "#FFFFFF", fontSize: "1.05rem", marginBottom: "18px", letterSpacing: "0.02em" }}>
              {t.footer.contactUs}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.88rem", color: "rgba(247, 235, 232, 0.75)" }}>
              <div className="flex items-center gap-3">
                <MapPin size={18} color="var(--brand-secondary)" />
                <span>{t.footer.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} color="var(--brand-secondary)" />
                <span>{t.footer.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} color="var(--brand-secondary)" />
                <span>{t.footer.email}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ borderTop: "1px solid rgba(247, 235, 232, 0.08)", paddingTop: "20px", textAlign: "center", fontSize: "0.8rem", color: "rgba(247, 235, 232, 0.5)" }}>
        <p className="container">{t.footer.copyright}</p>
      </div>
    </footer>
  );
};
