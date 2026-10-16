
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

// Maps cursor angle to the right eye sprite
function getEyeDirection(angleDeg) {
  // angleDeg: 0 = right, 90 = down, 180 = left, 270 = up
  if (angleDeg >= 337.5 || angleDeg < 22.5) return "right";
  if (angleDeg >= 22.5 && angleDeg < 67.5) return "right";
  if (angleDeg >= 67.5 && angleDeg < 112.5) return "down";
  if (angleDeg >= 112.5 && angleDeg < 157.5) return "left";
  if (angleDeg >= 157.5 && angleDeg < 202.5) return "left";
  if (angleDeg >= 202.5 && angleDeg < 247.5) return "left";
  if (angleDeg >= 247.5 && angleDeg < 292.5) return "up";
  if (angleDeg >= 292.5 && angleDeg < 337.5) return "right";

  return "center";
}

const EYE_SPRITES = {
  center:
    "https://res.cloudinary.com/m1xt1lo4/image/upload/v1791826908/eyes-center.png",
  left:
    "https://res.cloudinary.com/m1xt1lo4/image/upload/v1791826912/eyes-left.png",
  right:
    "https://res.cloudinary.com/m1xt1lo4/image/upload/v1791826910/eyes-right.png",
  up:
    "https://res.cloudinary.com/m1xt1lo4/image/upload/v1791826909/eyes-up.png",
  down:
    "https://res.cloudinary.com/m1xt1lo4/image/upload/v1791826911/eyes-down.png",
  blink:
    "https://res.cloudinary.com/m1xt1lo4/image/upload/v1791826907/eyes-blink.png",
};

export default function FooterCharacter() {
  const headRef = useRef(null);

  const [eyeDir, setEyeDir] = useState("center");
  const [headTilt, setHeadTilt] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  const blinkTimer = useRef(null);
  const blinkResetTimer = useRef(null);
  const rafRef = useRef(null);

  // Random blink every 2–5 seconds.
  useEffect(() => {
    let isMounted = true;

    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 3000;

      blinkTimer.current = setTimeout(() => {
        if (!isMounted) return;

        setIsBlinking(true);

        blinkResetTimer.current = setTimeout(() => {
          if (!isMounted) return;

          setIsBlinking(false);
          scheduleBlink();
        }, 120);
      }, delay);
    };

    scheduleBlink();

    return () => {
      isMounted = false;

      clearTimeout(blinkTimer.current);
      clearTimeout(blinkResetTimer.current);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const head = headRef.current;

      if (!head) return;

      const rect = head.getBoundingClientRect();

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Determine the eye direction.
      const angle =
        ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;

      setEyeDir(getEyeDirection(angle));

      // Subtle head movement: maximum ±2deg vertical, ±4deg horizontal.
      const dist = Math.sqrt(dx * dx + dy * dy);

      const maxDist = Math.max(
        window.innerWidth,
        window.innerHeight
      ) / 2;

      const strength = Math.min(dist / maxDist, 1);

      setHeadTilt({
        x: (dy / Math.abs(dy || 1)) * strength * 2,
        y: (dx / Math.abs(dx || 1)) * strength * 4,
      });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setEyeDir("center");
    setHeadTilt({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  const eyeSrc = isBlinking
    ? EYE_SPRITES.blink
    : EYE_SPRITES[eyeDir] || EYE_SPRITES.center;

  return (
    <div
      className="footer-character"
      onMouseLeave={handleMouseLeave}
    >
      {/* BODY — static */}
      <img
        src="https://res.cloudinary.com/m1xt1lo4/image/upload/v1791826908/body.png"
        alt=""
        className="footer-character-body"
        loading="lazy"
        decoding="async"
      />

      {/* HEAD — fixed initial position with subtle cursor tilt */}
      <div
        ref={headRef}
        className="footer-character-head"
        style={{
          "--head-tilt-x": `${headTilt.x}deg`,
          "--head-tilt-y": `${headTilt.y}deg`,
        }}
      >
        <img
          src="https://res.cloudinary.com/m1xt1lo4/image/upload/v1791826915/head.png"
          alt="Character"
          className="footer-character-head-image"
          loading="lazy"
          decoding="async"
        />

        {/* EYES — swap sprite based on cursor direction */}
        <img
          src={eyeSrc}
          alt=""
          className="footer-character-eyes"
          style={{ transition: "opacity 0.05s" }}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
