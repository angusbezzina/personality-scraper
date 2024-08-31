import { FileStorage } from "@personality-scraper/services";
import type { PersonalityScraper } from "@personality-scraper/types";

export async function getDownloadUrl(path: PersonalityScraper.Path): Promise<string> {
  try {
    const url = await FileStorage.getDownloadUrl(path);

    if (!url) {
      throw new Error("Failed to download file");
    }

    return url;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to download file");
  }
}
