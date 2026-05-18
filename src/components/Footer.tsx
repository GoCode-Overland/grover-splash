const HUBSPOT_BOOKING_URL = "https://meetings.hubspot.com/will858/grover-discovery-and-demo";
const INSTAGRAM_URL = "https://www.instagram.com/getgrover.ai";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <img
              src="/img/grover-combomark-white.svg"
              alt="Grover"
              className="h-10 w-auto"
            />
            <p className="text-background/70 text-sm">
              Your rig-aware AI companion for the ultimate adventure.
            </p>
          </div>

          {/* For You */}
          <div>
            <h3 className="font-semibold mb-4">For You</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="https://apps.apple.com/us/app/grover-van-life/id6742468326" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  Download for iOS
                </a>
              </li>
              <li>
                <a href="https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  Android Beta
                </a>
              </li>
              <li>
                <a href="/blog/" className="hover:text-accent transition-colors">Blog</a>
              </li>
              <li>
                <a href="/tutorials.html" className="hover:text-accent transition-colors">Tutorials</a>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h3 className="font-semibold mb-4">For Partners</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="/for-builders" className="hover:text-accent transition-colors">For Builders</a>
              </li>
              <li>
                <a href="/for-oems" className="hover:text-accent transition-colors">For OEMs</a>
              </li>
              <li>
                <a href="/partner-marketing" className="hover:text-accent transition-colors">Partner Resources</a>
              </li>
              <li>
                <a href={HUBSPOT_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  Book a Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="/terms/" className="hover:text-accent transition-colors">Terms</a>
              </li>
              <li>
                <a href="/pages/account-delete/" className="hover:text-accent transition-colors">Delete Account</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
          <p>© {currentYear} grover. All rights reserved.</p>
          <div className="flex gap-6">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
