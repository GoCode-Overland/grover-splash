import { MessageSquare, MapPin, Users, Compass } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquare,
    title: "AI Van Assistant",
    description: "Chat with your van and solve problems on the road. Get instant answers to common van troubles anytime, anywhere.",
    gradient: "from-primary to-primary/80",
  },
  {
    icon: MapPin,
    title: "Share Pins & Places",
    description: "When you find that perfect spot, share it with the community. Discover hidden gems from fellow vanlifers.",
    gradient: "from-accent to-accent/80",
  },
  {
    icon: Users,
    title: "Vanlife Community",
    description: "Connect and share beta with your circle",
    gradient: "from-secondary to-secondary/80",
  },
  {
    icon: Compass,
    title: "AI Powered Travel Planning",
    description: "Plan epic trips with natural language. Access 1+ million dispersed spots, real-time park availability, and community favorites.",
    gradient: "from-primary/80 to-accent/80",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need for Vanlife
          </h2>
          <p className="text-lg text-muted-foreground">
            Grover combines AI technology with community wisdom to make your van journey smoother, safer, and more joyful.
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
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
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
