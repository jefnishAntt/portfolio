import type { LucideIcon } from "lucide-react";
import Card from "./Card";

/** Placeholder for a section with nothing in it yet. */
export default function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <Card variant="dashed" className="flex flex-col items-center text-center">
      <Icon className="size-5 text-accent-ink" aria-hidden />
      <p className="mt-4 font-medium text-fg">{title}</p>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </Card>
  );
}
