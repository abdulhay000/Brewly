import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "brewly_db",
  waitForConnections: true,
  connectionLimit: 10,
});

export async function ensureDatabaseUpdates() {
  // Keep the storefront prices in Ethiopian Birr. This is idempotent and
  // also updates an existing local database without requiring a manual reset.
  const etbPrices = {
    Cappuccino: 150,
    Espresso: 100,
    Latte: 170,
    Americano: 120,
    "Iced Coffee": 140,
    "Iced Latte": 180,
    "Cold Brew": 160,
    "Iced Mocha": 200,
    Croissant: 110,
    "Blueberry Muffin": 120,
    "Cinnamon Roll": 140,
    Scone: 110,
    "Chocolate Cake": 180,
    Cheesecake: 200,
    "Red Velvet Cake": 190,
    "Club Sandwich": 300,
    "Grilled Panini": 280,
    "Bagel with Cream Cheese": 170,
  };
  for (const [name, price] of Object.entries(etbPrices)) {
    await pool.query("UPDATE products SET price=? WHERE name=?", [price, name]);
  }

  for (const statement of [
    `ALTER TABLE orders ADD COLUMN payment_checkout_url VARCHAR(1000) NULL AFTER payment_reference`,
    `ALTER TABLE orders ADD COLUMN paid_at TIMESTAMP NULL AFTER payment_checkout_url`,
  ]) {
    try {
      await pool.query(statement);
    } catch (error) {
      if (!/Duplicate column/i.test(error.message)) throw error;
    }
  }

  try {
    await pool.query(
      `ALTER TABLE users ADD COLUMN has_used_discount BOOLEAN NOT NULL DEFAULT FALSE`,
    );
  } catch (error) {
    if (!/Duplicate column/i.test(error.message)) throw error;
  }

  try {
    await pool.query(
      `ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER notes`,
    );
  } catch (error) {
    if (!/Duplicate column/i.test(error.message)) throw error;
  }

  try {
    await pool.query(
      `ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER subtotal`,
    );
  } catch (error) {
    if (!/Duplicate column/i.test(error.message)) throw error;
  }

  try {
    await pool.query(
      `ALTER TABLE products ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE AFTER available`,
    );
  } catch (error) {
    if (!/Duplicate column/i.test(error.message)) throw error;
  }

  for (const statement of [
    `ALTER TABLE users ADD COLUMN loyalty_points INT NOT NULL DEFAULT 0 AFTER has_used_discount`,
    `ALTER TABLE orders ADD COLUMN loyalty_points_earned INT NOT NULL DEFAULT 0 AFTER discount_amount`,
    `ALTER TABLE orders ADD COLUMN loyalty_points_redeemed INT NOT NULL DEFAULT 0 AFTER loyalty_points_earned`,
  ]) {
    try {
      await pool.query(statement);
    } catch (error) {
      if (!/Duplicate column/i.test(error.message)) throw error;
    }
  }


  await pool.query(`CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL,
    message VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
}
