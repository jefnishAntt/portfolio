/** A headline number with a small caption, e.g. "10k+ / transactions per day". Use inside a <dl>. */
export default function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="mt-0.5 text-sm text-muted">{label}</dt>
      <dd className="text-2xl font-semibold tracking-tight text-fg">{value}</dd>
    </div>
  );
}

/** A row of metrics. */
export function MetricList({ items, className = "" }: { items: { value: string; label: string }[]; className?: string }) {
  return (
    <dl className={`flex flex-wrap gap-x-10 gap-y-4 ${className}`}>
      {items.map((m) => (
        <Metric key={m.label} {...m} />
      ))}
    </dl>
  );
}
