import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

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
  trustedOrigins: ["http://localhost:3000", "http://localhost:5000"],
  advanced: {
    disableCSRFCheck: true, // Postman এবং ব্রাউজার ক্লায়েন্ট উভয়েই সহজে টেস্ট করার জন্য
  },
});
