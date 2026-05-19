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
      {/* Logo */}
      <a href="/" className="mb-10">
        <img
          src="/img/grover-combomark-black.svg"
          alt="Grover"
          className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
        />
      </a>

      {/* Headline with primary color accent */}
      <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">
        Get <span className="text-primary">Grover</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-sm">
        The AI assistant built for life on the road. Know your rig. Find your spots. Travel with your people.
      </p>

      {/* App store badges */}
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
          href={ANDROID_APP_URL}
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

      {/* Divider with primary color */}
      <div className="mt-10 w-16 h-0.5 bg-primary rounded-full opacity-50" />

      <p className="mt-4 text-xs text-muted-foreground/60">
        iOS · Android · Free to download
      </p>
    </div>
  );
};

export default Download;
