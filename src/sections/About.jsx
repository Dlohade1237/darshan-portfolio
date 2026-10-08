import React, { useEffect, useRef, useState } from "react";

const aboutPortraits = [
  {
    id: 1,
    src: "/assets/about-portraits/1-curious-portrait.png",
    alt: "Curious",
  },
  {
    id: 2,
    src: "/assets/about-portraits/2-exploring-portrait.png",
    alt: "Exploring",
  },
  {
    id: 3,
    src: "/assets/about-portraits/3-experimenting-portrait.png",
    alt: "Experimenting",
  },
  {
    id: 4,
    src: "/assets/about-portraits/4-discovering-portrait.png",
    alt: "Discovering",
  },
  {
    id: 5,
    src: "/assets/about-portraits/5-traditional-portrait.png",
    alt: "Traditional",
  },
  {
    id: 6,
    src: "/assets/about-portraits/6-creating-portrait.png",
    alt: "Creating",
  },
];

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const pointerStartX = useRef(0);
  const pointerCurrentX = useRef(0);
  const isDragging = useRef(false);

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
    setActiveIndex(
      (current) =>
        (current + 1) % aboutPortraits.length
    );
  };

  const goPrevious = () => {
    setActiveIndex(
      (current) =>
        (current - 1 + aboutPortraits.length) %
        aboutPortraits.length
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

    const distance =
      pointerCurrentX.current -
      pointerStartX.current;

    isDragging.current = false;

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
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
    <section className="about-section" id="about">

      <div className="about-inner">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div className="about-copy">

          <div className="about-eyebrow">
            ABOUT ME
          </div>

          <h2 className="about-title">
            <span>I wanted to Design Spaces.</span>
            <span>I Ended Up Designing</span>
            <span className="about-title-blue">
              Digital Experiences.
            </span>
          </h2>

          <div className="about-description">

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

          <div className="about-read-more-wrap">

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

              <span className="about-read-more-icon">
                ↗
              </span>
            </button>

          </div>

        </div>


        {/* =====================================================
            RIGHT — SWIPEABLE JOURNEY CARDS
        ===================================================== */}

        <div className="about-visual">

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
                    relativeIndex === 0
                      ? "is-active"
                      : ""
                  }`}
                  style={{
                    "--card-index": relativeIndex,
                  }}
                >
                  <img
                    src={portrait.src}
                    alt={portrait.alt}
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

        <div className="about-modal-eyebrow">
          MY JOURNEY
        </div>

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

      <h3
        id="about-modal-title"
        className="about-modal-title"
      >
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
            Before choosing my degree, I wanted to pursue B.Architecture.
            I was fascinated by the idea of designing spaces,
            infrastructure, and the way people interact with them.
            My guardians encouraged me to take a more technical path,
            so I chose B.Tech in Computer Science instead.
          </p>

          <p>
            During my time in Computer Science, I gradually realized that
            coding wasn't something I genuinely enjoyed. I experimented
            with different ways of working with technology, even exploring
            vibe coding, but I kept coming back to the part that felt
            natural to me — designing.
            What started as an interest in physical spaces slowly became
            an interest in digital spaces: app architecture, interfaces,
            systems, and the experiences built around them.
          </p>

          <p>
            After graduation, I made a direct switch into the design
            industry and began building my career in UI/UX.
          </p>

          <p>
            It wasn't an easy switch. Starting a career in product design
            with little industry experience meant learning, experimenting,
            and figuring things out as I went. But it felt worth it because
            design keeps me curious. It gives me something to think about,
            something to build, and something to stay absorbed in.
          </p>

          <p>
            In a world where everyone seems to be racing to get ahead,
            design gives me a reason to pause, explore, and create.
          </p>

          <p>
            That's the path I'm still on.
          </p>

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
              src="/assets/childhood-portrait.png"
              alt="Darshan as a child"
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