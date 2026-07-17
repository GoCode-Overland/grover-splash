import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Row,
  Column,
} from '@react-email/components';

const BASE = 'https://getgrover.ai';

const darkMode = `
  @media (prefers-color-scheme: dark) {
    .email-bg    { background-color: #1a1008 !important; }
    .email-card  { background-color: #1e1e1e !important; border-top-color: #ee8141 !important; }
    .intro-text  { color: #d4c5a9 !important; }
    .item-title  { color: #f0e6d0 !important; }
    .item-body   { color: #d4c5a9 !important; }
    .box-card    { background-color: #221810 !important; border-color: #3a2a16 !important; }
    .cta-label   { color: #a1876a !important; }
    .caption-text { color: #a1876a !important; }
    .email-footer { background-color: #111c27 !important; }
    .footer-copy  { color: #4a3f2e !important; }
    .footer-link  { color: #4a3f2e !important; }
  }
`;

export function EmailContent({ includeUnsubscribe = true }: { includeUnsubscribe?: boolean }) {
  return (
    <Container className="email-card" style={containerStyle}>

          {/* Header */}
          <Section style={headerStyle}>
            <Text style={wordmarkStyle}>Grover</Text>
            <Text style={headerTagStyle}>Joyride Journal</Text>
          </Section>

          {/* Intro */}
          <Section style={sectionStyle}>
            <Text className="intro-text" style={introStyle}>
              We just got back from Adventure Van Expo in Winter Park, and I am still riding the high. Buckle up. New tools are here!
            </Text>
          </Section>

          {/* Adventure Van Expo recap, boxed with framed photo */}
          <Section className="box-card" style={cardStyle}>
            <Text className="item-title" style={itemTitleStyle}>We had a blast at Adventure Van Expo 🏔️</Text>
            <Text className="item-body" style={itemBodyStyle}>
              Winter Park was incredible. We set up shop for the weekend, met a ton of you in person, and swapped stories with partners and users nonstop. Also in tow: the very first printed prototype of something we're calling <strong>Pinspiration</strong>, a real coffee table book of some of our favorite pins shared in Grover.
            </Text>
            <Img
              src={`${BASE}/img/blog-photos/will-rene-avex-lookbook.jpg`}
              alt="Will and Rene smiling at the Grover booth at Adventure Van Expo, holding open the Pinspiration coffee table book to a page of printed community pins"
              width="260"
              style={heroPhotoStyle}
            />
            <Text className="caption-text" style={captionStyle}>
              Rene found his own pin printed inside Pinspiration and insisted on a photo with Will on the spot. We insisted right back.
            </Text>
            <Text className="item-body" style={itemBodyStyle}>
              Huge shoutout to Rene for making our week. If you flipped through Pinspiration at the booth, you already know how good these pins look on paper. More on that soon.
            </Text>
          </Section>

          {/* Club Circles */}
          <Section className="box-card" style={cardStyle}>
            <Text className="item-title" style={itemTitleStyle}>Share your pins with just your people</Text>
            <Text className="item-body" style={itemBodyStyle}>
              Club Circles are live. Build a Circle for your crew, your rig-specific group, or the three people who actually text back at 2 a.m. when you're stuck somewhere. Find an amazing spot, snap a photo, and pick which Circle sees it. One tap to share it with just the right people, not the whole world. Whoever creates the Circle becomes its Grovenor. They can invite people, approve requests, and keep things running well.
            </Text>
            <Link href={`${BASE}/blog/grover-circles-club-sharing`} style={readMoreStyle}>Read more →</Link>
          </Section>

          {/* Bucket list pin matching */}
          <Section className="box-card" style={cardStyle}>
            <Text className="item-title" style={itemTitleStyle}>Grover catches your bucket list matches</Text>
            <Img
              src={`${BASE}/img/blog-photos/bucket-list-autocompletion.jpeg`}
              alt="Grover's Create a Pin screen showing an automatically detected bucket list match with a one-tap checkbox to mark it visited"
              width="200"
              style={smallPhotoStyle}
            />
            <Text className="item-body" style={itemBodyStyle}>
              Drop a pin within 500 meters of a place on your bucket-list, and Grover notices. A checkbox appears right in the pin creation form, pre-checked and ready to mark that spot visited using the photo you just took. You don't have to remember your own plans anymore. Grover remembers for you.
            </Text>
            <Link href={`${BASE}/blog/grover-bucket-list-pin-matching`} style={readMoreStyle}>Read more →</Link>
          </Section>

          {/* Campflare campgrounds */}
          <Section className="box-card" style={cardStyle}>
            <Text className="item-title" style={itemTitleStyle}>10,000 campgrounds just joined the map</Text>
            <Row>
              <Column style={{ paddingRight: '6px' }}>
                <Img
                  src={`${BASE}/img/blog-photos/campflare-campground-location.jpeg`}
                  alt="Grover map showing pink triangle Campflare campground pins across mountainous terrain, with a preview card for a campground on the Naches River"
                  width="190"
                  style={smallPhotoStyle}
                />
              </Column>
              <Column style={{ paddingLeft: '6px' }}>
                <Img
                  src={`${BASE}/img/blog-photos/campflare-campground-detailed.jpeg`}
                  alt="Detailed Campflare campground card showing an open status badge, description, photos, and an amenities grid"
                  width="190"
                  style={smallPhotoStyle}
                />
              </Column>
            </Row>
            <Text className="item-body" style={itemBodyStyle}>
              Campflare campgrounds now show up as their own pins on the Grover map, over 10,000 of them, right alongside your community spots. Tap one and get a full detail card: open or closed status, price range, amenities, and cell signal strength by carrier. Toggle the layer whenever you're scouting a new stretch of road. Next week, live availability and alerts...
            </Text>
            <Link href={`${BASE}/blog/grover-campflare-campgrounds`} style={readMoreStyle}>Read more →</Link>
          </Section>

          {/* CTAs */}
          <Section style={ctaSectionStyle}>
            <Text className="cta-label" style={ctaLabelStyle}>Get the app</Text>
            <Row>
              <Column style={{ paddingRight: '8px' }}>
                <Link href="https://apps.apple.com/us/app/grover-van-life/id6742468326" style={ctaButtonStyle}>
                  Download on the App Store
                </Link>
              </Column>
              <Column>
                <Link href="https://play.google.com/store/apps/details?id=ai.getgrover.grover_mobile_app" style={ctaOutlineStyle}>
                  Get it on Google Play
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
          <Section className="email-footer" style={footerStyle}>
            <Text className="footer-copy" style={footerTextStyle}>
              You're getting this because you signed up for Grover updates.
              {includeUnsubscribe && (
                <>
                  {' '}
                  <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" className="footer-link" style={footerLinkStyle}>
                    Unsubscribe
                  </Link>
                </>
              )}
            </Text>
            <Text className="footer-copy" style={footerTextStyle}>© 2026 Grover · getgrover.ai</Text>
          </Section>

    </Container>
  );
}

