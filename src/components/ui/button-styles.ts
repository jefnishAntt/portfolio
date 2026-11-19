/**
 * One button look for the whole site: round (circles for icons, pills for text)
 * with a faint fill and no visible border until hover. Change these to restyle every button at once.
 */

const base =
  "inline-flex items-center justify-center rounded-full border border-transparent bg-fg/[0.05] text-muted transition-colors duration-200 hover:border-accent/40 hover:bg-fg/[0.08] hover:text-accent";

/** Round icon-only button (e.g. GitHub, rotate, close). */
export const iconButton = `${base} size-10 shrink-0`;

/** Text button (e.g. "Reset view", "Show more"). */
export const textButton = `${base} h-10 gap-2 px-4 text-[0.9375rem]`;
