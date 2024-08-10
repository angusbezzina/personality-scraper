import { personalityClient } from "./api";

export async function getYouTubeTranscripts() {
  await personalityClient.getYouTubeTranscripts();
}
