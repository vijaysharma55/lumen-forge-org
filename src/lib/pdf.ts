import { jsPDF } from "jspdf";
import { SITE } from "@/config/site";

const BRAND = { primary: "#0A3A8C", accent: "#F26A1F", soft: "#F4F6FB" };

function header(doc: jsPDF, subtitle: string) {
  doc.setFillColor(BRAND.primary);
  doc.rect(0, 0, 210, 26, "F");
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(SITE.orgName, 14, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(SITE.tagline, 14, 19);
  doc.setFontSize(11);
  doc.setTextColor(BRAND.accent);
  doc.setFont("helvetica", "bold");
  doc.text(subtitle.toUpperCase(), 196, 16, { align: "right" });
  doc.setTextColor("#111827");
}

function footer(doc: jsPDF) {
  doc.setDrawColor(220);
  doc.line(14, 280, 196, 280);
  doc.setFontSize(9);
  doc.setTextColor("#6b7280");
  doc.text(`${SITE.orgName} · ${SITE.supportEmail} · WhatsApp: +${SITE.whatsappNumber}`, 105, 287, { align: "center" });
  doc.text("This document is computer-generated and does not require a physical signature.", 105, 292, { align: "center" });
}

function field(doc: jsPDF, label: string, value: string, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor("#374151");
  doc.text(label, 14, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#111827");
  doc.setFontSize(11);
  doc.text(value || "—", 70, y);
}

export interface ReceiptData {
  receiptNo: string;
  date: string;
  payerName: string;
  payerMobile?: string | null;
  amount: number;
  paymentType: string;
  txnId?: string | null;
  status: string;
  notes?: string | null;
}

export function generateReceiptPDF(d: ReceiptData) {
  const doc = new jsPDF();
  header(doc, "Payment Receipt");

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND.primary);
  doc.text("Payment Receipt", 14, 42);

  doc.setFillColor(BRAND.soft);
  doc.rect(14, 50, 182, 60, "F");

  let y = 62;
  field(doc, "Receipt No.", d.receiptNo, y); y += 9;
  field(doc, "Date", d.date, y); y += 9;
  field(doc, "Received From", d.payerName, y); y += 9;
  if (d.payerMobile) { field(doc, "Mobile", d.payerMobile, y); y += 9; }
  field(doc, "Payment For", d.paymentType, y);

  y = 122;
  doc.setFillColor(BRAND.primary);
  doc.rect(14, y, 182, 22, "F");
  doc.setTextColor("#ffffff");
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Amount Paid", 20, y + 9);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(`INR ${Number(d.amount).toLocaleString("en-IN")}`, 190, y + 14, { align: "right" });

  doc.setTextColor("#111827");
  y = 156;
  field(doc, "Transaction ID", d.txnId || "—", y); y += 9;
  field(doc, "Status", d.status.toUpperCase(), y);
  if (d.notes) { y += 9; field(doc, "Notes", d.notes, y); }

  footer(doc);
  doc.save(`Receipt-${d.receiptNo}.pdf`);
}

export interface JoiningLetterData {
  memberCode: string;
  fullName: string;
  roleLevel: string;
  state: string;
  district: string;
  block?: string | null;
  panchayat?: string | null;
  date: string;
}

export function generateJoiningLetter(d: JoiningLetterData) {
  const doc = new jsPDF();
  header(doc, "Joining Letter");

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND.primary);
  doc.text("Letter of Appointment", 105, 44, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#374151");
  doc.text(`Date: ${d.date}`, 14, 56);
  doc.text(`Member ID: ${d.memberCode}`, 196, 56, { align: "right" });

  doc.setFontSize(12);
  doc.setTextColor("#111827");
  doc.text(`Dear ${d.fullName},`, 14, 72);

  const body = `We are pleased to confirm your appointment as ${d.roleLevel.toUpperCase()} COORDINATOR with ${SITE.orgName}, effective from ${d.date}.\n\nYour assigned area of operation:\n${[d.panchayat, d.block, d.district, d.state].filter(Boolean).join(", ")}\n\nAs a coordinator, you will represent the organization in your region, mobilise community participation, support our hygiene and CSR missions, and onboard members and beneficiaries. You will receive a digital ID card, training material, and a referral code through your member dashboard.\n\nWe wish you the best in this important role and look forward to building strong impact together.\n\nWarm regards,\n${SITE.orgName}`;

  const lines = doc.splitTextToSize(body, 182);
  doc.setFontSize(11);
  doc.text(lines, 14, 82);

  footer(doc);
  doc.save(`JoiningLetter-${d.memberCode}.pdf`);
}

export interface IdCardData {
  memberCode: string;
  fullName: string;
  roleLevel: string;
  district: string;
  state: string;
  mobile: string;
}

export function generateIdCard(d: IdCardData) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [86, 54] });
  // background
  doc.setFillColor(BRAND.primary);
  doc.rect(0, 0, 86, 18, "F");
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(SITE.orgName, 4, 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("Official Member Identity Card", 4, 11);

  doc.setFillColor(BRAND.accent);
  doc.rect(0, 17, 86, 1.5, "F");

  doc.setTextColor("#111827");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(d.fullName, 4, 26);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor("#374151");
  doc.text(`Role: ${d.roleLevel.toUpperCase()} Coordinator`, 4, 31);
  doc.text(`Member ID: ${d.memberCode}`, 4, 35);
  doc.text(`Area: ${d.district}, ${d.state}`, 4, 39);
  doc.text(`Mobile: ${d.mobile}`, 4, 43);

  doc.setFillColor(BRAND.soft);
  doc.rect(0, 47, 86, 7, "F");
  doc.setFontSize(6);
  doc.setTextColor("#6b7280");
  doc.text(`Verify: ${SITE.supportEmail}`, 4, 51);
  doc.text("Valid until cancelled", 82, 51, { align: "right" });

  doc.save(`IDCard-${d.memberCode}.pdf`);
}

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  ngoName: string;
  contactPerson: string;
  mobile: string;
  packageName: string;
  total: number;
  paid: number;
  due: number;
}

