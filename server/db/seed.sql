USE brewly_db;
INSERT IGNORE INTO categories (name,description) VALUES
('Hot Coffees','Freshly brewed hot coffee and espresso drinks.'),('Cold Coffees','Refreshing iced coffee and cold beverages.'),('Bakery','Fresh pastries and baked treats.'),('Cake','Sweet desserts that pair perfectly with coffee.'),('Snacks','Fresh sandwiches and savory snacks.');
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Cappuccino',150.00,'/menu/cappuccino.jpg' FROM categories WHERE name='Hot Coffees' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Espresso',100.00,'/menu/espresso.jpg' FROM categories WHERE name='Hot Coffees' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Latte',170.00,'/menu/latte.jpg' FROM categories WHERE name='Hot Coffees' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Americano',120.00,'/menu/americano.jpg' FROM categories WHERE name='Hot Coffees' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Iced Coffee',140.00,'/menu/iced-coffee.jpg' FROM categories WHERE name='Cold Coffees' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Iced Latte',180.00,'/menu/iced-latte.jpg' FROM categories WHERE name='Cold Coffees' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Cold Brew',160.00,'/menu/cold-brew.jpg' FROM categories WHERE name='Cold Coffees' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Iced Mocha',200.00,'/menu/iced-mocha.jpg' FROM categories WHERE name='Cold Coffees' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Croissant',110.00,'/menu/croissant.jpg' FROM categories WHERE name='Bakery' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Blueberry Muffin',120.00,'/menu/blueberry-muffin.jpg' FROM categories WHERE name='Bakery' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Cinnamon Roll',140.00,'/menu/cinnamon-roll.jpg' FROM categories WHERE name='Bakery' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Scone',110.00,'/menu/scone.jpg' FROM categories WHERE name='Bakery' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Chocolate Cake',180.00,'/menu/chocolate-cake.jpg' FROM categories WHERE name='Cake' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Cheesecake',200.00,'/menu/cheesecake.jpg' FROM categories WHERE name='Cake' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Red Velvet Cake',190.00,'/menu/redVelvet-cake.jpg' FROM categories WHERE name='Cake' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Club Sandwich',300.00,'/menu/club-sandwich.jpg' FROM categories WHERE name='Snacks' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Grilled Panini',280.00,'/menu/grilled-panini.jpg' FROM categories WHERE name='Snacks' LIMIT 1;
INSERT IGNORE INTO products (category_id,name,price,image_url) SELECT id,'Bagel with Cream Cheese',170.00,'/menu/bagelCreamCheese.jpg' FROM categories WHERE name='Snacks' LIMIT 1;

-- Keep an existing Brewly database on the new Ethiopian Birr price list.
UPDATE products SET price=150.00 WHERE name="Cappuccino";
UPDATE products SET price=100.00 WHERE name="Espresso";
UPDATE products SET price=170.00 WHERE name="Latte";
UPDATE products SET price=120.00 WHERE name="Americano";
UPDATE products SET price=140.00 WHERE name="Iced Coffee";
UPDATE products SET price=180.00 WHERE name="Iced Latte";
UPDATE products SET price=160.00 WHERE name="Cold Brew";
UPDATE products SET price=200.00 WHERE name="Iced Mocha";
UPDATE products SET price=110.00 WHERE name="Croissant";
UPDATE products SET price=120.00 WHERE name="Blueberry Muffin";
UPDATE products SET price=140.00 WHERE name="Cinnamon Roll";
UPDATE products SET price=110.00 WHERE name="Scone";
UPDATE products SET price=180.00 WHERE name="Chocolate Cake";
UPDATE products SET price=200.00 WHERE name="Cheesecake";
UPDATE products SET price=190.00 WHERE name="Red Velvet Cake";
UPDATE products SET price=300.00 WHERE name="Club Sandwich";
UPDATE products SET price=280.00 WHERE name="Grilled Panini";
UPDATE products SET price=170.00 WHERE name="Bagel with Cream Cheese";


-- Mark a curated set of available products as landing-page featured picks.
UPDATE products
SET is_featured=TRUE
WHERE name IN (
  "Cappuccino",
  "Espresso",
  "Iced Latte",
  "Cold Brew",
  "Croissant",
  "Cinnamon Roll",
  "Chocolate Cake",
  "Club Sandwich"
);
