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
    .cta-note    { color: #a1876a !important; }
    .email-footer { background-color: #111c27 !important; }
    .footer-copy  { color: #4a3f2e !important; }
    .footer-link  { color: #4a3f2e !important; }
  }
`;

const SUCCESS_CALL_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3ldSy_AEw42s-B6jkxp4B8fUxvEZqEy3hEl8987tGJVJU5ldW9OHsAkX1JHtP2EUbvYHX7Z5vr';
const ADMIN_URL = 'https://admin.getgrover.ai';
const MARKETPLACE_URL = 'https://github.com/gocode-overland/grover-claude-marketplace';

export function EmailContent({ includeUnsubscribe = true }: { includeUnsubscribe?: boolean }) {
  return (
    <Container className="email-card" style={containerStyle}>

      {/* Header */}
      <Section style={headerStyle}>
        <Text style={wordmarkStyle}>Grover</Text>
        <Text style={headerTagStyle}>In the Grove</Text>
      </Section>

      {/* Masthead: what this newsletter is */}
      <Section style={sectionStyle}>
        <div style={mastheadStyle}>
          <Text style={mastheadLabelStyle}>What is In the Grove?</Text>
          <Text style={mastheadBodyStyle}>
            Product updates and details for Grover's partners and customers, straight from the team building them.
          </Text>
        </div>
      </Section>

      {/* Intro */}
      <Section style={sectionStyle}>
        <Text className="intro-text" style={introStyle}>
          A few things this week, starting with the big one. Your customers can finally see the documents you set up for them.
        </Text>
      </Section>

      {/* Item 1: Rig Hub / Rig Knowledge */}
      <Section style={cardOuterStyle}>
        <div className="box-card" style={cardStyle}>

          <Text className="item-title" style={itemTitleStyle}>
            Your customers can finally see what you set up
          </Text>
          <Text className="item-body" style={itemBodyStyle}>
            The documents you set up have been answering your customers' questions this whole time.
            Your customer just had no way to see it. Unless a source happened to surface in a chat
            reply, they had no idea what their assistant was working from. That changed. There's a new
            destination in the app called the Rig Hub, where your customer finds their spec sheet and
            their documents in one place. Documents live in the Glovebox there, and the first tier of
            it is Rig Knowledge, labelled in the app as "Set up by your Home Circle." That's you, with
            your name on it, where they can see it. I love this one.
          </Text>
          <Img
            src={`${BASE}/img/blog-photos/glovebox-rig-knowledge.jpeg`}
            alt="The Glovebox screen in the Grover app showing the Rig Knowledge tab with the subtitle Set up by your Home Circle, above a list of manuals each labelled with the knowledge base they came from"
            width="260"
            style={portraitImageStyle}
          />
          <Text className="item-body" style={itemBodyStyle}>
            The mechanism has not changed, and there's nothing new for you to do. Upload a document
            to a knowledge base in{' '}
            <Link href={ADMIN_URL} style={inlineLinkStyle}>admin.getgrover.ai</Link>, link that
            knowledge base to your rig assistant, and it shows up for every customer on that rig. No
            acceptance step on their end, no matching, no waiting on us. Two practical notes: upload
            runs one file at a time, and a document needs to finish processing before your customer
            can open it.
          </Text>

        </div>
      </Section>

      {/* Item 2: rig template */}
      <Section style={cardOuterStyle}>
        <div className="box-card" style={cardStyle}>

          <Text className="item-title" style={itemTitleStyle}>
            Your rig template is what the app falls back to
          </Text>
          <Text className="item-body" style={itemBodyStyle}>
            A customer who has not customized their own spec sheet sees yours. The rig template is
            the default spec sheet behind each of your rig assistants, 56 fields across 7 sections,
            editable in your dashboard by company owners. Get your template right and every customer
            starts out looking at accurate numbers for the rig you actually sold them instead of
            blanks. Admins on your team can also open an individual customer's rig spec sheet and
            edit it when that customer needs a hand.
          </Text>
          <Text className="item-body" style={itemBodyStyle}>
            One honest note so nobody gets surprised. Editing a template, or editing one customer's
            spec, does not redo that customer's document recommendations right then. Those catch up
            on an overnight job, or sooner if the customer edits their own specs in the app.
          </Text>

        </div>
      </Section>

      {/* Item 3: MCP rig tools */}
      <Section style={cardOuterStyle}>
        <div className="box-card" style={cardStyle}>

          <Text className="item-title" style={itemTitleStyle}>
            Drive it from Claude Code instead, if you'd rather
          </Text>
          <Text className="item-body" style={itemBodyStyle}>
            If your team already works in Claude Code, the rig tools are there too. get_rig_template,
            update_rig_template, get_rig_spec, and update_rig_spec all run over Grover's connector for
            partners with the right role, not just for our team. Setup takes a couple of commands.
          </Text>
          <Link href={MARKETPLACE_URL} style={readMoreStyle}>Setup instructions →</Link>

        </div>
      </Section>

      {/* Item 4: app name change */}
      <Section style={cardOuterStyle}>
        <div className="box-card" style={cardStyle}>

          <Text className="item-title" style={itemTitleStyle}>
            The app's name now matches who you build for
          </Text>
          <Text className="item-body" style={itemBodyStyle}>
            Grover is listed as Grover: Camping and Community now, with a new rig logo, and the van
            silhouette is out of the interface. Nothing changes on your end. What changes is that a
            customer who bought a truck camper or a Class C from you no longer opens an app that looks
            like it was built for somebody else's product.
          </Text>
          <Text className="item-body" style={itemBodyStyle}>
            This was the plan from the beginning, and the owners on Grover already reflect it. Class C
            and Class B coaches, truck campers on Tacomas and F-250s, pickups, SUVs, a towable, and a
            shuttle bus. Vans are still the bulk of it and always will be. They were never the whole
            list. Your rig template and the spec sheet behind it have never cared what the chassis is,
            so fill in the fields that apply to what you actually build and leave the rest alone. The
            more of it you fill in, the more your customer's answers are about the rig you sold them
            instead of rigs in general.
          </Text>

        </div>
      </Section>

      {/* CTA */}
      <Section style={ctaSectionStyle}>
        <Link href={SUCCESS_CALL_URL} style={ctaButtonStyle}>
          Schedule a Success Call
        </Link>
        <Text className="cta-note" style={ctaNoteStyle}>
          Takes a couple minutes. Grab whatever slot works and we'll go through your knowledge bases
          and your rig template together.
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

export default function InTheGrover20260812() {
  return (
    <Html lang="en">
      <Head>
        <style>{darkMode}</style>
      </Head>
      <Preview>Your docs were always answering their questions. Now they can see whose they are.</Preview>
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

const portraitImageStyle: React.CSSProperties = {
  border: '1.5px solid #e5d5b0',
  borderRadius: '8px',
  display: 'block',
  margin: '0 auto 14px',
  maxWidth: '260px',
  width: '100%',
};

const inlineLinkStyle: React.CSSProperties = {
  color: '#00a4bd',
  fontWeight: '600',
  textDecoration: 'underline',
};

const readMoreStyle: React.CSSProperties = {
  color: '#00a4bd',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
};

const mastheadStyle: React.CSSProperties = {
  backgroundColor: '#23496d',
  borderLeft: '4px solid #ee8141',
  borderRadius: '8px',
  padding: '14px 18px',
};

const mastheadLabelStyle: React.CSSProperties = {
  color: '#ee8141',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  margin: '0 0 6px',
  textTransform: 'uppercase',
};

const mastheadBodyStyle: React.CSSProperties = {
  color: '#f1f5f9',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
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
