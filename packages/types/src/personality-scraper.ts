export namespace PersonalityScraper {
  export type SocialPlatform = "youtube" | "podcast" | "twitter" | "instagram" | "tiktok";
  export type SocialData = {
    youtube: string;
  };
  export type KnowledgeBase = {
    title: string;
    description: string;
    topics: string[];
    takeaways: string[];
    questions: { question: string; response: string }[];
  };
}
