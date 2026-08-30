import React from "react";
import { useApp } from "../../context/AppContext";
import { ArrowRight } from "lucide-react";

export const CategorySection = () => {
  const { lang, t, categories, navigateTo } = useApp();

  return (
    <section style={{ padding: "30px 0 50px 0" }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--brand-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {lang === "ta" ? "நேர்த்தியான தெரிவுகள்" : "Curated Fashion"}
          </span>
          <h2 className="font-serif" style={{ fontSize: "2rem", color: "var(--text-main)", marginTop: "4px" }}>
            {t.categories.title}
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "6px", maxWidth: "600px", margin: "6px auto 0" }}>
            {t.categories.subtitle}
          </p>
        </div>

        {/* Category Grid */}
        <div 
          className="mobile-2-col-grid animate-scale-in"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "20px"
          }}
        >
          {categories.map((cat) => {
            const name = lang === "ta" ? cat.nameTa : cat.nameEn;

            return (
              <div
                key={cat.id}
                onClick={() => navigateTo("catalog", { category: cat.slug })}
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  border: "1px solid var(--border-light)",
                  boxShadow: "var(--shadow-sm)",
                  cursor: "pointer",
                  transition: "all var(--transition-smooth)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  paddingBottom: "14px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.borderColor = "var(--brand-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  e.currentTarget.style.borderColor = "var(--border-light)";
                }}
              >
                {/* Round Category Image */}
                <div style={{ width: "100%", paddingTop: "100%", position: "relative", overflow: "hidden", backgroundColor: "#F5EFEB" }}>
                  <img
                    src={cat.image}
                    alt={name}
                    loading="lazy"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease"
                    }}
                  />
                </div>

                {/* Category Details */}
                <div style={{ padding: "12px 10px 0 10px", width: "100%" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "4px" }}>
                    {name}
                  </h3>
                  <span style={{ fontSize: "0.78rem", color: "var(--brand-primary)", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                    {t.categories.explore} <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
