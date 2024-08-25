import React from "react";

import { Button } from "@personality-scraper/components";

import { signIn } from "../auth";

export function SignIn() {
  async function handleSignIn() {
    "use server";
    await signIn("google");
  }

  return (
    <form action={handleSignIn}>
      <Button type="submit">Signin</Button>
    </form>
  );
}
