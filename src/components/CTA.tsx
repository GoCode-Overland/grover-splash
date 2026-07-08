import { Button } from "@/components/ui/button";

const IOS_APP_URL = "https://apps.apple.com/us/app/grover-van-life/id6742468326";
const ANDROID_APP_URL = "https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-accent/90 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold font-heading text-white leading-tight">
            Ready to Find Your Next Adventure?
          </h2>

          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join adventurers who use Grover to discover new spots, stay confident on the road, and share their favorite finds with their community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              asChild
            >
              <a href={IOS_APP_URL} target="_blank" rel="noopener noreferrer">
                Download for iOS
              </a>
            </Button>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-transparent text-white border-2 border-white hover:bg-white/10 shadow-xl transition-all"
              asChild
            >
              <a href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer">
                Android Open Beta
              </a>
            </Button>
          </div>

          <p className="text-white/60 text-sm pt-2">Free to download</p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
