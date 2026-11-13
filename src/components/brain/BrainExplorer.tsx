"use client";
import { useEffect, useRef, useState } from "react";
import { RotateCcw, RotateCw, ScanEye, X } from "lucide-react";
import BrainCanvas, { type BrainCanvasHandle } from "./BrainCanvas";
import { BRAIN_REGIONS } from "@/data/brain-regions";

const ROTATE_STEP = 0.5; // radians per button press

const controlBtn =
  "grid size-10 place-items-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-line-strong hover:text-fg";

/**
 * Full-screen-ish dialog for exploring the brain: drag (or use the buttons) to
 * rotate, pick a region from the list or by clicking the brain, read what it
 * does. Uses the native <dialog>, so focus trapping and Esc come for free.
 */
export default function BrainExplorer({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const brainRef = useRef<BrainCanvasHandle>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const region = selected === null ? null : BRAIN_REGIONS[selected];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    document.documentElement.classList.add("scroll-locked");
    return () => document.documentElement.classList.remove("scroll-locked");
  }, []);

  const toggle = (index: number) => setSelected((current) => (current === index ? null : index));

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close(); // click on the backdrop
      }}
      aria-labelledby="brain-explorer-title"
      className="brain-dialog m-auto max-h-[calc(100dvh-1.5rem)] w-[min(56rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain rounded-xl border border-line bg-surface p-0 text-muted backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-5 sm:p-7">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-faint">brain explorer</p>
            <h2 id="brain-explorer-title" className="mt-1 text-xl font-semibold tracking-tight text-fg sm:text-2xl">
              Explore the brain
            </h2>
          </div>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close brain explorer" className={controlBtn}>
            <X size={18} aria-hidden />
          </button>
        </header>

        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-8">
          {/* Brain + rotate controls */}
          <div>
            <div className="mx-auto aspect-square w-full max-w-[26rem]">
              <BrainCanvas
                ref={brainRef}
                mode="explore"
                highlight={selected}
                view={region?.view}
                onPick={toggle}
                label={
                  region
                    ? `3D brain with the ${region.name.toLowerCase()} highlighted`
                    : "3D brain you can rotate. Pick a region from the list to highlight it."
                }
              />
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <button type="button" onClick={() => brainRef.current?.rotateBy(ROTATE_STEP)} aria-label="Rotate left" className={controlBtn}>
                <RotateCcw size={16} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  brainRef.current?.resetView();
                }}
                className="h-10 rounded-full border border-line px-4 font-mono text-xs text-muted transition-colors duration-300 hover:border-line-strong hover:text-fg"
              >
                Reset view
              </button>
              <button type="button" onClick={() => brainRef.current?.rotateBy(-ROTATE_STEP)} aria-label="Rotate right" className={controlBtn}>
                <RotateCw size={16} aria-hidden />
              </button>
            </div>
            <p className="mt-3 text-center font-mono text-[11px] text-faint">Drag to rotate · tap a region to select it</p>
          </div>

          {/* Region list + details */}
          <div>
            <ul aria-label="Brain regions" className="grid grid-cols-2 gap-2 md:grid-cols-1">
              {BRAIN_REGIONS.map((item, index) => {
                const active = selected === index;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggle(index)}
                      className={`flex min-h-11 w-full items-baseline gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-300 ${
                        active
                          ? "border-accent bg-accent-soft text-fg"
                          : "border-line text-muted hover:border-line-strong hover:text-fg"
                      }`}
                    >
                      <span className={`font-mono text-[11px] ${active ? "text-accent-ink" : "text-faint"}`} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div aria-live="polite" className="mt-5 min-h-48 border-t border-line pt-5">
              {region ? (
                <>
                  <h3 className="font-medium text-fg">{region.name}</h3>
                  <p className="mt-1 font-mono text-xs text-accent-ink">{region.role}</p>
                  <p className="mt-3 text-sm leading-relaxed">{region.about}</p>
                  <p className="mt-4 font-mono text-[11px] text-faint">In brain signals</p>
                  <p className="mt-1 text-sm leading-relaxed">{region.signal}</p>
                </>
              ) : (
                <div className="flex flex-col items-start gap-3">
                  <ScanEye size={20} className="text-accent-ink" aria-hidden />
                  <p className="text-sm leading-relaxed">
                    Pick a region to see what it does and how it shows up in brain signals.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 border-t border-line pt-4 font-mono text-[11px] text-faint">
          Region borders are approximate. This is a learning sketch, not a medical atlas.
        </p>
      </div>
    </dialog>
  );
}
