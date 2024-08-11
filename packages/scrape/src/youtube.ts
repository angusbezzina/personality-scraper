import { getPathWithParams, getPathWithQuery } from "@personality-scraper/common/query";
import { YOUTUBE_CAPTION, YOUTUBE_CAPTIONS, YOUTUBE_SEARCH } from "@personality-scraper/constants";

async function downloadTranscript(captionId: string) {
    try {
        const transcriptPath = getPathWithQuery(getPathWithParams(YOUTUBE_CAPTION, { id: captionId }), {
            tlang: "en",
            tfmt: "srt",
        });

        const response = await fetch(transcriptPath);
        const result = await response.json();

        console.log("TRANSCRIPT", result);
    } catch (error) {
        console.error(error);

        throw new Error("Failed to download YouTube transcript.");
    }
}

async function downloadCaption(videoId: string) {
    try {
        const captionPath = getPathWithQuery(YOUTUBE_CAPTIONS, {
            key: "AIzaSyCwRQcgwsJOFOrVp0tqpi_X_CBZ9yme11U",
            part: "id",
            videoId,
        });

        const captionResponse = await fetch(captionPath);
        const captionResult = await captionResponse.json();
        const captionIds = captionResult.items.map(({ id }: any) => id);

        const transcripts = await Promise.all(captionIds.map(downloadTranscript));

    } catch (error) {
        console.error(error);
        throw new Error(`Failed to get YouTube captio for video ${videoId}.`);
    }
}

export async function getYoutubeTranscripts(handle: string) {
  try {
    // TODO: Step One, get channel ID, Step Two, get videos
    const videoIdPath = getPathWithQuery(YOUTUBE_SEARCH, {
        key: "AIzaSyCwRQcgwsJOFOrVp0tqpi_X_CBZ9yme11U",
        channelId: "UCEjIjshJ8bvvCkGNk0pkYcA",
        type: "video",
        videoCaption: "closedCaption",
        part: "id",
        order: "date",
        maxResults: 5,
    });
    const videoResponse = await fetch(videoIdPath);
    const videoResult = await videoResponse.json();
    
    if (!videoResult || !videoResult.items) {
        throw new Error("Failed to get YouTube video IDs");
    }

    const videoIds = videoResult.items.map(({ id }: any) => id.videoId);

    if (videoIds.length === 0) return [];

    const transcripts = await Promise.all(videoIds.map(downloadCaption)) || [];

    console.log("TRANSCRIPTS", transcripts);

    return [];
  } catch (error) {
    console.error(error);

    throw new Error("Failed to get YouTube videos");
  }
}