/**
 * Theme switch: the new theme sweeps down the screen. Its leading edge is a
 * glowing EEG-style trace, the same wave shape as the hero background.
 *
 * How it works: the View Transitions API snapshots the old page; the new
 * page is clipped to everything above a wavy edge that travels top → bottom.
 * A small SVG overlay draws the glowing line along that edge.
 */

const DURATION = 950; // ms
const POINTS = 160; // samples along the edge
const KEYFRAMES = 30;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** EEG-like offset for a point along the edge (x01 ∈ [0,1]). */
function wave(x01: number, phase: number) {
  const p = x01 * Math.PI * 16 + phase;
  const rhythm =
    Math.sin(p) * 0.32 + Math.sin(p * 2.7 + 1) * 0.18 + Math.sin(p * 6.3 + 2) * 0.09 + Math.sin(p * 13.7) * 0.05;
  // Sharp spike followed by a short dip, a few times across the screen.
  const s = x01 * Math.PI * 3 + phase * 0.35;
  const spike = Math.pow(Math.max(0, Math.sin(s)), 400) * 2.2 - Math.pow(Math.max(0, Math.sin(s - 0.06)), 400) * 1.1;
  return rhythm + spike;
}

function edgePoints(progress: number, w: number, h: number) {
  const amp = Math.min(22, Math.max(12, w / 60));
  const base = -3 * amp + progress * (h + 6 * amp);
  const phase = progress * 7;
  // Calm at the very start and end, liveliest mid-sweep.
  const energy = 0.55 + 0.45 * Math.sin(progress * Math.PI);
  const pts: [number, number][] = [];
  for (let i = 0; i <= POINTS; i++) {
    const x01 = i / POINTS;
    pts.push([x01 * w, base - wave(x01, phase) * amp * energy]);
  }
  return pts;
}

function clipAt(progress: number, w: number, h: number) {
  const edge = edgePoints(progress, w, h).reverse(); // right → left
  const coords = [`0px 0px`, `${w}px 0px`, ...edge.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`)];
  return `polygon(${coords.join(", ")})`;
}

function createEdgeLine() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.style.cssText =
    "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;view-transition-name:theme-wave;overflow:visible";
  const glow = document.createElementNS(ns, "path");
  const line = document.createElementNS(ns, "path");
  for (const p of [glow, line]) {
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "var(--accent)");
    p.setAttribute("stroke-linejoin", "round");
    p.setAttribute("stroke-linecap", "round");
  }
  glow.setAttribute("stroke-width", "8");
  glow.setAttribute("stroke-opacity", "0.35");
  glow.style.filter = "blur(6px)";
  line.setAttribute("stroke-width", "1.75");
  svg.append(glow, line);

  const draw = (progress: number) => {
    const pts = edgePoints(progress, innerWidth, innerHeight);
    const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
    glow.setAttribute("d", d);
    line.setAttribute("d", d);
    // Fade the line in and out so it never pops.
    svg.style.opacity = String(Math.min(1, progress * 8, (1 - progress) * 8));
  };
  return { svg, draw };
}

export function switchTheme(apply: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce || document.hidden) {
    apply();
    return;
  }

  const root = document.documentElement;
  const w = innerWidth;
  const h = innerHeight;
  const { svg, draw } = createEdgeLine();
  draw(0);

  root.classList.add("theme-transition");
  const vt = document.startViewTransition(() => {
    apply();
    document.body.append(svg); // exists only in the new state → rendered live on top
  });

  vt.ready
    .then(() => {
      const frames = Array.from({ length: KEYFRAMES + 1 }, (_, i) => {
        const t = i / KEYFRAMES;
        return { clipPath: clipAt(easeInOut(t), w, h), offset: t };
      });
      root.animate(frames, { duration: DURATION, easing: "linear", pseudoElement: "::view-transition-new(root)" });

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        draw(easeInOut(t));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    })
    .catch(() => {}); // transition skipped: theme is still applied, just not animated

  vt.finished
    .catch(() => {})
    .finally(() => {
      svg.remove();
      root.classList.remove("theme-transition");
    });
}
