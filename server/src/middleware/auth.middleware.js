import jwt from "jsonwebtoken";

const jwtSecret = String(process.env.JWT_SECRET || "").trim();
if (!jwtSecret) {
  throw new Error("JWT_SECRET is required in server/.env. Generate a long random secret before starting Brewly.");
}

export const sign = (u) =>
  jwt.sign(
    { id: u.id, email: u.email, username: u.username, role: u.role },
    jwtSecret,
    { expiresIn: "7d" },
  );

export async function auth(req, res, next) {
  try {
    const h = req.headers.authorization || "";
    if (!h.startsWith("Bearer "))
      return res.status(401).json({ message: "Authentication required" });
    req.user = jwt.verify(
      h.slice(7),
      jwtSecret,
    );
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired session" });
  }
}

export function admin(req, res, next) {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Admin access required" });
  next();
}
