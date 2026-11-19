import type { ReactNode } from "react";
import { glassSurface } from "./surfaces";

type BadgeVariant = "outline" | "glass";

const variants: Record<BadgeVariant, string> = {
  /** Tags: tech stacks, skills, topics. */
  outline: "border-line px-2.5 py-0.5 text-muted",
  /** Floating labels on top of visuals; same glass pill as the navigation. */
  glass: `h-8 gap-1.5 px-3 text-muted ${glassSurface}`,
};

/** Small rounded pill with monospace text. */
export default function Badge({
  children,
  variant = "outline",
  className = "",
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center rounded-full font-mono text-xs ${variant === "outline" ? "border" : ""} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

/** A row of outline badges, as a list (for screen readers). */
export function BadgeList({ items, label, className = "" }: { items: string[]; label: string; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label={label}>
      {items.map((item) => (
        <li key={item}>
          <Badge>{item}</Badge>
        </li>
      ))}
    </ul>
  );
}
