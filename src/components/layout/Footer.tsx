import ShortcutToggle from "./ShortcutToggle";
import { PROFILE } from "@/config";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[720px] border-t border-line px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-1 font-mono text-xs text-faint sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <p>Built by me · {PROFILE.location}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <ShortcutToggle />
        <p className="font-mono text-[11px] text-faint">
          Brain model by{" "}
          <a
            href="https://sketchfab.com/3d-models/brain-cadd2bde67404c43b2359a6a3281d84a"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-line-strong underline-offset-2 hover:text-accent-ink"
          >
            dgallichan
            <span className="sr-only"> (opens in a new tab)</span>
          </a>{" "}
          (CC BY 4.0), rendered as points.
        </p>
      </div>
    </footer>
  );
}
