import { useEffect, useRef } from "react";

export default function CrimsonDomain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame;

    const backgroundParticles = [];
    const formations = [];

    const SETTINGS = {
      backgroundParticles: 90,
      formations: 5,
      red: {
        r: 255,
        g: 20,
        b: 35,
      },
    };

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function createBackgroundParticles() {
      backgroundParticles.length = 0;

      for (let i = 0; i < SETTINGS.backgroundParticles; i++) {
        backgroundParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: random(-0.12, 0.12),
          vy: random(-0.12, 0.12),
          size: random(0.4, 1.4),
          alpha: random(0.12, 0.5),
          phase: random(0, Math.PI * 2),
          speed: random(0.004, 0.012),
        });
      }
    }

    function createHexagramPoints(radius) {
      const points = [];

      for (let i = 0; i < 6; i++) {
        const angle = -Math.PI / 2 + i * Math.PI / 3;

        points.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        });
      }

      return points;
    }

    function getSegments(radius) {
      const p = createHexagramPoints(radius);

      return [
        [p[0], p[2]],
        [p[2], p[4]],
        [p[4], p[0]],
        [p[1], p[3]],
        [p[3], p[5]],
        [p[5], p[1]],
      ];
    }

    function createFormations() {
      formations.length = 0;

      for (let i = 0; i < SETTINGS.formations; i++) {
        formations.push({
          x: width * random(0.15, 0.85),
          y: height * random(0.15, 0.85),
          radius: random(45, 100),
          rotation: random(0, Math.PI * 2),
          rotationSpeed: random(-0.00025, 0.00025),
          driftX: random(-0.15, 0.15),
          driftY: random(-0.15, 0.15),
          progress: random(0, 7),
          speed: random(0.004, 0.008),
          mode: Math.random() > 0.45 ? "lines" : "particles",
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createBackgroundParticles();
      createFormations();
    }

    function updateBackgroundParticles() {
      for (const particle of backgroundParticles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.phase += particle.speed;

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;

        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;
      }
    }

    function drawBackgroundParticles() {
      for (const particle of backgroundParticles) {
        const pulse =
          0.55 + Math.sin(particle.phase) * 0.45;

        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(255, 25, 40, ${
          particle.alpha * pulse
        })`;

        ctx.fill();
      }
    }

    function drawGlow(x, y, radius, intensity) {
      const gradient = ctx.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        radius
      );

      gradient.addColorStop(
        0,
        `rgba(255, 0, 25, ${intensity})`
      );

      gradient.addColorStop(
        0.35,
        `rgba(180, 0, 15, ${intensity * 0.35})`
      );

      gradient.addColorStop(
        1,
        "rgba(0, 0, 0, 0)"
      );

      ctx.fillStyle = gradient;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    function drawLineFormation(f) {
      const segments = getSegments(f.radius);
      const cycle = f.progress % 6;

      let visibility = 0;

      if (cycle < 1) {
        visibility = cycle;
      } else if (cycle < 2) {
        visibility = 1;
      } else if (cycle < 3) {
        visibility = 1 - (cycle - 2);
      } else {
        visibility = 0;
      }

      if (visibility <= 0) return;

      ctx.save();

      ctx.translate(f.x, f.y);
      ctx.rotate(f.rotation);

      for (let i = 0; i < segments.length; i++) {
        const [a, b] = segments[i];

        const segmentProgress = Math.max(
          0,
          Math.min(
            1,
            cycle * 2.2 - i * 0.22
          )
        );

        if (segmentProgress <= 0) continue;

        const endX = lerp(
          a.x,
          b.x,
          segmentProgress
        );

        const endY = lerp(
          a.y,
          b.y,
          segmentProgress
        );

        ctx.beginPath();

        ctx.moveTo(a.x, a.y);
        ctx.lineTo(endX, endY);

        ctx.strokeStyle = `rgba(255, 25, 40, ${
          visibility * 0.75
        })`;

        ctx.lineWidth = 1.15;

        ctx.shadowBlur = 14;
        ctx.shadowColor =
          "rgba(255, 0, 25, 0.9)";

        ctx.stroke();
      }

      ctx.restore();
    }

    function drawParticleFormation(f) {
      const segments = getSegments(f.radius);
      const points = [];

      for (const segment of segments) {
        const [a, b] = segment;
        const count = 18;

        for (let i = 0; i < count; i++) {
          const t = i / (count - 1);

          points.push({
            x: lerp(a.x, b.x, t),
            y: lerp(a.y, b.y, t),
          });
        }
      }

      const cycle = f.progress % 6;

      let formationProgress;

      if (cycle < 1.5) {
        formationProgress = cycle / 1.5;
      } else if (cycle < 3.5) {
        formationProgress = 1;
      } else {
        formationProgress =
          1 - (cycle - 3.5) / 2.5;
      }

      formationProgress = Math.max(
        0,
        Math.min(1, formationProgress)
      );

      ctx.save();

      ctx.translate(f.x, f.y);
      ctx.rotate(f.rotation);

      for (let i = 0; i < points.length; i++) {
        const target = points[i];

        const angle =
          i * 2.399 + f.progress * 0.15;

        const distance =
          100 + Math.sin(i * 4.1) * 35;

        const startX =
          target.x + Math.cos(angle) * distance;

        const startY =
          target.y + Math.sin(angle) * distance;

        const stagger = Math.max(
          0,
          Math.min(
            1,
            formationProgress * 1.35 -
              (i / points.length) * 0.35
          )
        );

        const x = lerp(
          startX,
          target.x,
          stagger
        );

        const y = lerp(
          startY,
          target.y,
          stagger
        );

        const alpha =
          stagger *
          (0.45 +
            Math.sin(
              i * 2 + f.progress * 3
            ) *
              0.3);

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          1.1,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(255, 30, 45, ${alpha})`;

        ctx.shadowBlur = 12;

        ctx.shadowColor =
          "rgba(255, 0, 20, 0.9)";

        ctx.fill();
      }

      ctx.restore();
    }

    function updateFormations() {
      for (const f of formations) {
        f.progress += f.speed;
        f.rotation += f.rotationSpeed;

        f.x += f.driftX;
        f.y += f.driftY;

        if (f.x < -150) {
          f.x = width + 150;
        }

        if (f.x > width + 150) {
          f.x = -150;
        }

        if (f.y < -150) {
          f.y = height + 150;
        }

        if (f.y > height + 150) {
          f.y = -150;
        }
      }
    }

    function animate() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      updateBackgroundParticles();
      updateFormations();

      drawBackgroundParticles();

      for (const f of formations) {
        drawGlow(
          f.x,
          f.y,
          f.radius * 2.2,
          0.045
        );

        if (f.mode === "lines") {
          drawLineFormation(f);
        } else {
          drawParticleFormation(f);
        }
      }

      animationFrame =
        requestAnimationFrame(animate);
    }

    window.addEventListener(
      "resize",
      resize
    );

    resize();
    animate();

    return () => {
      window.removeEventListener(
        "resize",
        resize
      );

      cancelAnimationFrame(
        animationFrame
      );
    };
  }, []);

  return (
    <div className="crimson-domain">
      <div className="title-container">
        <h1 className="title">
          Crimson Domain
        </h1>

        <div className="title-line" />
      </div>

      <canvas
        ref={canvasRef}
        id="canvas"
      />

      <style>{`
        html,
        body,
        #root {
          margin: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #000;
        }

        .crimson-domain {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #000;
        }

        .crimson-domain canvas {
          display: block;
          width: 100%;
          height: 100%;
        }

        .title-container {
          position: fixed;
          top: 42px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          pointer-events: none;
          user-select: none;
          text-align: center;
        }

        .title {
          margin: 0;
          color: #ff2438;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(
            30px,
            4vw,
            58px
          );
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          white-space: nowrap;

          text-shadow:
            0 0 5px rgba(
              255,
              20,
              35,
              0.95
            ),
            0 0 14px rgba(
              255,
              0,
              25,
              0.75
            ),
            0 0 30px rgba(
              180,
              0,
              15,
              0.5
            ),
            0 0 65px rgba(
              120,
              0,
              10,
              0.3
            );

          opacity: 0.94;

          animation:
            titlePulse
            5s
            ease-in-out
            infinite;
        }

        .title-line {
          width: 55%;
          height: 1px;
          margin: 13px auto 0;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(
                255,
                25,
                40,
                0.8
              ),
              transparent
            );

          box-shadow:
            0 0 8px rgba(
              255,
              0,
              20,
              0.8
            ),
            0 0 20px rgba(
              180,
              0,
              15,
              0.4
            );

          opacity: 0.7;

          animation:
            linePulse
            5s
            ease-in-out
            infinite;
        }

        @keyframes titlePulse {
          0%,
          100% {
            opacity: 0.78;

            text-shadow:
              0 0 5px rgba(
                255,
                20,
                35,
                0.7
              ),
              0 0 14px rgba(
                255,
                0,
                25,
                0.5
              ),
              0 0 30px rgba(
                180,
                0,
                15,
                0.3
              ),
              0 0 60px rgba(
                120,
                0,
                10,
                0.2
              );
          }

          50% {
            opacity: 1;

            text-shadow:
              0 0 6px rgba(
                255,
                30,
                45,
                1
              ),
              0 0 18px rgba(
                255,
                0,
                25,
                0.9
              ),
              0 0 38px rgba(
                200,
                0,
                20,
                0.65
              ),
              0 0 75px rgba(
                120,
                0,
                10,
                0.35
              );
          }
        }

        @keyframes linePulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scaleX(0.8);
          }

          50% {
            opacity: 0.8;
            transform: scaleX(1);
          }
        }

        @media (max-width: 600px) {
          .title-container {
            top: 28px;
          }

          .title {
            font-size: 25px;
            letter-spacing: 0.16em;
          }

          .title-line {
            margin-top: 9px;
          }
        }
      `}</style>
    </div>
  );
}
