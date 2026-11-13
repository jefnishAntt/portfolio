/**
 * Loads the brain point cloud (public/models/brain-points.bin) once and shares
 * it between the hero brain and the explorer.
 * File format: see scripts/build-brain-points.mjs (7 bytes per point).
 */

const SRC = "/models/brain-points.bin";
const STRIDE = 7;

export interface BrainData {
  count: number;
  /** x, y, z per point. x: left/right, y: up, z: −1 front … +1 back. */
  positions: Float32Array;
  normals: Float32Array;
  /** 0 = crest of a fold, 1 = edge of a groove. */
  depth: Float32Array;
  /** Index into BRAIN_REGIONS (src/data/brain-regions.ts). */
  region: Uint8Array;
}

/**
 * Approximate anatomy from position alone. The model has no labels, so the
 * borders are rough; good enough to point at "roughly here".
 * Order must match BRAIN_REGIONS.
 */
export function classifyRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  if (y < -0.42 && ax < 0.17 && z > -0.1 && z < 0.4) return 5; // brainstem
  if (y < -0.22 && z > 0.12) return 4; // cerebellum
  const sylvian = -0.22 + 0.3 * (z + 0.5); // the big side groove, rising toward the back
  if (ax > 0.18 && z > -0.6 && z < 0.5 && y < sylvian) return 2; // temporal
  if (z > 0.56 + 0.15 * y) return 3; // occipital
  if (z < -0.05 + 0.15 * y) return 0; // frontal
  return 1; // parietal
}

let cache: Promise<BrainData> | null = null;

export function loadBrain(): Promise<BrainData> {
  cache ??= fetch(SRC)
    .then((res) => {
      if (!res.ok) throw new Error(`brain points: ${res.status}`);
      return res.arrayBuffer();
    })
    .then((buf) => {
      const signed = new Int8Array(buf);
      const unsigned = new Uint8Array(buf);
      const count = Math.floor(signed.length / STRIDE);
      const positions = new Float32Array(count * 3);
      const normals = new Float32Array(count * 3);
      const depth = new Float32Array(count);
      const region = new Uint8Array(count);
      for (let i = 0; i < count; i++) {
        const o = i * STRIDE;
        for (let k = 0; k < 3; k++) {
          positions[i * 3 + k] = signed[o + k] / 127;
          normals[i * 3 + k] = signed[o + 3 + k] / 127;
        }
        depth[i] = unsigned[o + 6] / 255;
        region[i] = classifyRegion(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      }
      return { count, positions, normals, depth, region };
    })
    .catch((err) => {
      cache = null; // allow a retry later
      throw err;
    });
  return cache;
}
