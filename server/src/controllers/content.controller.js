import {
  getTestimonials,
  createTestimonial,
  addNewsletter,
  addContact,
} from "../models/content.model.js";

export async function testimonials(req, res) {
  res.json(await getTestimonials());
}

export async function createTestimonialHandler(req, res) {
  const rating = Number(req.body.rating);
  const message = String(req.body.message || "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  if (message.length < 5 || message.length > 500) {
    return res
      .status(400)
      .json({ message: "Feedback must be between 5 and 500 characters." });
  }

  const id = await createTestimonial(req.user.id, rating, message);

  res.status(201).json({
    id,
    rating,
    message,
    username: req.user.username,
  });
}

export async function newsletter(req, res) {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ message: "Enter a valid email" });
  await addNewsletter(email);
  res.json({ message: "Thanks for subscribing!" });
}

export async function contact(req, res) {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: "All contact fields are required" });
  await addContact(name, email, message);
  res.json({ message: "Message received. Thank you!" });
}
