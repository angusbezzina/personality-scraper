import type { PersonalityCreationPrompt } from "@personality-scraper/ai";

import { personalityClient } from "./api";

export async function createPersonalityPrompt(props: PersonalityCreationPrompt) {
  const result = await personalityClient.createPersonalityPrompt(props);

  return result;
}
