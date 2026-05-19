import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const IOS_APP_URL = "https://apps.apple.com/us/app/grover-van-life/id6742468326";
const ANDROID_APP_URL = "https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app";

const Hero = () => {
  const landscapeRef = useRef<HTMLDivElement>(null);
  const vanRef = useRef<HTMLDivElement>(null);
  const [arrowVisible, setArrowVisible] = useState(true);

  // SVG draw-in animation on first scroll
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
      vSvg.querySelectorAll<SVGElement>(".heroVan-1, .heroVan-2").forEach((el) => {
        el.style.opacity = "0";
      });

      let triggered = false;
      const animate = () => {
        if (triggered) return;
        triggered = true;

        lSvg.querySelectorAll<SVGPathElement>(".heroLandscape-1").forEach((p) => {
          const delay = Math.random() * 0.6;
          p.style.transition = `stroke-dashoffset 2.8s ease-out ${delay}s`;
          p.style.strokeDashoffset = "0";
        });
        vSvg.querySelectorAll<SVGPathElement>(".heroVan-3").forEach((p, i) => {
          p.style.transition = `stroke-dashoffset 2.2s ease-out ${0.3 + i * 0.02}s`;
          p.style.strokeDashoffset = "0";
        });
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

  // Arrow fades out once user scrolls past 50% of viewport height
  useEffect(() => {
    const onScroll = () => setArrowVisible(window.scrollY < window.innerHeight / 2);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative flex flex-col bg-background overflow-x-hidden">
      {/* Text + CTAs — z-10 so illustration can bleed up behind it */}
      <div className="relative z-10 flex items-center justify-center px-4 pt-24 pb-10 md:pb-14">
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
              variant="ghost"
              className="text-lg px-8 py-6 text-foreground border border-foreground/30 hover:bg-foreground/10 hover:text-foreground"
              asChild
            >
              <a href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer">
                <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12 3.84 21.85C3.34 21.6 3 21.09 3 20.5zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zM20.16 10.81c.34.27.59.69.59 1.19s-.25.92-.59 1.19L17.89 14.5 15.39 12l2.5-2.5 2.27 1.31zM6.05 2.66l10.76 6.22-2.27 2.27L6.05 2.66z" />
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

      {/* Illustration — pulled up so the terrain peeks behind the CTAs */}
      <div
        className="relative z-0 w-full -mt-14 md:-mt-20 h-[230px] sm:h-[260px] md:h-auto"
        aria-hidden="true"
      >
        {/* Van */}
        <div
          ref={vanRef}
          className="
            absolute bottom-0 left-1/2 -translate-x-1/2 z-10
            w-[230px] sm:w-[270px]
            md:w-[360px] lg:w-[430px]
            md:left-auto md:translate-x-0
            md:right-[5%] lg:right-[10%]
            md:bottom-[4%]
          "
          style={{ lineHeight: 0 }}
        />

        {/* Landscape — fades in from top so it blends smoothly into the CTA area */}
        <div
          ref={landscapeRef}
          className="
            absolute bottom-0 left-1/2 -translate-x-1/2 z-0
            w-[130vw]
            md:relative md:bottom-auto md:left-0 md:translate-x-0 md:w-full
          "
          style={{
            lineHeight: 0,
            maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
          }}
        />
      </div>

      {/* Arrow scroll cue — fades out once user scrolls past 50% viewport height */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce transition-opacity duration-500 ${arrowVisible ? "opacity-100" : "opacity-0"}`}
      >
        <svg width="35" height="131" viewBox="0 0 35 131" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-14 w-auto opacity-40">
          <path d="M17.9993 130C18.0002 93.1429 15.7499 46.5294 18 1" stroke="black" />
          <path d="M17.6229 129.343C16.6473 128.407 14.9636 126.52 14.0498 125.836C12.6167 124.764 11.2658 123.447 9.96679 121.994C8.03976 119.839 5.98908 118.041 3.99068 116.093C3.31168 115.431 3.31332 115.608 1.26252 113.64" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17.5997 129.386C18.5753 128.449 20.2591 126.562 21.1728 125.878C22.606 124.806 23.9569 123.489 25.2559 122.037C27.1829 119.881 29.2336 118.083 31.232 116.135C31.911 115.473 31.9093 115.651 33.9601 113.682" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
