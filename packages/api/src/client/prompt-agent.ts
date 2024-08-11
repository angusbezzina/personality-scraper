import type { PersonalityCreationPrompt } from "@personality-scraper/ai";

import { personalityClient } from "./api";

export async function callPromptAgent(props: PersonalityCreationPrompt) {
  const result = await personalityClient.callPromptAgent(props);

  return result;
}
