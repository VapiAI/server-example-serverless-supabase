// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { commonHeaders } from "../_shared/headers.ts";
import { VapiPayload, VapiWebhookEnum } from "../_shared/vapi.types.ts";

Deno.serve(async (req: Request) => {
  const reqBody = await req.json();

  try {
    const payload = reqBody.message as VapiPayload;
    switch (payload.type) {
      case VapiWebhookEnum.ASSISTANT_REQUEST: {
        const assistant = payload.call
          ? {
            name: "Paula",
            model: {
              provider: "openai",
              model: "gpt-3.5-turbo",
              temperature: 0.7,
              systemPrompt:
                "You're Paula, an AI assistant who can help user draft beautiful emails to their clients based on the user requirements. Then Call sendEmail function to actually send the email.",
              functions: [
                {
                  name: "sendEmail",
                  description:
                    "Send email to the given email address and with the given content.",
                  parameters: {
                    type: "object",
                    properties: {
                      email: {
                        type: "string",
                        description:
                          "Email to which we want to send the content.",
                      },
                      content: {
                        type: "string",
                        description: "Actual Content of the email to be sent.",
                      },
                    },
                    required: ["email"],
                  },
                },
              ],
            },
            voice: {
              provider: "11labs",
              voiceId: "paula",
            },
            firstMessage: "Hi, I'm Paula, your personal email assistant.",
          }
          : null;

        return new Response(
          JSON.stringify({ assistant }),
          { status: 201, headers: { ...commonHeaders } },
        );
      }
      default: {
        return new Response(
          JSON.stringify({}),
          { status: 201, headers: { ...commonHeaders } },
        );
      }
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...commonHeaders } },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/inbound' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
