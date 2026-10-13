import React, { useEffect, useRef, useState } from "react";

import useReveal from "../hooks/useReveal"; // adjust the path if needed

/* =========================================================
   CLOUDINARY IMAGES
   - Portraits have a 400px and a 700px version, so
     smaller screens don't download the larger file.
   - f_auto serves AVIF/WebP where supported.
========================================================= */

const CLOUD = "https://res.cloudinary.com/m1xt1lo4/image/upload";

const cloudinaryImage = (version, file, width) =>
  `${CLOUD}/w_${width},c_limit,f_auto,q_auto/${version}/${file}`;

const PORTRAIT_WIDTHS = [400, 700];

// Roughly the card's rendered width: ~80% of the screen on phones,
// a fixed size on larger screens. Adjust 420px to match your CSS.
const PORTRAIT_SIZES = "(max-width: 576px) 80vw, 420px";

const aboutPortraits = [
  { id: 1, version: "v1791813709", file: "1-curious-portrait.png", alt: "Curious" },
  { id: 2, version: "v1791813730", file: "2-exploring-portrait.png", alt: "Exploring" },
  { id: 3, version: "v1791813772", file: "3-experimenting-portrait.png", alt: "Experimenting" },
  { id: 4, version: "v1791813783", file: "4-discovering-portrait.png", alt: "Discovering" },
  { id: 5, version: "v1791813785", file: "5-traditional-portrait.png", alt: "Traditional" },
  { id: 6, version: "v1791813749", file: "6-creating-portrait.png", alt: "Creating" },
];

const buildSrcSet = (portrait) =>
  PORTRAIT_WIDTHS.map(
    (width) =>
      `${cloudinaryImage(portrait.version, portrait.file, width)} ${width}w`
  ).join(", ");

