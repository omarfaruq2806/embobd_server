export const errorHandler = (err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages: err.errors || [
      {
        path: "",
        message: err.message,
      },
    ],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
