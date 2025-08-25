import * as activityController from "@/controllers/activity.controller";
import * as submissionController from "@/controllers/submission.controller";

import {
  authenticateToken,
  authorizeRole,
  authorizeUser,
} from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  authenticateToken,
  authorizeRole("professor"),
  activityController.createActivity
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRole("professor"),
  activityController.updateActivity
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("professor"),
  activityController.deleteActivity
);

router.post(
  "/subject/:subjectId/activity/:activityId",
  authenticateToken,
  authorizeRole(["student", "proffessor"]),
  activityController.createActivity
);

router.put(
  "/subject/:subjectId/activity/:activityId/submission/:submissionId",
  authenticateToken,
  authorizeRole(["student", "proffessor"]),
  authorizeUser("submission", "submissionId"),
  submissionController.resubmit
);

router.put(
  "/subject/:subjectId/activity/:activityId/submission/:submissionId",
  authenticateToken,
  authorizeUser("submission", "submissionId"),
  submissionController.unsubmit
);

router.get(
  "/subject/:id",
  authenticateToken,
  activityController.getSubjectActivities
);

router.get(
  "/professor",
  authenticateToken,
  authorizeRole("professor"),
  activityController.getProfessorAllSubjectActivites
);

router.get(
  "/student",
  authenticateToken,
  authorizeRole("student"),
  activityController.getStudentAllSubjectActivities
);

router.get(
  "/subject/:subjectId/activity/:activityId",
  authenticateToken,
  activityController.getActivityById
);

export default router;
