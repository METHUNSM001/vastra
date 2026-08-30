import React from "react";
import { useApp } from "./context/AppContext";
import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
import { WhatsAppFloatingButton } from "./components/common/WhatsAppFloatingButton";
import { MobileBottomNavigation } from "./components/common/MobileBottomNavigation";
import { HeroSection } from "./components/customer/HeroSection";
import { CategorySection } from "./components/customer/CategorySection";
import { ProductCard } from "./components/customer/ProductCard";
import { CatalogView } from "./components/customer/CatalogView";
import { ProductDetailView } from "./components/customer/ProductDetailView";
import { CartView } from "./components/customer/CartView";
import { CheckoutView } from "./components/customer/CheckoutView";
import { OrderConfirmationView } from "./components/customer/OrderConfirmationView";
import { OrderTrackingView } from "./components/customer/OrderTrackingView";
import { AccountView } from "./components/customer/AccountView";
import { AuthView } from "./components/customer/AuthView";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { Sparkles, ArrowRight, Star, Heart, ShoppingBag, ShieldCheck } from "lucide-react";

export function AppContent() {
  const { currentView, lang, t, products, navigateTo } = useApp();

  // If in Admin Portal
  if (currentView === "admin") {
    return <AdminDashboard />;
  }

  // Home Featured Showcases
  const featuredProducts = products.filter((p) => p.isFeatured || p.isNew).slice(0, 6);

  return (
    <div className={`app-root ${lang === "ta" ? "lang-ta" : ""}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-primary)" }}>
      {/* Universal Luxury Header */}
      <Header />

      {/* Main View Router */}
      <div style={{ flex: 1 }}>
        {currentView === "home" && (
          <main>
            {/* Hero Section */}
            <HeroSection />

            {/* Category Showcases */}
            <CategorySection />

            {/* Trending & Festive Featured Products */}
            <section style={{ padding: "20px 0 60px 0" }}>
              <div className="container">
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <span style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--brand-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {lang === "ta" ? "சிறப்பு ஆடைகள்" : "Boutique Highlights"}
                    </span>
                    <h2 className="font-serif" style={{ fontSize: "2rem", color: "var(--text-main)", marginTop: "4px" }}>
                      {lang === "ta" ? "திண்டுக்கல் பிரத்யேக ஆடைகள்" : "Curated Dindigul Collection"}
                    </h2>
                  </div>

                  <button
                    onClick={() => navigateTo("catalog")}
                    className="btn-secondary"
                    style={{ fontSize: "0.88rem" }}
                  >
                    <span>{lang === "ta" ? "அனைத்தையும் காண்க" : "View All Styles"}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div 
                  className="mobile-2-col-grid animate-fade-in"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "24px"
                  }}
                >
                  {featuredProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              </div>
            </section>

            {/* Brand Story Banner */}
            <section style={{ padding: "60px 0", backgroundColor: "#F5ECE6" }}>
              <div className="container" style={{ textAlign: "center", maxWidth: "800px" }}>
                <span style={{ fontSize: "2rem" }}>🌸</span>
                <h2 className="font-serif" style={{ fontSize: "2.2rem", color: "var(--brand-primary)", marginTop: "12px", marginBottom: "14px" }}>
                  "{t.brand.tagline}"
                </h2>
                <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "24px" }}>
                  {t.footer.aboutBrand}
                </p>
                <div className="flex items-center justify-center gap-4" style={{ flexWrap: "wrap" }}>
                  <button onClick={() => navigateTo("catalog")} className="btn-primary">
                    {t.hero.exploreCollection}
                  </button>
                  <button onClick={() => navigateTo("account", { tab: "orders" })} className="btn-secondary">
                    {t.header.myOrders}
                  </button>
                </div>
              </div>
            </section>
          </main>
        )}

        {currentView === "catalog" && <CatalogView />}
        {currentView === "product-detail" && <ProductDetailView />}
        {currentView === "cart" && <CartView />}
        {currentView === "checkout" && <CheckoutView />}
        {currentView === "order-confirmed" && <OrderConfirmationView />}
        {currentView === "order-track" && <OrderTrackingView />}
        {currentView === "account" && <AccountView />}
        {currentView === "auth" && <AuthView />}
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNavigation />

      {/* Universal Floating WhatsApp Concierge */}
      <WhatsAppFloatingButton />

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
