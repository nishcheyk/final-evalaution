import express from "express";
import cors from "cors";
import routes from "./routes";
import mongoose from "mongoose";

import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import notificationQueue from "./notification/notification.queue";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json"; // adjust path
import dotenv from "dotenv";
dotenv.config();

const app = express();

/**
 * Enable Cross-Origin Resource Sharing for handling requests from different domains.
 */
app.use(cors());

/**
 * Parse incoming requests with JSON payloads.
 */
app.use(express.json());

/**
 * Mount API routes at `/api`.
 */
app.use("/api", routes);

/**
 * Initialize and configure Bull board UI for managing job queues in the admin area.
 */
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullAdapter(notificationQueue)],
  serverAdapter: serverAdapter,
});

/**
 * Mount Bull board dashboard UI for queue management.
 */
app.use("/admin/queues", serverAdapter.getRouter());

/**
 * Serve Swagger UI API documentation at `/api-docs`.
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Connect to MongoDB using URI from environment variables.
 * Logs connection success or errors.
 */
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

export default app;
