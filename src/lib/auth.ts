import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, User } from "next-auth";

// Extend the built-in types
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage: string | undefined;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      profileImage: string | undefined;
      accessToken: string;
      refreshToken: string;
    };
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage: string | undefined;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires?: number;
    error?: string;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${token.refreshToken}`,
        },
      },
    );

    const data = await res.json();

    if (!res.ok || !data?.data?.accessToken) {
      throw new Error("RefreshTokenError");
    }

    return {
      ...token,
      accessToken: data.data.accessToken,
      accessTokenExpires: Date.now() + 29 * 24 * 60 * 60 * 1000,
    };
  } catch {
    return {
      ...token,
      error: "RefreshTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(
              data?.message || data?.error || "Invalid credentials",
            );
          }

          if (!data?.data?.user?._id || !data?.data?.accessToken) {
            throw new Error("Invalid server response");
          }

          return {
            id: data.data.user._id,
            name: data.data.user.fullName,
            email: data.data.user.email,
            role: data.data.user.role,
            profileImage: data.data.user.profileImage,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Login failed");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.profileImage = user.profileImage;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 29 * 24 * 60 * 60 * 1000;
        return token;
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
        profileImage: token.profileImage as string | undefined,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
      };
      if (token.error) {
        session.error = token.error;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
