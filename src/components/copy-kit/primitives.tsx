import { useState, useCallback } from "react";
import type { ReactNode } from "react";

export function CopyBlock({
  label,
  value,
  multiLine = true,
}: {
  label: string;
  value: string;
  multiLine?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silently fail */
    }
  }, [value]);

  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="rounded border border-primary px-2 py-0.5 text-xs text-primary transition-colors hover:bg-primary hover:text-white"
        >
          {copied ? "Copied! ✓" : "Copy"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap rounded-md border-l-4 border-primary bg-white px-4 py-3 font-mono text-sm leading-relaxed text-gray-800">
        {value}
      </pre>
    </div>
  );
}

export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 border-b border-border px-6 py-5 text-left transition-colors hover:bg-muted/40"
      >
        <div>
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="p-6">{children}</div>}
    </div>
  );
}

export function ContentBlock({
  title,
  note,
  imageSuggestion,
  children,
  onCopyAll,
}: {
  title: string;
  note?: string;
  imageSuggestion?: string;
  children: ReactNode;
  onCopyAll?: () => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <h3 className="mb-1 text-base font-semibold text-foreground">{title}</h3>
      {note && <p className="mb-3 text-sm text-muted-foreground">{note}</p>}
      {children}
      {imageSuggestion && (
        <div className="mb-3 rounded border-l-4 border-primary bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
          <strong>Image suggestion:</strong> {imageSuggestion}
        </div>
      )}
      {onCopyAll && (
        <button
          onClick={onCopyAll}
          className="mt-2 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/80"
        >
          Copy All
        </button>
      )}
    </div>
  );
}
