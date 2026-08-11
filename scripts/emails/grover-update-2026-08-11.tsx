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
              Grover's been using your build details all along. Now there's one place to actually see them.
            </Text>
          </Section>

          <Section style={cardOuterStyle}>
            <div className="box-card" style={cardStyle}>

              {/* The Rig Hub */}
              <Text className="item-title" style={itemTitleStyle}>Tap Rig, get a hub</Text>
              <Img
                src={`${BASE}/img/blog-photos/rig-hub-tiles.jpeg`}
                alt="The Grover Rig Hub screen showing a photo of a black Sprinter van as the rig avatar, the rig name The Skye, and three tiles: Specs, Switch Rig, and a full width Glovebox tile with a Suggested badge"
                width="260"
                style={heroPhotoStyle}
              />
              <Text className="item-body" style={itemBodyStyle}>
                Hit the Rig button in your assistant bar and you don't drop straight into a spec sheet anymore. You land on a hub with three tiles: Specs, Switch Rig, and Glovebox. Everything about your build sits behind one button now. Switch Rig is there for the day your rig changes, and it drops you right back at the hub when you're done.
              </Text>
              <Link href={`${BASE}/blog/grover-rig-hub`} style={readMoreStyle}>Read more →</Link>

              <Hr className="card-divider" style={dividerStyle} />

              {/* Specs */}
              <Text className="item-title" style={itemTitleStyle}>Find out how much of your spec sheet is blank</Text>
              <Text className="item-body" style={itemBodyStyle}>
                You roll up to a parking garage, the clearance sign says 7 feet 2 inches, and you sit there doing math about your fan and your roof rack. Your spec sheet already knows that number, as soon as you put it in. There are 8 sections waiting: Vehicle Details, Dimensions &amp; Capacity, Power System, Water &amp; Plumbing, Climate Control, Kitchen &amp; Living, Exterior &amp; Recovery, and Custom Equipment. The Specs tile keeps a running count of how many you've filled.
              </Text>
              <Text className="item-body" style={itemBodyStyle}>
                Here's the payoff, and it's been true the whole time. The more of those sections you fill in, the more Grover's answers are about your van instead of vans in general. What's new is that you can finally see how much you've actually filled in, which is usually the nudge it takes. Save some custom specs and you can set a custom rig photo too, so the hub looks like your build and not a stock silhouette.
              </Text>
              <Link href={`${BASE}/blog/van-build-specs-what-to-know`} style={readMoreStyle}>Read more →</Link>

              <Hr className="card-divider" style={dividerStyle} />

              {/* Glovebox */}
              <Text className="item-title" style={itemTitleStyle}>The Glovebox, three tiers deep</Text>
              <Img
                src={`${BASE}/img/blog-photos/glovebox-recommendations-selected.jpeg`}
                alt="The Grover Glovebox screen on the Suggested tab, headed Recommendations with the note Not used until you add it, showing four suggested manuals with two of them checkmark-selected and a Confirm button at the bottom"
                width="260"
                style={heroPhotoStyle}
              />
              <Text className="item-body" style={itemBodyStyle}>
                It's 9pm, you're parked somewhere with one bar of signal, and the water pump starts making a noise you've never heard before. Which pump did you install again? The Glovebox is where the documents for your rig live, and it splits into three tiers.
              </Text>
              <Text className="item-body" style={itemBodyStyle}>
                Your Home Circle sets up Rig Knowledge, and that's usually your builder. Those have been feeding your assistant since day one, you just had no way to open them yourself. Recommendations is the genuinely new part. Grover matches your spec sheet against the documents available for your rig, and those suggestions do nothing at all until you pick the ones you want. The ones you say yes to land in Personalized Knowledge. Grover reads your spec sheet here, so the more of it you fill in, the better these suggestions get.
              </Text>
              <Link href={`${BASE}/blog/grover-glovebox-document-recommendations`} style={readMoreStyle}>Read more →</Link>

            </div>
          </Section>

          {/* CTA */}
          <Section style={ctaSectionStyle}>
            <Text className="cta-label" style={ctaLabelStyle}>Go Fill In Your Specs</Text>
            <Text className="item-body" style={{ ...itemBodyStyle, marginBottom: '10px' }}>
              Five minutes on the couch tonight beats guessing at a trailhead on Saturday. Open the app, tap Rig, tap Specs, and put in what you actually built.
            </Text>
            <Link href={`${BASE}/blog/grover-rig-hub`} style={{ ...readMoreStyle, display: 'block', marginBottom: '16px' }}>
              Take the tour first →
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

export default function GroverUpdate20260811() {
  return (
    <Html lang="en">
      <Head>
        <style>{darkMode}</style>
      </Head>
      <Preview>It's been using your build details all along. Now you can see them.</Preview>
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
