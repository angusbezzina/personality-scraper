import { z } from "@personality-scraper/common/validation";

export const KnowledgeBaseSchema = z.object({});
export const PerplexitySchema = z.object({
  name: z.string().describe("The name of the creator to search for in Perplexity"),
});
export const YouTubeKnowledgeSchema = z.object({
  knowledge: z.object({
    title: z.string().describe("The title of the YouTube video"),
    description: z.string().describe("A description of what the video is about"),
    topics: z.array(z.string()).describe("The key topics or themes of the video"),
    takeaways: z.array(z.string()).describe("The key takeaways or lessons learned from the entity"),
    questions: z.array(
      z.object({
        question: z
          .string()
          .describe(
            "The question that a user may ask that are related to the content of the entity",
          ),
        response: z
          .string()
          .describe("The response to the question in the style and tone of the creator"),
      }),
    ),
  }),
});
