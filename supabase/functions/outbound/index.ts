// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { envConfig } from "../_shared/env.config.ts";
import { commonHeaders } from "../_shared/headers.ts";

Deno.serve(async (req: Request) => {
  const { phoneNumberId, assistantId, customerNumber } = await req.json();
  try {
    const response = await fetch(
      `${envConfig.vapi.baseUrl}/call/phone`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${envConfig.vapi.apiKey}`,
        },
        body: JSON.stringify({
          phoneNumberId: phoneNumberId,
          assistantId: assistantId,
          customer: {
            number: customerNumber,
          },
        }),
      },
    );

    return new Response(JSON.stringify(response), {
      headers: commonHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...commonHeaders } },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/outbound' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
