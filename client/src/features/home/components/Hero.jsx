import useRouter from "../../../hooks/useRouter";
import useAuth from "../../auth/hooks/useAuth";

function Hero() {
  const { navigate } = useRouter();
  const { user } = useAuth();

  return (
    <section id="home">
      <div className="home-text animation-slideUp">
        <h2 className="home-subtitle">Good day starts with</h2>
        <h1 className="home-title">Great Coffee Made For You</h1>
        <p className="home-description">
          We serve the richest, smoothest coffee crafted from the finest beans.
        </p>

        <a
          href={user ? (user.role === "admin" ? "/admin" : "/user") : "/login"}
          className="btn"
          onClick={(event) => {
            event.preventDefault();
            navigate(user ? (user.role === "admin" ? "/admin" : "/user") : "/login");
          }}>
          Order Now
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16">
            <path d="M0 0h16v16H0z" fill="none" />
            <path
              fill="currentColor"
              d="m14 13l-4 1H4l-4-1v-1h14zm.7-10H13V2H1v5c0 1.5.8 2.8 2 3.4v.6h8v-.6c.9-.5 1.6-1.4 1.9-2.4h.1c2.3 0 2.9-2 3-3.5c.1-.8-.5-1.5-1.3-1.5M13 7V4h1.7c.1 0 .2.1.2.1s.1.1.1.3C14.8 7 13.4 7 13 7"
            />
          </svg>
        </a>
        <a href="#menu" className="btn1">
          View Menu
        </a>
        <p className="hero-order-hint">
          Sign in or create an account to order online.
        </p>

        <div className="features">
          <div className="feature-item">
            <svg
              className="feature-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2">
                <path d="M5 21c.5-4.5 2.5-8 7-10" />
                <path d="M9 18c6.218 0 10.5-3.288 11-12V4h-4.014c-9 0-11.986 4-12 9c0 1 0 3 2 5z" />
              </g>
            </svg>
            <div className="feature-text">
              <p className="feature-title">100% Organic</p>
              <p className="feature-subtitle">Coffee Beans</p>
            </div>
          </div>

          <div className="feature-item">
            <svg
              className="feature-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M13 5.649c-2.842-2.842-6.792-3.5-8.822-1.47m0 0c-2.03 2.03-1.371 5.979 1.47 8.821m-1.47-8.822c.245 1.226 1.544 3.896 4.78 4.778m.253 10.833c2.086 2.086 6.146 1.41 9.067-1.511c2.92-2.921 3.597-6.98 1.51-9.067M9.212 19.79c-2.086-2.087-1.41-6.146 1.511-9.067c2.921-2.92 6.98-3.597 9.067-1.51M9.21 19.788c1.511-.504 4.372-.917 5.667-5.667c.907-3.324 3.652-4.659 4.91-4.91"
              />
            </svg>
            <div className="feature-text">
              <p className="feature-title">Freshly Brewed</p>
              <p className="feature-subtitle">Every Day</p>
            </div>
          </div>

          <div className="feature-item feature-last">
            <svg
              className="feature-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.7">
                <path d="m5 7l1.76 10.405c.306 1.808.46 2.713 1 3.337c1.454 1.677 7.026 1.677 8.48 0c.54-.624.694-1.529 1-3.337L19 7M5 7l.743-1.712c.609-1.404.913-2.106 1.548-2.502c1.59-.993 7.654-1.102 9.418 0c.635.396.94 1.098 1.548 2.502L19 7M4 7h16" />
                <ellipse cx="12" cy="14.5" rx="2" ry="2.5" />
              </g>
            </svg>
            <div className="feature-text">
              <p className="feature-title">Fast & Safe</p>
              <p className="feature-subtitle">Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
