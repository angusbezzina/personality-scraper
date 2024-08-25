export const IS_DEV = process.env.NODE_ENV !== "production";
export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
export const IS_SERVER = typeof globalThis?.window === "undefined";
export const IS_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export const ROOT_DOMAIN_PROD = "";
export const ROOT_DOMAIN_DEV = "localhost";
export const ROOT_DOMAIN_PREVIEW = "";

export const APP_NAME = "folios";

export const APP_HOST_PROD = `folio.${ROOT_DOMAIN_PROD}`;
export const APP_HOST_DEV = `${ROOT_DOMAIN_DEV}:3000`;
export const APP_HOST_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_URL;
export const APP_HOST_BRANCH_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL;
export const ASSETS_CDN_URL = `https://assets.${ROOT_DOMAIN_PROD}`;

export const APP_HOST = IS_PREVIEW
  ? APP_HOST_BRANCH_PREVIEW
  : IS_DEV
    ? `${APP_HOST_DEV}`
    : `${APP_HOST_PROD}`;
export const APP_URL = IS_DEV ? `http://${APP_HOST}` : `https://${APP_HOST}`;

export const WEB_APP_ROUTES = {
  HOME: "/",
} as const;

export const SITE_METADATA = {
  title: "Personality Scraper",
  description: "Simple service to prepare personalities for voice conversion via Synthflow",
  imageUrl: "",
  keywords: [],
};

export enum HttpStatus {
  Ok = 200,
  NoContent = 204,
  MovedPermanently = 301,
  TemporaryRedirect = 307,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Conflict = 409,
  Teapot = 418,
  UnprocessableContent = 422,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotImplemented = 501,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

export const YOUTUBE_STEM = "https://www.googleapis.com/youtube/v3";
export const YOUTUBE_ROUTES = {
  search: `${YOUTUBE_STEM}/search`,
  channel: `${YOUTUBE_STEM}/channels`,
  caption: `${YOUTUBE_STEM}/caption/[id]`,
  captions: `${YOUTUBE_STEM}/caption`,
};
export const YOUTUBE_SCOPES = { readOnly: "https://www.googleapis.com/auth/youtube.readonly" };
export const YOUTUBE_API_VERSION = "v3";
