"use client";
import { useState } from "react";
import Image from "next/image";

/**
 * Round profile photo. Shows `initials` instead when there is no photo yet,
 * or if the photo file fails to load (wrong path, missing file).
 *
 * To add your photo: put a square-ish image in /public (e.g. /public/profile.jpg)
 * and set PROFILE.photo = "/profile.jpg" in src/config.ts.
 */
export default function Avatar({
  src,
  name,
  initials,
  grayscale = false,
  sizes = "128px",
  className = "",
}: {
  src?: string;
  name: string;
  initials: string;
  /** Show the photo in black and white (the file itself stays in colour). */
  grayscale?: boolean;
  /** Displayed size(s), so the browser picks a sharp enough version, also when zoomed in. */
  sizes?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src) && !failed;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border border-line-strong bg-surface ${className}`}
      style={showPhoto ? undefined : { backgroundImage: "radial-gradient(circle at 30% 20%, var(--accent-soft), transparent 70%)" }}
    >
      {showPhoto ? (
        <>
          <Image
            src={src!}
            alt={`Portrait of ${name}`}
            fill
            sizes={sizes}
            quality={92}
            priority
            className={`object-cover ${grayscale ? "grayscale" : ""}`}
            onError={() => setFailed(true)}
          />
          {grayscale && (
            // Brand tint: 10% violet over the black-and-white photo, with a soft black shade at the bottom.
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgb(0 0 0 / 0) 40%, rgb(0 0 0 / 0.35) 100%), linear-gradient(rgb(139 92 246 / 0.1), rgb(139 92 246 / 0.1))",
              }}
            />
          )}
        </>
      ) : (
        <div
          role="img"
          aria-label={name}
          className="grid size-full place-items-center text-lg font-semibold tracking-tight text-fg sm:text-xl"
        >
          {initials}
        </div>
      )}
    </div>
  );
}
