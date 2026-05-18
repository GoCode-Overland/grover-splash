import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { BarChart3, MessageSquare, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import vltLogo from "@/assets/brands/vlt.svg";
import gocodeLogo from "@/assets/brands/gocode.svg";
import avcRigLogo from "@/assets/brands/avc-rig.svg";
import vandoitLogo from "@/assets/brands/vandoit.svg";
import cvhqLogo from "@/assets/brands/cvhq.svg";
import tourigLogo from "@/assets/brands/tourig.svg";
import rossmonsterLogo from "@/assets/brands/rossmonster.svg";
import drifterLogo from "@/assets/brands/drifter.svg";
import roverVansLogo from "@/assets/brands/rover-vans.svg";
import vanvanLogo from "@/assets/brands/vanvan.svg";
import moxieLogo from "@/assets/brands/moxie.svg";
import goneMobileLogo from "@/assets/brands/gone-mobile.svg";
import tetravanLogo from "@/assets/brands/tetravan.svg";
import excursionLogo from "@/assets/brands/excursion.svg";
import venturhausLogo from "@/assets/brands/venturhaus.svg";
import rixensLogo from "@/assets/brands/rixens.svg";
import vannaLogo from "@/assets/brands/vanna.svg";
import livemoreLogo from "@/assets/brands/livemore.svg";
import vanQuestLogo from "@/assets/brands/van-quest.svg";
import nookLogo from "@/assets/brands/nook.svg";

const HUBSPOT_BOOKING_URL = "https://meetings.hubspot.com/will858/grover-success-with-josh";

const brands = [
  { name: "VanLife Trail", logo: vltLogo },
  { name: "GoCode", logo: gocodeLogo },
  { name: "AVC Rig", logo: avcRigLogo },
  { name: "Vandoit", logo: vandoitLogo },
  { name: "Camper Van HQ", logo: cvhqLogo },
  { name: "Tourig", logo: tourigLogo },
  { name: "Rossmonster", logo: rossmonsterLogo },
  { name: "Drifter", logo: drifterLogo },
  { name: "Rover Vans", logo: roverVansLogo },
  { name: "VanVan", logo: vanvanLogo },
  { name: "Moxie", logo: moxieLogo },
  { name: "Gone Mobile", logo: goneMobileLogo },
  { name: "Tetravan", logo: tetravanLogo },
  { name: "Excursion", logo: excursionLogo },
  { name: "Venturhaus", logo: venturhausLogo },
  { name: "Rixens", logo: rixensLogo },
  { name: "Vanna", logo: vannaLogo },
  { name: "LiveMore", logo: livemoreLogo },
  { name: "Van Quest", logo: vanQuestLogo },
  { name: "Nook", logo: nookLogo },
];

const insights = [
  {
    icon: BarChart3,
    title: "Usage Metrics",
    description:
      "Track total messages, active sessions, unique users, and engagement rates — understand exactly how customers use their assistant.",
  },
  {
    icon: MessageSquare,
    title: "Conversation Insights",
    description:
      "See the actual questions customers ask so you can improve your build guides, FAQ content, and post-sale support.",
  },
  {
    icon: BookOpen,
    title: "AI-Powered Topics",
    description:
      "Automatically surface the top customer concerns ranked by frequency — no manual analysis needed.",
  },
  {
    icon: Users,
    title: "Branded Community",
    description:
      "Your customers get a branded circle and assistant that speaks your rig language, not a generic van chatbot.",
  },
];

const ForBuilders = () => {
  useEffect(() => {
    if (!document.getElementById("hs-forms-script")) {
      const script = document.createElement("script");
      script.id = "hs-forms-script";
      script.src = "https://js.hsforms.net/forms/embed/48485789.js";
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 space-y-20 animate-fade-in">

          {/* Hero */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold font-heading text-foreground">
              Build with Confidence.{" "}
              <span className="text-primary">Keep Customers Confident.</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Give every customer an AI assistant that knows your build — white-labelled to your brand, powered by your knowledge base, and backed by real usage insights.
            </p>
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <a href={HUBSPOT_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                Book a Demo
              </a>
            </Button>
          </div>

          {/* Partner logo marquee */}
          <div className="space-y-6">
            <h2 className="text-center text-2xl font-semibold text-foreground">
              Trusted by respected van and RV brands
            </h2>
            <div className="overflow-hidden">
              <div className="flex animate-marquee gap-12 w-max">
                {[...brands, ...brands].map((brand, index) => (
                  <div
                    key={index}
                    className="h-16 w-32 flex items-center justify-center shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Value props */}
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">
                What Grover Does for Your Brand
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every feature maps to shipped capabilities in the platform — no vaporware.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {insights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="p-6 border-border/50">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* HubSpot form CTA — skewed yellow card */}
          <div className="relative px-4 md:px-10 pt-16 pb-12 max-w-4xl mx-auto bg-[#f8e5c1] md:bg-transparent rounded-xl">
            {/* Skewed background (desktop only) */}
            <div className="hidden md:block">
              <div className="absolute inset-0 z-[-1] bg-[#f8e5c1] rounded-xl rotate-[-1deg]" />
              <div className="absolute inset-0 z-[-1] rotate-[-0.5deg] scale-[1.02]">
                <svg
                  width="100%" height="100%" viewBox="0 0 546 303" fill="none"
                  xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                  className="rotate-[2deg]"
                >
                  <path
                    d="M62.4495 0.983069C96.9728 3.38532 392.285 11.2907 421.124 11.8169C478.794 12.8779 519.161 13.6139 519.161 13.6139C532.486 13.8542 543.373 28.8348 543.478 47.0712L544.807 269.383C544.919 287.62 534.206 302.202 520.882 301.952C520.882 301.952 480.515 301.216 422.845 300.155C394.013 299.63 360.851 299.018 326.251 298.387C291.737 295.782 255.691 295.196 221.01 296.457C186.304 298.29 153.205 296.22 124.416 294.689C95.5554 294.837 71.07 293.713 53.7737 293.398C36.4706 293.083 26.3791 292.892 26.3791 292.892C13.0542 292.651 2.16691 277.671 2.0618 259.434L0.732737 37.123C0.620878 18.8859 11.3334 4.30374 24.6579 4.55319C24.6579 4.55319 34.7498 4.73491 52.0525 5.05988"
                    stroke="black" strokeMiterlimit="10" vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            </div>

            <div className="text-center mb-8">
              <img
                src="/img/grover-combomark-black.svg"
                alt="Grover"
                className="h-12 md:h-16 mx-auto mb-6"
              />
              <h2 className="text-2xl md:text-3xl font-bold font-heading leading-snug mb-3">
                From one adventurer to another, the journey is better together.
              </h2>
              <p className="text-muted-foreground">Fill this out to see your brand on Grover.</p>
            </div>

            <div
              className="hs-form-frame max-w-2xl mx-auto"
              data-region="na1"
              data-form-id="b9b0c3c9-eaf9-499f-a05a-ab15791be026"
              data-portal-id="48485789"
            />

            <p className="text-center text-sm text-muted-foreground mt-6">
              Component OEM?{" "}
              <a href="/for-oems" className="text-primary hover:underline">
                See the OEM programme →
              </a>
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForBuilders;
