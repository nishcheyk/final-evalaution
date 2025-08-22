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

app.use(cors());
app.use(express.json());

app.use("/api", routes);

// Create ExpressAdapter instance
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

// Create Bull Board passing queues and serverAdapter
const bullBoard = createBullBoard({
  queues: [new BullAdapter(notificationQueue)],
  serverAdapter: serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

export default app;
