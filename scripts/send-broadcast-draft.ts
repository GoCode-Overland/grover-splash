import 'dotenv/config';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import GroverUpdate20260716 from './emails/grover-update-2026-07-16.js';

const { RESEND_API_KEY, RESEND_AUDIENCE_ID, RESEND_FROM, RESEND_BROADCAST_ID } = process.env;

if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID || !RESEND_FROM) {
  console.error('Missing required env vars: RESEND_API_KEY, RESEND_AUDIENCE_ID, RESEND_FROM');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

const html = await render(GroverUpdate20260716());
const text = await render(GroverUpdate20260716(), { plainText: true });

const payload = {
  audienceId: RESEND_AUDIENCE_ID,
  from: `Will @ Grover <${RESEND_FROM}>`,
  replyTo: 'will@getgrover.ai',
  subject: 'Adventure Van Expo recap + 3 new things',
  html,
  text,
  name: 'Joyride Journal - Jul 16, 2026',
};

if (RESEND_BROADCAST_ID) {
  const { data, error } = await resend.broadcasts.update(RESEND_BROADCAST_ID, payload);
  if (error) { console.error('Failed to update broadcast:', error); process.exit(1); }
  console.log('Broadcast updated:', RESEND_BROADCAST_ID);
} else {
  const { data, error } = await resend.broadcasts.create(payload);
  if (error) { console.error('Failed to create broadcast:', error); process.exit(1); }
  console.log('Draft broadcast created:', data?.id);
  console.log(`Add to .env to edit in place: RESEND_BROADCAST_ID=${data?.id}`);
}

console.log('View in Resend: https://resend.com/broadcasts');
