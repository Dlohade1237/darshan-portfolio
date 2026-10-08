import React, { useEffect, useRef, useState } from "react";

const milestones = [
  {
    year: "2021",
    title: "The Beginning",
    description:
      "B.Tech in Computer Science & Engineering\nSNJB's KBJ College of Engineering, Chandwad, Dist-Nashik",
    badge: null,
  },
  {
    year: "2025",
    title: "A New Perspective",
    description:
      "Graduated with a B.Tech in Computer Science & Engineering.",
    badge: "70%",
  },
  {
    year: "2026",
    title: "The Switch",
    description:
      "UX/UI Designer Intern\nBits & Volts Pvt. Ltd.",
    badge: null,
  },
  {
    year: "Now",
    title: "Where I Am",
    description:
      "UI/UX Designer | Product Designer\nBits & Volts Pvt. Ltd., Pune",
    badge: null,
  },
];

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}


/* =========================================================
   TIMELINE CONFIG
========================================================= */

const ENTRY_UNITS = 1;
const UNITS_PER_CARD = 2;
const EXIT_UNITS = 1;


/* =========================================================
   CARD POSITION CONFIG
========================================================= */

const NEXT_X = 620;
const NEXT_Y = 35;

const PREVIOUS_X = 620;
const PREVIOUS_Y = 25;

const ENTRY_X = 680;
const EXIT_X = 680;


/* =========================================================
   CONTINUOUS JOURNEY POSITION
========================================================= */

function getJourneyPosition(globalProgress) {
  /*
    ENTRY
    -1 → 0
    First card enters from the right.
  */

  if (globalProgress <= ENTRY_UNITS) {
    return (
      -1 +
      clamp(globalProgress / ENTRY_UNITS)
    );
  }


  /*
    MAIN JOURNEY
    0 → 1 → 2 → 3
  */

  const mainStart = ENTRY_UNITS;

  const mainDistance =
    (milestones.length - 1) *
    UNITS_PER_CARD;

  const mainEnd =
    mainStart + mainDistance;

  if (globalProgress <= mainEnd) {
    return (
      (globalProgress - mainStart) /
      UNITS_PER_CARD
    );
  }


  /*
    EXIT
    3 → 4
    Last card leaves toward the left.
  */

  const exitProgress = clamp(
    (globalProgress - mainEnd) /
      EXIT_UNITS
  );

  return (
    milestones.length - 1 +
    exitProgress
  );
}


/* =========================================================
   CARD VISUAL STATE
========================================================= */

