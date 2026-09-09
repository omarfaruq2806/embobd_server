import rateLimit from "express-rate-limit";

/**
 * General API rate limiter
 * Allows up to 300 requests per 15 minutes per IP address.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

/**
 * Strict rate limiter for Authentication and sensitive actions (Login, Register)
 * Allows up to 20 requests per 15 minutes per IP address to prevent brute-force attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many authentication attempts. For security, please wait 15 minutes before trying again.",
  },
});

/**
 * Rate limiter for resource creation (Posting jobs, submitting businesses, creating community posts)
 * Allows up to 25 create requests per 15 minutes per IP to prevent spamming.
 */
export const createResourceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Creation limit exceeded. Please wait a few minutes before submitting more content.",
  },
});
