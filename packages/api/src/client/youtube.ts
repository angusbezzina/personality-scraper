import { personalityClient } from "./api";

export async function getTranscripts(handle: string) {
    const transcripts = await personalityClient.getTranscripts(handle);

    return transcripts;
}