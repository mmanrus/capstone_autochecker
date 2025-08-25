import dotenv from "dotenv";
dotenv.config();
import { startCronJobs } from "./cron";
import express from "express";
import userRouter from "@/routes/user.route";
import subjectRouter from "@/routes/subject.route";
import activityRouter from "@/routes/activity.route";
import submissionRouter from "@/routes/submission.route"
import cors from "cors";
startCronJobs();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;

// --- Routes ---
app.use(cors()); // Use the cors middleware here
app.use(express.json());
app.use("/api/users/", userRouter);
app.use("/api/subjects/", subjectRouter);
app.use("/api/activities/", activityRouter);
app.use("/api/submissions/", submissionRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("JWT_SECRET from env:", JWT_SECRET);
  console.log("Endpoints:");

  // Dynamically log all the routes from the userRouter
  const basePath = "/api/";
  console.log("<<=========== User Router =========>>");
  userRouter.stack.forEach((layer) => {
    // Check if the layer is a router and has a route
    if (layer.route) {
      const route = layer.route;
      const methods = Object.keys((route as any).methods)
        .join(", ")
        .toUpperCase();
      console.log(
        `- ${methods} http://localhost:${PORT}${basePath}users${route.path}`
      );
    }
  });
  console.log("<<=========== Subject Router =========>>");
  subjectRouter.stack.forEach((layer) => {
    // Check if the layer is a router and has a route
    if (layer.route) {
      const route = layer.route;
      const methods = Object.keys((route as any).methods)
        .join(", ")
        .toUpperCase();
      console.log(
        `- ${methods} http://localhost:${PORT}${basePath}subjects${route.path}`
      );
    }
  });
  console.log("<<=========== Activity Router =========>>");
  activityRouter.stack.forEach((layer) => {
    // Check if the layer is a router and has a route
    if (layer.route) {
      const route = layer.route;
      const methods = Object.keys((route as any).methods)
        .join(", ")
        .toUpperCase();
      console.log(
        `- ${methods} http://localhost:${PORT}${basePath}activities${route.path}`
      );
    }
  });
  console.log("<<=========== Submission Router =========>>");
  submissionRouter.stack.forEach((layer) => {
    // Check if the layer is a router and has a route
    if (layer.route) {
      const route = layer.route;
      const methods = Object.keys((route as any).methods)
        .join(", ")
        .toUpperCase();
      console.log(
        `- ${methods} http://localhost:${PORT}${basePath}submissions${route.path}`
      );
    }
  });
});
