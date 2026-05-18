import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail } from "lucide-react";
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

const ForBrands = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto space-y-16 animate-fade-in">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Partner with Grover
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-bold">
              Join respected brands who partner with Grover to enhance customer outcomes
            </p>
          </div>

          {/* Brands Section */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className="w-full h-24 flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
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

          {/* Analytics Section */}
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Meaningful Customer Insights
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Grover provides comprehensive analytics that help brands understand customer needs, usage patterns, and engagement trends
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="p-6 rounded-lg border border-border bg-card space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Usage Metrics</h3>
                <p className="text-muted-foreground">
                  Track total messages, active sessions, unique users, and engagement rates to measure product adoption
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Conversation Insights</h3>
                <p className="text-muted-foreground">
                  Review actual customer conversations to understand questions, concerns, and support needs
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card space-y-3">
                <h3 className="text-xl font-semibold text-foreground">AI-Powered Topics</h3>
                <p className="text-muted-foreground">
                  Automatically identify top customer concerns ranked by frequency and business impact
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Geographic Data</h3>
                <p className="text-muted-foreground">
                  Visualize where customers are located and identify regional usage patterns
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Trend Analysis</h3>
                <p className="text-muted-foreground">
                  Monitor message activity over time to spot growth trends and seasonal patterns
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Actionable Recommendations</h3>
                <p className="text-muted-foreground">
                  Get AI-generated suggestions to improve customer experience based on actual usage data
                </p>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard Screenshot */}
          <div className="pt-8 space-y-6">
            <div className="rounded-lg overflow-hidden border border-border shadow-lg">
              <img
                src={analyticsDashboard}
                alt="GoCode Analytics Dashboard showing total messages, sessions, unique users, message activity over time, and pin locations map"
                className="w-full h-auto"
              />
            </div>
            
            <div className="rounded-lg overflow-hidden border border-border shadow-lg">
              <img
                src={analyticsTopics}
                alt="Top Topics analysis showing AI-analyzed user concerns including dispersed camping, pin search, vehicle specs, and van systems with detailed insights"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center pt-8">
            <a
              href="mailto:sales@getgrover.ai"
              className="inline-flex items-center gap-3 text-2xl font-semibold text-primary hover:text-primary/80 transition-colors group"
            >
              <Mail className="w-8 h-8 group-hover:scale-110 transition-transform" />
              sales@getgrover.ai
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForBrands;
