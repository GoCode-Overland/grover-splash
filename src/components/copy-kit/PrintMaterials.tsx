import { useState } from "react";
import { Section } from "./primitives";

function MaterialFrame({
  width,
  height,
  src,
  alt,
  icon,
  filename,
}: {
  width: number;
  height: number;
  src: string;
  alt: string;
  icon: string;
  filename: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div
      style={{ width, height }}
      className="relative flex-shrink-0 overflow-hidden rounded-sm bg-gradient-to-br from-slate-100 to-slate-200 shadow-2xl"
    >
      {(!loaded || errored) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <span className="text-4xl">{icon}</span>
          <span className="rounded bg-white/65 px-2 py-1 font-mono text-xs">{filename}</span>
          <span className="text-xs text-muted-foreground opacity-70">img/print-materials/</span>
        </div>
      )}
      {!errored && (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}

function PostcardSlide() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      {flipped ? (
        <MaterialFrame
          width={440}
          height={264}
          src="/img/print-materials/postcard-back.jpg"
          alt="Postcard Back"
          icon="📬"
          filename="postcard-back.jpg"
        />
      ) : (
        <MaterialFrame
          width={264}
          height={440}
          src="/img/print-materials/postcard-front.jpg"
          alt="Postcard Front"
          icon="🪪"
          filename="postcard-front.jpg"
        />
      )}
      <button
        onClick={() => setFlipped((f) => !f)}
        className="rounded-full border-2 border-primary px-5 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
      >
        ↺ {flipped ? "See Front" : "See Back"}
      </button>
    </div>
  );
}

const SLIDES = [
  {
    id: "poster",
    badge: '18" × 24" Poster',
    title: "Lobby & Showroom Display",
    description:
      "Large-format display for your lobby, showroom, or shop wall. Introduces Grover and drives Circle sign-ups from customers already in your space.",
  },
  {
    id: "one-sheet",
    badge: '8.5" × 11" One-Sheet',
    title: "Welcome Folders & Handouts",
    description:
      "Designed for welcome folders, trade show handouts, and delivery packages. A complete overview of Grover and your brand's Circle.",
  },
  {
    id: "postcard",
    badge: '3" × 5" Postcard',
    title: "Mailable & Handout Card",
    description:
      "Mailable or great for handouts. Front introduces Grover; back includes your Circle details and a QR code link.",
  },
];

function SlideContent({ id }: { id: string }) {
  if (id === "poster")
    return (
      <MaterialFrame
        width={330}
        height={440}
        src="/img/print-materials/poster-18x24.jpg"
        alt="18×24 Poster"
        icon="🖼️"
        filename="poster-18x24.jpg"
      />
    );
  if (id === "one-sheet")
    return (
      <MaterialFrame
        width={340}
        height={440}
        src="/img/print-materials/one-sheet-8x11.jpg"
        alt="8.5×11 One-Sheet"
        icon="📄"
        filename="one-sheet-8x11.jpg"
      />
    );
  if (id === "postcard") return <PostcardSlide />;
  return null;
}

export default function PrintMaterials() {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;
  const slide = SLIDES[current];

  return (
    <Section
      title="🖨️ Physical Marketing Materials"
      subtitle="Print-ready collateral Grover supplies to partner locations"
    >
      <p className="mb-4 text-sm text-muted-foreground">
        Click through each item to see what's available for your space.
      </p>
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px]">
          {/* Stage */}
          <div className="relative flex min-h-[480px] items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 px-16 py-10">
            <button
              onClick={() => setCurrent((c) => (c - 1 + total) % total)}
              aria-label="Previous"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl shadow-md transition hover:border hover:border-primary hover:text-primary"
            >
              ‹
            </button>
            <SlideContent id={slide.id} />
            <button
              onClick={() => setCurrent((c) => (c + 1) % total)}
              aria-label="Next"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl shadow-md transition hover:border hover:border-primary hover:text-primary"
            >
              ›
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full transition-transform ${i === current ? "scale-125 bg-primary" : "bg-border"}`}
                />
              ))}
            </div>
          </div>
          {/* Info panel */}
          <div className="flex flex-col justify-center gap-3 border-t border-border bg-white p-6 md:border-l md:border-t-0">
            <span className="inline-block w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {slide.badge}
            </span>
            <h3 className="text-lg font-bold text-foreground">{slide.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{slide.description}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
