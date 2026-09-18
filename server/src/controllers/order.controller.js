import { createOrder } from "../services/order.service.js";
import {
  getUserOrders,
  getAdminOrders,
  updateOrderStatus,
  updatePaymentStatus,
  findTelebirrOrder,
  markOrderPaid,
} from "../models/order.model.js";
import { getTelebirrClient } from "../services/telebirr.service.js";
import { money } from "../utils/helpers.js";

export async function create(req, res) {
  try {
    res.status(201).json(await createOrder(req.user.id, req.body));
  } catch (error) {
    console.error("Order error:", error);
    res.status(error.statusCode || 400).json({ message: error.message || "Could not create order" });
  }
}

export async function list(req, res) {
  res.json(await getUserOrders(req.user.id));
}

export async function adminList(req, res) {
  res.json(await getAdminOrders());
}

export async function status(req, res) {
  const allowed = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "delivered",
    "cancelled",
  ];
  if (!allowed.includes(req.body.status))
    return res.status(400).json({ message: "Invalid status" });
  await updateOrderStatus(req.params.id, req.body.status);
  res.json({ message: "Order updated" });
}

export async function payment(req, res) {
  const allowed = ["pending", "paid", "failed"];
  if (!allowed.includes(req.body.payment_status)) {
    return res.status(400).json({ message: "Invalid payment status" });
  }
  const paidAt = req.body.payment_status === "paid" ? new Date() : null;
  await updatePaymentStatus(req.params.id, req.body.payment_status, paidAt);
  res.json({ message: "Payment status updated" });
}

export async function verifyTelebirr(req, res) {
  const order = await findTelebirrOrder(req.params.orderId, req.user.id);
  if (!order) return res.status(404).json({ message: "Order not found." });
  if (!order.payment_reference)
    return res
      .status(400)
      .json({ message: "This order has no Telebirr payment reference." });

  try {
    const client = await getTelebirrClient();
    const status = await client.getOrderStatus(order.payment_reference);
    const paid =
      Boolean(status.paid) &&
      money(status.amount) === money(order.total) &&
      String(status.currency || "ETB").toUpperCase() ===
        String(process.env.CURRENCY || "ETB").toUpperCase();

    if (paid) await markOrderPaid(order.id);

    res.json({
      paid,
      payment_status: paid ? "paid" : order.payment_status,
      reference: status.paymentOrderId || order.payment_reference,
    });
  } catch (error) {
    console.error("Telebirr verification error:", error);
    res
      .status(502)
      .json({ message: "Could not verify the Telebirr payment right now." });
  }
}
