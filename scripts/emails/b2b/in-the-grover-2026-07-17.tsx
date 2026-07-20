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
} from '@react-email/components';

const darkMode = `
  @media (prefers-color-scheme: dark) {
    .email-bg    { background-color: #1a1008 !important; }
    .email-card  { background-color: #1e1e1e !important; border-top-color: #ee8141 !important; }
    .intro-text  { color: #d4c5a9 !important; }
    .item-title  { color: #f0e6d0 !important; }
    .item-body   { color: #d4c5a9 !important; }
    .box-card    { background-color: #221810 !important; border-color: #3a2a16 !important; }
    .card-divider { border-color: #3a2a16 !important; }
    .cta-note    { color: #a1876a !important; }
    .email-footer { background-color: #111c27 !important; }
    .footer-copy  { color: #4a3f2e !important; }
    .footer-link  { color: #4a3f2e !important; }
  }
`;

const SUCCESS_CALL_URL = 'https://meetings.hubspot.com/will858/grover-success';

export function EmailContent({ includeUnsubscribe = true }: { includeUnsubscribe?: boolean }) {
  return (
    <Container className="email-card" style={containerStyle}>

      {/* Header */}
      <Section style={headerStyle}>
        <Text style={wordmarkStyle}>Grover</Text>
        <Text style={headerTagStyle}>In the Grove</Text>
      </Section>

      {/* Intro */}
      <Section style={sectionStyle}>
        <Text className="intro-text" style={introStyle}>
          The sale is the start of the relationship, not the end of it. Here's what we've built this week to help you support your customers after they drive off the lot.
        </Text>
      </Section>

      {/* All three updates, one continuous card with dividers instead of separate boxes */}
      <Section style={cardOuterStyle}>
        <div className="box-card" style={cardStyle}>

          {/* Club Circles */}
          <Text className="item-title" style={itemTitleStyle}>Your customers can build their own crew</Text>
          <Text className="item-body" style={itemBodyStyle}>
            Any customer can spin up a Club Circle in Grover, a private or public group built around whatever grouping matters to them. A regional owners group, a trial fleet, a rental cohort, an ambassador crew. They name it, describe it, and invite the right people. Whoever creates it becomes the Grovenor, the owner who manages invites, approves join requests, and keeps the group running well. It's live on iOS today, with Android close behind.
          </Text>

          <Hr className="card-divider" style={dividerStyle} />

          {/* Notification scheduling */}
          <Text className="item-title" style={itemTitleStyle}>Reach your customers on your schedule</Text>
          <Text className="item-body" style={itemBodyStyle}>
            Your dashboard can now schedule notifications straight to your Circle. Send a one-time heads up or set up a recurring cadence, weekly, biweekly, or monthly, and pause or resume it whenever you need to. Target everyone in your Circle or hand-pick the members who should hear it. Prefer not to build it yourself? Just tell our Claude Code integration what you want sent and when, and it'll create and manage the notification for you.
          </Text>

          <Hr className="card-divider" style={dividerStyle} />

          {/* Admin access to chat logs */}
          <Text className="item-title" style={itemTitleStyle}>See what your customers are actually asking</Text>
          <Text className="item-body" style={itemBodyStyle}>
            Your team can get dashboard logins scoped to just your company, at whichever permission level fits (owner, admin, or view-only). From there, read real transcripts between your customers and your AI assistant, filter by date range or by whether a conversation got escalated to a human, and check the auto-generated Top Topics panel to spot what's coming up again and again. No more guessing what support questions are piling up after the sale.
          </Text>

        </div>
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
      <Preview>Circles, scheduled Circle notifications, and real chat logs in your dashboard.</Preview>
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
