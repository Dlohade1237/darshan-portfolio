import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const musicImages = Array.from(
  { length: 21 },
  (_, index) =>
    `/assets/music/image_${String(index + 1).padStart(2, "0")}.png`
);

export default function Hero() {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  const indexRef = useRef(0);
  const lastPointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!canHover) return;

    const cards = cardsRef.current;

    const handlePointerMove = (event) => {
      const rect = hero.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const dx = x - lastPointRef.current.x;
      const dy = y - lastPointRef.current.y;
      const distance = Math.hypot(dx, dy);

      // Controls how frequently a new album appears
      if (distance < 55) return;

      lastPointRef.current = { x, y };

      const card = cards[indexRef.current];

      if (!card) return;

      indexRef.current =
        (indexRef.current + 1) % cards.length;

      const rotation = gsap.utils.random(-9, 9);
      const scale = gsap.utils.random(0.9, 1.04);

      const driftX = gsap.utils.random(-35, 35);
      const driftY = gsap.utils.random(-25, 25);

      gsap.killTweensOf(card);

      // Initial position
      gsap.set(card, {
        x,
        y,
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        scale: 0.72,
        rotation: rotation * 0.4,
      });

      // Album appears
      gsap.to(card, {
        opacity: 1,
        scale,
        rotation,
        duration: 0.28,
        ease: "power3.out",
      });

      // Album drifts away and fades
      gsap.to(card, {
        x: x + driftX,
        y: y + driftY,
        scale: gsap.utils.random(0.88, 0.97),
        rotation: rotation + gsap.utils.random(-7, 7),
        opacity: 0,
        duration: 0.85,
        delay: 0.08,
        ease: "power2.out",
      });
    };

    const handlePointerLeave = () => {
      cards.forEach((card) => {
        if (!card) return;

        gsap.killTweensOf(card);

        gsap.to(card, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      lastPointRef.current = { x: 0, y: 0 };
    };

    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      hero.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      hero.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );

      cards.forEach((card) => {
        if (card) {
          gsap.killTweensOf(card);
        }
      });
    };
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      {/* =================================================
          BACKGROUND VIDEO
      ================================================= */}

      <div className="hero-video-wrap" aria-hidden="true">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source
            src="/assets/hero_section_bg.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* =================================================
          DARK READABILITY OVERLAY
      ================================================= */}

      <div
        className="hero-overlay"
        aria-hidden="true"
      />

      {/* =================================================
          MUSIC CURSOR TRAIL
      ================================================= */}

      <div
        className="hero-trail-layer"
        aria-hidden="true"
      >
        {musicImages.map((src, index) => (
          <div
            className="hero-trail-card"
            key={index}
            ref={(element) => {
              cardsRef.current[index] = element;
            }}
          >
            <img
              src={src}
              alt=""
              draggable="false"
            />
          </div>
        ))}
      </div>

      {/* =================================================
          HERO CONTENT
      ================================================= */}

      <div className="hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title">
            <span>DESIGNING WHAT</span>
            <span>COMES NEXT.</span>
          </h1>
        </div>
      </div>
    </section>
  );
}