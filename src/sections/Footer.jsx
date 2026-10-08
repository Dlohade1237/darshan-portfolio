import React from "react";
import FooterCharacter from "../components/FooterCharacter";

export default function Footer() {
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSocialMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const center = rect.width / 2;

    const rotation = ((x - center) / center) * 8;

    event.currentTarget.style.setProperty(
      "--social-tilt",
      `${rotation}deg`
    );
  };

  const resetSocialTilt = (event) => {
    event.currentTarget.style.setProperty(
      "--social-tilt",
      "0deg"
    );
  };

  const handleSignatureMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    event.currentTarget.style.setProperty(
      "--signature-x",
      `${x}px`
    );

    event.currentTarget.style.setProperty(
      "--signature-y",
      `${y}px`
    );

    event.currentTarget.style.setProperty(
      "--signature-glow-opacity",
      "1"
    );
  };

  const handleSignatureLeave = (event) => {
    event.currentTarget.style.setProperty(
      "--signature-glow-opacity",
      "0"
    );
  };

const renderSignature = (word) => {
  return word.split("").map((char, index) => (
    <span key={`${char}-${index}`}>{char}</span>
  ));
};

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* =====================================================
            FOOTER NAVIGATION
        ===================================================== */}
        <div className="footer-nav-row">

          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#home">HOME</a>
            <a href="#about">ABOUT</a>
            <a href="#work">PROJECTS</a>
            <a href="#approach">APPROACH</a>
            <a href="#resume">RESUME</a>
            <a href="#contact">CONTACT</a>
          </nav>

          <button
            type="button"
            className="footer-top-button"
            onClick={goToTop}
            aria-label="Back to top"
          >
            <span className="footer-top-circle">
              ↑
            </span>

            <span className="footer-top-label">
              BACK TO TOP
            </span>
          </button>

        </div>


        {/* =====================================================
            MAIN FOOTER STAGE
        ===================================================== */}
        <div className="footer-stage">

          {/* ===================================================
              LEFT — NAME + META
          =================================================== */}
          <div className="footer-identity">

            {/* Handwritten signature */}
<div
  className="footer-signature"
  aria-label="DARSHAN LOHADE"
  onMouseMove={handleSignatureMove}
  onMouseLeave={handleSignatureLeave}
>
  {/* Base signature */}
  <div className="footer-signature-base">
    <div className="footer-signature-line">{renderSignature("DARSHAN")}</div>
    <div className="footer-signature-line">{renderSignature("LOHADE")}</div>
  </div>

  {/* Cursor reveal layer */}
  <div className="footer-signature-glow" aria-hidden="true">
    <div className="footer-signature-line">{renderSignature("DARSHAN")}</div>
    <div className="footer-signature-line">{renderSignature("LOHADE")}</div>
  </div>
</div>

            {/* Footer information */}
            <div className="footer-meta">
              <p>
                Designed &amp; built with curiosity.
              </p>

              <p>
                © 2026 Darshan Lohade • All rights reserved.
              </p>
            </div>

          </div>


          {/* ===================================================
              CENTER — INTERACTIVE CHARACTER
          =================================================== */}
          <div className="footer-character-area">
            <FooterCharacter />
          </div>


          {/* ===================================================
              RIGHT — SOCIAL LINKS
          =================================================== */}
          <div className="footer-socials">

            {/* Instagram */}
            <a
              href="#"
              className="footer-social-pill"
              aria-label="Instagram"
              onMouseMove={handleSocialMove}
              onMouseLeave={resetSocialTilt}
            >
              <img
                src="/assets/social/Instagram.svg"
                alt="Instagram"
              />
            </a>


            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/darshan-lohade-72056b272/"
              className="footer-social-pill"
              aria-label="LinkedIn"
              onMouseMove={handleSocialMove}
              onMouseLeave={resetSocialTilt}
            >
              <img
                src="/assets/social/linkedin.svg"
                alt="LinkedIn"
              />
            </a>


            {/* Behance */}
            <a
              href="https://www.behance.net/darshanlohade"
              target="_blank"
              rel="noreferrer"
              className="footer-social-pill"
              aria-label="Behance"
              onMouseMove={handleSocialMove}
              onMouseLeave={resetSocialTilt}
            >
              <img
                src="/assets/social/behance.svg"
                alt="Behance"
              />
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
}