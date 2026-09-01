import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Better Auth API Route Handler (Compatible with Express 5)
app.all("/api/auth", toNodeHandler(auth));
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "EMBOBD API is running smoothly 🚀",
  });
});

// Application Routes
app.use("/api/v1", router);

// Error and 404 Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;