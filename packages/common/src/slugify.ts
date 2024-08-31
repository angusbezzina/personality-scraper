import slugifyImpl from "slugify";

import type { PersonalityScraper } from "@personality-scraper/types";

interface Options {
  replacement?: string;
  remove?: RegExp;
  lower?: boolean;
  strict?: boolean;
  locale?: string;
  trim?: boolean;
}

export function slugify(string: string, options: Options = {}): PersonalityScraper.Slug {
  return slugifyImpl(string, { lower: true, ...options }) as PersonalityScraper.Slug;
}
