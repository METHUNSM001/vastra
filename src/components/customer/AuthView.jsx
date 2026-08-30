import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck,
  KeyRound,
  ArrowLeft
} from "lucide-react";

export const AuthView = ({ defaultMode = "login", redirectView = "account", onSuccess }) => {
  const { 
    lang, 
    t, 
    loginUser, 
    registerUser, 
    resetUserPassword, 
    navigateTo,
    currentUser
  } = useApp();

  const [mode, setMode] = useState(defaultMode); // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regCity, setRegCity] = useState("Dindigul");
  const [regPincode, setRegPincode] = useState("624001");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: null, message: "" });

    if (!loginEmail || !loginPassword) {
      setFeedback({ 
        type: "error", 
        message: lang === "ta" ? "மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்." : "Please enter your email and password." 
      });
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(loginEmail.trim(), loginPassword);
      if (res.success) {
        setFeedback({ 
          type: "success", 
          message: lang === "ta" ? "வெற்றிகரமாக உள்நுழைந்துவிட்டீர்கள்! 🌸" : "Welcome back! Login successful. 🌸" 
        });
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else navigateTo(redirectView || "account");
        }, 600);
      } else {
        setFeedback({ 
          type: "error", 
          message: res.message || (lang === "ta" ? "உள்நுழைவு தோல்வியடைந்தது. விவரங்களை சரிபார்க்கவும்." : "Login failed. Please check credentials.") 
        });
      }
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: null, message: "" });

    if (!regFullName || !regEmail || !regPhone || !regPassword) {
      setFeedback({ 
        type: "error", 
        message: lang === "ta" ? "அனைத்து தேவையான விவரங்களையும் நிரப்பவும்." : "Please complete all required fields." 
      });
      return;
    }

    if (regPhone.length < 10) {
      setFeedback({ 
        type: "error", 
        message: lang === "ta" ? "சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்." : "Please enter a valid 10-digit mobile number." 
      });
      return;
    }

    if (regPassword.length < 6) {
      setFeedback({ 
        type: "error", 
        message: lang === "ta" ? "கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்." : "Password must be at least 6 characters long." 
      });
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setFeedback({ 
        type: "error", 
        message: lang === "ta" ? "கடவுச்சொற்கள் பொருந்தவில்லை." : "Passwords do not match." 
      });
      return;
    }

    if (!agreeTerms) {
      setFeedback({ 
        type: "error", 
        message: lang === "ta" ? "விதிமுறைகளை ஏற்கவும்." : "Please agree to the terms & conditions." 
      });
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        fullName: regFullName.trim(),
        email: regEmail.trim().toLowerCase(),
        phone: regPhone.trim(),
        password: regPassword,
        city: regCity.trim() || "Dindigul",
        pincode: regPincode.trim() || "624001"
      });

      if (res.success) {
        setFeedback({ 
          type: "success", 
          message: res.message || (lang === "ta" ? "கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! 🌸" : "Account registered successfully! 🌸") 
        });
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else navigateTo(redirectView || "account");
        }, 800);
      } else {
        setFeedback({ 
          type: "error", 
          message: res.message || (lang === "ta" ? "பதிவு தோல்வியடைந்தது." : "Registration failed. Try a different email.") 
        });
      }
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Registration error." });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: null, message: "" });

    if (!forgotEmail) {
      setFeedback({ 
        type: "error", 
        message: lang === "ta" ? "உங்கள் மின்னஞ்சலை உள்ளிடவும்." : "Please enter your registered email." 
      });
      return;
    }

    setLoading(true);
    try {
      const res = await resetUserPassword(forgotEmail.trim());
      if (res.success) {
        setFeedback({ 
          type: "success", 
          message: lang === "ta" ? "கடவுச்சொல் மீட்டமைப்பு இணைப்பு உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டது!" : "Password reset instructions sent to your email!" 
        });
      } else {
        setFeedback({ type: "error", message: res.message || "Failed to send reset link." });
      }
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Error processing request." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 16px 80px 16px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div 
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 10px 40px rgba(128, 28, 59, 0.08)",
          border: "1px solid var(--border-light)",
          overflow: "hidden"
        }}
      >
        {/* Brand Banner Header */}
        <div 
          style={{
            background: "linear-gradient(135deg, var(--brand-primary) 0%, #68152c 100%)",
            color: "#FFFFFF",
            padding: "28px 24px",
            textAlign: "center",
            position: "relative"
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "1.6rem" }}>🌸</span>
            <span className="font-serif" style={{ fontSize: "1.5rem", fontWeight: "700", letterSpacing: "0.03em" }}>
              {lang === "ta" ? "வஸ்த்ர லக்ஷ்ணம்" : "Vastra Lakshnam"}
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", opacity: 0.9, margin: 0 }}>
            {mode === "login" && (lang === "ta" ? "உங்கள் வாடிக்கையாளர் கணக்கில் உள்நுழையவும்" : "Sign in to access your orders, wishlist & discounts")}
            {mode === "register" && (lang === "ta" ? "புதிய வாடிக்கையாளர் கணக்கை உருவாக்கவும்" : "Join our heritage boutique family & get member benefits")}
            {mode === "forgot" && (lang === "ta" ? "கடவுச்சொல்லை மீட்டமைக்கவும்" : "Recover your Vastra Lakshnam account")}
          </p>
        </div>

        {/* Tab Selector (Login / Register) */}
        {mode !== "forgot" && (
          <div style={{ display: "flex", borderBottom: "1px solid var(--border-light)", backgroundColor: "var(--bg-subtle)" }}>
            <button
              onClick={() => { setMode("login"); setFeedback({ type: null, message: "" }); }}
              style={{
                flex: 1,
                padding: "14px 16px",
                fontWeight: "600",
                fontSize: "0.95rem",
                color: mode === "login" ? "var(--brand-primary)" : "var(--text-muted)",
                backgroundColor: mode === "login" ? "var(--bg-surface)" : "transparent",
                borderBottom: mode === "login" ? "3px solid var(--brand-primary)" : "none",
                transition: "all 0.2s"
              }}
            >
              {lang === "ta" ? "உள்நுழைய (Login)" : "Sign In"}
            </button>
            <button
              onClick={() => { setMode("register"); setFeedback({ type: null, message: "" }); }}
              style={{
                flex: 1,
                padding: "14px 16px",
                fontWeight: "600",
                fontSize: "0.95rem",
                color: mode === "register" ? "var(--brand-primary)" : "var(--text-muted)",
                backgroundColor: mode === "register" ? "var(--bg-surface)" : "transparent",
                borderBottom: mode === "register" ? "3px solid var(--brand-primary)" : "none",
                transition: "all 0.2s"
              }}
            >
              {lang === "ta" ? "புதிய பதிவு (Register)" : "Create Account"}
            </button>
          </div>
        )}

        <div style={{ padding: "28px 24px" }}>
          
          {/* Status Feedback Alert */}
          {feedback.message && (
            <div 
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                marginBottom: "20px",
                backgroundColor: feedback.type === "success" ? "#ECFDF5" : "#FEF2F2",
                color: feedback.type === "success" ? "#065F46" : "#991B1B",
                border: `1px solid ${feedback.type === "success" ? "#A7F3D0" : "#FECACA"}`,
                fontSize: "0.88rem"
              }}
            >
              {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* ===================================================================
              1. LOGIN FORM
             =================================================================== */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                  {lang === "ta" ? "மின்னஞ்சல் முகவரி" : "Email Address"} <span style={{ color: "red" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="email"
                    className="auth-icon-input"
                    required
                    placeholder="Enter your email address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid var(--border-medium)",
                      fontSize: "0.92rem"
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>
                    {lang === "ta" ? "கடவுச்சொல்" : "Password"} <span style={{ color: "red" }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setFeedback({ type: null, message: "" }); }}
                    style={{ background: "none", fontSize: "0.8rem", color: "var(--brand-primary)", fontWeight: "600" }}
                  >
                    {lang === "ta" ? "மறந்துவிட்டதா?" : "Forgot Password?"}
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="auth-icon-input"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 42px 11px 42px",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid var(--border-medium)",
                      fontSize: "0.92rem"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", color: "var(--text-muted)" }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between" style={{ fontSize: "0.85rem" }}>
                <label className="flex items-center gap-2" style={{ cursor: "pointer", color: "var(--text-secondary)" }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: "var(--brand-primary)" }}
                  />
                  <span>{lang === "ta" ? "என்னை நினைவில் கொள்" : "Keep me signed in"}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "1rem",
                  justifyContent: "center",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <span>{lang === "ta" ? "சரிபார்க்கிறது..." : "Signing in..."}</span>
                ) : (
                  <>
                    <span>{lang === "ta" ? "உள்நுழைக" : "Sign In to Account"}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>
          )}

          {/* ===================================================================
              2. REGISTER FORM
             =================================================================== */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                  {lang === "ta" ? "முழு பெயர்" : "Full Name"} <span style={{ color: "red" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <User size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sneha Ramanathan"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid var(--border-medium)",
                      fontSize: "0.92rem"
                    }}
                  />
                </div>
              </div>

              <div className="auth-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                    {lang === "ta" ? "மின்னஞ்சல்" : "Email"} <span style={{ color: "red" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="email"
                      required
                      placeholder="you@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid var(--border-medium)",
                        fontSize: "0.88rem"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                    {lang === "ta" ? "மொபைல் எண்" : "Mobile (+91)"} <span style={{ color: "red" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Phone size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9488412345"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid var(--border-medium)",
                        fontSize: "0.88rem"
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="auth-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                    {lang === "ta" ? "நகரம் / ஊர்" : "City"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      placeholder="Dindigul"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid var(--border-medium)",
                        fontSize: "0.88rem"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                    {lang === "ta" ? "பின்கோடு" : "Pincode"}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="624001"
                    value={regPincode}
                    onChange={(e) => setRegPincode(e.target.value.replace(/\D/g, ""))}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid var(--border-medium)",
                      fontSize: "0.88rem"
                    }}
                  />
                </div>
              </div>

              <div className="auth-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                    {lang === "ta" ? "கடவுச்சொல்" : "Password"} <span style={{ color: "red" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Min 6 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid var(--border-medium)",
                        fontSize: "0.88rem"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                    {lang === "ta" ? "மீண்டும் உறுதிசெய்க" : "Confirm"} <span style={{ color: "red" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <KeyRound size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid var(--border-medium)",
                        fontSize: "0.88rem"
                      }}
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2" style={{ cursor: "pointer", fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ accentColor: "var(--brand-primary)" }}
                />
                <span>
                  {lang === "ta" 
                    ? "வஸ்த்ர லக்ஷ்ணம் சேவைகள் மற்றும் விதிமுறைகளை ஏற்கிறேன்." 
                    : "I agree to the Vastra Lakshnam Terms of Service & Privacy Policy."}
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "1rem",
                  justifyContent: "center",
                  marginTop: "6px",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <span>{lang === "ta" ? "பதிவு செய்கிறது..." : "Creating account..."}</span>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>{lang === "ta" ? "கணக்கை உருவாக்குக" : "Create My Account"}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ===================================================================
              3. FORGOT PASSWORD FORM
             =================================================================== */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <button
                type="button"
                onClick={() => { setMode("login"); setFeedback({ type: null, message: "" }); }}
                style={{ background: "none", display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--brand-primary)", fontSize: "0.85rem", fontWeight: "600", alignSelf: "flex-start" }}
              >
                <ArrowLeft size={16} />
                <span>{lang === "ta" ? "உள்நுழைவுக்குத் திரும்பு" : "Back to Sign In"}</span>
              </button>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0 }}>
                {lang === "ta" 
                  ? "உங்கள் பதிவுசெய்த மின்னஞ்சலை உள்ளிடவும். கடவுச்சொல்லை மாற்ற வழிமுறைகள் அனுப்பப்படும்." 
                  : "Enter your registered email address below, and we will send you instructions to reset your password."}
              </p>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                  {lang === "ta" ? "மின்னஞ்சல் முகவரி" : "Email Address"} <span style={{ color: "red" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid var(--border-medium)",
                      fontSize: "0.92rem"
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "1rem",
                  justifyContent: "center",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <span>{lang === "ta" ? "அனுப்புகிறது..." : "Sending link..."}</span>
                ) : (
                  <span>{lang === "ta" ? "மீட்டமைப்பு இணைப்பை அனுப்புக" : "Send Reset Link"}</span>
                )}
              </button>
            </form>
          )}

          {/* Security Assurance Footer */}
          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.78rem" }}>
            <ShieldCheck size={16} color="var(--brand-primary)" />
            <span>{lang === "ta" ? "100% பாதுகாப்பான & தனிப்பட்ட உள்நுழைவு" : "100% Secure Supabase Authentication"}</span>
          </div>

        </div>
      </div>
      <style>{`
        @media (max-width: 500px) {
          .auth-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
