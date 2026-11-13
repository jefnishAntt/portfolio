"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Maximize2 } from "lucide-react";
import BrainCanvas from "./BrainCanvas";

// The explorer is only downloaded when someone opens it.
const BrainExplorer = dynamic(() => import("./BrainExplorer"), { ssr: false });

/** The hero brain. The whole thing is one button that opens the explorer. */
export default function BrainLauncher() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus(); // hand keyboard focus back to where it came from
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Explore the brain: open the interactive 3D brain explorer"
        className="group relative block aspect-square w-64 cursor-pointer rounded-2xl md:-mr-12 md:w-72 lg:-mr-16 lg:w-80"
      >
        <BrainCanvas label="" paused={open} />
        <span className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-1 font-mono text-[11px] text-muted transition-colors duration-300 group-hover:border-line-strong group-hover:text-accent-ink group-focus-visible:text-accent-ink">
            <Maximize2 size={11} aria-hidden />
            explore the brain
          </span>
        </span>
      </button>

      {open && <BrainExplorer onClose={close} />}
    </>
  );
}
