"use client";
import { useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { iconButton } from "@/components/ui/button-styles";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";

type CarouselProps = {
  count: number;
  /** Name of the whole carousel, for screen readers ("Selected work"). */
  label: string;
  /** Short name of slide i, used in the dot and slide labels. */
  itemName: (i: number) => string;
  /** What one slide is called in the arrow labels ("case study", "region"). */
  noun: string;
  renderSlide: (i: number) => ReactNode;
  /** Pass both to control the index from outside (e.g. clicking the brain). */
  index?: number;
  onIndexChange?: (i: number) => void;
  /** Extra classes for every slide's Card (sizing, scrolling). */
  slideClassName?: string;
  padding?: "sm" | "md";
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One Card at a time. Slides move with transform (no scroll area, so no
 * scrollbar) and all share the tallest slide's height, so nothing jumps.
 * Swipe or drag sideways, use the arrows, the dots, or the ← → keys.
 */
export default function Carousel({
  count,
  label,
  itemName,
  noun,
  renderSlide,
  index: controlled,
  onIndexChange,
  slideClassName = "",
  padding = "md",
}: CarouselProps) {
  const [own, setOwn] = useState(0);
  const index = controlled ?? own;
  const [dragX, setDragX] = useState(0);
  const drag = useRef<{ id: number; x: number; y: number; horizontal: boolean | null } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const last = count - 1;

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(last, next));
    if (onIndexChange) onIndexChange(clamped);
    else setOwn(clamped);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, horizontal: null };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (d.horizontal === null && Math.abs(dx) + Math.abs(dy) > 6) {
      d.horizontal = Math.abs(dx) > Math.abs(dy); // vertical moves stay normal scrolls
      if (d.horizontal) frameRef.current?.setPointerCapture(e.pointerId);
    }
    if (d.horizontal) {
      const atEdge = (index === 0 && dx > 0) || (index === last && dx < 0);
      setDragX(atEdge ? dx * 0.3 : dx); // resist at the ends
    }
  };
  const onPointerEnd = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (d.horizontal) {
      const width = frameRef.current?.offsetWidth ?? 1;
      if (dragX < -width * 0.18) go(index + 1);
      else if (dragX > width * 0.18) go(index - 1);
    }
    setDragX(0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  const dragging = dragX !== 0;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={frameRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        aria-label={`${label}. Swipe or use the arrow keys to browse.`}
        className="touch-pan-y select-none overflow-hidden rounded-2xl focus-visible:outline-offset-4"
      >
        <div
          className={`flex ${dragging ? "" : "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"}`}
          style={{ transform: `translateX(calc(${-index * 100}% + ${dragX}px))` }}
        >
          {Array.from({ length: count }, (_, i) => {
            const current = i === index;
            return (
              <Card
                as="article"
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${itemName(i)}`}
                aria-hidden={!current}
                inert={!current}
                padding={padding}
                className={`w-full shrink-0 ${slideClassName}`}
              >
                {renderSlide(i)}
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Eyebrow aria-live="polite">
            <span className="text-accent">{pad(index + 1)}</span> / {pad(count)}
          </Eyebrow>
          <div className="flex">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${itemName(i)}`}
                aria-current={i === index ? "true" : undefined}
                className="grid size-6 place-items-center rounded-full"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-4 bg-accent" : "w-1.5 bg-line-strong"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label={`Previous ${noun}`}
            className={`${iconButton} disabled:pointer-events-none disabled:opacity-30`}
          >
            <ArrowLeft size={16} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === last}
            aria-label={`Next ${noun}`}
            className={`${iconButton} disabled:pointer-events-none disabled:opacity-30`}
          >
            <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
