// Razorpay Client Helper and Verification Lifecycle
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_vastra_lakshnam_2026";
export const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || "919488412345";

/**
 * Loads the external Razorpay script if not already present
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Generates pre-filled WhatsApp customer support URL
 */
export const getWhatsAppUrl = (message) => {
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMsg}`;
};

/**
 * Simulates server-side Razorpay order creation and signature verification
 * for reliable standalone execution and full testing
 */
export const processPaymentVerification = async ({ orderId, amount, customerInfo }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const paymentId = `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      const signature = `sig_${Math.random().toString(36).substring(2, 16)}`;
      resolve({
        success: true,
        orderId,
        paymentId,
        signature,
        verifiedAt: new Date().toISOString()
      });
    }, 1200);
  });
};
