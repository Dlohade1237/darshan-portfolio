import React, { useEffect } from "react";

export default function ContactModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    // Form submission will be connected later.
    console.log("Contact form submitted");
  };

  return (
    <div className="contact-modal">

      {/* Backdrop */}
      <button
        type="button"
        className="contact-modal-backdrop"
        aria-label="Close contact form"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="contact-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        {/* Close */}
        <button
          type="button"
          className="contact-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="24"
              height="24"
              rx="5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 8L18 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M18 8L8 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="contact-modal-header">
          <div className="contact-modal-chip">
            LET’S TALK
          </div>

          <h2 id="contact-modal-title" className="contact-modal-title">
            <span>Have Something</span>
            <span>In Mind?</span>
          </h2>

          <p className="contact-modal-description">
            tell me a little about what you’re working on, and let’s create
            something meaningful together
          </p>
        </div>

        {/* Form */}
        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >
          {/* Name */}
          <div className="contact-field">
            <label htmlFor="contact-name">
              YOUR NAME
            </label>

            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="what should i call you?"
              autoComplete="name"
              required
            />
          </div>

          {/* Email */}
          <div className="contact-field">
            <label htmlFor="contact-email">
              YOUR EMAIL
            </label>

            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="please provide your email address."
              autoComplete="email"
              required
            />
          </div>

          {/* Phone */}
          <div className="contact-field">
            <label htmlFor="contact-phone">
              YOUR PHONE NUMBER
            </label>

            <input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="what is your contact number?"
              autoComplete="tel"
            />
          </div>

          {/* Message */}
          <div className="contact-field contact-field-message">
            <label htmlFor="contact-message">
              YOUR MESSAGE
            </label>

            <textarea
              id="contact-message"
              name="message"
              placeholder="tell me a little about your project, idea, or challenge..."
              rows="3"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="contact-submit"
            >
            <span>SEND MESSAGE</span>

            <svg
                className="contact-submit-arrow"
                width="20"
                height="20"
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <g className="contact-submit-arrow-icon">
                <path
                    d="M2 18L20 2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M11 2H20V11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                </g>
            </svg>
            </button>

            {/* Email alternative */}
            <div className="contact-email-alternative">
            <span className="contact-email-label">
                prefer email?
            </span>

            <a
                href="mailto:darshanlohade.edu@gmail.com"
                className="contact-email-link"
            >
                <span>darshanlohade.edu@gmail.com</span>

                <span className="contact-email-arrow">
                ↗
                </span>
            </a>
            </div>

        </form>
      </div>
    </div>
  );
}