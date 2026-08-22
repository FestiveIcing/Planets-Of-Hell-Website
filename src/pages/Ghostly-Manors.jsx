import { useEffect, useRef } from "react";

export default function GhostlyManors() {
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
      backgroundParticles: 115,
      formations: 6,
    };

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    /*
     * ------------------------------------------------------------
     * BACKGROUND PARTICLES
     * ------------------------------------------------------------
     */

    function createBackgroundParticles() {
      backgroundParticles.length = 0;

      for (let i = 0; i < SETTINGS.backgroundParticles; i++) {
        backgroundParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,

          vx: random(-0.08, 0.08),
          vy: random(-0.08, 0.08),

          size: random(0.35, 1.35),

          alpha: random(0.08, 0.38),

          phase: random(0, Math.PI * 2),

          speed: random(0.003, 0.011),
        });
      }
    }

    function updateBackgroundParticles() {
      for (const particle of backgroundParticles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.phase += particle.speed;

        if (particle.x < -20) {
          particle.x = width + 20;
        }

        if (particle.x > width + 20) {
          particle.x = -20;
        }

        if (particle.y < -20) {
          particle.y = height + 20;
        }

        if (particle.y > height + 20) {
          particle.y = -20;
        }
      }
    }

    function drawBackgroundParticles() {
      for (const particle of backgroundParticles) {
        const pulse =
          0.45 +
          Math.sin(particle.phase) * 0.55;

        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(235, 238, 242, ${
          particle.alpha * pulse
        })`;

        ctx.fill();
      }
    }

    /*
     * ------------------------------------------------------------
     * GHOSTLY MANOR GEOMETRY
     * ------------------------------------------------------------
     *
     * These aren't perfect geometric symbols.
     * Each formation is assembled from architectural points:
     *
     *      roof
     *       /\
     *      /  \
     *  ___/____\___
     *  |  |    |  |
     *  |  |    |  |
     *  |__|____|__|
     *
     * The points are intentionally distorted to make
     * each apparition feel slightly different.
     */

    function createManorPoints(scale) {
      return [
        { x: -scale * 0.48, y: scale * 0.42 },
        { x: -scale * 0.48, y: -scale * 0.05 },

        { x: -scale * 0.27, y: -scale * 0.05 },
        { x: -scale * 0.18, y: -scale * 0.27 },

        { x: 0, y: -scale * 0.55 },

        { x: scale * 0.18, y: -scale * 0.27 },
        { x: scale * 0.27, y: -scale * 0.05 },

        { x: scale * 0.48, y: -scale * 0.05 },
        { x: scale * 0.48, y: scale * 0.42 },

        { x: scale * 0.16, y: scale * 0.42 },
        { x: scale * 0.16, y: scale * 0.08 },

        { x: -scale * 0.16, y: scale * 0.08 },
        { x: -scale * 0.16, y: scale * 0.42 },

        { x: -scale * 0.48, y: scale * 0.42 },
      ];
    }

    function createBrokenArchitecture(scale) {
      const p = createManorPoints(scale);

      const segments = [];

      for (let i = 0; i < p.length - 1; i++) {
        segments.push([p[i], p[i + 1]]);
      }

      /*
       * Interior architectural details.
       */

      segments.push([
        { x: -scale * 0.32, y: -scale * 0.05 },
        { x: -scale * 0.32, y: scale * 0.42 },
      ]);

      segments.push([
        { x: scale * 0.32, y: -scale * 0.05 },
        { x: scale * 0.32, y: scale * 0.42 },
      ]);

      segments.push([
        { x: -scale * 0.16, y: scale * 0.08 },
        { x: scale * 0.16, y: scale * 0.08 },
      ]);

      /*
       * Ghostly surrounding fragments.
       */

      segments.push([
        { x: -scale * 0.62, y: scale * 0.18 },
        { x: -scale * 0.56, y: -scale * 0.12 },
      ]);

      segments.push([
        { x: scale * 0.56, y: -scale * 0.12 },
        { x: scale * 0.62, y: scale * 0.18 },
      ]);

      return segments;
    }

    /*
     * ------------------------------------------------------------
     * FORMATIONS
     * ------------------------------------------------------------
     */

    function createFormations() {
      formations.length = 0;

      for (let i = 0; i < SETTINGS.formations; i++) {
        formations.push({
          x: width * random(0.08, 0.92),
          y: height * random(0.18, 0.88),

          radius: random(70, 135),

          rotation: random(-0.15, 0.15),

          rotationSpeed: random(
            -0.00018,
            0.00018
          ),

          driftX: random(-0.035, 0.035),
          driftY: random(-0.025, 0.025),

          progress: random(0, 7),

          speed: random(
            0.0025,
            0.0055
          ),

          mode:
            Math.random() > 0.42
              ? "particles"
              : "lines",

          opacity: random(
            0.16,
            0.38
          ),

          phase: random(
            0,
            Math.PI * 2
          ),
        });
      }
    }

    /*
     * ------------------------------------------------------------
     * GHOST GLOW
     * ------------------------------------------------------------
     */

    function drawGlow(
      x,
      y,
      radius,
      intensity
    ) {
      const gradient =
        ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          radius
        );

      gradient.addColorStop(
        0,
        `rgba(255, 255, 255, ${intensity})`
      );

      gradient.addColorStop(
        0.25,
        `rgba(220, 225, 230, ${
          intensity * 0.28
        })`
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

    /*
     * ------------------------------------------------------------
     * LINE FORMATION
     * ------------------------------------------------------------
     */

    function drawLineFormation(f) {
      const segments =
        createBrokenArchitecture(
          f.radius
        );

      const cycle =
        f.progress % 8;

      let visibility = 0;

      if (cycle < 2) {
        visibility = cycle / 2;
      } else if (cycle < 5) {
        visibility = 1;
      } else if (cycle < 8) {
        visibility =
          1 - (cycle - 5) / 3;
      }

      visibility *= f.opacity;

      if (visibility <= 0) return;

      ctx.save();

      ctx.translate(f.x, f.y);

      ctx.rotate(f.rotation);

      /*
       * Slight spectral blur.
       */

      ctx.shadowBlur = 15;

      ctx.shadowColor =
        "rgba(255,255,255,0.55)";

      for (
        let i = 0;
        i < segments.length;
        i++
      ) {
        const [a, b] = segments[i];

        const segmentProgress =
          Math.max(
            0,
            Math.min(
              1,
              cycle * 0.75 -
                i * 0.075
            )
          );

        if (
          segmentProgress <= 0
        ) {
          continue;
        }

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

        ctx.moveTo(
          a.x,
          a.y
        );

        ctx.lineTo(
          endX,
          endY
        );

        ctx.strokeStyle =
          `rgba(245, 247, 250, ${
            visibility * 0.72
          })`;

        ctx.lineWidth = 0.9;

        ctx.stroke();
      }

      ctx.restore();
    }

    /*
     * ------------------------------------------------------------
     * PARTICLE FORMATION
     * ------------------------------------------------------------
     */

    function drawParticleFormation(f) {
      const segments =
        createBrokenArchitecture(
          f.radius
        );

      const points = [];

      for (const segment of segments) {
        const [a, b] = segment;

        const count = 12;

        for (
          let i = 0;
          i < count;
          i++
        ) {
          const t =
            i /
            (count - 1);

          points.push({
            x: lerp(
              a.x,
              b.x,
              t
            ),

            y: lerp(
              a.y,
              b.y,
              t
            ),
          });
        }
      }

      const cycle =
        f.progress % 8;

      let formationProgress;

      if (cycle < 2.4) {
        formationProgress =
          cycle / 2.4;
      } else if (cycle < 5.5) {
        formationProgress = 1;
      } else {
        formationProgress =
          1 -
          (cycle - 5.5) /
            2.5;
      }

      formationProgress =
        Math.max(
          0,
          Math.min(
            1,
            formationProgress
          )
        );

      ctx.save();

      ctx.translate(
        f.x,
        f.y
      );

      ctx.rotate(
        f.rotation
      );

      for (
        let i = 0;
        i < points.length;
        i++
      ) {
        const target =
          points[i];

        const angle =
          i * 2.399 +
          f.progress * 0.12;

        const distance =
          100 +
          Math.sin(
            i * 3.7
          ) *
            45;

        const startX =
          target.x +
          Math.cos(angle) *
            distance;

        const startY =
          target.y +
          Math.sin(angle) *
            distance;

        const stagger =
          Math.max(
            0,
            Math.min(
              1,
              formationProgress *
                1.3 -
                (i /
                  points.length) *
                  0.38
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

        const shimmer =
          0.45 +
          Math.sin(
            i * 1.7 +
              f.progress *
                3
          ) *
            0.3;

        const alpha =
          stagger *
          shimmer *
          f.opacity;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          random(
            0.65,
            1.15
          ),
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(245, 247, 250, ${alpha})`;

        ctx.shadowBlur = 9;

        ctx.shadowColor =
          "rgba(255,255,255,0.65)";

        ctx.fill();
      }

      ctx.restore();
    }

    /*
     * ------------------------------------------------------------
     * FLOATING SPECTRAL DUST
     * ------------------------------------------------------------
     */

    function drawSpectralDust(f) {
      const count = 14;

      ctx.save();

      ctx.translate(
        f.x,
        f.y
      );

      for (
        let i = 0;
        i < count;
        i++
      ) {
        const angle =
          i * 2.71 +
          f.phase;

        const distance =
          f.radius *
          (1.25 +
            Math.sin(
              i * 4.2 +
                f.progress
            ) *
              0.35);

        const x =
          Math.cos(angle) *
          distance;

        const y =
          Math.sin(angle) *
          distance;

        const pulse =
          0.25 +
          Math.sin(
            f.progress * 2 +
              i
          ) *
            0.2;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          0.65,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(240,243,246,${Math.max(
            0,
            pulse
          )})`;

        ctx.fill();
      }

      ctx.restore();
    }

    /*
     * ------------------------------------------------------------
     * UPDATE FORMATIONS
     * ------------------------------------------------------------
     */

    function updateFormations() {
      for (const f of formations) {
        f.progress += f.speed;

        f.rotation +=
          f.rotationSpeed;

        f.phase += 0.003;

        f.x += f.driftX;
        f.y += f.driftY;

        if (f.x < -180) {
          f.x =
            width + 180;
        }

        if (
          f.x >
          width + 180
        ) {
          f.x = -180;
        }

        if (f.y < -180) {
          f.y =
            height + 180;
        }

        if (
          f.y >
          height + 180
        ) {
          f.y = -180;
        }
      }
    }

    /*
     * ------------------------------------------------------------
     * RESIZE
     * ------------------------------------------------------------
     */

    function resize() {
      dpr = Math.min(
        window.devicePixelRatio ||
          1,
        2
      );

      width =
        window.innerWidth;

      height =
        window.innerHeight;

      canvas.width =
        width * dpr;

      canvas.height =
        height * dpr;

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      createBackgroundParticles();

      createFormations();
    }

    /*
     * ------------------------------------------------------------
     * ANIMATION
     * ------------------------------------------------------------
     */

    function animate() {
      /*
       * Long persistence creates subtle ghost trails.
       */

      ctx.fillStyle =
        "rgba(0, 0, 0, 0.18)";

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
        const pulse =
          0.8 +
          Math.sin(
            f.progress * 2
          ) *
            0.2;

        drawGlow(
          f.x,
          f.y,
          f.radius * 2.4,
          0.018 * pulse
        );

        drawSpectralDust(f);

        if (
          f.mode ===
          "lines"
        ) {
          drawLineFormation(f);
        } else {
          drawParticleFormation(f);
        }
      }

      animationFrame =
        requestAnimationFrame(
          animate
        );
    }

    window.addEventListener(
      "resize",
      resize
    );

    resize();

    /*
     * Start with a completely black canvas,
     * rather than inheriting random pixels.
     */

    ctx.fillStyle =
      "#000000";

    ctx.fillRect(
      0,
      0,
      width,
      height
    );

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
    <div className="ghostly-manors">
      <div className="title-container">
        <h1 className="title">
          Ghostly Manors
        </h1>

        <div className="title-line" />
      </div>

      <canvas
        ref={canvasRef}
        id="ghostly-canvas"
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

        .ghostly-manors {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background:
            radial-gradient(
              ellipse at center,
              #090a0c 0%,
              #030304 48%,
              #000000 100%
            );
        }

        .ghostly-manors canvas {
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

          color: rgba(
            245,
            247,
            250,
            0.94
          );

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

          letter-spacing: 0.2em;

          text-transform: uppercase;

          white-space: nowrap;

          text-shadow:
            0 0 4px
              rgba(
                255,
                255,
                255,
                0.9
              ),

            0 0 12px
              rgba(
                230,
                235,
                240,
                0.55
              ),

            0 0 28px
              rgba(
                210,
                218,
                225,
                0.3
              ),

            0 0 60px
              rgba(
                180,
                190,
                200,
                0.15
              );

          opacity: 0.88;

          animation:
            ghostTitlePulse
            6s
            ease-in-out
            infinite;
        }

        .title-line {
          width: 58%;

          height: 1px;

          margin:
            13px auto 0;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(
                235,
                240,
                245,
                0.65
              ),
              transparent
            );

          box-shadow:
            0 0 7px
              rgba(
                255,
                255,
                255,
                0.45
              ),

            0 0 18px
              rgba(
                220,
                225,
                230,
                0.2
              );

          opacity: 0.5;

          animation:
            ghostLinePulse
            6s
            ease-in-out
            infinite;
        }

        @keyframes ghostTitlePulse {
          0%,
          100% {
            opacity: 0.62;

            transform:
              translateY(1px);

            text-shadow:
              0 0 4px
                rgba(
                  255,
                  255,
                  255,
                  0.55
                ),

              0 0 12px
                rgba(
                  230,
                  235,
                  240,
                  0.3
                ),

              0 0 30px
                rgba(
                  210,
                  218,
                  225,
                  0.14
                );
          }

          50% {
            opacity: 0.96;

            transform:
              translateY(0);

            text-shadow:
              0 0 5px
                rgba(
                  255,
                  255,
                  255,
                  0.95
                ),

              0 0 15px
                rgba(
                  240,
                  244,
                  248,
                  0.65
                ),

              0 0 32px
                rgba(
                  220,
                  225,
                  230,
                  0.38
                ),

              0 0 70px
                rgba(
                  200,
                  210,
                  220,
                  0.18
                );
          }
        }

        @keyframes ghostLinePulse {
          0%,
          100% {
            opacity: 0.22;

            transform:
              scaleX(0.72);
          }

          50% {
            opacity: 0.65;

            transform:
              scaleX(1);
          }
        }

        @media (max-width: 600px) {
          .title-container {
            top: 28px;
          }

          .title {
            font-size: 25px;
            letter-spacing: 0.14em;
          }

          .title-line {
            margin-top: 9px;
          }
        }
      `}</style>
    </div>
  );
}
