import type { AnchorHTMLAttributes, HTMLAttributes } from "react";

type CardVariant = "default" | "interactive" | "dashed";

const variants: Record<CardVariant, string> = {
  default: "border-line",
  /** For cards that are links or buttons: border brightens on hover. */
  interactive: "border-line transition-colors duration-200 hover:border-line-strong hover:bg-fg/[0.02]",
  /** For placeholders / empty states. */
  dashed: "border-dashed border-line-strong",
};

const paddings = {
  sm: "p-5",
  md: "p-6 sm:p-8",
} as const;

type CardProps = {
  as?: "div" | "article" | "a" | "li" | "section";
  variant?: CardVariant;
  padding?: keyof typeof paddings;
} & HTMLAttributes<HTMLElement> &
  Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel">;

/**
 * The one card used across the site: a thin outline, rounded corners, no fill.
 * `as` picks the element, `variant` and `padding` adjust it.
 */
export default function Card({ as: Tag = "div", variant = "default", padding = "md", className = "", ...props }: CardProps) {
  return <Tag className={`rounded-2xl border ${variants[variant]} ${paddings[padding]} ${className}`} {...props} />;
}
