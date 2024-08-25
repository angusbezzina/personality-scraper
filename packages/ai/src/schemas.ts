import { z } from "@personality-scraper/common/validation";

export const YouTubeSchema = z.object({
  handle: z.string().describe("The handle for the user's YouTube account"),
});
