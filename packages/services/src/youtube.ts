import { getPathWithParams, getPathWithQuery } from "@personality-scraper/common/query";
import { YOUTUBE_ROUTES } from "@personality-scraper/constants";

export namespace YouTube {
  export async function getTranscript(accessToken: string, videoId: string) {
    try {
      const responseList = await fetch(
        getPathWithQuery(YOUTUBE_ROUTES.captions, {
          part: ["id"],
          videoId,
        }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!responseList.ok) {
        throw new Error(`Failed to get transcript list for video ${videoId}.`);
      }

      const resultList = await responseList.json();
      const firstTranscript = resultList.items[0];

      const response = await fetch(
        getPathWithQuery(getPathWithParams(YOUTUBE_ROUTES.caption, { id: firstTranscript.id }), {
          tfmt: "srt",
        }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/octet-stream",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to download caption for ${videoId}`);
      }

      const result = await response.text();

      return `<youtubeTranscript>${result}</youtubeTranscript>`;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get transcript for video ${videoId}.`);
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

      if (!response.ok) {
        throw new Error("YouTube API request failed");
      }

      const result = await response.json();

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
          channelId,
        }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("YouTube API Failed");
      }

      const result = await response.json();

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
      const results = await Promise.all(videoIds.map((id) => getTranscript(accessToken, id)));

      return results;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get transcripts");
    }
  }
}
