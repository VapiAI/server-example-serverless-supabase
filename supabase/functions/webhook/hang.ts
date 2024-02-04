import { HangMessageResponse, HangPayload } from "../_shared/vapi.types.ts";

export const HangEventHandler = async (
  payload: HangPayload
): Promise<HangMessageResponse> => {
  /**
   * Handle Business logic here.
   * Sent once the call is terminated by user.
   * You can update the database or have some followup actions or workflow triggered.
   */

  return {};
};
