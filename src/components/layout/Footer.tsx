import ShortcutToggle from "./ShortcutToggle";
import ExternalLink from "@/components/ui/ExternalLink";
import { PROFILE } from "@/config";

/** One quiet line: who, and the credit the brain model's licence (CC BY 4.0) requires. */
export default function Footer() {
  return (
    <footer className="mx-auto max-w-[52rem] px-4 pb-28 pt-6 sm:px-6 sm:pb-10">
      <div className="flex flex-col gap-2 border-t border-line pt-6 font-mono text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <div className="flex items-center gap-3">
          <ExternalLink
            href="https://sketchfab.com/3d-models/brain-cadd2bde67404c43b2359a6a3281d84a"
            className="transition-colors hover:text-accent"
          >
            Brain model: dgallichan, CC BY
          </ExternalLink>
          <span aria-hidden="true" className="h-3 w-px bg-line" />
          <ShortcutToggle />
        </div>
      </div>
    </footer>
  );
}
