import { Smartphone, MessageCircle, Map, Heart } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    number: "01",
    title: "Sign Up Free",
    description: "Create your account in seconds. No credit card needed, no complicated setup.",
  },
  {
    icon: MessageCircle,
    number: "02",
    title: "Chat with Grover",
    description: "Ask questions of your personalized digital assistant. Trained on your specific rig. Get maintenance tips, or troubleshoot issues instantly.",
  },
  {
    icon: Map,
    number: "03",
    title: "Discover & Share",
    description: "Effortlessly plan travel, find the best camping spots, share your favorites, and connect with your community circle.",
  },
  {
    icon: Heart,
    number: "04",
    title: "Hit the Road",
    description: "Focus on the adventure while Grover handles the rest.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How Grover Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in minutes and join thousands of adventurers making their journey easier
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative text-center group animate-slide-in-left"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Connecting Line (hidden on mobile, shown on larger screens) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-accent opacity-30" />
                )}
                
                <div className="relative">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon Container */}
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-border/50">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
