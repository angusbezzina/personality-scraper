import React from "react";

import { Button } from "@personality-scraper/components";

import { signOut } from "../auth";

export function SignOut() {
  async function handleSignOut() {
    "use server";
    await signOut();
  }

  return (
    <form action={handleSignOut}>
      <Button type="submit">Signout</Button>
    </form>
  );
}
