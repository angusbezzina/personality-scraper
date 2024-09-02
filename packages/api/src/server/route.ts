import { NextRequest, NextResponse } from "next/server";

import { HttpStatus } from "@personality-scraper/constants";

import {
  auth,
  createPersonalityPrompt,
  getDownloadUrl,
  getTranscripts,
  signIn,
  signOut,
} from "./actions";

const publicActions = {};

export const privateActions = {
  auth,
  createPersonalityPrompt,
  getDownloadUrl,
  getTranscripts,
  signIn,
  signOut,
};

const actions = {
  ...publicActions,
  ...privateActions,
};

export type Actions = typeof actions;

export async function apiHandler(
  request: NextRequest,
  context: { params: { name: string } },
): Promise<NextResponse> {
  try {
    const { name } = context.params;
    const { params } = await request.json();

    if (name in actions) {
      // @ts-ignore
      const body = await actions[name](...params);
      return NextResponse.json(body ?? null);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 400 });
  }

  return new NextResponse(null, { status: HttpStatus.NotImplemented });
}
