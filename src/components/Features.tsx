import { MessageSquare, MapPin, Bookmark, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquare,
    title: "Rig-Aware AI Assistant",
    description:
      "Chat with an AI that knows your specific van build. Get troubleshooting help, maintenance guidance, and trip recommendations tuned to your rig specs — not a generic van.",
    gradient: "from-primary to-primary/80",
  },
  {
    icon: MapPin,
    title: "Map, Pins & Layers",
    description:
      "Discover community pins across paid, urban, and dispersed camping types. Toggle MVUM road, BLM, and NFS layers. Long-press any spot to save it to your bucket list.",
    gradient: "from-accent to-accent/80",
  },
  {
    icon: Bookmark,
    title: "Bucket List",
    description:
      "Save dream spots with photos, set distance rules, and swipe to manage your list. Your saved places show as yellow pins on the map so you never lose a good spot.",
    gradient: "from-secondary to-secondary/80",
  },
  {
    icon: Users,
    title: "Circles & Community",
    description:
      "See community pins filtered to your circles. Follow fellow vanlifers, browse the pin feed, and share your favorites with builder attribution badges.",
    gradient: "from-primary/80 to-accent/80",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">
            Everything You Need for Vanlife
          </h2>
          <p className="text-lg text-muted-foreground">
            Grover combines rig-specific AI with community wisdom to make your van journey smoother, safer, and more joyful.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card group animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
