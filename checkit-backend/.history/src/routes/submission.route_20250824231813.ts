
import * as submissionController from "@/controllers/submission.controller";

import {
  authenticateToken,
  authorizeRole,
  authorizeUser,
} from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();



router.put(
  "/subject/:subjectId/activity/:activityId/submission/:submissionId",
  authenticateToken,
  authorizeRole(["student", "proffessor"]),
  authorizeUser("submission", "submissionId"),
  submissionController.resubmit
);



