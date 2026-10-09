import React, { useEffect, useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvkzaypk";

export default function ContactModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isSubmitting, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
      setSubmissionStatus({ type: "", message: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionStatus({ type: "", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    const senderName = formData.get("name");
    const senderEmail = formData.get("email");

    formData.append(
      "_subject",
      `New portfolio enquiry from ${senderName}`
    );

    formData.append("_replyto", senderEmail);

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
        const errorMessage = result.errors
          ?.map((error) => error.message)
          .filter(Boolean)
          .join(" ");

        throw new Error(
          errorMessage ||
            "Your message could not be sent. Please try again."
        );
      }

      form.reset();

      setSubmissionStatus({
        type: "success",
        message:
          "Thanks for reaching out! Your message has been sent successfully.",
      });
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

  return (
    <div className="contact-modal">
      {/* Backdrop */}
      <button
        type="button"
        className="contact-modal-backdrop"
        aria-label="Close contact form"
        onClick={onClose}
        disabled={isSubmitting}
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
              disabled={isSubmitting}
              maxLength={120}
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
              disabled={isSubmitting}
              maxLength={254}
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
              disabled={isSubmitting}
              maxLength={30}
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
              disabled={isSubmitting}
              maxLength={5000}
            />
          </div>

          {/* Submission feedback */}
          {submissionStatus.message && (
            <p
              className={`contact-form-status contact-form-status--${submissionStatus.type}`}
              role={submissionStatus.type === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {submissionStatus.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="contact-submit"
            disabled={isSubmitting}
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
    </div>
  );
}