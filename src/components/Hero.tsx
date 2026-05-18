import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-van.jpg";

const IOS_APP_URL = "https://apps.apple.com/us/app/grover-van-life/id6742468326";
const ANDROID_APP_URL = "https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-white leading-tight">
            Adventure Confidently.{" "}
            <span className="text-secondary">Reach Rig Joy.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Grover is your rig-aware AI assistant — find the best camping spots, get answers tuned to your specific rig, and connect with your community.
          </p>

          {/* Store badges */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button size="lg" variant="hero" className="text-lg px-8 py-6 group" asChild>
              <a href={IOS_APP_URL} target="_blank" rel="noopener noreferrer">
                <svg className="mr-2 w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
                Download for iOS
              </a>
            </Button>

            <Button
              size="lg"
              variant="hero-outline"
              className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-primary"
              asChild
            >
              <a href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer">
                <svg className="mr-2 w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3.18 23.76a1 1 0 001.04-.06l12.45-6.93-2.79-2.79-10.7 9.78zM.5 1.37A1 1 0 000 2.27v19.46a1 1 0 00.5.9l.13.07L11.26 12 .63 1.3.5 1.37zM22.54 10.31l-2.66-1.48-3.18 3.18 3.18 3.17 2.69-1.5A1.43 1.43 0 0022.54 10.31zM4.22.3L16.88 7.22l-2.79 2.79L4.22.3z" />
                </svg>
                Android Open Beta
              </a>
            </Button>
          </div>

          <p className="text-white/70 text-sm pt-2">
            Free to download · iOS &amp; Android
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
