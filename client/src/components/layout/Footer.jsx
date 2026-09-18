import { useState } from "react";
import Modal from "../common/Modal";
import { api } from "../../services/api";

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const submitNewsletter = async (event) => {
    event.preventDefault();
    setNewsletterMessage("");
    try {
      const result = await api.newsletter(newsletterEmail.trim());
      setNewsletterEmail("");
      setNewsletterMessage(result.message || "Thanks for subscribing to Brewly!");
    } catch (error) {
      setNewsletterMessage(error.message);
    }
  };

  const submitContact = async (event) => {
    event.preventDefault();
    setContactMessage("");
    try {
      const result = await api.contact(contactForm);
      setContactForm({ name: "", email: "", message: "" });
      setContactMessage(result.message || "Your message has been sent. Thank you!");
    } catch (error) {
      setContactMessage(error.message);
    }
  };

  return (
    <footer>
      <div className="footer">
        <div>
          <div className="logo">
            <a href="#home" className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
                  <path d="M18.25 10.5h1.39c1.852 0 2.402.265 2.357 1.584c-.073 2.183-1.058 4.72-4.997 5.416" />
                  <path d="M5.946 20.615C2.572 18.02 2.075 14.34 2.001 10.5c-.031-1.659.45-2 2.658-2h10.682c2.208 0 2.69.341 2.658 2c-.074 3.84-.57 7.52-3.945 10.115c-.96.738-1.77.885-3.135.885H9.081c-1.364 0-2.174-.147-3.135-.886Z" />
                  <path strokeLinejoin="round" d="M11.309 2.5C10.762 2.839 10 4 10 5.5M7.54 4S7 4.5 7 5.5M14.001 4c-.273.17-.501 1-.501 1.5" />
                </g>
              </svg>
            </a>
            <div className="brand-text">
              <h2 className="brand-name">Brewly.</h2>
              <p className="brand-tagline-static">COFFEE CO.</p>
            </div>
          </div>
          <p className="footer-text">Brewing happiness, one cup at a time.</p>
          <form className="newsletter-form" onSubmit={submitNewsletter}>
            <label htmlFor="footer-newsletter">Join our newsletter</label>
            <div>
              <input id="footer-newsletter" type="email" required value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="Your email address" />
              <button type="submit">Subscribe</button>
            </div>
            {newsletterMessage && <p className="footer-form-message">{newsletterMessage}</p>}
          </form>
        </div>

        <div className="footer-smallScreen">
          <div className="footerText-container">
            <p>Quick Links</p>
            <div className="footer-info">
              <p><a href="#home">Home</a></p>
              <p><a href="#about">About</a></p>
              <p><a href="#services">Services</a></p>
              <p><a href="#menu">Menu</a></p>
              <p><button className="footer-link-button" type="button" onClick={() => setContactOpen(true)}>Contact</button></p>
            </div>
          </div>

          <div className="footerText-container">
            <p>Services</p>
            <div className="footer-info">
              <p>Delivery</p>
              <p>Take Away</p>
              <p>Loyalty Points</p>
            </div>
          </div>

          <div id="contact" className="footerText-container">
            <p>Contact Us</p>
            <div className="footer-info">
              <p>
                Addis Ababa Street,
                <br />
                Addis Ababa, Ethiopia (placeholder)
              </p>
              <p className="contact">
                +251 91 234 5678 (placeholder)
                <br />
                Hello@brewlycoffee.com
              </p>
              <button className="footer-contact-button" type="button" onClick={() => setContactOpen(true)}>Send us a message</button>
            </div>
          </div>

          <div className="socialMedia-links">
            <p>Follow Us</p>
            <div>
              <a href="https://facebook.com/profile.php?id=61593451721719" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="https://instagram.com/mr_moneyabdu" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="https://www.tiktok.com/@abdughost1" target="_blank" rel="noopener noreferrer" aria-label="Tiktok"><i className="fa-brands fa-tiktok"></i></a>
              <a href="https://pinterest.com/abdulhayabduselam" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><i className="fa-brands fa-pinterest-p"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-end">
        <p>© 2026 Brewly Coffee Co. All Rights Reserved.</p>
      </div>

      <Modal isOpen={contactOpen} onClose={() => setContactOpen(false)} className="contact-modal">
        <button type="button" className="modal-close" onClick={() => setContactOpen(false)}>×</button>
        <h2>Contact Brewly</h2>
        <p className="contact-modal-intro">Have a question or suggestion? Send us a message.</p>
        <form className="contact-form" onSubmit={submitContact}>
          <input required maxLength="150" placeholder="Your name" value={contactForm.name} onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })} />
          <input required type="email" placeholder="Your email" value={contactForm.email} onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })} />
          <textarea required minLength="5" maxLength="2000" placeholder="Your message" value={contactForm.message} onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })} />
          <button className="btn" type="submit">Send message</button>
          {contactMessage && <p className="footer-form-message">{contactMessage}</p>}
        </form>
      </Modal>
    </footer>
  );
}

export default Footer;
