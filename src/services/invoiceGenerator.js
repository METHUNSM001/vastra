import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();

  // Color Palette Constants
  const primaryColor = [158, 61, 82]; // #9E3D52 Deep Rose
  const secondaryColor = [212, 163, 115]; // #D4A373 Warm Gold
  const textColor = [43, 33, 36];

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("VASTRA LAKSHNAM", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Where Vastram Meets Lakshnam • Dindigul Boutique Fashion", 14, 26);
  doc.text("ORIGINAL TAX INVOICE", 150, 18);
  doc.text(`Invoice No: INV-${order.id || "2026-01"}`, 150, 26);

  // Bill To & Order Meta
  doc.setTextColor(...textColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Billed To:", 14, 48);
  doc.text("Order Information:", 120, 48);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  // Customer Info
  const c = order.customer || {};
  const a = order.shippingAddress || {};
  doc.text(`${c.name || "Valued Customer"}`, 14, 55);
  doc.text(`Phone: ${c.phone || "N/A"}`, 14, 61);
  doc.text(`Email: ${c.email || "N/A"}`, 14, 67);
  doc.text(`${a.houseNo || ""}, ${a.street || ""}`, 14, 73);
  doc.text(`${a.city || ""}, ${a.district || ""}, ${a.state || "Tamil Nadu"} - ${a.pincode || ""}`, 14, 79);

  // Order Details
  doc.text(`Order ID: ${order.id}`, 120, 55);
  doc.text(`Order Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN")}`, 120, 61);
  doc.text(`Payment ID: ${order.paymentId || "Razorpay Verified"}`, 120, 67);
  doc.text(`Payment Status: ${order.paymentStatus || "PAID"}`, 120, 73);
  doc.text(`Delivery Status: ${order.status || "CONFIRMED"}`, 120, 79);

  // Items Table
  const tableData = (order.items || []).map((item, index) => [
    index + 1,
    item.nameEn || item.name || "Fashion Item",
    `Size: ${item.size || "Free Size"} | Color: ${item.color || "Default"}`,
    `Rs. ${item.price}`,
    item.quantity,
    `Rs. ${item.price * item.quantity}`
  ]);

  doc.autoTable({
    startY: 88,
    head: [["#", "Product Description", "Variant", "Unit Price", "Qty", "Total Amount"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },
    styles: {
      fontSize: 9,
      cellPadding: 4
    }
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // Calculation Breakdown
  doc.setFont("helvetica", "normal");
  doc.text(`Subtotal:`, 140, finalY);
  doc.text(`Rs. ${order.subtotal || order.total}`, 180, finalY, { align: "right" });

  doc.text(`Coupon Discount:`, 140, finalY + 6);
  doc.text(`- Rs. ${order.discount || 0}`, 180, finalY + 6, { align: "right" });

  doc.text(`Delivery Charge:`, 140, finalY + 12);
  doc.text(`${order.deliveryCharge === 0 ? "FREE" : "Rs. " + (order.deliveryCharge || 0)}`, 180, finalY + 12, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Grand Total:`, 140, finalY + 20);
  doc.text(`Rs. ${order.total}`, 180, finalY + 20, { align: "right" });

  // Footer & Dindigul Store Guarantee
  doc.setDrawColor(...secondaryColor);
  doc.line(14, finalY + 32, 196, finalY + 32);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Vastra Lakshnam Boutique | Palani Road, Dindigul, Tamil Nadu 624001", 14, finalY + 38);
  doc.text("Customer Support / WhatsApp: +91 94884 12345 | Instagram: @vastralakshnam", 14, finalY + 43);
  doc.text("Thank you for supporting handpicked Indian women's fashion!", 14, finalY + 48);

  doc.save(`Vastra_Lakshnam_Invoice_${order.id}.pdf`);
};
