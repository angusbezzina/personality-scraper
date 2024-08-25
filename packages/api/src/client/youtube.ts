import { personalityClient } from "./api";

export async function getTranscripts(accessToken: string) {
  const transcripts = await personalityClient.getTranscripts(accessToken);

  return transcripts;
}
