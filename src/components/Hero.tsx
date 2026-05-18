import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";
import heroImage from "@/assets/hero-van.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Reach Joyful Van Outcomes.{" "}
            <span className="text-secondary">Faster.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            You bought a van to make dreams come true. With Grover, fulfill those dreams and help others reach vanlife joy, too.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button size="lg" variant="hero" className="text-lg px-8 py-6 group" asChild>
              <a href="https://apps.apple.com/us/app/grover-van-life/id6742468326" target="_blank" rel="noopener noreferrer">
                Get Started for Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="hero-outline" 
              className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-primary"
              asChild
            >
              <a href="https://apps.apple.com/us/app/grover-van-life/id6742468326" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-2" />
                Chat with Grover
              </a>
            </Button>
          </div>

          <p className="text-white/70 text-sm pt-4">
            Join thousands of vanlifers • No credit card required
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
