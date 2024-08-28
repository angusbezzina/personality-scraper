import { z } from "@personality-scraper/common/validation";

export const KnowledgeBaseSchema = z.object({});
export const PerplexitySchema = z.object({
  name: z.string().describe("The name of the creator to search for in Perplexity"),
});
export const YouTubeKnowledgeSchema = z.object({
  knowledge: z.object({
    title: z.string().describe("The title of the YouTube video"),
    description: z
      .string()
      .describe("The knowledge from the YouTube video to pass to the Knowledge Base"),
  }),
});
