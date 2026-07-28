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
  Hr,
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
    .card-divider { border-color: #3a2a16 !important; }
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
              iOS 1.2.9 is out and the backend behind it got a big update too. Here's what actually changed for you.
            </Text>
          </Section>

          <Section style={cardOuterStyle}>
            <div className="box-card" style={cardStyle}>

              {/* Campflare availability */}
              <Text className="item-title" style={itemTitleStyle}>See what's actually available before you go</Text>
              <Img
                src={`${BASE}/img/blog-photos/campflare-availability-calendar.jpeg`}
                alt="Grover app availability calendar for Aspen Point campground, showing days marked available in green, walk-in in orange, and full in red"
                width="260"
                style={heroPhotoStyle}
              />
              <Text className="item-body" style={itemBodyStyle}>
                Tap into any Campflare campground and you'll now see a real availability calendar. Green means open, orange means walk-in only, red means full, weeks out. Most of these campgrounds are run by state parks or the Forest Service, not a single company we can book for you, so we're working on surfacing the actual reservation links next, whether that's Recreation.gov or the park's own site.
              </Text>
              <Link href={`${BASE}/blog/grover-campflare-live-availability`} style={readMoreStyle}>Read more →</Link>

              <Hr className="card-divider" style={dividerStyle} />

              {/* Map search */}
              <Text className="item-title" style={itemTitleStyle}>Search finds your pins first</Text>
              <Img
                src={`${BASE}/img/blog-photos/map-search-results.jpeg`}
                alt="Grover map search results showing a Pins section with the user's own pin and a Places section with Campflare campgrounds"
                width="260"
                style={heroPhotoStyle}
              />
              <Text className="item-body" style={itemBodyStyle}>
                Map search always found towns, addresses, and parks. Now it checks your pins, your Circle's pins, and Grover partner places too, and puts the top 5 matches right at the top of your results, ahead of the usual map results. Type a name wrong and Grover still finds it.
              </Text>
              <Link href={`${BASE}/blog/grover-map-search-app-update`} style={readMoreStyle}>Read more →</Link>

              <Hr className="card-divider" style={dividerStyle} />

              {/* Adventure Together */}
              <Text className="item-title" style={itemTitleStyle}>A community brings years of pins to Grover</Text>
              <Img
                src={`${BASE}/img/blog-photos/adventure-together-cliff-creek-river.jpeg`}
                alt="A woman and two dogs relaxing streamside at Cliff Creek"
                width="260"
                style={heroPhotoStyle}
              />
              <Text className="item-body" style={itemBodyStyle}>
                Marcy and Amy run Adventure Together, a women's van life community built over years on the road. They just started their own Circle on Grover and are bringing years of shared pins with them. If you're already part of that community, download Grover and request to join. Everyone else, the story below has everything you need to start your own.
              </Text>
              <Link href={`${BASE}/blog/grover-adventure-together-circle-story`} style={readMoreStyle}>Read more →</Link>

            </div>
          </Section>

          {/* CTA: start your own circle */}
          <Section style={ctaSectionStyle}>
            <Text className="cta-label" style={ctaLabelStyle}>Start Your Circle</Text>
            <Text className="item-body" style={{ ...itemBodyStyle, marginBottom: '10px' }}>
              You don't need thousands of members. Just a handful of people you actually travel with. A Circle gives your group a shared map, so every good find gets shared with the right people instead of stuck in your camera roll.
            </Text>
            <Link href={`${BASE}/blog/grover-circles-club-sharing`} style={{ ...readMoreStyle, display: 'block', marginBottom: '16px' }}>
              See how Circles work →
            </Link>
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

export default function GroverUpdate20260724() {
  return (
    <Html lang="en">
      <Head>
        <style>{darkMode}</style>
      </Head>
      <Preview>Real campground availability, smarter search, and starting your own Circle.</Preview>
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

const cardOuterStyle: React.CSSProperties = {
  padding: '8px 20px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fffaf0',
  border: '1.5px solid #e5d5b0',
  borderRadius: '14px',
  padding: '18px 20px 16px',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#e5d5b0',
  borderTopWidth: '1px',
  margin: '18px 0',
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
