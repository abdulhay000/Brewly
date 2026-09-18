import { createContext, useCallback, useEffect, useState } from "react";

// A minimal client-side router. The project only depends on react/react-dom,
// so this avoids adding react-router-dom as a new dependency for two
// destination pages. If the app grows more pages, swapping this out for
// react-router-dom later is a drop-in change — nothing outside this file
// and useRouter.js needs to know the difference.

export const RouterContext = createContext(null);

export function RouterProvider({ children }) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((to) => {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}
