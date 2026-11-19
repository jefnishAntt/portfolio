"use client";
import { useEffect, useRef, useState } from "react";
import { RotateCcw, RotateCw, X } from "lucide-react";
import BrainCanvas, { type BrainCanvasHandle } from "./BrainCanvas";
import { BRAIN_REGIONS } from "@/data/brain-regions";
import { iconButton } from "@/components/ui/button-styles";
import Carousel from "@/components/ui/Carousel";
import Eyebrow from "@/components/ui/Eyebrow";
import { glassSurface } from "@/components/ui/surfaces";

const ROTATE_STEP = 0.45; // radians per press

/** Same item style as the site navigation. */
const pillItem =
  "flex h-9 min-w-9 items-center justify-center rounded-full text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-ink";

/**
 * Full-screen brain viewer, exactly one screen tall (no page scroll). Built from the
 * site's own parts: section-style header, the nav's glass pill for rotate controls,
 * and the shared Carousel (same as Selected work) to step through the regions.
 * Native <dialog>: focus is trapped inside and Esc closes it.
 * Keyboard: ← → rotate (when the brain is focused), 1–6 pick a region.
 */
export default function BrainExplorer({ onClose }: { onClose: (viaKeyboard: boolean) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const usedKeyboard = useRef(false); // how the explorer is being used, so closing can mirror it
  const brainRef = useRef<BrainCanvasHandle>(null);
  const [selected, setSelected] = useState(0); // always one region open; step through them
  const region = BRAIN_REGIONS[selected];
  const count = BRAIN_REGIONS.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    // Start focus on the dialog itself, not the close button, so no ring appears on open.
    dialog?.focus({ preventScroll: true });
    document.documentElement.classList.add("scroll-locked");
    return () => document.documentElement.classList.remove("scroll-locked");
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    usedKeyboard.current = true;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const n = Number(e.key);
    if (Number.isInteger(n) && n >= 1 && n <= count) {
      e.preventDefault();
      setSelected(n - 1);
    }
  };

  const onBrainKeyDown = (e: React.KeyboardEvent) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [ROTATE_STEP, 0],
      ArrowRight: [-ROTATE_STEP, 0],
      ArrowUp: [0, -ROTATE_STEP / 2],
      ArrowDown: [0, ROTATE_STEP / 2],
    };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      brainRef.current?.rotateBy(...move);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={() => onClose(usedKeyboard.current)}
      onKeyDown={onKeyDown}
      onPointerDown={() => (usedKeyboard.current = false)}
      tabIndex={-1}
      aria-labelledby="brain-explorer-title"
      className="brain-dialog m-0 outline-none h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-bg p-0 text-muted backdrop:bg-black/70"
    >
      {/* Exactly one screen tall: nothing on the page scrolls. */}
      <div className="mx-auto flex h-full max-w-5xl flex-col px-4 pb-4 pt-4 sm:px-6 sm:pb-8 sm:pt-8">
        {/* Header: same label + title style as the page sections */}
        <header className="flex shrink-0 items-start justify-between gap-4">
          <div>
            <Eyebrow>{"// brain explorer"}</Eyebrow>
            <h2 id="brain-explorer-title" className="mt-1.5 text-[1.375rem] font-semibold leading-snug tracking-tight text-fg">
              Explore the brain
            </h2>
            <Eyebrow className="mt-1 hidden sm:block">drag to rotate · click a region or swipe the card · keys 1–{count}</Eyebrow>
          </div>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close brain explorer" className={iconButton}>
            <X className="size-4" aria-hidden />
          </button>
        </header>

        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 lg:mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
          {/* Brain: fills whatever space is left, always square */}
          <div className="relative flex min-h-[10rem] flex-1 items-center justify-center [container-type:size] lg:min-h-0">
            <div
              tabIndex={0}
              role="group"
              aria-label="Brain view. Drag, or use the arrow keys, to rotate."
              onKeyDown={onBrainKeyDown}
              className="aspect-square w-[min(100cqw,100cqh)] rounded-3xl"
            >
              <BrainCanvas
                ref={brainRef}
                mode="explore"
                highlight={selected}
                view={region.view}
                onPick={setSelected}
                label={`3D brain with the ${region.name.toLowerCase()} highlighted`}
              />
            </div>

            {/* Rotate controls float on the brain area, in the nav's glass pill */}
            <div className={`absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-full p-1 ${glassSurface}`}>
              <button type="button" onClick={() => brainRef.current?.rotateBy(ROTATE_STEP)} aria-label="Rotate left" className={pillItem}>
                <RotateCcw className="size-4" aria-hidden />
              </button>
              <span aria-hidden="true" className="mx-1 h-5 w-px bg-line-strong" />
              <button
                type="button"
                onClick={() => brainRef.current?.resetView()}
                className={`${pillItem} px-3 text-sm`}
              >
                Reset
              </button>
              <span aria-hidden="true" className="mx-1 h-5 w-px bg-line-strong" />
              <button type="button" onClick={() => brainRef.current?.rotateBy(-ROTATE_STEP)} aria-label="Rotate right" className={pillItem}>
                <RotateCw className="size-4" aria-hidden />
              </button>
            </div>
          </div>

          {/* Side column: one region at a time, stepped like the Work carousel */}
          <div className="flex shrink-0 flex-col lg:justify-center">
            <Carousel
              count={count}
              label="Brain regions"
              noun="region"
              itemName={(i) => BRAIN_REGIONS[i].name}
              index={selected}
              onIndexChange={setSelected}
              padding="sm"
              slideClassName="max-h-[34dvh] overflow-y-auto overscroll-contain lg:max-h-none lg:overflow-visible"
              renderSlide={(i) => {
                const item = BRAIN_REGIONS[i];
                return (
                  <>
                    <h3 className="text-lg font-semibold tracking-tight text-fg">{item.name}</h3>
                    <p className="text-sm text-muted">{item.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-fg/85">{item.about}</p>
                    <Eyebrow className="mt-4">In brain signals</Eyebrow>
                    <p className="mt-1 text-sm leading-relaxed text-fg/85">{item.signal}</p>
                  </>
                );
              }}
            />
            <Eyebrow className="mt-3 hidden lg:block">Region borders are approximate.</Eyebrow>
          </div>
        </div>
      </div>
    </dialog>
  );
}
