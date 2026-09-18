import bcrypt from "bcryptjs";
import {
  findUserByEmailOrUsername,
  findExistingUser,
  createUser,
} from "../models/user.model.js";
import { sign } from "../middleware/auth.middleware.js";

export async function registerUser(input) {
  let { email, username, password } = input;
  email = String(email || "")
    .trim()
    .toLowerCase();
  username = String(username || "").trim();
  password = String(password || "");

  if (!email || !username || password.length < 6) {
    const error = new Error(
      "Email, username and a password of at least 6 characters are required.",
    );
    error.statusCode = 400;
    throw error;
  }

  const exists = await findExistingUser(email, username);
  if (exists.length) {
    const error = new Error("Email or username is already registered.");
    error.statusCode = 409;
    throw error;
  }

  const hash = await bcrypt.hash(password, 12);
  const configuredAdminEmail = String(process.env.ADMIN_EMAIL || "")
    .trim()
    .toLowerCase();
  const role =
    configuredAdminEmail && email === configuredAdminEmail ? "admin" : "user";

  const result = await createUser(email, username, hash, role);
  const user = { id: result.insertId, email, username, role };
  return { token: sign(user), user };
}

export async function loginUser(input) {
  const identifier = String(input.identifier || "").trim();
  const password = String(input.password || "");
  const u = await findUserByEmailOrUsername(identifier);

  if (
    !u ||
    !(await bcrypt.compare(password, u.password_hash))
  ) {
    const error = new Error("Invalid email/username or password.");
    error.statusCode = 401;
    throw error;
  }

  const user = { id: u.id, email: u.email, username: u.username, role: u.role };
  return { token: sign(user), user };
}
