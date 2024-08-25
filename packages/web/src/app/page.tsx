import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { auth } from "../auth";
import { Home } from "../components/Home";

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
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <Home />
    </SessionProvider>
  );
}
