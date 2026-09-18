import { pool } from "../config/db.js";

export async function findUserByEmailOrUsername(identifier) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email=? OR LOWER(username)=? LIMIT 1",
    [identifier.toLowerCase(), identifier.toLowerCase()],
  );
  return rows[0];
}

export async function findExistingUser(email, username) {
  const [exists] = await pool.query(
    "SELECT id FROM users WHERE email=? OR LOWER(username)=?",
    [email, username.toLowerCase()],
  );
  return exists;
}

export async function createUser(email, username, hash, role) {
  const [result] = await pool.query(
    "INSERT INTO users(email, username, password_hash, role) VALUES(?,?,?,?)",
    [email, username, hash, role],
  );
  return result;
}

export async function findUserById(id) {
  const [rows] = await pool.query(
    "SELECT id,email,username,role,created_at,has_used_discount,loyalty_points FROM users WHERE id=?",
    [id],
  );
  return rows[0] || null;
}

export async function lockUserForOrder(conn, id) {
  const [userRows] = await conn.query(
    "SELECT has_used_discount, loyalty_points, email, username FROM users WHERE id=? FOR UPDATE",
    [id],
  );
  return userRows[0];
}

export async function markDiscountUsed(conn, id) {
  await conn.query("UPDATE users SET has_used_discount=TRUE WHERE id=?", [id]);
}

export async function getLoyaltyPoints(userId) {
  const [rows] = await pool.query("SELECT loyalty_points FROM users WHERE id=?", [userId]);
  return Number(rows[0]?.loyalty_points || 0);
}

export async function updateLoyaltyPoints(conn, id, delta) {
  await conn.query("UPDATE users SET loyalty_points = loyalty_points + ? WHERE id=?", [delta, id]);
}
