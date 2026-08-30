import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Heart, ShoppingBag, Eye, Star, Sparkles } from "lucide-react";

export const ProductCard = ({ product, onQuickView }) => {
  const { lang, t, addToCart, wishlist, toggleWishlist, navigateTo } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const title = lang === "ta" ? product.nameTa || product.nameEn : product.nameEn;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, product.sizes?.[0] || "Free Size", product.colors?.[0] || "Standard", 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1800);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, product.sizes?.[0] || "Free Size", product.colors?.[0] || "Standard", 1);
    navigateTo("cart");
  };

  return (
    <div 
      className="product-card"
      onClick={() => navigateTo("product-detail", { productId: product.id })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "4px",
        overflow: "hidden",
        border: "1px solid var(--border-light)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        height: "100%"
      }}
    >
      {/* Product Image Section */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", backgroundColor: "#F9F5F2", overflow: "hidden" }}>
        <img
          src={product.images?.[0] || product.image}
          alt={title}
          loading="lazy"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            border: "none",
            color: isWishlisted ? "#FF4242" : "#9E9E9E"
          }}
        >
          <Heart 
            size={16} 
            fill={isWishlisted ? "#FF4242" : "none"} 
          />
        </button>

        {/* Stock Alert Label */}
        {isLowStock && (
          <div style={{ position: "absolute", bottom: "0", left: "0", width: "100%", backgroundColor: "rgba(255, 235, 238, 0.9)", color: "#D32F2F", fontSize: "0.7rem", fontWeight: "600", padding: "4px 8px", textAlign: "center" }}>
            Only {product.stock} left
          </div>
        )}
      </div>

      {/* Product Details Section (Meesho/Flipkart Style) */}
      <div style={{ padding: "8px 8px 12px 8px", display: "flex", flexDirection: "column", flex: 1 }}>
        
        {/* Title */}
        <div style={{ fontSize: "0.85rem", color: "#212121", lineHeight: 1.3, marginBottom: "4px", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", fontWeight: "500" }}>
          {title}
        </div>

        {/* Rating Pill */}
        <div className="flex items-center gap-1" style={{ marginBottom: "6px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "2px", backgroundColor: "#388E3C", color: "#FFFFFF", padding: "2px 6px", borderRadius: "12px", fontSize: "0.68rem", fontWeight: "700" }}>
            <span>{product.rating}</span>
            <Star size={10} fill="#FFFFFF" />
          </div>
          <span style={{ fontSize: "0.68rem", color: "#757575" }}>
            ({product.reviewCount || 30})
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2" style={{ marginBottom: "2px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "1rem", fontWeight: "700", color: "#212121" }}>
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span style={{ fontSize: "0.75rem", color: "#757575", textDecoration: "line-through" }}>
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          {product.discount > 0 && (
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#388E3C" }}>
              {product.discount}% off
            </span>
          )}
        </div>

        {/* Delivery / Shipping Tag */}
        <div style={{ fontSize: "0.7rem", color: "#424242", marginTop: "4px", fontWeight: "500" }}>
          Free Delivery
        </div>
      </div>
    </div>
  );
};
