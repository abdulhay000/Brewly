import { useEffect, useState } from "react";
import useAuth from "../features/auth/hooks/useAuth";
import useRouter from "../hooks/useRouter";
import useMenu from "../hooks/useMenu";
import { api, assetUrl } from "../services/api";

const initialForm = { category_id: "", name: "", price: "", image_url: "", description: "" };

export default function Admin() {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const { refresh: refreshStorefront } = useMenu();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [productRows, categoryRows, orderRows] = await Promise.all([
      api.adminProducts(),
      api.categories(),
      api.adminOrders(),
    ]);
    setProducts(productRows);
    setCategories(categoryRows);
    setOrders(orderRows);
    // Keep the public storefront (Home page) in sync with admin changes
    // made during this session.
    refreshStorefront();
  };

  useEffect(() => {
    load().catch((error) => setMsg(error.message));
  }, []);

  const addProduct = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const price = Number(form.price);
    if (!name) {
      setMsg("Product name is required.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setMsg("Product price must be greater than 0.");
      return;
    }

    try {
      let image = form.image_url.trim();
      if (file) image = (await api.upload(file)).url;

      await api.createProduct({
        ...form,
        name,
        image_url: image,
        price,
      });

      setForm(initialForm);
      setFile(null);
      setMsg("Product added successfully.");
      await load();
    } catch (error) {
      setMsg(error.message);
    }
  };

  const updateProduct = async (product, field, value) => {
    const normalizedValue = field === "name" ? String(value || "").trim() : Number(value);

    if (field === "name" && !normalizedValue) {
      setMsg("Product name cannot be empty.");
      await load();
      return;
    }

    if (field === "price" && (!Number.isFinite(normalizedValue) || normalizedValue <= 0)) {
      setMsg("Product price must be greater than 0.");
      await load();
      return;
    }

    try {
      await api.updateProduct(product.id, { [field]: normalizedValue });
      await load();
      setMsg("Product updated.");
    } catch (error) {
      setMsg(error.message);
      await load();
    }
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`Remove ${product.name} from the storefront?`)) return;
    try {
      await api.deleteProduct(product.id);
      await load();
      setMsg("Product removed. You can restore it from the admin list.");
    } catch (error) {
      setMsg(error.message);
    }
  };

  const restoreProduct = async (product) => {
    try {
      await api.updateProduct(product.id, { available: 1 });
      await load();
      setMsg("Product restored.");
    } catch (error) {
      setMsg(error.message);
    }
  };

  const toggleFeatured = async (product) => {
    try {
      await api.updateProduct(product.id, { is_featured: !Boolean(product.is_featured) });
      await load();
      setMsg(
        product.is_featured
          ? `${product.name} removed from featured picks.`
          : `${product.name} marked as featured.`,
      );
    } catch (error) {
      setMsg(error.message);
      await load();
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await load();
    } catch (error) {
      setMsg(error.message);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="brand-text">
          <h2 className="brand-name">Brewly.</h2>
          <p className="brand-tagline-static">ADMIN DASHBOARD</p>
        </div>
        <div className="admin-header-actions">
          <span>Hi, {user?.username}</span>
          <button className="btn1" onClick={() => navigate("/user")}>User page</button>
          <button className="btn1" onClick={() => navigate("/")}>Landing</button>
          <button className="btn1" onClick={() => { logout(); navigate("/"); }}>Log out</button>
        </div>
      </header>

      <main className="admin-content">
        <h1>Manage store</h1>
        <p>Add products, edit products, choose landing-page featured picks, restore removed products, and manage customer orders.</p>

        <form className="admin-add-form" onSubmit={addProduct}>
          <h2>Add product</h2>
          <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
            <option value="">Select category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="number" min="0.01" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="btn" type="submit">Add product</button>
        </form>

        <h2>Products</h2>
        <div className="admin-products">
          {products.map((product) => (
            <div className={`admin-product ${product.available ? "" : "admin-product-removed"}`} key={product.id}>
              <img src={assetUrl(product.image_url)} alt={product.name} />
              <div>
                <input value={product.name} onChange={(e) => setProducts((items) => items.map((item) => item.id === product.id ? { ...item, name: e.target.value } : item))} onBlur={(e) => updateProduct(product, "name", e.target.value)} />
                <input type="number" min="0.01" step="0.01" value={product.price} onChange={(e) => setProducts((items) => items.map((item) => item.id === product.id ? { ...item, price: e.target.value } : item))} onBlur={(e) => updateProduct(product, "price", Number(e.target.value))} />
                {product.available ? (
                  <button className="admin-remove-btn" onClick={() => removeProduct(product)}>Remove</button>
                ) : (
                  <button className="admin-save-btn" onClick={() => restoreProduct(product)}>Restore</button>
                )}
                <button
                  className={`admin-featured-btn ${product.is_featured ? "admin-featured-btn-active" : ""}`}
                  type="button"
                  onClick={() => toggleFeatured(product)}
                >
                  {product.is_featured ? "Featured" : "Mark featured"}
                </button>
              </div>
              <small>{product.category_name} · {product.available ? "Available" : "Removed"}</small>
            </div>
          ))}
        </div>

        <h2>Orders</h2>
        <div className="admin-orders">
          {orders.map((order) => (
            <div className="admin-order" key={order.id}>
              <div>
                <b>#{order.id} · {order.customer_name}</b>
                <span>{order.username} · {order.phone}</span>
                <span>{order.address}</span>
              </div>
              <div className={`admin-payment-status payment-${order.payment_status}`}>
                <span>Payment: <strong>{order.payment_status}</strong></span>
                {order.payment_method === "telebirr" && order.payment_status !== "paid" && (
                  <button className="admin-save-btn" onClick={() => api.updatePaymentStatus(order.id, "paid").then(load).catch((error) => setMsg(error.message))}>
                    Mark paid
                  </button>
                )}
                {order.payment_status === "paid" && (
                  <button className="admin-remove-btn" onClick={() => api.updatePaymentStatus(order.id, "pending").then(load).catch((error) => setMsg(error.message))}>
                    Mark pending
                  </button>
                )}
              </div>
              <b>ETB {Number(order.total).toFixed(2)}</b>
              <select value={order.order_status} onChange={(e) => updateStatus(order.id, e.target.value)}>
                {['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          ))}
        </div>

        {msg && <div className="toast">{msg}<button onClick={() => setMsg("")}>×</button></div>}
      </main>
    </div>
  );
}
