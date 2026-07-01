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
  Hr,
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
    .email-hr    { border-color: #2e2010 !important; }
    .cta-label   { color: #6b5a3e !important; }
    .callout-bg  { background-color: #0e1f30 !important; }
    .callout-sub { color: #d4c5a9 !important; }
    .email-footer { background-color: #111c27 !important; }
    .footer-copy  { color: #4a3f2e !important; }
    .footer-link  { color: #4a3f2e !important; }
  }
`;

export default function GroverUpdateJune2026() {
  return (
    <Html lang="en">
      <Head>
        <style>{darkMode}</style>
      </Head>
      <Preview>Circles, trophies, LandTrust access, and more from the past few weeks.</Preview>
      <Body className="email-bg" style={bodyStyle}>
        <Container className="email-card" style={containerStyle}>

          {/* Header */}
          <Section style={headerStyle}>
            <Text style={wordmarkStyle}>Grover</Text>
            <Text style={headerTagStyle}>Joyride Journal</Text>
          </Section>

          {/* Intro */}
          <Section style={sectionStyle}>
            <Text className="intro-text" style={introStyle}>
              I've been heads-down. Five things shipped in the last few weeks. Let me walk you through them.
            </Text>
          </Section>

          <Hr className="email-hr" style={hrStyle} />

          {/* Club Circles */}
          <Section style={sectionStyle}>
            <Text className="item-title" style={itemTitleStyle}>Club Circles</Text>
            <Row style={{ marginBottom: '16px' }}>
              <Column style={{ paddingRight: '6px' }}>
                <Img
                  src={`${BASE}/img/blog-photos/Circle_Images/create_a_circle.PNG`}
                  alt="Creating a Circle in Grover"
                  width="224"
                  style={imgStyle}
                />
              </Column>
              <Column style={{ paddingLeft: '6px' }}>
                <Img
                  src={`${BASE}/img/blog-photos/Circle_Images/manage_and_invite_circle.PNG`}
                  alt="Managing and inviting members to a Circle"
                  width="224"
                  style={imgStyle}
                />
              </Column>
            </Row>
            <Text className="item-body" style={itemBodyStyle}>
              People kept asking me: can I share pins with just my crew? Yes. Now you can. Create a Circle for your group, your brand, whoever needs to see your finds. Share in one tap. Your pins only go to them, not the whole map.
            </Text>
            <Link href={`${BASE}/blog/grover-circles-club-sharing`} style={readMoreStyle}>Read more →</Link>
          </Section>

          {/* Brand callout */}
          <Section className="callout-bg" style={calloutStyle}>
            <Text style={calloutTitleStyle}>For brands and organizations</Text>
            <Text className="callout-sub" style={calloutBodyStyle}>
              Running a brand on Grover? I can set your app icon to your Home Circle's logo for your users.{' '}
              <Link href="mailto:will@getgrover.ai" style={calloutLinkStyle}>Email me at will@getgrover.ai</Link>
              {' '}to get set up.
            </Text>
          </Section>

          <Hr className="email-hr" style={hrStyle} />

          {/* Stats & Trophies */}
          <Section style={sectionStyle}>
            <Text className="item-title" style={itemTitleStyle}>Stats & Trophies</Text>
            <Img
              src={`${BASE}/img/blog-photos/IMG_4663.jpg`}
              alt="Grover stats and trophy system"
              width="260"
              style={imgStyleCentered}
            />
            <Text className="item-body" style={itemBodyStyle}>
              I wanted to know how far I'd actually driven. So we built a stats page. Miles traveled, pins created, nights on the road. Plus trophies for the moments that matter: your first dispersed pin, your first bucket list completion, your first pin someone else saved to their map.
            </Text>
            <Link href={`${BASE}/blog/grover-stats-and-trophies`} style={readMoreStyle}>Read more →</Link>
          </Section>

          <Hr className="email-hr" style={hrStyle} />

          {/* LandTrust */}
          <Section style={sectionStyle}>
            <Text className="item-title" style={itemTitleStyle}>LandTrust on the map</Text>
            <Text className="item-body" style={itemBodyStyle}>
              We partnered with LandTrust. Now their private land listings show up right on your Grover map. Toggle the layer, filter by activity, read full property details. No leaving the app to figure out if you're allowed to be somewhere.
            </Text>
            <Link href={`${BASE}/blog/grover-landtrust-places-layer`} style={readMoreStyle}>Read more →</Link>
          </Section>

          <Hr className="email-hr" style={hrStyle} />

          {/* Bucket list */}
          <Section style={sectionStyle}>
            <Text className="item-title" style={itemTitleStyle}>Bucket list to pin creation</Text>
            <Text className="item-body" style={itemBodyStyle}>
              This one closes the loop. Mark a bucket list spot as done and Grover automatically kicks off pin creation. GPS within 500 meters? It converts to a live community pin. The places you find pay forward to everyone else.
            </Text>
            <Link href={`${BASE}/blog/grover-bucket-list-pin-creation`} style={readMoreStyle}>Read more →</Link>
          </Section>

          <Hr className="email-hr" style={hrStyle} />

          {/* Tutorial */}
          <Section style={sectionStyle}>
            <Text className="item-title" style={itemTitleStyle}>In-app tutorial</Text>
            <Text className="item-body" style={itemBodyStyle}>
              If you've ever opened Grover and thought "now what?" — this is for you. We built a six-step tutorial that runs on the real app, in context, as you use it. One spotlight at a time. No simulated screens, no wall of text.
            </Text>
            <Link href={`${BASE}/blog/grover-in-app-tutorial-system`} style={readMoreStyle}>Read more →</Link>
          </Section>

          <Hr className="email-hr" style={hrStyle} />

          {/* CTAs */}
          <Section style={ctaSectionStyle}>
            <Text className="cta-label" style={ctaLabelStyle}>Get the app</Text>
            <Row>
              <Column style={{ paddingRight: '8px' }}>
                <Link href="https://apps.apple.com/us/app/grover-vanlife-co-pilot/id6477892440" style={ctaButtonStyle}>
                  Download on iOS
                </Link>
              </Column>
              <Column>
                <Link href="https://play.google.com/store/apps/details?id=ai.getgrover.android" style={ctaOutlineStyle}>
                  Get it on Android
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
          <Section className="email-footer" style={footerStyle}>
            <Text className="footer-copy" style={footerTextStyle}>
              You're getting this because you signed up for Grover updates.{' '}
              <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" className="footer-link" style={footerLinkStyle}>
                Unsubscribe
              </Link>
            </Text>
            <Text className="footer-copy" style={footerTextStyle}>© 2026 Grover · getgrover.ai</Text>
          </Section>

        </Container>
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
  padding: '28px 40px',
};

const introStyle: React.CSSProperties = {
  color: '#1e1e1e',
  fontSize: '16px',
  lineHeight: '1.65',
  margin: 0,
};

const itemTitleStyle: React.CSSProperties = {
  color: '#000000',
  fontSize: '18px',
  fontWeight: '700',
  letterSpacing: '-0.3px',
  margin: '0 0 14px',
};

const imgStyle: React.CSSProperties = {
  borderRadius: '8px',
  display: 'block',
  maxWidth: '100%',
};

const imgStyleCentered: React.CSSProperties = {
  borderRadius: '8px',
  display: 'block',
  margin: '0 auto 16px',
  maxWidth: '100%',
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

const hrStyle: React.CSSProperties = {
  borderColor: '#e5d5b0',
  borderTopWidth: '1px',
  margin: '0 40px',
};

const calloutStyle: React.CSSProperties = {
  backgroundColor: '#23496d',
  borderLeft: '3px solid #ee8141',
  borderRadius: '0 6px 6px 0',
  margin: '0 40px 28px',
  padding: '16px 20px',
};

const calloutTitleStyle: React.CSSProperties = {
  color: '#f8e5c1',
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '0.06em',
  margin: '0 0 6px',
  textTransform: 'uppercase',
};

const calloutBodyStyle: React.CSSProperties = {
  color: '#b8cdd9',
  fontSize: '13px',
  lineHeight: '1.65',
  margin: 0,
};

const calloutLinkStyle: React.CSSProperties = {
  color: '#62aebf',
  fontWeight: '600',
  textDecoration: 'none',
};

const ctaSectionStyle: React.CSSProperties = {
  padding: '28px 40px',
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
