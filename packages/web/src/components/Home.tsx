import React from "react";

import Container from "../components/Container";
import { ScrapeProfileForm } from "../components/ScrapeProfileForm";

export async function Home() {
  return (
    <Container>
      <ScrapeProfileForm />
    </Container>
  );
}
