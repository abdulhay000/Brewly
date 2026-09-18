import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";

export const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const [p, c] = await Promise.all([api.products(), api.categories()]);
      setProducts(p);
      setCategories(c);
    } catch (requestError) {
      setError(requestError.message || "Could not load the menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <MenuContext.Provider value={{ products, categories, loading, error, refresh }}>
      {children}
    </MenuContext.Provider>
  );
}
