"use client";
import { useEffect, useRef } from "react";

/**
 * Faint EEG-style traces drawn on a 2D canvas. Drifts slowly, speeds up a
 * little while the mouse moves. Pauses off-screen; static under reduced motion.
 */
const TRACES = [
  { y: 0.3, amp: 12, seed: 1.3, alpha: 0.5, width: 1 },
  { y: 0.52, amp: 20, seed: 2.7, alpha: 1, width: 1.4 },
  { y: 0.74, amp: 10, seed: 4.1, alpha: 0.4, width: 1 },
];

function sample(x: number, t: number, seed: number) {
  const p = x * 0.018 - t;
  const alpha = Math.sin(p + seed) * 0.5;
  const beta = Math.sin(p * 2.3 + seed * 2) * 0.22 + Math.sin(p * 5.7 + seed * 3) * 0.1;
  const noise = Math.sin(p * 11.3 + seed) * 0.05 + Math.sin(p * 17.9 - seed) * 0.03;
  const spike = Math.pow(Math.max(0, Math.sin(p * 0.19 + seed)), 80) * 1.6;
  const dip = Math.pow(Math.max(0, Math.sin(p * 0.19 + seed - 0.12)), 80) * -0.8;
  return alpha + beta + noise + spike + dip;
}

export default function Brainwave() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0, h = 0, raf = 0, last = 0;
    let t = 0, speed = 1, target = 1;
    let onScreen = true;
    let color = "";

    const readColor = () => {
      color = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#8b5cf6";
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const scale = Math.min(1.4, Math.max(0.7, h / 520));
      ctx.strokeStyle = color;
      ctx.lineJoin = "round";
      for (const tr of TRACES) {
        ctx.globalAlpha = tr.alpha;
        ctx.lineWidth = tr.width;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = h * tr.y + sample(x, t, tr.seed) * tr.amp * scale;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const frame = (now: number) => {
      const dt = Math.min(50, now - (last || now));
      last = now;
      target += (1 - target) * 0.015;
      speed += (target - speed) * 0.04;
      t += dt * 0.0009 * speed;
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || motionQuery.matches || !onScreen) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMouse = () => {
      target = 2.4;
    };
    const onMotionChange = () => {
      if (motionQuery.matches) {
        stop();
        draw();
      } else start();
    };

    readColor();
    resize();
    start();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      readColor();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "style"] });

    window.addEventListener("mousemove", onMouse, { passive: true });
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("mousemove", onMouse);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        opacity: "var(--brainwave-opacity)",
        maskImage: "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
      }}
    />
  );
}
