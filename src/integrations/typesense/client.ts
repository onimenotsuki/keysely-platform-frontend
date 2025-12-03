import { Client } from 'typesense';

// Initialize Typesense client
// These should be set in your .env file:
// VITE_TYPESENSE_HOST
// VITE_TYPESENSE_PORT
// VITE_TYPESENSE_PROTOCOL
// VITE_TYPESENSE_API_KEY (Search-only API Key)

const host = import.meta.env.VITE_TYPESENSE_HOST;
const port = import.meta.env.VITE_TYPESENSE_PORT;
const protocol = import.meta.env.VITE_TYPESENSE_PROTOCOL;
const apiKey = import.meta.env.VITE_TYPESENSE_API_KEY;

const hasCredentials =
  typeof host === 'string' && host.length > 0 && typeof apiKey === 'string' && apiKey.length > 0;

export const typesenseClient = hasCredentials
  ? new Client({
      nodes: [
        {
          host,
          port: Number(port),
          protocol,
        },
      ],
      apiKey,
      connectionTimeoutSeconds: 2,
    })
  : null;

export const SPACES_COLLECTION_NAME = 'spaces';

export const isTypesenseConfigured = () => {
  return hasCredentials;
};
