import React from "react";
import { useApp } from "../../context/AppContext";
import { Home, Grid, Search, Heart, ShoppingBag, User } from "lucide-react";

export const MobileBottomNavigation = () => {
  const { currentView, navigateTo, cart, wishlist, lang } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    {
      id: "home",
      labelEn: "Home",
      labelTa: "முகப்பு",
      icon: Home,
      view: "home",
      payload: {}
    },
    {
      id: "categories",
      labelEn: "Categories",
      labelTa: "வகைகள்",
      icon: Grid,
      view: "catalog",
      payload: { category: null }
    },
    {
      id: "wishlist",
      labelEn: "Wishlist",
      labelTa: "விருப்பம்",
      icon: Heart,
      view: "account",
      payload: { tab: "wishlist" },
      badge: wishlist.length > 0 ? wishlist.length : null
    },
    {
      id: "cart",
      labelEn: "Cart",
      labelTa: "கூடை",
      icon: ShoppingBag,
      view: "cart",
      payload: {},
      badge: totalCartCount > 0 ? totalCartCount : null
    },
    {
      id: "account",
      labelEn: "Account",
      labelTa: "கணக்கு",
      icon: User,
      view: "account",
      payload: { tab: "profile" }
    }
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border-medium)",
        boxShadow: "0 -4px 16px rgba(158, 61, 82, 0.08)",
        display: "none",
        padding: "4px 6px calc(env(safe-area-inset-bottom, 0px) + 4px) 6px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          const label = lang === "ta" ? item.labelTa : item.labelEn;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.view, item.payload)}
              style={{
                position: "relative",
                background: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                color: isActive ? "var(--brand-primary)" : "var(--text-muted)",
                transition: "color var(--transition-fast)"
              }}
            >
              <div style={{ position: "relative" }}>
                <Icon size={26} strokeWidth={isActive ? 2.3 : 1.8} />
                {item.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-10px",
                      backgroundColor: "var(--brand-primary)",
                      color: "#FFFFFF",
                      fontSize: "0.65rem",
                      fontWeight: "700",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: isActive ? "700" : "500",
                  letterSpacing: "0.01em"
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};
