"use client";
import { useSyncExternalStore } from "react";
import { Keyboard } from "lucide-react";
import { setShortcutsEnabled, shortcutsEnabled, subscribeShortcuts } from "@/lib/shortcuts";

/**
 * Small keyboard icon that turns the single-key shortcuts (H / W / P) on or off.
 * Kept because single-key shortcuts must be switchable off (WCAG 2.1.4).
 */
export default function ShortcutToggle() {
  const enabled = useSyncExternalStore(subscribeShortcuts, shortcutsEnabled, () => true);
  const label = `Keyboard shortcuts H, W, P: ${enabled ? "on" : "off"}`;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label="Keyboard shortcuts (H, W, P)"
      title={label}
      onClick={() => setShortcutsEnabled(!enabled)}
      className={`grid size-7 place-items-center rounded-full transition-colors duration-200 hover:bg-fg/5 hover:text-accent ${
        enabled ? "text-accent-ink" : "text-faint"
      }`}
    >
      <Keyboard size={14} aria-hidden />
    </button>
  );
}
