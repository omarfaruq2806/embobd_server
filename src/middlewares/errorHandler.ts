import { ZodError } from "zod";

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  let errorMessages = err.errors || [
    {
      path: "",
      message: err.message,
    },
  ];

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorMessages = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorMessages,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

