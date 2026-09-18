import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useRouter from "../../../hooks/useRouter";

function Login({ redirectTo, accessDenied }) {
  const { login, signup, error, isSubmitting, user } = useAuth();
  const { navigate } = useRouter();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (mode === "signup") {
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }

      const createdUser = await signup(email, username, password);
      if (createdUser) {
        navigate(createdUser.role === "admin" ? "/admin" : "/user");
      }
      return;
    }

    const loggedInUser = await login(username, password);
    if (loggedInUser) {
      navigate(
        loggedInUser.role === "admin" ? redirectTo || "/admin" : "/user",
      );
    }
  };

  if (accessDenied && user) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <p className="section-title">BREWLY ACCESS</p>
          <h1 className="auth-title">Admins only</h1>
          <p>Your account does not have administrator access.</p>
          <button className="btn auth-submit" onClick={() => navigate("/")}>
            Back home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <button className="auth-brand" onClick={() => navigate("/")}>
          <span className="auth-brand-icon">☕</span>
          <span>
            <strong>Brewly.</strong>
            <small>COFFEE CO.</small>
          </span>
        </button>

        <p className="section-title">WELCOME TO BREWLY</p>
        <h1 className="auth-title">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="auth-description">
          {mode === "signup"
            ? "Join Brewly and order your favorite coffee online."
            : ""}
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={
              mode === "signin" ? "auth-tab auth-tab-active" : "auth-tab"
            }
            onClick={() => setMode("signin")}>
            Sign In
          </button>
          <button
            type="button"
            className={
              mode === "signup" ? "auth-tab auth-tab-active" : "auth-tab"
            }
            onClick={() => setMode("signup")}>
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">
              {mode === "signup" ? "Username" : "Email or username"}
            </label>
            <input
              id="username"
              type="text"
              placeholder={
                mode === "signup" ? "Choose a username" : "Email or username"
              }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
            />
          </div>

          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          {(localError || error) && (
            <p className="auth-error">{localError || error}</p>
          )}

          <button className="btn auth-submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <button className="btn1 auth-home-link" onClick={() => navigate("/")}>
          Back to landing page
        </button>
      </div>
    </section>
  );
}

export default Login;
