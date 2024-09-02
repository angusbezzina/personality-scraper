import type { PersonalityScraper } from "@personality-scraper/types";

import { personalityClient } from "./api";

export async function getDownloadUrl(path: PersonalityScraper.Path) {
  const url = await personalityClient.getDownloadUrl(path);

  return url;
}
