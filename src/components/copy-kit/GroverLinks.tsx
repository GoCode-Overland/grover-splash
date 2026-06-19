import { useState, useCallback } from "react";

const LINKS = [
  {
    icon: "📱",
    title: "App Store",
    url: "https://apps.apple.com/us/app/grover-van-life/id6742468326",
    display: "apps.apple.com/us/app/grover-van-life",
  },
  {
    icon: "🏠",
    title: "Grover Homepage",
    url: "https://getgrover.ai",
    display: "getgrover.ai",
  },
  {
    icon: "📸",
    title: "Grover Instagram",
    url: "https://www.instagram.com/getgrover.ai/",
    display: "instagram.com/getgrover.ai",
  },
];

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silently fail */
    }
  }, [url]);

  return (
    <button
      onClick={handleCopy}
      className="mt-auto rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/80"
    >
      {copied ? "Copied! ✓" : "Copy Link"}
    </button>
  );
}

export default function GroverLinks() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-primary">🔗 Important Grover Links</h2>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {LINKS.map(({ icon, title, url, display }) => (
          <div
            key={url}
            className="flex flex-col rounded-lg border-2 border-border bg-muted/30 p-4 transition-shadow hover:border-primary hover:shadow-md"
          >
            <h3 className="mb-2 font-semibold text-primary">
              {icon} {title}
            </h3>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 block break-all text-sm text-muted-foreground hover:underline"
            >
              {display}
            </a>
            <CopyLinkButton url={url} />
          </div>
        ))}
      </div>

      <div className="rounded-lg border-2 border-primary p-5">
        <h3 className="mb-1 text-base font-semibold text-primary">
          📅 Book a Grover Success Meeting
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Schedule time with co-founders Will and Josh to discuss your Circle's success.
        </p>
        <div className="overflow-hidden rounded-md bg-white">
          <iframe
            src="https://meetings.hubspot.com/will858/grover-success-with-josh?embed=true"
            title="Book a Grover Success Meeting"
            width="100%"
            height="650"
            frameBorder={0}
            className="block"
          />
        </div>
      </div>
    </div>
  );
}
