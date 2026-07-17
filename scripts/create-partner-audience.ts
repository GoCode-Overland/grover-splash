import 'dotenv/config';
import { Resend } from 'resend';

const { RESEND_API_KEY } = process.env;
if (!RESEND_API_KEY) {
  console.error('Missing RESEND_API_KEY');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

console.log('Creating audience "Grover Partners"...');
const { data: audience, error } = await resend.audiences.create({
  name: 'Grover Partners',
});

if (error || !audience) {
  console.error('Failed to create audience:', error);
  process.exit(1);
}

console.log(`Audience created: ${audience.id}`);
console.log('\nAdd to .env to use in B2B broadcasts: RESEND_B2B_AUDIENCE_ID=' + audience.id);
console.log('Add contacts manually in resend.com/audiences, or via resend.contacts.create().');
