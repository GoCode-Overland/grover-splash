import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const IOS_APP_URL = "https://apps.apple.com/us/app/grover-van-life/id6742468326";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: No route for", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <a href="/" className="mb-10">
        <img
          src="/img/grover-combomark-black.svg"
          alt="Grover"
          className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
        />
      </a>

      <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">
        Lost on the road
      </p>
      <h1 className="text-6xl md:text-8xl font-bold font-heading text-foreground mb-4">
        404
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        This spot isn't on the map. Maybe it's time to ask Grover for directions.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg">
          <a href="/">Back to Home</a>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a href={IOS_APP_URL} target="_blank" rel="noopener noreferrer">
            Download Grover
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
