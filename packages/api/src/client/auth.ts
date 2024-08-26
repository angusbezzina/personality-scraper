import React from "react";
import { useRouter } from "next/navigation";

import { personalityClient } from "./api";

export function useAuth() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function signIn() {
    setLoading(true);
    const url = await personalityClient.signIn("google", { redirect: false });
    router.push(url);
    setLoading(false);
  }

  async function signOut() {
    setLoading(true);
    const data = await personalityClient.signOut({ redirect: false });
    setLoading(false);
    router.push(data.redirect);
  }

  return { loading, signIn, signOut };
}

export async function getSession() {
  await personalityClient.auth();
}