export default function GroverUpdate20260716() {
  return (
    <Html lang="en">
      <Head>
        <style>{darkMode}</style>
      </Head>
      <Preview>Adventure Van Expo, Club Circles, and 2 more fun things shipped.</Preview>
      <Body className="email-bg" style={bodyStyle}>
        <EmailContent />
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#f8e5c1',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  margin: 0,
  padding: '32px 16px',
};

const containerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  borderTop: '4px solid #ee8141',
  margin: '0 auto',
  maxWidth: '560px',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  backgroundColor: '#23496d',
  padding: '28px 40px 22px',
};

const wordmarkStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '800',
  letterSpacing: '-0.5px',
  margin: '0 0 2px',
};

const headerTagStyle: React.CSSProperties = {
  color: '#62aebf',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.1em',
  margin: 0,
  textTransform: 'uppercase',
};

const sectionStyle: React.CSSProperties = {
  padding: '28px 40px 8px',
};

const introStyle: React.CSSProperties = {
  color: '#1e1e1e',
  fontSize: '16px',
  lineHeight: '1.65',
  margin: 0,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fffaf0',
  border: '1.5px solid #e5d5b0',
  borderRadius: '14px',
  margin: '8px 24px',
  padding: '20px 22px 18px',
};

const itemTitleStyle: React.CSSProperties = {
  color: '#000000',
  fontSize: '18px',
  fontWeight: '700',
  letterSpacing: '-0.3px',
  margin: '0 0 12px',
};

const heroPhotoStyle: React.CSSProperties = {
  border: '2px solid #e5d5b0',
  borderRadius: '10px',
  display: 'block',
  margin: '4px auto 8px',
  maxWidth: '260px',
  width: '100%',
};

const smallPhotoStyle: React.CSSProperties = {
  border: '2px solid #e5d5b0',
  borderRadius: '8px',
  display: 'block',
  margin: '0 0 12px',
  maxWidth: '100%',
  width: '100%',
};

const captionStyle: React.CSSProperties = {
  color: '#8a7355',
  fontSize: '13px',
  fontStyle: 'italic',
  lineHeight: '1.5',
  margin: '0 0 16px',
  textAlign: 'center',
};

const itemBodyStyle: React.CSSProperties = {
  color: '#1e1e1e',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 12px',
};

const readMoreStyle: React.CSSProperties = {
  color: '#00a4bd',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
};

const ctaSectionStyle: React.CSSProperties = {
  padding: '20px 40px 28px',
};

const ctaLabelStyle: React.CSSProperties = {
  color: '#7a6a52',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.08em',
  margin: '0 0 14px',
  textTransform: 'uppercase',
};

const ctaButtonStyle: React.CSSProperties = {
  backgroundColor: '#62aebf',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  padding: '11px 24px',
  textDecoration: 'none',
};

const ctaOutlineStyle: React.CSSProperties = {
  border: '1.5px solid #62aebf',
  borderRadius: '6px',
  color: '#62aebf',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  padding: '11px 24px',
  textDecoration: 'none',
};

const footerStyle: React.CSSProperties = {
  backgroundColor: '#23496d',
  padding: '20px 40px',
};

const footerTextStyle: React.CSSProperties = {
  color: '#8fafc2',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0 0 4px',
};

const footerLinkStyle: React.CSSProperties = {
  color: '#8fafc2',
  textDecoration: 'underline',
};
