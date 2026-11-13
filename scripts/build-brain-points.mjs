// Turns assets/models/brain.glb (13 MB source mesh, not deployed) into a small point cloud for the hero.
//
// Output: public/models/brain-points.bin, 7 bytes per point:
//   int8  x, y, z    position ×127, normalised to [-1, 1], Y up
//   int8  nx, ny, nz surface normal ×127
//   uint8 depth      0 = crest of a fold (gyrus), 255 = halfway into a groove
//
// Only the exposed outer surface is kept: points deep inside the grooves
// (sulci) are dropped, so the grooves read as dark lines between the folds.
// The renderer uses normals for lighting + hiding the far side.
//
// Usage: node scripts/build-brain-points.mjs [samples]
import { readFileSync, writeFileSync } from "node:fs";

const COUNT = Number(process.argv[2] ?? 64000);
const MAX_DEPTH = 0.5; // drop points deeper than this into a groove
const IN = new URL("../assets/models/brain.glb", import.meta.url);
const OUT = new URL("../public/models/brain-points.bin", import.meta.url);

const glb = readFileSync(IN);
const jsonLen = glb.readUInt32LE(12);
const gltf = JSON.parse(glb.subarray(20, 20 + jsonLen).toString("utf8"));
const bin = glb.subarray(20 + jsonLen + 8);

function accessor(i) {
  const a = gltf.accessors[i];
  const view = gltf.bufferViews[a.bufferView];
  const offset = (view.byteOffset ?? 0) + (a.byteOffset ?? 0);
  const comps = { SCALAR: 1, VEC3: 3, VEC4: 4 }[a.type];
  const Ctor = a.componentType === 5126 ? Float32Array : a.componentType === 5125 ? Uint32Array : Uint16Array;
  const start = bin.byteOffset + offset;
  return new Ctor(bin.buffer.slice(start, start + a.count * comps * Ctor.BYTES_PER_ELEMENT));
}

// Model is Z-up; convert to Y-up: (x, y, z) → (x, z, -y).
const yUp = (a, i) => [a[i], a[i + 2], -a[i + 1]];

const tris = []; // [a, b, c, normal]
for (const mesh of gltf.meshes) {
  for (const prim of mesh.primitives) {
    const pos = accessor(prim.attributes.POSITION);
    const nor = accessor(prim.attributes.NORMAL);
    const idx = accessor(prim.indices);
    for (let i = 0; i < idx.length; i += 3) {
      const [ia, ib, ic] = [idx[i] * 3, idx[i + 1] * 3, idx[i + 2] * 3];
      const a = yUp(pos, ia), b = yUp(pos, ib), c = yUp(pos, ic);
      // Average the vertex normals (keeps the model's own orientation).
      const n = [0, 1, 2].map((k) => yUp(nor, ia)[k] + yUp(nor, ib)[k] + yUp(nor, ic)[k]);
      tris.push([a, b, c, n]);
    }
  }
}

// Area-weighted surface sampling with a seeded RNG (stable output between runs).
let seed = 42;
const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
const area = ([a, b, c]) => {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  return Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]) / 2;
};
const cumulative = new Float64Array(tris.length);
let total = 0;
tris.forEach((t, i) => (cumulative[i] = total += area(t)));

const points = [];
for (let s = 0; s < COUNT; s++) {
  const r = rand() * total;
  let lo = 0, hi = tris.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cumulative[mid] < r) lo = mid + 1;
    else hi = mid;
  }
  const [a, b, c, n] = tris[lo];
  let u = rand(), v = rand();
  if (u + v > 1) [u, v] = [1 - u, 1 - v];
  const len = Math.hypot(...n) || 1;
  points.push({
    p: [0, 1, 2].map((k) => a[k] + u * (b[k] - a[k]) + v * (c[k] - a[k])),
    n: n.map((x) => x / len),
  });
}

// Centre and normalise to [-1, 1] on the longest axis.
const min = [0, 1, 2].map((k) => Math.min(...points.map((q) => q.p[k])));
const max = [0, 1, 2].map((k) => Math.max(...points.map((q) => q.p[k])));
const centre = min.map((m, k) => (m + max[k]) / 2);
const half = Math.max(...max.map((m, k) => m - min[k])) / 2;
const ext = max.map((m, k) => (m - min[k]) / 2 / half);
for (const q of points) q.p = q.p.map((v, k) => (v - centre[k]) / half);

// Fold depth via ambient occlusion: a point deep in a groove has lots of
// surface right in front of it (the opposite wall). Count a dense set of
// occluder points inside a small hemisphere above each point's normal.
const OCCLUDERS = 120000;
const R = 0.07;
const occ = [];
for (let s = 0; s < OCCLUDERS; s++) {
  const r = rand() * total;
  let lo = 0, hi = tris.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cumulative[mid] < r) lo = mid + 1;
    else hi = mid;
  }
  const [a, b, c] = tris[lo];
  let u = rand(), v = rand();
  if (u + v > 1) [u, v] = [1 - u, 1 - v];
  occ.push([0, 1, 2].map((k) => (a[k] + u * (b[k] - a[k]) + v * (c[k] - a[k]) - centre[k]) / half));
}
const cellKey = (x, y, z) => `${Math.floor(x / R)},${Math.floor(y / R)},${Math.floor(z / R)}`;
const grid = new Map();
for (const q of occ) {
  const k = cellKey(...q);
  if (!grid.has(k)) grid.set(k, []);
  grid.get(k).push(q);
}
const occlusion = points.map(({ p, n }) => {
  const [cx, cy, cz] = p.map((v) => Math.floor(v / R));
  let hits = 0;
  for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++)
      for (let dz = -1; dz <= 1; dz++) {
        for (const q of grid.get(`${cx + dx},${cy + dy},${cz + dz}`) ?? []) {
          const d = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
          const dist = Math.hypot(...d);
          if (dist > R || dist < 0.012) continue;
          if (d[0] * n[0] + d[1] * n[1] + d[2] * n[2] > 0.35 * dist) hits++;
        }
      }
  return hits;
});
const sorted = [...occlusion].sort((a, b) => a - b);
const lo = sorted[Math.floor(sorted.length * 0.1)];
const hi = sorted[Math.floor(sorted.length * 0.9)];
const depths = occlusion.map((h) => Math.min(1, Math.max(0, (h - lo) / (hi - lo || 1))));

const STRIDE = 7;
const keep = points.map((_, i) => i).filter((i) => depths[i] <= MAX_DEPTH);
const out = Buffer.alloc(keep.length * STRIDE);
keep.forEach((i, j) => {
  const o = j * STRIDE;
  points[i].p.forEach((v, k) => out.writeInt8(Math.round(v * 127), o + k));
  points[i].n.forEach((v, k) => out.writeInt8(Math.round(v * 127), o + 3 + k));
  out.writeUInt8(Math.round((depths[i] / MAX_DEPTH) * 255), o + 6);
});
writeFileSync(OUT, out);

console.log(`${keep.length} of ${points.length} points kept → ${OUT.pathname} (${out.length} bytes)`);
console.log("extent", ext.map((e) => e.toFixed(2)));
