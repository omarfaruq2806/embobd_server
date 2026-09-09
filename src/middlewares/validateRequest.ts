import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

/**
 * Middleware to validate request payload using a Zod schema.
 * Replaces req.body with the sanitized and parsed data.
 */
export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to validate query params using a Zod schema.
 */
export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.query);
      req.query = parsed as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};
