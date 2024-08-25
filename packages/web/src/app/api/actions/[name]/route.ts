import { apiHandler } from "@personality-scraper/api/server";

// We need longer durations for the AI to process the request
export const maxDuration = 60;

export const POST = apiHandler;
