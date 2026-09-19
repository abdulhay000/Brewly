import { useEffect, useMemo, useRef, useState } from "react";
import useAuth from "../features/auth/hooks/useAuth";
import useRouter from "../hooks/useRouter";
import { api, assetUrl } from "../services/api";
import Loading from "../components/common/Loading";
import Modal from "../components/common/Modal";
import "../App.css";

function User() {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [discountAvailable, setDiscountAvailable] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [review, setReview] = useState({ rating: 5, message: "" });
  const [reviewMessage, setReviewMessage] = useState("");
  const [paymentOptions, setPaymentOptions] = useState([
    { id: "cash", name: "Cash on delivery", available: true },
  ]);
  const [currency, setCurrency] = useState("ETB");
  const [form, setForm] = useState({
    customer_name: user?.username || "",
    phone: "",
    address: "",
    notes: "",
    payment_method: "cash",
  });

  const searchRequestId = useRef(0);

  const loadProducts = async (searchTerm, requestId) => {
    try {
      const results = await api.products(searchTerm);
      if (requestId === searchRequestId.current) {
        setProducts(results);
        setLoadingProducts(false);
      }
    } catch (error) {
      if (requestId === searchRequestId.current) {
        setLoadingProducts(false);
        setMessage(error.message);
      }
    }
  };

  useEffect(() => {
    const requestId = ++searchRequestId.current;
    setLoadingProducts(true);
    const timer = setTimeout(() => loadProducts(query, requestId), 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    api
      .orders()
      .then(setOrders)
      .catch(() => {});
    api
      .payments()
      .then((data) => {
        const methods = Array.isArray(data?.methods)
          ? data.methods.filter((method) => method?.available)
          : [];
        const safeMethods = methods.some((method) => method.id === "cash")
          ? methods
          : [
              { id: "cash", name: "Cash on delivery", available: true },
              ...methods,
            ];

        setPaymentOptions(safeMethods);
        setForm((current) => ({
          ...current,
          payment_method: safeMethods.some(
            (method) => method.id === current.payment_method,
          )
            ? current.payment_method
            : "cash",
        }));
        setCurrency(data?.currency || "ETB");
      })
      .catch(() => {
        setPaymentOptions([
          { id: "cash", name: "Cash on delivery", available: true },
        ]);
        setForm((current) => ({ ...current, payment_method: "cash" }));
        setCurrency("ETB");
      });
  }, []);

  useEffect(() => {
    api
      .me()
      .then((currentUser) => {
        if (currentUser) {
          setDiscountAvailable(!currentUser.has_used_discount);
          setLoyaltyPoints(Number(currentUser.loyalty_points || 0));
        }
      })
      .catch(() => {});
    api
      .loyalty()
      .then((data) => setLoyaltyPoints(Number(data?.loyalty_points || 0)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (loyaltyPoints < 100) setRedeemPoints(false);
  }, [loyaltyPoints]);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const changeQuantity = (id, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const resetCart = () => {
    setCart([]);
    setRedeemPoints(false);
  };

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cart],
  );

  const discount = discountAvailable ? subtotal * 0.2 : 0;
  const loyaltyDiscount = redeemPoints ? 50 : 0;
  const total = Math.max(0, subtotal - discount - loyaltyDiscount);

  const placeOrder = async (event) => {
    event.preventDefault();

    try {
      const result = await api.createOrder({
        ...form,
        redeem_points: redeemPoints,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });

      setCart([]);
      setCheckoutOpen(false);
      setDiscountAvailable(false);
      setRedeemPoints(false);
      setLoyaltyPoints(Number(result.loyalty_points_balance ?? loyaltyPoints));
      setOrders(await api.orders());

      const earned = Number(result.loyalty_points_earned || 0);
      const confirmation = `Order #${result.order_id} placed successfully. You earned ${earned} loyalty ${earned === 1 ? "point" : "points"}! Total: ${currency} ${Number(result.total).toFixed(2)}`;

      if (result.checkout_url) {
        setMessage(
          `Order #${result.order_id} created. You earned ${earned} loyalty ${earned === 1 ? "point" : "points"}! Opening secure Telebirr checkout...`,
        );
        window.setTimeout(
          () => window.location.assign(result.checkout_url),
          100,
        );
        return;
      }

      setMessage(confirmation);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewMessage("");

    try {
      await api.createTestimonial(review);
      setReview({ rating: 5, message: "" });
      setReviewMessage(
        "Thank you! Your feedback has been added to our testimonials.",
      );
    } catch (error) {
      setReviewMessage(error.message);
    }
  };

  return (
    <div className="user-page">
      <header className="user-top">
        <button className="user-brand" onClick={() => navigate("/")}>
          <span className="user-brand-icon">☕</span>
          <span>Brewly.</span>
        </button>

        <div className="user-actions">
          <span>Hi, {user?.username}</span>
          <button className="btn1" onClick={() => navigate("/")}>
            Landing
          </button>
          <button className="btn1" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <main className="user-main">
        <div className="user-heading">
          <div>
            <p className="section-title">BREWLY STORE</p>
            <h1>Order your favorites</h1>
            <p>
              Search the menu, customize your basket, and place your order in
              seconds.
            </p>
          </div>
          <div className="user-cart-actions">
            <div
              className="loyalty-balance"
              aria-label="Current loyalty points">
              <span>★</span> You have <strong>{loyaltyPoints}</strong> points
            </div>
          </div>
        </div>

        {discountAvailable && cart.length > 0 && (
          <div className="new-user-discount">
            <strong>New customer offer: 20% off</strong>
            <span>
              Your first order discount is automatically applied at checkout.
            </span>
          </div>
        )}

        <div className="user-layout">
          <section className="user-products-area">
            <div className="user-search">
              <span>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search coffee, cake, bakery..."
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  ×
                </button>
              )}
            </div>

            <p className="search-result-count">
              {products.length} {products.length === 1 ? "item" : "items"} found
            </p>

            <div className="user-grid">
              {loadingProducts ? (
                <Loading message="Loading menu..." />
              ) : products.length === 0 ? (
                <div className="user-no-results">
                  <h3>No matching items</h3>
                  <p>Try a product name, category, or a simpler search.</p>
                </div>
              ) : (
                products.map((product) => (
                  <article className="user-card" key={product.id}>
                    <div className="user-card-image">
                      <img
                        src={assetUrl(product.image_url)}
                        alt={product.name}
                      />
                      <span>{product.category_name}</span>
                    </div>
                    <div className="user-card-content">
                      <h3>{product.name}</h3>
                      <p>
                        {product.description || "Freshly prepared at Brewly."}
                      </p>
                      <div className="user-card-bottom">
                        <strong>
                          {currency} {Number(product.price).toFixed(2)}
                        </strong>
                        <button
                          className="btn"
                          onClick={() => addToCart(product)}>
                          Add to order
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <aside className="user-cart-panel">
            <div className="user-panel-heading">
              <h2>Your basket</h2>
              <button onClick={resetCart} disabled={!cart.length}>
                Reset
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="empty-cart">
                Your basket is empty. Add something delicious.
              </p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          {currency} {Number(item.price).toFixed(2)}
                        </span>
                      </div>
                      <div className="quantity-controls">
                        <button onClick={() => changeQuantity(item.id, -1)}>
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => changeQuantity(item.id, 1)}>
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <p>
                    <span>Subtotal</span>
                    <strong>
                      {currency} {subtotal.toFixed(2)}
                    </strong>
                  </p>
                  {discountAvailable && (
                    <p className="discount-line">
                      <span>New customer discount</span>
                      <strong>
                        −{currency} {discount.toFixed(2)}
                      </strong>
                    </p>
                  )}
                  {redeemPoints && (
                    <p className="discount-line loyalty-discount-line">
                      <span>Loyalty reward</span>
                      <strong>−{currency} 50.00</strong>
                    </p>
                  )}
                  <p className="cart-total">
                    <span>Total</span>
                    <strong>
                      {currency} {total.toFixed(2)}
                    </strong>
                  </p>
                </div>
                <button
                  className="btn cart-checkout"
                  onClick={() => setCheckoutOpen(true)}>
                  Checkout
                </button>
              </>
            )}
          </aside>
        </div>

        <section className="feedback-panel">
          <div>
            <p className="section-title">YOUR EXPERIENCE</p>
            <h2>Tell us what you think</h2>
            <p>Your feedback helps us make Brewly better.</p>
          </div>
          <form onSubmit={submitReview} className="feedback-form">
            <label>Rating</label>
            <select
              value={review.rating}
              onChange={(event) =>
                setReview({ ...review, rating: Number(event.target.value) })
              }>
              <option value="5">★★★★★ — Excellent</option>
              <option value="4">★★★★☆ — Very good</option>
              <option value="3">★★★☆☆ — Good</option>
              <option value="2">★★☆☆☆ — Needs improvement</option>
              <option value="1">★☆☆☆☆ — Poor</option>
            </select>
            <label>Your feedback</label>
            <textarea
              required
              minLength="5"
              maxLength="500"
              value={review.message}
              onChange={(event) =>
                setReview({ ...review, message: event.target.value })
              }
              placeholder="Tell us about your coffee, service, or ordering experience..."
            />
            <button className="btn" type="submit">
              Submit feedback
            </button>
            {reviewMessage && (
              <p className="feedback-message">{reviewMessage}</p>
            )}
          </form>
        </section>

        <section className="orders-panel">
          <h2>Your orders</h2>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div>
                  <strong>Order #{order.id}</strong>
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <span className="order-status">
                  {order.order_status} · {order.payment_status}
                </span>
                <div className="order-reward-summary">
                  <b>
                    {currency} {Number(order.total).toFixed(2)}
                  </b>
                  <small>+{Number(order.loyalty_points_earned || 0)} pts</small>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {message && (
        <div className="toast">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      <Modal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        className="checkout-card">
        <form onSubmit={placeOrder}>
          <button
            type="button"
            className="modal-close"
            onClick={() => setCheckoutOpen(false)}>
            ×
          </button>
          <h2>Complete your order</h2>
          <div className="checkout-price-summary">
            <p>
              Subtotal{" "}
              <strong>
                {currency} {subtotal.toFixed(2)}
              </strong>
            </p>
            {discountAvailable && (
              <p className="discount-line">
                20% first-order discount{" "}
                <strong>
                  −{currency} {discount.toFixed(2)}
                </strong>
              </p>
            )}
            {loyaltyPoints >= 100 && (
              <label className="loyalty-redeem-option">
                <input
                  type="checkbox"
                  checked={redeemPoints}
                  onChange={(event) => setRedeemPoints(event.target.checked)}
                />
                <span>Redeem 100 points for 50 ETB off</span>
              </label>
            )}
            {redeemPoints && (
              <p className="discount-line loyalty-discount-line">
                Loyalty reward <strong>−{currency} 50.00</strong>
              </p>
            )}
            <p className="checkout-total">
              Total{" "}
              <strong>
                {currency} {total.toFixed(2)}
              </strong>
            </p>
          </div>
          <input
            required
            placeholder="Full name"
            value={form.customer_name}
            onChange={(event) =>
              setForm({ ...form, customer_name: event.target.value })
            }
          />
          <input
            required
            placeholder="Phone number"
            value={form.phone}
            onChange={(event) =>
              setForm({ ...form, phone: event.target.value })
            }
          />
          <input
            required
            placeholder="Delivery address"
            value={form.address}
            onChange={(event) =>
              setForm({ ...form, address: event.target.value })
            }
          />
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(event) =>
              setForm({ ...form, notes: event.target.value })
            }
          />
          <label className="checkout-payment-label">Payment method</label>
          <select
            value={form.payment_method}
            onChange={(event) =>
              setForm({ ...form, payment_method: event.target.value })
            }>
            {paymentOptions.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
          {form.payment_method === "telebirr" && (
            <p className="payment-help">
              You will be redirected to the secure Telebirr checkout after
              placing the order.
            </p>
          )}
          <button className="btn" type="submit">
            Place order · {currency} {total.toFixed(2)}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default User;
