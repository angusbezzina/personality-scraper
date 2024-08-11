import { YoutubeTranscript } from 'youtube-transcript';

import('dotenv').then(dotenv => {
    dotenv.config({ path: '../../web/.env.local' });
});

import { getPathWithQuery } from "@personality-scraper/common/query";
import { YOUTUBE_SEARCH } from "@personality-scraper/constants";


async function downloadTranscript(videoId: string) {
    try {
        const result = await YoutubeTranscript.fetchTranscript(videoId);
        
        return result;
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to get transcript for video ${videoId}.`);
    }
}

export async function getYoutubeTranscripts(handle: string) {
  try {
    // TODO: Step One get channel ID organically...
    const videoIdPath = getPathWithQuery(YOUTUBE_SEARCH, {
        key: process.env.YOUTUBE_API_KEY,
        channelId: handle,
        // channelId: "UCEjIjshJ8bvvCkGNk0pkYcA",
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

    const transcripts = (await Promise.all(videoIds.map(downloadTranscript))).flat(2);

    return transcripts;
  } catch (error) {
    console.error(error);

    throw new Error("Failed to get YouTube videos");
  }
}