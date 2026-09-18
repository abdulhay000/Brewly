import {
  getCategories,
  getProducts,
  getFeaturedProducts,
  getAdminProducts,
  categoryExists,
  createProduct,
  updateProduct,
  removeProduct,
} from "../models/product.model.js";

export async function categories(req, res) {
  res.json(await getCategories());
}

export async function products(req, res) {
  const query = String(req.query.q || "").trim();
  res.json(await getProducts(query));
}

export async function featuredProducts(req, res) {
  res.json(await getFeaturedProducts());
}

export async function adminProducts(req, res) {
  res.json(await getAdminProducts());
}

export async function createAdminProduct(req, res) {
  const categoryId = Number(req.body.category_id);
  const name = String(req.body.name || "").trim();
  const price = Number(req.body.price);
  const imageUrl = String(req.body.image_url || "").trim();
  const description = String(req.body.description || "").trim();

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return res.status(400).json({ message: "A valid category is required." });
  }
  if (!name || name.length > 150) {
    return res.status(400).json({ message: "Product name is required and must be 150 characters or fewer." });
  }
  if (!Number.isFinite(price) || price <= 0 || price > 99999999.99) {
    return res.status(400).json({ message: "Product price must be a valid number greater than 0." });
  }

  if (!(await categoryExists(categoryId))) {
    return res.status(400).json({ message: "Selected category does not exist." });
  }

  res.status(201).json(await createProduct(categoryId, name, price, imageUrl, description));
}

export async function updateAdminProduct(req, res) {
  const productId = Number(req.params.id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ message: "Invalid product id." });
  }

  const updates = [];
  const values = [];

  if (Object.prototype.hasOwnProperty.call(req.body, "name")) {
    const name = String(req.body.name || "").trim();
    if (!name || name.length > 150) {
      return res.status(400).json({ message: "Product name cannot be empty and must be 150 characters or fewer." });
    }
    updates.push("name=?");
    values.push(name);
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "price")) {
    const price = Number(req.body.price);
    if (!Number.isFinite(price) || price <= 0 || price > 99999999.99) {
      return res.status(400).json({ message: "Product price must be a valid number greater than 0." });
    }
    updates.push("price=?");
    values.push(price);
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "image_url")) {
    const imageUrl = String(req.body.image_url || "").trim();
    if (imageUrl.length > 500) {
      return res.status(400).json({ message: "Image URL must be 500 characters or fewer." });
    }
    updates.push("image_url=?");
    values.push(imageUrl);
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "description")) {
    const description = String(req.body.description || "").trim();
    updates.push("description=?");
    values.push(description);
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "available")) {
    const available = req.body.available === true || req.body.available === 1 || req.body.available === "1";
    if (![true, false, 0, 1, "0", "1"].includes(req.body.available)) {
      return res.status(400).json({ message: "Availability must be true or false." });
    }
    updates.push("available=?");
    values.push(available ? 1 : 0);
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "is_featured")) {
    const isFeatured =
      req.body.is_featured === true ||
      req.body.is_featured === 1 ||
      req.body.is_featured === "1";

    if (![true, false, 0, 1, "0", "1"].includes(req.body.is_featured)) {
      return res.status(400).json({ message: "Featured status must be true or false." });
    }

    updates.push("is_featured=?");
    values.push(isFeatured ? 1 : 0);
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "category_id")) {
    const categoryId = Number(req.body.category_id);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({ message: "Category must be valid." });
    }
    if (!(await categoryExists(categoryId))) {
      return res.status(400).json({ message: "Selected category does not exist." });
    }
    updates.push("category_id=?");
    values.push(categoryId);
  }

  if (!updates.length) {
    return res.status(400).json({ message: "No valid product changes were provided." });
  }

  const product = await updateProduct(productId, updates, values);
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
}

export async function deleteAdminProduct(req, res) {
  await removeProduct(req.params.id);
  res.json({ message: "Product removed" });
}

export async function uploadPhoto(req, res) {
  if (!req.file)
    return res.status(400).json({ message: "Image is required" });
  res.json({ url: `/uploads/${req.file.filename}` });
}
