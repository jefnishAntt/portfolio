/**
 * Keyboard shortcut preference (H / S / L / P jump between sections).
 * Single-key shortcuts must be switchable off for people using voice control
 * or other assistive input (WCAG 2.1.4), so the footer has a toggle.
 */
const KEY = "shortcuts";
const EVENT = "shortcuts-change";

export function shortcutsEnabled(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function setShortcutsEnabled(enabled: boolean) {
  try {
    localStorage.setItem(KEY, enabled ? "on" : "off");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeShortcuts(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
