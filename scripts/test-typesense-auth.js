import { Client } from 'typesense';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const host = process.env.VITE_TYPESENSE_HOST;
const port = process.env.VITE_TYPESENSE_PORT;
const protocol = process.env.VITE_TYPESENSE_PROTOCOL;
const apiKey = process.env.VITE_TYPESENSE_API_KEY;

console.log('Testing Typesense Connection...');
console.log('Host:', host);
console.log('Port:', port);
console.log('Protocol:', protocol);
console.log('API Key Length:', apiKey ? apiKey.length : 0);
console.log('API Key First 5 chars:', apiKey ? apiKey.substring(0, 5) : 'N/A');

if (!host || !apiKey) {
  console.error('Missing configuration');
  process.exit(1);
}

const client = new Client({
  nodes: [
    {
      host,
      port: port ? parseInt(port, 10) : 80,
      protocol: protocol || 'http',
    },
  ],
  apiKey,
  connectionTimeoutSeconds: 5,
});

async function test() {
  try {
    console.log('Attempting to retrieve health...');
    const health = await client.health.retrieve();
    console.log('Health:', health);

    console.log('Attempting to search spaces...');
    const search = await client.collections('spaces').documents().search({
      q: '*',
      query_by: 'title',
      per_page: 1,
    });
    console.log('Search success:', search.found, 'results found');
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
