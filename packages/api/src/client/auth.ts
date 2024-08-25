import { useRouter } from "next/navigation";

import { personalityClient } from "./api";

export function useAuth() {
  const router = useRouter();

  async function signIn() {
    const url = await personalityClient.signIn("google", { redirect: false });
    router.push(url);
  }

  async function signOut() {
    const data = await personalityClient.signOut({ redirect: false, redirectTo: "/" });
    router.push(data.redirect);
  }

  return { signIn, signOut };
}

export async function getSession() {
  await personalityClient.auth();
}
