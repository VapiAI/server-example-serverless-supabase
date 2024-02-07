// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { commonHeaders } from "../_shared/headers.ts";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  try {
    const {
      model,
      messages,
      max_tokens,
      temperature,
      stream,
      call,
      ...restParams
    } = await req.json();
    const response = {
      id: "chatcmpl-8mcLf78g0quztp4BMtwd3hEj58Uof",
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: "gpt-3.5-turbo-0613",
      system_fingerprint: null,
      choices: [
        {
          index: 0,
          delta: { content: messages?.[messages.length - 1]?.content ?? "" },
          logprobs: null,
          finish_reason: "stop",
        },
      ],
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 201,
        headers: commonHeaders,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...commonHeaders },
      },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/custom-llm-basic' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
