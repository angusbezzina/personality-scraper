export namespace PersonalityScraper {
  declare const __brand: unique symbol;

  type Brand<T, B> = T & { [__brand]: B };

  export type Hash = Brand<string, "Hash">;

  export type Url = Brand<string, "Url">;

  export type Slug = Brand<string, "Slug">;

  export type Path = Brand<string, "Path">;

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

  export type PersonalityPromptOutput = {
    prompt: string;
    knowledgeBase: Path[];
  };

  export type ContentType =
    // Image
    | "image/svg+xml"
    | "image/png"
    | "image/jpeg"
    | "image/jpg"
    | "image/svg+xml"
    | "image/gif"
    | "image/webp"
    | "image/bmp"
    | "image/tiff"
    // Audio
    | "audio/mpeg"
    | "audio/ogg"
    | "audio/wav"
    | "audio/webm"
    | "audio/flac"
    // Video
    | "video/mp4"
    | "video/ogg"
    | "video/webm"
    | "video/quicktime"
    | "video/x-msvideo"
    | "video/x-matroska"
    // Documents
    | "text/plain"
    | "text/csv"
    | "application/pdf"
    | "application/vnd.ms-excel"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "application/vnd.apple.numbers"
    | "application/vnd.ms-powerpoint"
    | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    | "application/vnd.apple.keynote"
    | "application/msword"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "application/vnd.apple.pages";
}
