import { pool } from "../config/db.js";

export async function getTestimonials() {
  const [rows] = await pool.query(`
    SELECT t.id, t.rating, t.message, t.created_at, u.username
    FROM testimonials t
    JOIN users u ON u.id=t.user_id
    ORDER BY t.created_at DESC, t.id DESC
    LIMIT 4
  `);
  return rows;
}

export async function createTestimonial(userId, rating, message) {
  const [result] = await pool.query(
    "INSERT INTO testimonials(user_id, rating, message) VALUES (?, ?, ?)",
    [userId, rating, message],
  );
  return result.insertId;
}

export async function addNewsletter(email) {
  await pool.query(
    "INSERT IGNORE INTO newsletter_subscribers(email) VALUES(?)",
    [email],
  );
}

export async function addContact(name, email, message) {
  await pool.query(
    "INSERT INTO contact_messages(name,email,message) VALUES(?,?,?)",
    [name, email, message],
  );
}
