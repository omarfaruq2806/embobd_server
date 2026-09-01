export const notFoundHandler = (req: any, res: any) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found!",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
};
