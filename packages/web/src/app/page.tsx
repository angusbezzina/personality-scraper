import type { Metadata } from "next";

import { Home } from "@/components/Home";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Personality Scraper | Home";
  const description = "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function HomePage() {
  return <Home />;
}
