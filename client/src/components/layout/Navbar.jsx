import { useState } from "react";
import useAuth from "../../features/auth/hooks/useAuth";
import useRouter from "../../hooks/useRouter";

function Navbar() {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
      <header>
        <nav>
          <div className="logo">
            <a href="#home" className="logo-icon"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5">
                  <path
                    d="M18.25 10.5h1.39c1.852 0 2.402.265 2.357 1.584c-.073 2.183-1.058 4.72-4.997 5.416" />
                  <path
                    d="M5.946 20.615C2.572 18.02 2.075 14.34 2.001 10.5c-.031-1.659.45-2 2.658-2h10.682c2.208 0 2.69.341 2.658 2c-.074 3.84-.57 7.52-3.945 10.115c-.96.738-1.77.885-3.135.885H9.081c-1.364 0-2.174-.147-3.135-.886Z" />
                  <path
                    strokeLinejoin="round"
                    d="M11.309 2.5C10.762 2.839 10 4 10 5.5M7.54 4S7 4.5 7 5.5M14.001 4c-.273.17-.501 1-.501 1.5" />
                </g>
              </svg>
            </a>
            <div className="brand-text">
              <h2 className="brand-name">Brewly.</h2>
              <p className="brand-tagline-static">COFFEE CO.</p>
            </div>
          </div>
          <ul className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
            <li className="nav-item"><a href="#home" className="nav-link" onClick={closeMenu}>Home</a></li>
            <li className="nav-item">
              <a href="#about" className="nav-link" onClick={closeMenu}>About</a>
            </li>
            <li className="nav-item">
              <a href="#services" className="nav-link" onClick={closeMenu}>Services</a>
            </li>
            <li className="nav-item"><a href="#menu" className="nav-link" onClick={closeMenu}>Menu</a></li>
            <li className="nav-item">
              <a href="#testimonials" className="nav-link" onClick={closeMenu}>Testimonials</a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link" onClick={closeMenu}>Contact</a>
            </li>
            {user && user.role !== "admin" && (
              <li className="nav-item"><a href="/user" className="nav-link" onClick={(e)=>{e.preventDefault();closeMenu();navigate("/user")}}>Order Now</a></li>
            )}
            {user?.role === "admin" && (
              <li className="nav-item">
                <a
                  href="/admin"
                  className="nav-link"
                  onClick={(e) => { e.preventDefault(); closeMenu(); navigate("/admin"); }}>
                  Admin
                </a>
              </li>
            )}
            <li className="nav-item">
              {user ? (
                <a
                  href="/"
                  className="nav-link"
                  onClick={(e) => { e.preventDefault(); closeMenu(); logout(); navigate("/"); }}>
                  Log Out
                </a>
              ) : (
                <a
                  href="/login"
                  className="nav-link"
                  onClick={(e) => { e.preventDefault(); closeMenu(); navigate("/login"); }}>
                  Login
                </a>
              )}
            </li>
          </ul>

          <button
            type="button"
            className={`nav-toggle ${menuOpen ? "nav-toggle-open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>
  );
}

export default Navbar;
