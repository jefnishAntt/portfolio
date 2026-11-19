/**
 * One button look for the whole site: round, with a faint fill and no visible border.
 * Icon buttons don't change their circle on hover; only the icon moves (see `.icon-hover` in globals.css).
 */

const base =
  "inline-flex items-center justify-center rounded-full border border-transparent bg-fg/[0.05] text-muted";

/** Round icon-only button (e.g. GitHub, rotate, close). */
export const iconButton = `${base} icon-hover size-10 shrink-0`;

/** Text button (e.g. "Résumé"). */
export const textButton = `${base} h-10 gap-2 px-4 text-[0.9375rem] transition-colors duration-200 hover:border-accent/40 hover:bg-fg/[0.08] hover:text-accent`;
