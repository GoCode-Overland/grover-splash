import 'dotenv/config';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { Resend } from 'resend';

const { RESEND_API_KEY } = process.env;
if (!RESEND_API_KEY) {
  console.error('Missing RESEND_API_KEY');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

interface Contact {
  email: string;
  firstName: string;
  lastName: string;
}

async function parseCSV(path: string): Promise<Contact[]> {
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  const lines: string[] = [];
  for await (const line of rl) lines.push(line);

  // Parse header to find column indices
  const headers = parseCSVRow(lines[0]);
  const idx = (name: string) => headers.indexOf(name);

  const emailIdx = idx('Email');
  const firstIdx = idx('First Name');
  const lastIdx = idx('Last Name');
  const mobileIdx = idx('grover mobile app user');
  const quarantinedIdx = idx('Email Address Quarantined');
  const invalidIdx = idx('Invalid email address');
  const unsubIdx = idx('Unsubscribed from all email');

  const contacts: Contact[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const row = parseCSVRow(lines[i]);

    if (row[mobileIdx]?.trim() !== 'Yes') continue;

    const email = row[emailIdx]?.trim();
    if (!email) continue;
    if (row[quarantinedIdx]?.trim().toLowerCase() === 'true') continue;
    if (row[invalidIdx]?.trim().toLowerCase() === 'true') continue;
    if (row[unsubIdx]?.trim().toLowerCase() === 'true') continue;

    contacts.push({
      email,
      firstName: row[firstIdx]?.trim() ?? '',
      lastName: row[lastIdx]?.trim() ?? '',
    });
  }

  return contacts;
}

// Handles quoted fields with commas inside
function parseCSVRow(line: string): string[] {
  const fields: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(field);
      field = '';
    } else {
      field += ch;
    }
  }
  fields.push(field);
  return fields;
}

async function batchImport(audienceId: string, contacts: Contact[]) {
  let done = 0;
  let errors = 0;

  for (const c of contacts) {
    const { error } = await resend.contacts.create({
      audienceId,
      email: c.email,
      firstName: c.firstName || undefined,
      lastName: c.lastName || undefined,
      unsubscribed: false,
    });

    if (error) {
      errors++;
      console.error(`\n  ✗ ${c.email}: ${error.message}`);
    } else {
      done++;
    }

    process.stdout.write(`\r  Imported ${done}/${contacts.length} (${errors} errors)`);

    // 110ms per request = ~9 req/sec, safely under the 10/sec limit
    await new Promise(r => setTimeout(r, 110));
  }

  console.log('');
  return { done, errors };
}

// --- Main ---

console.log('Parsing CSV...');
const contacts = await parseCSV('/Users/williamtrapp/Downloads/all-contacts.csv');
console.log(`Found ${contacts.length} clean mobile users`);

console.log('\nCreating audience "Grover Mobile Users"...');
const { data: audience, error: audienceError } = await resend.audiences.create({
  name: 'Grover Mobile Users',
});

if (audienceError || !audience) {
  console.error('Failed to create audience:', audienceError);
  process.exit(1);
}

console.log(`Audience created: ${audience.id}`);
console.log('\nImporting contacts...');

const { done, errors } = await batchImport(audience.id, contacts);

console.log(`\nDone. ${done} imported, ${errors} failed.`);
console.log(`\nAudience ID: ${audience.id}`);
console.log('Add to .env to use in broadcasts: RESEND_AUDIENCE_ID=' + audience.id);
