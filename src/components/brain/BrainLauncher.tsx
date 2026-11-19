"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "lucide-react";
import Badge from "@/components/ui/Badge";
import BrainCanvas from "./BrainCanvas";

// The explorer is only downloaded when someone opens it.
const BrainExplorer = dynamic(() => import("./BrainExplorer"), { ssr: false });

/** The hero brain. The whole thing is one button that opens the explorer. */
export default function BrainLauncher() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Hand focus back to the brain so keyboard users keep their place, but only
  // show the focus outline if they were using the keyboard (not after a mouse close).
  const close = (viaKeyboard: boolean) => {
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true, focusVisible: viaKeyboard } as FocusOptions);
    if (!viaKeyboard) buttonRef.current?.blur();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="View the brain in 3D: open the interactive brain explorer"
        className="group relative block aspect-square w-[min(17rem,calc(100vw-2rem))] cursor-pointer rounded-2xl sm:w-[min(18rem,40svh)] lg:w-[min(20rem,50svh)]"
      >
        <BrainCanvas label="" paused={open} />
        {/* Same glass pill as the nav. Appears on hover / keyboard focus; always shown on touch screens (no hover there). */}
        <span className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center opacity-100 transition-all duration-300 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100">
          <Badge variant="glass" className="text-fg">
            <Box className="size-3.5" aria-hidden />
            View in 3D
          </Badge>
        </span>
      </button>

      {open && <BrainExplorer onClose={close} />}
    </>
  );
}
