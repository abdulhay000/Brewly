import nodemailer from "nodemailer";
import { escapeHtml, money } from "../utils/helpers.js";

const emailEnabled = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD &&
  process.env.ADMIN_EMAIL,
);

const mailTransport = emailEnabled
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure:
        String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    })
  : null;

export async function sendAdminOrderEmail(order) {
  if (!mailTransport) {
    console.warn("Order email not sent: SMTP is not configured.");
    return;
  }

  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(item.product_name)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${money(item.unit_price * item.quantity).toFixed(2)} ${process.env.CURRENCY || "ETB"}</td>
    </tr>`,
    )
    .join("");

  const subject = `New Brewly order #${order.id} — ${money(order.total).toFixed(2)} ${process.env.CURRENCY || "ETB"}`;

  try {
    await mailTransport.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject,
      text: [
        `New order #${order.id}`,
        `Customer: ${order.customer_name}`,
        `Email: ${order.email}`,
        `Phone: ${order.phone}`,
        `Address: ${order.address}`,
        `Payment: ${order.payment_method}`,
        `Payment status: ${order.payment_status}`,
        `Total: ${money(order.total).toFixed(2)} ${process.env.CURRENCY || "ETB"}`,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#2b211b">
          <h2 style="margin-bottom:4px">New Brewly order #${order.id}</h2>
          <p style="color:#6b625c">A new customer order has been placed.</p>
          <table style="width:100%;border-collapse:collapse;margin:18px 0">
            <tr><td style="padding:6px 0"><strong>Customer</strong></td><td>${escapeHtml(order.customer_name)}</td></tr>
            <tr><td style="padding:6px 0"><strong>Email</strong></td><td>${escapeHtml(order.email)}</td></tr>
            <tr><td style="padding:6px 0"><strong>Phone</strong></td><td>${escapeHtml(order.phone)}</td></tr>
            <tr><td style="padding:6px 0"><strong>Address</strong></td><td>${escapeHtml(order.address)}</td></tr>
            <tr><td style="padding:6px 0"><strong>Payment</strong></td><td>${escapeHtml(order.payment_method)} (${escapeHtml(order.payment_status)})</td></tr>
          </table>
          <table style="width:100%;border-collapse:collapse">
            <thead><tr><th style="text-align:left;padding:8px">Item</th><th style="padding:8px">Qty</th><th style="text-align:right;padding:8px">Amount</th></tr></thead>
            <tbody>${itemRows}</tbody>
          </table>
          <p style="text-align:right;font-size:18px"><strong>Total: ${money(order.total).toFixed(2)} ${process.env.CURRENCY || "ETB"}</strong></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Admin order email failed:", error.message);
  }
}
