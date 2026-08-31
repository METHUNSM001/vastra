import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { ProductCard } from "./ProductCard";
import { Filter, X, SlidersHorizontal, ArrowUpDown, Check, Star } from "lucide-react";

export const CatalogView = () => {
  const { 
    lang, 
    t, 
    products, 
    categories, 
    selectedCategoryFilter, 
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery 
  } = useApp();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(selectedCategoryFilter || "all");
  const [priceRange, setPriceRange] = useState(6000);
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedFabric, setSelectedFabric] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("recommended");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available Filter Options
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
  const fabricOptions = [
    { label: "Silk", query: "silk" },
    { label: "Cotton", query: "cotton" },
    { label: "Georgette", query: "georgette" },
    { label: "Linen", query: "linen" }
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;

      // Category match
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }

      // Search Query match (English + Tamil + fabric)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitleEn = p.nameEn?.toLowerCase().includes(q);
        const matchTitleTa = p.nameTa?.toLowerCase().includes(q);
        const matchFabric = p.fabric?.toLowerCase().includes(q);
        const matchCategory = p.category?.toLowerCase().includes(q);
        if (!matchTitleEn && !matchTitleTa && !matchFabric && !matchCategory) {
          return false;
        }
      }

      // Price limit
      if (p.price > priceRange) {
        return false;
      }

      // Size match
      if (selectedSize !== "all") {
        const hasSize = p.sizes?.some((s) => s.toLowerCase().includes(selectedSize.toLowerCase()));
        if (!hasSize) return false;
      }

      // Fabric match
      if (selectedFabric !== "all") {
        if (!p.fabric?.toLowerCase().includes(selectedFabric.toLowerCase())) {
          return false;
        }
      }

      // Stock check
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      // Rating check
      if (minRating > 0 && (p.rating || 0) < minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "priceLowHigh") return a.price - b.price;
      if (sortBy === "priceHighLow") return b.price - a.price;
      if (sortBy === "highestRated") return b.rating - a.rating;
      if (sortBy === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // recommended
    });
  }, [products, selectedCategory, searchQuery, priceRange, selectedSize, selectedFabric, inStockOnly, minRating, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedCategoryFilter(null);
    setPriceRange(6000);
    setSelectedSize("all");
    setSelectedFabric("all");
    setInStockOnly(false);
    setMinRating(0);
    setSearchQuery("");
    setSortBy("recommended");
  };

  return (
    <div className="container" style={{ padding: "30px 20px 60px 20px" }}>
      
      {/* Top Header & Breadcrumb */}
      <div style={{ marginBottom: "24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: "1.85rem", color: "var(--brand-primary)" }}>
            {selectedCategory !== "all" 
              ? (categories.find(c => c.slug === selectedCategory)?.[lang === "ta" ? "nameTa" : "nameEn"] || t.catalog.title)
              : t.catalog.title}
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            {t.catalog.showing} <strong>{filteredProducts.length}</strong> {t.catalog.productsFound}
            {searchQuery && <span> for "<strong>{searchQuery}</strong>"</span>}
          </p>
        </div>

        {/* Sort & Mobile Filter Buttons */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="mobile-filter-btn btn-secondary"
            style={{ display: "none", padding: "8px 16px", fontSize: "0.85rem" }}
          >
            <SlidersHorizontal size={16} />
            <span>{t.catalog.filterBy}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>
              {t.catalog.sortBy}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "var(--radius-full)", fontSize: "0.85rem", borderColor: "var(--border-medium)" }}
            >
              <option value="recommended">{t.catalog.sortOptions.recommended}</option>
              <option value="newest">{t.catalog.sortOptions.newest}</option>
              <option value="priceLowHigh">{t.catalog.sortOptions.priceLowHigh}</option>
              <option value="priceHighLow">{t.catalog.sortOptions.priceHighLow}</option>
              <option value="highestRated">{t.catalog.sortOptions.highestRated}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "32px" }} className="catalog-layout">
        
        {/* Desktop Sidebar Filter */}
        <aside 
          className="desktop-filter-sidebar"
          style={{
            background: "linear-gradient(180deg, #1b1218 0%, #120d10 100%)",
            padding: "24px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            height: "fit-content",
            position: "sticky",
            top: "140px"
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", color: "#ffb8d3" }}>
              <Filter size={18} color="#ffb8d3" />
              {t.catalog.filterBy}
            </h3>
            <button 
              onClick={clearAllFilters}
              style={{ fontSize: "0.78rem", color: "#ff9ac5", background: "none", fontWeight: "600" }}
            >
              {t.catalog.clearAll}
            </button>
          </div>

          {/* 1. Category Filter */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "#f5e2eb", display: "block", marginBottom: "10px" }}>
              {t.catalog.filters.category}
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <button
                onClick={() => setSelectedCategory("all")}
                style={{
                  textAlign: "left",
                  background: selectedCategory === "all" ? "rgba(255, 152, 197, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  color: selectedCategory === "all" ? "#ffb8d3" : "#d4b5c0",
                  fontWeight: selectedCategory === "all" ? "600" : "400",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.85rem",
                  border: selectedCategory === "all" ? "1px solid rgba(255, 152, 197, 0.3)" : "1px solid transparent",
                  transition: "all 0.3s ease"
                }}
              >
                {lang === "ta" ? "அனைத்து ஆடைகள்" : "All Categories"}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  style={{
                    textAlign: "left",
                    background: selectedCategory === c.slug ? "rgba(255, 152, 197, 0.2)" : "rgba(255, 255, 255, 0.05)",
                    color: selectedCategory === c.slug ? "#ffb8d3" : "#d4b5c0",
                    fontWeight: selectedCategory === c.slug ? "600" : "400",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.85rem",
                    border: selectedCategory === c.slug ? "1px solid rgba(255, 152, 197, 0.3)" : "1px solid transparent",
                    transition: "all 0.3s ease"
                  }}
                >
                  {lang === "ta" ? c.nameTa : c.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Range Slider */}
          <div style={{ marginBottom: "24px" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "#f5e2eb" }}>
                {t.catalog.filters.priceRange}
              </label>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ffb8d3", backgroundColor: "rgba(255, 152, 197, 0.15)", padding: "4px 8px", borderRadius: "4px" }}>
                ₹{priceRange}
              </span>
            </div>
            <input
              type="range"
              min="400"
              max="6000"
              step="200"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#ffb8d3", height: "4px" }}
            />
          </div>

          {/* 3. Sizes */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "#f5e2eb", display: "block", marginBottom: "10px" }}>
              {t.catalog.filters.size}
            </label>
            <div className="flex" style={{ flexWrap: "wrap", gap: "6px" }}>
              {sizeOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? "all" : s)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: selectedSize === s ? "#ffb8d3" : "rgba(255, 255, 255, 0.08)",
                    color: selectedSize === s ? "#171114" : "#d4b5c0",
                    fontSize: "0.8rem",
                    fontWeight: selectedSize === s ? "600" : "500",
                    border: selectedSize === s ? "1px solid #ffb8d3" : "1px solid rgba(255, 255, 255, 0.12)",
                    transition: "all 0.3s ease"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Fabric Types */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "#f5e2eb", display: "block", marginBottom: "8px" }}>
              {t.catalog.filters.fabric}
            </label>
            <div className="flex" style={{ flexWrap: "wrap", gap: "6px" }}>
              {fabricOptions.map((f) => (
                <button
                  key={f.query}
                  onClick={() => setSelectedFabric(selectedFabric === f.query ? "all" : f.query)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: selectedFabric === f.query ? "#ff9ac5" : "rgba(255, 255, 255, 0.08)",
                    color: selectedFabric === f.query ? "#FFFFFF" : "#d4b5c0",
                    fontSize: "0.78rem",
                    fontWeight: selectedFabric === f.query ? "600" : "500",
                    border: selectedFabric === f.query ? "1px solid #ff9ac5" : "1px solid rgba(255, 255, 255, 0.12)",
                    transition: "all 0.3s ease"
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Rating & Availability */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <label className="flex items-center gap-2" style={{ cursor: "pointer", fontSize: "0.85rem", color: "#f5e2eb" }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ accentColor: "#ffb8d3" }}
              />
              <span>{t.catalog.filters.inStockOnly}</span>
            </label>

            <label className="flex items-center gap-2" style={{ cursor: "pointer", fontSize: "0.85rem", color: "#f5e2eb" }}>
              <input
                type="checkbox"
                checked={minRating === 4}
                onChange={(e) => setMinRating(e.target.checked ? 4 : 0)}
                style={{ accentColor: "#ffb8d3" }}
              />
              <span className="flex items-center gap-1">
                <Star size={14} fill="#ff9ac5" color="#ff9ac5" /> {t.catalog.filters.fourStarsUp}
              </span>
            </label>
          </div>

        </aside>

        {/* Products Grid */}
        <main>
          {filteredProducts.length === 0 ? (
            <div 
              style={{
                backgroundColor: "var(--bg-surface)",
                borderRadius: "var(--radius-lg)",
                padding: "60px 20px",
                textAlign: "center",
                border: "1px solid var(--border-light)"
              }}
            >
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "12px" }}>🌸</span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "8px" }}>
                {lang === "ta" ? "பொருந்தக்கூடிய ஆடைகள் ஏதுமில்லை" : "No Products Found"}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                {lang === "ta" ? "உங்கள் தேடல் அல்லது வடிகட்டுதல் அளவுகளை மாற்றி முயற்சிக்கவும்." : "Try adjusting your search terms or clearing filters to see more results."}
              </p>
              <button onClick={clearAllFilters} className="btn-primary">
                {t.catalog.clearAll}
              </button>
            </div>
          ) : (
            <div 
              className="mobile-2-col-grid animate-scale-in"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "24px"
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* Mobile Drawer Filter */}
      {isMobileFilterOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "85%", maxWidth: "340px", height: "100%", background: "linear-gradient(180deg, #1b1218 0%, #120d10 100%)", padding: "24px", overflowY: "auto" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ffb8d3" }}>{t.catalog.filterBy}</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} style={{ background: "none", padding: "4px", color: "#ffb8d3" }}>
                <X size={20} />
              </button>
            </div>
            
            {/* Same filter items in mobile drawer */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", display: "block", marginBottom: "8px", color: "#f5e2eb" }}>{t.catalog.filters.category}</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", backgroundColor: "rgba(255, 255, 255, 0.08)", color: "#f5e2eb", border: "1px solid rgba(255, 255, 255, 0.12)" }}
              >
                <option value="all" style={{ backgroundColor: "#1b1218", color: "#f5e2eb" }}>{lang === "ta" ? "அனைத்து ஆடைகள்" : "All Categories"}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug} style={{ backgroundColor: "#1b1218", color: "#f5e2eb" }}>{lang === "ta" ? c.nameTa : c.nameEn}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
                <label style={{ fontWeight: "600", fontSize: "0.9rem", color: "#f5e2eb" }}>{t.catalog.filters.priceRange}</label>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ffb8d3", backgroundColor: "rgba(255, 152, 197, 0.15)", padding: "4px 8px", borderRadius: "4px" }}>₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="400"
                max="6000"
                step="200"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#ffb8d3" }}
              />
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="btn-primary"
              style={{ width: "100%", marginTop: "24px", background: "linear-gradient(135deg, #ff9ac5 0%, #ffb8d3 100%)", color: "#171114", fontWeight: "700", padding: "12px", borderRadius: "var(--radius-full)", border: "none" }}
            >
              {lang === "ta" ? "முடிவுகளை காண்க" : "Apply & View Results"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .catalog-layout { grid-templateColumns: 1fr !important; }
          .desktop-filter-sidebar { display: none !important; }
          .mobile-filter-btn { display: inline-flex !important; }
        }
      `}</style>

    </div>
  );
};
