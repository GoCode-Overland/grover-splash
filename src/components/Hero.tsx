import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const IOS_APP_URL = "https://apps.apple.com/us/app/grover-van-life/id6742468326";
const ANDROID_APP_URL = "https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app";

const Hero = () => {
  const landscapeRef = useRef<HTMLDivElement>(null);
  const vanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    Promise.all([
      fetch("/img/heroLandscape.svg").then((r) => r.text()),
      fetch("/img/heroVan.svg").then((r) => r.text()),
    ]).then(([landscapeHTML, vanHTML]) => {
      const lc = landscapeRef.current;
      const vc = vanRef.current;
      if (!lc || !vc) return;

      lc.innerHTML = landscapeHTML;
      vc.innerHTML = vanHTML;

      const lSvg = lc.querySelector("svg");
      const vSvg = vc.querySelector("svg");
      if (!lSvg || !vSvg) return;

      lSvg.setAttribute("width", "100%");
      lSvg.removeAttribute("height");
      vSvg.setAttribute("width", "100%");
      vSvg.removeAttribute("height");

      // Hide all stroke paths before animation
      lSvg.querySelectorAll<SVGPathElement>(".heroLandscape-1").forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
      });
      vSvg.querySelectorAll<SVGPathElement>(".heroVan-3").forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
      });
      // Hide filled van panels until strokes draw in
      vSvg.querySelectorAll<SVGElement>(".heroVan-1, .heroVan-2").forEach((el) => {
        el.style.opacity = "0";
      });

      let triggered = false;
      const animate = () => {
        if (triggered) return;
        triggered = true;

        // Landscape paths draw in with slight random stagger for organic feel
        lSvg.querySelectorAll<SVGPathElement>(".heroLandscape-1").forEach((p) => {
          const delay = Math.random() * 0.6;
          p.style.transition = `stroke-dashoffset 2.8s ease-out ${delay}s`;
          p.style.strokeDashoffset = "0";
        });

        // Van strokes draw in sequentially
        vSvg.querySelectorAll<SVGPathElement>(".heroVan-3").forEach((p, i) => {
          p.style.transition = `stroke-dashoffset 2.2s ease-out ${0.3 + i * 0.02}s`;
          p.style.strokeDashoffset = "0";
        });

        // Van fill colors fade in after the outline starts appearing
        vSvg.querySelectorAll<SVGElement>(".heroVan-1, .heroVan-2").forEach((el) => {
          el.style.transition = "opacity 1s ease-in 1.2s";
          el.style.opacity = "1";
        });

        window.removeEventListener("scroll", animate);
      };

      window.addEventListener("scroll", animate, { passive: true });
      cleanup = () => window.removeEventListener("scroll", animate);
    });

    return () => cleanup?.();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      {/* Text + CTAs */}
      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-foreground leading-tight">
            Adventure Confidently.{" "}
            <span className="text-primary">Reach Rig Joy.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Grover is your rig-aware AI assistant — find the best camping spots,
            get answers tuned to your specific rig, and connect with your community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <a href={IOS_APP_URL} target="_blank" rel="noopener noreferrer">
                <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
                Download for iOS
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-transparent border-foreground/30 hover:bg-foreground/5"
              asChild
            >
              <a href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer">
                <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.523 15.341 14.48 9.742l-1.73 3.157 1.946 3.557-2.832.047L8.5 6.148l-2.833.047 3.875 7.08-1.73 3.157-1.038-1.896L5 16.6l1.583 2.892a1.4 1.4 0 0 0 1.223.718l7.447-.123a1.4 1.4 0 0 0 1.213-.75zM8.073 3.108 9.5 5.663l1.46-2.665a1.4 1.4 0 0 0-2.887.11zm7.5.11A1.4 1.4 0 0 0 12.7 3l-1.46 2.665 1.427 2.606z" />
                </svg>
                Android Open Beta
              </a>
            </Button>
          </div>

          <p className="text-muted-foreground/60 text-sm">
            Free to download · iOS &amp; Android
          </p>
        </div>
      </div>

      {/* Illustration zone: van sitting on landscape terrain */}
      <div className="relative w-full mt-auto" aria-hidden="true">
        {/* Van: normal-flow centered on mobile, absolute right on desktop */}
        <div
          ref={vanRef}
          className="
            w-[210px] mx-auto -mb-10
            md:absolute md:mx-0 md:-mb-0
            md:w-[360px] lg:w-[430px]
            md:z-10 md:bottom-[4%]
            md:right-[5%] lg:right-[10%]
          "
          style={{ lineHeight: 0 }}
        />
        {/* Landscape - full-width terrain */}
        <div
          ref={landscapeRef}
          className="w-full relative z-0"
          style={{ lineHeight: 0 }}
        />
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-20 pointer-events-none">
        <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 bg-foreground/20 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
