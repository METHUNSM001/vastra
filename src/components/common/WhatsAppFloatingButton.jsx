import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { MessageSquare, X, Send } from "lucide-react";
import { getWhatsAppUrl } from "../../services/razorpay";

export const WhatsAppFloatingButton = () => {
  const { lang } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const defaultPrompt = lang === "ta" 
    ? "வணக்கம் வஸ்த்ர லக்ஷ்ணம்! எனக்கு ஆடைகள் தேர்வு செய்ய உதவி வேண்டும்."
    : "Hi Vastra Lakshnam! I need help with choosing an outfit & order details.";

  const handleSendMessage = () => {
    const msgToSend = customMsg.trim() || defaultPrompt;
    window.open(getWhatsAppUrl(msgToSend), "_blank");
    setIsOpen(false);
    setCustomMsg("");
  };

  return (
    <div className="whatsapp-float-container" style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 999 }}>
      
      {/* Floating Action Modal */}
      {isOpen && (
        <div 
          className="animate-fade-in glass-panel"
          style={{
            position: "absolute",
            bottom: "70px",
            right: "0",
            width: "320px",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
            border: "1px solid var(--border-medium)"
          }}
        >
          {/* Header */}
          <div style={{ backgroundColor: "#075E54", color: "#FFFFFF", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="flex items-center gap-2">
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                🌸
              </div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "0.92rem" }}>Vastra Lakshnam Support</div>
                <div style={{ fontSize: "0.72rem", opacity: 0.9 }}>Dindigul Store • Typically replies instantly</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", color: "#FFFFFF", padding: "4px" }}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "16px", backgroundColor: "#ECE5DD" }}>
            <div style={{ backgroundColor: "#FFFFFF", padding: "10px 14px", borderRadius: "10px 10px 10px 0", fontSize: "0.85rem", color: "var(--text-main)", marginBottom: "12px", boxShadow: "var(--shadow-sm)" }}>
              {lang === "ta" 
                ? "வணக்கம்! வஸ்த்ர லக்ஷ்ணம் திண்டுக்கல் குழுவிற்கு வரவேற்கிறோம். புடவைகள், குர்திகள் அல்லது ஆர்டர் விவரங்கள் குறித்து என்ன உதவி தேவை?"
                : "Vanakkam! Welcome to Vastra Lakshnam Dindigul. How can we assist you with sarees, kurti sizes or custom orders today?"}
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder={lang === "ta" ? "உங்கள் கேள்வியை உள்ளிடவும்..." : "Type your message..."}
                style={{ flex: 1, padding: "8px 12px", borderRadius: "var(--radius-full)", fontSize: "0.85rem", border: "1px solid var(--border-medium)" }}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  backgroundColor: "#25D366",
                  color: "#FFFFFF",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="animate-bounce-hover"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#25D366",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(37, 211, 102, 0.45)",
          transition: "transform var(--transition-smooth)"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
        title="Chat on WhatsApp / வாட்ஸ்அப் உதவி"
      >
        <MessageSquare size={28} />
      </button>
    </div>
  );
};
