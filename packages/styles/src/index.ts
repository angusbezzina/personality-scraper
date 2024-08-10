import { Merriweather_Sans,Montserrat } from "next/font/google";
import type React from "react";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "800"],
  subsets: ["latin"],
});

const merriweatherSans = Merriweather_Sans({
  weight: ["300", "400", "500", "800"],
  subsets: ["latin"],
});

export const FONTS_CSS = Object.freeze({
  "--font-heading": montserrat.style.fontFamily,
  "--font-body": merriweatherSans.style.fontFamily,
  "--font-form": merriweatherSans.style.fontFamily,
  "--font-special": montserrat.style.fontFamily,
}) as React.CSSProperties;
