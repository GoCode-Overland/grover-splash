const showcaseItems = [
  {
    image: "/img/grover p4c5 1.png",
    title: "Discover & Navigate",
    description: "Interactive map with community-shared camping spots and AI-powered suggestions for your rig.",
    highlight: "Smart trip planning at your fingertips",
  },
  {
    image: "/img/grover p4c5 3.jpg",
    title: "Rig-Aware AI Assistant",
    description: "Chat with Grover about your specific van build. Get trip plans, maintenance advice, and gear recommendations.",
    highlight: "Trained on your van's specs",
  },
  {
    image: "/img/grover p4c5 5.jpg",
    title: "Pins, Layers & Bucket List",
    description: "Drop pins, save spots, and explore community-shared locations layered over the map.",
    highlight: "Your van life, your map",
  },
  {
    image: "/img/grover p4c5 7.jpg",
    title: "Circles & Community",
    description: "Connect with your builder's circle and the broader van life community. Share spots and get local intel.",
    highlight: "Built-in community, not an afterthought",
  },
];

const AppShowcase = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">
            See Grover in Action
          </h2>
          <p className="text-lg text-muted-foreground">
            AI-powered planning, community intelligence, and a rig-aware assistant — all in one app.
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
