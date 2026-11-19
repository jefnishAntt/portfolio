/**
 * Regions shown in the brain explorer. Edit the text freely.
 * Order matters: it must match classifyRegion() in src/lib/brain-data.ts.
 * `view` is the camera angle the brain turns to when a region is picked, made with
 * angle(turn, pitch): turn 0 = the home side view, negative = more from the front,
 * positive = more from the back. pitch: negative = from above, positive = from below.
 */
export interface BrainRegion {
  id: string;
  name: string;
  /** One-line job description. */
  role: string;
  /** What it does, in plain words. */
  about: string;
  /** Why it matters for EEG / brain-computer interfaces. */
  signal: string;
  view: { yaw: number; pitch: number };
}

const HOME_YAW = -Math.PI / 2; // must match HOME_YAW in BrainCanvas.tsx
const angle = (turn: number, pitch: number) => ({ yaw: HOME_YAW - turn, pitch });

export const BRAIN_REGIONS: BrainRegion[] = [
  {
    id: "frontal",
    name: "Frontal lobe",
    role: "Planning, decisions, movement",
    about:
      "The front of the brain. It handles planning, decision-making, speech production and voluntary movement. The motor cortex, a strip along its back edge, sends the commands that move your body.",
    signal:
      "Just imagining a hand movement changes the rhythms over the motor cortex. That effect, called motor imagery, is one of the most common ways to control an EEG-based BCI.",
    view: angle(-0.75, -0.1),
  },
  {
    id: "parietal",
    name: "Parietal lobe",
    role: "Touch, body sense, attention",
    about:
      "Top and back of the head. It processes touch and body position, and helps you direct attention and judge where things are in space.",
    signal:
      "The P300, a positive bump in the EEG about 300 ms after something you were waiting for appears, is strongest here. P300 spellers let people type using attention alone.",
    view: angle(0.25, -0.75),
  },
  {
    id: "temporal",
    name: "Temporal lobe",
    role: "Hearing, language, memory",
    about:
      "The lobe beside your ears. It processes sound, helps you understand language, and its inner part (including the hippocampus) is essential for forming memories.",
    signal:
      "Auditory BCIs and speech-decoding research focus here. In practice it is also where jaw-muscle activity leaks into EEG recordings, so clenching your teeth shows up as noise.",
    view: angle(-0.1, 0.25),
  },
  {
    id: "occipital",
    name: "Occipital lobe",
    role: "Vision",
    about: "The back of the brain. Almost everything you see is first processed here, in the visual cortex.",
    signal:
      "Alpha waves (8–12 Hz) are strongest here when you close your eyes; they were the first EEG rhythm ever described. Flickering lights drive steady signals here (SSVEP), used for some of the fastest EEG BCIs.",
    view: angle(1.2, -0.05),
  },
  {
    id: "cerebellum",
    name: "Cerebellum",
    role: "Balance, coordination, timing",
    about:
      "The “little brain” tucked under the back. It fine-tunes movement, balance and timing. It is only about a tenth of the brain's volume but holds most of its neurons.",
    signal:
      "It is deep, tightly folded and sits under the neck muscles, so scalp EEG barely picks it up. Most BCIs don't read from it.",
    view: angle(0.7, 0.4),
  },
  {
    id: "brainstem",
    name: "Brainstem",
    role: "Breathing, heartbeat, relay",
    about:
      "The stalk connecting the brain to the spinal cord. It runs breathing, heart rate and sleep–wake cycles, and carries nearly every signal between brain and body.",
    signal:
      "Damage here can cause locked-in syndrome: the thinking brain still works, but its commands can't reach the body. Giving those people a way to communicate is one of the main reasons BCIs exist.",
    view: angle(0.35, 0.6),
  },
];
