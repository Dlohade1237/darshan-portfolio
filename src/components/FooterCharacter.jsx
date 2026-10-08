import React, { useEffect, useRef, useState, useCallback } from "react";

// Maps cursor angle to the right eye sprite
function getEyeDirection(angleDeg) {
  // angleDeg: 0 = right, 90 = down, 180 = left, 270 = up
  if (angleDeg >= 337.5 || angleDeg < 22.5)  return "right";
  if (angleDeg >= 22.5  && angleDeg < 67.5)  return "right"; // down-right → right
  if (angleDeg >= 67.5  && angleDeg < 112.5) return "down";
  if (angleDeg >= 112.5 && angleDeg < 157.5) return "left";  // down-left → left
  if (angleDeg >= 157.5 && angleDeg < 202.5) return "left";
  if (angleDeg >= 202.5 && angleDeg < 247.5) return "left";  // up-left → left
  if (angleDeg >= 247.5 && angleDeg < 292.5) return "up";
  if (angleDeg >= 292.5 && angleDeg < 337.5) return "right"; // up-right → right
  return "center";
}

const EYE_SPRITES = {
  center: "/assets/character/eyes-center.png",
  left:   "/assets/character/eyes-left.png",
  right:  "/assets/character/eyes-right.png",
  up:     "/assets/character/eyes-up.png",
  down:   "/assets/character/eyes-down.png",
  blink:  "/assets/character/eyes-blink.png",
};

export default function FooterCharacter() {
  const headRef = useRef(null);
  const [eyeDir, setEyeDir]     = useState("center");
  const [headTilt, setHeadTilt] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkTimer = useRef(null);
  const rafRef = useRef(null);

  // Random blink every 2–5s
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 3000;
      blinkTimer.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 120);
      }, delay);
    };
    scheduleBlink();
    return () => clearTimeout(blinkTimer.current);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const head = headRef.current;
      if (!head) return;

      const rect = head.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Angle from head center to cursor
      const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
      setEyeDir(getEyeDirection(angle));

      // Head tilt — very subtle, max ±4deg horizontal, ±2deg vertical
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.max(window.innerWidth, window.innerHeight) / 2;
      const strength = Math.min(dist / maxDist, 1);

      setHeadTilt({
        x: (dy / Math.abs(dy || 1)) * strength * 2,  // slight vertical nod
        y: (dx / Math.abs(dx || 1)) * strength * 4,  // horizontal turn
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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  const eyeSrc = isBlinking
    ? EYE_SPRITES.blink
    : EYE_SPRITES[eyeDir] || EYE_SPRITES.center;

  return (
    <div className="footer-character">

      {/* BODY — static */}
      <img
        src="/assets/character/body.png"
        alt=""
        className="footer-character-body"
      />

      {/* HEAD — subtle tilt toward cursor */}
      <div
        ref={headRef}
        className="footer-character-head"
        style={{
          transform: `rotateX(${headTilt.x}deg) rotateY(${headTilt.y}deg)`,
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src="/assets/character/head.png"
          alt="Character"
          className="footer-character-head-image"
        />

        {/* EYES — swap sprite based on cursor direction */}
        <img
          src={eyeSrc}
          alt=""
          className="footer-character-eyes"
          style={{ transition: "opacity 0.05s" }}
        />
      </div>

    </div>
  );
}