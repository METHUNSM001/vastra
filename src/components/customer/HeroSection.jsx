import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Sparkles, ArrowRight, ShieldCheck, Truck, Award, Heart } from "lucide-react";
import { getWhatsAppUrl } from "../../services/razorpay";

export const HeroSection = () => {
  const { lang, t, banners, navigateTo } = useApp();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const activeBanners = banners.filter((b) => b.isActive);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const activeBanner = activeBanners[currentBannerIndex] || activeBanners[0];

  return (
    <section style={{ padding: "12px 0 32px 0" }}>
      <div className="container">
        
        {/* Main Hero Card */}
        <div 
          style={{
            position: "relative",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            backgroundColor: "var(--bg-surface)",
            minHeight: "360px",
            display: "flex",
            alignItems: "center",
            boxShadow: "var(--shadow-md)"
          }}
          className="hero-card"
        >
          {/* Background Image with Gentle Gradient Overlay */}
          <div 
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "60%",
              backgroundImage: `url(${activeBanner?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'})`,
              backgroundSize: "cover",
              backgroundPosition: "center 20%",
              transition: "background-image 0.8s ease-in-out"
            }}
            className="hero-bg-image"
          />

          {/* Soft Left Gradient Mask */}
          <div 
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              background: "linear-gradient(90deg, var(--bg-surface) 0%, var(--bg-surface) 45%, var(--bg-secondary) 60%, var(--bg-subtle) 100%)"
            }}
            className="hero-gradient-overlay"
          />

          {/* Hero Content */}
          <div 
            className="animate-fade-in hero-content"
            style={{
              position: "relative",
              zIndex: 10,
              maxWidth: "600px",
              padding: "32px 24px"
            }}
          >
            {/* Tagline Pill */}
            <div 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--bg-blush)",
                border: "1px solid var(--border-medium)",
                color: "var(--brand-primary)",
                fontSize: "0.75rem",
                fontWeight: "600",
                marginBottom: "12px"
              }}
            >
              <Sparkles size={12} />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Heading */}
            <h1 
              className="font-serif"
              style={{
                fontSize: "clamp(1.5rem, 4.5vw, 3rem)",
                lineHeight: 1.15,
                fontWeight: "700",
                color: "var(--text-main)",
                marginBottom: "12px",
                letterSpacing: "-0.01em",
                textAlign: "left",
                width: "100%"
              }}
            >
              {lang === "ta" 
                ? (activeBanner?.titleTa || t.hero.title) 
                : (activeBanner?.titleEn || t.hero.title)}
            </h1>

            {/* Subtitle */}
            <p 
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.5,
                color: "var(--text-main)",
                marginBottom: "18px",
                maxWidth: "480px",
                textAlign: "left"
              }}
            >
              {lang === "ta" 
                ? (activeBanner?.subtitleTa || t.hero.subtitle) 
                : (activeBanner?.subtitleEn || t.hero.subtitle)}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 hero-action-buttons" style={{ flexWrap: "wrap" }}>
              <button
                onClick={() => navigateTo("catalog", { category: activeBanner?.targetCategory || null })}
                className="btn-primary"
              >
                <span>{lang === "ta" ? (activeBanner?.buttonTextTa || t.hero.shopNow) : (activeBanner?.buttonTextEn || t.hero.shopNow)}</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => navigateTo("catalog", { category: null })}
                className="btn-secondary"
              >
                {t.hero.exploreCollection}
              </button>

              <a
                href={getWhatsAppUrl("Hi Vastra Lakshnam! I want to explore your latest collection.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ fontSize: "0.88rem", padding: "10px 18px" }}
              >
                <span>{t.hero.whatsappAssistance}</span>
              </a>
            </div>

            {/* Dindigul Handcrafted Guarantee */}
            <div className="flex items-center gap-6 hero-guarantee" style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid var(--border-light)", fontSize: "0.82rem", color: "var(--text-main)", display: "flex", alignItems: "center", flexWrap: "wrap" }}>
              <div className="flex items-center gap-2" style={{ color: "var(--text-main)", minWidth: 0 }}>
                <Award size={16} color="currentColor" />
                <span style={{ color: "var(--text-main)" }}>{t.hero.features.dindigulHeritage}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: "var(--text-main)", minWidth: 0 }}>
                <ShieldCheck size={16} color="currentColor" />
                <span style={{ color: "var(--text-main)" }}>{t.hero.features.pureFabric}</span>
              </div>
            </div>

          </div>

          {/* Banner Dots */}
          {activeBanners.length > 1 && (
            <div style={{ position: "absolute", bottom: "16px", right: "24px", display: "flex", gap: "8px", zIndex: 20 }}>
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  style={{
                    width: currentBannerIndex === idx ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor: currentBannerIndex === idx ? "var(--brand-primary)" : "rgba(158, 61, 82, 0.3)",
                    border: "none",
                    transition: "all var(--transition-fast)"
                  }}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-card {
            min-height: auto !important;
            padding: 18px 0 20px !important;
          }
          .hero-bg-image { width: 100% !important; opacity: 0.22; }
          .hero-gradient-overlay { background: linear-gradient(180deg, rgba(255, 247, 250, 0.96) 0%, rgba(255, 247, 250, 0.92) 68%, rgba(255, 247, 250, 0.9) 100%) !important; }
          .hero-content {
            width: 100% !important;
            max-width: 100% !important;
            padding: 8px 16px 0 !important;
            z-index: 2 !important;
          }
          .hero-action-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
            margin-top: 8px !important;
          }
          .hero-action-buttons > * {
            width: 100% !important;
            justify-content: center !important;
            display: inline-flex !important;
          }
          .hero-guarantee {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
            margin-top: 18px !important;
            padding-top: 14px !important;
          }
        }
      `}</style>
    </section>
  );
};
