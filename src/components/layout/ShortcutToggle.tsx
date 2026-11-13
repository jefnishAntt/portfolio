"use client";
import { useSyncExternalStore } from "react";
import { setShortcutsEnabled, shortcutsEnabled, subscribeShortcuts } from "@/lib/shortcuts";

/** Lets people turn the single-key shortcuts (H / S / L / P) off. */
export default function ShortcutToggle() {
  const enabled = useSyncExternalStore(subscribeShortcuts, shortcutsEnabled, () => true);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => setShortcutsEnabled(!enabled)}
      className="-mx-2 inline-flex min-h-8 items-center gap-2 rounded-md px-2 font-mono text-xs text-faint transition-colors duration-300 hover:text-fg"
    >
      <span
        aria-hidden="true"
        className={`relative h-3.5 w-6 rounded-full border transition-colors duration-300 ${
          enabled ? "border-accent bg-accent-soft" : "border-line-strong"
        }`}
      >
        <span
          className={`absolute top-0.5 size-2 rounded-full transition-all duration-300 ${
            enabled ? "left-3 bg-accent" : "left-0.5 bg-faint"
          }`}
        />
      </span>
      Keyboard shortcuts (H, S, L, P)
    </button>
  );
}
