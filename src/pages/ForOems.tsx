import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Shield, Zap, ArrowRight } from "lucide-react";
import infinityVansLogo from "@/assets/brands/infinity-vans.svg";
import rixensLogo from "@/assets/brands/rixens.svg";

const HUBSPOT_BOOKING_URL = "https://meetings.hubspot.com/will858/grover-success-with-josh";

const valueProps = [
  {
    icon: BookOpen,
    title: "Your Knowledge, Your Voice",
    description:
      "Upload your product manuals, installation guides, troubleshooting docs, and support history. Grover ingests them into a company knowledge base so every answer reflects your engineering truth — not a generic web search.",
  },
  {
    icon: Shield,
    title: "Permissioned by Default",
    description:
      "Content permissions are set at the company level. Your proprietary specs stay visible only to assistants you authorise. Public guides can be shared openly. You control the boundary.",
  },
  {
    icon: Zap,
    title: "Instant Accuracy for Installers and Owners",
    description:
      "When a vanlifer asks \"How do I wire my Infinity 300Ah lithium?\" they get an answer from your docs, not a hallucinated approximation. Accurate first-time, every time.",
  },
];

const howItWorks = [
  {
    number: "01",
    title: "Upload your content",
    description: "Share product specs, install guides, FAQ docs, and support history with the Grover team or via the KB dashboard.",
  },
  {
    number: "02",
    title: "We build your KB",
    description: "Your content is indexed into a permissioned knowledge base tied to your company profile.",
  },
  {
    number: "03",
    title: "Assistants answer from your docs",
    description: "Any Grover assistant with access to your KB answers questions using your actual engineering and support content.",
  },
  {
    number: "04",
    title: "See what customers ask",
    description: "The KB dashboard surfaces the top questions, session counts, and keyword trends — a window into how customers use your products.",
  },
];

const ForOems = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto space-y-20 animate-fade-in">

          {/* Hero */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold font-heading text-foreground">
              Your Engineering Knowledge.{" "}
              <span className="text-primary">In Every Assistant.</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Component OEMs publish their product knowledge into Grover so vanlifers get accurate, brand-accurate answers — straight from the source.
            </p>
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <a href={HUBSPOT_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                Talk to Partnerships
              </a>
            </Button>
          </div>

          {/* Partner logos */}
          <div className="space-y-6">
            <p className="text-center text-muted-foreground text-sm uppercase tracking-widest font-medium">
              OEM Partners
            </p>
            <div className="flex flex-wrap gap-8 justify-center items-center">
              <div className="h-16 flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <img src={infinityVansLogo} alt="Infinity Vans" className="max-h-full w-auto object-contain max-w-[160px]" />
              </div>
              <div className="h-16 flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <img src={rixensLogo} alt="Rixens" className="max-h-full w-auto object-contain max-w-[160px]" />
              </div>
            </div>
          </div>

          {/* Problem */}
          <div className="bg-muted/40 rounded-2xl p-8 md:p-12 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
              The problem with generic answers
            </h2>
            <p className="text-lg text-muted-foreground">
              Vanlifers Google "how do I maintain my Rixens hydronic heating system" and get forum guesses, YouTube rabbit holes, and conflicting advice. They call your support line frustrated. Your team answers the same questions on repeat — on Saturdays.
            </p>
            <p className="text-lg text-muted-foreground">
              Grover solves this by putting your docs directly into the assistant layer so first-party accuracy is always one question away.
            </p>
          </div>

          {/* Value props */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground text-center">
              What you get
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {valueProps.map((prop, index) => {
                const Icon = prop.icon;
                return (
                  <Card key={index} className="p-6 border-border/50 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{prop.title}</h3>
                    <p className="text-muted-foreground">{prop.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* How it works */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground text-center">
              How it works
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {howItWorks.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-12">
            <h2 className="text-2xl font-bold font-heading text-foreground">
              Get your knowledge in front of every Grover user
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We'll walk through what content works best and how to get your KB live quickly.
            </p>
            <Button size="lg" className="text-lg px-8 py-6 mt-4" asChild>
              <a href={HUBSPOT_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                Talk to Partnerships
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground">
              Building vans too?{" "}
              <a href="/for-builders" className="text-primary hover:underline">
                See the Builders programme →
              </a>
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForOems;
