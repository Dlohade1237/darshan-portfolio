import React, { useEffect, useRef, useState } from "react";

/* =========================================================
   CLOUDINARY IMAGES
   - Three sizes per image, so phones and smaller screens
     don't download the 1200px version.
   - f_auto serves AVIF/WebP where supported.
   - q_auto (not eco) is kept because these are the showcase
     images of the portfolio.
========================================================= */

const CLOUD = "https://res.cloudinary.com/m1xt1lo4/image/upload";

const IMAGE_WIDTHS = [600, 900, 1200];

// Matches a two-column layout on desktop, full width on tablet/mobile.
// Adjust the breakpoint/percentage if your CSS differs.
const IMAGE_SIZES = "(max-width: 900px) 100vw, 50vw";

const cloudinaryImage = (version, file, width) =>
  `${CLOUD}/w_${width},c_limit,f_auto,q_auto/${version}/${file}`;

const buildSrcSet = (project) =>
  IMAGE_WIDTHS.map(
    (width) =>
      `${cloudinaryImage(
        project.imageVersion,
        project.imageFile,
        width
      )} ${width}w`
  ).join(", ");

const projects = [
  {
    number: "01",
    name: "Masstrans",
    category: "Enterprise Website · UX/UI · Design System",
    title:
      "Redesigning an Enterprise Website for Intelligent Transportation Solutions",
    description:
      "An end-to-end UX/UI redesign focused on information architecture, product discovery, responsive experiences, and a scalable design system for a complex transportation technology website.",
    cta: "VIEW CASE STUDY",
    imageVersion: "v1791826658",
    imageFile: "masstrans-project.png",
    layout: "normal",
    note: (
      <>
        <span>Tap to view</span>
        <span>full case study</span>
      </>
    ),
  },
  {
    number: "02",
    name: "ACE BLEND",
    category: "Responsive Website · UI Design",
    title: "Creating a Modern E-commerce Experience for ACE Blend",
    description:
      "A responsive website interface designed across shopping, product discovery, product detail, brand, science, bundles, and editorial content while maintaining a consistent visual system across desktop and mobile.",
    cta: "EXPLORE PROJECT",
    imageVersion: "v1791826651",
    imageFile: "aceblend-project.png",
    layout: "reverse",
    note: (
      <>
        <span>Tap to discover</span>
        <span>full project</span>
      </>
    ),
  },
  {
    number: "03",
    name: "SUSHIL LODGE",
    category: "Hotel Management System · Product UX/UI",
    title: "Designing Better Workflows for Hotel Operations",
    description:
      "A role-based hotel management system designed to simplify everyday workflows across reception and administration—from guest entry and bookings to room management, notifications, and error handling.",
    cta: "SEE OVERVIEW",
    imageVersion: "v1791826659",
    imageFile: "sushil-lodge-project.png",
    layout: "normal",
    note: (
      <>
        <span>Click to read</span>
        <span>full overview</span>
      </>
    ),
  },
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("down");

  // Flips to true when the section is still ~2 screens away,
  // so the project images are already loaded when it arrives.
  const [imagesWarm, setImagesWarm] = useState(false);

  const sectionRef = useRef(null);
  const stackRef = useRef(null);

  const lastScrollY = useRef(0);
  const scrollStopTimer = useRef(null);
  const animationFrame = useRef(null);

  /* =========================================================
     START LOADING IMAGES BEFORE THE SECTION IS VISIBLE

     Native lazy loading only starts once an image is close to
     the viewport. Images 02 and 03 sit far down the sticky
     stack, so they began loading late and showed up blank.
     Switching them to eager early fixes that without changing
     the markup.
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
      { rootMargin: "2000px 0px" }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =========================================================
     SCROLL-DRIVEN PROJECT FADE
  ========================================================= */

  const getProjectOpacity = (index, progress) => {
    const transitionStart = 0.24;
    const transitionEnd = 0.42;

    const secondTransitionStart = 0.58;
    const secondTransitionEnd = 0.76;

    const smoothStep = (value) => {
      const clamped = Math.max(0, Math.min(1, value));
      return clamped * clamped * (3 - 2 * clamped);
    };

    /* -----------------------------------------------
       PROJECT 01
       Fades out while moving toward Project 02
    ------------------------------------------------ */

    if (index === 0) {
      const fadeProgress = smoothStep(
        (progress - transitionStart) /
          (transitionEnd - transitionStart)
      );

      return 1 - fadeProgress;
    }

    /* -----------------------------------------------
       PROJECT 02
       Fades IN from Project 01
       then fades OUT toward Project 03
    ------------------------------------------------ */

    if (index === 1) {
      const fadeIn = smoothStep(
        (progress - transitionStart) /
          (transitionEnd - transitionStart)
      );

      const fadeOut = smoothStep(
        (progress - secondTransitionStart) /
          (secondTransitionEnd - secondTransitionStart)
      );

      return Math.max(0, Math.min(1, fadeIn * (1 - fadeOut)));
    }

    /* -----------------------------------------------
       PROJECT 03
       Fades IN while coming from Project 02
    ------------------------------------------------ */

    if (index === 2) {
      const fadeProgress = smoothStep(
        (progress - secondTransitionStart) /
          (secondTransitionEnd - secondTransitionStart)
      );

      return fadeProgress;
    }

    return 1;
  };

  /* =========================================================
     LIVE PROJECT SCROLL PROGRESS
  ========================================================= */

  useEffect(() => {
    const updateProgress = () => {
      const stack = stackRef.current;

      if (!stack) {
        animationFrame.current = null;
        return;
      }

      const stackRect = stack.getBoundingClientRect();

      /*
        Document position where the project stack begins.
      */

      const stackTop = window.scrollY + stackRect.top;

      /*
        Total scrollable distance through the stack.

        Progress:
        0   = Project 01
        0.5 = Project 02
        1   = Project 03
      */

      const scrollDistance = Math.max(
        stack.offsetHeight - window.innerHeight,
        1
      );

      const rawProgress =
        (window.scrollY - stackTop) / scrollDistance;

      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clampedProgress);

      /* =====================================================
         ACTIVE PROJECT

         01 → 0.000 - 0.333
         02 → 0.333 - 0.666
         03 → 0.666 - 1.000
      ===================================================== */

      const calculatedProject = Math.min(
        projects.length - 1,
        Math.floor(clampedProgress * projects.length)
      );

      setActiveProject(calculatedProject);

      animationFrame.current = null;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      /* -----------------------------------------------------
         SCROLL DIRECTION
      ----------------------------------------------------- */

      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection("up");
      }

      lastScrollY.current = currentScrollY;

      /* -----------------------------------------------------
         SCROLLING STATE
      ----------------------------------------------------- */

      setIsScrolling(true);

      clearTimeout(scrollStopTimer.current);

      scrollStopTimer.current = setTimeout(() => {
        setIsScrolling(false);
      }, 120);

      /* -----------------------------------------------------
         REQUEST FRAME
      ----------------------------------------------------- */

      if (animationFrame.current !== null) {
        return;
      }

      animationFrame.current =
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

      clearTimeout(scrollStopTimer.current);

      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <section
      className="projects-section"
      id="work"
      ref={sectionRef}
    >
      {/* =====================================================
          INTRO
      ===================================================== */}

      <div className="projects-intro">
        <div className="projects-eyebrow">SELECTED WORK</div>

        <h2 className="projects-heading">
          <span>A Few Things I’ve</span>

          <span className="projects-heading-blue">Designed.</span>
        </h2>
      </div>

      {/* =====================================================
          PROJECT STACK
      ===================================================== */}

      <div ref={stackRef} className="projects-stack">
        {/* ===================================================
            PROJECT SCROLL INDICATOR

            It lives INSIDE the sticky project stack so it
            naturally enters, sticks and exits with the section.
        =================================================== */}

        <div
          className={`projects-scroll-indicator ${
            isScrolling ? "is-scrolling" : ""
          } ${
            scrollDirection === "up"
              ? "scrolling-up"
              : "scrolling-down"
          }`}
        >
          {/* -------------------------------------------------
              PROJECT LABELS
          ------------------------------------------------- */}

          <div className="projects-scroll-labels">
            {projects.map((project, index) => (
              <div
                key={project.number}
                className={`projects-scroll-project ${
                  activeProject === index ? "is-active" : ""
                }`}
              >
                <span>{project.name}</span>
                <span>{project.number}</span>
              </div>
            ))}
          </div>

          {/* -------------------------------------------------
              VERTICAL TIMELINE
          ------------------------------------------------- */}

          <div className="projects-scroll-track">
            <span
              className="projects-scroll-dot"
              style={{
                top: `${scrollProgress * 100}%`,
              }}
            />
          </div>
        </div>

        {/* ===================================================
            PROJECTS
        =================================================== */}

        {projects.map((project, index) => (
          <article
            key={project.number}
            data-project-index={index}
            className={`project-item ${
              project.layout === "reverse"
                ? "project-item-reverse"
                : "project-item-normal"
            } ${
              activeProject === index ? "project-item-active" : ""
            }`}
          >
            <div
              className="project-inner"
              style={{
                opacity: getProjectOpacity(index, scrollProgress),
              }}
            >
              {/* =============================================
                  LARGE NUMBER
              ============================================= */}

              <div className="project-number">{project.number}</div>

              {/* =============================================
                  CONTENT
              ============================================= */}

              <div className="project-copy">
                <div className="project-name">{project.name}</div>

                <div className="project-category">
                  {project.category}
                </div>

                <h3 className="project-title">{project.title}</h3>

                <p className="project-description">
                  {project.description}
                </p>

                {/* =========================================
                    CTA
                ========================================= */}

                <div className="project-cta-wrap">
                  <a href="#contact" className="project-cta">
                    <span>{project.cta}</span>

                    <span className="project-cta-arrow">↗</span>
                  </a>

                  {/* Handwritten text */}

                  <div className="project-note">{project.note}</div>

                  {/* Figma exported arrow */}

                  <img
                    className="project-note-arrow"
                    src="/assets/arrows/project-note-arrow.svg"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              {/* =============================================
                  PROJECT VISUAL
              ============================================= */}

              <div className="project-visual-wrap">
                <div
                  className={`project-visual ${
                    activeProject === index
                      ? "project-visual-active"
                      : ""
                  }`}
                >
                  <img
                    src={cloudinaryImage(
                      project.imageVersion,
                      project.imageFile,
                      1200
                    )}
                    srcSet={buildSrcSet(project)}
                    sizes={IMAGE_SIZES}
                    alt={`${project.name} project`}
                    loading={imagesWarm ? "eager" : "lazy"}
                    decoding="async"
                    draggable="false"
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}