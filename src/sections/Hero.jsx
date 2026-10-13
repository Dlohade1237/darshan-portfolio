
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const musicImages = [
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_01.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_02.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_03.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_04.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_05.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_06.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_07.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_08.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_09.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_10.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_11.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_12.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_13.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_14.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_15.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_16.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_17.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_18.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_19.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_20.png",
  "https://res.cloudinary.com/m1xt1lo4/image/upload/w_400,c_limit,f_auto,q_auto/v1791825483/image_21.png",
];

function renderLetters(text, lineKey) {
  return Array.from(text).map((char, index) => (
    <span
      className="hero-title-char"
      key={`${lineKey}-${index}`}
      style={{ display: "inline-block" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

export default function Hero({ isLoading = false }) {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  const indexRef = useRef(0);
  const lastPointRef = useRef({ x: 0, y: 0 });

  // Reveal the heading letter by letter after the loader finishes.
  useEffect(() => {
    if (isLoading) return;

    const chars =
      heroRef.current?.querySelectorAll(".hero-title-char");

    if (!chars?.length) return;

    // Respect visitors who prefer reduced motion.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      gsap.set(chars, {
        clearProps: "transform,opacity",
      });
      return;
    }

    const animation = gsap.fromTo(
      chars,
      {
        y: 36,
        opacity: 0,
        rotateX: -45,
        transformOrigin: "50% 100%",
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.7,
        stagger: 0.035,
        ease: "power3.out",
        delay: 0.05,
        clearProps: "transform,opacity",
      }
    );

    return () => {
      animation.kill();
    };
  }, [isLoading]);

  // Existing cursor image trail.
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

      if (distance < 55) return;

      lastPointRef.current = { x, y };

      const card = cards[indexRef.current];

      if (!card) return;

      indexRef.current = (indexRef.current + 1) % cards.length;

      const rotation = gsap.utils.random(-9, 9);
      const scale = gsap.utils.random(0.9, 1.04);
      const driftX = gsap.utils.random(-35, 35);
      const driftY = gsap.utils.random(-25, 25);

      gsap.killTweensOf(card);

      gsap.set(card, {
        x,
        y,
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        scale: 0.72,
        rotation: rotation * 0.4,
      });

      gsap.to(card, {
        opacity: 1,
        scale,
        rotation,
        duration: 0.28,
        ease: "power3.out",
      });

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
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);

      cards.forEach((card) => {
        if (card) gsap.killTweensOf(card);
      });
    };
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
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
            src="https://res.cloudinary.com/m1xt1lo4/video/upload/q_auto/v1791813649/hero_section_bg.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-trail-layer" aria-hidden="true">
        {musicImages.map((src, index) => (
          <div
            className="hero-trail-card"
            key={index}
            ref={(element) => {
              cardsRef.current[index] = element;
            }}
          >
            <img src={src} alt="" draggable="false" />
          </div>
        ))}
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          <h1
            className="hero-title"
            aria-label="DESIGNING WHAT COMES NEXT."
          >
            <span
              className="hero-title-line"
              aria-hidden="true"
              style={{ display: "block" }}
            >
              {renderLetters("DESIGNING WHAT", "line-one")}
            </span>

            <span
              className="hero-title-line"
              aria-hidden="true"
              style={{ display: "block" }}
            >
              {renderLetters("COMES NEXT.", "line-two")}
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
