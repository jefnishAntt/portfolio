/**
 * Each section is labelled with the part of the brain that does the same job,
 * e.g. "03 / learning log · hippocampus". Shown next to the section label, with
 * the reason as a tooltip. Edit freely; sections not listed show no region.
 */
export interface SectionRegion {
  name: string;
  why: string;
}

const SECTION_REGIONS: Record<string, SectionRegion> = {
  about: {
    name: "Prefrontal cortex",
    why: "planning, decisions and personality: the part that makes you, you",
  },
  work: {
    name: "Motor cortex",
    why: "turns plans into action: where ideas become things that ship",
  },
  lab: {
    name: "Visual cortex",
    why: "where things first become visible, like the projects I build",
  },
  writing: {
    name: "Broca's area",
    why: "turns thoughts into language",
  },
};

export function regionForSection(id: string): SectionRegion | undefined {
  return SECTION_REGIONS[id];
}
