import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  MessageSquare, 
  Sparkles, 
  ChevronRight, 
  Ruler,
  Check
} from "lucide-react";
import { getWhatsAppUrl } from "../../services/razorpay";

export const ProductDetailView = () => {
  const { 
    lang, 
    t, 
    products, 
    selectedProductId, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    navigateTo, 
    reviews, 
    setReviews 
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  // Selected State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "Free Size");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "Standard");
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  // New Review Input
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  if (!product) return null;

  const title = lang === "ta" ? product.nameTa || product.nameEn : product.nameEn;
  const description = lang === "ta" ? product.descriptionTa || product.descriptionEn : product.descriptionEn;
  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;

  const productReviews = reviews.filter((r) => r.productId === product.id || r.productId === "prod-101");

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    navigateTo("cart");
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      author: reviewName,
      city: "Tamil Nadu",
      rating: reviewRating,
      date: new Date().toISOString().split("T")[0],
      commentEn: reviewComment,
      commentTa: reviewComment
    };

    setReviews([newRev, ...reviews]);
    setReviewName("");
    setReviewComment("");
    setShowReviewForm(false);
  };

  // WhatsApp Inquiry Generator
  const waInquiryMessage = `Hi Vastra Lakshnam Dindigul, I'm interested in "${product.nameEn}" (SKU: ${product.sku || product.id}, Price: ₹${product.price}, Size: ${selectedSize}, Color: ${selectedColor}). Can you please share more details?`;

  return (
    <div className="container" style={{ padding: "30px 20px 70px 20px" }}>
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2" style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "24px" }}>
        <button onClick={() => navigateTo("home")} style={{ background: "none", color: "var(--text-secondary)" }}>
          {t.productDetails.home}
        </button>
        <ChevronRight size={14} />
        <button onClick={() => navigateTo("catalog", { category: product.category })} style={{ background: "none", color: "var(--text-secondary)", textTransform: "capitalize" }}>
          {product.category}
        </button>
        <ChevronRight size={14} />
        <span style={{ color: "var(--brand-primary)", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "300px" }}>
          {title}
        </span>
      </div>

      {/* Main PDP Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "48px" }} className="pdp-layout">
        
        {/* Left Column: Image Gallery */}
        <div>
          {/* Large Main Image */}
          <div 
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "120%",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-md)"
            }}
          >
            <img
              src={product.images?.[selectedImageIndex] || product.images?.[0] || product.image}
              alt={title}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />

            {/* Wishlist Floating Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-sm)"
              }}
              title="Add to Wishlist"
            >
              <Heart 
                size={22} 
                color={isWishlisted ? "var(--brand-primary)" : "var(--text-secondary)"} 
                fill={isWishlisted ? "var(--brand-primary)" : "none"} 
              />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3" style={{ marginTop: "14px", overflowX: "auto" }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: "74px",
                    height: "90px",
                    borderRadius: "var(--radius-sm)",
                    overflow: "hidden",
                    border: selectedImageIndex === idx ? "2px solid var(--brand-primary)" : "1px solid var(--border-medium)",
                    padding: "2px",
                    background: "none"
                  }}
                >
                  <img src={img} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                </button>
              ))}
            </div>
          )}

          {/* Quality & Origin Trust Box */}
          <div 
            style={{
              marginTop: "24px",
              padding: "16px 20px",
              backgroundColor: "var(--bg-subtle)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-light)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "0.85rem"
            }}
          >
            <div className="flex items-center gap-2" style={{ color: "var(--brand-primary)", fontWeight: "600" }}>
              <Sparkles size={16} />
              <span>{t.productDetails.authenticityNote}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
              <Truck size={16} />
              <span>{t.productDetails.estimatedDelivery}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div>
          
          {/* Brand & SKU */}
          <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--brand-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Vastra Lakshnam • Dindigul Handloom
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {t.productDetails.productCode}: <strong>{product.sku || product.id}</strong>
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif" style={{ fontSize: "clamp(1.8rem, 2.5vw, 2.3rem)", color: "var(--text-main)", lineHeight: 1.25, marginBottom: "12px" }}>
            {title}
          </h1>

          {/* Ratings & Reviews summary */}
          <div className="flex items-center gap-3" style={{ marginBottom: "18px" }}>
            <div className="flex items-center gap-1" style={{ backgroundColor: "#065F46", color: "#FFFFFF", padding: "3px 8px", borderRadius: "var(--radius-sm)", fontSize: "0.82rem", fontWeight: "700" }}>
              <span>{product.rating}</span>
              <Star size={12} fill="#FFFFFF" />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {product.reviewCount || 45} {lang === "ta" ? "மதிப்புரைகள்" : "Verified Buyer Ratings"}
            </span>
          </div>

          {/* Pricing Box */}
          <div style={{ padding: "16px 20px", backgroundColor: "var(--bg-blush)", borderRadius: "var(--radius-md)", marginBottom: "24px", display: "flex", alignItems: "baseline", gap: "14px" }}>
            <span style={{ fontSize: "2rem", fontWeight: "700", color: "var(--brand-primary)" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span style={{ fontSize: "1.15rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="badge badge-sale" style={{ fontSize: "0.85rem" }}>
                  {product.discount}% {t.catalog.card.off}
                </span>
              </>
            )}
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "auto" }}>
              Inclusive of all taxes
            </span>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
                {t.productDetails.availableColors}: <strong>{selectedColor}</strong>
              </label>
              <div className="flex" style={{ flexWrap: "wrap", gap: "8px" }}>
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: selectedColor === c ? "var(--brand-primary)" : "var(--bg-surface)",
                      color: selectedColor === c ? "#FFFFFF" : "var(--text-main)",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      border: "1.5px solid",
                      borderColor: selectedColor === c ? "var(--brand-primary)" : "var(--border-medium)"
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "var(--text-main)" }}>
                  {t.productDetails.availableSizes}: <strong>{selectedSize}</strong>
                </label>
                <button 
                  onClick={() => setShowSizeModal(true)}
                  style={{ background: "none", color: "var(--brand-primary)", fontSize: "0.82rem", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <Ruler size={14} />
                  <span>{t.productDetails.sizeGuide}</span>
                </button>
              </div>
              <div className="flex" style={{ flexWrap: "wrap", gap: "8px" }}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: selectedSize === s ? "var(--brand-primary)" : "var(--bg-surface)",
                      color: selectedSize === s ? "#FFFFFF" : "var(--text-main)",
                      fontSize: "0.88rem",
                      fontWeight: "600",
                      border: "1.5px solid",
                      borderColor: selectedSize === s ? "var(--brand-primary)" : "var(--border-medium)"
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Stock Status */}
          <div className="flex items-center gap-6" style={{ marginBottom: "28px" }}>
            <div className="flex items-center" style={{ border: "1px solid var(--border-medium)", borderRadius: "var(--radius-full)", padding: "4px 8px", backgroundColor: "#FFFFFF" }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: "32px", height: "32px", background: "none", fontSize: "1.1rem", fontWeight: "600" }}
              >
                -
              </button>
              <span style={{ padding: "0 14px", fontWeight: "700", fontSize: "0.95rem" }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ width: "32px", height: "32px", background: "none", fontSize: "1.1rem", fontWeight: "600" }}
              >
                +
              </button>
            </div>

            {/* Stock status indicator */}
            <div>
              {product.stock > 0 ? (
                <span style={{ color: "#065F46", fontSize: "0.88rem", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Check size={16} />
                  {t.catalog.card.inStock} ({product.stock} items ready)
                </span>
              ) : (
                <span style={{ color: "#991B1B", fontSize: "0.88rem", fontWeight: "600" }}>
                  {t.catalog.card.outOfStock}
                </span>
              )}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pdp-specs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "24px" }}>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="btn-secondary"
              style={{ padding: "14px", fontSize: "1rem" }}
            >
              <ShoppingBag size={18} />
              <span>{addedToast ? (lang === "ta" ? "கூடையில் உள்ளது!" : "Added to Bag!") : t.productDetails.addToCart}</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="btn-primary"
              style={{ padding: "14px", fontSize: "1rem" }}
            >
              {t.productDetails.buyNow}
            </button>
          </div>

          {/* WhatsApp Direct Enquiry Button */}
          <div style={{ marginBottom: "32px" }}>
            <a
              href={getWhatsAppUrl(waInquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ width: "100%" }}
            >
              <MessageSquare size={18} />
              <span>{t.productDetails.chatOnWhatsapp}</span>
            </a>
          </div>

          {/* Product Specifications & Care Tabs */}
          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "14px" }}>
              {lang === "ta" ? "ஆடை விவரங்கள் & துணி ரகம்" : "Product Specifications & Fabric Info"}
            </h3>
            
            <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "18px" }}>
              {description}
            </p>

            <div className="pdp-meta" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem" }}>
              <div style={{ padding: "10px 14px", backgroundColor: "var(--bg-secondary)", borderRadius: "var(--radius-sm)" }}>
                <span style={{ color: "var(--text-muted)", display: "block" }}>{t.productDetails.fabric}</span>
                <strong style={{ color: "var(--text-main)" }}>{product.fabric || "Pure Handloom"}</strong>
              </div>

              <div style={{ padding: "10px 14px", backgroundColor: "var(--bg-secondary)", borderRadius: "var(--radius-sm)" }}>
                <span style={{ color: "var(--text-muted)", display: "block" }}>{t.productDetails.pattern}</span>
                <strong style={{ color: "var(--text-main)" }}>{product.pattern || "Traditional"}</strong>
              </div>

              <div style={{ padding: "10px 14px", backgroundColor: "var(--bg-secondary)", borderRadius: "var(--radius-sm)" }}>
                <span style={{ color: "var(--text-muted)", display: "block" }}>{t.productDetails.fit}</span>
                <strong style={{ color: "var(--text-main)" }}>{product.fit || "Tailored Regular"}</strong>
              </div>

              <div style={{ padding: "10px 14px", backgroundColor: "var(--bg-secondary)", borderRadius: "var(--radius-sm)" }}>
                <span style={{ color: "var(--text-muted)", display: "block" }}>{t.productDetails.care}</span>
                <strong style={{ color: "var(--text-main)" }}>{product.care || "Gentle Hand Wash"}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <div style={{ marginTop: "60px", paddingTop: "40px", borderTop: "1px solid var(--border-light)" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 className="font-serif" style={{ fontSize: "1.7rem", color: "var(--text-main)" }}>
              {t.productDetails.reviews}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              {t.productDetails.basedOn.replace("{count}", productReviews.length)}
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="btn-secondary"
          >
            {t.productDetails.writeReview}
          </button>
        </div>

        {/* Review Form Drawer */}
        {showReviewForm && (
          <form 
            onSubmit={handleAddReview}
            className="animate-fade-in"
            style={{
              backgroundColor: "var(--bg-surface)",
              padding: "24px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-medium)",
              marginBottom: "30px",
              maxWidth: "600px"
            }}
          >
            <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "16px" }}>
              {lang === "ta" ? "உங்கள் மதிப்புரையை பகிரவும்" : "Share your experience"}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "500", display: "block", marginBottom: "4px" }}>
                  {lang === "ta" ? "உங்கள் பெயர்" : "Your Name"}
                </label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Priya"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "500", display: "block", marginBottom: "4px" }}>
                  {lang === "ta" ? "மதிப்பீடு" : "Star Rating"}
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  style={{ width: "100%" }}
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5/5 Exceptional)</option>
                  <option value="4">⭐⭐⭐⭐ (4/5 Great Quality)</option>
                  <option value="3">⭐⭐⭐ (3/5 Average)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "500", display: "block", marginBottom: "4px" }}>
                  {lang === "ta" ? "கருத்து" : "Your Review & Comments"}
                </label>
                <textarea
                  rows="3"
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us about the fabric, fitting and experience..."
                  style={{ width: "100%" }}
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {lang === "ta" ? "மதிப்புரையை வெளியிடு" : "Submit Review"}
                </button>
                <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary">
                  {lang === "ta" ? "ரத்து" : "Cancel"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {productReviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                backgroundColor: "var(--bg-surface)",
                padding: "20px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: "10px" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "0.92rem", color: "var(--text-main)" }}>
                    {rev.author}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {rev.city} • {rev.date}
                  </div>
                </div>
                <div className="flex items-center gap-1" style={{ color: "#F59E0B" }}>
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.5, color: "var(--text-secondary)" }}>
                "{lang === "ta" ? rev.commentTa || rev.commentEn : rev.commentEn}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="glass-panel" style={{ backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "var(--radius-lg)", maxWidth: "540px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
              <h3 className="font-serif" style={{ fontSize: "1.4rem", color: "var(--brand-primary)" }}>
                {t.productDetails.sizeGuide} (Inches)
              </h3>
              <button onClick={() => setShowSizeModal(false)} style={{ background: "none", fontSize: "1.2rem", padding: "4px" }}>✕</button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", marginBottom: "20px" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg-secondary)", textAlign: "left" }}>
                  <th style={{ padding: "8px 12px" }}>Size</th>
                  <th style={{ padding: "8px 12px" }}>Bust (in)</th>
                  <th style={{ padding: "8px 12px" }}>Waist (in)</th>
                  <th style={{ padding: "8px 12px" }}>Hip (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "8px 12px", fontWeight: "600" }}>S</td>
                  <td style={{ padding: "8px 12px" }}>34 - 36</td>
                  <td style={{ padding: "8px 12px" }}>28 - 30</td>
                  <td style={{ padding: "8px 12px" }}>38 - 40</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "8px 12px", fontWeight: "600" }}>M</td>
                  <td style={{ padding: "8px 12px" }}>36 - 38</td>
                  <td style={{ padding: "8px 12px" }}>30 - 32</td>
                  <td style={{ padding: "8px 12px" }}>40 - 42</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "8px 12px", fontWeight: "600" }}>L</td>
                  <td style={{ padding: "8px 12px" }}>38 - 40</td>
                  <td style={{ padding: "8px 12px" }}>32 - 34</td>
                  <td style={{ padding: "8px 12px" }}>42 - 44</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "8px 12px", fontWeight: "600" }}>XL</td>
                  <td style={{ padding: "8px 12px" }}>40 - 42</td>
                  <td style={{ padding: "8px 12px" }}>34 - 36</td>
                  <td style={{ padding: "8px 12px" }}>44 - 46</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 12px", fontWeight: "600" }}>XXL</td>
                  <td style={{ padding: "8px 12px" }}>42 - 44</td>
                  <td style={{ padding: "8px 12px" }}>36 - 38</td>
                  <td style={{ padding: "8px 12px" }}>46 - 48</td>
                </tr>
              </tbody>
            </table>

            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "20px" }}>
              * For sarees, standard 5.5 meters length + 0.8 meter unstitched blouse piece is included.
            </p>

            <button onClick={() => setShowSizeModal(false)} className="btn-primary" style={{ width: "100%" }}>
              Close Size Guide
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .pdp-layout { grid-template-columns: 1fr !important; gap: 30px !important; }
        }
        @media (max-width: 500px) {
          .pdp-specs, .pdp-meta { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  );
};
