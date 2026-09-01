import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

const isDevelopment = process.env.NODE_ENV !== "production";

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
    process.env.CLIENT_URL || "http://localhost:3000",
  ],
  advanced: {
    // ডেভেলপমেন্টে Postman টেস্টিং সহজ করবে, প্রোডাকশনে ফুল সিকিউরিটি দেবে
    disableCSRFCheck: isDevelopment,
  },
});
