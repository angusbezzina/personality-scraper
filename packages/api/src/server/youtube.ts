import { getYoutubeTranscripts } from "@personality-scraper/scrape";

export async function getTranscripts(handle: string) {
    const transcripts = await getYoutubeTranscripts(handle);

    return transcripts;
}