const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
export const API_ORIGIN = API_URL.replace(/\/api$/, "");

export const getToken = () => localStorage.getItem("brewly_token");

export function assetUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/menu/")) return value;
  if (value.startsWith("/uploads/")) return `${API_ORIGIN}${value}`;
  return value.startsWith("/") ? value : `/${value}`;
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  let data = {};

  try {
    data = await response.json();
  } catch {
    // Empty response body.
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

export const api = {
  signup: (data) => request("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => request("/me"),
  loyalty: () => request("/me/loyalty"),
  products: (q = "") => request(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  featuredProducts: () => request("/products/featured"),
  adminProducts: () => request("/admin/products"),
  categories: () => request("/categories"),
  createProduct: (data) => request("/admin/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: "DELETE" }),
  upload: async (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    return request("/admin/upload", { method: "POST", body: formData });
  },
  createOrder: (data) => request("/orders", { method: "POST", body: JSON.stringify(data) }),
  orders: () => request("/orders"),
  adminOrders: () => request("/admin/orders"),
  updateOrderStatus: (id, status) => request(`/admin/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  }),
  updatePaymentStatus: (id, payment_status) => request(`/admin/orders/${id}/payment`, {
    method: "PUT",
    body: JSON.stringify({ payment_status }),
  }),
  verifyTelebirrPayment: (id) => request(`/payments/telebirr/verify/${id}`, { method: "POST" }),
  newsletter: (email) => request("/newsletter", { method: "POST", body: JSON.stringify({ email }) }),
  contact: (data) => request("/contact", { method: "POST", body: JSON.stringify(data) }),
  payments: () => request("/payments/options"),
  testimonials: () => request("/testimonials"),
  createTestimonial: (data) => request("/testimonials", { method: "POST", body: JSON.stringify(data) }),
};
