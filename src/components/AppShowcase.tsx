import screenshotMap from "@/assets/screenshot-map-new.png";
import screenshotChat from "@/assets/screenshot-chat.png";
import screenshotPlan from "@/assets/screenshot-plan.png";
import screenshotEnergy from "@/assets/screenshot-energy.png";

const showcaseItems = [
  {
    image: screenshotMap,
    title: "Discover & Navigate",
    description: "Interactive map showing camping spots shared by the community. Get instant answers with AI-powered suggestions.",
    highlight: "Smart trip planning at your fingertips",
  },
  {
    image: screenshotChat,
    title: "Personalized AI Assistant",
    description: "Chat with Grover about your specific van. Get custom trip plans, camping recommendations, and maintenance advice.",
    highlight: "Trained on your van's specs",
  },
  {
    image: screenshotPlan,
    title: "Detailed Trip Intelligence",
    description: "Receive comprehensive plans with weather forecasts, energy management tips, and campground details.",
    highlight: "Everything you need for the journey",
  },
  {
    image: screenshotEnergy,
    title: "Energy Forecasting and Weather Data",
    description: "Advanced battery forecasting, solar yield predictions, and weather impact analysis. Plus, discover hidden gems shared by your community circle.",
    highlight: "Smart power management meets local wisdom",
  },
];

const AppShowcase = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            See Grover in Action
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience how Grover makes vanlife easier with AI-powered planning, community insights, and personalized assistance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {showcaseItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center animate-scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="relative rounded-2xl shadow-2xl border border-border/50 w-full max-w-[280px] hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {item.description}
                </p>
                <p className="text-xs font-semibold text-primary">
                  {item.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
