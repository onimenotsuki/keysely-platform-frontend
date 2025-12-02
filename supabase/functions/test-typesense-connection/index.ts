import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Typesense from 'npm:typesense';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-api-key, content-type, x-typesense-api-key',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const TYPESENSE_HOST = Deno.env.get('TYPESENSE_HOST');
    const TYPESENSE_API_KEY = Deno.env.get('TYPESENSE_API_KEY');

    if (!TYPESENSE_HOST || !TYPESENSE_API_KEY) {
      throw new Error('Missing TYPESENSE_HOST or TYPESENSE_API_KEY environment variables');
    }

    const client = new Typesense.Client({
      nodes: [
        {
          host: TYPESENSE_HOST,
          protocol: 'http',
          port: 80,
        },
      ],
      apiKey: TYPESENSE_API_KEY,
      connectionTimeoutSeconds: 2,
    });

    const health = await client.health.retrieve();

    return new Response(JSON.stringify({ success: true, health }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
