import { useSearchParams } from "react-router-dom";

const IOS_APP_URL = "https://apps.apple.com/us/app/grover-van-life/id6742468326";
const ANDROID_APP_URL = "https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const Download = () => {
  const [searchParams] = useSearchParams();

  const trackDownload = (platform: "ios" | "android") => {
    window.gtag?.("event", "download_click", {
      platform,
      utm_source: searchParams.get("utm_source") ?? undefined,
      utm_medium: searchParams.get("utm_medium") ?? undefined,
      utm_campaign: searchParams.get("utm_campaign") ?? undefined,
      utm_content: searchParams.get("utm_content") ?? undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <a href="/" className="mb-10">
        <img
          src="/img/grover-combomark-black.svg"
          alt="Grover"
          className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
        />
      </a>

      <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">
        Get Grover
      </h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-sm">
        The AI assistant built for van life. Know your rig. Find your spots. Travel with your people.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <a
          href={IOS_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackDownload("ios")}
          className="flex items-center justify-center gap-3 bg-foreground text-background rounded-xl px-6 py-4 font-semibold text-base hover:opacity-80 transition-opacity"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Download for iOS
        </a>

        <a
          href={ANDROID_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackDownload("android")}
          className="flex items-center justify-center gap-3 border border-border rounded-xl px-6 py-4 font-semibold text-base text-foreground hover:bg-muted/50 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
            <path d="M17.523 15.341 14.48 9.742l-1.73 3.157 1.946 3.557-2.832.047L8.5 6.148l-2.833.047 3.875 7.08-1.73 3.157-1.038-1.896L5 16.6l1.583 2.892a1.4 1.4 0 0 0 1.223.718l7.447-.123a1.4 1.4 0 0 0 1.213-.75zM8.073 3.108 9.5 5.663l1.46-2.665a1.4 1.4 0 0 0-2.887.11zm7.5.11A1.4 1.4 0 0 0 12.7 3l-1.46 2.665 1.427 2.606z" />
          </svg>
          Android Open Beta
        </a>
      </div>

      <p className="mt-8 text-xs text-muted-foreground/60">
        iOS · Android · Free to download
      </p>
    </div>
  );
};

export default Download;
