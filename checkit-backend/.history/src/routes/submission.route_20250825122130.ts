import * as submissionController from "@/controllers/submission.controller";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

import {
  authenticateToken,
  authorizeRole,
  authorizeUser,
} from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.post(
  "/subject/:subjectId/activity/:activityId",
  authenticateToken,
  authorizeRole(["student", "professor"]),
  upload.single('submissionFile'),
  submissionController.submit
);

router.put(
  "/subject/:subjectId/activity/:activityId/submission/:submissionId",
  authenticateToken,
  authorizeRole(["student", "professor"]),
  authorizeUser("submission", "submissionId"),
  submissionController.resubmit
);

router.get(
  "/subject/:subjectId/activity/:activityId/submission/:submissionId",
  authenticateToken,
  authorizeRole(["student", "professor"]),
  authorizeUser("submission", "submissionId"),
  submissionController.resubmit
);


export default router