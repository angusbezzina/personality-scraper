import "@personality-scraper/styles/global.css";

import type { Metadata, Viewport } from "next";

import { APP_HOST_DEV, IS_DEV, SITE_METADATA } from "@personality-scraper/constants";
import { FONTS_CSS } from "@personality-scraper/styles";

import { Providers } from "../components/Providers";

const { title, description, imageUrl } = SITE_METADATA;
const metadataBase = IS_DEV ? new URL(`http://${APP_HOST_DEV}/`) : undefined;

export const metadata: Metadata = {
  metadataBase,
  title,
  icons: `${metadataBase || ""}/favicon.ico`,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: imageUrl,
        alt: "Personality Scraper",
      },
    ],
    siteName: "Personality Scraper",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 10,
  userScalable: true,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={FONTS_CSS} className="bg-background sm:bg-faint font-body text-foreground">
        <Providers>
          <div className="relative flex flex-col w-full h-full items-center justify-center">
            {/* <header className="fixed top-0 left-0 w-full flex items-center justify-center shrink-0 h-16">
                  <h4 className="text-h3 font-special font-bold">Personality Scraper<span className="text-brand">.</span></h4>
                </header> */}
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
