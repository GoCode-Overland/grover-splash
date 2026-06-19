const ASSETS = [
  { file: "combo1-bnw.svg", label: "Combo 1 (BNW)" },
  { file: "combo1-color.svg", label: "Combo 1 (Color)" },
  { file: "combo1-white.svg", label: "Combo 1 (White)" },
  { file: "combo2-bnw.svg", label: "Combo 2 (BNW)" },
  { file: "combo2-color.svg", label: "Combo 2 (Color)" },
  { file: "grover-symbol2-color.svg", label: "Grover Symbol 2" },
  { file: "plate.svg", label: "Plate Graphic" },
  { file: "symbol1-bnw.svg", label: "Symbol 1 (BNW)" },
  { file: "symbol1-color.svg", label: "Symbol 1 (Color)" },
  { file: "symbol1-white.svg", label: "Symbol 1 (White)" },
  { file: "symbol2-bnw.svg", label: "Symbol 2 (BNW)" },
];

const CHECKERBOARD: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
  backgroundColor: "#f0f0f0",
};

function AssetCard({ file, label }: { file: string; label: string }) {
  const src = `/img/marketing/${file}`;
  const isWhite = file.includes("-white");

  return (
    <div className="flex flex-col rounded-lg border-2 border-border bg-card transition-shadow hover:border-primary hover:shadow-md">
      <div
        className="flex h-32 items-center justify-center overflow-hidden rounded-t-md p-3"
        style={isWhite ? { backgroundColor: "#1f2937" } : CHECKERBOARD}
      >
        <img
          src={src}
          alt={label}
          className="max-h-full max-w-full object-contain transition-transform hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">SVG</span>
        <a
          href={src}
          download
          className="mt-2 inline-block rounded-md bg-primary px-3 py-1 text-center text-xs font-semibold text-white transition-colors hover:bg-primary/80"
        >
          Download
        </a>
      </div>
    </div>
  );
}

export default function BrandAssets() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-1 text-xl font-semibold text-primary">🎨 Brand Assets</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Download Grover logos and marketing assets for use in your own materials.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {ASSETS.map((a) => (
          <AssetCard key={a.file} {...a} />
        ))}
      </div>
    </div>
  );
}
