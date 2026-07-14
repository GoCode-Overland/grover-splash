import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CopyBlock, Section, ContentBlock } from "@/components/copy-kit/primitives";
import GroverLinks from "@/components/copy-kit/GroverLinks";
import PrintMaterials from "@/components/copy-kit/PrintMaterials";
import BrandAssets from "@/components/copy-kit/BrandAssets";

const ADMIN_URL = "https://admin.getgrover.ai";

const CopyKit = () => {
  const [brandName, setBrandName] = useState("");
  const bn = brandName.trim() || "[Brand Name]";

  useEffect(() => {
    document.title = "Partner Copy Kit - Grover";
  }, []);

  // ── Email copy ────────────────────────────────────────────────────────────

  const email1Subject = `${bn}'s Circle is live on Grover, and this is your invitation 🗺️`;
  const email1Body = `Hey ${bn} family,

This is the moment we've been building toward.

${bn}'s Circle on Grover is live, and you're one of the first people to know.

Here's what just opened up for you:

🗺️ Your Trophy Map
Drop pins on every spot that means something. That hidden dispersed camp off the highway. The trailhead you've been keeping secret. The hot spring nobody talks about. Your map grows with every adventure, and your fellow ${bn} owners are building theirs right now.

🤖 Your AI Assistant
Not a chatbot. Your van's brain. We've loaded it with your ${bn} manuals, build specs, and years of real shop knowledge. Ask it anything, any time:
• "What's the error code on my heater display?"
• "How long can I run my fridge off solar before I need shore power?"
• "My Webasto is clicking but not igniting. What do I check first?"
• "What's the max payload for my specific build?"

It answers based on YOUR van. And if you need a human, it creates a support ticket automatically so we're already in the loop before you even describe the problem.

🏕️ Your People
${bn}'s Circle isn't just an app. It's a place where people who chose the same rig can actually find each other: share routes, ask questions, drop pins, celebrate wins. We built this because the post-purchase experience shouldn't feel like a handoff. It should feel like a beginning.

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
✅ "I've got 120W of solar input and my batteries are draining. What should I check?"
✅ "What's the max weight rating on my roof rack?"
✅ "Can I run my induction cooktop and air compressor at the same time?"
✅ "My slide-out is binding. Is this a lubrication issue or an alignment issue?"
✅ "How do I winterize my water system for below-zero temps?"
✅ "What fuse controls my shore power input?"

No forums. No waiting until Monday morning. No generic van advice that doesn't match your build.

And if the answer gets complicated, if it's something that needs human eyes, your assistant creates a support ticket automatically. We see the conversation. We already know what's going on before you finish typing.

This is what post-sale support should have been all along.

${bn}'s Circle, ask your first question: [CTA Link]

See you out there,
[Brand Signature]

P.S. The Trophy Map is live too. Your fellow owners are already dropping pins. Start building yours.`;

  const email3Subject = `The best places you've never been, found by people driving your van`;
  const email3Body = `There's a campsite 14 miles past the last paved road. Four ${bn} owners have been there. One of them dropped a pin in the Circle last week.

Now it's on the map.

Inside ${bn}'s Circle on Grover, every owner can drop pins: coordinates, notes, trail conditions, photos. The spots worth remembering, worth sharing, worth returning to. They're being added right now: dispersed camping, trailheads, hot springs, overlooks, remote fuel stops, and the kind of spots that take years of exploring to find.

You don't have to share if you don't want to. Your private pins stay private. But the community map? It's growing into something remarkable: a living guide to everywhere ${bn} owners have actually been, vetted by people who drove the same rig you're driving.

This is your adventure network.

And while you're exploring the map, your AI assistant has your back on the technical side. Something acting up before a big trip? Ask. Want to know your exact battery capacity? Ask. Trying to figure out your off-grid runtime for a five-day stretch? Ask. It knows your build.

The Circle is live. Your spots are waiting.

Join ${bn}'s Circle on Grover: [CTA Link]

Adventure better,
[Brand Signature]

P.S. Pro tip: drop your first pin the moment you arrive somewhere worth remembering. The map builds itself if you let it.`;

  const email4Subject = `The pin that changed our whole trip`;
  const email4Body = `Hey ${bn} family,

Three years ago, a ${bn} owner pulled off a gravel spur she almost skipped. No sign. No promise it led anywhere. It did. A bend in the river, flat ground, not another rig in sight, the kind of golden hour you build a whole trip around.

She dropped a pin. Coordinates, a note about the last quarter-mile, one photo of the water at sunset.

Last month, another ${bn} owner was scrolling the Trophy Map the night before a trip, half-planning, half-hoping. He found her pin. Read her note. Pulled off at the same gravel spur the next afternoon.

He didn't discover that spot. He inherited it.

That's the whole idea behind ${bn}'s Circle: the best day of your trip doesn't have to end when you drive away from it. It turns into a pin. That pin becomes someone else's best day. And somewhere down the road, their pin becomes yours.

Camp confidently, knowing every dot on the map was left by someone who's already been exactly where you're headed.

Drop your first pin (or go find someone else's): [CTA Link]

However far off the pavement you go,
[Brand Signature]

P.S. You don't have to share every pin. Keep the truly sacred ones private. But the next time you find something worth remembering, ask yourself: who else might need this?`;

  const email5Subject = `Adventure with confidence, not guesswork`;
  const email5Body = `Hey ${bn} family,

The scariest part of exploring somewhere new was never the unknown road. It's the not knowing. Will there be a flat spot to park? Is that "primitive campsite" actually reachable in your rig? Did anyone else make it out there and come back smiling, or come back with a story about getting stuck?

${bn}'s Circle answers all three before you ever turn off the highway.

The Trophy Map isn't a list of coordinates. It's confidence, pin by pin: real ${bn} owners marking the spots that worked, with notes on road conditions, best season, rig clearance, and whether it was actually worth the detour.

Adventure with confidence looks like:

🗺️ Scouting your next stop through pins left by people driving your exact rig
🏕️ Knowing before you go: clearance notes, seasonal warnings, honest "worth it" verdicts
🎉 Collecting the joy moments: golden hour on a ridge nobody else found, a fire under more stars than you've ever seen, the trip that almost didn't happen and turned into the best one yet

You don't need a scouting trip before the real trip. You need the Circle.

Start exploring the map: [CTA Link]

Go further, worry less,
[Brand Signature]

P.S. Every pin you drop makes the map, and someone else's next adventure, a little braver.`;

  const email6Subject = `Your crew just got its own map`;
  const email6Body = `Hey ${bn} family,

Some spots are for everyone. The rest are for your people.

That's the idea behind Club Circles, live now inside ${bn}'s Circle on Grover.

Here's how it works. Tap the Circles tab. Create a Circle in under a minute: pick a name, a photo, a description, and your colors. Invite the exact people you want in it. Your rig-specific crew. Your favorite camping buddies. The three people who actually answer your texts at 2 a.m. when you're stuck somewhere.

Once your Circle exists, sharing a pin takes one tap. Find an incredible spot, snap a photo, upload it, and choose which Circle sees it. Not the whole internet. Just your people.

Every Circle has a Grovenor, the person who created it. They can invite members, approve requests, and keep the group running the way it should.

Your Home Circle is still there. Your ${bn} Circle is still there. Club Circles just let you stack as many small, focused communities on top as you want.

Go build the one that fits your crew: [CTA Link]

See you out there,
[Brand Signature]

P.S. Public profiles are live too. Tap anyone's name to see their rig, their stats, and how many pins they've dropped before you invite them into your Circle.`;

  const email7Subject = `Find out who you're really sharing with`;
  const email7Body = `Hey ${bn} family,

Before you invite someone into your Circle, you probably want to know one thing: are they actually your kind of person?

Now you can check.

Every ${bn} owner on Grover has a public profile. Tap any name in a Circle, a feed, or a search result and you'll see their handle, their bio, their rig, how long they've been on Grover, and how many pins and Circles they've racked up.

It's a thirty second read that tells you everything: is this someone who explores the way you do, shares generously, and treats a good spot with respect.

If they look like your people, invite them straight from their profile.

And don't forget your own. Sharpen up your avatar, set your handle, and make sure your rig details are current. Your profile is how the rest of the community finds you.

Explore Circles and profiles: [CTA Link]

Go find your people,
[Brand Signature]`;

  // ── Instagram / social copy ───────────────────────────────────────────────

  const post1 = `You've been keeping your spots to yourself.

That's about to get harder. 🗺️

${bn}'s Circle on Grover has a Trophy Map, and your people are already dropping pins. Dispersed sites. Hidden trailheads. The hot spring three states over that changed everything.

Your spots. Their spots. One growing map.

Join the Circle and start building yours → link in bio

[#BrandHashtag #VanLife #OverlandLife #TrophyMap #GroverApp #AdventureAwaits #SprinterLife #VanBuild]`;

  const post2 = `11 PM. A dirt road in Montana. Your heater throws a code you've never seen.

You could call tomorrow. Or you could ask your van.

${bn}'s AI assistant inside Grover knows YOUR rig, trained on your build specs, your manuals, and years of real shop knowledge. Ask anything. Get answers built for your exact van, not some generic forum post from 2019.

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

${bn}'s AI assistant inside Grover was trained on your specific build: your electrical, your heating, your water system, your suspension setup. Not a generic database. YOUR van.

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

  const post6 = `Golden hour. No cell signal. Everyone you love, all in one place.

That's the moment ${bn}'s Circle was built to hold onto.

Drop a pin on it. Not because you need to remember where you were, but because someone else deserves to find it too.

Your joy moment could be the reason someone else's trip goes right.

${bn}'s Circle on Grover → link in bio 🌅

[#BrandHashtag #VanLife #TrophyMap #JoyMoments #OverlandLife #GroverApp #CampConfidently]`;

  const post7 = `One pin. Three trips. Zero coincidences.

A ${bn} owner found a bend in the river two years ago and dropped a pin. Since then, three more ${bn} families have pulled up to that exact same spot, because someone else already did the scouting.

This is what the Trophy Map actually is: adventure, passed down.

Where will your pin end up?

${bn}'s Circle on Grover → link in bio

[#BrandHashtag #VanLife #TrophyMap #VanLifeCommunity #OverlandLife #GroverApp]`;

  const post8 = `Tag the ${bn} owner who has the best pin on the map. 👇

We know you know one. The person who always finds the spot nobody else can find: the overlook, the hidden hot spring, the campsite with zero cell signal and a five-star sunset.

Give them their flowers in the comments.

Then go drop your own pin. ${bn}'s Circle on Grover, link in bio.

[#BrandHashtag #VanLife #TrophyMap #VanLifeCommunity #GroverApp #CampConfidently]`;

  const post9 = `POV: you're turning onto a dirt road you've never driven, toward a campsite someone else already vetted, in a rig you know inside and out.

That's not luck. That's ${bn}'s Circle.

Adventure with confidence: trail notes, clearance warnings, and honest "absolutely worth it" verdicts from owners who made the trip before you.

Go further. Camp confidently. Find your joy moment.

${bn}'s Circle on Grover → link in bio

[#BrandHashtag #VanLife #OverlandLife #AdventureWithConfidence #GroverApp #VanLifeTips]`;

  const post10 = `Rapid fire: the pins that made our year. 📍📍📍

A cliffside pullout with room for exactly one van. A free hot spring 200 yards off a dirt spur. A campground host who saved someone's whole trip.

All dropped by ${bn} owners. All waiting on the map right now.

Your best pin of the year hasn't happened yet. Go find it.

${bn}'s Circle on Grover → link in bio

[#BrandHashtag #VanLife #TrophyMap #OverlandLife #GroverApp #VanLifeCommunity]`;

  const post11 = `Some spots aren't for everyone. They're for your people.

Club Circles just landed inside ${bn}'s Circle on Grover, and it changes everything about how you share.

Build a Circle for your rig crew, your riding buddies, your family road trip group. Drop a pin, pick the Circle, done. One tap and only your people see it.

Your map. Your rules. Your crew.

Build your first Circle today, ${bn}'s Circle on Grover, link in bio

[#BrandHashtag #VanLife #ClubCircles #VanLifeCommunity #GroverApp #AdventureConfidently]`;

  const post12 = `Somebody has to be the Grovenor.

(Yes, that's a real title. Yes, we're proud of it.)

The Grovenor is whoever creates a Club Circle: they invite the crew, approve who gets in, and keep the map full of good pins and good people.

Tag whoever should be the Grovenor of your next Circle. 👇

${bn}'s Circle on Grover, link in bio

[#BrandHashtag #VanLife #ClubCircles #Grovenor #GroverApp #VanLifeCommunity]`;

  const post13 = `Before you invite someone into your Circle, you probably want the receipts.

Tap their profile. See their rig, their handle, how many pins they've dropped, how many Circles they're already in.

Thirty seconds, and you know exactly who you're sharing your favorite spots with.

Find your people inside ${bn}'s Circle on Grover, link in bio

[#BrandHashtag #VanLife #GroverApp #VanLifeCommunity #ClubCircles]`;

  const post14 = `The story behind pin #142 on our map:

A ${bn} family broke down 40 miles from the nearest town. A stranger from the Circle saw the pin, recognized the road, and drove out with the exact part they needed.

Two hours later, everyone was back on the road. And a new friendship got its own Circle.

This is why we build this thing.

${bn}'s Circle on Grover, link in bio

[#BrandHashtag #VanLife #VanLifeCommunity #ClubCircles #GroverApp #AdventureConfidently]`;

  // ── Reel & Story concepts ─────────────────────────────────────────────────

  const reel1 = `[VISUAL: Screen-record a slow zoom into the Trophy Map, panning across a cluster of pins, landing on one and cutting to real footage of that exact spot.]

CAPTION:
We zoomed into every pin on the ${bn} Trophy Map so you don't have to imagine it.

This is real. This is where your people camp.

${bn}'s Circle on Grover → link in bio

[#BrandHashtag #TrophyMap #VanLife #GroverApp]`;

  const reel2 = `[VISUAL: Stories question sticker: "Best free campsite you've ever found?" Then stitch the replies into a Reel montage over van and landscape b-roll, one answer per clip.]

CAPTION:
We asked ${bn}'s Circle: what's the best free campsite you've ever found?

They didn't hold back. 👇

Add yours in the Circle. ${bn}'s Circle on Grover, link in bio

[#BrandHashtag #VanLife #VanLifeCommunity #GroverApp]`;

  const reel3 = `[VISUAL: Split-screen or quick-cut "before and after." Before: someone squinting at five browser tabs at night. After: someone calmly scrolling clean trail notes on the Trophy Map, then driving off confidently.]

CAPTION:
Before ${bn}'s Circle: refreshing five different forums, hoping someone answers before you lose signal.

After: pulling up trail notes from an owner who drove the exact road, in the exact rig, last month.

Camp confidently. ${bn}'s Circle on Grover → link in bio

[#BrandHashtag #VanLife #CampConfidently #GroverApp #OverlandLife]`;

  // ── Full video scripts (Adventure Confidently format) ────────────────────

  const videoScript1 = `"You found the kind of place you only tell certain people about."
<VISUAL: Drone or wide shot of a van parked at a remote overlook, golden hour>

"So build the Circle for exactly those people."
<VISUAL: Screen recording, tap the "+ Join" chip, tap Create a Circle, type a name like "PNW Dirt Roads," pick a color>

"Drop the pin. Pick the Circle. One tap and it's theirs."
<VISUAL: Screen recording of the pin upload flow, tapping the Circle selector to choose the new custom Circle instead of the main feed>

"Find your Circle, or start your own."
<VISUAL: Scrollable row of Circle chips at the top of the Circles tab>

<VISUAL: Quick cuts of vans on backroads, a campfire, friends laughing>
"Adventure Confidently"
<Grover logo>`;

  const videoScript2 = `"Every good crew needs someone holding the door open."
<VISUAL: Group of friends around a fire, one person checking their phone and smiling>

"That's the Grovenor. Search a name, send an invite, they're in."
<VISUAL: Screen recording of the Manage Circle screen, searching a name in the invite bar, tapping Invite>

"Approve requests. Remove anyone who doesn't fit. Your Circle, your rules."
<VISUAL: Screen recording of the Active Members and Pending Requests tabs on the Manage Circle screen>

"Build the crew. Share the map."
<VISUAL: Flash to the Circle feed filling with new pins>

<VISUAL: Cut to a golden hour van shot, slow pan across a valley>
"Adventure Confidently"
<Grover logo>`;

  const videoScript3 = `"This spot took us four tries and one wrong turn to find."
<VISUAL: Van bumping down a rough dirt road, POV through the windshield>

"So we dropped a pin. Now nobody else has to guess."
<VISUAL: Screen recording of dropping a pin on the Trophy Map, adding a photo and a note>

"Every pin on the map came from someone who's already been there."
<VISUAL: Zoom out on the Trophy Map, panning across a cluster of pins across a region>

"Scout your next trip before you ever leave the driveway."
<VISUAL: Someone on a couch scrolling the map, then cut to them driving the same road>

<VISUAL: Quick montage: campfire, sunrise, a dog jumping out of the van>
"Adventure Confidently"
<Grover logo>`;

  const videoScript4 = `"You want to know who you're sharing your favorite spots with."
<VISUAL: Close-up of someone scrolling a Circle's member list>

"Tap their name. See their rig, their pins, their story."
<VISUAL: Screen recording of tapping an avatar, public profile opening to show bio, rig, and stats>

"If they look like your people, invite them in."
<VISUAL: Screen recording of tapping Invite from the profile screen>

"Your profile is how the community finds you too."
<VISUAL: Flash of the user's own profile screen, handle and rig details visible>

<VISUAL: Cut to a group of vans parked together at a meetup, high fives>
"Adventure Confidently"
<Grover logo>`;

  // ── Website copy ──────────────────────────────────────────────────────────

  const heroHeadline = `Welcome to ${bn}'s Circle`;
  const heroSubheadline = `Your AI expert. Your adventure map. Your community. All built around your ${bn} van.`;
  const heroBody = `We built ${bn}'s Circle on Grover because the relationship between you and your van shouldn't end at delivery. Get instant answers about your specific build, discover vetted routes and campsites from fellow owners, and connect with the community that knows exactly what you drive, and where you want to go.`;
  const heroCTA = `Join the Circle. It's free for all owners.`;

  const aiHeadline = `Your van has a brain. Now you can access it.`;
  const aiBody = `Ask anything about your ${bn} build and get answers trained on your specific manuals, components, and our shop expertise. No generic chatbot. No forum rabbit holes. Just real answers for your exact rig, available 24/7, whether you're in the driveway or deep in the backcountry. If something needs human hands, your assistant creates a support ticket automatically so we're already in the loop before you even finish describing the problem.`;

  const trophyHeadline = `Every great spot deserves to be remembered.`;
  const trophyBody = `The Trophy Map is where your adventures live. Drop pins on dispersed campsites, trailheads, hot springs, and hidden gems. Keep them private or share them with the ${bn} community. Either way, you're building a living record of everywhere your van has taken you, and discovering the spots other ${bn} owners have already found.`;

  const communityHeadline = `${bn}'s people. All in one place.`;
  const communityBody = `${bn}'s Circle connects owners who chose the same rig, hit the same trails, and ask the same questions. Compare builds, share routes, trade recommendations, and tap into years of collective experience. This isn't a comment section. It's your people.`;

  const ctaHeadline = `Your adventure starts the moment you join ${bn}'s Circle.`;
  const ctaBody = `Free for all owners. Download the Grover app, finish onboarding in minutes, and ask your first question. Your van's been waiting to talk.`;

  const copyAll = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* silently fail */
    }
  }, []);

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
              platform, social scheduler, or website editor.
            </p>
          </div>

          {/* Important Grover Links + meeting booking */}
          <GroverLinks />

          {/* Email Campaign */}
          <Section
            title="Email Campaign"
            subtitle="Seven-email nurture series, send over 5–6 weeks after Circle launch"
          >
            <div className="space-y-4">
              <ContentBlock
                title="Email 1: The Invitation"
                note="Send on launch day. Covers all three pillars: AI assistant, Trophy Map, community. High urgency, personal tone."
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
                note="Send 10–14 days after Email 1. Leads with adventure and community, the Trophy Map angle. Best for re-engaging owners who haven't dropped their first pin."
              >
                <CopyBlock label="Subject Line" value={email3Subject} multiLine={false} />
                <CopyBlock label="Email Body" value={email3Body} />
              </ContentBlock>

              <ContentBlock
                title="Email 4: The Story (Non-AI)"
                note="Send around day 18–21. Pure storytelling, no feature list, no AI mention. Built entirely around a pin being passed from one owner to another. Great re-engagement email for owners who've gone quiet."
              >
                <CopyBlock label="Subject Line" value={email4Subject} multiLine={false} />
                <CopyBlock label="Email Body" value={email4Body} />
              </ContentBlock>

              <ContentBlock
                title="Email 5: Camp Confidently (Non-AI)"
                note="Send around day 25–28. Leans hard into the 'adventure with confidence' framing and the Trophy Map as a confidence tool, not just a map. Zero AI mention, pure adventure and joy."
              >
                <CopyBlock label="Subject Line" value={email5Subject} multiLine={false} />
                <CopyBlock label="Email Body" value={email5Body} />
              </ContentBlock>

              <ContentBlock
                title="Email 6: Club Circles Launch"
                note="Send whenever Club Circles goes live for your brand, or day 30–35 in a standard sequence. Introduces custom sharing groups and the Grovenor role. Great for owners who want more privacy than the full brand Circle."
              >
                <CopyBlock label="Subject Line" value={email6Subject} multiLine={false} />
                <CopyBlock label="Email Body" value={email6Body} />
              </ContentBlock>

              <ContentBlock
                title="Email 7: Public Profiles & Finding Your People"
                note="Send a few days after Email 6. Pairs naturally with Club Circles, since owners need to know who they're inviting. Good evergreen email for slow periods between launches."
              >
                <CopyBlock label="Subject Line" value={email7Subject} multiLine={false} />
                <CopyBlock label="Email Body" value={email7Body} />
              </ContentBlock>
            </div>
          </Section>

          {/* Instagram Posts */}
          <Section
            title="Instagram Feed Posts"
            subtitle="14 ready-to-post captions plus 3 Reel/Story concepts: Trophy Map, Club Circles, community, and joy moments"
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
                note="Social proof through real questions. Highly relatable, swap in actual questions your owners have asked for maximum authenticity."
                imageSuggestion="App screenshot showing a real conversation thread, or a van parked under stars with phone in hand"
              >
                <CopyBlock label="Caption" value={post5} />
              </ContentBlock>

              <ContentBlock
                title="Post 6: The Joy Moment (Non-AI)"
                note="Emotion-first, no feature pitch until the last line. Built entirely around capturing and sharing a joy moment. Pairs beautifully with UGC."
                imageSuggestion="Golden hour shot of people around a van, silhouettes at sunset, or a candid laughing moment at camp"
              >
                <CopyBlock label="Caption" value={post6} />
              </ContentBlock>

              <ContentBlock
                title="Post 7: One Pin, Three Trips (Non-AI)"
                note="Storytelling format, a pin passed between owners over time. Great carousel: slide 1 sets the story, slide 2-3 show the spot, slide 4 is the CTA."
                imageSuggestion="Same scenic river/campsite shot from three different trips/seasons, or a single stunning wide shot of a remote pull-off"
              >
                <CopyBlock label="Caption" value={post7} />
              </ContentBlock>

              <ContentBlock
                title="Post 8: Tag Your Best Pin (Non-AI, UGC)"
                note="Pure engagement bait, designed to spike comments and tags. Run this one when you want a boost in reach or want to surface your best community pins for a future repost."
                imageSuggestion="Grid or carousel of 4-6 stunning community-submitted pin photos"
              >
                <CopyBlock label="Caption" value={post8} />
              </ContentBlock>

              <ContentBlock
                title="Post 9: The Confidence POV (Non-AI)"
                note="POV-style hook built for Reels but works as a static caption too. Leans fully into 'adventure with confidence,' zero AI mention."
                imageSuggestion="POV shot from the driver's seat turning onto a dirt road, or a wide shot of a van descending into a valley"
              >
                <CopyBlock label="Caption" value={post9} />
              </ContentBlock>

              <ContentBlock
                title="Post 10: Pins of the Year (Non-AI)"
                note="Rapid-fire listicle format, great as a year-end or season-end recap carousel/Reel. Swap in real community pins for authenticity."
                imageSuggestion="3-panel carousel: cliffside pullout, hot spring, campground host or fellow owner helping out"
              >
                <CopyBlock label="Caption" value={post10} />
              </ContentBlock>

              <ContentBlock
                title="Post 11: Club Circles Launch (Non-AI)"
                note="Announcement post for the Club Circles feature. Lead with this the day custom Circles go live for your brand."
                imageSuggestion="Screenshot of the Circles tab showing multiple custom Circle chips, or a small friend group photo at camp"
              >
                <CopyBlock label="Caption" value={post11} />
              </ContentBlock>

              <ContentBlock
                title="Post 12: The Grovenor Bit (Non-AI)"
                note="Playful, slightly self-aware tone about the Grovenor title. Great engagement post, tag-a-friend format."
                imageSuggestion="Fun graphic or meme-style text card with 'GROVENOR' large and centered, or a candid group photo"
              >
                <CopyBlock label="Caption" value={post12} />
              </ContentBlock>

              <ContentBlock
                title="Post 13: Public Profiles (Non-AI)"
                note="Practical, feature-forward post explaining why public profiles matter before you invite someone. Pairs well with Email 7."
                imageSuggestion="Screenshot of a sample public profile screen (bio, rig, stats)"
              >
                <CopyBlock label="Caption" value={post13} />
              </ContentBlock>

              <ContentBlock
                title="Post 14: The Roadside Rescue Story (Non-AI)"
                note="Full storytelling post, the most emotional piece in the kit. Swap in a real community story if you have one, nothing beats authenticity here."
                imageSuggestion="Two vans parked together on a shoulder, or a photo of hands working on an engine with a sunset behind"
              >
                <CopyBlock label="Caption" value={post14} />
              </ContentBlock>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <h3 className="mb-1 text-base font-semibold text-foreground">Reel & Story Concepts</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Three fully scripted Reel ideas, each includes a shot concept and caption. All non-AI, all built around the Trophy Map and community.
              </p>
              <div className="space-y-4">
                <ContentBlock
                  title="Reel 1: The Zoom-In Reveal"
                  note="Screen recording plus real footage. Cheap to produce, high scroll-stop potential."
                >
                  <CopyBlock label="Concept + Caption" value={reel1} />
                </ContentBlock>

                <ContentBlock
                  title="Reel 2: Ask The Circle"
                  note="Community-sourced content. Costs you almost nothing to produce and proves the community is real and active."
                >
                  <CopyBlock label="Concept + Caption" value={reel2} />
                </ContentBlock>

                <ContentBlock
                  title="Reel 3: Camp Confidently, Before & After"
                  note="The clearest 'adventure with confidence' visual metaphor in the kit. Great as a recurring format, swap the 'before' scenario each time."
                >
                  <CopyBlock label="Concept + Caption" value={reel3} />
                </ContentBlock>
              </div>
            </div>
          </Section>

          {/* Full Video Scripts */}
          <Section
            title="Video Scripts (Adventure Confidently Format)"
            subtitle="Four fully-produced Reel/TikTok scripts in the voiceover-plus-visual-direction format, closing on the Adventure Confidently tagline and logo"
          >
            <div className="space-y-4">
              <ContentBlock
                title="Script 1: Build Your Circle"
                note="Club Circles from the creator's point of view. Great launch-day script. Swap 'PNW Dirt Roads' for a Circle name that fits your brand's community."
              >
                <CopyBlock label="Script" value={videoScript1} />
              </ContentBlock>

              <ContentBlock
                title="Script 2: Meet the Grovenor"
                note="Explains the invite and moderation flow through the Grovenor role. Good second script in a launch sequence, once people already know what a Circle is."
              >
                <CopyBlock label="Script" value={videoScript2} />
              </ContentBlock>

              <ContentBlock
                title="Script 3: The Pin That Saves the Trip"
                note="Pure Trophy Map storytelling, no AI, no Circles mention. Strong evergreen script that works for any brand at any point in the campaign."
              >
                <CopyBlock label="Script" value={videoScript3} />
              </ContentBlock>

              <ContentBlock
                title="Script 4: Know Who You're Sharing With"
                note="Public profiles explained through the lens of vetting someone before an invite. Pairs well with Script 1 or 2 as a follow-up post."
              >
                <CopyBlock label="Script" value={videoScript4} />
              </ContentBlock>
            </div>
          </Section>

          {/* Website Copy */}
          <Section
            title="Website Copy"
            subtitle="Full landing page content: hero, three feature sections, and CTA"
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
                note="Community and belonging angle. Warm and direct, the human side of Grover."
                onCopyAll={() => copyAll(`${communityHeadline}\n\n${communityBody}`)}
              >
                <CopyBlock label="Section Headline" value={communityHeadline} multiLine={false} />
                <CopyBlock label="Body Copy" value={communityBody} />
              </ContentBlock>

              <ContentBlock
                title="CTA / Bottom Section"
                note="Closing CTA block. Keep it action-oriented and low friction: free to join, fast to onboard."
                onCopyAll={() => copyAll(`${ctaHeadline}\n\n${ctaBody}`)}
              >
                <CopyBlock label="Headline" value={ctaHeadline} multiLine={false} />
                <CopyBlock label="Body Copy" value={ctaBody} />
              </ContentBlock>
            </div>
          </Section>

          {/* Physical Marketing Materials */}
          <PrintMaterials />

          {/* Brand Assets */}
          <BrandAssets />

          {/* Partner portal link */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-1 text-xl font-semibold text-primary">Full Partner Portal</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Access the complete interactive kit including custom print orders and additional brand resources in the partner admin.
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