// Image inside the "My Journey" popup
const CHILDHOOD_SRC = cloudinaryImage(
  "v1791813693",
  "childhood-portrait.png",
  700
);

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Flips to true when the section is still ~1500px away
  const [imagesWarm, setImagesWarm] = useState(false);

  const sectionRef = useRef(null);
  const childhoodPreload = useRef(null);

  const pointerStartX = useRef(0);
  const pointerCurrentX = useRef(0);
  const isDragging = useRef(false);

  /* =========================================================
     ENTRY ANIMATIONS
     Animates every element in this section marked with
     data-reveal as it scrolls into view.
  ========================================================= */

  useReveal(sectionRef);

  /* =========================================================
     LOAD IMAGES BEFORE THE SECTION IS VISIBLE
  ========================================================= */

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      setImagesWarm(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setImagesWarm(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1500px 0px" }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =========================================================
     PRELOAD THE POPUP IMAGE
  ========================================================= */

  useEffect(() => {
    if (!imagesWarm) return;

    const image = new Image();

    image.decoding = "async";
    image.src = CHILDHOOD_SRC;

    // Keep a reference so the browser doesn't drop the request
    childhoodPreload.current = image;
  }, [imagesWarm]);

  /* =========================================================
     POPUP SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    if (!isExpanded) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    if (!isExpanded) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isExpanded]);

  /* =========================================================
     SWIPE HELPERS
  ========================================================= */

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % aboutPortraits.length);
  };

  const goPrevious = () => {
    setActiveIndex(
      (current) =>
        (current - 1 + aboutPortraits.length) % aboutPortraits.length
    );
  };

  /* =========================================================
     POINTER SWIPE
  ========================================================= */

  const handlePointerDown = (event) => {
    pointerStartX.current = event.clientX;
    pointerCurrentX.current = event.clientX;

    isDragging.current = true;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging.current) return;

    pointerCurrentX.current = event.clientX;
  };

  const handlePointerUp = (event) => {
    if (!isDragging.current) return;

    const distance = pointerCurrentX.current - pointerStartX.current;

    isDragging.current = false;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released.
    }

    if (Math.abs(distance) < 60) return;

    if (distance < 0) {
      goNext();
    } else {
      goPrevious();
    }
  };

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      <div className="about-inner">
        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div className="about-copy">
          <div className="about-eyebrow" data-reveal="up">
            ABOUT ME
          </div>

          <h2 className="about-title" data-reveal="lines" data-delay="0.1">
            <span>I wanted to Design Spaces.</span>
            <span>I Ended Up Designing</span>
            <span className="about-title-blue">Digital Experiences.</span>
          </h2>

          <div
            className="about-description"
            data-reveal="up"
            data-delay="0.2"
          >
            <p>
              I’m Darshan Lohade, a UI/UX Designer who enjoys turning ideas
              into clear, thoughtful experiences. My journey began with an
              interest in architecture and designing spaces, eventually
              leading me through Computer Science and into product and
              digital design.
            </p>

            <p>
              Today, I work as a UI/UX Designer at Bits and Volts, creating
              interfaces, systems, and experiences that bring structure to
              complex ideas.
            </p>
          </div>

          {/* =====================================================
              READ MORE
          ===================================================== */}

          <div
            className="about-read-more-wrap"
            data-reveal="up"
            data-delay="0.3"
          >
            <div className="about-read-more-note">
              <span>A little more</span>
              <span>about my journeys</span>
            </div>

            {/* EXISTING CTA ARROW */}

            <svg
              className="about-read-more-arrow"
              viewBox="0 0 120 130"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="
                  M 52 4
                  C 51 25 50 45 43 63
                  C 36 81 23 96 7 105
                  C 4 107 2 108 1 108
                "
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <g className="about-arrow-head">
                <path
                  d="M 1 108 L 13 103"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M 1 108 L 11 114"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>

            <button
              type="button"
              className="about-read-more"
              onClick={() => setIsExpanded(true)}
            >
              <span>READ MORE...</span>

              <span className="about-read-more-icon">↗</span>
            </button>
          </div>
        </div>

        {/* =====================================================
            RIGHT — SWIPEABLE JOURNEY CARDS
            The reveal is on this wrapper only, so it never
            touches the cards' own --card-index transforms.
        ===================================================== */}

        <div className="about-visual" data-reveal="rise" data-delay="0.15">
          <div
            className="about-portrait-stack"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {aboutPortraits.map((portrait, index) => {
              const relativeIndex =
                (index - activeIndex + aboutPortraits.length) %
                aboutPortraits.length;

              return (
                <div
                  key={portrait.id}
                  className={`about-portrait-card ${
                    relativeIndex === 0 ? "is-active" : ""
                  }`}
                  style={{
                    "--card-index": relativeIndex,
                  }}
                >
                  <img
                    src={cloudinaryImage(
                      portrait.version,
                      portrait.file,
                      700
                    )}
                    srcSet={buildSrcSet(portrait)}
                    sizes={PORTRAIT_SIZES}
                    alt={portrait.alt}
                    loading={imagesWarm ? "eager" : "lazy"}
                    decoding="async"
                    draggable="false"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
          MY JOURNEY POPUP
      ========================================================= */}

      {isExpanded && (
        <div
          className="about-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsExpanded(false);
            }
          }}
        >
          <div className="about-modal-inner">
            {/* =====================================================
                TOP ROW
            ===================================================== */}

            <div className="about-modal-top">
              <div className="about-modal-eyebrow">MY JOURNEY</div>

              <button
                type="button"
                className="about-modal-close"
                onClick={() => setIsExpanded(false)}
                aria-label="Close My Journey"
              >
                <span></span>
                <span></span>
              </button>
            </div>

            {/* =====================================================
                TITLE
            ===================================================== */}

            <h3 id="about-modal-title" className="about-modal-title">
              A different path led me to the same place.
            </h3>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <div className="about-modal-content">
              {/* -----------------------------------------------------
                  LEFT — STORY
              ----------------------------------------------------- */}

              <div className="about-modal-story">
                <p>
                  Before choosing my degree, I wanted to pursue
                  B.Architecture. I was fascinated by the idea of designing
                  spaces, infrastructure, and the way people interact with
                  them. My guardians encouraged me to take a more technical
                  path, so I chose B.Tech in Computer Science instead.
                </p>

                <p>
                  During my time in Computer Science, I gradually realized
                  that coding wasn't something I genuinely enjoyed. I
                  experimented with different ways of working with
                  technology, even exploring vibe coding, but I kept coming
                  back to the part that felt natural to me — designing.
                  What started as an interest in physical spaces slowly
                  became an interest in digital spaces: app architecture,
                  interfaces, systems, and the experiences built around
                  them.
                </p>

                <p>
                  After graduation, I made a direct switch into the design
                  industry and began building my career in UI/UX.
                </p>

                <p>
                  It wasn't an easy switch. Starting a career in product
                  design with little industry experience meant learning,
                  experimenting, and figuring things out as I went. But it
                  felt worth it because design keeps me curious. It gives me
                  something to think about, something to build, and
                  something to stay absorbed in.
                </p>

                <p>
                  In a world where everyone seems to be racing to get ahead,
                  design gives me a reason to pause, explore, and create.
                </p>

                <p>That's the path I'm still on.</p>
              </div>

              {/* -----------------------------------------------------
                  RIGHT — IMAGE
              ----------------------------------------------------- */}

              <div className="about-modal-visual">
                {/* Handwritten annotation */}

                <div className="about-modal-image-note">
                  <span>It’s all about</span>
                  <span>him</span>
                </div>

                {/* Handwritten arrow */}

                <svg
                  className="about-modal-image-arrow"
                  viewBox="0 0 120 90"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="
                      M 108 8
                      C 80 4 55 5 36 17
                      C 19 28 12 42 10 60
                    "
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <g className="about-modal-image-arrow-head">
                    <path
                      d="M 10 60 L 19 54"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />

                    <path
                      d="M 10 60 L 17 65"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>

                {/* Childhood image */}

                <div className="journey-childhood-card">
                  <img
                    src={CHILDHOOD_SRC}
                    alt="Darshan's childhood portrait"
                    decoding="async"
                    draggable="false"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}