import { YouTube } from "@personality-scraper/services";

export async function getTranscripts(accessToken: string) {
  const transcripts = YouTube.batchGetTranscripts(accessToken);

  return transcripts;
}
