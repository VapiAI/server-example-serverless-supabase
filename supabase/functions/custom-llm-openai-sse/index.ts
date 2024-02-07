// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";
import { commonHeaders } from "../_shared/headers.ts";
import { envConfig } from "../_shared/env.config.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (
    req.method !== "POST" ||
    url.pathname !== "/custom-llm-openai-sse/chat/completions"
  ) {
    return new Response("Method Not Allowed", { status: 405 });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Not Found" }), {
      status: 404,
      headers: commonHeaders,
    });
  }
  const openai = new OpenAI({
    apiKey: envConfig.openai.apiKey,
  });

  try {
    const {
      model,
      messages,
      max_tokens,
      temperature,
      stream,
      ...restParams
    } = await req.json();

    if (stream) {
      const completionOptions = {
        model: model || "gpt-3.5-turbo",
        ...restParams,
        messages,
        max_tokens: max_tokens || 150,
        temperature: temperature || 0.7,
        stream: true,
      };

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          headers: {
            Authorization: `Bearer ${envConfig.openai.apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(completionOptions),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        console.log("error", error);
        throw new Error("Failed to generate completion", error);
      }

      // Proxy the streamed SSE response from OpenAI
      return new Response(response.body, {
        headers: {
          ...commonHeaders,
          "Content-Type": "text/event-stream",
        },
      });
    } else {
      const completion = await openai.chat.completions.create({
        model: model || "gpt-3.5-turbo",
        messages,
        max_tokens: max_tokens || 150,
        temperature: temperature || 0.7,
        ...restParams,
      });

      return new Response(JSON.stringify(completion), {
        status: 200,
        headers: { ...commonHeaders },
      });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: commonHeaders,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/openai-sse' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
