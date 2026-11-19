import type { ElementType, ReactNode } from "react";

/** Small monospace label above or beside content ("Experience", "Haddy Designs · desktop app"). */
export default function Eyebrow({
  children,
  as: Tag = "p",
  className = "",
  ...props
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  dateTime?: string;
  "aria-live"?: "polite" | "off" | "assertive";
}) {
  return (
    <Tag className={`font-mono text-xs text-faint ${className}`} {...props}>
      {children}
    </Tag>
  );
}
