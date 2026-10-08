import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const LOADER_VIDEO = "/assets/hero_section_bg.mp4";
const LOADER_NAME = "DARSHAN LOHADE";
const SHARD_COUNT = 18;

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);

  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const shardsRef = useRef([]);
  const animationFrameRef = useRef(null);

  const progressRef = useRef(null);
  const progressLineRef = useRef(null);

  const hasShatteredRef = useRef(false);

  const [progress, setProgress] = useState(0);

  /* =========================================================
     DRAW VIDEO INSIDE TEXT
  ========================================================= */

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    if (video.readyState < 2) {
      animationFrameRef.current =
        requestAnimationFrame(drawCanvas);
      return;
    }

    const rect = canvas.getBoundingClientRect();

    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    if (
      canvas.width !== width * dpr ||
      canvas.height !== height * dpr
    ) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    /* =======================================================
       VIDEO COVER
    ======================================================= */

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    if (!videoWidth || !videoHeight) {
      animationFrameRef.current =
        requestAnimationFrame(drawCanvas);

      return;
    }

    const videoRatio =
      videoWidth / videoHeight;

    const canvasRatio =
      width / height;

    let drawWidth;
    let drawHeight;
    let offsetX;
    let offsetY;

    if (videoRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = height * videoRatio;

      offsetX =
        (width - drawWidth) / 2;

      offsetY = 0;
    } else {
      drawWidth = width;
      drawHeight = width / videoRatio;

      offsetX = 0;

      offsetY =
        (height - drawHeight) / 2;
    }

    /* =======================================================
       DRAW VIDEO
    ======================================================= */

    ctx.drawImage(
      video,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );

    /* =======================================================
       TEXT MASK
    ======================================================= */

    const isMobile =
      window.innerWidth <= 576;

    const fontSize = isMobile
      ? Math.min(36, width * 0.095)
      : Math.min(64, width * 0.084);

    ctx.globalCompositeOperation =
      "destination-in";

    ctx.font =
      `900 ${fontSize}px "Satoshi", sans-serif`;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ffffff";

    ctx.fillText(
      LOADER_NAME,
      width / 2,
      height / 2
    );

    ctx.globalCompositeOperation =
      "source-over";

    animationFrameRef.current =
      requestAnimationFrame(drawCanvas);
  };

  /* =========================================================
     RESIZE
  ========================================================= */

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const isMobile =
        window.innerWidth <= 576;

      canvas.style.width = isMobile
        ? "calc(100% - 32px)"
        : "min(760px, calc(100% - 48px))";

      canvas.style.height = isMobile
        ? "80px"
        : "120px";
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /* =========================================================
     START CANVAS
  ========================================================= */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const startCanvas = () => {
      if (!animationFrameRef.current) {
        drawCanvas();
      }
    };

    if (video.readyState >= 2) {
      startCanvas();
    } else {
      video.addEventListener(
        "loadeddata",
        startCanvas
      );
    }

    return () => {
      video.removeEventListener(
        "loadeddata",
        startCanvas
      );
    };
  }, []);

  /* =========================================================
     PROGRESS
  ========================================================= */

  useEffect(() => {
    let value = 0;

    const interval = setInterval(() => {
      value +=
        Math.floor(
          Math.random() * 7
        ) + 3;

      if (value >= 100) {
        value = 100;

        clearInterval(interval);
      }

      setProgress(value);
    }, 85);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* =========================================================
     SHATTER
  ========================================================= */

  const shatterName = () => {
    if (hasShatteredRef.current) return;

    hasShatteredRef.current = true;

    const canvas =
      canvasRef.current;

    const loader =
      loaderRef.current;

    if (!canvas || !loader) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(
        animationFrameRef.current
      );

      animationFrameRef.current = null;
    }

    const rect =
      canvas.getBoundingClientRect();

    const sourceWidth = canvas.width;
    const sourceHeight = canvas.height;

    const sourceCanvas =
      document.createElement("canvas");

    sourceCanvas.width = sourceWidth;
    sourceCanvas.height = sourceHeight;

    const sourceContext =
      sourceCanvas.getContext("2d");

    if (!sourceContext) return;

    sourceContext.drawImage(
      canvas,
      0,
      0
    );

    /* =======================================================
       BUILD SHARDS FROM THE CURRENT TEXT FRAME
    ======================================================= */

    const shards =
      shardsRef.current.filter(Boolean);

    const shardWidth =
      sourceWidth / SHARD_COUNT;

    shards.forEach((shard, index) => {
      if (!shard) return;

      const shardCanvas =
        shard.querySelector(
          ".site-loader-shard-canvas"
        );

      if (!shardCanvas) return;

      const shardContext =
        shardCanvas.getContext("2d");

      if (!shardContext) return;

      const startX =
        index * shardWidth;

      const endX =
        index === SHARD_COUNT - 1
          ? sourceWidth
          : (index + 1) * shardWidth;

      const actualWidth =
        endX - startX;

      shardCanvas.width =
        Math.ceil(actualWidth);

      shardCanvas.height =
        sourceHeight;

      shardContext.clearRect(
        0,
        0,
        shardCanvas.width,
        shardCanvas.height
      );

      shardContext.drawImage(
        sourceCanvas,
        startX,
        0,
        actualWidth,
        sourceHeight,
        0,
        0,
        actualWidth,
        sourceHeight
      );

      shard.style.left =
        `${(index / SHARD_COUNT) * 100}%`;

      shard.style.width =
        `${100 / SHARD_COUNT}%`;

      shard.style.height = "100%";

      gsap.set(shard, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
      });
    });

    /* Hide original */
    gsap.set(canvas, {
      opacity: 0,
    });

    /* Reveal shards */
    gsap.set(
      shards,
      {
        opacity: 1,
      }
    );

    const timeline =
      gsap.timeline({
        onComplete,
      });

    /* =======================================================
       SHATTER THE NAME
    ======================================================= */

    shards.forEach(
      (shard, index) => {
        if (!shard) return;

        const center =
          index -
          (SHARD_COUNT - 1) / 2;

        const direction =
          center < 0 ? -1 : 1;

        const distanceX =
          gsap.utils.random(
            280,
            720
          ) * direction;

        const distanceY =
          gsap.utils.random(
            -320,
            320
          );

        const rotation =
          gsap.utils.random(
            -45,
            45
          );

        const scale =
          gsap.utils.random(
            0.72,
            1.18
          );

        const duration =
          gsap.utils.random(
            0.72,
            1.08
          );

        timeline.to(
          shard,
          {
            x: distanceX,
            y: distanceY,
            rotation,
            scale,
            opacity: 0,
            filter:
              "blur(6px)",
            duration,
            ease: "power4.out",
          },
          index * 0.018
        );
      }
    );

    /* =======================================================
       PROGRESS NUMBER
    ======================================================= */

    timeline.to(
      progressRef.current,
      {
        y: -30,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      0
    );

    /* =======================================================
       PROGRESS BAR
    ======================================================= */

    timeline.to(
      ".site-loader-line",
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
      },
      0
    );

    /* =======================================================
       LOADER LEAVES
    ======================================================= */

    timeline.to(
      loader,
      {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
      },
      0.82
    );
  };

  /* =========================================================
     TRIGGER SHATTER AT 100
  ========================================================= */

  useEffect(() => {
    if (progress !== 100) return;

    const timer = setTimeout(() => {
      shatterName();
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [progress]);

  /* =========================================================
     PROGRESS UI
  ========================================================= */

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.textContent =
        progress;
    }

    if (progressLineRef.current) {
      gsap.to(
        progressLineRef.current,
        {
          scaleX:
            progress / 100,
          duration: 0.3,
          ease: "power2.out",
        }
      );
    }
  }, [progress]);

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      if (
        animationFrameRef.current
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, []);

  return (
    <div
      className="site-loader"
      ref={loaderRef}
    >
      {/* ===================================================
          HIDDEN VIDEO SOURCE
      =================================================== */}

      <video
        ref={videoRef}
        className="site-loader-source-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src={LOADER_VIDEO}
          type="video/mp4"
        />
      </video>

      {/* ===================================================
          ORIGINAL VIDEO-TEXT CANVAS
      =================================================== */}

      <canvas
        ref={canvasRef}
        className="site-loader-name-canvas"
      />

      {/* ===================================================
          SHATTER SLICES
      =================================================== */}

      <div className="site-loader-shards">
        {Array.from({
          length: SHARD_COUNT,
        }).map((_, index) => (
          <div
            key={index}
            className="site-loader-shard"
            ref={(element) => {
              shardsRef.current[index] =
                element;
            }}
          >
            <canvas className="site-loader-shard-canvas" />
          </div>
        ))}
      </div>

      {/* ===================================================
          PROGRESS NUMBER
      =================================================== */}

      <div
        className="site-loader-progress"
        ref={progressRef}
      >
        0
      </div>

      {/* ===================================================
          PROGRESS LINE
      =================================================== */}

      <div className="site-loader-line">
        <div
          ref={progressLineRef}
          className="site-loader-line-progress"
        />
      </div>
    </div>
  );
}