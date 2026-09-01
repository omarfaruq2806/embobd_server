import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://embobd.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CANDIDATE",
        required: false,
      },
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5000",
    "https://embobd.vercel.app",
    ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
  ],
  advanced: {
    // Cross-domain cookie support between vercel.app and onrender.com
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
    disableCSRFCheck: true,
  },
});
