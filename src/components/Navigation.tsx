import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Grover Logo" className="h-10 w-auto transition-opacity group-hover:opacity-80" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-foreground hover:text-primary transition-colors font-medium">
              Features
            </a>
            <a href="/#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
              How It Works
            </a>
            <a href="/#community" className="text-foreground hover:text-primary transition-colors font-medium">
              Community
            </a>
            <a href="https://getgrover.ai/blog/" className="text-foreground hover:text-primary transition-colors font-medium">
              Blog
            </a>
            <a href="/for-brands" className="text-foreground hover:text-primary transition-colors font-medium">
              For Brands
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost">Sign In</Button>
            <Button variant="default">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="/#features" className="text-foreground hover:text-primary transition-colors font-medium">
                Features
              </a>
              <a href="/#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
                How It Works
              </a>
              <a href="/#community" className="text-foreground hover:text-primary transition-colors font-medium">
                Community
              </a>
              <a href="https://getgrover.ai/blog/" className="text-foreground hover:text-primary transition-colors font-medium">
                Blog
              </a>
              <a href="/for-brands" className="text-foreground hover:text-primary transition-colors font-medium">
                For Brands
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="ghost" className="w-full">Sign In</Button>
                <Button variant="default" className="w-full">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
