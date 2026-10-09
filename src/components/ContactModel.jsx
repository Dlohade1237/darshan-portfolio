import React, { useEffect, useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvkzaypk";

const EMPTY_STATUS = {
  type: "",
  message: "",
};

export default function ContactModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [submissionStatus, setSubmissionStatus] =
    useState(EMPTY_STATUS);

  /* =========================================================
     BODY SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  /* =========================================================
     KEYBOARD — ESCAPE
  ========================================================= */

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  /* =========================================================
     RESET WHEN MODAL CLOSES
  ========================================================= */

  useEffect(() => {
    if (isOpen) return;

    setIsSubmitting(false);
    setShowThankYou(false);
    setSubmissionStatus(EMPTY_STATUS);
  }, [isOpen]);

  /* =========================================================
     SUBMIT FORM TO FORMSPREE
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const senderName = String(formData.get("name") || "").trim();
    const senderEmail = String(formData.get("email") || "").trim();

    setIsSubmitting(true);
    setSubmissionStatus(EMPTY_STATUS);

    // Formspree email subject and reply-to address
    formData.set(
      "_subject",
      `New portfolio enquiry from ${senderName || "a visitor"}`
    );

    formData.set("_replyto", senderEmail);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = result.errors
          ?.map((error) => error.message)
          .filter(Boolean)
          .join(" ");

        throw new Error(
          apiMessage ||
            "Your message couldn't be sent. Please try again."
        );
      }

      // Clear the form and show the thank-you popup
      form.reset();

      setSubmissionStatus(EMPTY_STATUS);
      setShowThankYou(true);
    } catch (error) {
      setSubmissionStatus({
        type: "error",
        message:
          error.message ||
          "Something went wrong. Please try again or email me directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     CLOSE THANK-YOU + CONTACT MODAL
  ========================================================= */

  const closeThankYou = () => {
    setShowThankYou(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal">
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <button
        type="button"
        className="contact-modal-backdrop"
        aria-label="Close contact form"
        onClick={onClose}
        disabled={isSubmitting}
      />

      {/* =====================================================
          CONTACT MODAL
      ===================================================== */}

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
          disabled={isSubmitting}
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

          <h2
            id="contact-modal-title"
            className="contact-modal-title"
          >
            <span>Have Something</span>
            <span>In Mind?</span>
          </h2>

          <p className="contact-modal-description">
            tell me a little about what you’re working on, and let’s create
            something meaningful together
          </p>
        </div>

        {/* ===================================================
            CONTACT FORM
        =================================================== */}

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
              maxLength={120}
              disabled={isSubmitting}
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
              maxLength={254}
              disabled={isSubmitting}
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
              maxLength={30}
              disabled={isSubmitting}
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
              maxLength={5000}
              disabled={isSubmitting}
            />
          </div>

          {/* Submission error */}
          {submissionStatus.message && (
            <p
              className={`contact-form-status contact-form-status--${submissionStatus.type}`}
              role="alert"
              aria-live="polite"
            >
              {submissionStatus.message}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="contact-submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            <span>
              {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
            </span>

            {!isSubmitting && (
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
            )}
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
              <span className="contact-email-arrow">↗</span>
            </a>
          </div>
        </form>
      </div>

      {/* =====================================================
          THANK-YOU POPUP
          Appears only after successful submission
      ===================================================== */}

      {showThankYou && (
        <div
          className="contact-thankyou-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeThankYou();
            }
          }}
        >
          <div
            className="contact-thankyou-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-thankyou-title"
            aria-describedby="contact-thankyou-description"
          >
            {/* Close */}
            <button
              type="button"
              className="contact-thankyou-close"
              aria-label="Close thank-you message"
              onClick={closeThankYou}
              autoFocus
            >
              <span aria-hidden="true">×</span>
            </button>

            {/* Success icon */}
            <div
              className="contact-thankyou-icon"
              aria-hidden="true"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 12.5L10 17L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Content */}
            <span className="contact-thankyou-eyebrow">
              MESSAGE SENT
            </span>

            <h2 id="contact-thankyou-title">
              Thank You!
            </h2>

            <p id="contact-thankyou-description">
              Thanks for reaching out. Your message has been sent
              successfully. I&apos;ll get back to you as soon as I can.
            </p>

            {/* Return to portfolio */}
            <button
              type="button"
              className="contact-thankyou-button"
              onClick={closeThankYou}
            >
              <span>BACK TO PORTFOLIO</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}