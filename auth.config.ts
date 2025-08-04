import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"

export default {
  providers: [GitHub],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLogin = !!auth?.user
      const ProtectedRoutes = ["/dashboard", "/profile", "/note"]
      const ProtectedLoggedIn = ["/login", " / register"]

      if (!isLogin && ProtectedRoutes.includes(nextUrl.pathname)) {
        return Response.redirect(new URL("/login", nextUrl.origin))
      }

      if (isLogin && ProtectedLoggedIn.includes(nextUrl.pathname)) {
        return Response.redirect(new URL("/dashboard", nextUrl.origin))
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  }
} satisfies NextAuthConfig
