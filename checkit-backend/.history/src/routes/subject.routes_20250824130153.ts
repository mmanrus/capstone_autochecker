import * as subjectControllers from "@/controllers/subject.controller";
import { authenticateToken, authorizeRole } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.post(
  "/subjects",
  authenticateToken,
  authorizeRole("professor"),
  subjectControllers.createSubject
);

router.put(
  "/subjects/:id",
  authenticateToken,
  authorizeRole("professor"),
  subjectControllers.updateSubject
);

router.delete(
  "/subjects/:id",
  authenticateToken,
  authorizeRole("proffessor"),
  subjectControllers.deleteSubject
);

router.get(
  "/subjects/assigned",
  authenticateToken,
  authorizeRole("proffessor"),
  subjectControllers.getAssignedSubjects
);

router.get(
  "/subjects/enrolled",
  authenticateToken,
  authorizeRole("student"),
  subjectControllers.getEnrolledSubjects
);

router.get(
  "/subjects/:id",
  authenticateToken,
  subjectControllers.getSubjectById
);
export default router;
