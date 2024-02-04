// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { commonHeaders } from "../_shared/headers.ts";
import { VapiPayload, VapiWebhookEnum } from "../_shared/vapi.types.ts";
import { assistantRequestHandler } from "./assistantRequest.ts";
import { endOfCallReportHandler } from "./endOfCallReportHandler.ts";
import { functionCallHandler } from "./functionCall.ts";
import { HangEventHandler } from "./hang.ts";
import { speechUpdateHandler } from "./speechUpdateHandler.ts";
import { statusUpdateHandler } from "./statusUpdate.ts";
import { transcriptHandler } from "./transcript.ts";

Deno.serve(async (req) => {
  const reqBody = await req.json();
  if (req.method === "POST") {
    try {
      const payload = reqBody.message as VapiPayload;
      console.log(payload);
      switch (payload.type) {
        case VapiWebhookEnum.FUNCTION_CALL: {
          return new Response(
            JSON.stringify(await functionCallHandler(payload)),
            { status: 201, headers: commonHeaders }
          );
        }
        case VapiWebhookEnum.STATUS_UPDATE: {
          return new Response(
            JSON.stringify(await statusUpdateHandler(payload)),
            { status: 201, headers: commonHeaders }
          );
        }
        case VapiWebhookEnum.ASSISTANT_REQUEST:
          return new Response(
            JSON.stringify(await assistantRequestHandler(payload)),
            { status: 201, headers: commonHeaders }
          );
        case VapiWebhookEnum.END_OF_CALL_REPORT:
          return new Response(
            JSON.stringify(await endOfCallReportHandler(payload)),
            { status: 201, headers: commonHeaders }
          );
        case VapiWebhookEnum.SPEECH_UPDATE:
          return new Response(
            JSON.stringify(await speechUpdateHandler(payload)),
            { status: 201, headers: commonHeaders }
          );
        case VapiWebhookEnum.TRANSCRIPT:
          return new Response(
            JSON.stringify(await transcriptHandler(payload)),
            { status: 201, headers: commonHeaders }
          );
        case VapiWebhookEnum.HANG:
          return new Response(JSON.stringify(await HangEventHandler(payload)), {
            status: 201,
            headers: commonHeaders,
          });
        default:
          return new Response(JSON.stringify({}), {
            status: 200,
            headers: commonHeaders,
          });
      }
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...commonHeaders },
      });
    }
  } else {
    return new Response(JSON.stringify({ message: "Not Found" }), {
      status: 404,
      headers: commonHeaders,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
