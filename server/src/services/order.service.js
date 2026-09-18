import { pool } from "../config/db.js";
import { lockUserForOrder, markDiscountUsed, updateLoyaltyPoints } from "../models/user.model.js";
import { sendAdminOrderEmail } from "./email.service.js";
import { getTelebirrClient, telebirrConfigured } from "./telebirr.service.js";
import { money } from "../utils/helpers.js";

export async function createOrder(userId, body) {
  const { customer_name, phone, address, notes, payment_method, items } = body;
  const selectedPayment = ["cash", "telebirr"].includes(payment_method)
    ? payment_method
    : "cash";

  if (!customer_name || !phone || !address || !Array.isArray(items) || !items.length) {
    const error = new Error("Customer details and at least one item are required");
    error.statusCode = 400;
    throw error;
  }

  const redeemRequested = body.redeem_points === true || Number(body.redeem_points) === 100;
  const conn = await pool.getConnection();
  let transactionActive = false;

  try {
    await conn.beginTransaction();
    transactionActive = true;

    const ids = [...new Set(items.map((item) => Number(item.product_id)).filter(Number.isInteger))];
    if (!ids.length) throw new Error("Your basket contains no valid products.");

    const [products] = await conn.query(
      `SELECT id, name, price FROM products WHERE id IN (${ids.map(() => "?").join(",")}) AND available=1`,
      ids,
    );

    const productMap = new Map(products.map((product) => [product.id, product]));
    const normalizedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(Number(item.product_id));
      const quantity = Math.min(99, Math.max(1, Math.floor(Number(item.quantity) || 1)));
      if (!product) throw new Error("One or more products are unavailable.");
      subtotal += Number(product.price) * quantity;
      normalizedItems.push({ product, quantity });
    }

    subtotal = money(subtotal);
    const userRow = await lockUserForOrder(conn, userId);
    if (!userRow) {
      const error = new Error("User account not found.");
      error.statusCode = 401;
      throw error;
    }

    const firstOrderDiscount = userRow.has_used_discount ? 0 : money(subtotal * 0.2);
    const loyaltyPointsEarned = Math.floor(subtotal / 10);
    const loyaltyPointsRedeemed = redeemRequested ? 100 : 0;

    if (loyaltyPointsRedeemed > Number(userRow.loyalty_points || 0)) {
      const error = new Error("You do not have enough loyalty points to redeem this reward.");
      error.statusCode = 400;
      throw error;
    }

    const loyaltyDiscount = loyaltyPointsRedeemed ? 50 : 0;
    const discountAmount = money(firstOrderDiscount + loyaltyDiscount);
    const total = money(Math.max(0, subtotal - discountAmount));

    const [result] = await conn.query(
      `INSERT INTO orders
       (user_id, customer_name, phone, address, notes, subtotal, discount_amount, loyalty_points_earned, loyalty_points_redeemed, total, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        String(customer_name).trim().slice(0, 150),
        String(phone).trim().slice(0, 40),
        String(address).trim().slice(0, 500),
        String(notes || "").trim(),
        subtotal,
        discountAmount,
        loyaltyPointsEarned,
        loyaltyPointsRedeemed,
        total,
        selectedPayment,
      ],
    );

    const orderId = result.insertId;

    for (const item of normalizedItems) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product.id, item.product.name, item.product.price, item.quantity],
      );
    }

    if (firstOrderDiscount > 0) await markDiscountUsed(conn, userId);
    await updateLoyaltyPoints(conn, userId, loyaltyPointsEarned - loyaltyPointsRedeemed);

    let checkoutUrl = "";
    let paymentReference = "";

    if (selectedPayment === "telebirr") {
      if (!telebirrConfigured()) {
        throw new Error("Telebirr payment is not configured yet. Add the Telebirr merchant credentials to server/.env.");
      }

      const client = await getTelebirrClient();
      const merchOrderId = `BREWLY${orderId}${Date.now()}`;
      const checkout = await client.createCheckoutUrl(
        `Brewly Order ${orderId}`,
        money(total).toFixed(2),
        merchOrderId,
      );

      checkoutUrl = checkout.checkoutUrl;
      paymentReference = checkout.merchOrderId || merchOrderId;
      await conn.query(
        "UPDATE orders SET payment_reference=?, payment_checkout_url=? WHERE id=?",
        [paymentReference, checkoutUrl, orderId],
      );
    }

    await conn.commit();
    transactionActive = false;

    const [orderRows] = await pool.query(
      `SELECT o.*, u.email FROM orders o JOIN users u ON u.id=o.user_id WHERE o.id=?`,
      [orderId],
    );
    const [orderItems] = await pool.query(
      "SELECT product_name, unit_price, quantity FROM order_items WHERE order_id=?",
      [orderId],
    );

    try {
      await sendAdminOrderEmail({ ...orderRows[0], items: orderItems });
    } catch (emailError) {
      console.error("Admin order email error:", emailError);
    }

    return {
      order_id: orderId,
      subtotal,
      discount_amount: discountAmount,
      first_order_discount: firstOrderDiscount,
      loyalty_discount: loyaltyDiscount,
      total,
      loyalty_points_earned: loyaltyPointsEarned,
      loyalty_points_redeemed: loyaltyPointsRedeemed,
      loyalty_points_balance: Number(userRow.loyalty_points || 0) + loyaltyPointsEarned - loyaltyPointsRedeemed,
      currency: process.env.CURRENCY || "ETB",
      payment_method: selectedPayment,
      payment_status: "pending",
      checkout_url: checkoutUrl,
      payment_reference: paymentReference,
      message:
        selectedPayment === "telebirr"
          ? "Order created. Continue to Telebirr to complete payment."
          : "Order created successfully",
    };
  } catch (error) {
    if (transactionActive) await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
