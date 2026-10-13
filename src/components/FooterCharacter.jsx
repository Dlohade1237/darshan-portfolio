import React, { useEffect, useRef, useState } from "react";

/* =========================================================
   CLOUDINARY IMAGES
   Before, all 8 character images were raw PNGs at full
   upload size. Now they are:
   - w_800,c_limit → never wider than 800px (ratio preserved,
                     so the eyes still line up with the head)
   - f_auto        → AVIF/WebP where supported
   - q_auto        → automatic quality
   Set the 800 to roughly 2x the character's displayed width.
========================================================= */

const CLOUD = "https://res.cloudinary.com/m1xt1lo4/image/upload";
const IMG_T = "w_800,c_limit,f_auto,q_auto";

const cloudinaryImage = (version, file) =>
  `${CLOUD}/${IMG_T}/${version}/${file}`;

const BODY_SRC = cloudinaryImage("v1791826908", "body.png");
const HEAD_SRC = cloudinaryImage("v1791826915", "head.png");

const EYE_SPRITES = {
  center: cloudinaryImage("v1791826908", "eyes-center.png"),
  left: cloudinaryImage("v1791826912", "eyes-left.png"),
  right: cloudinaryImage("v1791826910", "eyes-right.png"),
  up: cloudinaryImage("v1791826909", "eyes-up.png"),
  down: cloudinaryImage("v1791826911", "eyes-down.png"),
  blink: cloudinaryImage("v1791826907", "eyes-blink.png"),
};

// Maps cursor angle to the right eye sprite
function getEyeDirection(angleDeg) {
  // angleDeg: 0 = right, 90 = down, 180 = left, 270 = up
  if (angleDeg >= 337.5 || angleDeg < 22.5) return "right";
  if (angleDeg >= 22.5 && angleDeg < 67.5) return "right"; // down-right → right
  if (angleDeg >= 67.5 && angleDeg < 112.5) return "down";
  if (angleDeg >= 112.5 && angleDeg < 157.5) return "left"; // down-left → left
  if (angleDeg >= 157.5 && angleDeg < 202.5) return "left";
  if (angleDeg >= 202.5 && angleDeg < 247.5) return "left"; // up-left → left
  if (angleDeg >= 247.5 && angleDeg < 292.5) return "up";
  if (angleDeg >= 292.5 && angleDeg < 337.5) return "right"; // up-right → right
  return "center";
}

export default function FooterCharacter() {
  const rootRef = useRef(null);
  const headRef = useRef(null);

  const [eyeDir, setEyeDir] = useState("center");
  const [isBlinking, setIsBlinking] = useState(false);

  const blinkTimer = useRef(null);
  const blinkEndTimer = useRef(null);
  const rafRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  /* =========================================================
     RANDOM BLINK EVERY 2–5s
     Both timers are now cleared on unmount (the inner one
     previously leaked).
  ========================================================= */

  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 3000;

      blinkTimer.current = setTimeout(() => {
        setIsBlinking(true);

        blinkEndTimer.current = setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 120);
      }, delay);
    };

    scheduleBlink();

    return () => {
      clearTimeout(blinkTimer.current);
      clearTimeout(blinkEndTimer.current);
    };
  }, []);

  /* =========================================================
     PRELOAD SPRITES + TRACK CURSOR ONLY NEAR THE FOOTER

     1. When the footer is ~1500px away, all eye sprites are
        downloaded, so the first look left/right/up/down never
        waits on the network.
     2. Cursor tracking only runs while the footer is on
        screen, instead of for the whole page.
     3. Head tilt is written straight to the element, so
        mouse movement no longer re-renders the component.
  ========================================================= */

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    /* ---------- PRELOAD ---------- */

    let hasPreloaded = false;

    const preloadSprites = () => {
      if (hasPreloaded) return;

      hasPreloaded = true;

      // Touch devices only ever show center + blink
      const sprites = canHover
        ? Object.values(EYE_SPRITES)
        : [EYE_SPRITES.center, EYE_SPRITES.blink];

      sprites.forEach((src) => {
        const image = new Image();
        image.decoding = "async";
        image.src = src;
      });
    };

    /* ---------- TRACKING ---------- */

    const updateFromPointer = () => {
      rafRef.current = null;

      const head = headRef.current;

      if (!head) return;

      const { x, y } = pointerRef.current;

      const rect = head.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = x - cx;
      const dy = y - cy;

      // Angle from head center to cursor
      const angle =
        ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;

      // React only re-renders when the direction actually changes
      setEyeDir(getEyeDirection(angle));

      // Head tilt — very subtle, max ±4deg horizontal, ±2deg vertical
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist =
        Math.max(window.innerWidth, window.innerHeight) / 2;
      const strength = Math.min(dist / maxDist, 1);

      const tiltX = (dy / Math.abs(dy || 1)) * strength * 2;
      const tiltY = (dx / Math.abs(dx || 1)) * strength * 4;

      head.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };

    const handleMouseMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateFromPointer);
      }
    };

    const cancelFrame = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const resetPose = () => {
      cancelFrame();

      setEyeDir("center");

      if (headRef.current) {
        headRef.current.style.transform =
          "rotateX(0deg) rotateY(0deg)";
      }
    };

    let isTracking = false;

    const startTracking = () => {
      if (isTracking || !canHover) return;

      isTracking = true;

      window.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });

      // Eyes return to center when the cursor leaves the window
      document.documentElement.addEventListener(
        "mouseleave",
        resetPose
      );
    };

    const stopTracking = () => {
      if (!isTracking) return;

      isTracking = false;

      window.removeEventListener("mousemove", handleMouseMove);

      document.documentElement.removeEventListener(
        "mouseleave",
        resetPose
      );

      cancelFrame();
    };

    /* ---------- OBSERVERS ---------- */

    if (!("IntersectionObserver" in window)) {
      preloadSprites();
      startTracking();

      return stopTracking;
    }

    const preloadObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          preloadSprites();
          preloadObserver.disconnect();
        }
      },
      { rootMargin: "1500px 0px" }
    );

    const trackingObserver = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some(
          (entry) => entry.isIntersecting
        );

        if (isVisible) {
          startTracking();
        } else {
          stopTracking();
        }
      },
      { rootMargin: "100px 0px" }
    );

    preloadObserver.observe(root);
    trackingObserver.observe(root);

    return () => {
      preloadObserver.disconnect();
      trackingObserver.disconnect();
      stopTracking();
    };
  }, []);

  const eyeSrc = isBlinking
    ? EYE_SPRITES.blink
    : EYE_SPRITES[eyeDir] || EYE_SPRITES.center;

  return (
    <div className="footer-character" ref={rootRef}>
      {/* BODY — static */}
      <img
        src={BODY_SRC}
        alt=""
        className="footer-character-body"
        loading="lazy"
        decoding="async"
        draggable="false"
      />

      {/* HEAD — subtle tilt toward cursor (transform set via ref) */}
      <div
        ref={headRef}
        className="footer-character-head"
        style={{
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={HEAD_SRC}
          alt="Character"
          className="footer-character-head-image"
          loading="lazy"
          decoding="async"
          draggable="false"
        />

        {/* EYES — swap sprite based on cursor direction */}
        <img
          src={eyeSrc}
          alt=""
          className="footer-character-eyes"
          style={{ transition: "opacity 0.05s" }}
          decoding="async"
          draggable="false"
        />
      </div>
    </div>
  );
}