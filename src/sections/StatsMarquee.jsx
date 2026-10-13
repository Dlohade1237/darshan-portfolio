
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    target: 100,
    display: "100+",
    start: "0+",
    suffix: "+",
    pad: 1,
    line1: "Screens",
    line2: "Designed",
  },
  {
    number: "∞",
    line1: "Ideas",
    line2: null,
  },
  {
    target: 5,
    display: "05+",
    start: "00+",
    suffix: "+",
    pad: 2,
    line1: "Digital",
    line2: "Experience",
  },
];

const skills = [
  "UI/UX Design",
  "Product Design",
  "Visual Design",
  "Design Systems",
  "User Experience",
  "Interaction Design",
  "Prototyping",
  "Wireframing",
  "User Testing",
  "User Research",
];

// Alternating tilt + vertical drift
const pillVariants = [
  { rotate: -2.44, y: 4 },
  { rotate: 2.44, y: -6 },
  { rotate: -1.6, y: 2 },
  { rotate: 1.8, y: -3 },
];

export default function StatsMarquee() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const counters = section.querySelectorAll(
      ".stat-number[data-count]"
    );

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const context = gsap.context(() => {
      counters.forEach((element) => {
        const target = Number(element.dataset.count);
        const suffix = element.dataset.suffix || "";
        const pad = Number(element.dataset.pad || 1);

        const formatNumber = (value) => {
          return `${String(value).padStart(pad, "0")}${suffix}`;
        };

        // Show the final number immediately for reduced-motion users.
        if (prefersReducedMotion) {
          element.textContent = formatNumber(target);
          return;
        }

        // Begin from zero when the section enters the viewport.
        element.textContent = element.dataset.start;

        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: "power2.out",
          snap: { value: 1 },

          onUpdate: () => {
            element.textContent = formatNumber(
              Math.floor(counter.value)
            );
          },

          onComplete: () => {
            element.textContent = formatNumber(target);
          },

          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        });
      });
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-row">
        {stats.map((stat, index) => (
          <div className="stat-item" key={index}>
            {stat.target !== undefined ? (
              <span
                className="stat-number"
                data-count={stat.target}
                data-suffix={stat.suffix}
                data-pad={stat.pad}
                data-start={stat.start}
                aria-label={stat.display}
              >
                {stat.start}
              </span>
            ) : (
              <span className="stat-number">{stat.number}</span>
            )}

            <span className="stat-label">
              {stat.line1}
              {stat.line2 && (
                <>
                  <br />
                  {stat.line2}
                </>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...skills, ...skills].map((skill, i) => {
            const variant = pillVariants[i % pillVariants.length];

            return (
              <span
                className="marquee-pill"
                key={i}
                style={{
                  transform: `rotate(${variant.rotate}deg) translateY(${variant.y}px)`,
                }}
              >
                {skill}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
