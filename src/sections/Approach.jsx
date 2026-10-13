
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const IMG_M = "/assets/approach/M.png";
const IMG_O = "/assets/approach/O.png";
const IMG_V = "/assets/approach/V.png";
const IMG_E = "/assets/approach/E.png";

const steps = [
  {
    key: "map",
    label: "MAP",
    subtitle: "Understand before designing.",
    description:
      "I explore the problem, context, users, goals, and constraints to define the right direction.",
    activities: [
      "User Research",
      "Problem Framing",
      "Context Analysis",
      "Defining Goals",
    ],
    activeLetterIndex: 0,
    annotation: ["It starts", "with understanding"],
    arrow: "/assets/approach/M-arrow.svg",
  },
  {
    key: "organize",
    label: "ORGANIZE",
    subtitle: "Turn complexity into clarity.",
    description:
      "I explore the problem, context, users, goals, and constraints to define the right direction.",
    activities: [
      "Affinity Mapping",
      "Prioritization",
      "Information Architecture",
      "Define Opportunities",
    ],
    activeLetterIndex: 1,
    annotation: ["From Ideas", "to Structure."],
    arrow: "/assets/approach/O-arrow.svg",
  },
  {
    key: "visualize",
    label: "VISUALIZE",
    subtitle: "Bring ideas to life.",
    description:
      "I translate insights into clear, intuitive compelling solution exploring layouts, interactions, and visual direction that bring the ideas to life.",
    activities: [
      "Ideation & Sketching",
      "Wireframing",
      "Visual Design",
      "Prototyping",
    ],
    activeLetterIndex: 2,
    annotation: ["Idea takes", "Visual form here."],
    arrow: "/assets/approach/V-arrow.svg",
  },
  {
    key: "evolve",
    label: "EVOLVE",
    subtitle: "Design. Refine. Deliver.",
    description:
      "I translate insights into clear, intuitive compelling solution exploring layouts, interactions, and visual direction that bring the ideas to life.",
    activities: [
      "Design System",
      "Collaboration",
      "Iterate & Refine",
      "Deliver",
    ],
    activeLetterIndex: 3,
    annotation: ["Idea into", "real impact."],
    arrow: "/assets/approach/E-arrow.svg",
  },
];

const LETTERS = [
  { img: IMG_M, char: "M" },
  { img: IMG_O, char: "O" },
  { img: IMG_V, char: "V" },
  { img: IMG_E, char: "E" },
];

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

/*
  Split a sentence into words and characters.

  Keeping each word as a separate inline-block allows text
  to wrap naturally while individual characters animate.
*/
function renderBlurRevealText(text, prefix) {
  return text.split(" ").map((word, wordIndex) => (
    <span
      className="approach-reveal-word"
      key={`${prefix}-word-${wordIndex}`}
      style={{
        display: "inline-block",
        whiteSpace: "nowrap",
        marginRight:
          wordIndex < text.split(" ").length - 1
            ? "0.25em"
            : 0,
      }}
    >
      {Array.from(word).map((character, characterIndex) => (
        <span
          className="approach-reveal-char"
          key={`${prefix}-${wordIndex}-${characterIndex}`}
          aria-hidden="true"
          style={{ display: "inline-block" }}
        >
          {character}
        </span>
      ))}
    </span>
  ));
}

