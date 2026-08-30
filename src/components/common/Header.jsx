import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  Globe, 
  PhoneCall,
  Sparkles,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { getWhatsAppUrl } from "../../services/razorpay";

export const Header = () => {
  const { 
    lang, 
    t, 
    toggleLanguage, 
    theme,
    toggleTheme,
    cart, 
    wishlist, 
    navigateTo, 
    categories, 
    searchQuery, 
    setSearchQuery,
    isAdminLoggedIn,
    currentUser,
    logoutUser
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery || "");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setShowSearchDropdown(false);
      navigateTo("catalog", { searchQuery: searchInput.trim(), category: null });
    }
  };

  const quickSearchTags = [
    { labelEn: "Silk Sarees", labelTa: "பட்டு புடவைகள்", query: "silk" },
    { labelEn: "Cotton Kurti", labelTa: "காட்டன் குர்தி", query: "cotton" },
    { labelEn: "Anarkali Dress", labelTa: "அனார்கலி", query: "anarkali" },
    { labelEn: "Leggings", labelTa: "லெக்கின்ஸ்", query: "legging" }
  ];

  return (
    <header 
      className="header-wrapper" 
      style={{ 
        position: "sticky", 
        top: 0, 
        zIndex: 100, 
        backgroundColor: "var(--bg-surface)", 
        boxShadow: "0 2px 12px rgba(158, 61, 82, 0.05)",
        WebkitBoxShadow: "0 2px 12px rgba(158, 61, 82, 0.05)"
      }}
    >
      {/* Top Announcement Bar - Hidden on Mobile */}
      <div 
        className="announcement-bar" 
        style={{ 
          backgroundColor: "var(--brand-primary)", 
          color: "#FFFFFF", 
          padding: "6px 16px", 
          fontSize: "0.82rem", 
          fontWeight: "500", 
          textAlign: "center", 
          letterSpacing: "0.02em",
          display: "none"
        }}
      >
        <div className="container flex items-center justify-between" style={{ justifyContent: "center", gap: "16px" }}>
          <span>{t.header.freeShippingNotice}</span>
          <div style={{ display: "none", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.78rem", opacity: 0.9 }}>Dindigul Care: +91 94884 12345</span>
          </div>
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .announcement-bar {
              display: block !important;
            }
          }
        `}</style>
      </div>

      {/* Main Navigation Bar */}
      <div className="header-main-padding container" style={{ padding: "10px 14px" }}>
        <div className="flex items-center justify-between gap-2" style={{ minHeight: "48px" }}>
          
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="mobile-menu-btn"
              style={{ display: "block", background: "none", color: "var(--text-main)", padding: "4px", border: "none" }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Brand Logo & Tagline */}
            <div 
              onClick={() => navigateTo("home")} 
              style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img src="/logo.png" alt="Vastra Lakshnam Logo" style={{ height: "40px", width: "auto", borderRadius: "4px" }} onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/9E3D52/FFF?text=VL" }} />
                <span className="brand-logo-text font-serif" style={{ fontSize: "1.65rem", fontWeight: "700", color: "var(--brand-primary)", letterSpacing: "0.03em", lineHeight: 1.1 }}>
                  {lang === "ta" ? "வஸ்த்ர லக்ஷ்ணம்" : "Vastra Lakshnam"}
                </span>
              </div>
              <span className="brand-logo-tagline" style={{ fontSize: "0.72rem", color: "var(--brand-secondary)", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: "30px" }}>
                {lang === "ta" ? "திண்டுக்கல் பிராண்ட்" : "Dindigul • Boutique Fashion"}
              </span>
            </div>
          </div>

          {/* Center: Search Bar with Suggestions */}
          <div 
            style={{ 
              flex: 1, 
              maxWidth: "520px", 
              position: "relative",
              display: "none"
            }} 
            className="desktop-search-container"
          >
            <form onSubmit={handleSearchSubmit} style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder={t.header.searchPlaceholder}
                style={{
                  width: "100%",
                  padding: "10px 42px 10px 18px",
                  borderRadius: "var(--radius-full)",
                  border: "1.5px solid var(--border-medium)",
                  backgroundColor: "var(--bg-subtle)",
                  fontSize: "0.9rem"
                }}
              />
              <button 
                type="submit" 
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", color: "var(--brand-primary)", padding: "4px" }}
              >
                <Search size={18} />
              </button>
            </form>

            {/* Quick Suggestions Dropdown */}
            {showSearchDropdown && (
              <div 
                style={{
                  position: "absolute",
                  top: "105%",
                  left: 0,
                  right: 0,
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-lg)",
                  border: "1px solid var(--border-light)",
                  padding: "12px 16px",
                  zIndex: 200
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase" }}>
                  {lang === "ta" ? "பிரபலமான தேடல்கள்" : "Trending Searches"}
                </div>
                <div className="flex" style={{ flexWrap: "wrap", gap: "8px" }}>
                  {quickSearchTags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchInput(tag.query);
                        setShowSearchDropdown(false);
                        navigateTo("catalog", { searchQuery: tag.query, category: null });
                      }}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-main)",
                        fontSize: "0.82rem",
                        border: "1px solid var(--border-medium)",
                        cursor: "pointer"
                      }}
                    >
                      {lang === "ta" ? tag.labelTa : tag.labelEn}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setShowSearchDropdown(false)}
                  style={{ display: "block", marginTop: "10px", fontSize: "0.75rem", color: "var(--brand-primary)", background: "none", cursor: "pointer" }}
                >
                  {lang === "ta" ? "மூடுக" : "Close"}
                </button>
              </div>
            )}

            <style>{`
              @media (min-width: 1024px) {
                .desktop-search-container {
                  display: block !important;
                }
              }
            `}</style>
          </div>

          {/* Right Actions: Language Switcher, Wishlist, Account, Cart */}
          <div className="flex items-center gap-2 header-actions" style={{ justifyContent: "flex-end", flexWrap: "nowrap" }}>

            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                padding: "6px",
                borderRadius: "50%",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-main)",
                cursor: "pointer"
              }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {/* Language Switcher Pill - Hidden on Mobile */}
            <button
              onClick={() => toggleLanguage()}
              className="hide-on-mobile-header"
              style={{
                display: "none",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                border: "1.5px solid var(--brand-secondary)",
                backgroundColor: "var(--bg-subtle)",
                color: "var(--text-main)",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                minHeight: "36px"
              }}
              title="Switch Language / மொழியை மாற்ற"
            >
              <Globe size={14} color="var(--brand-primary)" />
              <span className="desktop-only-text">{lang === "en" ? "தமிழ்" : "English"}</span>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => navigateTo("account", { tab: "wishlist" })}
              style={{ 
                position: "relative", 
                background: "none", 
                padding: "6px", 
                color: "var(--text-main)",
                cursor: "pointer",
                display: "none",
                minHeight: "36px",
                minWidth: "36px",
                alignItems: "center",
                justifyContent: "center"
              }}
              title={t.header.wishlist}
              className="hide-on-mobile-header"
            >
              <Heart size={20} color={wishlist.length > 0 ? "var(--brand-primary)" : "currentColor"} fill={wishlist.length > 0 ? "var(--brand-primary)" : "none"} />
              {wishlist.length > 0 && (
                <span 
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    backgroundColor: "var(--brand-primary)",
                    color: "#FFFFFF",
                    fontSize: "0.65rem",
                    fontWeight: "700",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon - Visible on All Sizes */}
            <button
              onClick={() => navigateTo("cart")}
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "var(--bg-secondary)",
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                color: "var(--brand-primary)",
                fontWeight: "600",
                fontSize: "0.85rem",
                cursor: "pointer",
                border: "none",
                minHeight: "36px"
              }}
              title={t.header.cart}
            >
              <ShoppingBag size={18} />
              <span className="desktop-only-text">{t.header.cart}</span>
              {totalCartCount > 0 && (
                <span 
                  style={{
                    backgroundColor: "var(--brand-primary)",
                    color: "#FFFFFF",
                    fontSize: "0.65rem",
                    fontWeight: "700",
                    padding: "1px 5px",
                    borderRadius: "var(--radius-full)"
                  }}
                >
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Account / Login Button */}
            {currentUser ? (
              <button
                onClick={() => navigateTo("account")}
                className="hide-on-mobile-header"
                style={{
                  display: "none",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--bg-blush)",
                  border: "1px solid var(--border-medium)",
                  color: "var(--brand-primary)",
                  fontWeight: "600",
                  fontSize: "0.85rem"
                }}
                title={`Logged in as ${currentUser.name}`}
              >
                <User size={16} />
                <span className="desktop-only-text">
                  {currentUser.name ? currentUser.name.split(" ")[0] : "Account"}
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo("auth")}
                className="hide-on-mobile-header"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--bg-subtle)",
                  border: "1px solid var(--border-medium)",
                  color: "var(--text-main)",
                  fontWeight: "600",
                  fontSize: "0.85rem"
                }}
                title={lang === "ta" ? "உள்நுழைய / பதிவு செய்ய" : "Sign In / Register"}
              >
                <User size={16} />
                <span className="desktop-only-text">{lang === "ta" ? "உள்நுழைக" : "Sign In"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Links Subnav */}
      <nav className="category-subnav" style={{ borderTop: "1px solid var(--border-light)", backgroundColor: "var(--bg-surface)" }}>
        <div className="container flex items-center justify-between" style={{ overflowX: "auto", whiteSpace: "nowrap", padding: "8px 20px" }}>
          <div className="flex items-center gap-6" style={{ fontSize: "0.9rem", fontWeight: "500" }}>
            <button 
              onClick={() => navigateTo("home")}
              style={{ background: "none", color: "var(--text-main)", padding: "6px 0", borderBottom: "2px solid transparent" }}
            >
              {t.nav.home}
            </button>
            <button 
              onClick={() => navigateTo("catalog", { category: null })}
              style={{ background: "none", color: "var(--brand-primary)", fontWeight: "600", padding: "6px 0" }}
            >
              ✨ {t.nav.allProducts}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigateTo("catalog", { category: cat.slug })}
                style={{ background: "none", color: "var(--text-secondary)", padding: "6px 0" }}
              >
                {lang === "ta" ? cat.nameTa : cat.nameEn}
              </button>
            ))}
          </div>

          {/* Direct WhatsApp Ordering Assistance Link */}
          <a 
            href={getWhatsAppUrl("Hi Vastra Lakshnam Dindigul! I'd like some help choosing an outfit from your store.")}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#128C7E",
              fontSize: "0.82rem",
              fontWeight: "600"
            }}
          >
            <PhoneCall size={14} />
            <span>{lang === "ta" ? "வாட்ஸ்அப் உதவி: 94884 12345" : "WhatsApp: 94884 12345"}</span>
          </a>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.5)", display: "flex" }}>
          <div className="animate-fade-in" style={{ width: "80%", maxWidth: "300px", height: "100%", backgroundColor: "var(--bg-surface)", padding: "24px 20px", overflowY: "auto", boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img src="/logo.png" alt="Logo" style={{ height: "30px", width: "auto", borderRadius: "4px" }} onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/9E3D52/FFF?text=VL" }} />
                <span className="font-serif" style={{ fontSize: "1.3rem", fontWeight: "700", color: "var(--brand-primary)" }}>Menu</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: "none", color: "var(--text-main)", padding: "4px" }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Profile & Language inside menu */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); navigateTo(currentUser ? "account" : "auth"); }}
                  style={{ flex: 1, padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-secondary)", color: "var(--brand-primary)", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <User size={18} />
                  <span style={{ fontSize: "0.85rem" }}>{currentUser ? (currentUser.name ? currentUser.name.split(" ")[0] : "Account") : (lang === "ta" ? "உள்நுழைக" : "Sign In")}</span>
                </button>
                <button
                  onClick={() => toggleLanguage()}
                  style={{ padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--brand-secondary)", backgroundColor: "var(--bg-surface)", color: "var(--text-main)", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Globe size={18} color="var(--brand-primary)" />
                  <span style={{ fontSize: "0.85rem" }}>{lang === "en" ? "தமிழ்" : "EN"}</span>
                </button>
              </div>

              {/* Navigation Links */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <button onClick={() => { setIsMobileMenuOpen(false); navigateTo("home"); }} style={{ textAlign: "left", padding: "12px 10px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-subtle)", fontWeight: "600" }}>{t.nav.home}</button>
                <button onClick={() => { setIsMobileMenuOpen(false); navigateTo("catalog", { category: null }); }} style={{ textAlign: "left", padding: "12px 10px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-subtle)", fontWeight: "600", color: "var(--brand-primary)" }}>✨ {t.nav.allProducts}</button>
                
                <div style={{ padding: "12px 10px 4px 10px", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "700", marginTop: "8px", letterSpacing: "0.05em" }}>CATEGORIES</div>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => { setIsMobileMenuOpen(false); navigateTo("catalog", { category: cat.slug }); }} style={{ textAlign: "left", padding: "10px 10px", fontWeight: "500", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                    {lang === "ta" ? cat.nameTa : cat.nameEn}
                  </button>
                ))}
              </div>

              {/* Support */}
              <div style={{ marginTop: "16px", paddingTop: "20px", borderTop: "1px solid var(--border-light)" }}>
                <a 
                  href={getWhatsAppUrl("Hi Vastra Lakshnam! Need help.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", backgroundColor: "#E8F5E9", color: "#128C7E", borderRadius: "var(--radius-sm)", fontWeight: "600" }}
                >
                  <PhoneCall size={18} />
                  <span>{lang === "ta" ? "வாட்ஸ்அப் உதவி" : "WhatsApp Support"}</span>
                </a>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }} onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
