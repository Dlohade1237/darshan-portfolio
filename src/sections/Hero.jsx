import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/* =====================================================
   CLOUDINARY URLS
   - w_400,c_limit  → never larger than 400px wide
   - f_auto         → AVIF/WebP where supported
   - q_auto:eco     → smaller files (cards are small and
                      fade out in under a second)
===================================================== */

const CLOUD = "https://res.cloudinary.com/m1xt1lo4";

const IMAGE_VERSION = "v1791825483";
const IMAGE_COUNT = 21;

const musicImages = Array.from({ length: IMAGE_COUNT }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `${CLOUD}/image/upload/w_400,c_limit,f_auto,q_auto:eco/${IMAGE_VERSION}/image_${n}.png`;
});

/* Video: capped at 1920px wide, audio stripped (it is muted anyway),
   WebM first (smaller), MP4 as fallback. */
const VIDEO_VERSION = "v1791813649";
const VIDEO_T = "q_auto:eco,w_1920,c_limit,ac_none";

const heroVideoWebm = `${CLOUD}/video/upload/${VIDEO_T},f_webm/${VIDEO_VERSION}/hero_section_bg.webm`;
const heroVideoMp4 = `${CLOUD}/video/upload/${VIDEO_T},f_mp4/${VIDEO_VERSION}/hero_section_bg.mp4`;

/* Still frame shown instantly while the video buffers */
const heroPoster = `${CLOUD}/video/upload/so_0,w_1280,c_limit,f_auto,q_auto/${VIDEO_VERSION}/hero_section_bg.jpg`;

export default function Hero() {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  const indexRef = useRef(0);
  const lastPointRef = useRef({ x: 0, y: 0 });

  // Trail images are only requested after the page has finished loading,
  // and never on touch devices (the trail is disabled there anyway).
  const [trailReady, setTrailReady] = useState(false);
  const trailReadyRef = useRef(false);

  /* =================================================
     DEFER TRAIL IMAGE DOWNLOADS
  ================================================= */
  useEffect(() => {
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!canHover) return;

    let idleId;
    let timeoutId;

    const start = () => {
      trailReadyRef.current = true;
      setTrailReady(true);
    };

    const scheduleStart = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(start, { timeout: 3000 });
      } else {
        timeoutId = window.setTimeout(start, 1500);
      }
    };

    if (document.readyState === "complete") {
      scheduleStart();
    } else {
      window.addEventListener("load", scheduleStart, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleStart);

      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  /* =================================================
     CURSOR TRAIL ANIMATION
  ================================================= */
  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!canHover) return;

    const cards = cardsRef.current;

    const handlePointerMove = (event) => {
      // Don't spawn empty cards before their images are requested
      if (!trailReadyRef.current) return;

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

      indexRef.current = (indexRef.current + 1) % cards.length;

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
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);

      cards.forEach((card) => {
        if (card) {
          gsap.killTweensOf(card);
        }
      });
    };
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      {/* BACKGROUND VIDEO */}
      <div className="hero-video-wrap" aria-hidden="true">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster}
        >
          <source src={heroVideoWebm} type="video/webm" />
          <source src={heroVideoMp4} type="video/mp4" />
        </video>
      </div>

      {/* DARK READABILITY OVERLAY */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* MUSIC CURSOR TRAIL
          Card wrappers always render (GSAP needs the refs);
          the <img> src is only set once trailReady is true. */}
      <div className="hero-trail-layer" aria-hidden="true">
        {musicImages.map((src, index) => (
          <div
            className="hero-trail-card"
            key={index}
            ref={(element) => {
              cardsRef.current[index] = element;
            }}
          >
            {trailReady && (
              <img
                src={src}
                alt=""
                draggable="false"
                decoding="async"
              />
            )}
          </div>
        ))}
      </div>

      {/* HERO CONTENT */}
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