export default function Approach() {
  const wrapperRef = useRef(null);
  const rafRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  /*
    Continuous scroll progress controls the four MOVE stages.
  */
  useEffect(() => {
    const updateProgress = () => {
      const wrapper = wrapperRef.current;

      if (!wrapper) {
        rafRef.current = null;
        return;
      }

      const rect = wrapper.getBoundingClientRect();

      const totalScroll =
        wrapper.offsetHeight - window.innerHeight;

      if (totalScroll <= 0) {
        rafRef.current = null;
        return;
      }

      const scrolled = -rect.top;

      const progress = clamp(scrolled / totalScroll);

      setScrollProgress(progress);

      rafRef.current = null;
    };

    const handleScroll = () => {
      if (rafRef.current !== null) return;

      rafRef.current =
        window.requestAnimationFrame(updateProgress);
    };

    const handleResize = () => {
      updateProgress();
    };

    updateProgress();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  /*
    SECTION INTRO:
    The chip, heading and supporting paragraph fade upward
    when the section enters the viewport.
  */
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setHasEntered(true);
      return;
    }

    const context = gsap.context(() => {
      const introTargets = wrapper.querySelectorAll(
        ".approach-chip, .approach-heading, .approach-subtext"
      );

      gsap.fromTo(
        introTargets,
        {
          y: 34,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.16,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 75%",
            once: true,
            onEnter: () => setHasEntered(true),
          },
        }
      );
    }, wrapper);

    return () => context.revert();
  }, []);

  /*
    Convert continuous scroll progress into four stages.
  */
  const stagePosition =
    scrollProgress * (steps.length - 1);

  const activeStep = Math.min(
    steps.length - 1,
    Math.round(stagePosition)
  );

  const step = steps[activeStep];

  /*
    CHARACTER-BY-CHARACTER BLUR REVEAL:
    Replays when scrolling changes the active MOVE stage.
  */
  useLayoutEffect(() => {
    if (!hasEntered) return;

    const wrapper = wrapperRef.current;

    if (!wrapper) return;

    const content = wrapper.querySelector(".approach-content");

    if (!content) return;

    const characters = content.querySelectorAll(
      ".approach-reveal-char"
    );

    if (!characters.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(characters, {
        clearProps: "filter,transform,opacity",
      });

      return;
    }

    const animation = gsap.fromTo(
      characters,
      {
        y: 7,
        opacity: 0,
        filter: "blur(7px)",
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.38,
        stagger: 0.008,
        ease: "power2.out",
        clearProps: "filter,transform,opacity",
      }
    );

    return () => {
      animation.kill();
    };
  }, [
    activeStep,
    hasEntered,
    step.description,
    step.activities,
  ]);

  /*
    Soften inactive MOVE letters based on proximity
    to the current scroll stage.
  */
  const getLetterState = (index) => {
    const distance = Math.abs(index - stagePosition);

    const isActive = distance < 0.5;

    const proximity = clamp(1 - distance, 0, 1);

    return {
      opacity: isActive
        ? 1
        : 0.2 + proximity * 0.05,

      scale: isActive
        ? 1
        : 0.72 + proximity * 0.04,

      blur: isActive
        ? 0
        : 0.8 + distance * 0.5,
    };
  };

  return (
    <section
      ref={wrapperRef}
      className="approach-scroll-wrapper"
      id="approach"
    >
      <div className="approach-stage">
        {/* =====================================================
            LEFT COLUMN
        ===================================================== */}

        <div className="approach-left">
          <div className="approach-chip">
            DESIGN APPROACH
          </div>

          <h2 className="approach-heading">
            I Move Ideas
            <br />
            <span className="approach-heading-blue">
              Forward.
            </span>
          </h2>

          <p className="approach-subtext">
            A focused process I use to turn complex
            problems into clear, purposeful and
            human-centered experiences.
          </p>
        </div>

        {/* =====================================================
            RIGHT COLUMN
        ===================================================== */}

        <div className="approach-right">
          {/* M O V E LETTERS */}

          <div className="approach-letters">
            {LETTERS.map((letter, index) => {
              const state = getLetterState(index);

              return (
                <div
                  key={letter.char}
                  className={`approach-letter ${
                    index === step.activeLetterIndex
                      ? "is-active"
                      : ""
                  }`}
                  style={{
                    opacity: state.opacity,
                    transform: `scale(${state.scale})`,
                    filter: `blur(${state.blur}px)`,
                  }}
                >
                  <img
                    src={letter.img}
                    alt={letter.char}
                    draggable="false"
                  />
                </div>
              );
            })}

            {/* HANDWRITTEN ANNOTATION */}

            <div
              className={`approach-annotation approach-annotation-${step.key}`}
            >
              <p className="approach-annotation-text">
                {step.annotation.map((line, index) => (
                  <span key={index}>{line}</span>
                ))}
              </p>

              <img
                className="approach-annotation-arrow"
                src={step.arrow}
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>

          {/* ACTIVE STEP CONTENT */}

          <div className="approach-content">
            <div className="approach-step-label-viewport">
              <div
                className="approach-step-label-track"
                style={{
                  transform: `translate3d(0, ${
                    -stagePosition * 72
                  }px, 0)`,
                }}
              >
                {steps.map((item) => (
                  <div
                    key={item.key}
                    className="approach-step-label"
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <h3 className="approach-step-subtitle">
              {step.subtitle}
            </h3>

            <p
              className="approach-step-desc"
              aria-label={step.description}
            >
              {renderBlurRevealText(
                step.description,
                `${step.key}-description`
              )}
            </p>

            <div className="approach-activities">
              <p className="approach-activities-heading">
                KEY ACTIVITIES
              </p>

              <ul className="approach-activities-list">
                {step.activities.map((activity, index) => (
                  <li
                    key={activity}
                    aria-label={activity}
                  >
                    {renderBlurRevealText(
                      activity,
                      `${step.key}-activity-${index}`
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
