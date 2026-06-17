import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const IOS_APP_URL = "https://apps.apple.com/us/app/grover-van-life/id6742468326";
const ANDROID_APP_URL = "https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app";
const HUBSPOT_BOOKING_URL = "https://meetings.hubspot.com/will858/grover-discovery-and-demo";
const PARTNER_ADMIN_URL = "https://admin.getgrover.ai";

const navLinks = [
  { label: "For Adventurers", href: "/", external: false },
  { label: "For Builders", href: "/for-builders", external: false },
  { label: "For OEMs", href: "/for-oems", external: false },
  { label: "Blog", href: "/blog/", external: true },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/img/grover-combomark-black.svg"
              alt="Grover"
              className="h-8 w-auto transition-opacity group-hover:opacity-75"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors text-foreground hover:text-primary"
                >
                  {link.label}
                </a>
              ) : (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
              )
            )}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href={PARTNER_ADMIN_URL} target="_blank" rel="noopener noreferrer">
                Partner Admin
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href={HUBSPOT_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                Talk to us
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer">
                Android Beta
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href={IOS_APP_URL} target="_blank" rel="noopener noreferrer">
                Download iOS
              </a>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium transition-colors text-foreground hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
                )
              )}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                <Button size="sm" asChild>
                  <a href={IOS_APP_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    Download for iOS
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    Android Open Beta
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href={HUBSPOT_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    Talk to us
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href={PARTNER_ADMIN_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    Partner Admin
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
