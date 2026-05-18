import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Leah",
    role: "Brand Partner",
    content: "I saw the support ticket on Saturday and tears almost came to my eye because I realized I may never have to answer a support question on a Saturday ever again",
    avatar: "L",
  },
  {
    name: "Jake T.",
    role: "Weekend Warrior",
    content: "The camping spot recommendations are incredible. Found hidden gems I would have never discovered on my own.",
    avatar: "JT",
  },
  {
    name: "Emily R.",
    role: "Rig Builder",
    content: "This is the kind of stuff I was dreaming about and you actually went out and built it",
    avatar: "ER",
  },
];

const Community = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Loved by Adventurers and RV Builders Alike
          </h2>
          <p className="text-lg text-muted-foreground">
            Join a community that's making the adventure better, one trip at a time
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 bg-card relative animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Quote className="w-10 h-10 text-accent/20 absolute top-4 right-4" />
              <div className="relative">
                <p className="text-card-foreground mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in">
          {[
            { number: "Thousands", label: "Active Users" },
            { number: ">1.5M", label: "Dispersed Spots Accessible" },
            { number: "500K+", label: "Questions Answered" },
            { number: "4.9/5", label: "User Rating" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">{stat.number}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Community;
