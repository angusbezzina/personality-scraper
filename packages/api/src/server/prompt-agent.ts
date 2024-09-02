import {
  createPersonalityPrompt as _createPersonalityPrompt,
  type PersonalityCreationPrompt,
} from "@personality-scraper/ai";

export async function createPersonalityPrompt(props: PersonalityCreationPrompt) {
  const result = await _createPersonalityPrompt(props);

  return result;
}
