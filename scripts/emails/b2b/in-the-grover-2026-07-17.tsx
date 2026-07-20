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
    .eyebrow     { color: #a1876a !important; }
    .callout-sub { color: #b9d1da !important; }
    .resource-line { color: #d4c5a9 !important; }
    .cta-note    { color: #a1876a !important; }
    .email-footer { background-color: #111c27 !important; }
    .footer-copy  { color: #4a3f2e !important; }
    .footer-link  { color: #4a3f2e !important; }
  }
`;

const SUCCESS_CALL_URL = 'https://meetings.hubspot.com/will858/grover-success';
const ADMIN_URL = 'https://admin.getgrover.ai';
const PARTNER_RESOURCES_URL = 'https://getgrover.ai/partners/copy-kit/';

export function EmailContent({ includeUnsubscribe = true }: { includeUnsubscribe?: boolean }) {
  return (
    <Container className="email-card" style={containerStyle}>

      {/* Header */}
      <Section style={headerStyle}>
        <Text style={wordmarkStyle}>Grover</Text>
        <Text style={headerTagStyle}>In the Grove</Text>
      </Section>

      {/* Intro, with a small eyebrow explaining what this newsletter is */}
      <Section style={sectionStyle}>
        <Text className="eyebrow" style={eyebrowStyle}>Product updates for Grover partners</Text>
        <Text className="intro-text" style={introStyle}>
          The sale is where the relationship starts, not where it ends. Here's what we shipped this week to help you take care of your people after they drive off the lot.
        </Text>
      </Section>

      {/* First update, its own card */}
      <Section style={cardOuterStyle}>
        <div className="box-card" style={cardStyle}>

          {/* Club Circles */}
          <Text className="item-title" style={itemTitleStyle}>Your customers are already finding each other</Text>
          <Text className="item-body" style={itemBodyStyle}>
            Any customer can start a Club Circle in Grover, a group built around whatever matters to them: a regional owners group, a trial fleet, a rental cohort, an ambassador crew, whatever fits. They name it and run it. Whoever starts it becomes the Grovenor, the person who invites members, approves join requests, and keeps things friendly. That's a place for your customers to swap tips and troubleshoot with each other, before they ever have to call you. Live on iOS today, Android close behind.
          </Text>

        </div>
      </Section>

      {/* Admin dashboard callout */}
      <Section style={cardOuterStyle}>
        <div style={calloutStyle}>
          <Text style={calloutTitleStyle}>Take a look inside your dashboard</Text>
          <Img
            src={`${BASE}/img/blog-photos/grover-admin-dashboard-knowledge-bases.png`}
            alt="Grover admin dashboard showing a company's Knowledge Bases, with a left navigation listing Users, Assistants, Knowledge Bases, FAQs, Sessions, Circles, Lookbook, and Notifications"
            width="480"
            style={calloutImageStyle}
          />
          <Text className="callout-sub" style={calloutSubStyle}>
            This is what it looks like day to day, your knowledge bases, assistants, notifications, and customer sessions, all in one place at{' '}
            <Link href={ADMIN_URL} style={calloutLinkStyle}>admin.getgrover.ai</Link>. If your team doesn't have a login yet, I'll set one up myself, just email me at{' '}
            <Link href="mailto:will@getgrover.ai" style={calloutLinkStyle}>will@getgrover.ai</Link> and I'll get you going.
          </Text>
          <Text className="callout-sub" style={calloutSignatureStyle}>
            — Will, Co-Founder
          </Text>
        </div>
      </Section>

      {/* Remaining updates, their own card */}
      <Section style={cardOuterStyle}>
        <div className="box-card" style={cardStyle}>

          {/* Notification scheduling */}
          <Text className="item-title" style={itemTitleStyle}>Check in without lifting a finger every time</Text>
          <Text className="item-body" style={itemBodyStyle}>
            Set up a notification once, weekly, biweekly, or monthly, and your dashboard handles the rest. Pause it, resume it, or send a one-time heads up whenever something comes up. Send it to your whole Circle or just the people it's actually for. Would rather not touch the dashboard at all? Tell our Claude Code integration what you want said and when, it'll build and manage the notification for you.
          </Text>

          <Hr className="card-divider" style={dividerStyle} />

          {/* Admin access to chat logs */}
          <Text className="item-title" style={itemTitleStyle}>Stop guessing what your customers are stuck on</Text>
          <Text className="item-body" style={itemBodyStyle}>
            Get your team a login scoped to just your company, whatever access level makes sense (owner, admin, or a view-only look-around). From there, read real conversations between your customers and your AI assistant, see which ones got escalated to a human, and check the auto-generated Top Topics panel to catch a pattern before it turns into a pile of angry calls.
          </Text>

        </div>
      </Section>

      {/* Partner marketing resources */}
      <Section style={resourceSectionStyle}>
        <Text className="resource-line" style={resourceLineStyle}>
          Want ready-made copy to tell your customers about Grover? Check out our{' '}
          <Link href={PARTNER_RESOURCES_URL} style={resourceLinkStyle}>partner marketing resources →</Link>
        </Text>
      </Section>

      {/* CTA */}
      <Section style={ctaSectionStyle}>
        <Link href={SUCCESS_CALL_URL} style={ctaButtonStyle}>
          Schedule a Success Call
        </Link>
        <Text className="cta-note" style={ctaNoteStyle}>
          Takes a couple minutes. Grab whatever slot works and we'll walk through what's new for your team.
        </Text>
      </Section>

      {/* Footer */}
      <Section className="email-footer" style={footerStyle}>
        <Text className="footer-copy" style={footerTextStyle}>
          You're getting this because you're a Grover partner.
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

export default function InTheGrover20260717() {
  return (
    <Html lang="en">
      <Head>
        <style>{darkMode}</style>
      </Head>
      <Preview>Circles, scheduled check-ins, and real chat logs, all from your dashboard.</Preview>
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

const itemBodyStyle: React.CSSProperties = {
  color: '#1e1e1e',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 12px',
};

const eyebrowStyle: React.CSSProperties = {
  color: '#7a6a52',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  margin: '0 0 8px',
  textTransform: 'uppercase',
};

const calloutStyle: React.CSSProperties = {
  backgroundColor: '#23496d',
  border: '1.5px solid #62aebf',
  borderRadius: '14px',
  padding: '20px 22px 18px',
};

const calloutTitleStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '17px',
  fontWeight: '700',
  letterSpacing: '-0.2px',
  margin: '0 0 14px',
};

const calloutImageStyle: React.CSSProperties = {
  border: '1.5px solid #3a648a',
  borderRadius: '8px',
  display: 'block',
  margin: '0 auto 14px',
  maxWidth: '100%',
  width: '100%',
};

const calloutSubStyle: React.CSSProperties = {
  color: '#cfe3ea',
  fontSize: '14px',
  lineHeight: '1.65',
  margin: '0 0 10px',
};

const calloutSignatureStyle: React.CSSProperties = {
  color: '#8fafc2',
  fontSize: '13px',
  fontStyle: 'italic',
  margin: 0,
};

const calloutLinkStyle: React.CSSProperties = {
  color: '#8fe0f0',
  fontWeight: '600',
  textDecoration: 'underline',
};

const resourceSectionStyle: React.CSSProperties = {
  padding: '4px 40px 0',
  textAlign: 'center',
};

const resourceLineStyle: React.CSSProperties = {
  color: '#4a3f2e',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
};

const resourceLinkStyle: React.CSSProperties = {
  color: '#00a4bd',
  fontWeight: '600',
  textDecoration: 'none',
};

const ctaSectionStyle: React.CSSProperties = {
  padding: '20px 40px 28px',
  textAlign: 'center',
};

const ctaButtonStyle: React.CSSProperties = {
  backgroundColor: '#62aebf',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  padding: '13px 32px',
  textDecoration: 'none',
};

const ctaNoteStyle: React.CSSProperties = {
  color: '#7a6a52',
  fontSize: '13px',
  margin: '12px 0 0',
  textAlign: 'center',
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
