import { EndOfCallReportPayload } from "../_shared/vapi.types.ts";

export const endOfCallReportHandler = async (
  payload: EndOfCallReportPayload,
): Promise<void> => {
  /**
   * Handle Business logic here.
   * You can store the information like summary, typescript, recordingUrl or even the full messages list in the database.
   */

  return;
};
