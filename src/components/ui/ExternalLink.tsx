import type { ComponentPropsWithoutRef } from "react";

/**
 * Link to another site: opens in a new tab safely (noopener) and tells
 * screen-reader users it does.
 */
export default function ExternalLink({ children, ...props }: ComponentPropsWithoutRef<"a">) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
