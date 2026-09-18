import { useContext, useMemo, useRef, useState } from "react";
import useAuth from "../../auth/hooks/useAuth";
import useRouter from "../../../hooks/useRouter";
import { MenuContext } from "../../../context/MenuContext";
import { assetUrl } from "../../../services/api";

const fallbackImage = "/menu/cappuccino.jpg";

function Menu() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const { products, categories, loading, error } = useContext(MenuContext);
  const [activeCategory, setActiveCategory] = useState("All");
  const scrollRef = useRef(null);

  const categoryNames = useMemo(() => {
    const names = categories.map((category) => category.name).filter(Boolean);
    const productCategoryNames = products
      .map((product) => product.category_name)
      .filter(Boolean);

    return [
      ...new Set([...names, ...productCategoryNames]),
    ];
  }, [categories, products]);

  const visibleProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((product) => product.category_name === activeCategory);
  }, [activeCategory, products]);

  const scrollMenu = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction * 285,
      behavior: "smooth",
    });
  };

  const handleViewFullMenu = () => {
    const destination = user
      ? user.role === "admin"
        ? "/admin"
        : "/user"
      : "/login";

    navigate(destination);
  };

  return (
    <section id="menu">
      <p className="section-title">OUR MENU</p>
      <h2 className="section-subtitle">Coffee, Treats & More</h2>
      <p className="menu-intro">
        Browse our full menu by category. Scroll through the products and find
        your next Brewly favorite.
      </p>

      <div className="menu-category-tabs" role="tablist" aria-label="Menu categories">
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === "All"}
          className={`menu-category-tab ${activeCategory === "All" ? "active" : ""}`}
          onClick={() => setActiveCategory("All")}
        >
          All
        </button>
        {categoryNames.map((category) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            className={`menu-category-tab ${activeCategory === category ? "active" : ""}`}
            key={category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-scroll-shell">
        {loading ? (
          <div className="menu-empty menu-scroll-state">Loading our menu...</div>
        ) : error ? (
          <div className="menu-empty menu-error menu-scroll-state">
            We could not connect to the Brewly menu right now. Please try again
            shortly.
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="menu-empty menu-scroll-state">
            No items are available in this category yet.
          </div>
        ) : (
          <div className="menu-scroll-track">
            <button
              type="button"
              className="menu-scroll-arrow menu-scroll-arrow-left"
              aria-label="Scroll menu left"
              onClick={() => scrollMenu(-1)}
            >
              &#10094;
            </button>
            <div
              className="database-menu-scroll"
              ref={scrollRef}
              aria-label={`${activeCategory} menu items`}
            >
            {visibleProducts.map((item) => (
              <article className="item menu-scroll-card" key={item.id}>
                <div className="item-img">
                  <img
                    src={assetUrl(item.image_url) || fallbackImage}
                    alt={item.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                  <span className="menu-image-badge">{item.category_name}</span>
                </div>
                <div className="item-info">
                  <div>
                    <p>{item.name}</p>
                    <small>
                      {item.description || "Freshly prepared at Brewly."}
                    </small>
                  </div>
                  <strong>ETB {Number(item.price).toFixed(2)}</strong>
                </div>
              </article>
            ))}
          </div>
            <button
              type="button"
              className="menu-scroll-arrow menu-scroll-arrow-right"
              aria-label="Scroll menu right"
              onClick={() => scrollMenu(1)}
            >
              &#10095;
            </button>
          </div>
        )}
      </div>

      <div className="menu-scroll-hint" aria-hidden="true">
        <span>←</span> Scroll to explore more <span>→</span>
      </div>

      <div className="menu-full-menu-action">
        <button className="btn" type="button" onClick={handleViewFullMenu}>
          View Full Menu & Order
        </button>
      </div>
    </section>
  );
}

export default Menu;
