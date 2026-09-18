import Home from "../pages/Home";
import Login from "../features/auth/components/LoginForm";
import Admin from "../pages/Admin";
import User from "../pages/User";
import useRouter from "../hooks/useRouter";
import useAuth from "../features/auth/hooks/useAuth";

export default function AppRoutes() {
  const { path } = useRouter();
  const { user } = useAuth();

  if (path === "/login") return <Login />;
  if (path === "/user") return user ? <User /> : <Login />;

  if (path === "/admin") {
    if (!user) return <Login redirectTo="/admin" />;
    if (user.role !== "admin") return <Login accessDenied />;
    return <Admin />;
  }

  return <Home />;
}
