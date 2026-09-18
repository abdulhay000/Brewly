import { pool } from "../config/db.js";

export async function getCategories() {
  const [rows] = await pool.query("SELECT * FROM categories ORDER BY id");
  return rows;
}

export async function getProducts(query) {
  const words = query.split(/\s+/).filter(Boolean);
  let sql = `SELECT p.*, c.name category_name FROM products p JOIN categories c ON c.id=p.category_id WHERE p.available=1`;
  const params = [];

  for (const word of words) {
    sql += " AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)";
    const value = `%${word}%`;
    params.push(value, value, value);
  }

  sql += " ORDER BY c.id, p.id";
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function getFeaturedProducts() {
  const [rows] = await pool.query(
    `SELECT p.*, c.name category_name
     FROM products p
     JOIN categories c ON c.id=p.category_id
     WHERE p.available=1 AND p.is_featured=1
     ORDER BY c.id, p.id`,
  );
  return rows;
}

export async function getAdminProducts() {
  const [rows] = await pool.query(
    "SELECT p.*, c.name category_name FROM products p JOIN categories c ON c.id=p.category_id ORDER BY c.id, p.id",
  );
  return rows;
}

export async function categoryExists(categoryId) {
  const [categoryRows] = await pool.query("SELECT id FROM categories WHERE id=? LIMIT 1", [categoryId]);
  return categoryRows.length > 0;
}

export async function createProduct(categoryId, name, price, imageUrl, description) {
  const [r] = await pool.query(
    "INSERT INTO products(category_id,name,price,image_url,description) VALUES(?,?,?,?,?)",
    [categoryId, name, price, imageUrl, description],
  );
  const [rows] = await pool.query(
    "SELECT p.*,c.name category_name FROM products p JOIN categories c ON c.id=p.category_id WHERE p.id=?",
    [r.insertId],
  );
  return rows[0];
}

export async function updateProduct(productId, updates, values) {
  values.push(productId);
  const [result] = await pool.query(
    `UPDATE products SET ${updates.join(",")} WHERE id=?`,
    values,
  );
  if (!result.affectedRows) return null;
  const [rows] = await pool.query(
    "SELECT p.*,c.name category_name FROM products p JOIN categories c ON c.id=p.category_id WHERE p.id=?",
    [productId],
  );
  return rows[0];
}

export async function removeProduct(id) {
  await pool.query("UPDATE products SET available=0 WHERE id=?", [id]);
}
