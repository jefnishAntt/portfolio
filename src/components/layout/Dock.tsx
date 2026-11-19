"use client";
import { Fragment, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, m } from "framer-motion";
import { BriefcaseBusiness, FlaskConical, House, Moon, PenLine, Sun, User } from "lucide-react";
import { shortcutsEnabled, subscribeShortcuts } from "@/lib/shortcuts";
import { switchTheme } from "@/lib/theme-sweep";
import { glassSurface } from "@/components/ui/surfaces";

const ITEMS = [
  { id: "home", label: "Home", key: "h", icon: House },
  { id: "about", label: "About", key: null, icon: User },
  { id: "work", label: "Work", key: "w", icon: BriefcaseBusiness },
  { id: "lab", label: "Lab", key: "p", icon: FlaskConical },
  { id: "writing", label: "Writing", key: null, icon: PenLine },
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

/* Matches the reference nav: 36px round items, 16px icons, 14px labels, muted → foreground on hover. */
const item =
  "relative flex h-9 items-center justify-center rounded-full text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-ink";
const iconItem = `${item} w-9`;
const linkItem = `${item} w-9 text-sm sm:w-auto sm:gap-1.5 sm:px-3`;
const Divider = () => <li aria-hidden="true" className="mx-1 h-5 w-px bg-line-strong" />;

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

  // Keyboard shortcuts: H / W / P (can be switched off in the footer).
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
      className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 sm:bottom-auto sm:top-7"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className={`flex items-center gap-0.5 rounded-full p-1 ${glassSurface}`}>
        {ITEMS.map(({ id, label, key, icon: Icon }, index) => {
          const isActive = active === id;
          const hint = shortcuts ? key : null;
          const isHome = id === "home";
          return (
            <Fragment key={id}>
              <li>
                <a
                  href={`#${id}`}
                  aria-label={hint ? `${label} (shortcut ${hint.toUpperCase()})` : label}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(id);
                  }}
                  className={`${isHome ? iconItem : linkItem} ${isActive ? "bg-fg/[0.07] text-fg" : ""}`}
                >
                  <Icon className="size-4" aria-hidden />
                  {!isHome && (
                    <span className="hidden sm:inline" aria-hidden="true">
                      {label}
                    </span>
                  )}
                </a>
              </li>
              {index === 0 && <Divider />}
            </Fragment>
          );
        })}
        <Divider />
        <li>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className={iconItem}
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
                {theme === "light" ? <Moon className="size-4" aria-hidden /> : <Sun className="size-4" aria-hidden />}
              </m.span>
            </AnimatePresence>
          </button>
        </li>
      </ul>
    </nav>
  );
}
