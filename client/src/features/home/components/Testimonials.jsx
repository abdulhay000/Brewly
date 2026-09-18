import { useEffect, useState } from "react";
import { api } from "../../../services/api";

const fallbackTestimonials = [
  { id: "default-1", rating: 5, message: "The best coffee I've ever had! Brewly never disappoints.", username: "Sarah J." },
  { id: "default-2", rating: 5, message: "Cozy spot, great pastries, and the loyalty rewards actually add up fast. My new go-to café.", username: "Mohammed A." },
  { id: "default-3", rating: 5, message: "The coffee is rich, fresh, and consistently delicious.", username: "Daniel K." },
  { id: "default-4", rating: 4, message: "Friendly service, fresh pastries, and a relaxing atmosphere.", username: "Liya M." },
];

function Stars({ rating }) {
  return (
    <div aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span className="star" key={star}>{star <= rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

function Testimonials() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    api.testimonials()
      .then((items) => {
        if (items.length) setTestimonials(items.slice(0, 4));
      })
      .catch(() => {
        // Keep the original v3 testimonials visible if the API is unavailable.
      });
  }, []);

  return (
    <section id="testimonials">
      <div className="testimonial-texts">
        {testimonials.slice(0, 4).map((item) => (
          <article className="testimonial-text" key={item.id}>
            <Stars rating={Number(item.rating)} />
            <p>"{item.message}"</p>
            <p>
              <svg className="profile" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 48 48">
                <path d="M0 0h48v48H0z" fill="none" />
                <g fill="currentColor">
                  <path d="M32 20a8 8 0 1 1-16 0a8 8 0 0 1 16 0" />
                  <path fillRule="evenodd" d="M23.184 43.984C12.517 43.556 4 34.772 4 24C4 12.954 12.954 4 24 4s20 8.954 20 20s-8.954 20-20 20h-.274q-.272 0-.542-.016M11.166 36.62a3.028 3.028 0 0 1 2.523-4.005c7.796-.863 12.874-.785 20.632.018a2.99 2.99 0 0 1 2.498 4.002A17.94 17.94 0 0 0 42 24c0-9.941-8.059-18-18-18S6 14.059 6 24c0 4.916 1.971 9.373 5.166 12.621" clipRule="evenodd" />
                </g>
              </svg>
              {item.username || "Brewly Customer"}
            </p>
          </article>
        ))}
      </div>
      <div className="discount">
        <p className="section-title">BREWLY SPECIAL</p>
        <p className="discount-text1">20% off your first order</p>
        <p className="discount-text2">New customers receive a real first-order discount at checkout.</p>
      </div>
    </section>
  );
}

export default Testimonials;
