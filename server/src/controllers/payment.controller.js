import { pool } from "../config/db.js";
import { getTelebirrClient, getTelebirrConfig, telebirrConfigured } from "../services/telebirr.service.js";
import { money } from "../utils/helpers.js";

export async function telebirrNotify(req, res) {
  try {
    const { NotificationHandler } = await import("@melakudemeke/telebirr-js");
    const notification = NotificationHandler.parse(req.body || "");

    if (
      !NotificationHandler.verify(notification, await getTelebirrConfig())
    ) {
      return NotificationHandler.respondError("Invalid signature").send(res);
    }

    if (NotificationHandler.isPaymentSuccessful(notification)) {
      const paymentInfo =
        NotificationHandler.extractPaymentInfo(notification);
      const reference = paymentInfo.merchOrderId;

      if (reference) {
        // Never trust the notification amount by itself. Ask Telebirr for the
        // authoritative server-to-server status and compare it to our order.
        const client = await getTelebirrClient();
        const status = await client.getOrderStatus(reference);

        const [orders] = await pool.query(
          'SELECT id,total FROM orders WHERE payment_reference=? AND payment_method="telebirr" LIMIT 1',
          [reference],
        );

        if (
          orders[0] &&
          status.paid &&
          money(status.amount) === money(orders[0].total) &&
          String(status.currency || "ETB").toUpperCase() ===
            String(process.env.CURRENCY || "ETB").toUpperCase()
        ) {
          await pool.query(
            'UPDATE orders SET payment_status="paid", paid_at=COALESCE(paid_at, CURRENT_TIMESTAMP) WHERE id=?',
            [orders[0].id],
          );
        }
      }
    }

    return NotificationHandler.respondSuccess("Payment processed").send(res);
  } catch (error) {
    console.error("Telebirr notification error:", error);
    return res.status(500).json({ success: false });
  }
}

export async function options(req, res) {
  res.json({
    currency: process.env.CURRENCY || "ETB",
    methods: [
      { id: "cash", name: "Cash on delivery", available: true },
      { id: "telebirr", name: "Telebirr", available: telebirrConfigured() },
    ],
  });
}
