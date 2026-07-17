import 'dotenv/config';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import InTheGrover20260717 from './emails/b2b/in-the-grover-2026-07-17.js';

const { RESEND_API_KEY, RESEND_B2B_AUDIENCE_ID, RESEND_FROM, RESEND_B2B_BROADCAST_ID } = process.env;

if (!RESEND_API_KEY || !RESEND_B2B_AUDIENCE_ID || !RESEND_FROM) {
  console.error('Missing required env vars: RESEND_API_KEY, RESEND_B2B_AUDIENCE_ID, RESEND_FROM');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

const html = await render(InTheGrover20260717());
const text = await render(InTheGrover20260717(), { plainText: true });

const payload = {
  audienceId: RESEND_B2B_AUDIENCE_ID,
  from: `Will @ Grover <${RESEND_FROM}>`,
  replyTo: 'will@getgrover.ai',
  subject: 'New tools for what happens after the sale',
  html,
  text,
  name: 'In the Grove - Jul 17, 2026',
};

if (RESEND_B2B_BROADCAST_ID) {
  const { data, error } = await resend.broadcasts.update(RESEND_B2B_BROADCAST_ID, payload);
  if (error) { console.error('Failed to update broadcast:', error); process.exit(1); }
  console.log('Broadcast updated:', RESEND_B2B_BROADCAST_ID);
} else {
  const { data, error } = await resend.broadcasts.create(payload);
  if (error) { console.error('Failed to create broadcast:', error); process.exit(1); }
  console.log('Draft broadcast created:', data?.id);
  console.log(`Add to .env to edit in place: RESEND_B2B_BROADCAST_ID=${data?.id}`);
}

console.log('View in Resend: https://resend.com/broadcasts');