export function generateInvoice(d: InvoiceData) {
  const doc = new jsPDF();
  header(doc, "Tax Invoice");

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND.primary);
  doc.text("Invoice", 14, 42);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#374151");
  doc.text(`Invoice No: ${d.invoiceNo}`, 14, 50);
  doc.text(`Date: ${d.date}`, 196, 50, { align: "right" });

  doc.setFillColor(BRAND.soft);
  doc.rect(14, 56, 182, 28, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND.primary);
  doc.setFontSize(11);
  doc.text("Billed To", 18, 64);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#111827");
  doc.text(d.ngoName, 18, 71);
  doc.setFontSize(10);
  doc.setTextColor("#374151");
  doc.text(`${d.contactPerson} · ${d.mobile}`, 18, 78);

  // table
  const tableY = 96;
  doc.setFillColor(BRAND.primary);
  doc.rect(14, tableY, 182, 9, "F");
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Description", 18, tableY + 6);
  doc.text("Amount (INR)", 192, tableY + 6, { align: "right" });

  doc.setTextColor("#111827");
  doc.setFont("helvetica", "normal");
  doc.text(d.packageName || "NGO Website Setup Package", 18, tableY + 16);
  doc.text(Number(d.total).toLocaleString("en-IN"), 192, tableY + 16, { align: "right" });

  let y = tableY + 28;
  doc.setDrawColor(220); doc.line(14, y, 196, y); y += 8;
  doc.text("Total", 130, y); doc.text(Number(d.total).toLocaleString("en-IN"), 192, y, { align: "right" }); y += 7;
  doc.setTextColor("#16a34a");
  doc.text("Paid", 130, y); doc.text(Number(d.paid).toLocaleString("en-IN"), 192, y, { align: "right" }); y += 7;
  doc.setTextColor(BRAND.accent);
  doc.setFont("helvetica", "bold");
  doc.text("Balance Due", 130, y); doc.text(Number(d.due).toLocaleString("en-IN"), 192, y, { align: "right" });

  footer(doc);
  doc.save(`Invoice-${d.invoiceNo}.pdf`);
}

export interface AckData {
  refNo: string;
  date: string;
  fullName: string;
  serviceType: string;
  mobile: string;
}

export function generateAcknowledgement(d: AckData) {
  const doc = new jsPDF();
  header(doc, "Acknowledgement");
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND.primary);
  doc.text("Application Acknowledgement", 14, 44);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#111827");
  doc.text(`Dear ${d.fullName},`, 14, 60);
  const body = `We have received your application / inquiry for "${d.serviceType}" on ${d.date}. Our team will contact you shortly on ${d.mobile}.\n\nReference Number: ${d.refNo}\n\nPlease keep this acknowledgement for your records. You may quote the reference number when contacting our support team.`;
  doc.text(doc.splitTextToSize(body, 182), 14, 70);
  footer(doc);
  doc.save(`Acknowledgement-${d.refNo}.pdf`);
}
