import { z } from "@personality-scraper/common/validation";

export const PerplexitySchema = z.object({
  name: z.string().describe("The name of the creator to search for in Perplexity"),
});
