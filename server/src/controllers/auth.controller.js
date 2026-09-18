import { registerUser, loginUser } from "../services/auth.service.js";
import { findUserById, getLoyaltyPoints } from "../models/user.model.js";

export async function signup(req, res) {
  try {
    return res.status(201).json(await registerUser(req.body));
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(error.statusCode || 500).json({
      message:
        error.statusCode === 400 || error.statusCode === 409
          ? error.message
          : "Could not create account. Check the server/database connection.",
    });
  }
}

export async function login(req, res) {
  try {
    res.json(await loginUser(req.body));
  } catch (e) {
    console.error(e);
    res.status(e.statusCode || 500).json({
      message: e.statusCode === 401 ? e.message : "Login failed",
    });
  }
}

export async function me(req, res) {
  const user = await findUserById(req.user.id);
  res.json(user);
}

export async function loyalty(req, res) {
  res.json({ loyalty_points: await getLoyaltyPoints(req.user.id) });
}
