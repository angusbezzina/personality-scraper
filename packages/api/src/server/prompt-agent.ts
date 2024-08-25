import { createPersonalityPrompt, type PersonalityCreationPrompt } from "@personality-scraper/ai";

export async function callPromptAgent(props: PersonalityCreationPrompt) {
  const result = await createPersonalityPrompt(props);

  return result;
}
