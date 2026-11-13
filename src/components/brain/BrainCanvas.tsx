"use client";
import { useEffect, useImperativeHandle, useRef } from "react";
import { loadBrain, type BrainData } from "@/lib/brain-data";

/**
 * A lit point-cloud brain on a 2D canvas (no three.js).
 *
 * Each frame: rotate the points, hide the ones facing away, light the rest and
 * write them straight into pixels with a depth buffer. Dark grooves stay
 * transparent, so the folds read on both themes. "Neurons" fire on top.
 *
 * Intro: the points burst out from the centre into a loose cloud (spread),
 * then swirl inward and settle into the brain (gather).
 *
 *  - mode="ambient": sways on its own, tilts toward the mouse (hero).
 *  - mode="explore": drag to rotate, click a region to pick it, and a
 *    highlighted region lights up while the rest dims (explorer).
 *
 * Under prefers-reduced-motion it only redraws when something changes.
 */

const SIDE = Math.PI / 2;
const CAMERA = 3.4;
const SCALE = 0.44; // brain size relative to the canvas
const FIRE_EVERY = 280; // ms between new firings
const FIRE_LIFE = 1500; // ms a firing stays lit
const LINKS = 4;
const PICK_RADIUS = 18; // px
const SPREAD_PART = 0.3; // share of the intro spent spreading out; the rest gathers
const SCATTER_RADIUS = 1.1; // how far the cloud spreads (1 ≈ half the canvas)
const MAX_PITCH = 1.3;
const LIGHT = (() => {
  const l = [-0.45, 0.6, -0.65]; // up-left, toward the viewer
  const n = Math.hypot(...l);
  return l.map((v) => v / n);
})();

type Firing = { i: number; born: number; links: number[] };

export interface BrainCanvasHandle {
  rotateBy: (yaw: number, pitch?: number) => void;
  resetView: () => void;
}

interface Controller extends BrainCanvasHandle {
  setHighlight: (region: number | null, view?: { yaw: number; pitch: number }) => void;
  setPaused: (paused: boolean) => void;
}

interface Props {
  mode?: "ambient" | "explore";
  /** Region index to light up (explore mode). */
  highlight?: number | null;
  /** Camera angle to turn to when `highlight` changes. */
  view?: { yaw: number; pitch: number };
  /** Stop animating (e.g. while covered by a dialog). */
  paused?: boolean;
  onPick?: (region: number) => void;
  /** Accessible description. Pass "" when a parent (e.g. a button) already describes it. */
  label: string;
  className?: string;
  ref?: React.Ref<BrainCanvasHandle>;
}

function parseColor(value: string): [number, number, number] {
  const v = value.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
  }
  const nums = v.match(/[\d.]+/g)?.map(Number);
  return nums && nums.length >= 3 ? [nums[0], nums[1], nums[2]] : [139, 92, 246];
}

