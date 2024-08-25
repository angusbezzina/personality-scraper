import "next-auth/jwt";

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { SessionProvider, useSession } from "next-auth/react";

import { YOUTUBE_SCOPES } from "@personality-scraper/constants";

const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          scope: `openid profile email ${YOUTUBE_SCOPES.readOnly}`,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});

export { handlers, signIn, signOut, auth, useSession, SessionProvider };

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
