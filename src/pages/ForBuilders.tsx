import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, MessageSquare, Users, BookOpen } from "lucide-react";
import analyticsDashboard from "@/assets/analytics-dashboard.png";
import analyticsTopics from "@/assets/analytics-topics.png";
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
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto space-y-20 animate-fade-in">

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

          {/* Partner logo grid */}
          <div className="space-y-6">
            <h2 className="text-center text-2xl font-semibold text-foreground">
              Trusted by respected van and RV brands
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center justify-items-center">
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className="w-full h-20 flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                >
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
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

          {/* Dashboard screenshots */}
          <div className="space-y-6">
            <h2 className="text-center text-2xl font-semibold text-foreground">
              Your Dashboard
            </h2>
            <div className="space-y-6">
              <div className="rounded-xl overflow-hidden border border-border shadow-lg">
                <img
                  src={analyticsDashboard}
                  alt="Grover partner dashboard showing total messages, sessions, unique users, message activity over time, and pin locations"
                  className="w-full h-auto"
                />
              </div>
              <div className="rounded-xl overflow-hidden border border-border shadow-lg">
                <img
                  src={analyticsTopics}
                  alt="Grover top topics analysis showing AI-surfaced customer concerns with frequency and impact"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Ready to get started?</h2>
            <p className="text-muted-foreground">
              Book a 30-minute call and we'll walk through what a Grover integration looks like for your brand.
            </p>
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <a href={HUBSPOT_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                Book a Demo
              </a>
            </Button>
            <p className="text-sm text-muted-foreground pt-2">
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