export default function BrainCanvas({
  mode = "ambient",
  highlight = null,
  view,
  paused = false,
  onPick,
  label,
  className = "",
  ref,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controller = useRef<Controller | null>(null);
  const onPickRef = useRef(onPick);
  const initial = useRef({ highlight, view, paused });

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useEffect(() => {
    controller.current?.setHighlight(highlight, view);
  }, [highlight, view]);

  useEffect(() => {
    controller.current?.setPaused(paused);
  }, [paused]);

  useImperativeHandle(ref, () => ({
    rotateBy: (yaw, pitch) => controller.current?.rotateBy(yaw, pitch),
    resetView: () => controller.current?.resetView(),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const explore = mode === "explore";
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let data: BrainData | null = null;
    let scatter = new Float32Array(0); // where each point sits in the spread-out cloud
    let sx = new Float32Array(0), sy = new Float32Array(0); // projected CSS-pixel positions
    let visible = new Uint8Array(0);
    let image: ImageData | null = null;
    let pixels = new Uint32Array(0);
    let zbuf = new Float32Array(0);
    let w = 0, h = 0, dpr = 1, pw = 0, ph = 0;
    let raf = 0, onScreen = true, cancelled = false;
    let isPaused = initial.current.paused;
    let rgb: [number, number, number] = [139, 92, 246];
    let accent = "#8b5cf6";
    let contrast = 1.45;
    let highlighted = initial.current.highlight ?? -1;

    // Camera. Ambient derives it from `clock`; explore eases toward a target.
    let yaw = initial.current.view?.yaw ?? SIDE;
    let pitch = initial.current.view?.pitch ?? 0.1;
    let targetYaw = yaw, targetPitch = pitch;
    let clock = 0, tiltX = 0, tiltY = 0, mouseX = 0, mouseY = 0;
    let dragging = false, dragDistance = 0, lastX = 0, lastY = 0;

    let last = 0, start = 0, lastFire = 0;
    const introMs = explore ? 1500 : 3200;
    const firings: Firing[] = [];

    const readColor = () => {
      accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || accent;
      rgb = parseColor(accent);
      contrast = document.documentElement.dataset.theme === "light" ? 1.9 : 1.45;
    };

    const nearest = (i: number) => {
      if (!data) return [];
      const pos = data.positions;
      const best: [number, number][] = [];
      const px = pos[i * 3], py = pos[i * 3 + 1], pz = pos[i * 3 + 2];
      for (let j = 0; j < data.count; j++) {
        if (j === i || !visible[j]) continue;
        const dx = pos[j * 3] - px, dy = pos[j * 3 + 1] - py, dz = pos[j * 3 + 2] - pz;
        const d = dx * dx + dy * dy + dz * dz;
        if (d < 0.0015) continue; // skip very close neighbours so links are visible
        if (best.length < LINKS || d < best[best.length - 1][1]) {
          best.push([j, d]);
          best.sort((a, b) => a[1] - b[1]);
          if (best.length > LINKS) best.pop();
        }
      }
      return best.map(([j]) => j);
    };

    /** `t` is intro progress, 0 → 1. At 1 the brain is fully formed. */
    const draw = (now: number, t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, pw, ph);
      if (!data || !image) return;
      const { count, positions: pos, normals: nrm, depth, region } = data;

      const turn = explore ? yaw : SIDE + Math.sin(clock) * 0.5 + tiltX * 0.35;
      const tilt = explore ? pitch : 0.1 + tiltY;
      const cy = Math.cos(turn), syaw = Math.sin(turn);
      const cp = Math.cos(tilt), sp = Math.sin(tilt);
      const scale = Math.min(w, h) * SCALE;
      // Intro phases: burst out from the centre, then swirl in and settle.
      const emerge = 1 - Math.pow(1 - Math.min(1, t / SPREAD_PART), 3);
      const gt = Math.max(0, (t - SPREAD_PART) / (1 - SPREAD_PART));
      const gather = gt < 0.5 ? 4 * gt * gt * gt : 1 - Math.pow(-2 * gt + 2, 3) / 2;
      const formed = gather >= 1;
      const swirl = (1 - gather) * 1.2;
      const cs = Math.cos(swirl), ss = Math.sin(swirl);
      const fade = Math.min(1, t / 0.12);
      const flat = 0.42 * contrast; // unlit brightness while scattered
      const size = Math.max(1, Math.round(dpr));
      const [r, g, b] = rgb;

      pixels.fill(0);
      zbuf.fill(Infinity);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Normal → camera space; hide points facing away.
        let ax = nrm[i3], ay = nrm[i3 + 1], az = nrm[i3 + 2];
        let t = ax * cy + az * syaw;
        az = -ax * syaw + az * cy;
        ax = t;
        t = ay * cp - az * sp;
        az = ay * sp + az * cp;
        ay = t;
        visible[i] = 0;
        // Far-side points are hidden once formed; during the intro they fade out as they gather.
        const facing = az <= 0.2;
        if (!facing && gather > 0.85) continue;

        let x = pos[i3], y = pos[i3 + 1], z = pos[i3 + 2];
        if (!formed) {
          const qx = scatter[i3] * emerge, qy = scatter[i3 + 1] * emerge, qz = scatter[i3 + 2] * emerge;
          const wx = qx * cs + qz * ss, wz = -qx * ss + qz * cs;
          x = wx + (x - wx) * gather;
          y = qy + (y - qy) * gather;
          z = wz + (z - wz) * gather;
        }
        t = x * cy + z * syaw;
        z = -x * syaw + z * cy;
        x = t;
        t = y * cp - z * sp;
        z = y * sp + z * cp;
        y = t;

        const f = CAMERA / (CAMERA + z);
        const cx = w / 2 + x * scale * f;
        const cyy = h / 2 - y * scale * f;
        sx[i] = cx;
        sy[i] = cyy;
        visible[i] = facing && formed ? 1 : 0;

        const lambert = Math.max(0, ax * LIGHT[0] + ay * LIGHT[1] + az * LIGHT[2]);
        let bright = (0.24 + 0.76 * lambert) * (1 - 0.5 * depth[i]) * contrast;
        if (highlighted >= 0) {
          // The picked region glows whatever the light angle; the rest dims.
          bright =
            region[i] === highlighted
              ? (0.6 + 0.4 * lambert) * (1 - 0.45 * depth[i]) * contrast * 1.25
              : bright * 0.25;
        }
        if (!formed) {
          bright = flat + (bright - flat) * gather;
          if (!facing) bright *= 1 - gather / 0.85;
        }
        const alpha = Math.round(Math.min(1, bright) * 255 * fade);
        if (alpha < 4) continue;
        const color = ((alpha << 24) | (b << 16) | (g << 8) | r) >>> 0;

        const px0 = Math.round(cx * dpr), py0 = Math.round(cyy * dpr);
        for (let dy = 0; dy < size; dy++) {
          const yy = py0 + dy;
          if (yy < 0 || yy >= ph) continue;
          for (let dx = 0; dx < size; dx++) {
            const xx = px0 + dx;
            if (xx < 0 || xx >= pw) continue;
            const idx = yy * pw + xx;
            if (z < zbuf[idx]) {
              zbuf[idx] = z;
              pixels[idx] = color;
            }
          }
        }
      }
      ctx.putImageData(image, 0, 0);

      // Firing neurons: soft halo + links to neighbours.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = accent;
      for (const fire of firings) {
        const life = (now - fire.born) / FIRE_LIFE;
        if (life < 0 || life > 1 || !visible[fire.i]) continue;
        const glow = Math.sin(life * Math.PI);
        const x = sx[fire.i], y = sy[fire.i];
        ctx.globalAlpha = glow * 0.7;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        for (const j of fire.links) {
          if (!visible[j]) continue;
          ctx.moveTo(x, y);
          ctx.lineTo(sx[j], sy[j]);
        }
        ctx.stroke();
        const radius = 2 + glow * 8;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, accent);
        grad.addColorStop(1, "transparent");
        ctx.globalAlpha = glow;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    /** One frame without animation (reduced motion, resize, theme change). */
    const drawStill = () => {
      if (raf) return;
      yaw = targetYaw;
      pitch = targetPitch;
      draw(performance.now(), 1);
    };

    const frame = (now: number) => {
      const dt = Math.min(50, now - (last || now));
      last = now;
      if (!start) start = now;
      const intro = Math.min(1, (now - start) / introMs);

      if (explore) {
        if (!dragging) {
          yaw += (targetYaw - yaw) * 0.09;
          pitch += (targetPitch - pitch) * 0.09;
        }
      } else {
        clock += dt * 0.00035;
        tiltX += (mouseX - tiltX) * 0.04;
        tiltY += (mouseY * 0.2 - tiltY) * 0.04;
      }

      if (data && intro >= 1 && now - lastFire > FIRE_EVERY) {
        lastFire = now;
        for (let tries = 0; tries < 24; tries++) {
          const i = Math.floor(Math.random() * data.count);
          if (!visible[i] || (highlighted >= 0 && data.region[i] !== highlighted)) continue;
          firings.push({ i, born: now, links: nearest(i) });
          break;
        }
        while (firings.length && now - firings[0].born > FIRE_LIFE) firings.shift();
      }

      draw(now, intro);
      raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (raf || !data || motionQuery.matches || !onScreen || isPaused) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      pw = Math.max(1, Math.round(w * dpr));
      ph = Math.max(1, Math.round(h * dpr));
      canvas.width = pw;
      canvas.height = ph;
      image = ctx.createImageData(pw, ph);
      pixels = new Uint32Array(image.data.buffer);
      zbuf = new Float32Array(pw * ph);
      drawStill();
    };

    // --- Input -----------------------------------------------------------

    const onWindowPointer = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const pick = (clientX: number, clientY: number) => {
      if (!data) return;
      const rect = canvas.getBoundingClientRect();
      const px = clientX - rect.left, py = clientY - rect.top;
      let best = -1, bestD = PICK_RADIUS * PICK_RADIUS;
      for (let i = 0; i < data.count; i++) {
        if (!visible[i]) continue;
        const dx = sx[i] - px, dy = sy[i] - py;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best >= 0) onPickRef.current?.(data.region[best]);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      dragDistance = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      dragDistance += Math.abs(dx) + Math.abs(dy);
      yaw -= dx * 0.008;
      pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch - dy * 0.008));
      targetYaw = yaw;
      targetPitch = pitch;
      drawStill();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
      if (dragDistance < 6) pick(e.clientX, e.clientY);
    };

    const onMotionChange = () => {
      if (motionQuery.matches) {
        stopLoop();
        firings.length = 0;
        drawStill();
      } else startLoop();
    };

    controller.current = {
      setHighlight: (region, nextView) => {
        const next = region ?? -1;
        if (next === highlighted) return;
        highlighted = next;
        firings.length = 0;
        if (nextView) {
          // Take the short way round.
          const turns = Math.round((yaw - nextView.yaw) / (Math.PI * 2));
          targetYaw = nextView.yaw + turns * Math.PI * 2;
          targetPitch = nextView.pitch;
        }
        drawStill();
      },
      setPaused: (value) => {
        isPaused = value;
        if (value) stopLoop();
        else startLoop();
      },
      rotateBy: (dYaw, dPitch = 0) => {
        targetYaw += dYaw;
        targetPitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, targetPitch + dPitch));
        drawStill();
      },
      resetView: () => {
        const turns = Math.round((yaw - SIDE) / (Math.PI * 2));
        targetYaw = SIDE + turns * Math.PI * 2;
        targetPitch = 0.1;
        drawStill();
      },
    };

    readColor();
    resize();

    loadBrain()
      .then((loaded) => {
        if (cancelled) return;
        data = loaded;
        // Random spot inside a sphere for each point (the spread-out cloud).
        scatter = new Float32Array(loaded.count * 3);
        for (let i = 0; i < loaded.count; i++) {
          const u = Math.random() * 2 - 1;
          const angle = Math.random() * Math.PI * 2;
          const radius = SCATTER_RADIUS * Math.cbrt(0.08 + 0.92 * Math.random());
          const ring = Math.sqrt(1 - u * u) * radius;
          scatter[i * 3] = Math.cos(angle) * ring;
          scatter[i * 3 + 1] = u * radius;
          scatter[i * 3 + 2] = Math.sin(angle) * ring;
        }
        sx = new Float32Array(loaded.count);
        sy = new Float32Array(loaded.count);
        visible = new Uint8Array(loaded.count);
        if (motionQuery.matches || isPaused) drawStill();
        else startLoop();
      })
      .catch(() => {});

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) startLoop();
      else stopLoop();
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      readColor();
      drawStill();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "style"] });
    motionQuery.addEventListener("change", onMotionChange);

    if (explore) {
      canvas.style.cursor = "grab";
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
    } else {
      window.addEventListener("pointermove", onWindowPointer, { passive: true });
    }

    return () => {
      cancelled = true;
      controller.current = null;
      stopLoop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onWindowPointer);
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={`block size-full ${mode === "explore" ? "touch-none select-none" : ""} ${className}`}
    />
  );
}
