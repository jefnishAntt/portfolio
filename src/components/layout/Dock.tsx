"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, m } from "framer-motion";
import { FlaskConical, House, Moon, NotebookPen, Sun, User, Workflow } from "lucide-react";
import { shortcutsEnabled, subscribeShortcuts } from "@/lib/shortcuts";
import { switchTheme } from "@/lib/theme-sweep";

const ITEMS = [
  { id: "home", label: "Home", key: "h", icon: House },
  { id: "about", label: "About", key: null, icon: User },
  { id: "skills", label: "Skill Tree", key: "s", icon: Workflow },
  { id: "log", label: "Learning Log", key: "l", icon: NotebookPen },
  { id: "lab", label: "Lab", key: "p", icon: FlaskConical },
] as const;

function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
  history.replaceState(null, "", id === "home" ? location.pathname : `#${id}`);
}

type Theme = "dark" | "light";
const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const subscribeTheme = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};

const btn =
  "peer relative grid size-10 place-items-center rounded-full text-muted transition-colors duration-300 hover:text-fg";

/** Visual hint only: every control already has an aria-label. */
function Tooltip({ label, shortcut }: { label: string; shortcut?: string | null }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-full left-1/2 mt-3 -translate-x-1/2 -translate-y-1 whitespace-nowrap rounded-md border border-line bg-surface px-2 py-1 font-mono text-[11px] text-fg opacity-0 transition duration-200 peer-hover:translate-y-0 peer-hover:opacity-100 peer-focus-visible:translate-y-0 peer-focus-visible:opacity-100"
    >
      {label}
      {shortcut && <kbd className="ml-2 text-faint">{shortcut.toUpperCase()}</kbd>}
    </span>
  );
}

export default function Dock() {
  const [active, setActive] = useState("home");
  const theme = useSyncExternalStore<Theme | null>(subscribeTheme, readTheme, () => null);
  const shortcuts = useSyncExternalStore(subscribeShortcuts, shortcutsEnabled, () => true);

  // Highlight whichever section crosses the middle of the viewport.
  useEffect(() => {
    const sections = ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Keyboard shortcuts: H / S / L / P (can be switched off in the footer).
  useEffect(() => {
    if (!shortcuts) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if (document.querySelector("dialog[open]")) return; // don't navigate behind a dialog
      const t = e.target as HTMLElement;
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const item = ITEMS.find((i) => i.key === e.key.toLowerCase());
      if (item) {
        e.preventDefault();
        goTo(item.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcuts]);

  // New theme sweeps down behind a glowing brainwave edge (see lib/theme-sweep.ts).
  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    switchTheme(() => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    });
  };

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <ul
        className="flex items-center gap-0.5 rounded-full border border-line p-1.5 backdrop-blur-md"
        style={{ background: "var(--dock-bg)" }}
      >
        {ITEMS.map(({ id, label, key, icon: Icon }) => {
          const isActive = active === id;
          const hint = shortcuts ? key : null;
          return (
            <li key={id} className="relative">
              <a
                href={`#${id}`}
                aria-label={hint ? `${label} (shortcut ${hint.toUpperCase()})` : label}
                aria-current={isActive ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(id);
                }}
                className={`${btn} ${isActive ? "bg-accent-soft text-accent-ink hover:text-accent-ink" : ""}`}
              >
                <Icon size={18} aria-hidden />
                {isActive && <span className="absolute bottom-1 size-1 rounded-full bg-accent" aria-hidden="true" />}
              </a>
              <Tooltip label={label} shortcut={hint} />
            </li>
          );
        })}
        <li aria-hidden="true" className="mx-1 h-5 w-px bg-line" />
        <li className="relative">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className={btn}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={theme ?? "none"}
                initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="grid place-items-center"
              >
                {theme === "light" ? <Moon size={18} aria-hidden /> : <Sun size={18} aria-hidden />}
              </m.span>
            </AnimatePresence>
          </button>
          <Tooltip label={theme === "light" ? "Dark mode" : "Lab notebook mode"} />
        </li>
      </ul>
    </nav>
  );
}
