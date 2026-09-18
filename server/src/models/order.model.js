import { pool } from "../config/db.js";

export async function getUserOrders(userId) {
  const [orders] = await pool.query(
    "SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC",
    [userId],
  );
  for (const o of orders) {
    const [items] = await pool.query(
      "SELECT * FROM order_items WHERE order_id=?",
      [o.id],
    );
    o.items = items;
  }
  return orders;
}

export async function getAdminOrders() {
  const [orders] = await pool.query(
    "SELECT o.*,u.email,u.username FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC",
  );
  for (const o of orders) {
    const [items] = await pool.query(
      "SELECT * FROM order_items WHERE order_id=?",
      [o.id],
    );
    o.items = items;
  }
  return orders;
}

export async function updateOrderStatus(id, status) {
  await pool.query("UPDATE orders SET order_status=? WHERE id=?", [status, id]);
}

export async function updatePaymentStatus(id, paymentStatus, paidAt) {
  await pool.query("UPDATE orders SET payment_status=?, paid_at=? WHERE id=?", [
    paymentStatus,
    paidAt,
    id,
  ]);
}

export async function findTelebirrOrder(id, userId) {
  const [rows] = await pool.query(
    'SELECT * FROM orders WHERE id=? AND user_id=? AND payment_method="telebirr" LIMIT 1',
    [id, userId],
  );
  return rows[0];
}

export async function markOrderPaid(id) {
  await pool.query(
    'UPDATE orders SET payment_status="paid", paid_at=COALESCE(paid_at, CURRENT_TIMESTAMP) WHERE id=?',
    [id],
  );
}