function getCardStyle(cardIndex, journeyPosition) {
  const lastIndex = milestones.length - 1;


  /* =======================================================
     ENTRY HOLD
     No cards visible before the first scroll movement.
  ======================================================= */

  if (journeyPosition <= -1) {
    return {
      transform:
        `translate(-50%, -50%) translate(${ENTRY_X}px, -55px) scale(0.82)`,

      opacity: 0,

      filter: "blur(10px)",

      zIndex: 1,

      visibility: "hidden",
    };
  }


  /* =======================================================
     FIRST CARD ENTERING FROM RIGHT
  ======================================================= */

  if (
    journeyPosition > -1 &&
    journeyPosition < 0
  ) {
    if (cardIndex !== 0) {
      return {
        transform:
          `translate(-50%, -50%) translate(${ENTRY_X}px, -55px) scale(0.82)`,

        opacity: 0,

        filter: "blur(10px)",

        zIndex: 1,

        visibility: "hidden",
      };
    }

    const t = clamp(
      journeyPosition + 1
    );

    const eased = t * t * (3 - 2 * t);

    return {
      transform:
        `translate(-50%, -50%) translate(${lerp(
          ENTRY_X,
          0,
          eased
        )}px, ${lerp(
          -55,
          0,
          eased
        )}px) scale(${lerp(
          0.82,
          1,
          eased
        )})`,

      opacity: lerp(0, 1, eased),

      filter:
        `blur(${lerp(
          10,
          0,
          eased
        )}px)`,

      zIndex: 100,

      visibility: "visible",
    };
  }


  /* =======================================================
     FINAL CARD EXIT
  ======================================================= */

  if (journeyPosition >= lastIndex) {
    const exitProgress =
      journeyPosition - lastIndex;

    if (cardIndex !== lastIndex) {
      return {
        transform:
          "translate(-50%, -50%) translate(-680px, -55px) scale(0.82)",

        opacity: 0,

        filter: "blur(10px)",

        zIndex: 1,

        visibility: "hidden",
      };
    }

    const t = clamp(exitProgress);

    const eased = t * t * (3 - 2 * t);

    return {
      transform:
        `translate(-50%, -50%) translate(${lerp(
          0,
          -EXIT_X,
          eased
        )}px, ${lerp(
          0,
          -55,
          eased
        )}px) scale(${lerp(
          1,
          0.82,
          eased
        )})`,

      opacity:
        lerp(1, 0, eased),

      filter:
        `blur(${lerp(
          0,
          10,
          eased
        )}px)`,

      zIndex: 100,

      visibility: "visible",
    };
  }


  /* =======================================================
     NORMAL CONTINUOUS CARD STACK
  ======================================================= */

  const offset =
    cardIndex - journeyPosition;

  const distance =
    Math.abs(offset);


  /* =======================================================
     ACTIVE
  ======================================================= */

  if (distance < 0.001) {
    return {
      transform:
        "translate(-50%, -50%) translate(0px, 0px) scale(1)",

      opacity: 1,

      filter: "blur(0px)",

      zIndex: 100,

      visibility: "visible",
    };
  }


  /* =======================================================
     NEXT CARDS — RIGHT
  ======================================================= */

  if (offset > 0) {
    const t = clamp(distance);

    const x =
      distance <= 1
        ? lerp(0, NEXT_X, t)
        : NEXT_X +
          (distance - 1) * 190;

    const y =
      distance <= 1
        ? lerp(0, NEXT_Y, t)
        : NEXT_Y -
          (distance - 1) * 35;

    const scale =
      distance <= 1
        ? lerp(1, 0.74, t)
        : lerp(
            0.74,
            0.50,
            clamp(distance - 1)
          );

    const opacity =
      distance <= 1
        ? lerp(1, 0.48, t)
        : lerp(
            0.48,
            0.12,
            clamp(distance - 1)
          );

    const blur =
      distance <= 1
        ? lerp(0, 5, t)
        : lerp(
            5,
            10,
            clamp(distance - 1)
          );

    return {
      transform:
        `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,

      opacity,

      filter:
        `blur(${blur}px)`,

      zIndex:
        90 -
        Math.round(distance * 10),

      visibility: "visible",
    };
  }


  /* =======================================================
     PREVIOUS CARDS — LEFT
  ======================================================= */

  const t = clamp(distance);

  const x =
    distance <= 1
      ? lerp(
          0,
          -PREVIOUS_X,
          t
        )
      : -PREVIOUS_X -
        (distance - 1) * 180;

  const y =
    distance <= 1
      ? lerp(
          0,
          PREVIOUS_Y,
          t
        )
      : PREVIOUS_Y -
        (distance - 1) * 30;

  const scale =
    distance <= 1
      ? lerp(1, 0.74, t)
      : lerp(
          0.74,
          0.50,
          clamp(distance - 1)
        );

  const opacity =
    distance <= 1
      ? lerp(1, 0.30, t)
      : lerp(
          0.30,
          0.08,
          clamp(distance - 1)
        );

  const blur =
    distance <= 1
      ? lerp(0, 5, t)
      : lerp(
          5,
          10,
          clamp(distance - 1)
        );

  return {
    transform:
      `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,

    opacity,

    filter:
      `blur(${blur}px)`,

    zIndex:
      70 -
      Math.round(distance * 10),

    visibility: "visible",
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function MyJourney() {
  const wrapperRef = useRef(null);
  const rafRef = useRef(null);

  const [globalProgress, setGlobalProgress] = useState(0);


  /* =======================================================
     TOTAL SCROLL LENGTH
  ======================================================= */

const TOTAL_UNITS =
  ENTRY_UNITS +
  (milestones.length - 1) *
    UNITS_PER_CARD +
  EXIT_UNITS;

  /* =======================================================
     SCROLL TRACKING
  ======================================================= */

  useEffect(() => {
    const updateProgress = () => {
      const element = wrapperRef.current;

      if (!element) {
        rafRef.current = null;
        return;
      }

      const rect =
        element.getBoundingClientRect();

      const totalScroll =
        element.offsetHeight -
        window.innerHeight;

      if (totalScroll <= 0) {
        rafRef.current = null;
        return;
      }

      const scrolled = -rect.top;

      const rawProgress = clamp(
        scrolled / totalScroll
      );

      setGlobalProgress(
        rawProgress * TOTAL_UNITS
      );

      rafRef.current = null;
    };


    const handleScroll = () => {
      if (rafRef.current !== null) return;

      rafRef.current =
        window.requestAnimationFrame(
          updateProgress
        );
    };


    const handleResize = () => {
      updateProgress();
    };


    updateProgress();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(
          rafRef.current
        );
      }
    };
  }, [TOTAL_UNITS]);


  /* =======================================================
     CONTINUOUS JOURNEY POSITION
  ======================================================= */

  const journeyPosition =
    getJourneyPosition(globalProgress);


  return (
    <section
      ref={wrapperRef}
      className="journey-scroll-wrapper"
      id="resume"
      style={{
        height: `${TOTAL_UNITS * 100}vh`,
      }}
    >
      <div className="journey-stage">

        {/* ================================================
            BACKGROUND TITLE
        ================================================= */}

        <h2
          className="journey-bg-title"
          aria-hidden="true"
        >
          MY JOURNEY.
        </h2>


        {/* ================================================
            MILESTONE CARDS
        ================================================= */}

        {milestones.map((milestone, index) => (
          <article
            key={milestone.year}
            className="journey-card"
            style={getCardStyle(
              index,
              journeyPosition
            )}
          >
            <span className="journey-card-year">
              {milestone.year}
            </span>

            <h3 className="journey-card-title">
              {milestone.title}
            </h3>

            <p className="journey-card-desc">
              {milestone.description}
            </p>

            {milestone.badge && (
              <span className="journey-card-badge">
                {milestone.badge}
              </span>
            )}
          </article>
        ))}

      </div>
    </section>
  );
}