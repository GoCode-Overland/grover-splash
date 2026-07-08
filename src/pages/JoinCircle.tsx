import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const IOS_APP_URL = "https://apps.apple.com/us/app/grover-van-life/id6742468326";
const ANDROID_BASE_URL = "https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app";
const API_BASE_URL = "https://ops.getgrover.ai";
const DEFAULT_LOGO = "/img/grover-combomark-black.svg";

const hexToRgb = (hex: string): [number, number, number] | null => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!match) return null;
  return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
};

const hexToRgba = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
};

// WCAG relative luminance, used to keep brand colors readable as heading text
// on the page's light background regardless of how pale a company's hex is.
const relativeLuminance = ([r, g, b]: [number, number, number]): number => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const readableAccentColor = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  let [r, g, b] = rgb;
  let iterations = 0;
  while (relativeLuminance([r, g, b]) > 0.4 && iterations < 12) {
    r = Math.round(r * 0.85);
    g = Math.round(g * 0.85);
    b = Math.round(b * 0.85);
    iterations++;
  }
  return `rgb(${r}, ${g}, ${b})`;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface BrandingTheme {
  primaryHex: string;
  secondaryHex: string;
  darkPrimaryHex?: string;
  darkSecondaryHex?: string;
}

interface JoinCompany {
  id: string;
  name: string;
  logoUrl: string | null;
  brandingTheme: BrandingTheme | null;
}

interface JoinResponse {
  company: JoinCompany;
  builderCodes: string[];
}

type LoadState =
  | { status: "loading" }
  | { status: "success"; data: JoinResponse }
  | { status: "not-found" }
  | { status: "rate-limited" }
  | { status: "error" };

const prefersDarkMode = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;

const JoinCircle = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [logoFailed, setLogoFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    setLogoFailed(false);

    fetch(`${API_BASE_URL}/api/join/${encodeURIComponent(slug.toLowerCase())}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) {
          setState({ status: "not-found" });
          return;
        }
        if (res.status === 429) {
          setState({ status: "rate-limited" });
          return;
        }
        if (!res.ok) {
          setState({ status: "error" });
          return;
        }
        const data = (await res.json()) as JoinResponse;
        setState({ status: "success", data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [slug, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const company = state.status === "success" ? state.data.company : null;
  const codes = state.status === "success" ? state.data.builderCodes : [];
  const trackingCode = codes.join(",") || slug.toUpperCase();

  const theme = company?.brandingTheme ?? null;
  const useDark = prefersDarkMode();
  const primaryHex = theme ? (useDark ? theme.darkPrimaryHex ?? theme.primaryHex : theme.primaryHex) : undefined;
  const secondaryHex = theme ? (useDark ? theme.darkSecondaryHex ?? theme.secondaryHex : theme.secondaryHex) : undefined;
  const accentTextColor = primaryHex ? readableAccentColor(primaryHex) : undefined;

  const hasCompanyLogo = state.status === "success" && !!company?.logoUrl && !logoFailed;

  const trackDownload = (platform: "ios" | "android") => {
    window.gtag?.("event", "download_click", {
      platform,
      circle_code: trackingCode,
      circle_slug: slug,
      utm_source: searchParams.get("utm_source") ?? undefined,
      utm_medium: searchParams.get("utm_medium") ?? undefined,
      utm_campaign: searchParams.get("utm_campaign") ?? undefined,
      utm_content: searchParams.get("utm_content") ?? undefined,
    });
  };

  const androidUrl = `${ANDROID_BASE_URL}&referrer=${encodeURIComponent(`company_code=${trackingCode}`)}`;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <a href="/" className="mb-8 block">
        {hasCompanyLogo ? (
          <div className="h-24 w-24 mx-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center p-3 overflow-hidden transition-transform hover:scale-105">
            <img
              src={company!.logoUrl!}
              onError={() => setLogoFailed(true)}
              alt={company!.name}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <img
            src={DEFAULT_LOGO}
            alt="Grover"
            className="h-8 w-auto max-w-[200px] object-contain mx-auto opacity-90 hover:opacity-100 transition-opacity"
          />
        )}
      </a>

      {state.status === "loading" && (
        <div className="w-full max-w-xs animate-pulse">
          <div className="h-10 bg-muted rounded-lg mb-3 mx-auto w-4/5" />
          <div className="h-5 bg-muted rounded-lg mb-8 mx-auto w-3/5" />
          <div className="h-20 bg-muted rounded-xl mb-10" />
          <div className="h-14 bg-muted rounded-lg mb-4" />
          <div className="h-14 bg-muted rounded-lg" />
        </div>
      )}

      {state.status === "not-found" && (
        <>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">
            We couldn't find<br />that community
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-sm">
            Double-check the link you were given, or download Grover and explore communities on your own.
          </p>
        </>
      )}

      {state.status === "rate-limited" && (
        <>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">
            Slow down a moment
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-sm">
            You're checking this a little too fast. Wait a minute and refresh the page.
          </p>
        </>
      )}

      {state.status === "error" && (
        <>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-3">
            Something went wrong
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-sm">
            We couldn't load this page. Please try again in a moment.
          </p>
          <button
            onClick={retry}
            className="mb-8 text-sm font-medium text-primary hover:opacity-80 transition-opacity underline underline-offset-4"
          >
            Try again
          </button>
        </>
      )}

      {state.status === "success" && company && (
        <>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-3">
            Join {company.name}'s<br />
            <span style={accentTextColor ? { color: accentTextColor } : undefined} className={accentTextColor ? undefined : "text-primary"}>
              Community
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-sm">
            Download Grover and enter your code below to make {company.name} your Home Circle.
          </p>

          {/* Code callout */}
          {codes.length <= 1 ? (
            <div
              className="bg-muted rounded-xl px-8 py-5 mb-10 inline-flex flex-col items-center gap-1"
              style={secondaryHex ? { backgroundColor: hexToRgba(secondaryHex, 0.12) } : undefined}
            >
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Your circle code
              </span>
              <span className="text-3xl font-bold font-heading tracking-wider text-foreground">
                {codes[0] ?? slug.toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="bg-muted rounded-xl px-8 py-5 mb-10 inline-flex flex-col items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Enter one of these codes
              </span>
              <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                {codes.map((code) => (
                  <span
                    key={code}
                    className="px-4 py-1.5 rounded-lg bg-background border border-border text-lg font-bold font-heading tracking-wider text-foreground"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* App store badges */}
      {state.status !== "loading" && (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <a
            href={IOS_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackDownload("ios")}
            className="transition-opacity hover:opacity-80"
          >
            <img
              src="/img/marketing/appStoreBadge.png"
              alt="Download on the App Store"
              className="h-14 w-auto mx-auto"
            />
          </a>

          <a
            href={androidUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackDownload("android")}
            className="transition-opacity hover:opacity-80"
          >
            <img
              src="/img/marketing/playStoreBadge.png"
              alt="Get it on Google Play"
              className="h-14 w-auto mx-auto"
            />
          </a>
        </div>
      )}

      <div className="mt-10 w-16 h-0.5 bg-primary rounded-full opacity-50" />
      <p className="mt-4 text-xs text-muted-foreground/60">
        iOS · Android · Free to download
      </p>
    </div>
  );
};

export default JoinCircle;
