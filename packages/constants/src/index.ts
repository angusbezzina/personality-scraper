export const IS_DEV = process.env.NODE_ENV !== "production";
export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
export const IS_SERVER = typeof globalThis?.window === "undefined";
export const IS_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export const ROOT_DOMAIN_PROD = "personality-scraper-web-tzkx.vercel.app";
export const ROOT_DOMAIN_DEV = "localhost";
export const ROOT_DOMAIN_PREVIEW = ""; // TODO?

export const APP_NAME = "creatorx";

export const APP_HOST_PROD = "https://personality-scraper-web-tzkx.vercel.app";
export const APP_HOST_DEV = `${ROOT_DOMAIN_DEV}:3000`;
export const APP_HOST_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_URL;
export const APP_HOST_BRANCH_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL;
export const ASSETS_CDN_URL = "https://personality-scraper.s3.amazonaws.com";

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
  caption: `${YOUTUBE_STEM}/captions/[id]`,
  captions: `${YOUTUBE_STEM}/captions`,
};
export const YOUTUBE_SCOPES = {
  general: "https://www.googleapis.com/auth/youtube",
  readOnly: "https://www.googleapis.com/auth/youtube.readonly",
  forceSsl: "https://www.googleapis.com/auth/youtube.force-ssl",
};
export const YOUTUBE_API_VERSION = "v3";

export const AWS_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID as string;
export const AWS_SECRET_KEY = process.env.S3_SECRET_ACCESS_KEY as string;
export const AWS_REGION = process.env.S3_REGION as string;
export const AWS_BUCKET = process.env.S3_BUCKET_NAME as string;
export const AWS_BASE_CONFIG = {
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
  },
};
export const MAX_FILE_UPLOAD_SIZE = 1024 * 1024 * 25;
export const MAX_FILE_UPLOAD_SIZE_LABEL = "25 MB";
