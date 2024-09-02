import { saveAs } from "file-saver";
import JSZip from "jszip";

import type { PersonalityScraper } from "@personality-scraper/types";

export type FileInput = {
  url: PersonalityScraper.Url;
  filename: string;
};

export async function zipMultipleFiles(input: FileInput[], outputName: string) {
  const zip = new JSZip();

  for (const { url, filename } of input) {
    const content = url.split(",")[1] || "";
    zip.file(`${filename}.txt`, content);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${outputName}.zip`);
}
