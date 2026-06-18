import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ADMIN_URL = "https://admin.getgrover.ai";

function CopyBlock({
  label,
  value,
  multiLine = true,
}: {
  label: string;
  value: string;
  multiLine?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silently fail */
    }
  }, [value]);

  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="rounded border border-primary px-2 py-0.5 text-xs text-primary transition-colors hover:bg-primary hover:text-white"
        >
          {copied ? "Copied! ✓" : "Copy"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap rounded-md border-l-4 border-primary bg-white px-4 py-3 font-mono text-sm leading-relaxed text-gray-800">
        {value}
      </pre>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 border-b border-border px-6 py-5 text-left transition-colors hover:bg-muted/40"
      >
        <div>
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="p-6">{children}</div>}
    </div>
  );
}

function ContentBlock({
  title,
  note,
  imageSuggestion,
  children,
  onCopyAll,
}: {
  title: string;
  note?: string;
  imageSuggestion?: string;
  children: React.ReactNode;
  onCopyAll?: () => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <h3 className="mb-1 text-base font-semibold text-foreground">{title}</h3>
      {note && <p className="mb-3 text-sm text-muted-foreground">{note}</p>}
      {children}
      {imageSuggestion && (
        <div className="mb-3 rounded border-l-4 border-primary bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
          <strong>Image suggestion:</strong> {imageSuggestion}
        </div>
      )}
      {onCopyAll && (
        <button
          onClick={onCopyAll}
          className="mt-2 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/80"
        >
          Copy All
        </button>
      )}
    </div>
  );
}

