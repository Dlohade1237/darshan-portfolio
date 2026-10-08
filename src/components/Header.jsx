import React, { useEffect, useState } from "react";

const links = [
  ["ABOUT ME", "#about"],
  ["WORK", "#work"],
  ["APPROACH", "#approach"],
  [
    "RESUME",
    "https://drive.google.com/file/d/1BaEkIiGo8ukbP0IPDxxULaqrGVCEKd8q/view?usp=sharing",
  ],
];

export default function Header() {
  const [isFooterVisible, setIsFooterVisible] =
    useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);


  /* =========================================================
     FOOTER VISIBILITY
  ========================================================= */

  useEffect(() => {
    const footer =
      document.querySelector(".site-footer");

    if (!footer) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setIsFooterVisible(
            entry.isIntersecting
          );
        },
        {
          threshold: 0.15,
        }
      );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);


  /* =========================================================
     LOCK PAGE SCROLL WHEN MOBILE MENU IS OPEN
  ========================================================= */

  useEffect(() => {
    document.body.classList.toggle(
      "mobile-menu-open",
      isMobileMenuOpen
    );

    return () => {
      document.body.classList.remove(
        "mobile-menu-open"
      );
    };
  }, [isMobileMenuOpen]);


  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);


  /* =========================================================
     HELPERS
  ========================================================= */

  const hiddenClass =
    isFooterVisible
      ? "header-footer-hidden"
      : "";


  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };


  const handleInternalLink = () => {
    closeMobileMenu();
  };


  const handleLetsTalk = (event) => {
    event.preventDefault();

    closeMobileMenu();

    window.dispatchEvent(
      new CustomEvent(
        "open-contact-modal"
      )
    );
  };


  return (
    <>
      {/* =====================================================
          HEADER GLASS

          Desktop:
          Long navigation glass pill

          Tablet / Mobile:
          Circular glass behind hamburger
      ===================================================== */}

      <div
        className={`header-glass ${hiddenClass}`}
        aria-hidden="true"
      />


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className={`site-header ${hiddenClass}`}
      >

        {/* ===================================================
            D + L MONOGRAM
        =================================================== */}

        <a
          className="brand-mark"
          href="#home"
          aria-label="Darshan Lohade home"
          onClick={
            closeMobileMenu
          }
        >
          <span className="logo-letter logo-d">
            D
          </span>

          <span className="logo-letter logo-l">
            L
          </span>
        </a>


        {/* ===================================================
            DESKTOP NAVIGATION

            Visible only on desktop.
        =================================================== */}

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
        >
          {links.map(
            ([label, href]) => {
              const isExternal =
                href.startsWith("http");

              return (
                <a
                  key={label}
                  href={href}
                  {...(
                    isExternal
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {}
                  )}
                >
                  {label}
                </a>
              );
            }
          )}


          {/* ===============================================
              DESKTOP LET'S TALK
          =============================================== */}

          <a
            className="header-cta"
            href="#contact"
            onClick={
              handleLetsTalk
            }
          >
            LET&apos;S TALK
          </a>
        </nav>


        {/* ===================================================
            TABLET / MOBILE HAMBURGER

            Uses your custom SVG.
        =================================================== */}

        <button
          className={`mobile-menu ${
            isMobileMenuOpen
              ? "is-open"
              : ""
          }`}
          type="button"
          aria-label={
            isMobileMenuOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={
            isMobileMenuOpen
          }
          onClick={() =>
            setIsMobileMenuOpen(
              (previous) =>
                !previous
            )
          }
        >
          <img
            src="/assets/Hamburger-Menu.svg"
            alt=""
            aria-hidden="true"
            draggable="false"
          />
        </button>

      </header>


      {/* =====================================================
          TABLET / MOBILE MENU
      ===================================================== */}

      <div
        className={`mobile-menu-overlay ${
          isMobileMenuOpen
            ? "is-open"
            : ""
        } ${hiddenClass}`}
        aria-hidden={
          !isMobileMenuOpen
        }
      >

        {/* ===================================================
            BLURRED BACKDROP
        =================================================== */}

        <div
          className="mobile-menu-backdrop"
          onClick={
            closeMobileMenu
          }
        />


        {/* ===================================================
            MENU PANEL
        =================================================== */}

        <div className="mobile-menu-panel">

          {/* ===============================================
              CLOSE BUTTON
          =============================================== */}

          <button
            className="mobile-menu-close"
            type="button"
            aria-label="Close menu"
            onClick={
              closeMobileMenu
            }
          >
            <span />
            <span />
          </button>


          {/* ===============================================
              MOBILE NAVIGATION
          =============================================== */}

          <nav
            className="mobile-nav"
            aria-label="Mobile navigation"
          >

            <a
              href="#home"
              onClick={
                handleInternalLink
              }
            >
              HOME
            </a>


            <a
              href="#about"
              onClick={
                handleInternalLink
              }
            >
              ABOUT
            </a>


            <a
              href="#work"
              onClick={
                handleInternalLink
              }
            >
              PROJECTS
            </a>


            <a
              href="#approach"
              onClick={
                handleInternalLink
              }
            >
              APPROACH
            </a>


            {/* =============================================
                RESUME
            ============================================= */}

            <a
              href="https://drive.google.com/file/d/1BaEkIiGo8ukbP0IPDxxULaqrGVCEKd8q/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              onClick={
                closeMobileMenu
              }
            >
              RESUME
            </a>


            {/* =============================================
                LET'S TALK
            ============================================= */}

            <a
              href="#contact"
              onClick={
                handleLetsTalk
              }
            >
              LET&apos;S TALK
            </a>

          </nav>

        </div>
      </div>
    </>
  );
}