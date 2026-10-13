import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Lazy images and late-loading fonts change section heights,
// so recalculate trigger positions once they settle.
if (typeof window !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

const PRESETS = {
  // single element drifts up and fades in
  up: {
    from: { y: 40, opacity: 0 },
    duration: 0.9,
    ease: "power3.out",
  },

  // larger blocks (images, cards) rise a little further and settle in
  rise: {
    from: { y: 70, opacity: 0, scale: 0.96 },
    duration: 1.1,
    ease: "power3.out",
  },

  // headline lines: each direct child follows the one before it
  lines: {
    from: { y: 48, opacity: 0 },
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.12,
    children: true,
  },

  // groups (columns, pills): each direct child staggers in
  stagger: {
    from: { y: 36, opacity: 0 },
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.15,
    children: true,
  },
};

export default function useReveal(scopeRef) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;

    if (!scope) return;

    const mm = gsap.matchMedia();

    // Skipped entirely for visitors who prefer reduced motion
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray("[data-reveal]", scope).forEach((el) => {
        const preset = PRESETS[el.dataset.reveal] || PRESETS.up;
        const delay = parseFloat(el.dataset.delay || 0);

        const targets = preset.children ? Array.from(el.children) : el;

        gsap.from(targets, {
          ...preset.from,
          duration: preset.duration,
          ease: preset.ease,
          stagger: preset.stagger,
          delay,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });
    });

    return () => mm.revert();
  }, [scopeRef]);
}