const CopyKit = () => {
  const [brandName, setBrandName] = useState("");
  const bn = brandName.trim() || "[Brand Name]";

  useEffect(() => {
    document.title = "Partner Copy Kit — Grover";
  }, []);

  // ── Email copy ────────────────────────────────────────────────────────────

  const email1Subject = `${bn}'s Circle is live on Grover — this is your invitation 🗺️`;
  const email1Body = `Hey ${bn} family,

This is the moment we've been building toward.

${bn}'s Circle on Grover is live — and you're one of the first people to know.

Here's what just opened up for you:

🗺️ Your Trophy Map
Drop pins on every spot that means something. That hidden dispersed camp off the highway. The trailhead you've been keeping secret. The hot spring nobody talks about. Your map grows with every adventure — and your fellow ${bn} owners are building theirs right now.

🤖 Your AI Assistant
Not a chatbot. Your van's brain. We've loaded it with your ${bn} manuals, build specs, and years of real shop knowledge. Ask it anything — any time:
• "What's the error code on my heater display?"
• "How long can I run my fridge off solar before I need shore power?"
• "My Webasto is clicking but not igniting — what do I check first?"
• "What's the max payload for my specific build?"

It answers based on YOUR van. And if you need a human, it creates a support ticket automatically so we're already in the loop before you even describe the problem.

🏕️ Your People
${bn}'s Circle isn't just an app. It's a place where people who chose the same rig can actually find each other — share routes, ask questions, drop pins, celebrate wins. We built this because the post-purchase experience shouldn't feel like a handoff. It should feel like a beginning.

You're in. Here's your link:
[CTA Link]

We'll see you out there,
[Brand Signature]`;

  const email2Subject = `What happens when your van knows more than the dealer?`;
  const email2Body = `Honest question: when something goes wrong on the road, who's your first call?

For most van owners, the answer is "I start googling and hope for the best." Long threads, generic answers, nothing that actually matches your rig.

Not anymore.

${bn}'s AI assistant inside Grover was trained on your exact van. Your manuals. Your electrical diagrams. Your component specs. Our actual shop knowledge from years of building these rigs.

Which means it can answer the questions that matter:

✅ "Why is my diesel heater throwing code F2 at elevation?"
✅ "How do I manually override my water pump if the switch fails?"
✅ "I've got 120W of solar input and my batteries are draining — what should I check?"
✅ "What's the max weight rating on my roof rack?"
✅ "Can I run my induction cooktop and air compressor at the same time?"
✅ "My slide-out is binding — is this a lubrication issue or an alignment issue?"
✅ "How do I winterize my water system for below-zero temps?"
✅ "What fuse controls my shore power input?"

No forums. No waiting until Monday morning. No generic van advice that doesn't match your build.

And if the answer gets complicated — if it's something that needs human eyes — your assistant creates a support ticket automatically. We see the conversation. We already know what's going on before you finish typing.

This is what post-sale support should have been all along.

${bn}'s Circle → ask your first question: [CTA Link]

See you out there,
[Brand Signature]

P.S. — The Trophy Map is live too. Your fellow owners are already dropping pins. Start building yours.`;

  const email3Subject = `The best places you've never been — found by people driving your van`;
  const email3Body = `There's a campsite 14 miles past the last paved road. Four ${bn} owners have been there. One of them dropped a pin in the Circle last week.

Now it's on the map.

Inside ${bn}'s Circle on Grover, every owner can drop pins — coordinates, notes, trail conditions, photos. The spots worth remembering, worth sharing, worth returning to. They're being added right now: dispersed camping, trailheads, hot springs, overlooks, remote fuel stops, and the kind of spots that take years of exploring to find.

You don't have to share if you don't want to. Your private pins stay private. But the community map? It's growing into something remarkable — a living guide to everywhere ${bn} owners have actually been, vetted by people who drove the same rig you're driving.

This is your adventure network.

And while you're exploring the map, your AI assistant has your back on the technical side. Something acting up before a big trip? Ask. Want to know your exact battery capacity? Ask. Trying to figure out your off-grid runtime for a five-day stretch? Ask. It knows your build.

The Circle is live. Your spots are waiting.

Join ${bn}'s Circle on Grover: [CTA Link]

Adventure better,
[Brand Signature]

P.S. — Pro tip: drop your first pin the moment you arrive somewhere worth remembering. The map builds itself if you let it.`;

  // ── Instagram / social copy ───────────────────────────────────────────────

  const post1 = `You've been keeping your spots to yourself.

That's about to get harder. 🗺️

${bn}'s Circle on Grover has a Trophy Map — and your people are already dropping pins. Dispersed sites. Hidden trailheads. The hot spring three states over that changed everything.

Your spots. Their spots. One growing map.

Join the Circle and start building yours → link in bio

[#BrandHashtag #VanLife #OverlandLife #TrophyMap #GroverApp #AdventureAwaits #SprinterLife #VanBuild]`;

  const post2 = `11 PM. A dirt road in Montana. Your heater throws a code you've never seen.

You could call tomorrow. Or you could ask your van.

${bn}'s AI assistant inside Grover knows YOUR rig — trained on your build specs, your manuals, and years of real shop knowledge. Ask anything. Get answers built for your exact van, not some generic forum post from 2019.

If you actually need us? It creates a support ticket automatically. We're already in the loop.

No waiting. No guessing. Just answers.

Join ${bn}'s Circle → link in bio 🔧

[#BrandHashtag #VanLife #VanBuild #GroverApp #WinterCamping #OverlandLife #VanLifeTips]`;

  const post3 = `Somewhere right now, a ${bn} owner is:

→ Asking their AI assistant why their solar isn't charging
→ Dropping a pin on a campsite that'll blow your mind
→ Getting answers that used to take a Monday morning call

This is ${bn}'s Circle on Grover.

Your community is already here.

Link in bio to join ↓

[#BrandHashtag #VanLife #OverlandLife #GroverApp #VanLifeCommunity #CustomVanBuild]`;

  const post4 = `Your van came with years of expertise baked into every system.

Now that expertise is one question away.

${bn}'s AI assistant inside Grover was trained on your specific build — your electrical, your heating, your water system, your suspension setup. Not a generic database. YOUR van.

Ask it anything. Any time. Any road.

Link in bio → ${bn}'s Circle on Grover

[#BrandHashtag #VanLife #VanBuild #OverlandLife #GroverApp #VanLifeTips #Overlanding]`;

  const post5 = `Real questions ${bn} owners asked their AI assistant this week:

"Why is my diesel heater clicking but not igniting?"
"How many days can I run fully off-grid with my setup?"
"What's the torque spec for my roof rack bolts?"
"Best way to winterize my water lines for sub-zero temps?"
"Can I add a second battery to my current system?"

Every answer: instant. Every answer: trained on YOUR ${bn} build.

${bn}'s Circle on Grover → link in bio

[#BrandHashtag #VanLife #VanLifeTips #GroverApp #OverlandLife #VanBuild]`;

  // ── Website copy ──────────────────────────────────────────────────────────

  const heroHeadline = `Welcome to ${bn}'s Circle`;
  const heroSubheadline = `Your AI expert. Your adventure map. Your community. All built around your ${bn} van.`;
  const heroBody = `We built ${bn}'s Circle on Grover because the relationship between you and your van shouldn't end at delivery. Get instant answers about your specific build, discover vetted routes and campsites from fellow owners, and connect with the community that knows exactly what you drive — and where you want to go.`;
  const heroCTA = `Join the Circle — it's free for all owners.`;

  const aiHeadline = `Your van has a brain. Now you can access it.`;
  const aiBody = `Ask anything about your ${bn} build and get answers trained on your specific manuals, components, and our shop expertise. No generic chatbot. No forum rabbit holes. Just real answers for your exact rig — available 24/7, whether you're in the driveway or deep in the backcountry. If something needs human hands, your assistant creates a support ticket automatically so we're already in the loop before you even finish describing the problem.`;

  const trophyHeadline = `Every great spot deserves to be remembered.`;
  const trophyBody = `The Trophy Map is where your adventures live. Drop pins on dispersed campsites, trailheads, hot springs, and hidden gems — keep them private or share them with the ${bn} community. Either way, you're building a living record of everywhere your van has taken you, and discovering the spots other ${bn} owners have already found.`;

  const communityHeadline = `${bn}'s people. All in one place.`;
  const communityBody = `${bn}'s Circle connects owners who chose the same rig, hit the same trails, and ask the same questions. Compare builds, share routes, trade recommendations, and tap into years of collective experience. This isn't a comment section. It's your people.`;

  const ctaHeadline = `Your adventure starts the moment you join ${bn}'s Circle.`;
  const ctaBody = `Free for all owners. Download the Grover app, finish onboarding in minutes, and ask your first question. Your van's been waiting to talk.`;

  const copyAll = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        /* silently fail */
      }
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 space-y-6 animate-fade-in">

          {/* Hero */}
          <div className="rounded-xl bg-primary px-6 py-10 text-center text-white">
            <h1 className="mb-2 font-heading text-3xl font-bold md:text-4xl">
              Grover Partner Copy Kit
            </h1>
            <p className="text-lg opacity-95">
              Ready-to-use marketing materials for your brand's Circle
            </p>
          </div>

          {/* Sticky brand input */}
          <div className="sticky top-2 z-10 mx-auto max-w-xl rounded-xl border border-border bg-background p-4 shadow-md">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <label htmlFor="brandInput" className="text-sm font-semibold text-muted-foreground">
                Enter your Brand Name:
              </label>
              <input
                id="brandInput"
                type="text"
                placeholder="e.g. GoCode"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="min-w-[200px] rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* How to use */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-primary">How to Use This Kit</h2>
            <p className="text-muted-foreground">
              Type your brand name above and every piece of copy below updates automatically. Hit
              any <strong>Copy</strong> button to grab text and paste directly into your email
              platform, social scheduler, or website editor.{" "}
              <a
                href={`${ADMIN_URL}/partner-marketing`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Full interactive kit (with print materials &amp; brand assets) →
              </a>
            </p>
          </div>

          {/* Email Campaign */}
          <Section
            title="Email Campaign"
            subtitle="Three-email nurture series — send over 2–3 weeks after Circle launch"
          >
            <div className="space-y-4">
              <ContentBlock
                title="Email 1: The Invitation"
                note="Send on launch day. Covers all three pillars — AI assistant, Trophy Map, community. High urgency, personal tone."
              >
                <CopyBlock label="Subject Line" value={email1Subject} multiLine={false} />
                <CopyBlock label="Email Body" value={email1Body} />
              </ContentBlock>

              <ContentBlock
                title="Email 2: The AI Assistant Deep Dive"
                note="Send 5–7 days after Email 1. Focuses on the AI assistant with real-world troubleshooting scenarios. Great for owners who haven't joined yet."
              >
                <CopyBlock label="Subject Line" value={email2Subject} multiLine={false} />
                <CopyBlock label="Email Body" value={email2Body} />
              </ContentBlock>

              <ContentBlock
                title="Email 3: The Trophy Map & Community"
                note="Send 10–14 days after Email 1. Leads with adventure and community — the Trophy Map angle. Best for re-engaging owners who haven't dropped their first pin."
              >
                <CopyBlock label="Subject Line" value={email3Subject} multiLine={false} />
                <CopyBlock label="Email Body" value={email3Body} />
              </ContentBlock>
            </div>
          </Section>

          {/* Instagram Posts */}
          <Section
            title="Instagram Feed Posts"
            subtitle="5 ready-to-post captions covering Trophy Map, AI assistant, community, and owner Q&A angles"
          >
            <div className="space-y-4">
              <ContentBlock
                title="Post 1: The Trophy Map Hook"
                note="Leads with FOMO and curiosity. Ideal for launch week or when Trophy Map is the headline feature."
                imageSuggestion="Screenshot of the Trophy Map with pins, or a van parked at an epic dispersed campsite"
              >
                <CopyBlock label="Caption" value={post1} />
              </ContentBlock>

              <ContentBlock
                title="Post 2: The Midnight Problem Solver"
                note="High-empathy, scenario-driven. Best paired with a moody van interior or night sky image."
                imageSuggestion="Cozy van interior at night, or someone using their phone with the van silhouetted behind them"
              >
                <CopyBlock label="Caption" value={post2} />
              </ContentBlock>

              <ContentBlock
                title="Post 3: The Community Snapshot"
                note="Short, punchy list format. Works great as a Reel cover card or carousel opener."
                imageSuggestion="Group of vans at a meetup, or a split-screen of map + van + app screenshot"
              >
                <CopyBlock label="Caption" value={post3} />
              </ContentBlock>

              <ContentBlock
                title="Post 4: The Expertise Angle"
                note="Emphasizes depth of AI knowledge. Great for audiences who've had bad experiences with generic chatbots. Works well as evergreen."
                imageSuggestion="Close-up of van systems (electrical, solar, wiring), or a clean build photo showing the full rig"
              >
                <CopyBlock label="Caption" value={post4} />
              </ContentBlock>

              <ContentBlock
                title="Post 5: The Real Q&A"
                note="Social proof through real questions. Highly relatable — swap in actual questions your owners have asked for maximum authenticity."
                imageSuggestion="App screenshot showing a real conversation thread, or a van parked under stars with phone in hand"
              >
                <CopyBlock label="Caption" value={post5} />
              </ContentBlock>
            </div>
          </Section>

          {/* Website Copy */}
          <Section
            title="Website Copy"
            subtitle="Full landing page content — hero, three feature sections, and CTA"
          >
            <div className="space-y-4">
              <ContentBlock
                title="Hero Section"
                note="Top of page. Speaks to the full value of the Circle. Pair with a hero image of a van in a stunning location."
                onCopyAll={() => copyAll(`${heroHeadline}\n\n${heroSubheadline}\n\n${heroBody}\n\n${heroCTA}`)}
              >
                <CopyBlock label="Headline" value={heroHeadline} multiLine={false} />
                <CopyBlock label="Subheadline" value={heroSubheadline} multiLine={false} />
                <CopyBlock label="Body Copy" value={heroBody} />
                <CopyBlock label="CTA Button Text" value={heroCTA} multiLine={false} />
              </ContentBlock>

              <ContentBlock
                title="Feature Section 1: AI Assistant"
                note="Emphasize specificity and 24/7 availability. Pair with an app screenshot or conversation mockup."
                onCopyAll={() => copyAll(`${aiHeadline}\n\n${aiBody}`)}
              >
                <CopyBlock label="Section Headline" value={aiHeadline} multiLine={false} />
                <CopyBlock label="Body Copy" value={aiBody} />
              </ContentBlock>

              <ContentBlock
                title="Feature Section 2: Trophy Map"
                note="Adventure-first angle. Pair with a screenshot of the pin map or an aerial van photo."
                onCopyAll={() => copyAll(`${trophyHeadline}\n\n${trophyBody}`)}
              >
                <CopyBlock label="Section Headline" value={trophyHeadline} multiLine={false} />
                <CopyBlock label="Body Copy" value={trophyBody} />
              </ContentBlock>

              <ContentBlock
                title="Feature Section 3: Community"
                note="Community and belonging angle. Warm and direct — the human side of Grover."
                onCopyAll={() => copyAll(`${communityHeadline}\n\n${communityBody}`)}
              >
                <CopyBlock label="Section Headline" value={communityHeadline} multiLine={false} />
                <CopyBlock label="Body Copy" value={communityBody} />
              </ContentBlock>

              <ContentBlock
                title="CTA / Bottom Section"
                note="Closing CTA block. Keep it action-oriented and low-friction — free to join, fast to onboard."
                onCopyAll={() => copyAll(`${ctaHeadline}\n\n${ctaBody}`)}
              >
                <CopyBlock label="Headline" value={ctaHeadline} multiLine={false} />
                <CopyBlock label="Body Copy" value={ctaBody} />
              </ContentBlock>
            </div>
          </Section>

          {/* Brand assets link */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-1 text-xl font-semibold text-primary">Brand Assets &amp; Print Materials</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Download Grover SVG logos and access print-ready collateral (posters, one-sheets, postcards) in the full partner portal.
            </p>
            <a
              href={`${ADMIN_URL}/partner-marketing`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/80"
            >
              Open Partner Portal →
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CopyKit;
