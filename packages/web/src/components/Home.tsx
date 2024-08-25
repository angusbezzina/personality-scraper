import React from "react";

import { SignIn } from "./SignIn";
import { SignOut } from "./SignOut";
import { auth } from "../auth";
import Container from "../components/Container";
import { ScrapeProfileForm } from "../components/ScrapeProfileForm";

export async function Home() {
  const session = await auth();

  return (
    <Container>
      <ScrapeProfileForm />
      {!session ? <SignIn /> : <SignOut />}
    </Container>
  );
}
