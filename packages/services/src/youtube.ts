import { YoutubeTranscript } from "youtube-transcript";

import { getPathWithQuery } from "@personality-scraper/common/query";
import { YOUTUBE_ROUTES } from "@personality-scraper/constants";

export namespace YouTube {
  export async function getTranscript(id: string) {
    try {
      const result = await YoutubeTranscript.fetchTranscript(id);

      return result;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get transcript for video ${id}.`);
    }
  }

  export async function getChannelId(accessToken: string) {
    try {
      if (!accessToken) {
        throw new Error("No access token provided");
      }
      const response = await fetch(
        getPathWithQuery(YOUTUBE_ROUTES.channel, {
          part: ["id"],
          mine: true,
        }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const result = await response.json();

      if (!result && !result.items) {
        throw new Error("Failed to get YouTube channel ID");
      }

      return result.items[0].id;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get YouTube channel ID");
    }
  }

  export async function batchGetVideos(accessToken: string) {
    try {
      if (!accessToken) {
        throw new Error("No access token provided");
      }

      const channelId = await getChannelId(accessToken);

      if (!channelId) {
        throw new Error("No channel ID provided");
      }

      const response = await fetch(
        getPathWithQuery(YOUTUBE_ROUTES.search, {
          part: ["id"],
          maxResults: 20,
          type: "video",
          order: "date",
          videoCaption: "closedCaption",
          channelId,
        }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const result = await response.json();

      if (!result || !result.items) {
        throw new Error("Failed to get YouTube video IDs");
      }

      const videoIds: string[] =
        result.items?.map(({ id }: any) => id.videoId)?.filter(Boolean) || [];

      return videoIds;
    } catch (error) {
      console.error(error);

      throw new Error("Failed to get YouTube videos");
    }
  }

  export async function batchGetTranscripts(accessToken: string) {
    try {
      const videoIds = await batchGetVideos(accessToken);
      const results = (await Promise.all(videoIds.map(getTranscript))).flat(2);

      return results;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get transcripts");
    }
  }
}
